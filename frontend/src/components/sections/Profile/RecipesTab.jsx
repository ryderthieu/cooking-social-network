import React, { useEffect, useState } from 'react';
import SavedCard from '../Recipe/SavedCard';
import { getMyRecipes, getRecipeByUserId } from '@/services/recipeService';
import { useAuth } from '@/context/AuthContext';

export default function RecipesTab({ userId }) {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let response;

        if (userId) {
          response = await getRecipeByUserId(userId);
        } else if (currentUser?._id) {
          response = await getMyRecipes();
        } else {
          setError("Thông tin người dùng không khả dụng");
          return;
        }

        if (response.success) {
          setRecipes(response.data || []);
        } else {
          setError(response.error || "Không thể tải công thức");
        }
      } catch (err) {
        console.error("Lỗi khi tải công thức:", err);
        setError("Không thể tải công thức. Vui lòng thử lại sau.");
      }
    };

    fetchRecipes();
  }, [userId, currentUser]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-3xl text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Chưa có công thức nào
        </h3>
        <p className="text-gray-600">
          Hãy chia sẻ những công thức nấu ăn yêu thích của bạn!
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recipes.map((recipe) => (
        <SavedCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}