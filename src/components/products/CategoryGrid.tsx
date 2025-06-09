import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Bot as Bottle,
  Package,
  Box,
  Circle,
  Cylinder,
  Droplet,
  Leaf,
  Brush,
  SprayCan as Spray,
  Palette,
} from 'lucide-react';

type SubCategoryDetails = {
  materials?: string[];
  shapes?: string[];
  sustainability?: string[];
  manufacturingLocations?: string[];
};

type SubCategory = {
  name: string;
  slug: string;
  icon?: React.ReactNode;
  details?: SubCategoryDetails;
};

type MainCategory = {
  name: string;
  slug: string;
  subcategories: SubCategory[];
};

const categories: MainCategory[] = [
  {
    name: 'Bases',
    slug: 'bases',
    subcategories: [
      { name: 'Bottle', slug: 'bottle', icon: <Bottle className="h-6 w-6" /> },
      { name: 'Jar', slug: 'jar', icon: <Package className="h-6 w-6" /> },
      { name: 'Tube', slug: 'tube', icon: <Cylinder className="h-6 w-6" /> },
      { name: 'Pouch', slug: 'pouch', icon: <Box className="h-6 w-6" /> },
      { name: 'Stick', slug: 'stick', icon: <Box className="h-6 w-6" /> },
      { name: 'Airless Bottle', slug: 'airless-bottle', icon: <Bottle className="h-6 w-6" /> },
      { name: 'Airless Jar', slug: 'airless-jar', icon: <Package className="h-6 w-6" /> },
      { name: 'Tottle', slug: 'tottle', icon: <Bottle className="h-6 w-6" /> },
      { name: 'Compact', slug: 'compact', icon: <Circle className="h-6 w-6" /> },
    ],
  },
  {
    name: 'Closures',
    slug: 'closures',
    subcategories: [
      { name: 'Caps & Lids', slug: 'caps-lids', icon: <Circle className="h-6 w-6" /> },
      { name: 'Dispensers & Dosing', slug: 'dispensers-dosing', icon: <Spray className="h-6 w-6" /> },
      { name: 'Droppers', slug: 'droppers', icon: <Droplet className="h-6 w-6" /> },
      { name: 'Pumps', slug: 'pumps', icon: <Spray className="h-6 w-6" /> },
      { name: 'Sprayers', slug: 'sprayers', icon: <Spray className="h-6 w-6" /> },
    ],
  },
  {
    name: 'Sustainability',
    slug: 'sustainability',
    subcategories: [
      { name: 'PCR Options', slug: 'pcr-options', icon: <Leaf className="h-6 w-6" /> },
      { name: 'Bio Based', slug: 'bio-based', icon: <Leaf className="h-6 w-6" /> },
      { name: 'Refillable', slug: 'refillable', icon: <Droplet className="h-6 w-6" /> },
      { name: 'Recyclable', slug: 'recyclable', icon: <Leaf className="h-6 w-6" /> },
    ],
  },
  {
    name: 'End Use',
    slug: 'end-use',
    subcategories: [
      { name: 'Cosmetics', slug: 'cosmetics', icon: <Brush className="h-6 w-6" /> },
      { name: 'Skincare', slug: 'skincare', icon: <Droplet className="h-6 w-6" /> },
      { name: 'Haircare', slug: 'haircare', icon: <Spray className="h-6 w-6" /> },
      { name: 'Personal Care', slug: 'personal-care', icon: <Palette className="h-6 w-6" /> },
    ],
  },
];

export { categories };

export const CategoryGrid = () => {
  const [activeCategory, setActiveCategory] = useState('bases');
  const navigate = useNavigate();

  const activeCategoryData = categories.find(cat => cat.slug === activeCategory);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category.slug}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? 'text-green-600 border-b-2 border-green-500 -mb-px'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveCategory(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategory Grid */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 p-6">
  {activeCategoryData?.subcategories.map((sub) => (
    <button
      key={sub.slug}
      onClick={() =>
        navigate(`/products/material/${sub.slug.toLowerCase().replace(/\s+/g, '-')}`)
      }
      className="group flex flex-col items-center justify-center text-gray-800 hover:text-green-600 transition-colors space-y-2"
    >
      <div className="text-gray-700 group-hover:text-green-600 transition-colors">
        {React.cloneElement(sub.icon as React.ReactElement, { className: "w-8 h-8" })}
      </div>
      <span className="text-base font-medium">{sub.name}</span>
    </button>
  ))}
</div>
    </div>
  );
};
