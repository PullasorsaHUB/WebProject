import { useParams } from "react-router-dom";

export function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Muokkaa reseptiä</h1>
      <div className="alert alert-info">
        <span>Resepti ID: {id} - Muokkauslomake tulee tähän myöhemmin.</span>
      </div>
    </div>
  );
}
