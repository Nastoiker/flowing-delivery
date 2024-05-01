import { getCategories } from "@/entities/category/api/category.api";
import { api } from "@/helpers/api";
import { ICategory } from "@/shared/interfaces/categories.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useCategories() {
  // const flash = useFlash();
  const query = useQuery(["categories"], async () => getCategories(), {
    retry: false,
    staleTime: Infinity,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
  return query;
}
export function useFoodsByCategory(categoryId: number) {
  // const flash = useFlash();
  const query = useQuery(
    ["foods-by-category", categoryId],
    async () => api.get(`/categories/${categoryId}`),
    {
      retry: false,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
  return query;
}
export const updateCategory = (food: Partial<ICategory>) =>
  api.put("categories", food);

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const {
    mutate: createCategory,
    isLoading,
    error,
  } = useMutation(
    "createCategory",
    async (category: Partial<ICategory>) =>
      api.post(`/categories/create`, category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );
  return {
    createCategory,
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
    ({ id, ...category }: ICategory) =>
      api.patch(`/categories/${id}`, category),
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

const handleDelete = async (id: number) => api.delete(`/category/${id}`);
export function useDeleteFood() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteCategory,
    isLoading,
    error,
  } = useMutation("deleteCategory", handleDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries("category");
    },
  });
  return {
    deleteCategory,
    isLoading,
    error,
  };
}
