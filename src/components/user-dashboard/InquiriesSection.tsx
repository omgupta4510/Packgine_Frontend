import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserToken } from '../../utils/userAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Inquiry {
  _id: string;
  inquiryNumber: string;
  subject: string;
  message: string;
  status: string;
  requestedQuantity: number;
  createdAt: string;
  productId: {
    _id: string;
    name: string;
    primaryImage?: string;
    category: string;
    pricing: {
      basePrice: number;
    };
  };
  supplierId: {
    companyName: string;
  };
  supplierResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: number;
    leadTime?: number;
    validUntil?: string;
    respondedAt?: string;
  };
}

interface InquiriesSectionProps {
  onInquiryChange?: () => void;
}

export const InquiriesSection = ({ onInquiryChange }: InquiriesSectionProps = {}) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    // Notify parent component when inquiries are updated
    if (onInquiryChange && !loading && !error) {
      onInquiryChange();
    }
  }, [inquiries, onInquiryChange, loading, error]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = getUserToken();
      
      if (!token) {
        setError('Please log in to view inquiries');
        return;
      }

      const response = await fetch(`${API_URL}/api/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
      // console.log(data);
      
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewed':
      case 'quoted':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading inquiries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
        <p className="text-gray-500 mb-4">You haven't made any quote requests yet.</p>
        <a 
          href="/products" 
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Package className="h-4 w-4 mr-2" />
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Inquiries</h2>
        <div className="flex items-center space-x-2">
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {inquiries.length} {inquiries.length === 1 ? 'Inquiry' : 'Inquiries'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                {inquiry.productId.primaryImage && (
                  <img
                    src={inquiry.productId.primaryImage}
                    alt={inquiry.productId.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {inquiry.productId.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Inquiry #{inquiry.inquiryNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supplier: {inquiry.supplierId.companyName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(inquiry.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                  {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Requested Quantity</p>
                <p className="font-medium">{inquiry.requestedQuantity.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {inquiry.supplierResponse && (
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Supplier Response</h4>
                  {inquiry.supplierResponse.validUntil && 
                   new Date(inquiry.supplierResponse.validUntil) < new Date() && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Quote Expired
                    </span>
                  )}
                </div>
                {inquiry.supplierResponse.message && (
                  <p className="text-sm text-gray-700 mb-2">{inquiry.supplierResponse.message}</p>
                )}
                {inquiry.supplierResponse.quotedPrice && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quoted Price: </span>
                      <span className="font-medium">${inquiry.supplierResponse.quotedPrice.toFixed(2)}</span>
                    </div>
                    {inquiry.supplierResponse.quotedQuantity && (
                      <div>
                        <span className="text-gray-600">Quantity: </span>
                        <span className="font-medium">{inquiry.supplierResponse.quotedQuantity.toLocaleString()} units</span>
                      </div>
                    )}
                    {inquiry.supplierResponse.leadTime && (
                      <div>
                        <span className="text-gray-600">Lead Time: </span>
                        <span className="font-medium">{inquiry.supplierResponse.leadTime} days</span>
                      </div>
                    )}
                    {inquiry.supplierResponse.validUntil && (
                      <div>
                        <span className="text-gray-600">Valid Until: </span>
                        <span className={`font-medium ${
                          new Date(inquiry.supplierResponse.validUntil) < new Date() 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {new Date(inquiry.supplierResponse.validUntil).toLocaleDateString()}
                          {new Date(inquiry.supplierResponse.validUntil) < new Date() && (
                            <span className="text-red-500 ml-1">(Expired)</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate max-w-md">
                {inquiry.subject}
              </p>
              <Link 
                to={`/products/${inquiry.productId._id}`}
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors justify-center space-x-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
