import { CssBaseline, ThemeProvider } from "@mui/material";

import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider } from "react-router-dom";

import { useEffect } from "react";
import { QueryClientProvider } from "react-query";
import "./App.css";
import { queryClient } from "./libs/react-query";
import { ErrorPage } from "./shared/Error/Error.page";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import router from "./shared/router/router";
import { useScaleViewPort } from "./shared/scale";
import { useAppThunkDispatch } from "./shared/store/hooks";
import { fetchCurrentUser } from "./shared/store/slices/currentUser";
import { AppTheme } from "./shared/theme";
function App() {
  useScaleViewPort(374);
  const dispatch = useAppThunkDispatch();

  useEffect(() => {
    try {
      const fetch = async () => {
        const user = await dispatch(fetchCurrentUser());
        console.log(user);
      };
      fetch();
      console.log("fetchMe");
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);
  return (
    <>
      <ErrorBoundary fallback={<ErrorPage />}>
        <CssBaseline />

        <ThemeProvider theme={AppTheme}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
