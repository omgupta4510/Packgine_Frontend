import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SustainabilityScore } from '../components/ui/SustainabilityScore';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { isUserAuthenticated, getUserToken } from '../utils/userAuth';
import { 
  ChevronRight, 
  ChevronLeft,
  Leaf, 
  Droplets, 
  Recycle, 
  ThumbsUp, 
  Package, 
  Download,
  Share2,
  Info,
  Star,
  MessageSquare
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types based on the backend schema and expected structure
interface ProductData {
  _id: string;
  name: string;
  description: string;
  images: string[];
  primaryImage?: string;
  broaderCategory: string;
  category: string;
  subcategory?: string;
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
      unit?: string;
    };
    weight?: {
      value: number;
      unit: string;
    };
    color?: string;
    finish?: string;
    closure?: string;
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
  ecoScore: number;
  sustainability: {
    recycledContent?: number;
    biodegradable?: boolean;
    compostable?: boolean;
    refillable?: boolean;
    sustainableSourcing?: boolean;
    carbonNeutral?: boolean;
  };
  certifications: Array<{
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
  features?: string[];
  // Filter fields for multiple materials and locations
  categoryFilters?: any;
  commonFilters?: any;
  supplier: {
    _id: string;
    companyName: string;
    companyDescription?: string;
    companyLogo?: string;
    address: {
      country: string;
      city?: string;
      state?: string;
    };
    contactInfo?: {
      email: string;
      phone?: string;
    };
    certifications?: string[];
    averageRating?: number;
    totalReviews?: number;
  };
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  status: string;
}

// Helper function to extract materials from filters
const getMaterials = (product: ProductData): string[] => {
  const materials: string[] = [];
  
  // Add materials from common filters  
  if (product.commonFilters[0].Material) {
    const commonMaterials = Array.isArray(product.commonFilters[0].Material)
      ? product.commonFilters[0].Material
      : [product.commonFilters.Material];
    materials.push(...commonMaterials);
  }
  
  // Remove duplicates and filter out empty values
  return [...new Set(materials)].filter(material => material && material.trim() !== '');
};

// Helper function to get location from filters
const getLocation = (product: ProductData): string => {
  
  // Try to get from common filters
  if (product.commonFilters[0].Location) {
    const locations = Array.isArray(product.commonFilters[0].Location)
      ? product.commonFilters[0].Location
      : [product.commonFilters[0].Location];
    return locations[0] || 'Location not specified';
  }
  
  return 'Location not specified';
};


export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'sustainability'>('overview');
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleRequestQuote = async () => {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      navigate('/login');
      return;
    }

    setShowQuoteModal(true);
  };

  const submitQuoteRequest = async () => {
    if (!product || !id) return;

    try {
      setQuoteLoading(true);
      const token = getUserToken();
      
      const response = await fetch(`${API_URL}/api/products/${id}/quote-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          subject: `Quote Request for ${product.name}`,
          message: `I am interested in getting a quote for ${product.name}. Please provide pricing details and availability.`,
          requestedQuantity: product.specifications.minimumOrderQuantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send quote request');
      }

      setQuoteSuccess(true);
      setShowQuoteModal(false);
      
      // Show success message
      setTimeout(() => {
        setQuoteSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Quote request error:', err);
      alert('Failed to send quote request. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

// console.log(product.commonFilters[0].Location[0]);
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-green-600">Home</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <a href="/products" className="hover:text-green-600">Products</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden group">
                <img 
                  src={product.images[selectedImage] || product.primaryImage || '/Images/image1.png'} 
                  alt={product.name}
                  className="w-full h-90 object-contain" 
                />
                
                {/* Navigation Buttons */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images && product.images.length > 0 ? product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`relative border-2 rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-20 h-20 object-cover" 
                    />
                  </button>
                )) : (
                  <div className="text-gray-500 text-sm">No additional images</div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">
                    By <a href="#" className="text-green-600 hover:underline">{product.supplier.companyName}</a>
                  </p>
                </div>
                <SustainabilityScore score={product.ecoScore} size="lg" />
              </div>

              <div className="mb-6">
                {getMaterials(product).map((material, index) => (
                  <div key={index} className="inline-flex items-center bg-green-50 text-green-800 py-1 px-2 rounded text-sm mr-2 mb-2">
                    <Leaf className="h-4 w-4 mr-1" />
                    {material}
                  </div>
                ))}
                <div className="inline-flex items-center bg-green-50 text-green-800 py-1 px-2 rounded text-sm mr-2 mb-2">
                  <Leaf className="h-4 w-4 mr-1" />
                  Made in {getLocation(product)}
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {product.description}
              </p>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {product.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <ThumbsUp className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  )) || <li className="text-gray-500">No features listed</li>}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">Minimum Order: <strong>{product.specifications.minimumOrderQuantity.toLocaleString()} units</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      ${product.pricing.basePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">per piece</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 ">
                  <Button variant="primary" size="lg" className='flex-1' onClick={handleRequestQuote}>
                    Request Quote
                  </Button>
                  <Button variant="secondary" size="lg" className="flex-1">
                    Request Sample
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" /> Spec Sheet
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                  <div className="flex items-center">
                    <FavoriteButton 
                      productId={id || ''} 
                      className="ml-2"
                      showLoginMessage={true}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.averageRating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-blue-500" />
                  Verified supplier with {product.totalReviews}+ successful transactions
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'sustainability'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('sustainability')}
              >
                Sustainability
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
                  <p className="text-gray-700 mb-6">
                    {product.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3">About the Supplier</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="font-medium">{product.supplier.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{getLocation(product)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium">{product.supplier.contactInfo?.email || 'Contact via platform'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-medium">{product.supplier.averageRating?.toFixed(1) || 'N/A'}/5</p>
                      </div>
                    </div>
                    {product.supplier.companyDescription && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">About</p>
                        <p className="text-sm text-gray-700">{product.supplier.companyDescription}</p>
                      </div>
                    )}
                    {product.supplier.certifications && product.supplier.certifications.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Certifications</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {product.supplier.certifications.map((cert: string, index: number) => (
                            <span key={index} className="bg-green-50 text-green-700 px-2 py-1 text-xs rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                  
                  <div className="overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        {product.specifications.dimensions && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Dimensions</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {product.specifications.dimensions.height && product.specifications.dimensions.width && product.specifications.dimensions.depth
                                ? `${product.specifications.dimensions.height}x${product.specifications.dimensions.width}x${product.specifications.dimensions.depth} ${product.specifications.dimensions.unit || 'mm'}`
                                : 'Contact supplier for dimensions'
                              }
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Material</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {getMaterials(product).join(', ') || 'Material not specified'}
                          </td>
                        </tr>
                        {product.specifications.capacity && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Capacity</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.capacity.value} {product.specifications.capacity.unit}</td>
                          </tr>
                        )}
                        {product.specifications.weight && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Weight</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.weight.value} {product.specifications.weight.unit}</td>
                          </tr>
                        )}
                        {product.specifications.color && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Color</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.color}</td>
                          </tr>
                        )}
                        {product.specifications.finish && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Finish</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.finish}</td>
                          </tr>
                        )}
                        {product.specifications.closure && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Closure</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.closure}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Minimum Order Quantity</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.minimumOrderQuantity.toLocaleString()} units</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Price per Piece</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="font-semibold text-green-600">${product.pricing.basePrice.toFixed(2)}</span>
                            <span className="text-gray-500 ml-1">({product.pricing.currency})</span>
                          </td>
                        </tr>
                        {product.specifications.availableQuantity && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Available Quantity</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.availableQuantity.toLocaleString()} units</td>
                          </tr>
                        )}
                        {product.leadTime && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Lead Time</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {product.leadTime.standard && `Standard: ${product.leadTime.standard} days`}
                              {product.leadTime.custom && ` | Custom: ${product.leadTime.custom} days`}
                              {product.leadTime.rush && ` | Rush: ${product.leadTime.rush} days`}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {product.certifications && product.certifications.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">Certifications</h3>
                      <div className="flex flex-wrap gap-3">
                        {product.certifications.map((cert: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Leaf className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium">{cert.name}</span>
                              {cert.certificationBody && (
                                <p className="text-xs text-gray-600">{cert.certificationBody}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'sustainability' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Sustainability Profile</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center mb-2">
                        <Recycle className="h-6 w-6 text-green-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">End of Life</h3>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">This product is:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          {product.sustainability.biodegradable ? 'Biodegradable' : 'Not Biodegradable'}
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          {product.sustainability.compostable ? 'Compostable' : 'Not Compostable'}
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          {product.sustainability.refillable ? 'Refillable' : 'Single Use'}
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <Droplets className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Eco Score</h3>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{product.ecoScore}/100</div>
                        <p className="text-sm text-gray-600 mt-1">Sustainability Rating</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <div className="flex items-center mb-2">
                        <Leaf className="h-6 w-6 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Material Composition</h3>
                      </div>
                      <div className="relative pt-1">
                        <p className="text-sm text-gray-700 mb-1">Recycled Content</p>
                        <div className="overflow-hidden h-6 mb-2 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{ width: `${product.sustainability.recycledContent || 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          >
                            {product.sustainability.recycledContent || 0}%
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          This product contains {product.sustainability.recycledContent || 0}% recycled materials.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Environmental Impact</h3>
                    <p className="text-gray-700 mb-4">
                      This product contributes to environmental sustainability through:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {product.sustainability.sustainableSourcing && (
                        <li className="flex items-start">
                          <Leaf className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>Sustainable sourcing practices</span>
                        </li>
                      )}
                      {product.sustainability.carbonNeutral && (
                        <li className="flex items-start">
                          <Leaf className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>Carbon neutral manufacturing</span>
                        </li>
                      )}
                      {product.sustainability.biodegradable && (
                        <li className="flex items-start">
                          <Recycle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                          <span>Biodegradable materials that break down naturally</span>
                        </li>
                      )}
                    </ul>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {quoteSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <p className="font-medium">Quote request sent successfully!</p>
          </div>
          <p className="text-sm mt-1">Our sales team will contact you soon.</p>
        </div>
      )}

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Quote</h3>
            <p className="text-gray-600 mb-6">
              Your quote request for "{product?.name}" will be sent to our sales team. 
              They will contact you with pricing details and availability.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                onClick={submitQuoteRequest}
                disabled={quoteLoading}
                className="flex-1"
              >
                {quoteLoading ? 'Sending...' : 'Send Request'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQuoteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};