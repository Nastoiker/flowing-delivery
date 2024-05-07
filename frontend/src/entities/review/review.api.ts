import { api } from "@/helpers/api";
import {
  IComment,
  IRating,
  IReview,
} from "@/shared/interfaces/review.interface";
const rootPath = "review";
export async function getReviewsByFoodId(foodId: number): Promise<{
  data: { reviews: IReview[] };
}> {
  return api.get(`${rootPath}/food/${foodId}`);
}
export async function getReviewsByUserId(userId: number): Promise<{
  data: { foods: IReview[] };
}> {
  return api.get(`${rootPath}/food/${userId}`);
}
export const updateComment = (comment: Partial<IComment>) =>
  api.put(`${rootPath}/comment`, comment);
export const updateRating = (rating: Partial<IRating>) =>
  api.put(`${rootPath}/rating`, rating);

export const createComment = (comment: Partial<IComment>) =>
  api.post(`${rootPath}/comment`, comment);
export const createRating = (rating: Partial<IRating>) =>
  api.post(`${rootPath}/rating`, rating);

export const removeComment = (id: number) =>
  api.delete(`${rootPath}/comment/${id}`);
