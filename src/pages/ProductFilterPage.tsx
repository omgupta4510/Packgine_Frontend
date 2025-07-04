import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import commonFilters from '../data/commonFilters.json';
import categoryFilters from '../data/categorySpecificFilters.json';
import CountryFlag from 'react-country-flag';
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
// Types for supplier data from backend
interface SupplierData {
  _id: string;
  name?: string;
  broaderCategory: string;
  category: string;
  filters: { [key: string]: string[] };
  images: string[];
  ecoScore: number;
  ecoScoreDetails: {
    recyclability: number;
    carbonFootprint: number;
    sustainableMaterials: number;
    localSourcing: number;
    certifications: string[];
  };
  submittedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductData {
  id: string;
  title: string;
  category: string;
  image: string;
  material: string;
  shape: string;
  sustainability: string;
  location: string;
  color: string;
  moq: string;
  size: string;
  sizeUnit: string;
  endUse: string[];
  supplier: string;
  ecoScore: number;
  ecoScoreDetails: {
    recyclability: number;
    carbonFootprint: number;
    sustainableMaterials: number;
    localSourcing: number;
    certifications: string[];
  };
}

function getFiltersForCategory(category: string) {
  if (category === 'all') {
    // Only show common filters for 'all products' view
    return [...commonFilters.filters];
  }
  // Find category-specific filters
  const cat = categoryFilters.categories.find((c: any) => c.category.toLowerCase().replace(/\s+/g, '-') === category);
  const specificFilters = cat && cat.filters ? [...cat.filters] : [];
  // Get all common filters
  const common = [...commonFilters.filters];
  // Merge: specific filters first, then common filters (skip duplicates by name)
  const specificNames = new Set(specificFilters.map((f: any) => f.name));
  const merged = [
    ...specificFilters,
    ...common.filter((f: any) => !specificNames.has(f.name)),
  ];
  return merged;
}
function normalizeKey(str: string) {
  return str.toLowerCase().replace(/\s+/g, '');
}

const countryCodeToName: Record<string, string> = {};
const locationFilter = commonFilters.filters.find(f => f.name === "Location");
if (locationFilter && locationFilter.groups) {
  locationFilter.groups.forEach((group: any) => {
    group.options.forEach((country: any) => {
      countryCodeToName[country.code.toLowerCase()] = country.name;
    });
  });
}

function productMatchesFilters(product: any, filters: Record<string, any>) {
  console.log('Checking product match:', { product: product.title, filters });
  
  for (const key in filters) {
    const value = filters[key];
    if (!value || value.length === 0) continue;

    // Special case for location group filter
    if (key === 'locationcountries') {
      // Map selected codes to names for comparison
      const selectedNames = value
        .map((code: string) => countryCodeToName[code.toLowerCase()]?.toLowerCase())
        .filter(Boolean);
      if (!selectedNames.includes(String(product.location).toLowerCase())) {
        console.log('Location filter failed:', { selectedNames, productLocation: product.location });
        return false;
      }
      continue;
    }

    // Handle min/max for range filters
    if (key.endsWith('_min') || key.endsWith('_max')) {
      const baseKey = key.replace(/_(min|max)$/, '');
      const productKey = Object.keys(product).find(
        k => normalizeKey(k) === normalizeKey(baseKey)
      );
      if (!productKey) continue;
      const productValue = Number(product[productKey]);
      if (key.endsWith('_min') && value !== '' && !isNaN(Number(value))) {
        if (productValue < Number(value)) {
          console.log('Min filter failed:', { productValue, minValue: value });
          return false;
        }
      }
      if (key.endsWith('_max') && value !== '' && !isNaN(Number(value))) {
        if (productValue > Number(value)) {
          console.log('Max filter failed:', { productValue, maxValue: value });
          return false;
        }
      }
      continue;
    }

    // Find the matching product property
    const normalizedKey = normalizeKey(key);
    const productKey = Object.keys(product).find(
      k => normalizeKey(k) === normalizedKey
    );
    
    if (!productKey) {
      console.log('Product key not found:', { key, normalizedKey, productKeys: Object.keys(product) });
      continue;
    }

    const productValue = product[productKey];
    console.log('Comparing values:', { filterKey: key, productKey, productValue, filterValue: value });

    if (Array.isArray(value)) {
      // Filter value is an array (multi-select)
      if (Array.isArray(productValue)) {
        // Product value is also an array
        const matches = value.some((filterVal) => 
          productValue.some((prodVal: any) => 
            String(prodVal).toLowerCase().includes(String(filterVal).toLowerCase()) ||
            String(filterVal).toLowerCase().includes(String(prodVal).toLowerCase())
          )
        );
        if (!matches) {
          console.log('Array-to-array filter failed:', { productValue, filterValue: value });
          return false;
        }
      } else {
        // Product value is a single value
        const matches = value.some((filterVal) => 
          String(productValue).toLowerCase().includes(String(filterVal).toLowerCase()) ||
          String(filterVal).toLowerCase().includes(String(productValue).toLowerCase())
        );
        if (!matches) {
          console.log('Array-to-single filter failed:', { productValue, filterValue: value });
          return false;
        }
      }
    } else {
      // Filter value is a single value
      if (Array.isArray(productValue)) {
        // Product value is an array
        const matches = productValue.some((prodVal: any) => 
          String(prodVal).toLowerCase().includes(String(value).toLowerCase()) ||
          String(value).toLowerCase().includes(String(prodVal).toLowerCase())
        );
        if (!matches) {
          console.log('Single-to-array filter failed:', { productValue, filterValue: value });
          return false;
        }
      } else {
        // Both are single values
        const matches = String(productValue).toLowerCase().includes(String(value).toLowerCase()) ||
                       String(value).toLowerCase().includes(String(productValue).toLowerCase());
        if (!matches) {
          console.log('Single-to-single filter failed:', { productValue, filterValue: value });
          return false;
        }
      }
    }
  }
  
  console.log('Product matches all filters');
  return true;
}

const ProductFilterPage = () => {
  const { filterValue } = useParams<{ filterValue: string }>();
  const [filterState, setFilterState] = useState<Record<string, any>>({});
  const [openFilterIndexes, setOpenFilterIndexes] = useState<number[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtersToShow = getFiltersForCategory(filterValue || '');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from backend...');
        
        // Fetch both approved and pending products
        const [approvedResponse, pendingResponse] = await Promise.all([
          fetch(`${API_URL}/api/products?limit=100&status=approved`),
          fetch(`${API_URL}/api/products?limit=100&status=pending`)
        ]);
        
        console.log('API response statuses:', {
          approved: approvedResponse.status,
          pending: pendingResponse.status
        });
        
        const [approvedResult, pendingResult] = await Promise.all([
          approvedResponse.json(),
          pendingResponse.json()
        ]);
        
        console.log('API results:', { approvedResult, pendingResult });
        
        const allProducts = [
          ...(approvedResult.products || []),
          ...(pendingResult.products || [])
        ];
        
        console.log('All products combined:', allProducts);
        
        if (allProducts.length > 0) {
          // Transform product data to match expected format
          const transformedProducts = allProducts.map(transformProductToDisplayFormat);
          console.log('Transformed products:', transformedProducts);
          setSuppliers(transformedProducts);
        } else {
          setError('No products found');
          console.error('No products returned from API');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform product data from backend to display format
  const transformProductToDisplayFormat = (product: any): SupplierData => {
    console.log('Transforming product:', product);
    
    // Initialize merged filters object
    const mergedFilters: { [key: string]: any[] } = {};
    
    // Helper to merge filter arrays - handle the new schema structure
    function mergeFilterArray(filterArray: any[], arrayName: string) {
      console.log(`Processing ${arrayName}:`, filterArray);
      
      if (Array.isArray(filterArray)) {
        filterArray.forEach((filterItem, index) => {
          console.log(`${arrayName}[${index}]:`, filterItem);
          
          if (filterItem && typeof filterItem === 'object' && !Array.isArray(filterItem)) {
            // Handle objects with filter names as keys
            Object.entries(filterItem).forEach(([filterName, filterValues]) => {
              console.log(`Filter: ${filterName}, Values:`, filterValues);
              
              if (!mergedFilters[filterName]) {
                mergedFilters[filterName] = [];
              }
              
              if (Array.isArray(filterValues)) {
                // If it's already an array, spread it
                mergedFilters[filterName].push(...filterValues);
              } else if (filterValues !== null && filterValues !== undefined) {
                // If it's a single value, push it
                mergedFilters[filterName].push(filterValues);
              }
            });
          }
        });
      }
    }
    
    // Process categoryFilters and commonFilters
    mergeFilterArray(product.categoryFilters || [], 'categoryFilters');
    mergeFilterArray(product.commonFilters || [], 'commonFilters');
    
    // Add default/legacy fields for compatibility - only if not already set
    if (!mergedFilters.Material) {
      mergedFilters.Material = [product.specifications?.material || 'Not specified'];
    }
    if (!mergedFilters.Location) {
      mergedFilters.Location = [product.supplier?.address?.country || 'Not specified'];
    }
    if (!mergedFilters['Minimum Order']) {
      mergedFilters['Minimum Order'] = [`${product.specifications?.minimumOrderQuantity || 1} units`];
    }
    if (!mergedFilters.Supplier) {
      mergedFilters.Supplier = [product.supplier?.companyName || 'Unknown Supplier'];
    }
    if (!mergedFilters.Price) {
      mergedFilters.Price = [`$${product.pricing?.basePrice || 0}`];
    }
    
    console.log('Final merged filters:', mergedFilters);

    return {
      _id: product._id,
      name: product.name || '',
      broaderCategory: product.broaderCategory || '',
      category: product.category || '',
      filters: mergedFilters,
      images: product.images || [],
      ecoScore: product.ecoScore || 0,
      ecoScoreDetails: product.ecoScoreDetails || {
        recyclability: 0,
        carbonFootprint: 0,
        sustainableMaterials: 0,
        localSourcing: 0,
        certifications: []
      },
      submittedAt: product.createdAt || '',
      status: product.status || 'pending',
      createdAt: product.createdAt || '',
      updatedAt: product.updatedAt || ''
    };
  };

  // Transform supplier data to product format for display
  const transformSupplierToProduct = (supplier: SupplierData): ProductData => {
    const filters = supplier.filters || {};
    console.log('Transforming supplier to product:', { supplier: supplier.name, filters });
    
    return {
      id: supplier._id,
      title: supplier.name || `${supplier.category} Product`,
      category: supplier.category,
      image: supplier.images?.[0] || '/placeholder-image.png',
      material: filters.Material?.join(', ') || 'Not specified',
      shape: filters.Shape?.join(', ') || filters.Form?.join(', ') || 'Not specified',
      sustainability: filters.Sustainability?.join(', ') || filters['Eco-Friendly']?.join(', ') || 'Not specified',
      location: filters.Location?.join(', ') || 'Not specified',
      color: filters.Color?.join(', ') || 'Not specified',
      moq: filters['Minimum Order']?.join(' - ') || filters.MOQ?.join(' - ') || 'Contact supplier',
      size: (() => {
        const sizeData = filters.Size || filters.Capacity || filters.Volume || [];
        if (sizeData.length === 0) return 'Not specified';
        
        // Handle range format (Min: X, Max: Y)
        const minVal = sizeData.find((s: string) => s.startsWith('Min:'))?.replace('Min: ', '');
        const maxVal = sizeData.find((s: string) => s.startsWith('Max:'))?.replace('Max: ', '');
        
        if (minVal && maxVal) {
          return `${minVal} - ${maxVal}`;
        } else if (minVal) {
          return `${minVal}+`;
        } else if (maxVal) {
          return `Up to ${maxVal}`;
        } else {
          return sizeData.join(', ');
        }
      })(),
      sizeUnit: filters.Size?.find((s: string) => s.startsWith('Unit:'))?.replace('Unit: ', '') || 
                filters.Capacity?.find((s: string) => s.startsWith('Unit:'))?.replace('Unit: ', '') || 
                'units',
      endUse: filters['End Use'] || filters.Application || filters.Purpose || [],
      supplier: filters.Supplier?.join(', ') || 'Supplier not specified',
      ecoScore: supplier.ecoScore || 0,
      ecoScoreDetails: supplier.ecoScoreDetails || {
        recyclability: 0,
        carbonFootprint: 0,
        sustainableMaterials: 0,
        localSourcing: 0,
        certifications: []
      }
    };
  };

  // Get products from suppliers data
  const getAllProducts = (): ProductData[] => {
    return suppliers.map(transformSupplierToProduct);
  };

  // Handler for filter value changes
  const handleFilterChange = (filterName: string, value: any) => {
    setFilterState((prev) => ({ ...prev, [filterName.toLowerCase()]: value }));
  };

  return (
    <div className="flex bg-gray-50 my-10 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-4 py-6 mt-8 rounded-xl shadow-lg ml-2 h-fit sticky top-8 transition-all duration-300">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Filters</h2>
        </div>
        <div className="space-y-4">
          {filtersToShow.map((filter: any, idx: number) => (
            <div key={filter.name} className="mb-1">
              <details className="group" open={openFilterIndexes.includes(idx)}>
                <summary
                  className="flex items-center justify-between cursor-pointer select-none py-1 px-1 rounded hover:bg-green-50 transition text-xs font-semibold text-gray-800"
                  onClick={e => {
                    e.preventDefault();
                    setOpenFilterIndexes(prev =>
                      prev.includes(idx)
                        ? prev.filter(i => i !== idx)
                        : [...prev, idx]
                    );
                  }}
                >
                  <span className="flex items-center gap-1">
                    {filter.name}
                    {/* Show count of selected options for this filter */}
                    {(() => {
                      let count = 0;
                      if (filter.type === 'checkbox-group') {
                        if (filter.options && Array.isArray(filterState[filter.name.toLowerCase()])) {
                          count = filterState[filter.name.toLowerCase()].length;
                        } else if (filter.groups && Array.isArray(filterState[filter.name])) {
                          count = filterState[filter.name].length;
                        }
                      } else if (filter.type === 'location-group' && Array.isArray(filterState.locationcountries)) {
                        count = filterState.locationcountries.length;
                      } else if (filter.name === 'Color' && Array.isArray(filterState[filter.name])) {
                        count = filterState[filter.name].length;
                      }
                      return count > 0 ? (
                        <span className="ml-1 text-green-600 text-xs font-semibold">({count})</span>
                      ) : null;
                    })()}
                  </span>
                  <svg className="w-3 h-3 ml-2 text-green-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                </summary>
                {openFilterIndexes.includes(idx) && (
                  <div className="mt-1 space-y-1">
                    {/* Only render default checkbox-group UI if not Color */}
                    {filter.type === 'checkbox-group' && filter.options && filter.name !== 'Color' && filter.options.map((opt: string) => (
                      <button
                        key={opt}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-200 text-green-700 font-medium transition group w-full text-left text-xs ${Array.isArray(filterState[filter.name.toLowerCase()]) && filterState[filter.name.toLowerCase()].includes(opt) ? 'bg-green-50 border-green-300' : ''}`}
                        style={{ boxShadow: '0 1px 2px 0 rgba(60, 180, 80, 0.04)' }}
                        onClick={() => {
                          const prev = Array.isArray(filterState[filter.name.toLowerCase()]) ? filterState[filter.name.toLowerCase()] : [];
                          handleFilterChange(
                            filter.name.toLowerCase(),
                            prev.includes(opt) ? prev.filter((v: string) => v !== opt) : [...prev, opt]
                          );
                        }}
                        type="button"
                      >
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-green-50 group-hover:bg-green-100">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            {Array.isArray(filterState[filter.name.toLowerCase()]) && filterState[filter.name.toLowerCase()].includes(opt) && (
                              <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            )}
                          </svg>
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                    {/* Grouped checkbox-group UI (not for Color) */}
                    {filter.type === 'checkbox-group' && filter.groups && filter.name !== 'Color' && filter.groups.map((group: any) => (
                      <div key={group.groupName} className="mt-1">
                        <div className="font-semibold text-gray-700 mb-1 mt-1 text-xs pl-1">{group.groupName}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {group.options.map((opt: string) => (
                            <button
                              key={opt}
                              className={`flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-200 text-green-700 font-medium transition group w-full text-left text-xs ${Array.isArray(filterState[filter.name.toLowerCase()]) && filterState[filter.name.toLowerCase()].includes(opt) ? 'bg-green-50 border-green-300' : ''}`}
                              style={{ boxShadow: '0 1px 2px 0 rgba(60, 180, 80, 0.04)' }}
                              onClick={() => {
                                const prev = Array.isArray(filterState[filter.name.toLowerCase()]) ? filterState[filter.name.toLowerCase()] : [];
                                handleFilterChange(
                                  filter.name.toLowerCase(),
                                  prev.includes(opt) ? prev.filter((v: string) => v !== opt) : [...prev, opt]
                                );
                              }}
                            >
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-green-50 group-hover:bg-green-100">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                                  {Array.isArray(filterState[filter.name.toLowerCase()]) && filterState[filter.name.toLowerCase()].includes(opt) && (
                                    <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  )}
                                </svg>
                              </span>
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {filter.type === 'dropdown' && filter.options && (
                      <select
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 text-green-700 bg-gray-50 text-xs"
                        value={filterState[filter.name] || ''}
                        onChange={e => handleFilterChange(filter.name, e.target.value)}
                      >
                        <option value="">Select {filter.name}</option>
                        {filter.options.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {filter.type === 'range' && (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          className="border rounded px-1 py-1 w-20 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                          placeholder="Min"
                          value={filterState[`${filter.name.toLowerCase()}_min`] || ''}
                          onChange={e => handleFilterChange(`${filter.name.toLowerCase()}_min`, e.target.value)}
                        />
                        <span>-</span>
                        <input
                          type="number"
                          className="border rounded px-1 py-1 w-20 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                          placeholder="Max"
                          value={filterState[`${filter.name.toLowerCase()}_max`] || ''}
                          onChange={e => handleFilterChange(`${filter.name.toLowerCase()}_max`, e.target.value)}
                        />
                      </div>
                    )}
                    {filter.type === 'range-or-exact' && (
                      <div>
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full mb-1 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                          placeholder={`Exact ${filter.name.toLowerCase()}`}
                          value={filterState[filter.name.toLowerCase()] || ''}
                          onChange={e => handleFilterChange(filter.name.toLowerCase(), e.target.value)}
                        />
                        <div className="flex items-center space-x-1 mb-1">
                          <input
                            type="number"
                            className="border rounded px-1 py-1 w-16 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                            placeholder="Min"
                            value={filterState[`${filter.name.toLowerCase()}_min`] || ''}
                            onChange={e => handleFilterChange(`${filter.name.toLowerCase()}_min`, e.target.value)}
                          />
                          <span>-</span>
                          <input
                            type="number"
                            className="border rounded px-1 py-1 w-16 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                            placeholder="Max"
                            value={filterState[`${filter.name.toLowerCase()}_max`] || ''}
                            onChange={e => handleFilterChange(`${filter.name.toLowerCase()}_max`, e.target.value)}
                          />
                        </div>
                        {filter.unitOptions && (
                          <select
                            className="border rounded px-1 py-1 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                            value={filterState[`${filter.name.toLowerCase()}_unit`] || filter.unitOptions[0]}
                            onChange={e => handleFilterChange(`${filter.name.toLowerCase()}_unit`, e.target.value)}
                          >
                            {filter.unitOptions.map((unit: string) => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                    {filter.type === 'composite' && filter.fields && (
                      <div className="space-y-1">
                        {filter.fields.map((field: any) => {
                          const compositeKey = `${normalizeKey(filter.name)}_${normalizeKey(field.label)}`;
                          return (
                            <div key={field.label} className="flex items-center space-x-1">
                              <label className="w-20 text-xs text-gray-700">{field.label}{field.unit ? ` (${field.unit})` : ''}:</label>
                              {field.type === 'range' ? (
                                <input
                                  type="number"
                                  className="border rounded px-1 py-1 w-16 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                                  placeholder={field.label}
                                  value={filterState[compositeKey] || ''}
                                  onChange={e => handleFilterChange(compositeKey, e.target.value)}
                                />
                              ) : field.type === 'dropdown' ? (
                                <select
                                  className="border rounded px-1 py-1 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                                  value={filterState[compositeKey] || ''}
                                  onChange={e => handleFilterChange(compositeKey, e.target.value)}
                                >
                                  <option value="">Select {field.label}</option>
                                  {field.options && field.options.map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  className="border rounded px-1 py-1 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-xs"
                                  placeholder={field.label}
                                  value={filterState[compositeKey] || ''}
                                  onChange={e => handleFilterChange(compositeKey, e.target.value)}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* Location filter (custom UI) */}
                    {filter.type === 'location-group' && (
                      <div>
                        {/* Toggle Switch */}
                        <div className="flex items-center gap-2 mb-2">
                          {filter.toggleOptions.map((opt: string) => (
                            <button
                              key={opt}
                              className={`px-2 py-1 rounded-full text-xs font-semibold border transition ${filterState.locationToggle === opt || (!filterState.locationToggle && filter.defaultToggle === opt) ? 'bg-green-100 text-green-700 border-green-400' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                              onClick={() => handleFilterChange('locationToggle', opt)}
                              type="button"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {/* Country Groups */}
                        {filter.groups.map((group: any) => (
                          <div key={group.groupName} className="mb-2">
                            <div className="font-semibold text-gray-700 mb-1 mt-1 text-xs pl-1">{group.groupName}</div>
                            <div className="grid grid-cols-2 gap-1">
                              {group.options.map((country: any) => (
                                <button
                                  key={country.code}
                                  className={`flex items-center gap-2 px-2 py-1 rounded-full border text-xs font-medium transition w-full text-left ${Array.isArray(filterState.locationcountries) && filterState.locationcountries.includes(country.code) ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-700'}`}
                                  onClick={() => {
                                    const prev = Array.isArray(filterState.locationcountries) ? filterState.locationcountries : [];
                                    handleFilterChange(
                                      'locationcountries',
                                      prev.includes(country.code)
                                        ? prev.filter((v: string) => v !== country.code)
                                        : [...prev, country.code]
                                    );
                                  }}
                                  type="button"
                                >
                                  <span className="text-lg">
                                    <CountryFlag countryCode={country.code.toUpperCase()} svg style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }} title={country.name} />
                                  </span>
                                  <span>{country.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Color filter (custom UI, no checkboxes, just color swatch pills */}
                    {filter.name === 'Color' && filter.type === 'checkbox-group' && filter.options && (
                      <div className="grid grid-cols-2 gap-2">
                        {filter.options.map((color: string) => (
                          <button
                            key={color}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium transition w-full text-left shadow-sm
                              ${Array.isArray(filterState[filter.name]) && filterState[filter.name].includes(color)
                                ? 'ring-2 ring-green-400 border-green-400 bg-green-50 text-green-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
                            `}
                            style={{ boxShadow: '0 1px 2px 0 rgba(60, 180, 80, 0.04)' }}
                            onClick={() => {
                              const prev = Array.isArray(filterState[filter.name]) ? filterState[filter.name] : [];
                              handleFilterChange(
                                filter.name,
                                prev.includes(color) ? prev.filter((v: string) => v !== color) : [...prev, color]
                              );
                            }}
                            type="button"
                          >
                            <span
                              className="inline-block w-5 h-5 rounded-full border border-gray-200 mr-2"
                              style={{ backgroundColor: getColorHex(color) }}
                            ></span>
                            <span>{color}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </details>
              {/* Divider between filters, except last */}
              {idx !== filtersToShow.length - 1 && <hr className="my-3 border-gray-100" />}
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button className="text-green-600 hover:underline text-xs font-medium" onClick={() => setFilterState({})}>
            Clear
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        <div className="mt-8">
          <div className="flex items-center mb-4 text-sm text-gray-500 space-x-2">
            <Link to="/products" className="hover:text-green-600">All Products</Link>
            <span>&gt;</span>
            <span className="text-green-700 font-semibold capitalize">
              {filterValue?.replace(/-/g, ' ')}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-6 capitalize">
            {filterValue?.replace(/-/g, ' ')}
          </h1>
          {/* Selected Filters Chips */}
<div className="flex flex-wrap gap-2 mb-6">
  {filtersToShow.flatMap((filter: any) => {
    // Normalize filter key for state lookup
    const key = filter.name.toLowerCase();
    const value = filterState[key];

    // For checkbox-group (multi-select)
    if (filter.type === 'checkbox-group' && Array.isArray(value) && value.length > 0) {
      return value.map((v: string) => (
        <span
          key={key + v}
          className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
        >
          {v}
          <button
            className="ml-2 text-green-500 hover:text-green-700"
            onClick={() => {
              // Remove this value from the filter
              const newArr = value.filter((item: string) => item !== v);
              handleFilterChange(key, newArr);
            }}
            aria-label={`Remove ${v}`}
            type="button"
          >
            &times;
          </button>
        </span>
      ));
    }

    // For single-value filters (dropdown, range-or-exact, etc.)
    if (
      (filter.type === 'dropdown' || filter.type === 'range-or-exact' || filter.type === 'range') &&
      value &&
      value !== ''
    ) {
      return (
        <span
          key={key}
          className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
        >
          {filter.name}: {value}
          <button
            className="ml-2 text-green-500 hover:text-green-700"
            onClick={() => handleFilterChange(key, '')}
            aria-label={`Remove ${filter.name}`}
            type="button"
          >
            &times;
          </button>
        </span>
      );
    }

    // For location group (multi-select)
    if (filter.type === 'location-group' && Array.isArray(filterState.locationcountries) && filterState.locationcountries.length > 0) {
      return filterState.locationcountries.map((code: string) => (
        <span
          key={'locationcountries' + code}
          className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
        >
          {countryCodeToName[code.toLowerCase()] || code}
          <button
            className="ml-2 text-green-500 hover:text-green-700"
            onClick={() => {
              const newArr = filterState.locationcountries.filter((item: string) => item !== code);
              handleFilterChange('locationcountries', newArr);
            }}
            aria-label={`Remove ${code}`}
            type="button"
          >
            &times;
          </button>
        </span>
      ));
    }

    return null;
  })}
</div>
          
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="loader mb-4" />
              <p className="text-gray-600">Loading Prodcuts...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {/* Product grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(() => {
                const allProducts = getAllProducts();
                const filteredProducts = filterValue === 'all'
                  ? allProducts.filter(product => productMatchesFilters(product, filterState))
                  : allProducts.filter(product =>
                      product.category?.toLowerCase() === (filterValue || '').toLowerCase()
                    ).filter(product => productMatchesFilters(product, filterState));

                if (filteredProducts.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                      <p className="text-gray-600 mb-4">
                        {suppliers.length === 0 
                          ? "No suppliers have registered yet."
                          : "No suppliers match your selected filters. Try adjusting your filters."
                        }
                      </p>
                      {filterState && Object.keys(filterState).length > 0 && (
                        <button 
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          onClick={() => setFilterState({})}
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  );
                }

                return filteredProducts.map(product => (
                  <button
                    key={product.id}
                    className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col text-left hover:shadow-lg transition cursor-pointer"
                    onClick={() => window.location.href = `/products/${product.id}`}
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-40 object-contain mb-3 bg-gray-50 rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.png';
                      }}
                    />
                    <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
                    <div className="text-xs text-gray-500 mb-2">{product.material} &bull; {product.shape}</div>
                    
                    {/* Eco Score Badge */}
                    {product.ecoScore > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.ecoScore >= 80 ? 'bg-green-100 text-green-800' :
                            product.ecoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            product.ecoScore >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>
                            🌱 Eco Score: {product.ecoScore}/100
                          </div>
                        </div>
                        <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              product.ecoScore >= 80 ? 'bg-green-500' :
                              product.ecoScore >= 60 ? 'bg-yellow-500' :
                              product.ecoScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${product.ecoScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{product.sustainability}</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{product.location}</span>
                      <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">{product.color}</span>
                    </div>
                    <div className="text-xs mb-1">
                      <strong>MOQ:</strong> {product.moq}
                    </div>
                    <div className="text-xs mb-1">
                      <strong>Size:</strong> {product.size} {product.sizeUnit}
                    </div>
                    <div className="text-xs mb-1">
                      <strong>End Use:</strong> {product.endUse.join(', ')}
                    </div>
                    <div className="text-xs mb-1">
                      <strong>Supplier:</strong> {product.supplier}
                    </div>
                  </button>
                ));
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductFilterPage;

// Helper for color swatch
function getColorHex(color: string) {
  const map: Record<string, string> = {
    Amber: '#a86c1d', Black: '#111', Blue: '#4f8cff', Clear: '#f5f5f5', Green: '#7ed957', Grey: '#bdbdbd', Gray: '#bdbdbd',
    Natural: '#f3eac2', Purple: '#b97aff', Pink: '#f7b6d2', Red: '#e74c3c', White: '#fff', Yellow: '#ffe066', Gold: '#ffd700',
    Silver: '#c0c0c0', Orange: '#ffa500'
  };
  return map[color] || '#eee';
}

// Add CSS for loader
const style = document.createElement('style');
style.innerHTML = `
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4ade80;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('#product-filter-styles')) {
  style.id = 'product-filter-styles';
  document.head.appendChild(style);
}