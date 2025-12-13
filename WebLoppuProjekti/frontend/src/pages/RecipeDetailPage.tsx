import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { recipeApi, type Recipe } from "../api/recipes";
import { FavoriteButton } from "../components/FavoriteButton";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../auth/AuthContext";
export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recipeId = Number(id);

    if (!id || Number.isNaN(recipeId)) {
      setError("Virheellinen reseptin tunniste.");
      setLoading(false);
      return;
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recipeApi.getById(recipeId);
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Virhe reseptin haussa.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!recipe) return;

    const confirmDelete = window.confirm("Poistetaanko resepti?");
    if (!confirmDelete) return;

    try {
      await recipeApi.delete(recipe.id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Poisto epäonnistui.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reseptin tiedot</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reseptin tiedot</h1>
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reseptin tiedot</h1>
        <div className="alert alert-info">
          <span>Reseptiä ei löytynyt.</span>
        </div>
      </div>
    );
  }

  const ingredientLines = recipe.ingredients
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {recipe.imageUrl ? (
          <div className="lg:w-1/2">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="rounded-xl w-full object-cover shadow"
            />
          </div>
        ) : null}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold flex-1">{recipe.title}</h1>
            <div className="flex gap-2 items-center">
              <FavoriteButton
                recipeId={recipe.id}
                isFavorite={isFavorite(recipe.id)}
                onToggle={(recipeId) => {
                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }
                  toggleFavorite(recipeId);
                }}
                size="md"
              />
              <Link
                to={`/recipes/${recipe.id}/edit`}
                className="btn btn-outline btn-sm"
              >
                Muokkaa
              </Link>
              <button className="btn btn-error btn-sm" onClick={handleDelete}>
                Poista
              </button>
            </div>
          </div>

          {recipe.description ? (
            <p className="mt-3 text-base-content/80">{recipe.description}</p>
          ) : null}

          {recipe.author && (
            <p className="mt-2 text-sm text-base-content/60 italic">
              Tekijä: {recipe.author.userName}
            </p>
          )}

          <div className="mt-6 space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-2">Ainesosat</h2>
              {ingredientLines.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {ingredientLines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-base-content/70">Ei ainesosia.</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Valmistusohje</h2>
              <p className="whitespace-pre-line text-base-content/90">
                {recipe.instructions}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
