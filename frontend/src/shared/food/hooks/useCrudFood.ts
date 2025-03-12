import { createFoodFetch, getFoods } from "@/entities/product/food/food.api";
import { api } from "@/helpers/api";
import { IFood } from "@/shared/interfaces/foods.interface";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FoodListParams, foodQueryKeys } from "./foods.queries";

export function useFoods({
  page = "1",
  pageSize = "100",
  filter = {},
  sort = { field: "createdAt", direction: "desc" },
}: FoodListParams) {
  return useQuery(
    foodQueryKeys.foodList({ page, pageSize, filter, sort }),
    () =>
      getFoods({
        filter: {
          ...filter,
        },
        sort,
        page,
        pageSize,
      }),
    {
      keepPreviousData: true,
      retry: false,
      staleTime: 3000,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
}
export type FoodsResult<T = any> = {
  readonly data: T[];
  readonly count: number;
  readonly allCount: number;
};
type GetNextPageParam = <T = any>(
  lastPage: FoodsResult<T>,
  pages: FoodsResult<T>[]
) => number | undefined;
const getNextPageParam: GetNextPageParam = (lastPage, pages) => {
  const pagesCount = pages.reduce((acc, page) => acc + page.count, 0);
  return lastPage?.allCount > pagesCount ? pages.length + 1 : undefined;
};
// TODO
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
        toast.success("Успешное создание");
      },
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
  return {
    createFood,
    isLoading,
    error,
  };
}

export function useUpdateFood(id) {
  const queryClient = useQueryClient();
  const {
    mutate: updateFood,
    isLoading,
    error,
  } = useMutation(
    "updateFood",
    (food: FormData) => api.put(`/food/${id}`, food),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["foods"]);
        await queryClient.invalidateQueries(["food-by-id", id]);
        toast.success("Товар отредактирован");
      },
    }
  );
  return {
    updateFood,
    isLoading,
    error,
  };
}

const handleDelete = async (id: number) => api.delete(`/food/${id}`);
export function useDeleteFood(id: number) {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteFood,
    isLoading,
    error,
  } = useMutation("deleteFood", async () => handleDelete(id), {
    onSuccess: async () => {
      await queryClient.invalidateQueries("foods");
      await queryClient.invalidateQueries(["food-by-id", id]);
      toast.success("Удалено");
    },
  });
  return {
    deleteFood,
    isLoading,
    error,
  };
}
