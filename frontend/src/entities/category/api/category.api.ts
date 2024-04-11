import { api } from "@/helpers/api";
import { ICategory } from "@/shared/interfaces/categories.interface";

export async function getCategories(): Promise<{
  data: { categories: ICategory[] };
}> {
  return api.get("categories");
}
