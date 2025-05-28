import React from 'react';
import { Link } from 'react-router-dom';
import { SustainabilityScore } from './SustainabilityScore';
import { Button } from './Button';
import { Heart } from 'lucide-react';

type ProductCardProps = {
  id: string;
  name: string;
  image: string;
  supplier: string;
  sustainabilityScore: number;
  material: string;
  minOrderQuantity?: number;
  location?: string;
};

export const ProductCard = ({
  id,
  name,
  image,
  supplier,
  sustainabilityScore,
  material,
  minOrderQuantity,
  location,
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <Link to={`/products/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <button className="bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <SustainabilityScore score={sustainabilityScore} size="sm" />
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            {material}
          </span>
          {location && (
            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full ml-2">
              {location}
            </span>
          )}
        </div>
        
        <Link to={`/products/${id}`} className="block mb-1">
          <h3 className="text-lg font-medium text-gray-800 hover:text-green-700 transition-colors">{name}</h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3">By {supplier}</p>
        
        {minOrderQuantity && (
          <p className="text-xs text-gray-500 mb-3">Minimum order: {minOrderQuantity} units</p>
        )}
        
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" className="flex-1">Sample</Button>
          <Button variant="primary" size="sm" className="flex-1">Quote</Button>
        </div>
      </div>
    </div>
  );
};