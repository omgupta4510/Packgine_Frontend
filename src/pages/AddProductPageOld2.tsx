import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../utils/dashboard';
import { Save, ArrowLeft, X, Plus } from 'lucide-react';
import broaderCategoriesData from '../data/broaderCategories.json';
import categorySpecificFiltersData from '../data/categorySpecificFilters.json';
import commonFiltersData from '../data/commonFilters.json';

// Type definitions (same as the old BecomeSupplierPage)
interface FilterOption {
  name: string;
  type: string;
  options?: string[];
  fields?: FilterField[];
  groups?: FilterGroup[];
  unitOptions?: string[];
  toggleOptions?: string[];
  defaultToggle?: string;
}

interface FilterField {
  label: string;
  type: string;
  unit?: string;
}

interface FilterGroup {
  groupName: string;
  options: string[] | LocationOption[];
}

interface LocationOption {
  name: string;
  code: string;
}

interface BroaderCategory {
  name: string;
  categories?: string[];
  filters?: FilterOption[];
}

interface BroaderCategoriesData {
  broader_categories: BroaderCategory[];
}

interface CategorySpecificFilter {
  category: string;
  filters: FilterOption[];
}

interface CategorySpecificFiltersData {
  categories: CategorySpecificFilter[];
}

interface CommonFiltersData {
  filters: FilterOption[];
}

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step form state
  const [step, setStep] = useState<number>(1);
  const [selectedBroader, setSelectedBroader] = useState<BroaderCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({});
  const [loading, setLoading] = useState(false);
  const [filterStep, setFilterStep] = useState(0);
  const [currentFilterType, setCurrentFilterType] = useState<'category' | 'common' | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [ecoScore, setEcoScore] = useState<number>(0);
  const [ecoScoreDetails, setEcoScoreDetails] = useState({
    recyclability: 0,
    carbonFootprint: 0,
    sustainableMaterials: 0,
    localSourcing: 0,
    certifications: [] as string[]
  });

  // Basic product info
  const [productInfo, setProductInfo] = useState({
    name: '',
    description: '',
    price: 0,
    minimumOrderQuantity: 1,
    availableQuantity: 0
  });

  // Final submission state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data imports
  const broaderCategories = (broaderCategoriesData as BroaderCategoriesData).broader_categories;
  const categorySpecificFilters = (categorySpecificFiltersData as CategorySpecificFiltersData).categories;
  const commonFilters = (commonFiltersData as CommonFiltersData).filters;

  // Get current filters based on the step
  const getCurrentFilters = (): FilterOption[] => {
    if (currentFilterType === 'category' && selectedCategory) {
      const categoryFilter = categorySpecificFilters.find(cf => cf.category === selectedCategory);
      return categoryFilter?.filters || [];
    } else if (currentFilterType === 'common') {
      return commonFilters;
    }
    return [];
  };

  const currentFilters = getCurrentFilters();

  // Handler functions from the old BecomeSupplierPage
  const handleBroaderSelect = (broader: BroaderCategory) => {
    setSelectedBroader(broader);
    setStep(2);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Check if there are category-specific filters for this category
      const categoryFilter = categorySpecificFilters.find(cf => cf.category === category);
      
      if (categoryFilter && categoryFilter.filters.length > 0) {
        // Start with category-specific filters
        setStep(3);
        setFilterStep(0);
        setCurrentFilterType('category');
      } else {
        // Skip to common filters if no category-specific filters
        setStep(3);
        setFilterStep(0);
        setCurrentFilterType('common');
      }
    }, 1000);
  };

  const handleFilterSelect = (value: string) => {
    const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
    setSelectedFilters({
      ...selectedFilters,
      [currentFilterName]: [value]
    });
    proceedToNextFilter();
  };

  const handleMultipleSelection = (filterName: string, value: string, checked: boolean) => {
    const currentSelections = selectedFilters[filterName] || [];
    if (checked) {
      setSelectedFilters({
        ...selectedFilters,
        [filterName]: [...currentSelections, value]
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filterName]: currentSelections.filter(item => item !== value)
      });
    }
  };

  const proceedToNextFilter = () => {
    if (currentFilterType === 'category') {
      const categoryFilter = categorySpecificFilters.find(cf => cf.category === selectedCategory);
      const categoryFilters = categoryFilter?.filters || [];
      
      if (filterStep < categoryFilters.length - 1) {
        setFilterStep(filterStep + 1);
      } else {
        // Move to common filters
        setCurrentFilterType('common');
        setFilterStep(0);
        if (commonFilters.length === 0) {
          setStep(4); // Skip to product info if no common filters
        }
      }
    } else if (currentFilterType === 'common') {
      if (filterStep < commonFilters.length - 1) {
        setFilterStep(filterStep + 1);
      } else {
        setStep(4); // Move to product info step
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    // Cloudinary configuration
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }
      
      setUploadedImages([...uploadedImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  const getCompleteProductData = () => {
    return {
      name: productInfo.name,
      description: productInfo.description,
      broaderCategory: selectedBroader?.name,
      category: selectedCategory,
      images: uploadedImages,
      specifications: {
        material: 'Not specified', // You can add material selection in filters
        capacity: { value: 0, unit: 'ml' },
        minimumOrderQuantity: productInfo.minimumOrderQuantity,
        availableQuantity: productInfo.availableQuantity
      },
      pricing: {
        basePrice: productInfo.price,
        currency: 'USD'
      },
      ecoScore: ecoScore,
      ecoScoreDetails: ecoScoreDetails,
      filters: selectedFilters,
      status: 'pending' as const
    };
  };

  const handleSubmit = async () => {
    if (!productInfo.name || !productInfo.description || !selectedBroader || !selectedCategory) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const productData = getCompleteProductData();
      await dashboardService.createProduct(productData);
      setSuccess('Product created successfully!');
      setTimeout(() => {
        navigate('/supplier/products');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/supplier/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({...productData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({...productData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Broader Category *
                </label>
                <select
                  value={productData.broaderCategory}
                  onChange={(e) => setProductData({...productData, broaderCategory: e.target.value, category: ''})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select broader category</option>
                  {broaderCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!productData.broaderCategory}
                >
                  <option value="">Select category</option>
                  {productData.broaderCategory && categories[productData.broaderCategory as keyof typeof categories]?.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={productData.subcategory}
                  onChange={(e) => setProductData({...productData, subcategory: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {productData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {productData.images.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/supplier/products')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
