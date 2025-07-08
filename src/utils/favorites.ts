import { getUserToken, isUserAuthenticated } from './userAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface FavoriteProduct {
  productId: {
    _id: string;
    name: string;
    primaryImage?: string;
    pricing: {
      basePrice: number;
      currency: string;
    };
  };
  addedAt: string;
}

export interface FavoriteResponse {
  success: boolean;
  message: string;
  favorites?: FavoriteProduct[];
}

// Add product to favorites
export const addToFavorites = async (productId: string): Promise<FavoriteResponse> => {
  try {
    if (!isUserAuthenticated()) {
      throw new Error('Please login to add favorites');
    }

    const token = getUserToken();
    const response = await fetch(`${API_URL}/api/user/favorites/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to favorites');
    }

    // Dispatch event for any listeners (like header or dashboard)
    window.dispatchEvent(new CustomEvent('favoritesChanged'));

    return data;
  } catch (error) {
    throw error;
  }
};

// Remove product from favorites
export const removeFromFavorites = async (productId: string): Promise<FavoriteResponse> => {
  try {
    if (!isUserAuthenticated()) {
      throw new Error('Please login to manage favorites');
    }

    const token = getUserToken();
    const response = await fetch(`${API_URL}/api/user/favorites/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove from favorites');
    }

    // Dispatch event for any listeners
    window.dispatchEvent(new CustomEvent('favoritesChanged'));

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user favorites
export const getUserFavorites = async (): Promise<FavoriteProduct[]> => {
  try {
    if (!isUserAuthenticated()) {
      return [];
    }

    const token = getUserToken();
    const response = await fetch(`${API_URL}/api/user/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch favorites');
    }

    return data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Check if product is in favorites
export const isProductInFavorites = async (productId: string): Promise<boolean> => {
  try {
    if (!isUserAuthenticated()) {
      return false;
    }

    const favorites = await getUserFavorites();
    return favorites.some(fav => fav.productId._id === productId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (productId: string): Promise<{ isFavorite: boolean; message: string }> => {
  try {
    if (!isUserAuthenticated()) {
      throw new Error('Please login to manage favorites');
    }

    const isFavorite = await isProductInFavorites(productId);
    
    if (isFavorite) {
      await removeFromFavorites(productId);
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      await addToFavorites(productId);
      return { isFavorite: true, message: 'Added to favorites' };
    }
  } catch (error) {
    throw error;
  }
};
