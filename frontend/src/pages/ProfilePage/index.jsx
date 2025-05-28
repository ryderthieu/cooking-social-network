import React from 'react';

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Cover Photo */}
      <div className="h-48 bg-gray-200 rounded-b-lg relative">
        <img
          src="/images/cover-placeholder.jpg"
          alt="Cover"
          className="object-cover w-full h-full rounded-b-lg"
        />
        {/* Avatar */}
        <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
          <img
            src="/images/avatar-placeholder.jpg"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 flex flex-col items-center">
        <h2 className="text-2xl font-bold">Tên người dùng</h2>
        <p className="text-gray-600 mt-1">Giới thiệu ngắn về bản thân hoặc sở thích nấu ăn...</p>
        <div className="flex gap-4 mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Chỉnh sửa</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Theo dõi</button>
        </div>
        <div className="flex gap-8 mt-4 text-center">
          <div>
            <div className="font-bold">120</div>
            <div className="text-gray-500 text-sm">Công thức</div>
          </div>
          <div>
            <div className="font-bold">2.3k</div>
            <div className="text-gray-500 text-sm">Người theo dõi</div>
          </div>
          <div>
            <div className="font-bold">180</div>
            <div className="text-gray-500 text-sm">Đang theo dõi</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mt-8 border-b">
        <button className="py-2 px-4 border-b-2 border-blue-500 font-semibold">Bài đăng</button>
        <button className="py-2 px-4 text-gray-500 hover:text-blue-500">Công thức</button>
        <button className="py-2 px-4 text-gray-500 hover:text-blue-500">Video</button>
        <button className="py-2 px-4 text-gray-500 hover:text-blue-500">Đã lưu</button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded shadow p-4">Bài đăng/Công thức/Video 1</div>
        <div className="bg-white rounded shadow p-4">Bài đăng/Công thức/Video 2</div>
        <div className="bg-white rounded shadow p-4">...</div>
      </div>
    </div>
  );
}