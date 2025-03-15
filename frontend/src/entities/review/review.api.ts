import { api } from "@/helpers/api";
import {
  IComment,
  IRating,
  IReview,
} from "@/shared/interfaces/review.interface";
const rootPath = "review";
export async function getReviewsByFoodId({ foodId, sort }): Promise<{
  data: { reviews: IReview[] };
}> {
  return api.get(`${rootPath}/food/${foodId}`, {
    params: {
      sort,
    },
  });
}
export async function getMyReviews({ sort }): Promise<{
  data: { reviews: IReview[] };
}> {
  return api.get(`${rootPath}/my-reviews`);
}
export async function getReviewsByUserId({ userId, sort }): Promise<{
  data: { foods: IReview[] };
}> {
  return api.get(`${rootPath}/user/${userId}`, {
    params: {
      sort,
    },
  });
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

export async function getAllReviews({
  filter = {},
  page = "1",
  pageSize = "10",
  sort = { field: "createdAt", direction: "desc" },
}): Promise<{
  data: { reviews: IReview[]; allCount: number };
}> {
  return api.get("review/all-reviews", {
    params: {
      filter,
      page,
      sort,
      pageSize,
    },
  });
}
