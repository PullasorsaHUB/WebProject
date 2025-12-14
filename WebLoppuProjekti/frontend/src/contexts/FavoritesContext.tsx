import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { favoritesApi } from "../api/favorites";
import { useAuth } from "../auth/AuthContext";

type FavoritesContextType = {
  favoriteIds: number[];
  isFavorite: (recipeId: number) => boolean;
  addToFavorites: (recipeId: number) => Promise<void>;
  removeFromFavorites: (recipeId: number) => Promise<void>;
  toggleFavorite: (recipeId: number) => Promise<void>;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: Props) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Lataa suosikit backendistä kun käyttäjä on kirjautunut
  const refreshFavorites = async () => {
    if (!isLoggedIn) {
      setFavoriteIds([]);
      return;
    }

    try {
      setLoading(true);
      const favorites = await favoritesApi.getMyFavorites();
      const ids = favorites.map(fav => fav.recipeId);
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Virhe suosikkien lataamisessa:", error);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [isLoggedIn]);

  // Tarkista onko resepti suosikki
  const isFavorite = (recipeId: number): boolean => {
    return favoriteIds.includes(recipeId);
  };

  // Lisää suosikkeihin
  const addToFavorites = async (recipeId: number) => {
    if (!isLoggedIn || isFavorite(recipeId)) return;
    
    try {
      await favoritesApi.addFavorite(recipeId);
      setFavoriteIds(prev => [...prev, recipeId]);
    } catch (error) {
      console.error("Virhe suosikin lisäämisessä:", error);
      throw error;
    }
  };

  // Poista suosikeista
  const removeFromFavorites = async (recipeId: number) => {
    if (!isLoggedIn || !isFavorite(recipeId)) return;
    
    try {
      await favoritesApi.removeFavorite(recipeId);
      setFavoriteIds(prev => prev.filter(id => id !== recipeId));
    } catch (error) {
      console.error("Virhe suosikin poistamisessa:", error);
      throw error;
    }
  };

  // Vaihda suosikki-status
  const toggleFavorite = async (recipeId: number) => {
    if (isFavorite(recipeId)) {
      await removeFromFavorites(recipeId);
    } else {
      await addToFavorites(recipeId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        loading,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}