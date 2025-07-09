export interface DashboardStats {
  totalInquiries: number;
  totalFavorites: number;
  totalOrders: number;
  pendingQuotes: number;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  phone?: string;
  companyName?: string;
  companyType: string;
  industry?: string;
  address: {
    country?: string;
    city?: string;
    state?: string;
  };
  profileImage?: string;
  preferences: {
    sustainabilityFocus: boolean;
    preferredCategories: string[];
    notifications: {
      email: boolean;
      newProducts: boolean;
      priceAlerts: boolean;
      orderUpdates: boolean;
    };
  };
  favorites: Array<{
    productId: {
      _id: string;
      name: string;
      primaryImage?: string;
      pricing: {
        basePrice: number;
        currency: string;
      };
    };
    addedAt: string;
  }>;
  status: string;
  plan: string;
  lastLogin: string;
  analytics: {
    totalOrders: number;
    totalSpent: number;
    searchHistory: Array<{
      query: string;
      timestamp: string;
    }>;
    viewedProducts: Array<{
      productId: {
        _id: string;
        name: string;
        primaryImage?: string;
      };
      viewedAt: string;
    }>;
  };
  createdAt: string;
}

export type TabType = 'overview' | 'favorites' | 'inquiries' | 'orders' | 'profile' | 'settings';
