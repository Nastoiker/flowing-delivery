import { CategoriesPage } from "@/pages/Categories/Categories";
import { FoodPage } from "@/pages/Foods/Food.page";
import { AdminPanel } from "@/pages/admin-panel/AdminPanel";
import { ShoppingCardPage } from "@/pages/shopping-card/ShoppingCard";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "../../helpers/RequireAuth";
import { AuthLayout } from "../../layout/Auth/AuthLayout";
import { Login } from "../../pages/Auth/Login/Login";
import { Register } from "../../pages/Auth/Register/Register";
import { Profile } from "../../pages/profile/Profile";
import { NotFoundErrorPage } from "../Error/NotFoundPage";
import { default as NavigationBar } from "../components/navigation/NavigationBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavigationBar />
        <Outlet />
        {/* <Footer /> */}
      </>
    ),
    children: [
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        // errorElement: <RoutesBoundary />,
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
      {
        path: "",
        element: (
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        ),
        children: [
          {
            path: "admin",
            element: <AdminPanel />,
          },
          {
            path: "shopping-cart",
            element: <ShoppingCardPage />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "menu",
        element: <FoodPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
]);

export default router;
