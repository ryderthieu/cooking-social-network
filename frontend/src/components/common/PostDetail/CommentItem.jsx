import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaReply, FaEllipsisH, FaPen, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { updateComment, deleteComment } from '@/services/commentService';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { register } from 'timeago.js';
import CommentForm from './CommentForm';
register('vi', vi);

const CommentItem = ({ comment, onReply, onDelete, onUpdate, onLike, level = 0 }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showOptions, setShowOptions] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleEdit = async () => {
    if (!editText.trim()) {
      toast.error('Nội dung bình luận không được để trống');
      return;
    }
    try {
      const response = await updateComment({
        commentId: comment._id,
        text: editText,
        sticker: comment.sticker
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        setIsEditing(false);
        toast.success('Đã cập nhật bình luận');
      }
    } catch (error) {
      toast.error('Không thể cập nhật bình luận');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteComment({ commentId: comment._id });
      if (response.data.success) {
        onDelete(comment._id);
        toast.success('Đã xóa bình luận');
      }
    } catch (error) {
      toast.error('Không thể xóa bình luận');
    }
  };

  const handleReply = (text) => {
    onReply(comment._id, text);
    setIsReplying(false);
  };

  const handleLike = () => {
    onLike(comment._id);
  };

  const isLiked = comment.likes?.includes(user?._id);
  const isOwner = comment.userId?._id === user?._id;

  return (
    <div className="flex gap-3">
      <img
        src={comment.userId?.avatar || '/images/default-avatar.png'}
        alt={comment.userId?.firstName}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className={`bg-gray-100 rounded-2xl px-4 py-2 `}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">
                {comment.userId?.firstName} {comment.userId?.lastName}
              </h4>
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <div className="relative">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-colors resize-none"
                      rows="3"
                      placeholder="Chỉnh sửa bình luận..."
                      autoFocus
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {editText.length}/500
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditText(comment.text);
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1.5 text-sm bg-[#FFB800] text-white rounded-lg hover:bg-[#FF9500] transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm mt-1">
                  {level === 2 && comment.replyToUser && (
                    <span className="text-[#FFB800] font-medium">
                      @{comment.replyToUser.firstName} {comment.replyToUser.lastName}{' '}
                    </span>
                  )}
                  {comment.text}
                </div>
              )}
            </div>
            {isOwner && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaEllipsisH className="w-4 h-4 text-gray-500" />
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-10 animate-popup">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors"
                    >
                      <FaPen className="w-3 h-3 text-gray-500" />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-sm flex items-center gap-2 text-red-500 transition-colors"
                    >
                      <FaTrash className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-1 ml-4">
          <button
            onClick={handleLike}
            className="text-sm text-gray-500 hover:text-[#FFB800] flex items-center gap-1 transition-colors"
          >
            {isLiked ? (
              <FaHeart className="w-3 h-3 text-[#FFB800]" />
            ) : (
              <FaRegHeart className="w-3 h-3" />
            )}
            {comment.likes?.length || 0}
          </button>
          {level < 2 && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-sm text-gray-500 hover:text-[#FFB800] flex items-center gap-1 transition-colors"
            >
              <FaReply className="w-3 h-3" />
              Trả lời
            </button>
          )}
          <span className="text-xs text-gray-400">
            {format(comment.createdAt, 'vi')}
          </span>
        </div>

        {isReplying && (
          <div className="mt-2 ml-4">
            <CommentForm onSubmit={handleReply} isReply />
          </div>
        )}

        {/* Hiển thị replies - chỉ cho level < 2 */}
        {level < 2 && comment.replies?.length > 0 && (
          <div className="mt-3 ml-4 space-y-3">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply._id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onLike={onLike}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem; 