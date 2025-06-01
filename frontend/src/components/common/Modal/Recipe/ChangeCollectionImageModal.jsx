import React, { useState, useRef } from "react";
import { X, Upload, Image } from "lucide-react";
import { useCloudinary } from "../../../../context/CloudinaryContext";

export default function ChangeCollectionImageModal({
  showModal,
  onClose,
  onUpdateImage,
  collection,
  isLoading = false,
}) {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadImage } = useCloudinary();

  if (!showModal) return null;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      console.log("Starting upload to Cloudinary...");
      
      // Upload ảnh lên Cloudinary trước
      const uploadResult = await uploadImage(selectedFile, "collections");
      console.log("Cloudinary upload result:", uploadResult);
      
      // Sau đó update collection với URL mới
      console.log("Updating collection with URL:", uploadResult.secure_url);
      await onUpdateImage(collection._id, uploadResult.secure_url);
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Không đóng modal nếu có lỗi
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Đổi ảnh bộ sưu tập
          </h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Chọn ảnh mới cho bộ sưu tập "{collection?.name}"
            </p>
            
            {/* Current/Preview Image */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={collection?.thumbnail} 
                  alt={collection?.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Upload size={16} />
              <span>Chọn ảnh mới</span>
            </button>

            {selectedFile && (
              <p className="text-sm text-gray-500 mt-2">
                Đã chọn: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>          <button
            onClick={handleSubmit}
            disabled={uploading || isLoading || !selectedFile}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading || isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Image size={16} />
                <span>Cập nhật ảnh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
