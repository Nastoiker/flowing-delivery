import { useAppThunkDispatch } from "@/shared/store/hooks";
import { fetchCurrentUser } from "@/shared/store/slices/currentUser";
import { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { getItem } from "./localStorage";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = getItem("token");
  const dispatch = useAppThunkDispatch();
  const location = useLocation();

  useEffect(() => {
    try {
      const fetch = async () => {
        await dispatch(fetchCurrentUser());
      };
      fetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.message);

      console.log(e);
    }
  }, [dispatch, location, user]);
  if (!user) {
    toast.success("Нужно авторизироваться");
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
