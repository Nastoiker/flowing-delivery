import { logger } from "@/app/Logger/Logger";
import { useRouteError } from "react-router-dom";
import { ErrorPage } from "../Error/Error.page";

export const RoutesBoundary = () => {
  const error: any = useRouteError();

  logger.crit(error?.message);

  return <ErrorPage />;
};
