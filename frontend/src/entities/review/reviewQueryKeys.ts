export interface PaginationType {
  page: string;
  pageSize: string;
}
export type OrderListParams = PaginationType & {
  filter: any;
  sort: any;
};

export const reviewQueryKeys = {
  allReviews: ["all-reviews"] as const,
  reviewList: ({ page, pageSize, filter, sort }: OrderListParams) =>
    [...reviewQueryKeys.allReviews, page, pageSize, filter, sort] as const,
};
