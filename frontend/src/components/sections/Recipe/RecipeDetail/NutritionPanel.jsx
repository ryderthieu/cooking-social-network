export default function NutritionPanel({ calculatedNutrition }) {
  const defaultNutrition = [
    { label: "Calories", value: "270.9 kcal", highlight: true },
    { label: "Chất béo", value: "10.7 g" },
    { label: "Protein", value: "7.9 g" },
    { label: "Carbohydrate", value: "35.3 g" },
    { label: "Cholesterol", value: "37.4 mg" },
  ];

  const nutritionData = calculatedNutrition
    ? [
        {
          label: "Calories",
          value: `${calculatedNutrition.calories} kcal`,
          highlight: true,
        },
        {
          label: "Chất béo",
          value: `${calculatedNutrition.fat} g`,
        },
        {
          label: "Protein",
          value: `${calculatedNutrition.protein} g`,
        },
        {
          label: "Carbohydrate",
          value: `${calculatedNutrition.carbs} g`,
        },
        {
          label: "Cholesterol",
          value: `${calculatedNutrition.cholesterol} mg`,
        },
      ]
    : defaultNutrition;

  return (
    <div className="lg:w-1/3">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">
          Bảng dinh dưỡng
        </h3>
        <div className="text-sm space-y-3">
          {nutritionData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-gray-600">{item.label}</span>
              <span
                className={`${
                  item.highlight
                    ? "font-bold text-orange-600"
                    : "font-medium text-gray-800"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">
          *Thông tin dinh dưỡng được tính toán tự động dựa trên nguyên liệu
          trong công thức.
        </p>
      </div>
    </div>
  );
}
