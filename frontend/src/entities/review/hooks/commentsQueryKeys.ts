// export interface PaginationType {
//   page: string;
//   pageSize: string;
// }
export type CommentsListParams = {
  sort: any;
  foodId: number;
};

export const commentsQueryKeys = {
  allComments: ["comments"] as const,
  commentsList: ({ sort, foodId }: CommentsListParams) =>
    [...commentsQueryKeys.allComments, foodId, sort] as const,
};
