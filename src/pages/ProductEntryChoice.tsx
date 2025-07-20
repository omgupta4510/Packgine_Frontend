import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Edit3, Zap, Clock, Users, CheckCircle, ArrowRight, Sparkles, Package } from 'lucide-react';

const ProductEntryChoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 my-10">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-berlin-red-500 to-berlin-red-600 rounded-full mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Add Products to Your Catalog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for your workflow. Both options are designed to get your products live quickly and efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* AI-Powered Option */}
          <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* Recommended Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Recommended
              </span>
            </div>
            
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-xl mr-4">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI-Powered Entry</h2>
                  <p className="text-blue-100">Smart & Automated</p>
                </div>
              </div>
              <p className="text-lg text-blue-50">
                Upload your product files and let AI extract, organize, and structure everything automatically.
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Process hundreds of products in minutes</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">96% accuracy with smart validation</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Supports Excel, PDF, PowerPoint files</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Auto-categorization and duplicate detection</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2min</div>
                  <div className="text-sm text-gray-600">Avg. Processing</div>
                </div>
              </div>

              {/* Best For */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Perfect for:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Large product catalogs (50+ products)</div>
                  <div>• Existing product files (spreadsheets, PDFs)</div>
                  <div>• Bulk uploads and migrations</div>
                  <div>• Sales teams who value efficiency</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className="w-full group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/add-product/ai')}
              >
                <Brain className="w-5 h-5 mr-3" />
                Start with AI
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Manual Entry Option */}
          <div className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-berlin-red-500 to-red-600 p-8 text-white">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-xl mr-4">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Manual Entry</h2>
                  <p className="text-red-100">Precise & Controlled</p>
                </div>
              </div>
              <p className="text-lg text-red-50">
                Add products one by one with full control over every detail and specification.
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Complete control over product details</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Custom fields and specifications</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Perfect for unique or complex products</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Immediate publishing capability</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-berlin-red-600">100%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">5min</div>
                  <div className="text-sm text-gray-600">Per Product</div>
                </div>
              </div>

              {/* Best For */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Perfect for:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Individual product additions</div>
                  <div>• Custom or specialized products</div>
                  <div>• When you need precise control</div>
                  <div>• Testing new product concepts</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className="w-full group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-berlin-red-600 to-red-600 text-white rounded-xl text-lg font-semibold hover:from-berlin-red-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/add-product/manual')}
              >
                <Edit3 className="w-5 h-5 mr-3" />
                Add Manually
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">AI-Powered</th>
                  <th className="text-center py-4 px-6 font-semibold text-berlin-red-600">Manual Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Speed for bulk products</td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-gray-400">○</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Precision control</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-gray-400">○</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">File processing</td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-gray-400">○</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Learning curve</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-sm text-green-600 font-medium">Easy</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-sm text-blue-600 font-medium">Simple</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Not sure which option to choose? Start with AI-powered entry for maximum efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              You can always switch between methods
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              150+ sales teams trust our platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEntryChoice;
