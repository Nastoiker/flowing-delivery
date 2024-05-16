import { IOrder } from "@/shared/interfaces/order.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createOrder, getOrders } from "../api/orders.api";
export function useOrders() {
  const query = useQuery(["orders"], async () => getOrders(), {
    retry: false,
    staleTime: Infinity,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
  return query;
}
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const {
    mutate: createOrderFetch,
    isLoading,
    error,
  } = useMutation(
    "createOrder",
    async (order: Partial<IOrder>) => createOrder(order),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("orders");
      },
    }
  );
  return {
    createOrderFetch,
    isLoading,
    error,
  };
}
