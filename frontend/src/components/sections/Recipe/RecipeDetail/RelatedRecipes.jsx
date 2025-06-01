export default function RelatedRecipes() {
  const relatedRecipes = [
    { title: "Bún đậu mắm tôm", subtitle: "Món ăn dân dã" },
    { title: "Mì xương tôm thịt băm", subtitle: "Món ăn" },
    {
      title: "Thai Basil Easy One Pot Chicken and Rice",
      subtitle: "By Joshua Weissman",
    },
  ];

  return (
    <div>
      <h3 className="font-semibold mb-6 text-lg text-gray-800">
        Các món ăn tương tự
      </h3>
      <div className="space-y-4">
        {relatedRecipes.map((recipe, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/placeholder.svg?height=64&width=80"
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                {recipe.title}
              </h4>
              <p className="text-xs text-gray-500">{recipe.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
