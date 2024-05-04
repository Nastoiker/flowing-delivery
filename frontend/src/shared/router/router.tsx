import { ProtectedRoute } from "@/helpers/ProtectedRoute";
import { CategoriesPage } from "@/pages/Categories/Categories";
import { CategoriesFoodsById } from "@/pages/Categories/CategoriesFoodsById";
import { FoodPage } from "@/pages/Foods/Food.page";
import { FoodById } from "@/pages/Foods/FoodById.page";
import { FoodFindBySearch } from "@/pages/Foods/FoodFindBySearch";
import { AdminPanel } from "@/pages/admin-panel/AdminPanel";
import { ShoppingCardPage } from "@/pages/shopping-card/ShoppingCard";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "../../helpers/RequireAuth";
import { AuthLayout } from "../../layout/Auth/AuthLayout";
import { Login } from "../../pages/Auth/Login/Login";
import { Register } from "../../pages/Auth/Register/Register";
import { Profile, USER_ROLES } from "../../pages/profile/Profile";
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
        path: "categories/:id",
        element: <CategoriesFoodsById />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
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
            element: (
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminPanel />
              </ProtectedRoute>
            ),
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
        children: [],
      },
      {
        path: "menu/:id",
        element: <FoodById />,
      },
      {
        path: "menu/search",
        element: <FoodFindBySearch />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
]);

export default router;
