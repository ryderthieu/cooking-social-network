import React from "react";
import { X, Trash2 } from "lucide-react";

export default function DeleteCollectionModal({
  showModal,
  onClose,
  onConfirmDelete,
  collectionName,
  isLoading = false,
}) {
  if (!showModal) return null;

  const handleConfirm = () => {
    onConfirmDelete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Xác nhận xóa bộ sưu tập
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <p className="text-gray-700 text-center mb-2">
            Bạn có chắc chắn muốn xóa bộ sưu tập
          </p>
          <p className="text-lg font-semibold text-center mb-2">
            "{collectionName}"?
          </p>
          <p className="text-sm text-gray-500 text-center">
            Hành động này không thể hoàn tác. Tất cả công thức trong bộ sưu tập sẽ không bị xóa.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Xóa bộ sưu tập</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
