import { User, Heart, MessageSquare, Settings, Package, BarChart3, LogOut } from 'lucide-react';
import { UserData, DashboardStats, TabType } from './types';

interface SidebarProps {
  user: UserData;
  stats: DashboardStats;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => Promise<void>;
}

export const Sidebar = ({ user, stats, activeTab, setActiveTab, onLogout }: SidebarProps) => {
  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* <div className="flex items-center space-x-3 mb-6">
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
      </div> */}

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
          onClick={onLogout}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-start space-x-2 text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
