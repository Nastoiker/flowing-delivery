import { api } from "@/helpers/api";
import { IUser } from "@/shared/interfaces/user.interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUsers } from "../api/user.api";

export function useUsers() {
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
