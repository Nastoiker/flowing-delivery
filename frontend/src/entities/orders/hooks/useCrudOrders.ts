import { api } from "@/helpers/api";
import { PaginationType } from "@/shared/food/hooks/foods.queries";
import { IOrder } from "@/shared/interfaces/order.interface";
import { AxiosError } from "axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  createOrder,
  getMyOrders,
  getMyPurchasedOrders,
  getOrders,
} from "../api/orders.api";
import { ordersQueryKeys } from "./ordersQueryKeys";
export type OrderResult<T = any> = {
  readonly orders: T[];
  readonly allCount: number;
};
export type ResType<T = any> = {
  data: OrderResult<T>;
};
export type FoodListParams = PaginationType & {
  filter: any;
  sort: any;
};

type GetNextPageParam = <T = any>(
  lastPage: ResType<T>,
  pages: ResType<T>[]
) => number | undefined;
const getNextPageParam: GetNextPageParam = (lastPage, pages) => {
  const pagesCount = pages.length;

  return lastPage?.data.allCount > pagesCount * 20 ? pagesCount + 1 : undefined;
};
export function useOrders({ pageSize, filter, sort, page }: FoodListParams) {
  return useInfiniteQuery(
    ordersQueryKeys.foodList({ page, pageSize, filter, sort }),
    async ({ pageParam = 1 }) =>
      getOrders({ page: pageParam, pageSize, sort, filter }),
    {
      getNextPageParam,
    }
  );
}
export function useMyOrdersByUserId() {
  return useQuery(["my-orders"], getMyOrders, {
    keepPreviousData: true,
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}
export function useMyPurchasedOrdersByUserId() {
  return useQuery(["my-purchased-orders"], getMyPurchasedOrders, {
    keepPreviousData: true,
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}
export function useOrderById(orderId: number) {
  const query = useQuery(
    ["order-by-id", orderId],
    async (): Promise<{ data: { order: IOrder } }> =>
      api.get(`/order/${orderId}`),
    {
      retry: false,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
      staleTime: 3000,
    }
  );
  return query;
}
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: createOrderFetch,
    isLoading,
    error,
  } = useMutation(
    "createOrder",
    async (order: Partial<IOrder>) => createOrder(order),
    {
      onSuccess: async () =>
        Promise.all([
          queryClient.invalidateQueries("orders"),
          queryClient.invalidateQueries("my-orders"),
          queryClient.invalidateQueries("shopping-carts"),
          queryClient.invalidateQueries("foods"),
        ]),
      onError: async () =>
        Promise.all([
          queryClient.invalidateQueries("orders"),
          queryClient.invalidateQueries("shopping-carts"),
          queryClient.invalidateQueries("foods"),
        ]),
    }
  );
  return {
    createOrderFetch,
    isLoading,
    error,
  };
}
export function useUpdateOrder(id) {
  const queryClient = useQueryClient();
  const {
    mutate: updateOrder,
    isLoading,
    error,
  } = useMutation(
    "updateOrder",
    (food: Partial<Omit<IOrder, "id">>) => api.put(`/order/`, { id, ...food }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("order");
      },
    }
  );
  return {
    updateOrder,
    isLoading,
    error,
  };
}
