import { PaginationType } from "@/entities/user/usersQueryKets";
import { IReview } from "@/shared/interfaces/review.interface";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useInfiniteQuery, useQuery } from "react-query";
import {
  getAllReviews,
  getMyReviews,
  getReviewsByFoodId,
  getReviewsByUserId,
} from "../review.api";
import { reviewQueryKeys } from "../reviewQueryKeys";
import { commentsQueryKeys } from "./commentsQueryKeys";
import { useCreateComment } from "./useCrudComment";
import { useCreateRating } from "./useCrudRating";
export type OrderResult<T = any> = {
  readonly reviews: T[];
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
    (acc, page) => acc + page.data.reviews.length,
    0
  );
  return lastPage?.data.allCount > pagesCount ? pages.length + 1 : undefined;
};
export function useMyReviews({
  sort = { field: "createdAt", direction: "desc" },
}) {
  return useQuery(["my-reviews"], () => getMyReviews({ sort }), {
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}

export function useReviewByFoodId({
  foodId,
  sort = { field: "createdAt", direction: "desc" },
}) {
  return useQuery(
    commentsQueryKeys.commentsList({ sort, foodId }),
    () => getReviewsByFoodId({ foodId, sort }),
    {
      retry: false,
      staleTime: 3000,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
}
export function useReviewByUserId({
  userId,
  sort = { field: "createdAt", direction: "desc" },
}) {
  return useQuery(
    ["comments-user", userId],
    () => getReviewsByUserId({ userId, sort }),
    {
      retry: false,
      staleTime: 3000,
      onError: (err: AxiosError<{ message?: string }>) => {
        console.error(err);
      },
    }
  );
}

export function useAllReviews({
  pageSize,
  filter,
  sort,
  page,
}: FoodListParams) {
  return useInfiniteQuery(
    reviewQueryKeys.reviewList({ page, pageSize, filter, sort }),
    async () => getAllReviews({ page, pageSize, sort, filter }),
    {
      getNextPageParam,
    }
  );
}
export function useCreateReview() {
  const { createCommentFood, isLoading: isCreatingComment } =
    useCreateComment();
  const { createRatingFood, isLoading: isCreatingRating } = useCreateRating();
  const createReview = async (
    { description, foodId, rating, title }: Omit<IReview, "id" | "userId">,
    hasReview: boolean
  ) => {
    try {
      await Promise.all([
        createCommentFood({ description, productId: foodId, title }),
        !hasReview && createRatingFood({ foodId, rating: Number(rating) }),
      ]);
    } catch {
      toast.error("Ошибка создания отзыва");
    }
  };
  return {
    createReview,
    isCreatingComment,
    isCreatingRating,
  };
}
