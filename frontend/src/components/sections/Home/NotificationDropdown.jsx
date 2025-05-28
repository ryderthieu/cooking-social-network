import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

const notifications = [
  {
    id: "#258485",
    action: "Place an order",
    time: "9 hours ago",
    user: "Jonathon Smith",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "#478541",
    action: "Place an order",
    time: "9 hours ago",
    user: "Jonathon Smith",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: "#264448",
    action: "Place an order",
    time: "9 hours ago",
    user: "Jonathon Smith",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "#365481",
    action: "Cancel an order",
    time: "9 hours ago",
    user: "Jonathon Smith",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {open && (
        <div className="absolute right-0 mt-6 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">
            Notification
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.map((n, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 hover:bg-gray-50"
              >
                <img
                  src={n.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-black">{n.user}</span>{" "}
                    {n.action}{" "}
                    <span className="text-orange-500 hover:underline cursor-pointer">
                      {n.id}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center">
            <a
              href="/notification"
              className="text-sm text-orange-500 font-semibold hover:underline"
            >
              All Notification
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
