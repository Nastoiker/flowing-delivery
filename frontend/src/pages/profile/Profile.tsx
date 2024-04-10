import { getCurrentUser } from "@/entities/user/api/user.api";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

export const Profile = () => {
  const { data } = useQuery(["currentUser"], async () => getCurrentUser(), {
    retry: false,
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
    },
  });
  return (
    <div>
      <h1>Профиль</h1>
      <h2>Логин: {data?.username}</h2>
      <h2>Имя: {data?.name}</h2>
      <h2>email: {data?.email}</h2>
    </div>
  );
};
