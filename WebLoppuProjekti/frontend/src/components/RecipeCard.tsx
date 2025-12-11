import { Link } from "react-router-dom";
import type { Recipe } from "../api/recipes";

type Props = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: Props) {
  return (
    <div className="card bg-base-200 shadow-xl">
      {recipe.imageUrl && (
        <figure className="px-4 pt-4">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="rounded-lg w-full h-48 object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{recipe.title}</h2>
        {recipe.description && (
          <p className="text-sm opacity-70">{recipe.description}</p>
        )}
        <div className="card-actions justify-end">
          <Link to={`/recipes/${recipe.id}`} className="btn btn-primary btn-sm">
            Näytä
          </Link>
        </div>
      </div>
    </div>
  );
}
