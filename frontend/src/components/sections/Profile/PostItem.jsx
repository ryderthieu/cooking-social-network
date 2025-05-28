import React from 'react';

export default function PostItem({ post }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
      <div className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={post.avatarSrc}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <button className="rounded-full size-5 p-2 hover:bg-gray-100">
            <span>⋯</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className="text-gray-700 mb-4">{post.content}</p>
        </div>

        {post.imageSrc && (
          <div className="relative">
            <img
              src={post.imageSrc}
              alt={post.imageAlt}
              className="w-full h-72 object-cover"
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="flex items-center text-gray-600 hover:text-red-500">
                <span className="mr-2">❤️</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <span className="mr-2">💬</span>
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-green-500">
                <span className="mr-2">🔄</span>
                <span>{post.shares}</span>
              </button>
            </div>
            <button className="text-gray-600 hover:text-amber-500">
              <span>🔖</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}