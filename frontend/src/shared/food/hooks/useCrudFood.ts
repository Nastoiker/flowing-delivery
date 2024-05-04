import { createFoodFetch, getFoods } from "@/entities/product/food/food.api";
import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useFoods() {
  return useQuery(["foods"], getFoods, {
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}
export function useFoodById(foodId: number) {
  const query = useQuery(
    ["food-by-id", foodId],
    async (): Promise<{ data: { food: IFood } }> => api.get(`/food/${foodId}`),
    {
      retry: false,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
  return query;
}
export function useSearchFood(search: string) {
  const query = useQuery(
    ["food-by-search", search],
    async (): Promise<{ data: { foods: IFood[] } }> =>
      api.get(`/food/search/${search}`),
    {
      retry: false,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
  return query;
}
export function useCreateFood() {
  const queryClient = useQueryClient();
  const {
    mutate: createFood,
    isLoading,
    error,
  } = useMutation(
    "createFood",
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
