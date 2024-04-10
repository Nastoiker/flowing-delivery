import { CssBaseline, ThemeProvider } from "@mui/material";

import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "react-query";
import "./App.css";
import { queryClient } from "./libs/react-query";
import { ErrorPage } from "./shared/Error/Error.page";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import router from "./shared/router/router";
import { useScaleViewPort } from "./shared/scale";
import { AppTheme } from "./shared/theme";
function App() {
  useScaleViewPort(374);

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
