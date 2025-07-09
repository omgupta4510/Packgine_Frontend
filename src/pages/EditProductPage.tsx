import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Import data files
import broaderCategories from '../data/broaderCategories.json';
import categorySpecificFilters from '../data/categorySpecificFilters.json';
import commonFilters from '../data/commonFilters.json';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Product {
  _id: string;
  name: string;
  description: string;
  broaderCategory: string;
  category: string;
  images: string[];
  primaryImage: string;
  features: string[];
  specifications: {
    material: string;
    capacity?: { value: number; unit: string };
    dimensions: {
      height?: number;
      width?: number;
      depth?: number;
      unit: string;
    };
    weight?: { value: number; unit: string };
    color?: string;
    finish?: string;
    closure?: string;
    minimumOrderQuantity: number;
    availableQuantity: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  ecoScore: number;
  ecoScoreDetails: {
    recyclability: number;
    carbonFootprint: number;
    sustainableMaterials: number;
    localSourcing: number;
    certifications: string[];
  };
  sustainability: {
    recycledContent: number;
    biodegradable: boolean;
    compostable: boolean;
    refillable: boolean;
    sustainableSourcing: boolean;
    carbonNeutral: boolean;
  };
  certifications: Array<{
    name: string;
    certificationBody?: string;
    validUntil?: string;
    certificateNumber?: string;
  }>;
  customization: {
    printingAvailable: boolean;
    labelingAvailable: boolean;
    colorOptions: string[];
    printingMethods: string[];
    customSizes: boolean;
  };
  leadTime: {
    standard?: number;
    custom?: number;
    rush?: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  categoryFilters: { [key: string]: any };
  commonFilters: { [key: string]: any };
}

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form data state
  const [selectedBroaderCategory, setSelectedBroaderCategory] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categorySpecificFiltersList, setCategorySpecificFiltersList] = useState<any[]>([]);
  const [commonFiltersList, setCommonFiltersList] = useState<any[]>([]);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<{ [key: string]: any }>({});
  const [selectedCommonFilters, setSelectedCommonFilters] = useState<{ [key: string]: any }>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [ecoScore, setEcoScore] = useState<number>(0);
  const [ecoScoreDetails, setEcoScoreDetails] = useState({
    recyclability: 0,
    carbonFootprint: 0,
    sustainableMaterials: 0,
    localSourcing: 0,
    certifications: [] as string[]
  });
  
  const [productInfo, setProductInfo] = useState({
    name: '',
    description: '',
    price: '',
    minimumOrderQuantity: 1,
    availableQuantity: 100,
    features: [] as string[],
    // Capacity
    capacity: '',
    capacityUnit: 'ml',
    // Dimensions
    height: '',
    width: '',
    depth: '',
    dimensionUnit: 'mm',
    // Weight
    weight: '',
    weightUnit: 'g',
    // Other specifications
    color: '',
    finish: '',
    closure: '',
    // Lead time
    standardLeadTime: '',
    customLeadTime: '',
    rushLeadTime: '',
    // SEO
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[]
  });

  const [sustainability, setSustainability] = useState({
    recycledContent: 0,
    biodegradable: false,
    compostable: false,
    refillable: false,
    sustainableSourcing: false,
    carbonNeutral: false
  });

  const [certifications, setCertifications] = useState<Array<{
    name: string;
    certificationBody?: string;
    validUntil?: string;
    certificateNumber?: string;
  }>>([]);

  const [customization, setCustomization] = useState({
    printingAvailable: false,
    labelingAvailable: false,
    colorOptions: [] as string[],
    printingMethods: [] as string[],
    customSizes: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newColorOption, setNewColorOption] = useState('');
  const [newPrintingMethod, setNewPrintingMethod] = useState('');
  const [newCertification, setNewCertification] = useState({
    name: '',
    certificationBody: '',
    validUntil: '',
    certificateNumber: ''
  });

  // Load product data for editing
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('supplier_token');
        const response = await fetch(`${API_URL}/api/dashboard/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load product');
        }

        const product: Product = await response.json();
        console.log('Loaded product:', product);
        console.log('Product categoryFilters:', product.categoryFilters);
        console.log('Product commonFilters:', product.commonFilters);

        // Populate form with existing data
        setSelectedBroaderCategory(product.broaderCategory || '');
        setSelectedCategory(product.category || '');
        setUploadedImages(product.images || []);
        setEcoScore(product.ecoScore || 0);
        setEcoScoreDetails(product.ecoScoreDetails || {
          recyclability: 0,
          carbonFootprint: 0,
          sustainableMaterials: 0,
          localSourcing: 0,
          certifications: []
        });

        setProductInfo({
          name: product.name || '',
          description: product.description || '',
          price: product.pricing?.basePrice?.toString() || '',
          minimumOrderQuantity: product.specifications?.minimumOrderQuantity || 1,
          availableQuantity: product.specifications?.availableQuantity || 100,
          features: product.features || [],
          capacity: product.specifications?.capacity?.value?.toString() || '',
          capacityUnit: product.specifications?.capacity?.unit || 'ml',
          height: product.specifications?.dimensions?.height?.toString() || '',
          width: product.specifications?.dimensions?.width?.toString() || '',
          depth: product.specifications?.dimensions?.depth?.toString() || '',
          dimensionUnit: product.specifications?.dimensions?.unit || 'mm',
          weight: product.specifications?.weight?.value?.toString() || '',
          weightUnit: product.specifications?.weight?.unit || 'g',
          color: product.specifications?.color || '',
          finish: product.specifications?.finish || '',
          closure: product.specifications?.closure || '',
          standardLeadTime: product.leadTime?.standard?.toString() || '',
          customLeadTime: product.leadTime?.custom?.toString() || '',
          rushLeadTime: product.leadTime?.rush?.toString() || '',
          metaTitle: product.seo?.metaTitle || '',
          metaDescription: product.seo?.metaDescription || '',
          keywords: product.seo?.keywords || []
        });

        setSustainability(product.sustainability || {
          recycledContent: 0,
          biodegradable: false,
          compostable: false,
          refillable: false,
          sustainableSourcing: false,
          carbonNeutral: false
        });

        setCertifications(product.certifications || []);
        setCustomization(product.customization || {
          printingAvailable: false,
          labelingAvailable: false,
          colorOptions: [],
          printingMethods: [],
          customSizes: false
        });

        // Set filter data - ensure we have the filters first
        setSelectedCategoryFilters(product.categoryFilters || {});
        setSelectedCommonFilters(product.commonFilters || {});
        
        console.log('Set categoryFilters to:', product.categoryFilters || {});
        console.log('Set commonFilters to:', product.commonFilters || {});

      } catch (err: any) {
        console.error('Error loading product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Update available categories when broader category changes
  useEffect(() => {
    if (selectedBroaderCategory) {
      const categoryData = broaderCategories.broader_categories.find((cat: any) => cat.name === selectedBroaderCategory);
      setAvailableCategories(categoryData?.categories || []);
    }
  }, [selectedBroaderCategory]);

  // Update filters when category changes
  useEffect(() => {
    if (selectedCategory) {
      // Get category-specific filters
      const categoryFilter = categorySpecificFilters.categories.find((cf: any) => cf.category === selectedCategory);
      setCategorySpecificFiltersList(categoryFilter?.filters || []);
      
      // Get common filters - always load them
      setCommonFiltersList(commonFilters.filters || []);
      
      console.log('Category filters loaded:', categoryFilter?.filters || []);
      console.log('Common filters loaded:', commonFilters.filters || []);
    }
  }, [selectedCategory]);

  // Load filters immediately when component mounts, regardless of loading state
  useEffect(() => {
    // Always load common filters
    setCommonFiltersList(commonFilters.filters || []);
    console.log('Initial common filters loaded:', commonFilters.filters || []);
  }, []);

  // Ensure filters are re-applied after product data is loaded and filters are available
  useEffect(() => {
    if (!loading && selectedCategory && (categorySpecificFiltersList.length > 0 || commonFiltersList.length > 0)) {
      // Re-trigger filter data setting to ensure everything is properly filled
      console.log('Re-applying filter data after filters are loaded');
      console.log('Current selectedCategoryFilters:', selectedCategoryFilters);
      console.log('Current selectedCommonFilters:', selectedCommonFilters);
      
      // Force a re-render by updating the state again
      setTimeout(() => {
        setSelectedCategoryFilters(prev => ({ ...prev }));
        setSelectedCommonFilters(prev => ({ ...prev }));
      }, 100);
    }
  }, [loading, selectedCategory, categorySpecificFiltersList.length, commonFiltersList.length]);

  // Ensure filters are loaded after product data is set
  useEffect(() => {
    if (!loading && selectedCategory) {
      // Re-load filters to ensure they're available for pre-filling
      const categoryFilter = categorySpecificFilters.categories.find((cf: any) => cf.category === selectedCategory);
      setCategorySpecificFiltersList(categoryFilter?.filters || []);
      setCommonFiltersList(commonFilters.filters || []);
      
      console.log('Post-load filter refresh for category:', selectedCategory);
      console.log('Current selectedCategoryFilters:', selectedCategoryFilters);
      console.log('Current selectedCommonFilters:', selectedCommonFilters);
    }
  }, [loading, selectedCategory, selectedCategoryFilters, selectedCommonFilters]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Starting upload of ${files.length} file(s)`);
    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dit8gwqom';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ecopack';
    
    console.log('Cloudinary config:', { cloudName, uploadPreset });

    try {
      for (const file of Array.from(files)) {
        console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('cloud_name', cloudName);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Cloudinary error response:', errorData);
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Upload successful:', data.secure_url);
        uploadedUrls.push(data.secure_url);
      }

      setUploadedImages(prev => [...prev, ...uploadedUrls]);
      console.log('All uploads completed successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('supplier_token');
      
      const productData = {
        name: productInfo.name,
        description: productInfo.description,
        broaderCategory: selectedBroaderCategory,
        category: selectedCategory,
        images: uploadedImages,
        primaryImage: uploadedImages[0] || null,
        features: productInfo.features,
        specifications: {
          material: (selectedCategoryFilters['Material'] || selectedCommonFilters['Material'] || ['Not specified']).join(', '),
          capacity: productInfo.capacity ? {
            value: parseFloat(productInfo.capacity),
            unit: productInfo.capacityUnit
          } : undefined,
          dimensions: {
            height: parseFloat(productInfo.height) || undefined,
            width: parseFloat(productInfo.width) || undefined,
            depth: parseFloat(productInfo.depth) || undefined,
            unit: productInfo.dimensionUnit
          },
          weight: productInfo.weight ? {
            value: parseFloat(productInfo.weight),
            unit: productInfo.weightUnit
          } : undefined,
          color: productInfo.color || undefined,
          finish: productInfo.finish || undefined,
          closure: productInfo.closure || undefined,
          minimumOrderQuantity: productInfo.minimumOrderQuantity,
          availableQuantity: productInfo.availableQuantity
        },
        pricing: {
          basePrice: parseFloat(productInfo.price),
          currency: 'USD'
        },
        ecoScore: ecoScore,
        ecoScoreDetails: ecoScoreDetails,
        sustainability: sustainability,
        certifications: certifications,
        customization: customization,
        leadTime: {
          standard: productInfo.standardLeadTime ? parseInt(productInfo.standardLeadTime) : undefined,
          custom: productInfo.customLeadTime ? parseInt(productInfo.customLeadTime) : undefined,
          rush: productInfo.rushLeadTime ? parseInt(productInfo.rushLeadTime) : undefined
        },
        seo: {
          metaTitle: productInfo.metaTitle || undefined,
          metaDescription: productInfo.metaDescription || undefined,
          keywords: productInfo.keywords,
          slug: productInfo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        },
        categoryFilters: selectedCategoryFilters,
        commonFilters: selectedCommonFilters
      };

      console.log('Updating product data:', productData);

      const response = await fetch(`${API_URL}/api/dashboard/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      console.log('Product update response:', result);
      
      if (response.ok && result.message) {
        alert('Product updated successfully!');
        navigate('/supplier/dashboard');
      } else {
        console.error('Product update failed:', result);
        alert(`Failed to update product: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('supplier_token');
      
      const response = await fetch(`${API_URL}/api/dashboard/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (response.ok && result.message) {
        alert('Product deleted successfully!');
        navigate('/supplier/dashboard');
      } else {
        console.error('Product deletion failed:', result);
        alert(`Failed to delete product: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/supplier/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Helper functions for managing arrays (same as AddProductPage)
  const addFeature = () => {
    if (newFeature.trim() && !productInfo.features.includes(newFeature.trim())) {
      setProductInfo(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setProductInfo(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !productInfo.keywords.includes(newKeyword.trim())) {
      setProductInfo(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setProductInfo(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addColorOption = () => {
    if (newColorOption.trim() && !customization.colorOptions.includes(newColorOption.trim())) {
      setCustomization(prev => ({
        ...prev,
        colorOptions: [...prev.colorOptions, newColorOption.trim()]
      }));
      setNewColorOption('');
    }
  };

  const removeColorOption = (index: number) => {
    setCustomization(prev => ({
      ...prev,
      colorOptions: prev.colorOptions.filter((_, i) => i !== index)
    }));
  };

  const addPrintingMethod = () => {
    if (newPrintingMethod.trim() && !customization.printingMethods.includes(newPrintingMethod.trim())) {
      setCustomization(prev => ({
        ...prev,
        printingMethods: [...prev.printingMethods, newPrintingMethod.trim()]
      }));
      setNewPrintingMethod('');
    }
  };

  const removePrintingMethod = (index: number) => {
    setCustomization(prev => ({
      ...prev,
      printingMethods: prev.printingMethods.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.name.trim()) {
      setCertifications(prev => [...prev, { ...newCertification }]);
      setNewCertification({
        name: '',
        certificationBody: '',
        validUntil: '',
        certificateNumber: ''
      });
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  // Render step content (same structure as AddProductPage, but with edit functionality)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-10 my-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product Information</h2>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={productInfo.name}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={productInfo.price}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={productInfo.description}
                onChange={(e) => setProductInfo(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your product..."
                required
              />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broader Category *</label>
                <select
                  value={selectedBroaderCategory}
                  onChange={(e) => setSelectedBroaderCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select broader category</option>
                  {broaderCategories.broader_categories.map((category: any) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedBroaderCategory}
                  required
                >
                  <option value="">Select specific category</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
                <input
                  type="number"
                  value={productInfo.minimumOrderQuantity}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, minimumOrderQuantity: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity</label>
                <input
                  type="number"
                  value={productInfo.availableQuantity}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, availableQuantity: parseInt(e.target.value) || 100 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Features</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a product feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productInfo.features.map((feature, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Category-Specific Filters</h2>
            {categorySpecificFiltersList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No category-specific filters available for "{selectedCategory}".</p>
                <p className="text-sm text-gray-400 mt-2">Click Next to continue to common filters.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {categorySpecificFiltersList.map((filter: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <label className="block text-lg font-medium text-gray-700 mb-4">
                      {filter.name}
                    </label>
                    
                    {/* Handle checkbox-group with options */}
                    {filter.type === 'checkbox-group' && filter.options && (
                      <div className="space-y-3">
                        {filter.options.map((option: string) => {
                          const currentSelections = selectedCategoryFilters[filter.name] || [];
                          const isSelected = currentSelections.includes(option);
                          console.log(`Category filter ${filter.name} - option ${option}: ${isSelected}`, currentSelections);
                          return (
                            <label key={option} className="flex items-center space-x-3 p-3 border rounded hover:bg-green-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentSelections = selectedCategoryFilters[filter.name] || [];
                                  let updatedSelections;
                                  if (e.target.checked) {
                                    updatedSelections = [...currentSelections, option];
                                  } else {
                                    updatedSelections = currentSelections.filter((item: any) => item !== option);
                                  }
                                  setSelectedCategoryFilters({
                                    ...selectedCategoryFilters,
                                    [filter.name]: updatedSelections
                                  });
                                }}
                                className="w-4 h-4 text-green-600"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Handle dropdown filters */}
                    {filter.type === 'dropdown' && (
                      <select
                        value={selectedCategoryFilters[filter.name]?.[0] || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedCategoryFilters({
                              ...selectedCategoryFilters,
                              [filter.name]: [e.target.value]
                            });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select {filter.name}</option>
                        {filter.options?.map((option: string) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {selectedCategoryFilters[filter.name] && selectedCategoryFilters[filter.name].length > 0 && (
                      <div className="mt-3 text-sm text-green-600">
                        Selected: {selectedCategoryFilters[filter.name].length} item(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Common Filters</h2>
            {commonFiltersList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No common filters available.</p>
                <p className="text-sm text-gray-400 mt-2">Click Next to continue to image upload.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {commonFiltersList.map((filter: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <label className="block text-lg font-medium text-gray-700 mb-4">
                      {filter.name}
                    </label>
                    
                    {/* Handle checkbox-group with options */}
                    {filter.type === 'checkbox-group' && filter.options && (
                      <div className="space-y-3">
                        {filter.options.map((option: string) => {
                          const currentSelections = selectedCommonFilters[filter.name] || [];
                          const isSelected = currentSelections.includes(option);
                          console.log(`Common filter ${filter.name} - option ${option}: ${isSelected}`, currentSelections);
                          return (
                            <label key={option} className="flex items-center space-x-3 p-3 border rounded hover:bg-green-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentSelections = selectedCommonFilters[filter.name] || [];
                                  let updatedSelections;
                                  if (e.target.checked) {
                                    updatedSelections = [...currentSelections, option];
                                  } else {
                                    updatedSelections = currentSelections.filter((item: any) => item !== option);
                                  }
                                  setSelectedCommonFilters({
                                    ...selectedCommonFilters,
                                    [filter.name]: updatedSelections
                                  });
                                }}
                                className="w-4 h-4 text-green-600"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Handle checkbox-group with groups */}
                    {filter.type === 'checkbox-group' && filter.groups && (
                      <div className="space-y-6">
                        {filter.groups.map((group: any, groupIndex: number) => (
                          <div key={groupIndex}>
                            <h3 className="font-medium mb-3 text-gray-800">{group.groupName}</h3>
                            <div className="space-y-2">
                              {group.options.map((option: any, optionIndex: number) => {
                                const optionValue = typeof option === 'string' ? option : option.name;
                                const currentSelections = selectedCommonFilters[filter.name] || [];
                                const isSelected = currentSelections.includes(optionValue);
                                console.log(`Common grouped filter ${filter.name} - option ${optionValue}: ${isSelected}`, currentSelections);
                                return (
                                  <label key={optionIndex} className="flex items-center space-x-3 p-2 border rounded hover:bg-green-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const currentSelections = selectedCommonFilters[filter.name] || [];
                                        let updatedSelections;
                                        if (e.target.checked) {
                                          updatedSelections = [...currentSelections, optionValue];
                                        } else {
                                          updatedSelections = currentSelections.filter((item: any) => item !== optionValue);
                                        }
                                        setSelectedCommonFilters({
                                          ...selectedCommonFilters,
                                          [filter.name]: updatedSelections
                                        });
                                      }}
                                      className="w-4 h-4 text-green-600"
                                    />
                                    <span>{optionValue}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Handle location-group filters */}
                    {filter.type === 'location-group' && (
                      <div className="space-y-6">
                        {/* Toggle options (Manufacturing/Warehousing) */}
                        {filter.toggleOptions && (
                          <div className="mb-4">
                            <div className="flex space-x-4">
                              {filter.toggleOptions.map((toggle: string) => (
                                <button
                                  key={toggle}
                                  type="button"
                                  onClick={() => {
                                    const currentSelections = selectedCommonFilters[filter.name] || [];
                                    const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Toggle:'));
                                    updatedSelections.push(`Toggle: ${toggle}`);
                                    setSelectedCommonFilters({
                                      ...selectedCommonFilters,
                                      [filter.name]: updatedSelections
                                    });
                                  }}
                                  className={`px-4 py-2 rounded-lg border ${
                                    selectedCommonFilters[filter.name]?.some((item: string) => item === `Toggle: ${toggle}`) 
                                      ? 'bg-green-500 text-white border-green-500' 
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {toggle}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location groups */}
                        {filter.groups && filter.groups.map((group: any, groupIndex: number) => (
                          <div key={groupIndex}>
                            <h3 className="font-medium mb-3 text-gray-800">{group.groupName}</h3>
                            <div className="space-y-2">
                              {group.options.map((option: any, optionIndex: number) => {
                                const optionValue = typeof option === 'string' ? option : option.name;
                                const currentSelections = selectedCommonFilters[filter.name] || [];
                                const isSelected = currentSelections.includes(optionValue);
                                console.log(`Location filter ${filter.name} - option ${optionValue}: ${isSelected}`, currentSelections);
                                return (
                                  <label key={optionIndex} className="flex items-center space-x-3 p-2 border rounded hover:bg-green-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const currentSelections = selectedCommonFilters[filter.name] || [];
                                        let updatedSelections;
                                        if (e.target.checked) {
                                          updatedSelections = [...currentSelections, optionValue];
                                        } else {
                                          updatedSelections = currentSelections.filter((item: any) => item !== optionValue);
                                        }
                                        setSelectedCommonFilters({
                                          ...selectedCommonFilters,
                                          [filter.name]: updatedSelections
                                        });
                                      }}
                                      className="w-4 h-4 text-green-600"
                                    />
                                    <span>{optionValue}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Handle dropdown filters */}
                    {filter.type === 'dropdown' && (
                      <select
                        value={selectedCommonFilters[filter.name]?.[0] || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedCommonFilters({
                              ...selectedCommonFilters,
                              [filter.name]: [e.target.value]
                            });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select {filter.name}</option>
                        {filter.options?.map((option: string) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {/* Handle range filters */}
                    {filter.type === 'range' && (
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Min value"
                              value={selectedCommonFilters[filter.name]?.find((item: string) => item.startsWith('Min:'))?.replace('Min: ', '') || ''}
                              onChange={(e) => {
                                const currentSelections = selectedCommonFilters[filter.name] || [];
                                const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Min:'));
                                if (e.target.value) {
                                  updatedSelections.push(`Min: ${e.target.value}`);
                                }
                                setSelectedCommonFilters({
                                  ...selectedCommonFilters,
                                  [filter.name]: updatedSelections
                                });
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Maximum</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Max value"
                              value={selectedCommonFilters[filter.name]?.find((item: string) => item.startsWith('Max:'))?.replace('Max: ', '') || ''}
                              onChange={(e) => {
                                const currentSelections = selectedCommonFilters[filter.name] || [];
                                const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Max:'));
                                if (e.target.value) {
                                  updatedSelections.push(`Max: ${e.target.value}`);
                                }
                                setSelectedCommonFilters({
                                  ...selectedCommonFilters,
                                  [filter.name]: updatedSelections
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedCommonFilters[filter.name] && selectedCommonFilters[filter.name].length > 0 && (
                      <div className="mt-3 text-sm text-green-600">
                        Selected: {selectedCommonFilters[filter.name].length} item(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Upload Product Images</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {uploadingImage && (
                  <p className="text-blue-600 mt-2">Uploading images...</p>
                )}
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 5: Environmental Impact Assessment</h2>
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Update Your Eco Score</h3>
                <p className="text-sm text-green-700 mb-4">
                  Help us understand the environmental impact of your products. This score will be displayed to buyers.
                </p>
              </div>

              {/* Recyclability */}
              <div className="border rounded-lg p-4">
                <label className="block font-medium mb-2">
                  Recyclability (0-100%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ecoScoreDetails.recyclability}
                  onChange={(e) => setEcoScoreDetails({
                    ...ecoScoreDetails,
                    recyclability: Number(e.target.value)
                  })}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span className="font-medium">{ecoScoreDetails.recyclability}%</span>
                  <span>100%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  What percentage of your product can be recycled?
                </p>
              </div>

              {/* Carbon Footprint */}
              <div className="border rounded-lg p-4">
                <label className="block font-medium mb-2">
                  Carbon Footprint Reduction (0-100)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ecoScoreDetails.carbonFootprint}
                  onChange={(e) => setEcoScoreDetails({
                    ...ecoScoreDetails,
                    carbonFootprint: Number(e.target.value)
                  })}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>High Impact</span>
                  <span className="font-medium">{ecoScoreDetails.carbonFootprint}/100</span>
                  <span>Low Impact</span>
                </div>
              </div>

              {/* Sustainable Materials */}
              <div className="border rounded-lg p-4">
                <label className="block font-medium mb-2">
                  Sustainable Materials Usage (0-100%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ecoScoreDetails.sustainableMaterials}
                  onChange={(e) => setEcoScoreDetails({
                    ...ecoScoreDetails,
                    sustainableMaterials: Number(e.target.value)
                  })}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span className="font-medium">{ecoScoreDetails.sustainableMaterials}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Local Sourcing */}
              <div className="border rounded-lg p-4">
                <label className="block font-medium mb-2">
                  Local Sourcing (0-100%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ecoScoreDetails.localSourcing}
                  onChange={(e) => setEcoScoreDetails({
                    ...ecoScoreDetails,
                    localSourcing: Number(e.target.value)
                  })}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span className="font-medium">{ecoScoreDetails.localSourcing}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Calculate Eco Score */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-3"
                  onClick={() => {
                    const calculatedScore = Math.round(
                      (ecoScoreDetails.recyclability * 0.25) +
                      (ecoScoreDetails.carbonFootprint * 0.25) +
                      (ecoScoreDetails.sustainableMaterials * 0.25) +
                      (ecoScoreDetails.localSourcing * 0.15) +
                      (ecoScoreDetails.certifications.length * 1.25)
                    );
                    setEcoScore(Math.min(calculatedScore, 100));
                  }}
                >
                  Calculate Eco Score
                </button>
                
                {ecoScore > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-green-600">
                      {ecoScore}/100
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            ecoScore >= 80 ? 'bg-green-500' :
                            ecoScore >= 60 ? 'bg-yellow-500' :
                            ecoScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${ecoScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {ecoScore >= 80 ? 'Excellent' :
                         ecoScore >= 60 ? 'Good' :
                         ecoScore >= 40 ? 'Fair' : 'Needs Improvement'} Environmental Impact
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 6: Review & Update</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p><strong>Name:</strong> {productInfo.name}</p>
                    <p><strong>Category:</strong> {selectedBroaderCategory} / {selectedCategory}</p>
                    <p><strong>Price:</strong> ${productInfo.price}</p>
                    <p><strong>Min Order:</strong> {productInfo.minimumOrderQuantity}</p>
                  </div>
                  <div>
                    <p><strong>Available Quantity:</strong> {productInfo.availableQuantity}</p>
                    <p><strong>Features:</strong> {productInfo.features.length} items</p>
                    <p><strong>Images:</strong> {uploadedImages.length} uploaded</p>
                    <p><strong>Eco Score:</strong> {ecoScore}/100</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p><strong>Description:</strong> {productInfo.description}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 my-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/supplier/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Products
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Delete Product'}
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading || !productInfo.name || !productInfo.description || !selectedCategory}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-4">
              {currentStep < 6 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
