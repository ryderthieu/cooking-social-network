import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteRecipeModal = ({ isOpen, onClose, onConfirm, recipeName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black backdrop:blur-xl bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-start gap-4">
          {/* Warning Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xóa công thức
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa công thức <strong>"{recipeName}"</strong>? 
              <br/>Hành động này không thể hoàn tác.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy bỏ
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 100-16 8 8 0 000 16zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRecipeModal;
