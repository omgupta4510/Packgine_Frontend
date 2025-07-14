import React from 'react';
import { CategoryCard } from '../ui/CategoryCard';
import { Bot as Bottle, Package, Box, Circle, Cylinder, Banana, Leaf, Sprout } from 'lucide-react';

export const BrowseCategories = () => {
  const categories = [
    {
      icon: <Bottle className="h-10 w-10" />,
      title: 'Bottles & Jars',
      href: '/products/bottles-jars',
    },
    {
      icon: <Package className="h-10 w-10" />,
      title: 'Pouches',
      href: '/products/pouches',
    },
    {
      icon: <Box className="h-10 w-10" />,
      title: 'Boxes & Cartons',
      href: '/products/boxes-cartons',
    },
    {
      icon: <Cylinder className="h-10 w-10" />,
      title: 'Tubes',
      href: '/products/tubes',
    },
    {
      icon: <Circle className="h-10 w-10" />,
      title: 'Caps & Closures',
      href: '/products/caps-closures',
    },
    {
      icon: <Banana className="h-10 w-10" />,
      title: 'Biodegradable',
      href: '/products/biodegradable',
    },
    {
      icon: <Leaf className="h-10 w-10" />,
      title: 'Plant-Based',
      href: '/products/plant-based',
    },
    {
      icon: <Sprout className="h-10 w-10" />,
      title: 'Compostable',
      href: '/products/compostable',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-berlin-gray-900 mb-4">
            Browse By Category
          </h2>
          <p className="text-xl text-berlin-gray-600 max-w-3xl mx-auto">
            Explore our wide range of sustainable packaging solutions by category.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              icon={category.icon} 
              title={category.title} 
              href={category.href} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};