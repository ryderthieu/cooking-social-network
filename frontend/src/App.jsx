import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/index";
import NewBlog from "./pages/BlogPage/NewBlog";
import HighlightBlog from "./pages/BlogPage/HighlightBlog";
import TopBlog from "./pages/BlogPage/TopBlog";
import Blog1 from "./pages/BlogPage/Blog1";
import Blog2 from "./pages/BlogPage/Blog2";
import Blog3 from "./pages/BlogPage/Blog3";
import Blog4 from "./pages/BlogPage/Blog4";
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
import NotificationPage from "./pages/NotificationPage";
import MessagePage from "./pages/MessagePage";
import AccountPage from "./pages/AccountPage";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import SearchPage from "./pages/SearchPage";
import PostPage from "./pages/PostPage";
import PostDetail from "./pages/PostPage/PostDetail";

import Recipes from "./pages/RecipesPage/Recipe";
import RecipeCategories from "./pages/RecipesPage";
import CreateRecipe from "./pages/RecipesPage/CreateRecipe";
import SavedRecipes from "./pages/RecipesPage/SavedRecipes";
import ProfilePage from "./pages/ProfilePage";
import HeaderLayout from "./components/layout/HeaderLayout";
import ChatPage from "./pages/ChatPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import RecipeDetail from "./pages/RecipesPage/RecipeDetail";

import Loader from "./components/loader/Loader";
import { useState, useEffect } from "react";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "*", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/blog/bai-viet-moi", element: <NewBlog /> },
    { path: "/blog/bai-viet-noi-bat", element: <HighlightBlog /> },
    { path: "/blog/bai-viet-pho-bien", element: <TopBlog /> },
    { path: "/blog/1", element: <Blog1 /> },
    { path: "/blog/2", element: <Blog2 /> },
    { path: "/blog/3", element: <Blog3 /> },
    { path: "/blog/4", element: <Blog4 /> },
    { path: "/support/dieu-khoan", element: <TermsPage /> },
    { path: "/support/dieu-kien", element: <ConditionsPage /> },
    { path: "/support/huong-dan", element: <InstructionsPage /> },
    { path: "/support/chuc-nang", element: <FunctionsPage /> },
    { path: "/support/cau-hoi", element: <QuestionsPage /> },
    { path: "/support/phan-hoi", element: <FeedbacksPage /> },
    { path: "/support/lien-he", element: <ContactsPage /> },
    { path: "/support/ho-tro", element: <SupportsPage /> },
    { path: "/notification", element: <NotificationPage /> },
    { path: "/search", element: <SearchPage /> },
    { path: "/posts", element: <PostPage /> },
    {
      path: "/profile",
      element: user ? (
        <Navigate to={`/profile/${user._id}`} replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    { path: "/account", element: <AccountPage /> },
    { path: "/profile/:userId", element: <ProfilePage /> },
    { path: "/recipes", element: <RecipeCategories /> },
    { path: "/recipes/create", element: <CreateRecipe /> },
    { path: "/recipes/saved", element: <SavedRecipes /> },
    { path: "/recipes/:categoryType/:item", element: <Recipes /> },
    { path: "/recipes/:id", element: <RecipeDetail /> },
    // { path: "/posts/:id", element: <PostDetail />}
    { path: "/explore/*", element: <PostPage /> },
  ];

  const headeronlyRoutes = [
    { path: "/messages/", element: <MessagePage /> },
    { path: "/messages/:conversationId", element: <MessagePage /> },
  ];

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <Routes>
          {routes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<LayoutRoute element={element} />}
            />
          ))}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/chat" element={<ChatPage />} />

          {headeronlyRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<HeaderLayout>{element}</HeaderLayout>}
            />
          ))}
        </Routes>
      )}
    </>
  );
}

export default App;
