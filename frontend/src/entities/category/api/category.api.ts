import { api } from "@/helpers/api";
import { ICategory } from "@/shared/interfaces/categories.interface";
import { IFood } from "@/shared/interfaces/foods.interface";

export async function getCategories(): Promise<{
  data: { categories: ICategory[] };
}> {
  return api.get("categories");
}
export async function createCategory(): Promise<void> {
  return api.post("category")
}
export async function getFoodsByCategory(categoryId: number): Promise<{ category: string, foods: IFood[]}>  {
  return api.get(`/categor/${categoryId}`);
} 