import { PaginationType } from "@/shared/food/hooks/foods.queries";
import { IOrder } from "@/shared/interfaces/order.interface";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { createOrder, getOrders } from "../api/orders.api";
// export function useOrders() {
//   const query = useQuery(["orders"], async () => getOrders(), {
//     retry: false,
//     staleTime: Infinity,
//     onError: (err: AxiosError<{ message?: string }>) => {
//       console.error(err);
//     },
//   });
//   return query;
// }
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
  const pagesCount = pages.reduce(
    (acc, page) => acc + page.data.orders.length,
    0
  );
  return lastPage?.data.allCount > pagesCount ? pages.length + 1 : undefined;
};
export function useOrders({ pageSize, filter, sort }: FoodListParams) {
  return useInfiniteQuery(
    ["orders", filter],
    async ({ pageParam = 1 }) =>
      getOrders({ page: pageParam, pageSize, sort, filter }),
    {
      getNextPageParam,
    }
  );
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
      onError: async () => {
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
