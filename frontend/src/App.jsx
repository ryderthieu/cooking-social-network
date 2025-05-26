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
import QuestionsPage from "./pages/SupportPage/Questions/QuestionsPage";
import ContactsPage from "./pages/SupportPage/Contact/ContactsPage";
import SupportsPage from "./pages/SupportPage/Contact/SupportsPage";
import AboutPage from "./pages/AboutPage";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import SearchPage from "./pages/SearchPage";
import PostPage from "./pages/PostPage";
import PostDetail from "./pages/PostPage/PostDetail";
function App() {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/blog/bai-viet-moi", element: <NewBlog /> },
    { path: "/blog/bai-viet-noi-bat", element: <HighlightBlog /> },
    { path: "/blog/bai-viet-pho-bien", element: <TopBlog /> },
    { path: "/support/dieu-khoan", element: <TermsPage /> },
    { path: "/support/dieu-kien", element: <ConditionsPage /> },
    { path: "/support/huong-dan", element: <InstructionsPage /> },
    { path: "/support/chuc-nang", element: <FunctionsPage /> },
    { path: "/support/cau-hoi", element: <QuestionsPage /> },
    { path: "/support/phan-hoi", element: <FeedbacksPage /> },
    { path: "/support/lien-he", element: <ContactsPage /> },
    { path: "/support/ho-tro", element: <SupportsPage /> },
    { path: "/search", element: <SearchPage /> },
    { path: "/posts", element: <PostPage /> },
    // { path: "/posts/:id", element: <PostDetail />}
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="/posts/:id" element={<PostDetail />} />
    </Routes>
  );
}

export default App;
