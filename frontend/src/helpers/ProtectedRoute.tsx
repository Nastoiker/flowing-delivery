import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { EMPLOYEES_ROLES_ARRAY, USER_ROLES } from "@/pages/profile/Profile";
import { PropsWithChildren } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  allowedRoles = EMPLOYEES_ROLES_ARRAY,
  children,
}: PropsWithChildren<{ allowedRoles: USER_ROLES[] }>) => {
  const user = useCurrentUser();
  if (!allowedRoles.includes(Number(user?.roles) as unknown as USER_ROLES)) {
    toast.error("У вас недостаточно прав");
    return <Navigate to="/menu" replace />;
  }
  return children;
};
