import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage/index";
import NewBlog from "./pages/BlogPage/NewBlog";
import HighlightBlog from "./pages/BlogPage/HighlightBlog";
import TopBlog from "./pages/BlogPage/TopBlog";
import LayoutRoute from "./routes/LayoutRoute";
import { Routes, Route } from "react-router";

function App() {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/blog/bai-viet-moi", element: <NewBlog /> },
    { path: "/blog/bai-viet-noi-bat", element: <HighlightBlog /> },
    { path: "/blog/bai-viet-pho-bien", element: <TopBlog /> },
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
