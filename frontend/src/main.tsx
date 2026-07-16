import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouterProvider } from "./app/providers/RouterProvider";
import { StoreProvider } from "./app/providers/index";
import { GlobalToast } from "./app/providers/GlobalToast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <GlobalToast />
      <AppRouterProvider />
    </StoreProvider>
  </StrictMode>,
);
