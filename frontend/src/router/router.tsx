import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Navbar />
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
