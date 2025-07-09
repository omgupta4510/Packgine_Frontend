import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Search,
  Package,
  Calendar,
  Plus,
  Eye
} from 'lucide-react';
import { UserData, DashboardStats } from './types';

interface OverviewSectionProps {
  user: UserData;
  stats: DashboardStats;
  setActiveTab: (tab: 'overview' | 'favorites' | 'inquiries' | 'orders' | 'profile' | 'settings') => void;
}

export const OverviewSection = ({ user, stats, setActiveTab }: OverviewSectionProps) => {
  return (
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

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingQuotes}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
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
            <button 
              onClick={() => setActiveTab('favorites')} 
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              View all
            </button>
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
                    <Link 
                    to={`/products/${favorite.productId._id}`}
                        >
                    <Eye className="h-4 w-4" />
                    </Link>
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
          <Link 
            to="/products" 
            className="border border-gray-300 rounded-lg flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50 transition-colors"
          >
            <Search className="h-6 w-6" />
            <span className="text-sm">Browse Products</span>
          </Link>
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
};
