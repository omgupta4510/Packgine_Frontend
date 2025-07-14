import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserToken, logoutUser, isUserAuthenticated } from '../utils/userAuth';
import { removeFromFavorites } from '../utils/favorites';
import {
  OverviewSection,
  FavoritesSection,
  ProfileSection,
  SettingsSection,
  InquiriesSection,
  OrdersSection,
  Sidebar,
  Loading,
  ErrorDisplay,
  UserData,
  DashboardStats,
  TabType
} from '../components/user-dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const UserDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalFavorites: 0,
    totalOrders: 0,
    pendingQuotes: 0
  });
  const [activeTab, setActiveTab] = useState<TabType>('overview');
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
      
      // Use inquiry stats from backend
      setStats({
        totalInquiries: data.user.inquiryStats?.totalInquiries || 0,
        totalFavorites: data.user.favorites?.length || 0,
        totalOrders: data.user.analytics?.totalOrders || 0,
        pendingQuotes: data.user.inquiryStats?.pendingQuotes || 0
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Refresh stats when switching to inquiries tab
    if (tab === 'inquiries') {
      fetchUserData();
    }
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
    return <Loading />;
  }

  if (error || !user) {
    return <ErrorDisplay error={error || 'Unable to load user data'} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="pt-20 min-h-screen bg-berlin-gray-50">
      <div className="berlin-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar 
            user={user}
            stats={stats}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <OverviewSection 
                user={user}
                stats={stats}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'favorites' && (
              <FavoritesSection 
                user={user}
                onRemoveFavorite={handleRemoveFavorite}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileSection user={user} />
            )}
            {activeTab === 'settings' && (
              <SettingsSection user={user} />
            )}
            {activeTab === 'inquiries' && (
              <InquiriesSection onInquiryChange={fetchUserData} />
            )}
            {activeTab === 'orders' && <OrdersSection />}
          </div>
        </div>
      </div>
    </div>
  );
};
