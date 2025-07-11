import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentSupplier, 
  isAuthenticated,
  Supplier 
} from '../utils/auth';
import { 
  dashboardService, 
  DashboardOverview,
  getStatusColor,
  formatDate 
} from '../utils/dashboard';
import { 
  BarChart3, 
  Package, 
  Eye, 
  MessageCircle, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const SupplierDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/supplier-auth');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [supplierData, overview] = await Promise.all([
          getCurrentSupplier(),
          dashboardService.getOverview()
        ]);

        setSupplier(supplierData);
        setDashboardData(overview);
      } catch (err: any) {
        console.error('Dashboard loading error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center my-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 my-10">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {supplier?.companyName}
              </h1>
              <p className="text-gray-600">Manage your products and view performance</p>
            </div>
            
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats.totalProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats.approvedProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats.totalViews || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats.newInquiries || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats.pendingInquiries || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate('/supplier/products/add')}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </button>
          <button
            onClick={() => navigate('/supplier/products')}
            className="flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            <Package className="h-5 w-5 mr-2" />
            Manage Products
          </button>
          <button
            onClick={() => navigate('/supplier/analytics')}
            className="flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            View Analytics
          </button>
          <button
            onClick={() => navigate('/supplier/inquiries')}
            className="flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Manage Inquiries
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
              <button
                onClick={() => navigate('/supplier/products')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              {dashboardData?.recentProducts && dashboardData.recentProducts.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentProducts.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        {product.primaryImage && (
                          <img
                            src={product.primaryImage}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-md mr-4"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-xs text-gray-500">
                            Created {formatDate(product.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                        <button
                          onClick={() => navigate(`/supplier/products/edit/${product._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  {dashboardData.recentProducts.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => navigate('/supplier/products')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View {dashboardData.recentProducts.length - 5} more products
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No products yet</p>
                  <button
                    onClick={() => navigate('/supplier/products/add')}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add your first product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
            </div>
            <div className="p-6">
              {dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.topProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        {product.primaryImage && (
                          <img
                            src={product.primaryImage}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-md mr-4"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {product.views} views
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {product.inquiries} inquiries
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <button
                          onClick={() => navigate(`/supplier/products/edit/${product._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No performance data yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add products to start tracking performance
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Product Status Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {dashboardData?.stats.pendingProducts || 0}
                </h3>
                <p className="text-gray-600">Pending Approval</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {dashboardData?.stats.approvedProducts || 0}
                </h3>
                <p className="text-gray-600">Approved & Live</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {dashboardData?.stats.rejectedProducts || 0}
                </h3>
                <p className="text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Alert */}
        {supplier?.accountStatus !== 'approved' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Status: {supplier?.accountStatus || 'Unknown'}
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {supplier?.accountStatus === 'pending' && 
                    'Your account is pending approval. Some features may be limited until verification is complete.'
                  }
                  {supplier?.accountStatus === 'verified' && 
                    'Your account is verified but awaiting final approval to access all features.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboardPage;
