import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { CloudinaryProvider } from "./context/CloudinaryContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = "976425852670-dssffurivreo0s2fpiumnc4c8qoctv5f.apps.googleusercontent.com"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GoogleOAuthProvider  clientId = {CLIENT_ID}>
          <SocketProvider>
            <CloudinaryProvider>
              <App />
            </CloudinaryProvider>
          </SocketProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
