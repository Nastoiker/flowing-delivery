import { IReview } from "@/shared/interfaces/review.interface";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { getReviewsByFoodId, getReviewsByUserId } from "../review.api";
import { useCreateComment } from "./useCrudComment";
import { useCreateRating } from "./useCrudRating";

export function useReviewByFoodId(foodId: number) {
  return useQuery(["comments", foodId], () => getReviewsByFoodId(foodId), {
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}
export function useReviewByUserId(userId: number) {
  return useQuery(["comments-user", userId], () => getReviewsByUserId(userId), {
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}

export function useCreateReview() {
  const { createCommentFood, isLoading: isCreatingComment } =
    useCreateComment();
  const { createRatingFood, isLoading: isCreatingRating } = useCreateRating();
  const createReview = async ({
    description,
    foodId,
    rating,
    title,
  }: Omit<IReview, "id" | "userId">) => {
    try {
      await Promise.all([
        createCommentFood({ description, productId: foodId, title }),
        createRatingFood({ foodId, rating: Number(rating) }),
      ]);
    } catch {
      toast.error("Ошибка создания отзыва");
    }
  };
  return {
    createReview,
    isCreatingComment,
    isCreatingRating,
  };
}
