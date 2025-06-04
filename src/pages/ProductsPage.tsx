import React, { useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { ProductCard } from '../components/ui/ProductCard';
import { CategoryGrid } from '../components/products/CategoryGrid';
import { Button } from '../components/ui/Button';
import { Sliders, Check, ChevronDown, ChevronUp } from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    name: 'Recyclable Paper Pouch',
    image: 'https://images.pexels.com/photos/7262764/pexels-photo-7262764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'EcoPack Solutions',
    sustainabilityScore: 92,
    material: 'Recycled Paper',
    minOrderQuantity: 1000,
    location: 'USA',
  },
  {
    id: '2',
    name: 'Compostable Food Container',
    image: 'https://images.pexels.com/photos/5217954/pexels-photo-5217954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Green Earth Packaging',
    sustainabilityScore: 88,
    material: 'Bagasse',
    minOrderQuantity: 500,
    location: 'EU',
  },
  {
    id: '3',
    name: 'Biodegradable Bottle',
    image: 'https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'NaturePack',
    sustainabilityScore: 85,
    material: 'PLA',
    minOrderQuantity: 2000,
    location: 'USA',
  },
  {
    id: '4',
    name: 'PCR Plastic Jar',
    image: 'https://images.pexels.com/photos/7262444/pexels-photo-7262444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Circular Packaging Co.',
    sustainabilityScore: 75,
    material: 'PCR Plastic',
    minOrderQuantity: 1000,
    location: 'Asia',
  },
  {
    id: '5',
    name: 'Hemp Fiber Box',
    image: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Plant Based Packing',
    sustainabilityScore: 95,
    material: 'Hemp',
    minOrderQuantity: 250,
    location: 'EU',
  },
  {
    id: '6',
    name: 'Refillable Glass Container',
    image: 'https://images.pexels.com/photos/5446310/pexels-photo-5446310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Forever Packaging',
    sustainabilityScore: 90,
    material: 'Glass',
    minOrderQuantity: 500,
    location: 'USA',
  },
  {
    id: '7',
    name: 'Ocean-Bound Plastic Tube',
    image: 'https://images.pexels.com/photos/6823502/pexels-photo-6823502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Ocean Rescue Packaging',
    sustainabilityScore: 82,
    material: 'Recycled Ocean Plastic',
    minOrderQuantity: 1000,
    location: 'Asia',
  },
  {
    id: '8',
    name: 'Mushroom Mycelium Container',
    image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Fungi Packaging',
    sustainabilityScore: 98,
    material: 'Mycelium',
    minOrderQuantity: 500,
    location: 'EU',
  },
  {
    id: '9',
    name: 'Bamboo Jar Lids',
    image: 'https://images.pexels.com/photos/6045353/pexels-photo-6045353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Bamboo Packaging Co.',
    sustainabilityScore: 89,
    material: 'Bamboo',
    minOrderQuantity: 1000,
    location: 'Asia',
  },
  {
    id: '10',
    name: 'Sugarcane Pulp Tray',
    image: 'https://images.pexels.com/photos/5217831/pexels-photo-5217831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Green Earth Packaging',
    sustainabilityScore: 92,
    material: 'Sugarcane',
    minOrderQuantity: 500,
    location: 'USA',
  },
  {
    id: '11',
    name: 'Cork Container',
    image: 'https://images.pexels.com/photos/5691694/pexels-photo-5691694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Natural Materials Co.',
    sustainabilityScore: 94,
    material: 'Cork',
    minOrderQuantity: 250,
    location: 'EU',
  },
  {
    id: '12',
    name: 'Seaweed Film Wrap',
    image: 'https://images.pexels.com/photos/6823502/pexels-photo-6823502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: 'Ocean Solutions',
    sustainabilityScore: 96,
    material: 'Seaweed',
    minOrderQuantity: 1000,
    location: 'Asia',
  },
];

type FilterSection = {
  title: string;
  options: { id: string; label: string }[];
  isOpen: boolean;
};

