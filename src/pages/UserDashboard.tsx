import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  MessageSquare, 
  Settings, 
  Search,
  Package,
  Calendar,
  Plus,
  Eye,
  Filter,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Building2,
  LogOut,
  Edit,
  Lock,
  Download
} from 'lucide-react';
import { getUserToken, logoutUser, isUserAuthenticated } from '../utils/userAuth';
import { removeFromFavorites } from '../utils/favorites';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DashboardStats {
  totalInquiries: number;
  totalFavorites: number;
  totalOrders: number;
  pendingQuotes: number;
}

interface UserData {
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

export const UserDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalFavorites: 0,
    totalOrders: 0,
    pendingQuotes: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'inquiries' | 'orders' | 'profile' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Listen for favorites changes
    const handleFavoritesChanged = () => {
      fetchUserData();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChanged);
    return () => window.removeEventListener('favoritesChanged', handleFavoritesChanged);
  }, []);

  const fetchUserData = async () => {
    try {
      const token = getUserToken();
      if (!token || !isUserAuthenticated()) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
      
      // Calculate stats
      setStats({
        totalInquiries: data.user.inquiries?.length || 0,
        totalFavorites: data.user.favorites?.length || 0,
        totalOrders: data.user.analytics?.totalOrders || 0,
        pendingQuotes: 0 // This would come from actual quotes API
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFromFavorites(productId);
      // Refresh user data to update the favorites list
      await fetchUserData();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load user data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
            <p className="text-green-100 mt-1">
              Last login: {new Date(user.lastLogin).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-3">
              <Calendar className="h-6 w-6 mb-1" />
              <p className="text-sm">Member since</p>
              <p className="font-semibold">{new Date(user.createdAt).getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>


      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Favorites */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Favorites</h3>
            <Link to="#" onClick={() => setActiveTab('favorites')} className="text-green-600 hover:text-green-500 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {user.favorites?.slice(0, 3).map((favorite) => (
              <div key={favorite.productId._id} className="flex items-center space-x-3">
                <img 
                  src={favorite.productId.primaryImage || '/Images/image1.png'} 
                  alt={favorite.productId.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{favorite.productId.name}</p>
                  <p className="text-sm text-gray-500">
                    {favorite.productId.pricing.currency} {favorite.productId.pricing.basePrice}
                  </p>
                </div>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
            {user.favorites?.length === 0 && (
              <p className="text-gray-500 text-sm">No favorites yet</p>
            )}
          </div>
        </div>

        {/* Recent Search History */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
            <Link to="/products" className="text-green-600 hover:text-green-500 text-sm font-medium">
              Browse products
            </Link>
          </div>
          <div className="space-y-3">
            {user.analytics?.searchHistory?.slice(0, 3).map((search, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{search.query}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(search.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!user.analytics?.searchHistory || user.analytics.searchHistory.length === 0) && (
              <p className="text-gray-500 text-sm">No recent searches</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="border border-gray-300 rounded-lg flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50 transition-colors">
            <Search className="h-6 w-6" />
            <span className="text-sm">Browse Products</span>
          </button>
          <button className="border border-gray-300 rounded-lg flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50 transition-colors">
            <Plus className="h-6 w-6" />
            <span className="text-sm">Request Quote</span>
          </button>
          <button className="border border-gray-300 rounded-lg flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50 transition-colors">
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm">Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Favorites</h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {user.favorites && user.favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.favorites.map((favorite) => (
            <div key={favorite.productId._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative">
              {/* Remove favorite button */}
              <button
                onClick={() => handleRemoveFavorite(favorite.productId._id)}
                className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors group"
                title="Remove from favorites"
              >
                <Heart size={16} className="text-red-500 fill-red-500 group-hover:text-red-600" />
              </button>
              
              <img 
                src={favorite.productId.primaryImage || '/Images/image1.png'} 
                alt={favorite.productId.name}
                className="h-48 w-full rounded-lg object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">{favorite.productId.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-green-600">
                  {favorite.productId.pricing.currency} {favorite.productId.pricing.basePrice}
                </span>
                <span className="text-sm text-gray-500">
                  Added {new Date(favorite.addedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link 
                  to={`/products/${favorite.productId._id}`}
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Inquire</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">Start browsing products to add them to your favorites</p>
          <Link 
            to="/products"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-green-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-gray-500 mb-2">{user.email}</p>
            <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {user.plan} Plan
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-sm text-gray-900">{user.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="space-y-4">
            {user.companyName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{user.companyName}</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
              <p className="text-sm text-gray-900 capitalize">{user.companyType.replace('_', ' ')}</p>
            </div>
            {user.industry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <p className="text-sm text-gray-900">{user.industry}</p>
              </div>
            )}
            {user.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {[user.address.city, user.address.state, user.address.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={user.preferences?.notifications?.email}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">New Products</label>
                <p className="text-sm text-gray-500">Get notified about new products</p>
              </div>
              <input
                type="checkbox"
                checked={user.preferences?.notifications?.newProducts}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Price Alerts</label>
                <p className="text-sm text-gray-500">Get notified about price changes</p>
              </div>
              <input
                type="checkbox"
                checked={user.preferences?.notifications?.priceAlerts}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-start space-x-2">
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-start space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Data</span>
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-start space-x-2 text-red-600">
              <LogOut className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.firstName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'overview' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'favorites' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                  {stats.totalFavorites}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'inquiries' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Inquiries</span>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                  {stats.totalInquiries}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'orders' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Orders</span>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                  {stats.totalOrders}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'profile' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'settings' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-start space-x-2 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'favorites' && renderFavorites()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'inquiries' && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Inquiries</h3>
                <p className="text-gray-500">This section will show your product inquiries and quotes</p>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
                <p className="text-gray-500">This section will show your order history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
