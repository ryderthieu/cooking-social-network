import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditCollectionModal({
  showModal,
  onClose,
  collection,
  onUpdateCollection,
}) {
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form when collection changes
  useEffect(() => {
    if (collection) {
      setCollectionName(collection.name || "");
      setCollectionDescription(collection.description || "");
    }
  }, [collection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collectionName.trim()) return;

    setIsLoading(true);
    try {
      await onUpdateCollection(collection._id, {
        name: collectionName.trim(),
        description: collectionDescription.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCollectionName(collection?.name || "");
    setCollectionDescription(collection?.description || "");
    onClose();
  };

  if (!showModal || !collection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa bộ sưu tập
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Collection Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên bộ sưu tập *
              </label>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập tên bộ sưu tập..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Collection Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả (tuỳ chọn)
              </label>
              <textarea
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Nhập mô tả cho bộ sưu tập..."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-colors disabled:opacity-50"
              disabled={isLoading || !collectionName.trim()}
            >
              {isLoading ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
