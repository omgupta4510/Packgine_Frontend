import { Link } from 'react-router-dom';
import { SustainabilityScore } from './SustainabilityScore';
import { Button } from './Button';
import { FavoriteButton } from './FavoriteButton';

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
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-berlin-gray-200 hover:border-berlin-red-300">
      <div className="relative">
        <Link to={`/products/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={id} />
        </div>
        <div className="absolute bottom-3 left-3">
          <SustainabilityScore score={sustainabilityScore} size="sm" />
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <span className="text-xs font-semibold text-berlin-red-700 bg-berlin-red-50 px-3 py-1 rounded-full border border-berlin-red-200">
            {material}
          </span>
          {location && (
            <span className="text-xs font-medium text-berlin-gray-600 bg-berlin-gray-50 px-3 py-1 rounded-full ml-2 border border-berlin-gray-200">
              {location}
            </span>
          )}
        </div>
        
        <Link to={`/products/${id}`} className="block mb-2">
          <h3 className="text-lg font-semibold text-berlin-gray-800 hover:text-berlin-red-600 transition-colors">{name}</h3>
        </Link>
        
        <p className="text-sm text-berlin-gray-600 mb-3 font-medium">By {supplier}</p>
        
        {minOrderQuantity && (
          <p className="text-xs text-berlin-gray-500 mb-4">Minimum order: {minOrderQuantity.toLocaleString()} units</p>
        )}
        
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm" className="flex-1">Sample</Button>
          <Button variant="primary" size="sm" className="flex-1">Quote</Button>
        </div>
      </div>
    </div>
  );
};