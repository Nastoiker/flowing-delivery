import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";

export async function getFoods(): Promise<{
  data: { foods: IFood[] };
}> {
  return api.get("food");
}
export async function getFoodById(id: number): Promise<{
  data: { food: IFood };
}> {
  return api.get(`food/${id}`);
}
export async function deleteFood(id: number): Promise<void> {
  return api.delete(`food/${id}`);
}
export const updateFood = (food: Partial<IFood>) => api.put("food", food);
export const createFoodFetch = (food: FormData) =>
  api.post("food/create", food);
