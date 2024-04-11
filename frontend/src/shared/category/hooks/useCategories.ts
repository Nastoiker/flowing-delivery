import { getCategories } from "@/entities/category/api/category.api";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

export function useCategories() {
  // const flash = useFlash();
  const query = useQuery(["categories"], async () => getCategories(), {
    retry: false,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
  return query;
}
