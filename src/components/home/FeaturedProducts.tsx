import React, { useState } from 'react';
import { ProductCard } from '../ui/ProductCard';
import { Button } from '../ui/Button';

// Mock data
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
];

export const FeaturedProducts = () => {
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'usa', name: 'Made in USA' },
    { id: 'eu', name: 'Made in EU' },
    { id: 'high-score', name: 'Eco Score 90+' },
  ];
  
  const filteredProducts = mockProducts.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'usa') return product.location === 'USA';
    if (filter === 'eu') return product.location === 'EU';
    if (filter === 'high-score') return product.sustainabilityScore >= 90;
    return true;
  });

  return (
    <section className="py-20 bg-berlin-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-berlin-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-berlin-gray-600 max-w-2xl">
              Discover our most popular sustainable packaging options chosen by eco-conscious brands.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button variant="primary" href="/products">
              View All Products
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map(item => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === item.id
                  ? 'bg-berlin-red-500 text-white'
                  : 'bg-white text-berlin-gray-700 hover:bg-berlin-red-50'
              }`}
              onClick={() => setFilter(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};