import { apiPost, apiDelete, apiGet } from "./httpClient";
import type { Recipe } from "./recipes";

export type FavoriteWithRecipe = {
  id: number;
  userId: number;
  recipeId: number;
  createdAt: string;
  recipe: Recipe;
};

export const favoritesApi = {
  // Hakee käyttäjän kaikki suosikit
  getMyFavorites: () => apiGet<FavoriteWithRecipe[]>("/api/users/me/favorites"),
  
  // Lisää resepti suosikkeihin
  addFavorite: (recipeId: number) => 
    apiPost<{}, { message: string }>(`/api/recipes/${recipeId}/favorite`, {}),
  
  // Poistaa resepti suosikeista
  removeFavorite: (recipeId: number) => 
    apiDelete<void>(`/api/recipes/${recipeId}/favorite`),
};