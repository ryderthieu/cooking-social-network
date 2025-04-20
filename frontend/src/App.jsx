import React from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage/index";
import NewBlog from "./pages/BlogPage/NewBlog";
import HighlightBlog from "./pages/BlogPage/HighlightBlog";
import TopBlog from "./pages/BlogPage/TopBlog";
import LayoutRoute from "./routes/LayoutRoute";
import TermsPage from "./pages/SupportPage/TermsAndConditions/TermsPage";
import ConditionsPage from "./pages/SupportPage/TermsAndConditions/ConditionsPage";
import FeedbacksPage from "./pages/SupportPage/Questions/FeedbacksPage";
import InstructionsPage from "./pages/SupportPage/UserGuide/InstructionsPage";
import FunctionsPage from "./pages/SupportPage/UserGuide/FunctionsPage";

function App() {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/blog/bai-viet-moi", element: <NewBlog /> },
    { path: "/blog/bai-viet-noi-bat", element: <HighlightBlog /> },
    { path: "/blog/bai-viet-pho-bien", element: <TopBlog /> },
    { path: "/support/dieu-khoan", element: <TermsPage /> },
    { path: "/support/dieu-kien", element: <ConditionsPage /> },
    { path: "/support/huong-dan", element: <InstructionsPage /> },
    { path: "/support/chuc-nang", element: <FunctionsPage /> },
    { path: "/support/phan-hoi", element: <FeedbacksPage /> },
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
      <Route path="/login" />
    </Routes>
  );
}

export default App;
