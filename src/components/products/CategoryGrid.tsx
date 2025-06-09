import React, { useState} from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight 
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
      { 
        name: 'Bottle', 
        slug: 'bottle', 
        icon: <Bottle className="h-6 w-6" />,
        details: {
          materials: [
            'Aluminum Bottles',
            'Bamboo Bottles',
            'Glass Bottles',
            'HDPE Bottles',
            'PE Bottles',
            'PET Bottles',
            'PP Bottles'
          ],
          shapes: [
            'Bevel Bottles',
            'Cylinder Bottles',
            'Oval Bottles',
            'Round Bottles',
            'Square Bottles'
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
        }
      },
      { name: 'Jar', slug: 'jar', icon: <Package className="h-6 w-6" /> ,
        details: {
          materials: [
            'Aluminum Jars',
            'Bamboo Jars',
            'Glass Jars',
            'HDPE Jars',
            'PE Jars',
            'PET Jars',
            'PP Jars'
          ],
          shapes: [
            'Speciality Jars',
            'Straight Sided',
            'Square Jars',
            'Round Jars',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
        }
      },
      { name: 'Tube', slug: 'tube', icon: <Cylinder className="h-6 w-6" />,
         details: {
          materials: [
            'Aluminum Tubes',
            'Bamboo Tubes',
            'Glass Tubes',
            'HDPE Tubes',
            'PE Tubes',
            'PET Tubes',
            'PP Tubes'
          ],
          shapes: [
            'Oval Tubes',
            'Round Tubes',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },
       },
      { name: 'Pouch', slug: 'pouch', icon: <Box className="h-6 w-6" />,
         details: {
          materials: [
            'Aluminum Pouches',
            'Bamboo Pouches',
            'Glass Pouches',
            'HDPE Pouches',
            'PE Pouches',
            'PET Pouches',
            'PP Pouches'
          ],
          shapes: [
            'Oval Pouches',
            'Round Pouches',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },
       },
      { name: 'Stick', slug: 'stick', icon: <Box className="h-6 w-6" /> ,
                 details: {
          materials: [
            'Aluminum Sticks',
            'Bamboo Sticks',
            'Glass Sticks',
            'HDPE Sticks',
            'PE Sticks',
            'PET Sticks',
            'PP Sticks'
          ],
          shapes: [
            'Oval Sticks',
            'Round Sticks',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },
      },
      { name: 'Airless Bottle', slug: 'airless-bottle', icon: <Bottle className="h-6 w-6" />,
                 details: {
          materials: [
            'Aluminum Airless Bottles',
            'Bamboo Airless Bottles',
            'Glass Airless Bottles',
            'HDPE Airless Bottles',
            'PE Airless Bottles',
            'PET Airless Bottles',
            'PP Airless Bottles'
          ],
          shapes: [
            'Oval Airless Bottles',
            'Round Airless Bottles',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },

       },
      { name: 'Airless Jar', slug: 'airless-jar', icon: <Package className="h-6 w-6" />,
                 details: {
          materials: [
            'Aluminum Airless Jars',
            'Bamboo Airless Jars',
            'Glass Airless Jars',
            'HDPE Airless Jars',
            'PE Airless Jars',
            'PET Airless Jars',
            'PP Airless Jars'
          ],
          shapes: [
            'Oval Airless Jars',
            'Round Airless Jars',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },

       },
      { name: 'Tottle', slug: 'tottle', icon: <Bottle className="h-6 w-6" />,
                 details: {
          materials: [
            'Aluminum Tottles',
            'Bamboo Tottles',
            'Glass Tottles',
            'HDPE Tottles',
            'PE Tottles',
            'PET Tottles',
            'PP Tottles'
          ],
          shapes: [
            'Oval Tottles',
            'Round Tottles',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },

       },
      { name: 'Compact', slug: 'compact', icon: <Circle className="h-6 w-6" />,
                 details: {
          materials: [
            'Aluminum Compacts',
            'Bamboo Compacts',
            'Glass Compacts',
            'HDPE Compacts',
            'PE Compacts',
            'PET Compacts',
            'PP Compacts'
          ],
          shapes: [
            'Oval Compacts',
            'Round Compacts',
          ],
          sustainability: [
            'Bio-based',
            'Recyclable',
            'Recycled Content'
          ],
          manufacturingLocations: [
            'North America',
            'Europe',
            'Asia'
          ]
         },

       },
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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const activeSubcategoryDetails = categories
    .find(cat => cat.slug === activeCategory)
    ?.subcategories.find(sub => sub.slug === selectedSubcategory)?.details;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Category Navigation */}
      <div className="flex border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category.slug}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeCategory === category.slug
                ? 'text-green-600 border-b-2 border-green-500 -mb-px'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveCategory(category.slug);
              setSelectedSubcategory(null);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategories Grid */}
      <div className="p-6">
        {selectedSubcategory ? (
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-6">
              <button 
                className="text-gray-600 hover:text-green-600"
                onClick={() => setSelectedSubcategory(null)}
              >
                {categories.find(cat => cat.slug === activeCategory)?.name}
              </button>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium">
                {categories
                  .find(cat => cat.slug === activeCategory)
                  ?.subcategories.find(sub => sub.slug === selectedSubcategory)?.name}
              </span>
            </div>

            {/* Subcategory Details */}
            {activeSubcategoryDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {activeSubcategoryDetails.materials && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Material</h3>
                    <ul className="space-y-2">
                      {activeSubcategoryDetails.materials.map((material) => (
                        <li key={material}>
                          <Link
                            to={`/products/material/${material.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-gray-600 hover:text-green-600 text-sm"
                          >
                            {material}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSubcategoryDetails.shapes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Shape</h3>
                    <ul className="space-y-2">
                      {activeSubcategoryDetails.shapes.map((shape) => (
                        <li key={shape}>
                          <Link
                            to={`/products/shape/${shape.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-gray-600 hover:text-green-600 text-sm"
                          >
                            {shape}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSubcategoryDetails.sustainability && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Sustainability</h3>
                    <ul className="space-y-2">
                      {activeSubcategoryDetails.sustainability.map((option) => (
                        <li key={option}>
                          <Link
                            to={`/products/sustainability/${option.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-gray-600 hover:text-green-600 text-sm"
                          >
                            {option}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSubcategoryDetails.manufacturingLocations && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Manufacturing Location</h3>
                    <ul className="space-y-2">
                      {activeSubcategoryDetails.manufacturingLocations.map((location) => (
                        <li key={location}>
                          <Link
                            to={`/products/location/${location.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-gray-600 hover:text-green-600 text-sm"
                          >
                            {location}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories
              .find((cat) => cat.slug === activeCategory)
              ?.subcategories.map((subcat) => (
                <button
                  key={subcat.slug}
                  onClick={() => setSelectedSubcategory(subcat.slug)}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-50 group-hover:bg-green-50 transition-colors mb-2">
                    {subcat.icon}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-green-600">
                    {subcat.name}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};