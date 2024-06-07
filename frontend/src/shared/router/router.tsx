import { FoodEditPage } from "@/entities/product/food/FoodEdit.page";
import { ProtectedRoute } from "@/helpers/ProtectedRoute";
import { CategoriesPage } from "@/pages/Categories/Categories";
import { CategoriesFoodsById } from "@/pages/Categories/CategoriesFoodsById";
import { FoodPage } from "@/pages/Foods/Food.page";
import { FoodById } from "@/pages/Foods/FoodById.page";
import { FoodFindBySearch } from "@/pages/Foods/FoodFindBySearch";
import { Offerta } from "@/pages/Oferta/Oferta";
import { Politics } from "@/pages/Politics/Politics";
import { AdminPanel } from "@/pages/admin-panel/AdminPanel";
import { OrderById } from "@/pages/orders/OrderById.edit";
import { OrdersPage } from "@/pages/orders/Orders.page";
import { ShoppingCardPage } from "@/pages/shopping-card/ShoppingCard";
import { Box } from "@mui/material";
import { Outlet, createBrowserRouter } from "react-router-dom";
import styled from "styled-components";
import { RequireAuth } from "../../helpers/RequireAuth";
import { AuthLayout } from "../../layout/Auth/AuthLayout";
import { Login } from "../../pages/Auth/Login/Login";
import { Register } from "../../pages/Auth/Register/Register";
import { Profile, USER_ROLES } from "../../pages/profile/Profile";
import { NotFoundErrorPage } from "../Error/NotFoundPage";
import { default as NavigationBar } from "../components/navigation/NavigationBar";
const Wrapper = styled(Box)`
  @media (max-width: 1260px) {
    margin: auto 20px;
  }
`;
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavigationBar />
        <Wrapper>
          <Outlet />
        </Wrapper>
        {/* TODO */}
        {/* <Up /> */}
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
            path: "orders",
            element: (
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <OrdersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <OrderById />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/menu/:id",
            element: (
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <FoodEditPage />
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
    path: "/politics",
    element: <Politics />,
  },
  {
    path: "oferta",
    element: <Offerta />,
  },
  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
]);

export default router;
