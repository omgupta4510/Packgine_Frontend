import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import broaderCategories from '../../data/broaderCategories.json';
import { Box, Package, Cylinder, Circle, Droplet, Leaf, Brush, SprayCan as Spray, Palette } from 'lucide-react';

// Icon mapping for demo; you can expand this as needed
const iconMap: Record<string, React.ReactNode> = {
  'Bottle': <Cylinder className="h-8 w-8" />, 'Jar': <Package className="h-8 w-8" />, 'Tube': <Cylinder className="h-8 w-8" />,
  'Pouch': <Box className="h-8 w-8" />, 'Stick': <Box className="h-8 w-8" />, 'Airless Bottle': <Cylinder className="h-8 w-8" />,
  'Airless Jar': <Package className="h-8 w-8" />, 'Tottle': <Cylinder className="h-8 w-8" />, 'Compact': <Circle className="h-8 w-8" />,
  'Cap': <Circle className="h-8 w-8" />, 'Dropper': <Droplet className="h-8 w-8" />, 'Other Closure': <Box className="h-8 w-8" />,
  'Skin Care': <Brush className="h-8 w-8" />, 'Hair Care': <Spray className="h-8 w-8" />, 'Face Cream': <Palette className="h-8 w-8" />, 'Fragrance': <Leaf className="h-8 w-8" />,
  'Laundry Detergent': <Box className="h-8 w-8" />, 'Surface Cleaners': <Box className="h-8 w-8" />, 'Dish Soap': <Box className="h-8 w-8" />,
  'Folding Carton': <Box className="h-8 w-8" />, 'Lipstick': <Box className="h-8 w-8" />
};

export const CategoryGrid = () => {
  const [activeCategory, setActiveCategory] = useState(broaderCategories.broader_categories[0].name);
  const navigate = useNavigate();
  const activeCategoryData = broaderCategories.broader_categories.find(cat => cat.name === activeCategory);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-berlin-gray-200">
        {broaderCategories.broader_categories.map((category) => (
          <button
            key={category.name}
            className={`px-6 py-4 text-sm font-medium transition-colors ${activeCategory === category.name ? 'text-berlin-red-600 border-b-2 border-berlin-red-500 -mb-px' : 'text-berlin-gray-600 hover:text-berlin-gray-800'}`}
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {/* Subcategory Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 p-6">
        {activeCategoryData?.categories?.map((sub: string) => (
          <button
            key={sub}
            onClick={() => navigate(`/products/material/${sub.toLowerCase().replace(/\s+/g, '-')}`)}
            className="group flex flex-col items-center justify-center text-berlin-gray-800 hover:text-berlin-red-600 transition-colors space-y-2"
          >
            <div className="text-berlin-gray-700 group-hover:text-berlin-red-600 transition-colors">
              {iconMap[sub] || <Box className="h-8 w-8" />}
            </div>
            <span className="text-base font-medium">{sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
