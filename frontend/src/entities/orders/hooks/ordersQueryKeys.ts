export interface PaginationType {
  page: string;
  pageSize: string;
}
export type OrderListParams = PaginationType & {
  filter: any;
  sort: any;
};

export const ordersQueryKeys = {
  allOrders: ["orders"] as const,
  foodList: ({ page, pageSize, filter, sort }: OrderListParams) =>
    [...ordersQueryKeys.allOrders, page, pageSize, filter, sort] as const,
};
