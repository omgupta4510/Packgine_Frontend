// src/utils/dashboard.ts
import axios from 'axios';
import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  broaderCategory: string;
  category: string;
  subcategory?: string;
  images: string[];
  primaryImage?: string;
  specifications: {
    material: string;
    capacity: {
      value: number;
      unit: string;
    };
    dimensions?: {
      height?: number;
      width?: number;
      depth?: number;
      unit: string;
    };
    weight?: {
      value: number;
      unit: string;
    };
    color?: string;
    finish?: string;
    minimumOrderQuantity: number;
    availableQuantity?: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    priceBreaks?: Array<{
      minQuantity: number;
      price: number;
    }>;
    customizationCosts?: {
      printing?: number;
      labeling?: number;
      packaging?: number;
    };
  };
  ecoScore: number;
  ecoScoreDetails?: {
    recyclability?: number;
    carbonFootprint?: number;
    sustainableMaterials?: number;
    localSourcing?: number;
  };
  sustainability?: {
    recycledContent?: number;
    biodegradable?: boolean;
    compostable?: boolean;
    refillable?: boolean;
    sustainableSourcing?: boolean;
    carbonNeutral?: boolean;
  };
  certifications?: Array<{
    name: string;
    certificationBody?: string;
    validUntil?: string;
    certificateNumber?: string;
  }>;
  customization?: {
    printingAvailable?: boolean;
    labelingAvailable?: boolean;
    colorOptions?: string[];
    printingMethods?: string[];
    customSizes?: boolean;
  };
  leadTime?: {
    standard?: number;
    custom?: number;
    rush?: number;
  };
  availability?: {
    inStock?: boolean;
    estimatedRestockDate?: string;
    discontinuing?: boolean;
  };
  reviews?: Array<{
    rating: number;
    comment?: string;
    reviewerName?: string;
    reviewDate: string;
    verified?: boolean;
  }>;
  averageRating: number;
  totalReviews: number;
  supplier: string;
  filters?: any;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  featured?: boolean;
  trending?: boolean;
  views: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  approvedProducts: number;
  pendingProducts: number;
  rejectedProducts: number;
  totalViews: number;
  totalInquiries: number;
  newInquiries?: number;
  pendingInquiries?: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentProducts: Product[];
  topProducts: Product[];
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProductAnalytics {
  statusStats: Array<{ _id: string; count: number }>;
  categoryStats: Array<{
    _id: string;
    count: number;
    totalViews: number;
    totalInquiries: number;
  }>;
  monthlyStats: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
}

export interface CreateProductData {
  name: string;
  description: string;
  broaderCategory: string;
  category: string;
  subcategory?: string;
  images?: string[];
  primaryImage?: string;
  specifications: {
    material: string;
    capacity?: {
      value: number;
      unit: string;
    };
    dimensions?: {
      height?: number;
      width?: number;
      depth?: number;
      unit: string;
    };
    weight?: {
      value: number;
      unit: string;
    };
    color?: string;
    finish?: string;
    minimumOrderQuantity: number;
    availableQuantity?: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    priceBreaks?: Array<{
      minQuantity: number;
      price: number;
    }>;
  };
  ecoScore?: number;
  sustainability?: {
    recycledContent?: number;
    biodegradable?: boolean;
    compostable?: boolean;
    refillable?: boolean;
  };
  certifications?: Array<{
    name: string;
    certificationBody?: string;
    validUntil?: string;
    certificateNumber?: string;
  }>;
  customization?: {
    printingAvailable?: boolean;
    labelingAvailable?: boolean;
    colorOptions?: string[];
    printingMethods?: string[];
    customSizes?: boolean;
  };
  leadTime?: {
    standard?: number;
    custom?: number;
    rush?: number;
  };
  availability?: {
    inStock?: boolean;
    estimatedRestockDate?: string;
  };
}

// Create axios instance with auth header
const createDashboardApi = () => {
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
        window.location.href = '/supplier-auth';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const dashboardApi = createDashboardApi();

// Dashboard API functions
export const dashboardService = {
  // Get dashboard overview
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await dashboardApi.get('/api/dashboard/overview');
    return response.data;
  },

  // Get supplier's products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const response = await dashboardApi.get(`/api/dashboard/products?${queryParams}`);
    return response.data;
  },

  // Create new product
  createProduct: async (data: CreateProductData): Promise<{ message: string; product: Product }> => {
    const response = await dashboardApi.post('/api/dashboard/products', data);
    return response.data;
  },

  // Get single product for editing
  getProduct: async (id: string): Promise<Product> => {
    const response = await dashboardApi.get(`/api/dashboard/products/${id}`);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<{ message: string; product: Product }> => {
    const response = await dashboardApi.put(`/api/dashboard/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await dashboardApi.delete(`/api/dashboard/products/${id}`);
    return response.data;
  },

  // Get product analytics
  getAnalytics: async (): Promise<ProductAnalytics> => {
    const response = await dashboardApi.get('/api/dashboard/analytics/products');
    return response.data;
  },
};

// Helper functions
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    case 'draft':
      return 'text-gray-600 bg-gray-100';
    case 'archived':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
