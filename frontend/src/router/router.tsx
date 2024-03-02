import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "../helpers/RequireAuth";
import { AuthLayout } from "../layout/Auth/AuthLayout";
import { Login } from "../pages/Auth/Login/Login";
import { Register } from "../pages/Auth/Register/Register";
import { Profile } from "../pages/profile/Profile";

const router = createBrowserRouter([
  {
    path: "/auth",
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
    path: "/",
    element: (
      <RequireAuth>
        <div></div>
      </RequireAuth>
    ),
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "menu",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
