import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage/index";
import LayoutRoute from "./routes/LayoutRoute";
import { Routes, Route } from "react-router";
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import ForgotPassword from "./pages/Auth/ForgotPassword";
function App() {
  const routes = [{ path: "/", element: <HomePage /> }];
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutRoute element={element} />}
        />
      ))}
      <Route path="*" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="forgot-password" element = {<ForgotPassword />} />
    </Routes>
  );
}

export default App;
