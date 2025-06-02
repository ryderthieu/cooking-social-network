import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import Portal from '../Portal';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all relative z-[10000]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">Xác nhận xóa</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-8">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Xóa bài viết
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DeleteConfirmModal; 