export const ProductsPage = () => {
  const [showCategories, setShowCategories] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterSections, setFilterSections] = useState<FilterSection[]>([
    {
      title: 'Material Type',
      options: [
        { id: 'recycled-paper', label: 'Recycled Paper' },
        { id: 'bagasse', label: 'Bagasse' },
        { id: 'pla', label: 'PLA' },
        { id: 'pcr-plastic', label: 'PCR Plastic' },
        { id: 'hemp', label: 'Hemp' },
        { id: 'glass', label: 'Glass' },
        { id: 'ocean-plastic', label: 'Ocean Plastic' },
        { id: 'mycelium', label: 'Mycelium' },
      ],
      isOpen: true,
    },
    {
      title: 'Sustainability Score',
      options: [
        { id: 'score-90-plus', label: '90+ Excellent' },
        { id: 'score-80-89', label: '80-89 Very Good' },
        { id: 'score-70-79', label: '70-79 Good' },
        { id: 'score-below-70', label: 'Below 70' },
      ],
      isOpen: true,
    },
    {
      title: 'Location',
      options: [
        { id: 'usa', label: 'Made in USA' },
        { id: 'eu', label: 'Made in EU' },
        { id: 'asia', label: 'Made in Asia' },
      ],
      isOpen: true,
    },
    {
      title: 'Minimum Order Quantity',
      options: [
        { id: 'moq-under-500', label: 'Under 500 units' },
        { id: 'moq-500-1000', label: '500-1000 units' },
        { id: 'moq-1000-plus', label: 'Over 1000 units' },
      ],
      isOpen: false,
    },
  ]);

  const toggleFilterSection = (index: number) => {
    const updatedSections = [...filterSections];
    updatedSections[index].isOpen = !updatedSections[index].isOpen;
    setFilterSections(updatedSections);
  };

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(id => id !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const filteredProducts = mockProducts.filter(product => {
    if (activeFilters.length === 0) return true;
    
    const matchesMaterial = activeFilters.some(filter => 
      filter.toLowerCase().includes(product.material.toLowerCase())
    );
    
    const matchesLocation = activeFilters.some(filter => 
      (filter === 'usa' && product.location === 'USA') ||
      (filter === 'eu' && product.location === 'EU') ||
      (filter === 'asia' && product.location === 'Asia')
    );
    
    const matchesScore = activeFilters.some(filter => {
      if (filter === 'score-90-plus') return product.sustainabilityScore >= 90;
      if (filter === 'score-80-89') return product.sustainabilityScore >= 80 && product.sustainabilityScore < 90;
      if (filter === 'score-70-79') return product.sustainabilityScore >= 70 && product.sustainabilityScore < 80;
      if (filter === 'score-below-70') return product.sustainabilityScore < 70;
      return false;
    });
    
    const matchesMOQ = activeFilters.some(filter => {
      if (filter === 'moq-under-500') return product.minOrderQuantity! < 500;
      if (filter === 'moq-500-1000') return product.minOrderQuantity! >= 500 && product.minOrderQuantity! <= 1000;
      if (filter === 'moq-1000-plus') return product.minOrderQuantity! > 1000;
      return false;
    });
    
    return matchesMaterial || matchesLocation || matchesScore || matchesMOQ;
  });

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-50 to-green-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Sustainable Packaging Products
          </h1>
          <div className="max-w-3xl mx-auto">
            <SearchBar placeholder="Search products by type, material, or supplier..." />
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <Button
              variant={showCategories ? 'primary' : 'outline'}
              onClick={() => setShowCategories(true)}
            >
              Browse Categories
            </Button>
            <Button
              variant={!showCategories ? 'primary' : 'outline'}
              onClick={() => setShowCategories(false)}
            >
              View All Products
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showCategories ? (
          <CategoryGrid />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <Sliders className="mr-2 h-5 w-5 text-green-500" />
                  Filters
                </h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {filterSections.map((section, index) => (
                <div key={index} className="mb-6 border-b border-gray-100 pb-6">
                  <button
                    className="flex items-center justify-between w-full text-left font-medium mb-3"
                    onClick={() => toggleFilterSection(index)}
                  >
                    {section.title}
                    {section.isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {section.isOpen && (
                    <div className="space-y-2">
                      {section.options.map((option) => (
                        <label key={option.id} className="flex items-center cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.includes(option.id)}
                              onChange={() => toggleFilter(option.id)}
                              className="peer opacity-0 absolute h-5 w-5"
                            />
                            <div className="border-2 rounded border-gray-300 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 bg-white peer-checked:bg-green-500 peer-checked:border-green-500">
                              <Check className="hidden peer-checked:block h-3 w-3 text-white" />
                            </div>
                          </div>
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{filteredProducts.length}</span>{' '}
                  products
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
                  <select
                    id="sort"
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="score-high">Eco Score (High to Low)</option>
                    <option value="score-low">Eco Score (Low to High)</option>
                    <option value="moq-low">MOQ (Low to High)</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg">
                  <p className="text-lg text-gray-600 mb-4">No products match your current filters.</p>
                  <Button variant="primary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <a className="px-4 py-2 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-50">
                    Previous
                  </a>
                  <a className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md">
                    1
                  </a>
                  <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50">
                    2
                  </a>
                  <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50">
                    3
                  </a>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">...</span>
                  <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50">
                    8
                  </a>
                  <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50">
                    Next
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};