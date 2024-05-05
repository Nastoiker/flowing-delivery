import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";

export async function getReviewByFoodId(foodId: number): Promise<{
  data: { foods: IFood[] };
}> {
  return api.get(`review/${foodId}`);
}
export async function deleteReview(id: number): Promise<void> {
  return api.delete(`review/${id}`);
}
export const updateFood = (food: Partial<IFood>) => api.put("review", food);
export const createReview = (food: FormData) => api.post("review/create", food);
