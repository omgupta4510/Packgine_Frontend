// src/utils/auth.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export interface Supplier {
  _id: string;
  email: string;
  username: string;
  companyName: string;
  companyDescription?: string;
  companyLogo?: string;
  address?: {
    country?: string;
    city?: string;
    state?: string;
  };
  accountStatus: 'pending' | 'verified' | 'approved' | 'suspended' | 'banned';
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
    businessVerified: boolean;
    documentsVerified: boolean;
  };
  categories?: string[];
  averageRating?: number;
  totalReviews?: number;
  stats?: {
    totalProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
    responseTime?: number;
    onTimeDelivery?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  supplier: Supplier;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  companyName: string;
  companyDescription?: string;
  contactInfo?: {
    primaryContact?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  address?: {
    country?: string;
    city?: string;
    state?: string;
  };
  categories?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

// Token management
const TOKEN_KEY = 'supplier_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('authStateChanged'));
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('authStateChanged'));
};

// Create axios instance with auth header
const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests automatically
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle token expiration
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeToken();
        window.location.href = '/supplier-auth';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const authApi = createAuthAxios();

// Auth API functions
export const authService = {
  // Register new supplier
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/supplier/auth/register`, data);
    return response.data;
  },

  // Login supplier
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/supplier/auth/login`, data);
    return response.data;
  },

  // Get supplier profile
  getProfile: async (): Promise<Supplier> => {
    const response = await authApi.get('/api/supplier/auth/profile');
    return response.data;
  },

  // Update supplier profile
  updateProfile: async (data: Partial<Supplier>): Promise<{ message: string; supplier: Supplier }> => {
    const response = await authApi.put('/api/supplier/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await authApi.post('/api/supplier/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<{ valid: boolean; supplier: Supplier }> => {
    const response = await authApi.get('/api/supplier/auth/verify-token');
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await authApi.post('/api/supplier/auth/logout');
    removeToken();
    return response.data;
  },
};

// Auth state management
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getCurrentSupplier = async (): Promise<Supplier | null> => {
  if (!isAuthenticated()) return null;
  
  try {
    const response = await authService.verifyToken();
    return response.valid ? response.supplier : null;
  } catch (error) {
    removeToken();
    return null;
  }
};

// Login helper
export const loginSupplier = async (email: string, password: string): Promise<Supplier> => {
  const response = await authService.login({ email, password });
  setToken(response.token);
  return response.supplier;
};

// Register helper
export const registerSupplier = async (data: RegisterData): Promise<Supplier> => {
  const response = await authService.register(data);
  setToken(response.token);
  return response.supplier;
};

// Logout helper
export const logoutSupplier = async (): Promise<void> => {
  try {
    await authService.logout();
  } catch (error) {
    // Even if the API call fails, we still remove the token locally
    console.error('Logout error:', error);
  } finally {
    removeToken();
    window.location.href = '/';
  }
};
