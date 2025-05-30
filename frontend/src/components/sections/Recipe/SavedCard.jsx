import { Clock, Heart, MoreVertical } from "lucide-react"
import { Link } from "react-router-dom"

const SavedCard = ({ recipe }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200">
      {/* Recipe Image Container */}
      <div className="relative h-56 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

        {/* Main image */}
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Top action buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
            <Heart size={16} className="text-orange-500" fill="currentColor" />
          </button>
          <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Recipe type badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-md rounded-full text-xs font-semibold text-orange-700 shadow-lg border border-orange-100">
            {recipe.type}
          </span>
        </div>

        {/* Author info */}
        <div className="absolute bottom-2 right-2 z-30">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-lg rounded-full shadow-lg border border-white group-hover:shadow-orange-200/50 transition-all duration-500">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-orange-100 shadow-sm transform group-hover:scale-105 transition-transform duration-500">
              <img
                src="/avatars/default.png"
                alt="avatar"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=B&background=f97316&color=fff"
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-orange-800 whitespace-nowrap">{recipe.author}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <Link to={`/recipes/${recipe.id}`} className="block group/link">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3 group-hover/link:text-orange-600 transition-colors duration-300 leading-tight">
            {recipe.title}
          </h3>
        </Link>

        {/* Recipe stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <Clock size={14} className="text-gray-500" />
            </div>
            <span className="text-sm font-medium">{recipe.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-xs">Độ khó:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`w-1.5 h-1.5 rounded-full ${level <= 2 ? "bg-orange-400" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to={`/recipes/${recipe.id}`}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm font-semibold rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Xem công thức
          </Link>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-300/10 to-yellow-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}

export default SavedCard
