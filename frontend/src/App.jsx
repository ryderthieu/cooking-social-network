import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage/index";
import NewBlog from "./pages/BlogPage/NewBlog";
import HighlightBlog from "./pages/BlogPage/HighlightBlog";
import TopBlog from "./pages/BlogPage/TopBlog";
import LayoutRoute from "./routes/LayoutRoute";
import { Routes, Route } from "react-router";
import Recipes from "./pages/RecipesPage/Recipe";
import SavedRecipes from "./pages/RecipesPage/SavedRecipes";
import RecipeCategories from "./pages/RecipesPage/Recipes";


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
      <Route path="/login" />


      <Route path="/recipes" element={<RecipeCategories />} />
      <Route path="/saved-recipes" element={<SavedRecipes />} />
      <Route path="/recipes/:categoryType/:item" element={<Recipes />} />

      <Route path="/recipes" element={<RecipeCategories />} />
    </Routes>
  );
}

export default App;
