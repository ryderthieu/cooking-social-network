import React from "react";
import { X } from "lucide-react";

const AddCollectionModal = ({ 
  showModal, 
  onClose, 
  collectionName, 
  setCollectionName, 
  collectionDescription, 
  setCollectionDescription, 
  onCreateCollection 
}) => {
  const handleCloseModal = () => {
    onClose();
    setCollectionName("");
    setCollectionDescription("");
  };

  const handleCreateCollection = () => {
    onCreateCollection();
    setCollectionName("");
    setCollectionDescription("");
  };

  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Tạo bộ sưu tập mới</h3>
          <button 
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 p-2 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên bộ sưu tập
            </label>            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Nhập tên bộ sưu tập..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>            <textarea
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              placeholder="Mô tả về bộ sưu tập..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300 resize-none"
            />
          </div>
        </div>        {/* Modal Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateCollection}
            disabled={!collectionName.trim()}
            className={`flex-1 px-4 py-2 rounded-xl transition-colors ${
              collectionName.trim()
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollectionModal;