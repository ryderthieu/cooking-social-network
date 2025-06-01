import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSimilarRecipes } from "@/services/recipeService";
import Logo from "../../../../assets/orange-logo.svg"

export default function MoreRecipes() {
  const { id } = useParams();
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getSimilarRecipes(id, 6);
        setSimilarRecipes(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching similar recipes:", err);
        setError("Không thể tải công thức tương tự");
        // Fallback to empty array if error
        setSimilarRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarRecipes();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          Khám phá thêm
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-xl overflow-hidden shadow-md animate-pulse"
            >
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no similar recipes
  if (!similarRecipes || similarRecipes.length === 0) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          Khám phá thêm
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            {error || "Không có công thức tương tự nào được tìm thấy."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">
        Khám phá thêm
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarRecipes.map((recipe) => (
          <a
            href={`/recipes/${recipe._id}`}
            key={recipe._id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="relative">
              <img
                src={recipe.image?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={recipe.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=200&width=300";
                }}
              />
              <button 
                className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle like functionality here
                }}
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Difficulty and time badges */}
              {recipe.categories?.difficultyLevel && (
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-lg">
                  {recipe.categories.difficultyLevel}
                </span>
              )}
              
              {recipe.time && (
                <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                  {recipe.time} phút
                </span>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {recipe.name}
              </h3>
              
              {/* Author and rating */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <img 
                    src={recipe.author?.avatar || Logo}
                    alt={recipe.author?.firstName || "Author"}
                    className="w-4 h-4 rounded-full bg-gray-300"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=16&width=16";
                    }}
                  />
                  <span>
                    {recipe.author?.firstName && recipe.author?.lastName 
                      ? `${recipe.author.firstName} ${recipe.author.lastName}`
                      : "Oshisha"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐ {recipe.averageRating || "5.0"}</span>
                </div>
              </div>

              {/* Categories tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {recipe.categories?.mealType?.slice(0, 2).map((type, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
                {recipe.categories?.cuisine?.slice(0, 1).map((cuisine, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
