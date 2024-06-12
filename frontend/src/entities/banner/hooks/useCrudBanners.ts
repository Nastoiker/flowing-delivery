import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createBanner, getBanners } from "../api/banner.api";
export function useBanners() {
  const query = useQuery(["banners"], async () => getBanners(), {
    retry: false,
    staleTime: Infinity,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
  return query;
}
export function useCreateBanner() {
  const queryClient = useQueryClient();
  const {
    mutate: createBannerFetch,
    isLoading,
    error,
  } = useMutation(
    "createBanner",
    async (banner: FormData) => createBanner(banner),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("banners");
        toast.success("Успешное создание");
      },
    }
  );
  return {
    createBannerFetch,
    isLoading,
    error,
  };
}
