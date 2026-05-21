import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  AuthenticationGuard,
  TIDClient,
  TIDProvider,
} from "@trimble-oss/trimble-id-react";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <TIDProvider
      tidClient={
        new TIDClient({
          config: {
            configurationEndpoint:
              "https://stage.id.trimblecloud.com/.well-known/openid-configuration",
            clientId: import.meta.env.VITE_TID_CLIENT_ID,
            redirectUrl: "http://localhost:5173",
            logoutRedirectUrl: "https://stage.id.trimblecloud.com/oauth/logout",
            scopes: import.meta.env.VITE_TID_SCOPES.split(","),
          },
        })
      }
      onRedirectCallback={() => {
        window.history.replaceState({}, document.title, window.origin);
      }}
    >
      <AuthenticationGuard
        loader={<div>Loading...</div>}
        renderComponent={<App />}
      />
    </TIDProvider>
  </StrictMode>
);
