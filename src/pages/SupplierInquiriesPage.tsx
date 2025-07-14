import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ArrowLeft,
  User,
  Package,
  Calendar,
  DollarSign,
  Send
} from 'lucide-react';
import { isAuthenticated } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface InquiryUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  phone?: string;
}

interface InquiryProduct {
  _id: string;
  name: string;
  primaryImage?: string;
  category: string;
  pricing: {
    basePrice: number;
  };
}

interface SupplierInquiry {
  _id: string;
  inquiryNumber: string;
  subject: string;
  message: string;
  status: string;
  requestedQuantity: number;
  targetPrice?: number;
  customRequirements?: string;
  createdAt: string;
  lastUpdated: string;
  productId: InquiryProduct;
  userId: InquiryUser;
  supplierResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: number;
    leadTime?: number;
    validUntil?: string;
    respondedAt?: string;
  };
}

const SupplierInquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<SupplierInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<SupplierInquiry | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseForm, setResponseForm] = useState({
    message: '',
    quotedPrice: '',
    quotedQuantity: '',
    leadTime: '',
    validUntil: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/supplier-auth');
      return;
    }
    fetchInquiries();
  }, [navigate, selectedStatus]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('supplier_token');
      const queryParams = selectedStatus !== 'all' ? `?status=${selectedStatus}` : '';
      
      const response = await fetch(`${API_URL}/api/dashboard/inquiries${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const token = localStorage.getItem('supplier_token');
      
      const response = await fetch(`${API_URL}/api/dashboard/inquiries/${inquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh inquiries
      fetchInquiries();
      
      // Show success message
      alert('Inquiry status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update inquiry status');
    }
  };

  const submitResponse = async () => {
    if (!selectedInquiry) return;

    try {
      const token = localStorage.getItem('supplier_token');
      
      const response = await fetch(`${API_URL}/api/dashboard/inquiries/${selectedInquiry._id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: responseForm.message,
          quotedPrice: responseForm.quotedPrice ? parseFloat(responseForm.quotedPrice) : undefined,
          quotedQuantity: responseForm.quotedQuantity ? parseInt(responseForm.quotedQuantity) : undefined,
          leadTime: responseForm.leadTime ? parseInt(responseForm.leadTime) : undefined,
          validUntil: responseForm.validUntil || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send response');
      }

      setShowResponseModal(false);
      setResponseForm({
        message: '',
        quotedPrice: '',
        quotedQuantity: '',
        leadTime: '',
        validUntil: ''
      });
      fetchInquiries();
      
      alert('Response sent successfully!');
    } catch (err) {
      console.error('Error sending response:', err);
      alert('Failed to send response');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'quoted':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-berlin-red-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-berlin-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-berlin-red-100 text-berlin-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-berlin-gray-100 text-berlin-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-berlin-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-berlin-gray-50 py-8 my-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/supplier/dashboard')}
              className="flex items-center text-berlin-gray-600 hover:text-berlin-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-3xl font-bold text-berlin-gray-900">Customer Inquiries</h1>
          <p className="text-berlin-gray-600 mt-2">Manage and respond to customer quote requests</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-berlin-gray-700">Filter by status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-berlin-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Inquiries</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="quoted">Quoted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Inquiries List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="h-16 w-16 text-berlin-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-berlin-gray-900 mb-2">No Inquiries Found</h3>
            <p className="text-berlin-gray-500">
              {selectedStatus === 'all' 
                ? "You haven't received any customer inquiries yet."
                : `No inquiries with status "${selectedStatus}" found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inquiry) => (
              <div key={inquiry._id} className="bg-white rounded-lg shadow p-6">
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
                      <h3 className="text-lg font-semibold text-berlin-gray-900 mb-1">
                        {inquiry.productId.name}
                      </h3>
                      <p className="text-sm text-berlin-gray-600 mb-2">
                        Inquiry #{inquiry.inquiryNumber}
                      </p>
                      <div className="flex items-center text-sm text-berlin-gray-500 space-x-4">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {inquiry.userId.firstName} {inquiry.userId.lastName}
                          {inquiry.userId.companyName && ` (${inquiry.userId.companyName})`}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(inquiry.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-berlin-gray-600">Requested Quantity</p>
                    <p className="font-medium">{inquiry.requestedQuantity.toLocaleString()} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-berlin-gray-600">Target Price</p>
                    <p className="font-medium">
                      {inquiry.targetPrice ? `$${inquiry.targetPrice.toFixed(2)}` : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-berlin-gray-600">Customer Email</p>
                    <p className="font-medium">{inquiry.userId.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-berlin-gray-600 mb-2">Message</p>
                  <p className="text-berlin-gray-800 bg-berlin-gray-50 p-3 rounded-md">{inquiry.message}</p>
                </div>

                {inquiry.customRequirements && (
                  <div className="mb-4">
                    <p className="text-sm text-berlin-gray-600 mb-2">Custom Requirements</p>
                    <p className="text-berlin-gray-800 bg-berlin-gray-50 p-3 rounded-md">{inquiry.customRequirements}</p>
                  </div>
                )}

                {inquiry.supplierResponse && (
                  <div className="bg-blue-50 rounded-md p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Your Response</h4>
                    {inquiry.supplierResponse.message && (
                      <p className="text-sm text-blue-800 mb-2">{inquiry.supplierResponse.message}</p>
                    )}
                    {inquiry.supplierResponse.quotedPrice && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Quoted Price: </span>
                          <span className="font-medium">${inquiry.supplierResponse.quotedPrice.toFixed(2)}</span>
                        </div>
                        {inquiry.supplierResponse.quotedQuantity && (
                          <div>
                            <span className="text-blue-700">Quantity: </span>
                            <span className="font-medium">{inquiry.supplierResponse.quotedQuantity.toLocaleString()} units</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {inquiry.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateInquiryStatus(inquiry._id, 'reviewed')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                      >
                        Mark as Reviewed
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setShowResponseModal(true);
                        }}
                        className="bg-berlin-red-600 text-white px-4 py-2 rounded-md hover:bg-berlin-red-700 text-sm flex items-center"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Quote
                      </button>
                    </>
                  )}
                  
                  {inquiry.status === 'reviewed' && (
                    <button
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setShowResponseModal(true);
                      }}
                      className="bg-berlin-red-600 text-white px-4 py-2 rounded-md hover:bg-berlin-red-700 text-sm flex items-center"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send Quote
                    </button>
                  )}
                  
                  {inquiry.status === 'quoted' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id, 'accepted')}
                      className="bg-berlin-red-600 text-white px-4 py-2 rounded-md hover:bg-berlin-red-700 text-sm"
                    >
                      Mark as Complete
                    </button>
                  )}
                  
                  {['pending', 'reviewed'].includes(inquiry.status) && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id, 'rejected')}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold text-berlin-gray-900 mb-4">
                Send Quote Response
              </h3>
              <p className="text-berlin-gray-600 mb-6">
                Responding to inquiry for: {selectedInquiry.productId.name}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-berlin-gray-700 mb-2">
                    Response Message *
                  </label>
                  <textarea
                    value={responseForm.message}
                    onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                    rows={4}
                    className="w-full border border-berlin-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter your response message..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-berlin-gray-700 mb-2">
                      Quoted Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={responseForm.quotedPrice}
                      onChange={(e) => setResponseForm({ ...responseForm, quotedPrice: e.target.value })}
                      className="w-full border border-berlin-gray-300 rounded-md px-3 py-2"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-berlin-gray-700 mb-2">
                      Quoted Quantity
                    </label>
                    <input
                      type="number"
                      value={responseForm.quotedQuantity}
                      onChange={(e) => setResponseForm({ ...responseForm, quotedQuantity: e.target.value })}
                      className="w-full border border-berlin-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-berlin-gray-700 mb-2">
                      Lead Time (days)
                    </label>
                    <input
                      type="number"
                      value={responseForm.leadTime}
                      onChange={(e) => setResponseForm({ ...responseForm, leadTime: e.target.value })}
                      className="w-full border border-berlin-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter lead time"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-berlin-gray-700 mb-2">
                      Quote Valid Until
                    </label>
                    <input
                      type="date"
                      value={responseForm.validUntil}
                      onChange={(e) => setResponseForm({ ...responseForm, validUntil: e.target.value })}
                      className="w-full border border-berlin-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 border border-berlin-gray-300 rounded-md text-berlin-gray-700 hover:bg-berlin-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  disabled={!responseForm.message.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierInquiriesPage;
