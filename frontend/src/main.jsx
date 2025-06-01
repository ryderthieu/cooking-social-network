import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { CloudinaryProvider } from "./context/CloudinaryContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <CloudinaryProvider>
            <App />
          </CloudinaryProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
