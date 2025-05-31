import BreadCrumb from "@/components/common/BreadCrumb"
import { Heart, Play, ChevronDown, Share2, Bookmark } from "lucide-react"

export default function RecipeDetail({id, title, image, category, chef, className}) {
  return (
    <div className={`max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 py-4">
        <BreadCrumb />
      </div>

      {/* Recipe Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">
        {title || "Gà ù muối kèm sốt chấm tê tê cay cay nách giựt giựt"}
      </h1>

      {/* Author and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={chef?.avatar || "/placeholder.svg?height=32&width=32"}
                alt={chef?.name || "Người Nhà Trồng"}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{chef?.name || "Người Nhà Trồng"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">Thời gian nấu: 1h</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">⭐ 5.0</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Bookmark className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Main Recipe Image with Video Button */}
        <div className="lg:w-2/3">
          <div className="relative group">
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
              <img
                src={image || "/placeholder.svg?height=400&width=600"}
                alt={title || "Gà ù muối kèm sốt chấm"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110">
                <Play className="w-6 h-6 text-gray-700 ml-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Nutritional Information */}
        <div className="lg:w-1/3">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-lg text-gray-800">Bảng dinh dưỡng</h3>
            <div className="text-sm space-y-3">
              {[
                { label: "Calories", value: "270.9 kcal", highlight: true },
                { label: "Chất béo", value: "10.7 g" },
                { label: "Protein", value: "7.9 g" },
                { label: "Carbohydrate", value: "35.3 g" },
                { label: "Cholesterol", value: "37.4 mg" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`${item.highlight ? 'font-bold text-orange-600' : 'font-medium text-gray-800'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">
              *Thông tin dinh dưỡng được tính toán dựa trên ước lượng và phân tích phòng thí nghiệm.
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Description */}
      <p className="text-gray-600 mb-8 text-base leading-relaxed">
        Gà ù muối là một món ăn đơn giản, thơm ngon ngọt, kết hợp với sốt cay cay để tạo nên hương vị đặc biệt.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Ingredients Section */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Thành phần</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Dành cho</span>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 hover:border-gray-400 transition-colors cursor-pointer">
                  <span className="font-medium">4</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Gà ù muối */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4 text-lg text-gray-800">Gà ù muối</h3>
              <div className="space-y-4">
                {[
                  { name: "Thịt gà", amount: "5 miếng", colorBg: "bg-orange-100", colorDot: "bg-orange-400" },
                  { name: "Muối hột", amount: "1 kg", colorBg: "bg-orange-100", colorDot: "bg-orange-400" },
                  { name: "Lá", amount: "5 cái", colorBg: "bg-green-100", colorDot: "bg-green-400" },
                  { name: "Gừng", amount: "2 củ", colorBg: "bg-yellow-100", colorDot: "bg-yellow-400" },
                  { name: "Hành tím", amount: "2 củ", colorBg: "bg-purple-100", colorDot: "bg-purple-400" }
                ].map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${ingredient.colorBg} rounded-full flex items-center justify-center`}>
                        <div className={`w-5 h-5 ${ingredient.colorDot} rounded-full`}></div>
                      </div>
                      <span className="font-medium text-gray-700">{ingredient.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sốt cay */}
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-lg text-gray-800">Sốt cay</h3>
              <div className="space-y-4">
                {[
                  { name: "Tương ớt", amount: "2 muỗng canh", colorBg: "bg-red-100", colorDot: "bg-red-500" },
                  { name: "Sả ớt", amount: "1 muỗng canh", colorBg: "bg-red-600", colorDot: "bg-red-700" },
                  { name: "Nước mắm", amount: "1 muỗng canh", colorBg: "bg-red-400", colorDot: "bg-red-700" }
                ].map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${ingredient.colorBg} rounded-full flex items-center justify-center`}>
                        <div className={`w-5 h-5 ${ingredient.colorDot} rounded-full`}></div>
                      </div>
                      <span className="font-medium text-gray-700">{ingredient.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cooking Instructions */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Hướng dẫn cách làm</h2>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Sơ chế gà",
                  description: "Gà rửa sạch, để ráo nước. Sau đó cắt thành từng miếng vừa ăn. Ướp gà với muối hạt, hành tím, gừng đập dập trong 30 phút để thấm gia vị.",
                  hasImage: true
                },
                {
                  step: 2,
                  title: "Ủ muối",
                  description: "Lót lá lên đĩa, phủ một lớp muối hạt lên trên. Đặt gà lên trên lớp muối. Sau đó phủ tiếp một lớp muối lên trên gà. Ủ gà trong muối khoảng 30 phút để thấm gia vị. Sau khi ủ xong, lấy gà ra khỏi muối, rửa sạch lại với nước. Để ráo nước trước khi làm cay."
                },
                {
                  step: 3,
                  title: "Làm sốt cay",
                  description: "Cho tất cả các nguyên liệu sốt vào chén. Khuấy đều để các gia vị hòa quyện vào nhau, tạo thành sốt chấm đậm đà cay nồng.",
                  hasImage: true
                },
                {
                  step: 4,
                  title: "Hoàn thành",
                  description: "Xếp gà ra đĩa, thành đĩa đẹp mắt cùng sốt. Món ăn có thể dùng nóng hoặc nguội đều ngon."
                }
              ].map((instruction, index) => (
                <div key={index} className="border-l-4 border-orange-400 pl-6">
                  <h3 className="font-semibold mb-3 text-lg text-gray-800">
                    Bước {instruction.step}: {instruction.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {instruction.description}
                  </p>
                  {instruction.hasImage && (
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt={instruction.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Đánh giá</h2>
            <textarea 
              placeholder="Viết đánh giá của bạn..." 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="4"
            />
            <button className="mt-3 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Gửi đánh giá
            </button>
          </div>
        </div>

        <div className="lg:w-1/3">
          {/* Related Recipes */}
          <div>
            <h3 className="font-semibold mb-6 text-lg text-gray-800">Các món ăn tương tự</h3>
            <div className="space-y-4">
              {[
                { title: "Bún đậu mắm tôm", subtitle: "Món ăn dân dã" },
                { title: "Mì xương tôm thịt băm", subtitle: "Món ăn" },
                { title: "Thai Basil Easy One Pot Chicken and Rice", subtitle: "By Joshua Weissman" }
              ].map((recipe, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=64&width=80"
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">{recipe.title}</h4>
                    <p className="text-xs text-gray-500">{recipe.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* More Recipes Section */}
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Khám phá thêm từ Ẩn vật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Mì xương tôm thịt băm",
            "Matcha Latte ngon tuyệt đỉnh sáng và sáng tối",
            "Strawberry Oatmeal Pancake with Honey"
          ].map((title, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt={title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <span>By Shisha</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐ 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}