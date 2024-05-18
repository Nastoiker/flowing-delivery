export interface PaginationType {
  page: string;
  pageSize: string;
}
export type OrderListParams = PaginationType & {
  filter: any;
  sort: any;
};

export const ordersQueryKeys = {
  allFoods: ["orders"] as const,
  foodList: ({ page, pageSize, filter, sort }: OrderListParams) =>
    [...ordersQueryKeys.allFoods, page, pageSize, filter, sort] as const,
};
