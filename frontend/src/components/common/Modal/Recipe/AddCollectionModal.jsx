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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Nhập tên bộ sưu tập..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#97570450] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              placeholder="Mô tả về bộ sưu tập..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#97570450] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="my-2 flex">
          <button
            onClick={handleCreateCollection}
            disabled={!collectionName.trim()}
            className="flex-1 px-4 py-3 bg-[#975704] text-white rounded-full hover:bg-[#97570450] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollectionModal;