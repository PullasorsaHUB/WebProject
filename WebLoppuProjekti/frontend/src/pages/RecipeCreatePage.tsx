import { useNavigate } from "react-router-dom";
import { recipeApi, type CreateRecipeDto } from "../api/recipes";
import { RecipeForm } from "../components/RecipeForm";

export function RecipeCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateRecipeDto) => {
    const createdRecipe = await recipeApi.create(data);
    navigate(`/recipes/${createdRecipe.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Luo uusi resepti</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <RecipeForm onSubmit={handleSubmit} submitLabel="Luo resepti" />
        </div>
      </div>
    </div>
  );
}
