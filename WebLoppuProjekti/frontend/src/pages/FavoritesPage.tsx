import { useEffect, useState } from "react";
import { favoritesApi, type FavoriteWithRecipe } from "../api/favorites";
import { RecipeCard } from "../components/RecipeCard";
import { useAuth } from "../auth/AuthContext";

export function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteWithRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const favorites = await favoritesApi.getMyFavorites();
        setFavoriteRecipes(favorites);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Virhe suosikkien haussa");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn]);

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

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Suosikit</h1>
        <div className="alert alert-warning">
          <span>Kirjaudu sisään nähdäksesi suosikkisi.</span>
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
        {favoriteRecipes.map((favorite) => (
          <RecipeCard key={favorite.recipe.id} recipe={favorite.recipe} />
        ))}
      </div>
    </div>
  );
}
