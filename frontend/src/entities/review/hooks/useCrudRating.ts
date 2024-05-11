import { IRating } from "@/shared/interfaces/review.interface";
import { useMutation, useQueryClient } from "react-query";
import { createRating, updateRating } from "../review.api";

export function useCreateRating() {
  const queryClient = useQueryClient();
  const {
    mutate: createRatingFood,
    isLoading,
    error,
  } = useMutation(
    "createRating",
    async (comment: Partial<IRating>) => createRating(comment),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("comments");
        await queryClient.invalidateQueries("foods");
      },
    }
  );
  return {
    createRatingFood,
    isLoading,
    error,
  };
}

export function useUpdateRating() {
  const queryClient = useQueryClient();
  const {
    mutate: updateRatingFood,
    isLoading,
    error,
  } = useMutation("updateRating", updateRating, {
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });
  return {
    updateRatingFood,
    isLoading,
    error,
  };
}

export function useCrudComment() {
  const { updateRatingFood, isLoading: isUpdating } = useUpdateRating();
  const { createRatingFood, isLoading: isCreating } = useCreateRating();
  return {
    updateRatingFood,
    createRatingFood,
    isUpdating,
    isCreating,
  };
}
