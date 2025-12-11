import { apiGet, apiPost, apiPut, apiDelete } from "./httpClient";

export type Recipe = {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
  createdAt: string;
};

export type CreateRecipeDto = Omit<Recipe, "id" | "createdAt">;
export type UpdateRecipeDto = Partial<CreateRecipeDto>;

export const recipeApi = {
  getAll: () => apiGet<Recipe[]>("/api/recipes"),
  getById: (id: number) => apiGet<Recipe>(`/api/recipes/${id}`),
  create: (data: CreateRecipeDto) =>
    apiPost<CreateRecipeDto, Recipe>("/api/recipes", data),
  update: (id: number, data: UpdateRecipeDto) =>
    apiPut<UpdateRecipeDto, Recipe>(`/api/recipes/${id}`, data),
  delete: (id: number) => apiDelete<void>(`/api/recipes/${id}`),
};
