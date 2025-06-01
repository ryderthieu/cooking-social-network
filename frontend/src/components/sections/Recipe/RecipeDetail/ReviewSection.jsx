import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import StarRating from './StarRating';
import { 
  createReview, 
  updateReview, 
  deleteReview, 
  getReviewsByRecipe, 
  getUserReviewForRecipe 
} from '@/services/reviewService';
import { Edit2, Trash2, MessageSquare } from 'lucide-react';

const ReviewSection = ({ recipeId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (recipeId) {
      loadReviews();
      if (user) {
        loadUserReview();
      }
    }
  }, [recipeId, user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviewsByRecipe(recipeId);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReview = async () => {
    try {
      const response = await getUserReviewForRecipe(recipeId);
      setUserReview(response.data);
    } catch (error) {
      console.error('Error loading user review:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (newRating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = { rating: newRating, comment: newComment };
      
      if (editingReview) {
        await updateReview(editingReview._id, reviewData);
        setEditingReview(null);
      } else {
        await createReview(recipeId, reviewData);
      }

      setNewRating(0);
      setNewComment('');
      await loadReviews();
      await loadUserReview();
    } catch (error) {
      alert(error.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment || '');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await deleteReview(reviewId);
      await loadReviews();
      await loadUserReview();
    } catch (error) {
      alert(error.message || 'Có lỗi xảy ra khi xóa đánh giá');
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setNewRating(0);
    setNewComment('');
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Đánh giá</h2>

      {/* Form đánh giá cho user đã đăng nhập */}
      {user && (!userReview || editingReview) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">
            {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá sao
            </label>
            <StarRating 
              rating={newRating} 
              onRatingChange={setNewRating} 
              size="lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bình luận (tùy chọn)
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về công thức này..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="4"
              maxLength="500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {newComment.length}/500 ký tự
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={submitting || newRating === 0}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting 
                ? 'Đang gửi...' 
                : editingReview 
                  ? 'Cập nhật đánh giá' 
                  : 'Gửi đánh giá'
              }
            </button>
            {editingReview && (
              <button
                onClick={cancelEdit}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hiển thị đánh giá của user nếu đã có */}
      {user && userReview && !editingReview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Đánh giá của bạn</h4>
              <StarRating rating={userReview.rating} readonly size="sm" />
              {userReview.comment && (
                <p className="text-gray-600 mt-2">{userReview.comment}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(userReview.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditReview(userReview)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteReview(userReview._id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      <div>
        <h3 className="font-semibold mb-4 text-lg text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Đánh giá từ cộng đồng 
          {pagination.totalReviews > 0 && (
            <span className="text-sm text-gray-500">
              ({pagination.totalReviews} đánh giá)
            </span>
          )}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Đang tải đánh giá...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={review.user?.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={`${review.user?.firstName || ""} ${review.user?.lastName || ""}`.trim() || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {`${review.user?.firstName || ""} ${review.user?.lastName || ""}`.trim() || "Người dùng"}
                      </h4>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>                {review.comment && (
                  <p className="text-gray-600 leading-relaxed ml-13">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có đánh giá nào cho công thức này</p>
            {user && !userReview && (
              <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
