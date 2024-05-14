import { getShoppingCarts } from "@/entities/shopping-cart/shoping-cart.api";
import { api } from "@/helpers/api";
import { IShoppingCart } from "@/shared/interfaces/shopping-cart.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useShoppingCart() {
  return useQuery("shopping-carts", getShoppingCarts, {
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}

export function useUpdateShoppingCart() {
  const queryClient = useQueryClient();
  const {
    mutate: updateShoppingCart,
    isLoading,
    error,
  } = useMutation(
    "updateShoppingCart",
    (shoppingCard: IShoppingCart) => api.put(`/shopping-cart`, shoppingCard),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("shopping-carts");
      },
    }
  );
  return {
    updateShoppingCart,
    isLoading,
    error,
  };
}
export function useCreateShoppingCart() {
  const queryClient = useQueryClient();
  const {
    mutate: createShoppingCart,
    isLoading,
    error,
  } = useMutation(
    "createShoppingCart",
    (shoppingCard: Partial<IShoppingCart>) =>
      api.post(`/shopping-cart/`, shoppingCard),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("shopping-carts");
        await queryClient.invalidateQueries("foods");
      },
    }
  );
  return {
    createShoppingCart,
    isLoading,
    error,
  };
}
const handleDelete = async (id: number) => api.delete(`/shopping-cart/${id}`);
export function useDeleteShoppingCart() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteShoppingCart,
    isLoading,
    error,
  } = useMutation("deleteShoppingCart", handleDelete, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("shopping-carts");
      await queryClient.invalidateQueries("foods");
    },
  });
  return {
    deleteShoppingCart,
    isLoading,
    error,
  };
}
