import { api } from "@/helpers/api";
import { IUser } from "@/shared/interfaces/user.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUsers } from "../api/user.api";

export function useUsers() {
  //@ts-ignore TODO
  return useQuery(["users"], getUsers, {
    retry: false,
    staleTime: 3000,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
}
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
