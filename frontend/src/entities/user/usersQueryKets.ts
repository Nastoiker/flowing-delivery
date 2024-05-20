export interface PaginationType {
  page: string;
  pageSize: string;
}
export type UserListParams = PaginationType & {
  filter: any;
  sort: any;
};

export const userQueryKeys = {
  allUsers: ["users"] as const,
  usersList: ({ page, pageSize, filter, sort }: UserListParams) =>
    [...userQueryKeys.allUsers, page, pageSize, filter, sort] as const,
};
