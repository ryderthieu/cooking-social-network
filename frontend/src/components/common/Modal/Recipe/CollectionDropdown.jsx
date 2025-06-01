import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getUserCollectionsForDropdown, addRecipeToCollection } from '../../../../services/collectionService';
import { toast } from 'react-toastify';

const CollectionDropdown = ({ isOpen, onClose, recipeId, onSuccess }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCollections();
        }
    }, [isOpen]);

    const loadCollections = async () => {
        try {
            setLoading(true);
            const response = await getUserCollectionsForDropdown();
            if (response.success) {
                setCollections(response.data);
            }
        } catch (error) {
            console.error('Error loading collections:', error);
            toast.error('Không thể tải danh sách bộ sưu tập');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCollection = async (collectionId) => {
        try {
            const response = await addRecipeToCollection(collectionId, recipeId);
            if (response.success) {
                toast.success('Đã thêm công thức vào bộ sưu tập');
                onSuccess && onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error adding to collection:', error);
            toast.error('Không thể thêm vào bộ sưu tập');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-h-80 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Lưu vào bộ sưu tập
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Đang tải...</p>
                    </div>
                ) : collections.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                        {collections.map((collection) => (
                            <button
                                key={collection._id}
                                onClick={() => handleAddToCollection(collection._id)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                            >
                                {collection.thumbnail ? (
                                    <img
                                        src={collection.thumbnail}
                                        alt={collection.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-orange-600 font-semibold text-sm">
                                            {collection.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">
                                        {collection.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {collection.recipes?.length || 0} công thức
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có bộ sưu tập nào</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Hãy tạo bộ sưu tập đầu tiên của bạn!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionDropdown;
