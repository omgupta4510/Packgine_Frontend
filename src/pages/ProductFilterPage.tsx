import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import commonFilters from '../data/commonFilters.json';
import categoryFilters from '../data/categorySpecificFilters.json';
import CountryFlag from 'react-country-flag';

import { mockProducts } from '../data/mockProducts';

function getFiltersForCategory(category: string) {
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
        if (productValue < Number(value)) return false;
      }
      if (key.endsWith('_max') && value !== '' && !isNaN(Number(value))) {
        if (productValue > Number(value)) return false;
      }
      continue;
    }

    const normalizedKey = normalizeKey(key);
    const productKey = Object.keys(product).find(
      k => normalizeKey(k) === normalizedKey
    );
    if (!productKey) continue;

    const productValue = product[productKey];

    if (Array.isArray(value)) {
      if (Array.isArray(productValue)) {
        if (!value.some((v) => productValue.map((p: string) => p.toLowerCase()).includes(v.toLowerCase()))) return false;
      } else {
        if (!value.map((v: string) => v.toLowerCase()).includes(String(productValue).toLowerCase())) return false;
      }
    } else {
      if (typeof productValue === 'string' && productValue.toLowerCase() !== String(value).toLowerCase()) return false;
    }
  }
  return true;
}

const ProductFilterPage = () => {
  const { filterValue } = useParams<{ filterValue: string }>();
  const [filterState, setFilterState] = useState<Record<string, any>>({});
  const [openFilterIndexes, setOpenFilterIndexes] = useState<number[]>([]);
  const filtersToShow = getFiltersForCategory(filterValue || '');

  // Handler for filter value changes
  const handleFilterChange = (filterName: string, value: any) => {
    setFilterState((prev) => ({ ...prev, [filterName.toLowerCase()]: value }));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
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
          
          {/* Product grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
     {mockProducts.filter(product =>
    product.category?.toLowerCase() === (filterValue || '').toLowerCase()
  ).filter(product => productMatchesFilters(product, filterState)).map(product => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-40 object-contain mb-3 bg-gray-50 rounded"
          />
          <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
          <div className="text-xs text-gray-500 mb-2">{product.material} &bull; {product.shape}</div>
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
        </div>
      ))}
    </div>
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