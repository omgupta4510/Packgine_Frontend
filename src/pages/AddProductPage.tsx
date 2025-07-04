import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import data files
import broaderCategories from '../data/broaderCategories.json';
import categorySpecificFilters from '../data/categorySpecificFilters.json';
import commonFilters from '../data/commonFilters.json';
const API_URL= import.meta.env.VITE_API_URL || 'http://localhost:5000';


const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    availableQuantity: 100
  });

  // Update available categories when broader category changes
  useEffect(() => {
    if (selectedBroaderCategory) {
      const categoryData = broaderCategories.broader_categories.find((cat: any) => cat.name === selectedBroaderCategory);
      setAvailableCategories(categoryData?.categories || []);
      setSelectedCategory('');
      setCategorySpecificFiltersList([]);
      setCommonFiltersList([]);
    }
  }, [selectedBroaderCategory]);

  // Update filters when category changes
  useEffect(() => {
    if (selectedCategory) {
      // Get category-specific filters
      const categoryFilter = categorySpecificFilters.categories.find((cf: any) => cf.category === selectedCategory);
      setCategorySpecificFiltersList(categoryFilter?.filters || []);
      
      // Get common filters
      setCommonFiltersList(commonFilters.filters || []);
      
      // Reset filter selections
      setSelectedCategoryFilters({});
      setSelectedCommonFilters({});
    }
  }, [selectedCategory]);

  // Remove automatic eco score calculation since we'll use interactive sliders
  // useEffect(() => {
  //   ... automatic calculation removed
  // }, [selectedCategoryFilters, selectedCommonFilters, uploadedImages]);

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
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}:`, file.name, file.type, file.size);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        console.log('Upload URL:', uploadUrl);
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
          console.log('Successfully uploaded:', data.secure_url);
        } else {
          console.error('No secure_url in response:', data);
          if (data.error) {
            alert(`Upload failed: ${data.error.message}`);
          }
        }
      }
      
      console.log('All uploads completed. URLs:', uploadedUrls);
      setUploadedImages([...uploadedImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Get the auth token using the proper key
      const token = localStorage.getItem('supplier_token');
      
      const productData = {
        name: productInfo.name,
        description: productInfo.description,
        broaderCategory: selectedBroaderCategory,
        category: selectedCategory,
        images: uploadedImages,
        specifications: {
          material: selectedCategoryFilters['Material']?.[0] || selectedCommonFilters['Material']?.[0] || 'Not specified',
          minimumOrderQuantity: productInfo.minimumOrderQuantity,
          availableQuantity: productInfo.availableQuantity,
          capacity: {
            value: 1,
            unit: 'unit'
          }
        },
        pricing: {
          basePrice: parseFloat(productInfo.price),
          currency: 'USD'
        },
        ecoScore: ecoScore,
        ecoScoreDetails: ecoScoreDetails,
        categoryFilters: selectedCategoryFilters,
        commonFilters: selectedCommonFilters
      };

      console.log('Sending product data:', productData);

      const response = await fetch(`${API_URL}/api/dashboard/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      console.log('Product creation response:', result);
      
      if (response.ok && result.message) {
        alert('Product created successfully!');
        navigate('/products/filter/all');
      } else {
        console.error('Product creation failed:', result);
        alert(`Failed to create product: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1: return selectedBroaderCategory !== '';
      case 2: return selectedCategory !== '';
      case 3: return categorySpecificFiltersList.length === 0 || Object.keys(selectedCategoryFilters).length > 0;
      case 4: return commonFiltersList.length === 0 || Object.keys(selectedCommonFilters).length > 0;
      case 5: return true; // Images are optional
      case 6: return ecoScore > 0; // Eco score must be calculated
      case 7: return productInfo.name !== '' && productInfo.description !== '' && productInfo.price !== '';
      default: return true;
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((step) => (
          <div
            key={step}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step <= currentStep
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 7) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Category</span>
        <span>Subcategory</span>
        <span>Category Filters</span>
        <span>Common Filters</span>
        <span>Images</span>
        <span>Eco Score</span>
        <span>Details</span>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Select Broader Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {broaderCategories.broader_categories.map((category: any) => (
                <div
                  key={category.name}
                  onClick={() => setSelectedBroaderCategory(category.name)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedBroaderCategory === category.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Select Subcategory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCategories.map((category) => (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    selectedCategory === category
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Category-Specific Filters</h2>
            {categorySpecificFiltersList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No category-specific filters available for {selectedCategory}.</p>
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
                          const isSelected = selectedCategoryFilters[filter.name]?.includes(option) || false;
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

                    {/* Handle checkbox-group with groups */}
                    {filter.type === 'checkbox-group' && filter.groups && (
                      <div className="space-y-6">
                        {filter.groups.map((group: any, groupIndex: number) => (
                          <div key={groupIndex}>
                            <h3 className="font-medium mb-3 text-gray-800">{group.groupName}</h3>
                            <div className="space-y-2">
                              {group.options.map((option: any, optionIndex: number) => {
                                const optionValue = typeof option === 'string' ? option : option.name;
                                const isSelected = selectedCategoryFilters[filter.name]?.includes(optionValue) || false;
                                return (
                                  <label key={optionIndex} className="flex items-center space-x-3 p-2 border rounded hover:bg-green-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const currentSelections = selectedCategoryFilters[filter.name] || [];
                                        let updatedSelections;
                                        if (e.target.checked) {
                                          updatedSelections = [...currentSelections, optionValue];
                                        } else {
                                          updatedSelections = currentSelections.filter((item: any) => item !== optionValue);
                                        }
                                        setSelectedCategoryFilters({
                                          ...selectedCategoryFilters,
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
                              onChange={(e) => {
                                const currentSelections = selectedCategoryFilters[filter.name] || [];
                                const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Min:'));
                                if (e.target.value) {
                                  updatedSelections.push(`Min: ${e.target.value}`);
                                }
                                setSelectedCategoryFilters({
                                  ...selectedCategoryFilters,
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
                              onChange={(e) => {
                                const currentSelections = selectedCategoryFilters[filter.name] || [];
                                const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Max:'));
                                if (e.target.value) {
                                  updatedSelections.push(`Max: ${e.target.value}`);
                                }
                                setSelectedCategoryFilters({
                                  ...selectedCategoryFilters,
                                  [filter.name]: updatedSelections
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Handle range-or-exact filters */}
                    {filter.type === 'range-or-exact' && (
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Min value"
                              onChange={(e) => {
                                const currentSelections = selectedCategoryFilters[filter.name] || [];
                                const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Min:'));
                                if (e.target.value) {
                                  updatedSelections.push(`Min: ${e.target.value}`);
                                }
                                setSelectedCategoryFilters({
                                  ...selectedCategoryFilters,
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
                              onChange={(e) => {
                                const currentSelections = selectedCategoryFilters[filter.name] || [];
                                const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Max:'));
                                if (e.target.value) {
                                  updatedSelections.push(`Max: ${e.target.value}`);
                                }
                                setSelectedCategoryFilters({
                                  ...selectedCategoryFilters,
                                  [filter.name]: updatedSelections
                                });
                              }}
                            />
                          </div>
                          {filter.unitOptions && (
                            <div className="w-32">
                              <label className="block text-sm font-medium text-gray-600 mb-2">Unit</label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                onChange={(e) => {
                                  const currentSelections = selectedCategoryFilters[filter.name] || [];
                                  const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Unit:'));
                                  if (e.target.value) {
                                    updatedSelections.push(`Unit: ${e.target.value}`);
                                  }
                                  setSelectedCategoryFilters({
                                    ...selectedCategoryFilters,
                                    [filter.name]: updatedSelections
                                  });
                                }}
                              >
                                <option value="">Select</option>
                                {filter.unitOptions.map((unit: string) => (
                                  <option key={unit} value={unit}>{unit}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show selected count for current filter */}
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

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Common Filters</h2>
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
                          const isSelected = selectedCommonFilters[filter.name]?.includes(option) || false;
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
                                const isSelected = selectedCommonFilters[filter.name]?.includes(optionValue) || false;
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

                    {/* Handle range-or-exact filters */}
                    {filter.type === 'range-or-exact' && (
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Min value"
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
                          {filter.unitOptions && (
                            <div className="w-32">
                              <label className="block text-sm font-medium text-gray-600 mb-2">Unit</label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                onChange={(e) => {
                                  const currentSelections = selectedCommonFilters[filter.name] || [];
                                  const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Unit:'));
                                  if (e.target.value) {
                                    updatedSelections.push(`Unit: ${e.target.value}`);
                                  }
                                  setSelectedCommonFilters({
                                    ...selectedCommonFilters,
                                    [filter.name]: updatedSelections
                                  });
                                }}
                              >
                                <option value="">Select</option>
                                {filter.unitOptions.map((unit: string) => (
                                  <option key={unit} value={unit}>{unit}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Or Exact Value</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Exact value"
                            onChange={(e) => {
                              const currentSelections = selectedCommonFilters[filter.name] || [];
                              const updatedSelections = currentSelections.filter((item: any) => !item.startsWith('Exact:'));
                              if (e.target.value) {
                                updatedSelections.push(`Exact: ${e.target.value}`);
                              }
                              setSelectedCommonFilters({
                                ...selectedCommonFilters,
                                [filter.name]: updatedSelections
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Handle composite filters (like Neck Dimensions) */}
                    {filter.type === 'composite' && filter.fields && (
                      <div className="space-y-4">
                        {filter.fields.map((field: any, fieldIndex: number) => (
                          <div key={fieldIndex}>
                            <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
                            {field.type === 'range' && (
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder={`Min ${field.label}`}
                                    onChange={(e) => {
                                      const currentSelections = selectedCommonFilters[filter.name] || [];
                                      const updatedSelections = currentSelections.filter((item: any) => !item.startsWith(`${field.label} Min:`));
                                      if (e.target.value) {
                                        updatedSelections.push(`${field.label} Min: ${e.target.value}${field.unit ? ` ${field.unit}` : ''}`);
                                      }
                                      setSelectedCommonFilters({
                                        ...selectedCommonFilters,
                                        [filter.name]: updatedSelections
                                      });
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder={`Max ${field.label}`}
                                    onChange={(e) => {
                                      const currentSelections = selectedCommonFilters[filter.name] || [];
                                      const updatedSelections = currentSelections.filter((item: any) => !item.startsWith(`${field.label} Max:`));
                                      if (e.target.value) {
                                        updatedSelections.push(`${field.label} Max: ${e.target.value}${field.unit ? ` ${field.unit}` : ''}`);
                                      }
                                      setSelectedCommonFilters({
                                        ...selectedCommonFilters,
                                        [filter.name]: updatedSelections
                                      });
                                    }}
                                  />
                                </div>
                                {field.unit && (
                                  <div className="w-16 flex items-end">
                                    <span className="text-sm text-gray-500">{field.unit}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {field.type === 'dropdown' && (
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                onChange={(e) => {
                                  const currentSelections = selectedCommonFilters[filter.name] || [];
                                  const updatedSelections = currentSelections.filter((item: any) => !item.startsWith(`${field.label}:`));
                                  if (e.target.value) {
                                    updatedSelections.push(`${field.label}: ${e.target.value}`);
                                  }
                                  setSelectedCommonFilters({
                                    ...selectedCommonFilters,
                                    [filter.name]: updatedSelections
                                  });
                                }}
                              >
                                <option value="">Select {field.label}</option>
                                {field.options?.map((option: string) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Handle location-group filters */}
                    {filter.type === 'location-group' && filter.groups && (
                      <div className="space-y-6">
                        {filter.toggleOptions && (
                          <div className="flex gap-4 mb-4">
                            {filter.toggleOptions.map((toggle: string) => (
                              <label key={toggle} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`${filter.name}_toggle`}
                                  value={toggle}
                                  defaultChecked={toggle === filter.defaultToggle}
                                  className="w-4 h-4 text-green-600"
                                />
                                <span className="text-sm font-medium">{toggle}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {filter.groups.map((group: any, groupIndex: number) => (
                          <div key={groupIndex}>
                            <h3 className="font-medium mb-3 text-gray-800">{group.groupName}</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {group.options.map((option: any, optionIndex: number) => {
                                const optionValue = typeof option === 'string' ? option : option.name;
                                const optionCode = typeof option === 'object' ? option.code : option.toLowerCase();
                                const isSelected = selectedCommonFilters[filter.name]?.includes(optionCode) || false;
                                return (
                                  <label key={optionIndex} className="flex items-center space-x-3 p-2 border rounded hover:bg-green-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const currentSelections = selectedCommonFilters[filter.name] || [];
                                        let updatedSelections;
                                        if (e.target.checked) {
                                          updatedSelections = [...currentSelections, optionCode];
                                        } else {
                                          updatedSelections = currentSelections.filter((item: any) => item !== optionCode);
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

                    {/* Show selected count for current filter */}
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

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 5: Upload Product Images</h2>
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

      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 6: Environmental Impact Assessment</h2>
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Calculate Your Eco Score</h3>
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
                <p className="text-xs text-gray-500 mt-1">
                  How low is the carbon footprint of your production process?
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  What percentage of your materials are sustainably sourced?
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  What percentage of your supply chain is local (within 500km)?
                </p>
              </div>

              {/* Certifications */}
              <div className="border rounded-lg p-4">
                <label className="block font-medium mb-2">
                  Environmental Certifications
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['FSC Certified', 'ISO 14001', 'Cradle to Cradle', 'LEED Certified', 'Energy Star', 'Fair Trade', 'Organic Certified', 'Carbon Neutral'].map((cert) => (
                    <label key={cert} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={ecoScoreDetails.certifications.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEcoScoreDetails({
                              ...ecoScoreDetails,
                              certifications: [...ecoScoreDetails.certifications, cert]
                            });
                          } else {
                            setEcoScoreDetails({
                              ...ecoScoreDetails,
                              certifications: ecoScoreDetails.certifications.filter(c => c !== cert)
                            });
                          }
                        }}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm">{cert}</span>
                    </label>
                  ))}
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
                      (ecoScoreDetails.certifications.length * 1.25) // 10 points max for certifications
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

      case 7:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 7: Product Details & Review</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productInfo.name}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={productInfo.description}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productInfo.price}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Order Quantity
                  </label>
                  <input
                    type="number"
                    value={productInfo.minimumOrderQuantity}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, minimumOrderQuantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    value={productInfo.availableQuantity}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, availableQuantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Category:</strong> {selectedBroaderCategory} → {selectedCategory}</p>
                    <p><strong>Eco Score:</strong> {ecoScore}/100</p>
                    <p><strong>Images:</strong> {uploadedImages.length} uploaded</p>
                  </div>
                  <div>
                    <p><strong>Category Filters:</strong> {Object.keys(selectedCategoryFilters).length} selected</p>
                    <p><strong>Common Filters:</strong> {Object.keys(selectedCommonFilters).length} selected</p>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/supplier/products')}
              className="text-green-600 hover:text-green-700 mb-4"
            >
              ← Back to Products
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-2">Create a detailed product listing with eco-friendly specifications</p>
          </div>

          {renderProgressBar()}
          
          <div className="mb-8">
            {renderStep()}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep === 7 ? (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !canProceedFromStep(currentStep)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating Product...' : 'Create Product'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceedFromStep(currentStep)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
