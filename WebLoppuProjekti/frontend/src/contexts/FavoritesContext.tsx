import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const FAVORITES_STORAGE_KEY = "simplechef-favorites";

type FavoritesContextType = {
  favoriteIds: number[];
  isFavorite: (recipeId: number) => boolean;
  addToFavorites: (recipeId: number) => void;
  removeFromFavorites: (recipeId: number) => void;
  toggleFavorite: (recipeId: number) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: Props) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Lataa suosikit localStorage:sta
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteIds(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Virhe suosikkien lataamisessa:", error);
      setFavoriteIds([]);
    }
  }, []);

  // Tallenna suosikit localStorage:iin
  const saveFavorites = (ids: number[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Virhe suosikkien tallentamisessa:", error);
    }
  };

  // Tarkista onko resepti suosikki
  const isFavorite = (recipeId: number): boolean => {
    return favoriteIds.includes(recipeId);
  };

  // Lisää suosikkeihin
  const addToFavorites = (recipeId: number) => {
    if (!isFavorite(recipeId)) {
      const newFavorites = [...favoriteIds, recipeId];
      saveFavorites(newFavorites);
    }
  };

  // Poista suosikeista
  const removeFromFavorites = (recipeId: number) => {
    const newFavorites = favoriteIds.filter(id => id !== recipeId);
    saveFavorites(newFavorites);
  };

  // Vaihda suosikki-status
  const toggleFavorite = (recipeId: number) => {
    if (isFavorite(recipeId)) {
      removeFromFavorites(recipeId);
    } else {
      addToFavorites(recipeId);
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