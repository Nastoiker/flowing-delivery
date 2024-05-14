import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";
import { IComment } from "@/shared/interfaces/review.interface";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createComment, removeComment, updateComment } from "../review.api";

export function useSearchComment(search: string) {
  const query = useQuery(
    ["food-by-search", search],
    async (): Promise<{ data: { foods: IFood[] } }> =>
      api.get(`/comment/search/${search}`),
    {
      retry: false,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
  return query;
}
export function useCreateComment() {
  const queryClient = useQueryClient();
  const {
    mutate: createCommentFood,
    isLoading,
    error,
  } = useMutation(
    "createComment",
    async (comment: Partial<IComment>) => createComment(comment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
        toast.success("Успешное создание");
      },
    }
  );
  return {
    createCommentFood,
    isLoading,
    error,
  };
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  const {
    mutate: updateCommentFood,
    isLoading,
    error,
  } = useMutation("updateComment", updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });
  return {
    updateCommentFood,
    isLoading,
    error,
  };
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteComment,
    isLoading,
    error,
  } = useMutation("deleteComment", removeComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("foods");
    },
  });
  return {
    deleteComment,
    isLoading,
    error,
  };
}

export function useCrudComment() {
  const { updateCommentFood, isLoading: isUpdating } = useUpdateComment();
  const { deleteComment } = useDeleteComment();
  const { createCommentFood, isLoading: isCreating } = useCreateComment();
  return {
    updateCommentFood,
    createCommentFood,
    deleteComment,
    isUpdating,
    isCreating,
  };
}
