import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { SearchProvider } from "./app/Context/SearchContext.tsx";
import { store } from "./shared/store/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SearchProvider>
        <App />
      </SearchProvider>
    </Provider>
  </React.StrictMode>
);
