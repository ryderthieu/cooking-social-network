import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit3, Image, Trash2 } from "lucide-react";

export default function CollectionOptionsDropdown({
  onEdit,
  onChangeImage,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleOptionClick = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-gray-400 hover:text-gray-600 bg-gray-100 transition-colors rounded-full hover:bg-gray-200"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-56 bg-white border border-gray-50 rounded-2xl shadow-lg z-50 py-1">
          <button
            onClick={() => handleOptionClick(onEdit)}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Edit3 size={16} />
            <span>Đổi tên bộ sưu tập</span>
          </button>
          <button
            onClick={() => handleOptionClick(onChangeImage)}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Image size={16} />
            <span>Đổi ảnh bộ sưu tập</span>
          </button>

          <button
            onClick={() => handleOptionClick(onDelete)}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Trash2 size={16} />
            <span>Xóa bộ sưu tập</span>
          </button>
        </div>
      )}
    </div>
  );
}
