type FavoriteButtonProps = {
  recipeId: number;
  isFavorite: boolean;
  onToggle: (recipeId: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function FavoriteButton({ 
  recipeId, 
  isFavorite, 
  onToggle, 
  size = "md",
  className = "" 
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: "btn-sm text-sm",
    md: "btn-md text-base",
    lg: "btn-lg text-lg"
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Estä linkkien klikkaukset
    e.stopPropagation(); // Estä tapahtuman kupliminen
    onToggle(recipeId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn ${isFavorite ? "btn-warning" : "btn-ghost"} ${sizeClasses[size]} ${className}`}
      title={isFavorite ? "Poista suosikeista" : "Lisää suosikkeihin"}
    >
      <span className={isFavorite ? "text-yellow-500" : "text-gray-400 text-lg"}>
        {isFavorite ? "⭐" : "☆"}
      </span>
    </button>
  );
}