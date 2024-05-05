import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { getReviewsByFoodId, getReviewsByUserId } from "../review.api";

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