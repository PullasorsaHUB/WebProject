import { useParams } from "react-router-dom";

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reseptin tiedot</h1>
      <div className="alert alert-info">
        <span>Resepti ID: {id} - Toteutetaan myöhemmin.</span>
      </div>
    </div>
  );
}
