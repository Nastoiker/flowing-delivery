import { api } from "@/helpers/api";
import { PaginationType } from "@/shared/food/hooks/foods.queries";
import { IUser } from "@/shared/interfaces/user.interface";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { getUsers } from "../api/user.api";
import { userQueryKeys } from "../usersQueryKets";
export type UserResult<T = any> = {
  readonly users: T[];
  readonly allCount: number;
};
export type ResType<T = any> = {
  data: UserResult<T>;
};
type GetNextPageParam = <T = any>(
  lastPage: ResType<T>,
  pages: ResType<T>[]
) => number | undefined;
export type FoodListParams = PaginationType & {
  filter: any;
  sort: any;
};

const getNextPageParam: GetNextPageParam = (lastPage, pages) => {
  const pagesCount = pages.reduce(
    (acc, page) => acc + page.data.users.length,
    0
  );
  return lastPage?.data.allCount > pagesCount ? pages.length + 1 : undefined;
};
export function useUsers({ pageSize, filter, sort, page }: FoodListParams) {
  return useInfiniteQuery(
    userQueryKeys.usersList({ page, pageSize, filter, sort }),
    async () => getUsers({ page, pageSize, sort, filter }),
    {
      getNextPageParam,
    }
  );
}
// export function useUsers() {
//   //@ts-ignore TODO
//   return useQuery(["users"], getUsers, {
//     retry: false,
//     staleTime: 3000,
//     onError: (err: AxiosError<{ message?: string }>) => {
//       console.error(err);
//     },
//   });
// }
export function useUpdateUsers() {
  const queryClient = useQueryClient();
  const {
    mutate: updateMe,
    isLoading,
    error,
  } = useMutation(
    "updateMe",
    (updateDto: Partial<IUser>) => api.put(`/user`, updateDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
  return {
    updateMe,
    isLoading,
    error,
  };
}
export function useUpdateUserById() {
  const queryClient = useQueryClient();
  const {
    mutate: updateUserFetch,
    isLoading,
    error,
  } = useMutation(
    "updateUser",
    ({ id, ...updateDto }: Partial<IUser>) => api.put(`/user/${id}`, updateDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
  return {
    updateUserFetch,
    isLoading,
    error,
  };
}
