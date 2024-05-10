import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { useAppThunkDispatch } from "@/shared/store/hooks";
import { fetchCurrentUser } from "@/shared/store/slices/currentUser";
import { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = useCurrentUser();
  const dispatch = useAppThunkDispatch();
  useEffect(() => {
    try {
      const fetch = async () => {
        const user = await dispatch(fetchCurrentUser());
        // alert(user);
        console.log(user);
        // dispatch(setCurrentUser(user));
      };
      fetch();
      console.log("fetchMe");
    } catch (e: any) {
      toast.error(e?.response?.data?.message);

      console.log(e);
    }
  }, [dispatch]);
  if (!user.name) {
    toast.success("Нужно авторизировать");
    return <Navigate to="/auth/login" replace />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return children;
};
