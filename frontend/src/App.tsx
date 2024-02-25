import { Theme } from "@radix-ui/themes";

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { queryClient } from "./react-query";
import router from "./router/router";
function App() {
  return (
    <>
      <Theme appearance="dark">
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Theme>
    </>
  );
}

export default App;
