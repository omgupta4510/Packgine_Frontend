import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, Product, getStatusColor } from '../utils/dashboard';
import { isAuthenticated } from '../utils/auth';
import { Plus, Edit, Trash2, Eye, Package, Calendar, ArrowLeft } from 'lucide-react';

const SupplierProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      navigate('/supplier-auth');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getProducts();
      setProducts(response.products);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleteLoading(productId);
      await dashboardService.deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }
  console.log(products);
  
  return (
    <div className="min-h-screen bg-gray-50 my-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/supplier/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your product listings ({products.length} total)
              </p>
            </div>
            <button
              onClick={() => navigate('/supplier/products/add')}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to showcase your offerings.</p>
            <button
              onClick={() => navigate('/supplier/products/add')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="aspect-video bg-gray-200 relative">
                  {product.primaryImage ? (
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-semibold">
                    {product.ecoScore || 0}/100
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600">{formatPrice(product.pricing?.basePrice || 0)}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category || 'Unknown'}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Stock: {product.specifications?.availableQuantity || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(product.createdAt)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/supplier/products/edit/${product._id}`)}
                      className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={deleteLoading === product._id}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                    >
                      {deleteLoading === product._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierProductsPage;
