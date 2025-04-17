import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage/index";
import BlogPage from "./pages/BlogPage/index";
import LayoutRoute from "./routes/LayoutRoute";
import { Routes, Route } from "react-router";

function App() {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/blog", element: <BlogPage /> },
  ];
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
    </Routes>
  );
}

export default App;
