import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { isUserAuthenticated } from '../../utils/userAuth';
import { toggleFavorite, isProductInFavorites } from '../../utils/favorites';
import { LoginRequiredModal } from './LoginRequiredModal';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  showLoginMessage?: boolean;
  onLoginRequired?: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  className = "",
  showLoginMessage = true,
  onLoginRequired 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [productId]);

  useEffect(() => {
    // Listen for favorites changes from other components
    const handleFavoritesChanged = () => {
      checkFavoriteStatus();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChanged);
    return () => window.removeEventListener('favoritesChanged', handleFavoritesChanged);
  }, []);

  const checkFavoriteStatus = async () => {
    if (isUserAuthenticated()) {
      try {
        setIsLoading(true);
        const favoriteStatus = await isProductInFavorites(productId);
        setIsFavorite(favoriteStatus);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUserAuthenticated()) {
      if (showLoginMessage) {
        setShowLoginModal(true);
      }
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    // Optimistically update UI for immediate feedback
    setIsFavorite(!isFavorite);
    setIsLoading(true);
    
    try {
      const result = await toggleFavorite(productId);
      // Update the state if the backend result is different (shouldn't happen often)
      if (result.isFavorite !== !isFavorite) {
        setIsFavorite(result.isFavorite);
      }
      
      // Show success message briefly
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      // Revert on error
      setIsFavorite(!isFavorite);
      console.error('Error toggling favorite:', error);
      // Show error message
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const getTooltipMessage = () => {
    if (!isUserAuthenticated()) {
      return "Please login to add favorites";
    }
    return isFavorite ? "Removed from favorites" : "Added to favorites";
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`bg-white p-2 rounded-full shadow-md transition-all duration-200 border-2 ${
          isFavorite 
            ? 'border-red-300 bg-red-50 hover:bg-red-100' 
            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
        } ${
          isLoading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-lg'
        }`}
        title={!isUserAuthenticated() ? "Login to add favorites" : isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          size={20} 
          className={`transition-all duration-200 ${
            isFavorite 
              ? 'text-red-600 fill-red-600 scale-110' 
              : 'text-gray-500 hover:text-red-500 hover:scale-105'
          } ${isLoading ? 'animate-pulse' : ''}`}
        />
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-10">
          {getTooltipMessage()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Login Required Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="add products to favorites"
      />
    </div>
  );
};
