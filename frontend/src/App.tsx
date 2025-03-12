import { CssBaseline, ThemeProvider } from "@mui/material";

import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import { useEffect } from "react";
import { QueryClientProvider } from "react-query";
import "react-quill/dist/quill.snow.css";
import { scan } from "react-scan";
import "./App.css";
import BreakpointsProvider from "./app/Context/Breakpoints/BreakpointsProvider";
import { PhosphorProvider } from "./app/Context/IconContext";
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
        await dispatch(fetchCurrentUser());
      };
      fetch();
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  scan({
    enabled: true,
  });
  return (
    <>
      <ErrorBoundary fallback={<ErrorPage />}>
        <BreakpointsProvider>
          <CssBaseline />
          <ThemeProvider theme={AppTheme}>
            <Toaster />
            <QueryClientProvider client={queryClient}>
              <PhosphorProvider>
                <RouterProvider router={router} />
              </PhosphorProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </BreakpointsProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
