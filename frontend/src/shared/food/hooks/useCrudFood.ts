import { getFoods, updateFood } from "@/entities/product/food/food.api";
import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useFoods() {
  const {
    data = [],
    isError,
    isFetched,
    isLoading,
  } = useQuery(["foods"], async () => getFoods(), {
    retry: false,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
  return { data, isError, isFetched, isLoading };
}

export function useCreateFood() {
  const queryClient = useQueryClient();
  const {
    mutate: createFood,
    isLoading,
    error,
  } = useMutation(
    "createFood",
    async (food: Partial<IFood>) => updateFood(food),
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

export function useUpdateFood() {
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
export function useDeleteFood() {
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
