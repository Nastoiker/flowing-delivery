export interface PaginationType {
  page: string;
  pageSize: string;
}
export type FoodListParams = PaginationType & {
  filter: any;
  sort: any;
};

export const foodQueryKeys = {
  allFoods: ["foods"] as const,
  foodList: ({ page, pageSize, filter, sort }: FoodListParams) =>
    [...foodQueryKeys.allFoods, page, pageSize, filter, sort] as const,
};
