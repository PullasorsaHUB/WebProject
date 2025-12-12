import { useEffect, useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { recipeApi, type Recipe } from "../api/recipes";
import { RecipeCard } from "../components/RecipeCard";

export function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Hae kaikki reseptit ja suodata suosikit
        const allRecipes = await recipeApi.getAll();
        const favorites = allRecipes.filter(recipe => 
          favoriteIds.includes(recipe.id)
        );
        
        setFavoriteRecipes(favorites);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Virhe suosikkien haussa");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [favoriteIds]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Suosikit</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Suosikit</h1>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (favoriteRecipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Suosikit</h1>
        <div className="alert alert-info">
          <span>
            Ei suosikkeja vielä. Klikkaa ⭐-ikonia resepteissä lisätäksesi niitä suosikkeihisi!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Suosikit ({favoriteRecipes.length})
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
