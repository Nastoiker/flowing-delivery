import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";

export async function getFoods(): Promise<{
  data: { foods: IFood[] };
}> {
  return api.get("food");
}

export const updateFood = (food: Partial<IFood>) => api.post("foods", food);
