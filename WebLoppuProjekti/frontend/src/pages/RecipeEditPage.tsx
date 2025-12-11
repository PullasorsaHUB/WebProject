import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recipeApi, type CreateRecipeDto, type Recipe } from "../api/recipes";
import { RecipeForm } from "../components/RecipeForm";

export function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleSubmit = async (data: CreateRecipeDto) => {
    if (!recipe) return;
    await recipeApi.update(recipe.id, data);
    navigate(`/recipes/${recipe.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Muokkaa reseptiä</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Muokkaa reseptiä</h1>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Muokkaa reseptiä</h1>
        <div className="alert alert-info">
          <span>Reseptiä ei löytynyt.</span>
        </div>
      </div>
    );
  }

  const initialData: CreateRecipeDto = {
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    imageUrl: recipe.imageUrl,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Muokkaa reseptiä</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <RecipeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Päivitä resepti"
          />
        </div>
      </div>
    </div>
  );
}
