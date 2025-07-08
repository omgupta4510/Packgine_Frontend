import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types for user authentication
export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  companyType?: 'individual' | 'small_business' | 'enterprise';
  industry?: string;
  address?: {
    country: string;
    city?: string;
    state?: string;
  };
}

export interface UserAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    companyName?: string;
    companyType?: string;
    status: string;
    plan: string;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  companyType?: string;
  industry?: string;
  address?: {
    country: string;
    city?: string;
    state?: string;
  };
  preferences: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
    sustainabilityPreferences: {
      ecoScoreMinimum: number;
      prioritizeRecycled: boolean;
      prioritizeBiodegradable: boolean;
    };
  };
  status: string;
  plan: string;
  createdAt: string;
  lastLogin?: string;
}

// Token management
const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

export const setUserToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUserToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeUserToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setUserData = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserData = (): any | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Create axios instance with auth headers for users
const createUserAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeUserToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const userAuthApi = createUserAuthAxios();

// User Auth API functions
export const userAuthService = {
  // Register new user
  register: async (data: UserRegisterData): Promise<UserAuthResponse> => {
    const response = await axios.post(`${API_URL}/api/user/register`, data);
    return response.data;
  },

  // Login user
  login: async (data: UserLoginData): Promise<UserAuthResponse> => {
    const response = await axios.post(`${API_URL}/api/user/login`, data);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await userAuthApi.get('/api/user/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<{ message: string; user: User }> => {
    const response = await userAuthApi.put('/api/user/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await userAuthApi.post('/api/user/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<{ valid: boolean; user: User }> => {
    const response = await userAuthApi.get('/api/user/verify-token');
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await userAuthApi.post('/api/user/logout');
    removeUserToken();
    return response.data;
  },
};

// User auth state management
export const isUserAuthenticated = (): boolean => {
  return !!getUserToken();
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!isUserAuthenticated()) {
      return null;
    }
    const user = await userAuthService.getProfile();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    removeUserToken();
    return null;
  }
};

// Convenience functions for login/register
export const loginUser = async (email: string, password: string): Promise<UserAuthResponse> => {
  const response = await userAuthService.login({ email, password });
  if (response.token) {
    setUserToken(response.token);
    setUserData(response.user);
    // Dispatch event to update header
    window.dispatchEvent(new Event('authStateChanged'));
  }
  return response;
};

export const registerUser = async (data: UserRegisterData): Promise<UserAuthResponse> => {
  const response = await userAuthService.register(data);
  if (response.token) {
    setUserToken(response.token);
    setUserData(response.user);
    // Dispatch event to update header
    window.dispatchEvent(new Event('authStateChanged'));
  }
  return response;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await userAuthService.logout();
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    removeUserToken();
    // Dispatch event to update header
    window.dispatchEvent(new Event('authStateChanged'));
  }
};
