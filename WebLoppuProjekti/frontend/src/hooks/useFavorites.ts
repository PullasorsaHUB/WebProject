import { useState, useEffect } from "react";

const FAVORITES_STORAGE_KEY = "simplechef-favorites";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Lataa suosikit localStorage:sta
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Virhe suosikkien lataamisessa:", error);
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

  return {
    favoriteIds,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
}