import { useAppThunkDispatch } from "@/shared/store/hooks";
import { fetchCurrentUser } from "@/shared/store/slices/currentUser";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const jwt = localStorage.getItem("token");
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
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);
  if (!jwt) {
    return <Navigate to="/auth/login" replace />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return children;
};
