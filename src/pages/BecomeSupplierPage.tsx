import { useState } from 'react';
import broaderCategoriesData from '../data/broaderCategories.json';
import categorySpecificFiltersData from '../data/categorySpecificFilters.json';
import commonFiltersData from '../data/commonFilters.json';

// Type definitions for broaderCategories.json
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

// Type definitions for categorySpecificFilters.json
interface CategorySpecificFilter {
  category: string;
  filters: FilterOption[];
}

interface CategorySpecificFiltersData {
  categories: CategorySpecificFilter[];
}

// Type definitions for commonFilters.json
interface CommonFiltersData {
  filters: FilterOption[];
}

export const BecomeSupplierPage = () => {
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
    const updatedFilters = {
      ...selectedFilters,
      [currentFilterName]: [...(selectedFilters[currentFilterName] || []), value]
    };
    setSelectedFilters(updatedFilters);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      const currentFiltersArray = getCurrentFilters();
      
      // Check if there are more filters in the current type (category or common)
      if (filterStep + 1 < currentFiltersArray.length) {
        setFilterStep(filterStep + 1);
      } else if (currentFilterType === 'category') {
        // Finished category filters, move to common filters
        setCurrentFilterType('common');
        setFilterStep(0);
        // Force re-render by updating step briefly if needed
      } else {
        // All filters done, proceed to completion
        setStep(4);
      }
    }, 1000);
  };

  const handleMultipleSelection = (filterName: string, value: string, isChecked: boolean) => {
    const currentSelections = selectedFilters[filterName] || [];
    let updatedSelections;
    
    if (isChecked) {
      updatedSelections = [...currentSelections, value];
    } else {
      updatedSelections = currentSelections.filter(item => item !== value);
    }
    
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: updatedSelections
    });
  };

  const proceedToNextFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      const currentFiltersArray = getCurrentFilters();
      
      // Check if there are more filters in the current type (category or common)
      if (filterStep + 1 < currentFiltersArray.length) {
        setFilterStep(filterStep + 1);
      } else if (currentFilterType === 'category') {
        // Finished category filters, move to common filters
        setCurrentFilterType('common');
        setFilterStep(0);
      } else {
        // All filters done, proceed to image upload
        setStep(4);
      }
    }, 1000);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Starting upload of ${files.length} file(s)`);
    setUploading(true);
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
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  const getCompleteSupplierData = () => {
    return {
      broaderCategory: selectedBroader?.name,
      category: selectedCategory,
      filters: selectedFilters,
      images: uploadedImages,
      ecoScore: ecoScore,
      ecoScoreDetails: ecoScoreDetails,
      submittedAt: new Date().toISOString()
    };
  };

  const submitSupplierData = async () => {
    try {
      setLoading(true);
      const supplierData = getCompleteSupplierData();
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Supplier registration submitted successfully!');
        console.log('Submission successful:', result.data);
        // Optionally redirect or show success message
      } else {
        alert(`Submission failed: ${result.message}`);
        console.error('Submission failed:', result);
      }
    } catch (error) {
      console.error('Error submitting supplier data:', error);
      alert('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 my-10">
      <h1 className="text-2xl font-bold mb-6">Become a Supplier</h1>
      {step === 1 && (
        <div>
          <h2 className="mb-4">Select Broader Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {broaderCategories.map((b) => (
              <button
                key={b.name}
                className="border rounded p-4 hover:bg-green-50"
                onClick={() => handleBroaderSelect(b)}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && selectedBroader && (
        <div>
          <h2 className="mb-4">Select Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {(selectedBroader.categories || []).map((c) => (
              <button
                key={c}
                className="border rounded p-4 hover:bg-green-50"
                onClick={() => handleCategorySelect(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="loader mb-2" />
          <span>Loading...</span>
        </div>
      )}
      {step === 3 && !loading && currentFilters.length > 0 && (
        <div>
          <h2 className="mb-4">
            {currentFilterType === 'category' ? 'Category Specific: ' : 'Common: '}
            {currentFilters[filterStep]?.name}
          </h2>
          
          {/* Handle checkbox-group with options */}
          {currentFilters[filterStep]?.type === 'checkbox-group' && currentFilters[filterStep]?.options && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {currentFilters[filterStep].options.map((option) => {
                  const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                  const isSelected = selectedFilters[currentFilterName]?.includes(option) || false;
                  return (
                    <label key={option} className="flex items-center space-x-3 p-3 border rounded hover:bg-green-50">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleMultipleSelection(currentFilterName, option, e.target.checked)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4"
                onClick={proceedToNextFilter}
              >
                Continue
              </button>
            </div>
          )}

          {/* Handle checkbox-group with groups */}
          {currentFilters[filterStep]?.type === 'checkbox-group' && currentFilters[filterStep]?.groups && (
            <div className="space-y-6">
              {currentFilters[filterStep].groups?.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="font-medium mb-3">{group.groupName}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {group.options.map((option, optionIndex) => {
                      const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                      const optionValue = typeof option === 'string' ? option : option.name;
                      const isSelected = selectedFilters[currentFilterName]?.includes(optionValue) || false;
                      return (
                        <label key={optionIndex} className="flex items-center space-x-3 p-3 border rounded hover:bg-green-50">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleMultipleSelection(currentFilterName, optionValue, e.target.checked)}
                            className="w-4 h-4 text-green-600"
                          />
                          <span>{optionValue}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4"
                onClick={proceedToNextFilter}
              >
                Continue
              </button>
            </div>
          )}
          
          {/* Handle composite filters */}
          {currentFilters[filterStep]?.type === 'composite' && currentFilters[filterStep]?.fields && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">This is a composite filter with multiple fields:</p>
              {currentFilters[filterStep].fields?.map((field, index) => (
                <div key={index} className="border rounded p-4">
                  <label className="block font-medium mb-2">
                    {field.label} {field.unit && `(${field.unit})`}
                  </label>
                  {field.type === 'range' && (
                    <input 
                      type="range" 
                      min="0"
                      max="100"
                      className="w-full"
                      onChange={(e) => handleFilterSelect(`${field.label}: ${e.target.value}${field.unit || ''}`)}
                    />
                  )}
                  {field.type === 'dropdown' && (
                    <select 
                      className="w-full border rounded p-2"
                      onChange={(e) => handleFilterSelect(`${field.label}: ${e.target.value}`)}
                    >
                      <option value="">Select {field.label}</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                    </select>
                  )}
                </div>
              ))}
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4"
                onClick={() => handleFilterSelect(`${currentFilters[filterStep]?.name}: composite filter completed`)}
              >
                Continue
              </button>
            </div>
          )}

          {/* Handle range-or-exact filters */}
          {currentFilters[filterStep]?.type === 'range-or-exact' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-2">Minimum</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    placeholder="Min value"
                    onChange={(e) => {
                      const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                      const currentSelections = selectedFilters[currentFilterName] || [];
                      const updatedSelections = currentSelections.filter(item => !item.startsWith('Min:'));
                      if (e.target.value) {
                        updatedSelections.push(`Min: ${e.target.value}`);
                      }
                      setSelectedFilters({
                        ...selectedFilters,
                        [currentFilterName]: updatedSelections
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-2">Maximum</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    placeholder="Max value"
                    onChange={(e) => {
                      const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                      const currentSelections = selectedFilters[currentFilterName] || [];
                      const updatedSelections = currentSelections.filter(item => !item.startsWith('Max:'));
                      if (e.target.value) {
                        updatedSelections.push(`Max: ${e.target.value}`);
                      }
                      setSelectedFilters({
                        ...selectedFilters,
                        [currentFilterName]: updatedSelections
                      });
                    }}
                  />
                </div>
                <div className="w-24">
                  <label className="block font-medium mb-2">Unit</label>
                  <select 
                    className="w-full border rounded p-2"
                    onChange={(e) => {
                      const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                      const currentSelections = selectedFilters[currentFilterName] || [];
                      const updatedSelections = currentSelections.filter(item => !item.startsWith('Unit:'));
                      if (e.target.value) {
                        updatedSelections.push(`Unit: ${e.target.value}`);
                      }
                      setSelectedFilters({
                        ...selectedFilters,
                        [currentFilterName]: updatedSelections
                      });
                    }}
                  >
                    <option value="">Select</option>
                    {currentFilters[filterStep].unitOptions?.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={proceedToNextFilter}
              >
                Continue
              </button>
            </div>
          )}

          {/* Handle simple range filters */}
          {currentFilters[filterStep]?.type === 'range' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-2">Minimum</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    placeholder="Min value"
                    onChange={(e) => {
                      const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                      const currentSelections = selectedFilters[currentFilterName] || [];
                      const updatedSelections = currentSelections.filter(item => !item.startsWith('Min:'));
                      if (e.target.value) {
                        updatedSelections.push(`Min: ${e.target.value}`);
                      }
                      setSelectedFilters({
                        ...selectedFilters,
                        [currentFilterName]: updatedSelections
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-2">Maximum</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    placeholder="Max value"
                    onChange={(e) => {
                      const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                      const currentSelections = selectedFilters[currentFilterName] || [];
                      const updatedSelections = currentSelections.filter(item => !item.startsWith('Max:'));
                      if (e.target.value) {
                        updatedSelections.push(`Max: ${e.target.value}`);
                      }
                      setSelectedFilters({
                        ...selectedFilters,
                        [currentFilterName]: updatedSelections
                      });
                    }}
                  />
                </div>
              </div>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={proceedToNextFilter}
              >
                Continue
              </button>
            </div>
          )}

          {/* Handle location-group filters */}
          {currentFilters[filterStep]?.type === 'location-group' && (
            <div className="space-y-4">
              {/* Toggle options */}
              {currentFilters[filterStep].toggleOptions && (
                <div className="flex gap-2 mb-4">
                  {currentFilters[filterStep].toggleOptions?.map((toggle) => (
                    <button
                      key={toggle}
                      className={`px-4 py-2 rounded border ${
                        toggle === currentFilters[filterStep].defaultToggle 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {toggle}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Location groups */}
              <div className="space-y-6">
                {currentFilters[filterStep].groups?.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h3 className="font-medium mb-3">{group.groupName}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {group.options.map((option, optionIndex) => {
                        const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                        const optionValue = typeof option === 'string' ? option : option.name;
                        const isSelected = selectedFilters[currentFilterName]?.includes(optionValue) || false;
                        return (
                          <label key={optionIndex} className="flex items-center space-x-3 p-3 border rounded hover:bg-green-50">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleMultipleSelection(currentFilterName, optionValue, e.target.checked)}
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
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4"
                onClick={proceedToNextFilter}
              >
                Continue
              </button>
            </div>
          )}

          {/* Handle dropdown filters */}
          {currentFilters[filterStep]?.type === 'dropdown' && (
            <div className="space-y-4">
              <select 
                className="w-full border rounded p-2"
                onChange={(e) => {
                  const currentFilterName = currentFilters[filterStep]?.name || 'unknown';
                  if (e.target.value) {
                    setSelectedFilters({
                      ...selectedFilters,
                      [currentFilterName]: [e.target.value]
                    });
                  }
                }}
              >
                <option value="">Select {currentFilters[filterStep]?.name}</option>
                <option value="Supplier 1">Supplier 1</option>
                <option value="Supplier 2">Supplier 2</option>
                <option value="Supplier 3">Supplier 3</option>
              </select>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={proceedToNextFilter}
              >
                Continue
              </button>
            </div>
          )}
          
          {/* Show progress indicator */}
          <div className="mt-6 text-sm text-gray-600">
            {currentFilterType === 'category' && (
              <p>Category Filters: {filterStep + 1} / {currentFilters.length}</p>
            )}
            {currentFilterType === 'common' && (
              <p>Common Filters: {filterStep + 1} / {currentFilters.length}</p>
            )}
            
            {/* Show selected count for current filter */}
            {currentFilters[filterStep] && (
              <p className="mt-2">
                Selected for {currentFilters[filterStep].name}: {
                  selectedFilters[currentFilters[filterStep].name]?.length || 0
                } item(s)
              </p>
            )}
          </div>
        </div>
      )}
      {step === 3 && !loading && currentFilters.length === 0 && (
        <div>
          <h2 className="mb-4">No filters available</h2>
          <p>Current filter type: {currentFilterType}</p>
          <p>Filter step: {filterStep}</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            onClick={() => setStep(4)}
          >
            Continue
          </button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2 className="mb-4">Upload Product Images</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
              >
                <div className="space-y-2">
                  <div className="text-gray-500">
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <div className="loader mr-2" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-lg">Click to upload images</p>
                        <p className="text-sm">Drag and drop images here, or click to select files</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
                      </>
                    )}
                  </div>
                </div>
              </label>
            </div>
            
            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(3)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Back to Filters
              </button>
              <button
                onClick={() => setStep(5)}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                disabled={uploading}
              >
                {uploadedImages.length > 0 ? 'Continue to Eco Score' : 'Skip Images & Continue to Eco Score'}
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 5 && (
        <div>
          <h2 className="mb-4">Environmental Impact Assessment</h2>
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

            {/* Navigation buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(4)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Back to Images
              </button>
              <button
                onClick={() => setStep(6)}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                disabled={ecoScore === 0}
              >
                Continue to Summary
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 6 && (
        <div>
          <h2 className="mb-4 text-green-600">Registration Complete!</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your selections:</h3>
            <p><strong>Broader Category:</strong> {selectedBroader?.name}</p>
            <p><strong>Category:</strong> {selectedCategory}</p>
            <div className="mt-2">
              <strong>Selected Filters:</strong>
              <ul className="list-disc ml-6 mt-2">
                {Object.entries(selectedFilters).map(([filterName, values]) => (
                  <li key={filterName}>
                    <strong>{filterName}:</strong> {values.join(', ')}
                  </li>
                ))}
              </ul>
            </div>

            {/* Display Eco Score */}
            {ecoScore > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="text-2xl font-bold text-green-600">
                    Eco Score: {ecoScore}/100
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
                  </div>
                </div>
                <div className="text-sm text-green-700">
                  <strong>Environmental Details:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Recyclability: {ecoScoreDetails.recyclability}%</li>
                    <li>Carbon Footprint Score: {ecoScoreDetails.carbonFootprint}/100</li>
                    <li>Sustainable Materials: {ecoScoreDetails.sustainableMaterials}%</li>
                    <li>Local Sourcing: {ecoScoreDetails.localSourcing}%</li>
                    {ecoScoreDetails.certifications.length > 0 && (
                      <li>Certifications: {ecoScoreDetails.certifications.join(', ')}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Display uploaded images in summary */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <strong>Uploaded Images ({uploadedImages.length}):</strong>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {uploadedImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Product ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Image URLs:</strong>
                  <ul className="list-disc ml-6 mt-1">
                    {uploadedImages.map((imageUrl, index) => (
                      <li key={index} className="break-all text-xs">
                        {imageUrl}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              onClick={() => {
                // Reset form
                setStep(1);
                setSelectedBroader(null);
                setSelectedCategory('');
                setSelectedFilters({});
                setFilterStep(0);
                setCurrentFilterType(null);
                setUploadedImages([]);
                setEcoScore(0);
                setEcoScoreDetails({
                  recyclability: 0,
                  carbonFootprint: 0,
                  sustainableMaterials: 0,
                  localSourcing: 0,
                  certifications: []
                });
              }}
            >
              Start Over
            </button>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                const completeData = getCompleteSupplierData();
                console.log('Complete Supplier Data:', completeData);
                alert('Data logged to console! Check browser developer tools.');
              }}
            >
              View Complete Data
            </button>
            <button 
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
              onClick={submitSupplierData}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add a simple CSS loader (you can move this to your CSS file)
const style = document.createElement('style');
style.innerHTML = `
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4ade80;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
