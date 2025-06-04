import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter, Recycle, Leaf, Package, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

type FilterSection = {
  id: string;
  title: string;
  type: 'radio' | 'checkbox' | 'range' | 'multiselect';
  options?: FilterOption[];
  isOpen?: boolean;
  icon?: React.ReactNode;
  rangeConfig?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
};

const mainCategories: FilterSection = {
  id: 'category',
  title: 'Category',
  type: 'radio',
  options: [
    { id: 'bases', label: 'Bases (Containers)', count: 156 },
    { id: 'closures', label: 'Closures & Dispensing Systems', count: 89 },
    { id: 'secondary', label: 'Secondary Packaging', count: 45 },
    { id: 'flexible', label: 'Flexible Packaging', count: 78 },
    { id: 'tertiary', label: 'Tertiary (Shipping) Packaging', count: 34 },
  ],
};

const baseSubcategories: FilterSection = {
  id: 'subcategory-bases',
  title: 'Type',
  type: 'checkbox',
  options: [
    { id: 'bottles', label: 'Bottles', count: 45 },
    { id: 'jars', label: 'Jars', count: 32 },
    { id: 'tubes', label: 'Tubes', count: 28 },
    { id: 'pouches', label: 'Pouches', count: 24 },
    { id: 'vials', label: 'Vials', count: 18 },
    { id: 'tubs', label: 'Tubs', count: 15 },
    { id: 'trays', label: 'Trays', count: 12 },
  ],
};

const commonFilters: FilterSection[] = [
  {
    id: 'sustainability',
    title: 'Sustainability',
    type: 'checkbox',
    icon: <Recycle className="h-5 w-5" />,
    options: [
      { id: 'recycled-content', label: 'Recycled Content', count: 89 },
      { id: 'recycle-ready', label: 'Recycle Ready', count: 145 },
      { id: 'bio-based', label: 'Bio Based Material', count: 56 },
      { id: 'refill-ready', label: 'Refill Ready', count: 34 },
    ],
  },
  {
    id: 'material',
    title: 'Material',
    type: 'checkbox',
    icon: <Package className="h-5 w-5" />,
    options: [
      { id: 'pet', label: 'PET', count: 45 },
      { id: 'hdpe', label: 'HDPE', count: 38 },
      { id: 'pp', label: 'PP', count: 42 },
      { id: 'glass', label: 'Glass', count: 28 },
      { id: 'aluminum', label: 'Aluminum', count: 15 },
    ],
  },
  {
    id: 'end-use',
    title: 'End Use / Industry',
    type: 'checkbox',
    icon: <Leaf className="h-5 w-5" />,
    options: [
      { id: 'cosmetics', label: 'Cosmetics', count: 78 },
      { id: 'personal-care', label: 'Personal Care', count: 92 },
      { id: 'food', label: 'Food & Beverage', count: 65 },
      { id: 'pharma', label: 'Pharmaceutical', count: 45 },
    ],
  },
  {
    id: 'moq',
    title: 'Minimum Order Quantity',
    type: 'range',
    icon: <Package className="h-5 w-5" />,
    rangeConfig: {
      min: 500,
      max: 50000,
      step: 500,
      unit: 'units',
    },
  },
];

const bottleSpecificFilters: FilterSection[] = [
  {
    id: 'neck-size',
    title: 'Neck Size / Thread Finish',
    type: 'checkbox',
    options: [
      { id: '24-410', label: '24/410', count: 25 },
      { id: '28-410', label: '28/410', count: 18 },
      { id: '20-410', label: '20/410', count: 15 },
    ],
  },
  {
    id: 'capacity',
    title: 'Capacity/Volume',
    type: 'range',
    rangeConfig: {
      min: 10,
      max: 1000,
      step: 10,
      unit: 'ml',
    },
  },
];

export const FilterSidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>(['category']);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [rangeValues, setRangeValues] = useState<Record<string, [number, number]>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategories([]);
    setActiveFilters({});
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleFilterToggle = (sectionId: string, optionId: string) => {
    setActiveFilters(prev => {
      const current = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const handleRangeChange = (sectionId: string, values: [number, number]) => {
    setRangeValues(prev => ({
      ...prev,
      [sectionId]: values,
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setActiveFilters({});
    setRangeValues({});
  };

  const renderFilterSection = (section: FilterSection) => {
    const isOpen = openSections.includes(section.id);

    return (
      <div key={section.id} className="border-b border-gray-200 py-4">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleSection(section.id)}
        >
          <div className="flex items-center">
            {section.icon && (
              <span className="mr-2 text-gray-500">{section.icon}</span>
            )}
            <span className="font-medium text-gray-900">{section.title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isOpen && (
          <div className="mt-4 space-y-2">
            {section.type === 'radio' && section.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={section.id}
                  value={option.id}
                  checked={selectedCategory === option.id}
                  onChange={() => handleCategorySelect(option.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-gray-500 text-sm">({option.count})</span>
                )}
              </label>
            ))}

            {section.type === 'checkbox' && section.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={
                    section.id === 'subcategory-bases'
                      ? selectedSubcategories.includes(option.id)
                      : (activeFilters[section.id] || []).includes(option.id)
                  }
                  onChange={() =>
                    section.id === 'subcategory-bases'
                      ? handleSubcategoryToggle(option.id)
                      : handleFilterToggle(section.id, option.id)
                  }
                  className="h-4 w-4 rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-gray-500 text-sm">({option.count})</span>
                )}
              </label>
            ))}

            {section.type === 'range' && section.rangeConfig && (
              <div className="px-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{section.rangeConfig.min}{section.rangeConfig.unit}</span>
                  <span>{section.rangeConfig.max}{section.rangeConfig.unit}</span>
                </div>
                <input
                  type="range"
                  min={section.rangeConfig.min}
                  max={section.rangeConfig.max}
                  step={section.rangeConfig.step}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) => handleRangeChange(section.id, [
                    section.rangeConfig!.min,
                    parseInt(e.target.value)
                  ])}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2 text-green-500" />
          Filters
        </h2>
        {(selectedCategory || Object.keys(activeFilters).length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-green-600 hover:text-green-700 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCategory || Object.keys(activeFilters).length > 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
              {mainCategories.options?.find(opt => opt.id === selectedCategory)?.label}
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-2 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {Object.entries(activeFilters).map(([sectionId, values]) =>
            values.map(value => (
              <span
                key={`${sectionId}-${value}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700"
              >
                {commonFilters.find(f => f.id === sectionId)?.options?.find(opt => opt.id === value)?.label}
                <button
                  onClick={() => handleFilterToggle(sectionId, value)}
                  className="ml-2 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))
          )}
        </div>
      )}

      {/* Main Category Selection */}
      {renderFilterSection(mainCategories)}

      {/* Subcategories (if category is selected) */}
      {selectedCategory === 'bases' && renderFilterSection(baseSubcategories)}

      {/* Common Filters */}
      {selectedCategory && commonFilters.map(filter => renderFilterSection(filter))}

      {/* Specific Filters based on subcategory */}
      {selectedCategory === 'bases' && 
       selectedSubcategories.includes('bottles') &&
       bottleSpecificFilters.map(filter => renderFilterSection(filter))}
    </div>
  );
};