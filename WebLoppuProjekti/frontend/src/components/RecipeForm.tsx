import { useState } from "react";
import { type CreateRecipeDto } from "../api/recipes";

type RecipeFormProps = {
  initialData?: CreateRecipeDto;
  onSubmit: (data: CreateRecipeDto) => Promise<void> | void;
  submitLabel?: string;
};

export function RecipeForm({
  initialData,
  onSubmit,
  submitLabel = "Tallenna",
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients ?? "");
  const [instructions, setInstructions] = useState(
    initialData?.instructions ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Otsikko on pakollinen.");
      return;
    }

    if (!ingredients.trim()) {
      setError("Ainesosat ovat pakolliset.");
      return;
    }

    if (!instructions.trim()) {
      setError("Valmistusohjeet ovat pakolliset.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Virhe lomakkeen lähettämisessä.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      ) : null}

      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Otsikko *</span>
          </div>
          <input
            type="text"
            placeholder="Kirjoita reseptin otsikko"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Kuvaus</span>
          </div>
          <input
            type="text"
            placeholder="Lyhyt kuvaus reseptistä"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full"
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Ainesosat *</span>
          </div>
          <textarea
            placeholder="Kirjoita ainesosat, yksi per rivi"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="textarea textarea-bordered w-full min-h-32"
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Valmistusohjeet *</span>
          </div>
          <textarea
            placeholder="Kirjoita valmistusohjeet"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="textarea textarea-bordered w-full min-h-40"
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Kuvan URL</span>
          </div>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input input-bordered w-full"
            disabled={loading}
          />
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Lähetetään...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
