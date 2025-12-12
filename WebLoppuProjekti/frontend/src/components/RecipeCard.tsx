import { Link } from "react-router-dom";
import type { Recipe } from "../api/recipes";
import { FavoriteButton } from "./FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";

type Props = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

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
        <div className="flex justify-between items-start">
          <h2 className="card-title flex-1">{recipe.title}</h2>
          <FavoriteButton
            recipeId={recipe.id}
            isFavorite={isFavorite(recipe.id)}
            onToggle={toggleFavorite}
            size="sm"
          />
        </div>
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
