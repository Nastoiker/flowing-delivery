import { api } from "@/helpers/api";
import { ICategory } from "@/shared/interfaces/categories.interface";

export async function getCategories(): Promise<{
  data: { categories: ICategory[] };
}> {
  return api.get("categories");
}
export async function createCategory(): Promise<void> {
  return api.post("category")
}