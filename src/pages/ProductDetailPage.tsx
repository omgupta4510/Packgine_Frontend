import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SustainabilityScore } from '../components/ui/SustainabilityScore';
import { 
  ChevronRight, 
  Leaf, 
  Droplets, 
  Factory, 
  Recycle, 
  ThumbsUp, 
  Package, 
  Download,
  Share2,
  Info,
  Star
} from 'lucide-react';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Recyclable Paper Pouch with Window',
  supplier: 'EcoPack Solutions',
  sustainabilityScore: 92,
  material: 'Recycled Paper',
  minOrderQuantity: 1000,
  location: 'USA',
  description: 'This innovative paper pouch combines sustainability with functionality. Made from 90% post-consumer recycled paper with a plant-based transparent window, it offers excellent product visibility while maintaining eco-friendly credentials. Perfect for dry goods, snacks, and small items.',
  features: [
    'FSC-certified recycled paper',
    'Plant-based PLA window',
    'Heat-sealable',
    'Custom printing available',
    'Moisture-resistant coating',
    'Compostable in industrial facilities'
  ],
  images: [
    'https://images.pexels.com/photos/7262764/pexels-photo-7262764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/6044537/pexels-photo-6044537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/7262954/pexels-photo-7262954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ],
  sustainabilityDetails: {
    recyclable: true,
    biodegradable: true,
    compostable: 'Industrial',
    carbonFootprint: '-72% vs. conventional',
    waterUsage: '-65% vs. conventional',
    renewableMaterials: '90%'
  },
  specifications: {
    dimensions: 'Customizable from 3"x5" to 12"x16"',
    thickness: '120 GSM',
    printability: 'Full color digital or flexographic printing',
    certifications: ['FSC', 'ASTM D6400', 'Home Compostable', 'BPI Certified'],
    moq: '1,000 units',
    leadTime: '3-4 weeks'
  },
  supplierInfo: {
    name: 'EcoPack Solutions',
    location: 'Portland, OR, USA',
    founded: 2015,
    employeeCount: '50-100',
    specialties: ['Paper Packaging', 'Compostable Films', 'Eco-friendly Inks'],
    certifications: ['ISO 14001', 'B Corp Certified'],
    rating: 4.8,
    reviewCount: 42
  }
};

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'sustainability'>('overview');
  
  // In a real application, you would fetch the product based on the ID
  const product = mockProduct;

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
              <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-80 object-contain" 
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative border-2 rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-green-500' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-cover" 
                    />
                  </button>
                ))}
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
                    By <a href="#" className="text-green-600 hover:underline">{product.supplier}</a>
                  </p>
                </div>
                <SustainabilityScore score={product.sustainabilityScore} size="lg" />
              </div>

              <div className="mb-6">
                <div className="inline-flex items-center bg-green-50 text-green-800 py-1 px-2 rounded text-sm mr-2">
                  <Leaf className="h-4 w-4 mr-1" />
                  {product.material}
                </div>
                <div className="inline-flex items-center bg-blue-50 text-blue-800 py-1 px-2 rounded text-sm">
                  <Factory className="h-4 w-4 mr-1" />
                  Made in {product.location}
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {product.description}
              </p>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <ThumbsUp className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Minimum Order: <strong>{product.minOrderQuantity.toLocaleString()} units</strong></span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="lg" className="flex-1">
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
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.supplierInfo.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.supplierInfo.rating} ({product.supplierInfo.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-blue-500" />
                  Verified supplier with {product.supplierInfo.reviewCount}+ successful transactions
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
                        <p className="font-medium">{product.supplierInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{product.supplierInfo.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Founded</p>
                        <p className="font-medium">{product.supplierInfo.founded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium">{product.supplierInfo.employeeCount} employees</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Specialties</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.supplierInfo.specialties.map((specialty, index) => (
                          <span key={index} className="bg-white px-2 py-1 text-xs rounded-full border border-gray-200">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Certifications</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.supplierInfo.certifications.map((cert, index) => (
                          <span key={index} className="bg-green-50 text-green-700 px-2 py-1 text-xs rounded-full">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                  
                  <div className="overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Dimensions</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.dimensions}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Material Thickness</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.thickness}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Printing Capabilities</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.printability}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Minimum Order Quantity</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.moq}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Lead Time</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.specifications.leadTime}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.specifications.certifications.map((cert, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
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
                          {product.sustainabilityDetails.recyclable ? 'Recyclable' : 'Not Recyclable'}
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          {product.sustainabilityDetails.biodegradable ? 'Biodegradable' : 'Not Biodegradable'}
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Compostable: {product.sustainabilityDetails.compostable}
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <Droplets className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Resource Usage</h3>
                      </div>
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <p className="text-gray-700 mb-1">Carbon Footprint</p>
                          <div className="flex items-center">
                            <div className="h-2 bg-green-200 rounded-full w-full">
                              <div className="h-2 bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                            </div>
                            <span className="ml-2 text-green-700 font-medium">
                              {product.sustainabilityDetails.carbonFootprint}
                            </span>
                          </div>
                        </li>
                        <li className="text-sm">
                          <p className="text-gray-700 mb-1">Water Usage</p>
                          <div className="flex items-center">
                            <div className="h-2 bg-blue-200 rounded-full w-full">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="ml-2 text-blue-700 font-medium">
                              {product.sustainabilityDetails.waterUsage}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <div className="flex items-center mb-2">
                        <Leaf className="h-6 w-6 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Material Composition</h3>
                      </div>
                      <div className="relative pt-1">
                        <p className="text-sm text-gray-700 mb-1">Renewable Materials</p>
                        <div className="overflow-hidden h-6 mb-2 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{ width: product.sustainabilityDetails.renewableMaterials }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          >
                            {product.sustainabilityDetails.renewableMaterials}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          This product is made from {product.sustainabilityDetails.renewableMaterials} renewable or recycled materials, significantly reducing its environmental impact.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Environmental Impact Statement</h3>
                    <p className="text-gray-700 mb-4">
                      Choosing this product over conventional alternatives helps reduce your environmental footprint. Based on lifecycle assessment:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <Leaf className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Reduces greenhouse gas emissions by approximately 72% compared to conventional plastic alternatives.</span>
                      </li>
                      <li className="flex items-start">
                        <Droplets className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span>Uses 65% less water in manufacturing compared to virgin plastic production.</span>
                      </li>
                      <li className="flex items-start">
                        <Recycle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                        <span>End-of-life options include industrial composting or recycling with paper stream, diverting waste from landfills.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};