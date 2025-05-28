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
import NotificationPage from "./pages/NotificationPage";
import MessagePage from "./pages/MessagePage";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import SearchPage from "./pages/SearchPage";
import PostPage from "./pages/PostPage";
import PostDetail from "./pages/PostPage/PostDetail";

import Recipes from "./pages/RecipesPage/Recipe";
import SavedRecipes from "./pages/RecipesPage/SavedRecipes";
import RecipeCategories from "./pages/RecipesPage";
import HeaderLayout from "./components/layout/HeaderLayout";
import ChatPage from "./pages/ChatPage";
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  const {user} = useAuth()
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
    { path: "/notification", element: <NotificationPage /> },
    { path: "/search", element: <SearchPage /> },
    { path: "/explore/*", element: <PostPage /> },
  ];

  const headeronlyRoutes = [{ path: "/messages", element: <MessagePage /> }];

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

      <Route path="/recipes" element={<RecipeCategories />} />
      <Route path="/saved-recipes" element={<SavedRecipes />} />
      <Route path="/recipes/:categoryType/:item" element={<Recipes />} />
      <Route path="/recipes" element={<RecipeCategories />} />
      <Route path="/chat" element={<ChatPage />} />

      {headeronlyRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<HeaderLayout>{element}</HeaderLayout>}
        />
      ))}
    </Routes>

  );
}

export default App;
