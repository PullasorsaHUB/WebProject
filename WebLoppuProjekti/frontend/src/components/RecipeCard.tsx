import { Link, useNavigate } from "react-router-dom";
import type { Recipe } from "../api/recipes";
import { FavoriteButton } from "./FavoriteButton";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../auth/AuthContext";

type Props = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="card bg-base-200 shadow-xl">
      {recipe.imageUrl && (
        <figure className="px-4 pt-4">
          <Link to={`/recipes/${recipe.id}`}>
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </Link>
        </figure>
      )}
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title flex-1">{recipe.title}</h2>
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
            size="sm"
          />
        </div>
        {recipe.description && (
          <p className="text-sm opacity-70">{recipe.description}</p>
        )}
        {recipe.author && (
          <p className="text-xs opacity-60 italic">Tekijä: {recipe.author.userName}</p>
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
