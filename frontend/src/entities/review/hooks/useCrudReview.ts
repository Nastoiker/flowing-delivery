import { createFoodFetch, getFoods } from "@/entities/product/food/food.api";
import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useComments() {
  return useQuery(["comment"], getFoods, {
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}

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
    mutate: createFood,
    isLoading,
    error,
  } = useMutation(
    "createComment",
    async (food: FormData) => createFoodFetch(food),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("foods");
      },
    }
  );
  return {
    createFood,
    isLoading,
    error,
  };
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  const {
    mutate: updateFood,
    isLoading,
    error,
  } = useMutation(
    "updateFood",
    ({ id, ...food }: IFood) => api.patch(`/foods/${id}`, food),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("foods");
      },
    }
  );
  return {
    updateFood,
    isLoading,
    error,
  };
}

const handleDelete = async (id: number) => api.delete(`/foods/${id}`);
export function useDeleteComment() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteFood,
    isLoading,
    error,
  } = useMutation("deleteFood", handleDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries("foods");
    },
  });
  return {
    deleteFood,
    isLoading,
    error,
  };
}
