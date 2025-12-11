import { useEffect, useState } from "react";
import { recipeApi, type Recipe } from "../api/recipes";
import { RecipeCard } from "../components/RecipeCard";

export function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recipeApi.getAll();
        setRecipes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Virhe reseptien haussa");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const lowerQuery = query.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(lowerQuery) ||
      (recipe.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reseptit</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reseptit</h1>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reseptit</h1>
        <div className="alert alert-info">
          <span>Ei reseptejä saatavilla. Ole ensimmäinen ja luo uusi!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reseptit</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Hae reseptejä otsikon tai kuvauksen perusteella..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="alert alert-warning">
          <span>Ei löytynyt reseptejä hakuehdoilla.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
