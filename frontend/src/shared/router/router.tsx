import { Outlet, createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "../../helpers/RequireAuth";
import { AuthLayout } from "../../layout/Auth/AuthLayout";
import { Login } from "../../pages/Auth/Login/Login";
import { Register } from "../../pages/Auth/Register/Register";
import { Profile } from "../../pages/profile/Profile";
import { NotFoundErrorPage } from "../Error/NotFoundPage";
import {
  default as AccountMenu,
  default as NavigationBar,
} from "../components/navigation/NavigationBar";
import { RoutesBoundary } from "./RoutesBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavigationBar />,
    children: [
      {
        path: "",
        element: (
          <RequireAuth>
            <AccountMenu />
            <Outlet />
          </RequireAuth>
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        errorElement: <RoutesBoundary />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
]);

export default router;
