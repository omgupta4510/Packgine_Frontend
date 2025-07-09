import { Link } from 'react-router-dom';
import { Heart, Eye, MessageSquare, Filter } from 'lucide-react';
import { UserData } from './types';

interface FavoritesSectionProps {
  user: UserData;
  onRemoveFavorite: (productId: string) => Promise<void>;
}

export const FavoritesSection = ({ user, onRemoveFavorite }: FavoritesSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Favorites</h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {user.favorites && user.favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.favorites.map((favorite) => (
            <div key={favorite.productId._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative">
              {/* Remove favorite button */}
              <button
                onClick={() => onRemoveFavorite(favorite.productId._id)}
                className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors group"
                title="Remove from favorites"
              >
                <Heart size={16} className="text-red-500 fill-red-500 group-hover:text-red-600" />
              </button>
              
              <img 
                src={favorite.productId.primaryImage || '/Images/image1.png'} 
                alt={favorite.productId.name}
                className="h-48 w-full rounded-lg object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">{favorite.productId.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-green-600">
                  {favorite.productId.pricing.currency} {favorite.productId.pricing.basePrice}
                </span>
                <span className="text-sm text-gray-500">
                  Added {new Date(favorite.addedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link 
                  to={`/products/${favorite.productId._id}`}
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Inquire</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">Start browsing products to add them to your favorites</p>
          <Link 
            to="/products"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};
