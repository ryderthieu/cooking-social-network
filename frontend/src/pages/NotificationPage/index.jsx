import { useState } from "react";
import {
  Bell,
  Star,
  Eye,
  UserPlus,
  MessageCircle,
  CheckCircle,
} from "lucide-react";

const allNotifications = [
  {
    id: 1,
    icon: <Star className="w-5 h-5 text-blue-500" />,
    content: "6 stories about Design and User Experience",
    read: false,
  },
  {
    id: 2,
    icon: <Eye className="w-5 h-5 text-green-600" />,
    content: "You crossed 2,500 views on your answers today!",
    read: true,
  },
  {
    id: 3,
    icon: <UserPlus className="w-5 h-5 text-purple-500" />,
    content: "1 more person followed you today.",
    read: false,
  },
  {
    id: 4,
    icon: <MessageCircle className="w-5 h-5 text-orange-500" />,
    content: "1 person requested your answer this week.",
    read: true,
  },
  {
    id: 5,
    icon: <CheckCircle className="w-5 h-5 text-yellow-500" />,
    content: "User upvoted your answer to a product design question.",
    read: false,
  },
];

const NotificationPage = () => {
  const [filter, setFilter] = useState("all");

  const filtered = allNotifications.filter((n) =>
    filter === "all" ? true : filter === "read" ? n.read : !n.read
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md flex">
        {/* Left Sidebar */}
        <aside className="w-1/4 border-r p-6">
          <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setFilter("all")}
                className={`text-left w-full px-3 py-2 rounded-md ${
                  filter === "all"
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                Tất cả thông báo
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("unread")}
                className={`text-left w-full px-3 py-2 rounded-md ${
                  filter === "unread"
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                Chưa đọc
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("read")}
                className={`text-left w-full px-3 py-2 rounded-md ${
                  filter === "read"
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                Đã đọc
              </button>
            </li>
          </ul>
        </aside>

        {/* Right Content */}
        <main className="w-3/4 p-6">
          <h2 className="text-xl font-bold mb-4">Thông báo</h2>
          {filtered.length === 0 ? (
            <p className="text-gray-500">Không có thông báo.</p>
          ) : (
            <ul className="space-y-4">
              {filtered.map((n) => (
                <li
                  key={n.id}
                  className={`flex gap-4 items-start p-4 border rounded-md ${
                    n.read ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div>{n.icon}</div>
                  <p className="text-sm text-gray-800">{n.content}</p>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotificationPage;
