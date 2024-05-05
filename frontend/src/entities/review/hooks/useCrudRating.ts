import { IComment } from "@/shared/interfaces/review.interface";
import { useMutation, useQueryClient } from "react-query";
import { createRating, updateRating } from "../review.api";



export function useCreateComment() {
  const queryClient = useQueryClient();
  const {
    mutate: createRatingFood,
    isLoading,
    error,
  } = useMutation(
    "createRating",
    async ( comment: Partial<IComment>) => createRating(comment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );
  return {
    createRatingFood,
    isLoading,
    error,
  };
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  const {
    mutate: updateRatingFood,
    isLoading,
    error,
  } = useMutation(
    "updateRating",
    updateRating,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );
  return {
    updateRatingFood,
    isLoading,
    error,
  };
}


