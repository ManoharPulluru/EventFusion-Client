import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppStates from "./Context/AppStates.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="311151984401-7sn1k89h66pse9jk45feppc85bk8k0s9.apps.googleusercontent.com">
    <AppStates> {/* Wrap App with AppStates */}
      <App />
    </AppStates>
  </GoogleOAuthProvider>
);
