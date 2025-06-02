import React, { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import { FaSortAmountDown } from 'react-icons/fa';
import { getCommentsByTarget, createComment } from '@/services/commentService';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';

const CommentList = ({ post, reel }) => { 
  const [sortBy, setSortBy] = useState('newest');
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { sendNotification } = useSocket();
  
  const targetId = post ? post._id : reel ? reel._id : '';
  const targetType = post ? 'post' : reel ? 'video' : '';
  const totalComments = post ? post.comments?.length : reel ? reel.comments?.length : 0;

  const fetchComments = async (currentPage = 1) => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const res = await getCommentsByTarget({ 
        targetId, 
        targetType, 
        page: currentPage, 
        limit: 5 
      });
      setHasNextPage(res.data.data.pagination.hasNextPage);
      const newComments = res.data.data.comments || [];
      
      if (currentPage === 1) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }
      
    } catch (error) {
      toast.error('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      setPage(1);
      setComments([]);
      fetchComments(1);
    }
  }, [targetId, targetType]);

  useEffect(() => {
    if (page > 1) {
      fetchComments(page);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const handleReply = async (parentId, text) => {
    try {
      const response = await createComment({
        targetId,
        targetType,
        text,
        replyOf: parentId
      });

      if (response.data.success) {
        // Tìm comment gốc và thêm reply vào
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment._id === parentId) {
              // Nếu là reply cho comment cấp 1, thêm thông tin người được reply
              const replyData = {
                ...response.data.data,
                replyToUser: comment.userId
              };
              return {
                ...comment,
                replies: [...(comment.replies || []), replyData]
              };
            }
            // Nếu là reply cho comment cấp 2, tìm trong replies
            if (comment.replies) {
              const replyParent = comment.replies.find(r => r._id === parentId);
              if (replyParent) {
                const replyData = {
                  ...response.data.data,
                  replyToUser: replyParent.userId
                };
                return {
                  ...comment,
                  replies: [...comment.replies, replyData]
                };
              }
            }
            return comment;
          });
        });

        // Gửi thông báo
        const parentComment = comments.find(c => {
          if (c._id === parentId) return true;
          return c.replies?.some(r => r._id === parentId);
        });
        
        if (parentComment && parentComment.userId._id !== response.data.data.userId._id) {
          sendNotification({
            type: 'reply_comment',
            receiverId: parentComment.userId._id,
            postId: targetType === 'post' ? targetId : undefined,
            videoId: targetType === 'video' ? targetId : undefined,
            commentId: response.data.data._id
          });
        }

        toast.success('Đã thêm phản hồi');
      }
    } catch (error) {
      toast.error('Không thể thêm phản hồi');
    }
  };

  const handleDelete = (commentId) => {
    setComments(prevComments => {
      return prevComments.filter(comment => {
        // Nếu là comment gốc
        if (comment._id === commentId) {
          return false;
        }
        // Nếu là reply, lọc ra khỏi replies
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply._id !== commentId);
        }
        return true;
      });
    });
  };

  const handleUpdate = (updatedComment) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        // Nếu là comment gốc
        if (comment._id === updatedComment._id) {
          return { ...comment, ...updatedComment };
        }
        // Nếu là reply
        if (comment.replies) {
          comment.replies = comment.replies.map(reply =>
            reply._id === updatedComment._id ? { ...reply, ...updatedComment } : reply
          );
        }
        return comment;
      });
    });
  };

  const handleLike = async (commentId) => {
    try {
      const response = await likeComment({ commentId });
      if (response.data.success) {
        setComments(prevComments => {
          return prevComments.map(comment => {
            // Nếu là comment gốc
            if (comment._id === commentId) {
              return response.data.data;
            }
            // Nếu là reply
            if (comment.replies) {
              comment.replies = comment.replies.map(reply =>
                reply._id === commentId ? response.data.data : reply
              );
            }
            return comment;
          });
        });

        // Gửi thông báo nếu là like (không phải unlike)
        const likedComment = response.data.data;
        if (likedComment.likes.includes(user._id) && likedComment.userId._id !== user._id) {
          sendNotification({
            type: 'like_comment',
            receiverId: likedComment.userId._id,
            postId: targetType === 'post' ? targetId : undefined,
            videoId: targetType === 'video' ? targetId : undefined,
            commentId: likedComment._id
          });
        }
      }
    } catch (error) {
      toast.error('Không thể thực hiện thao tác');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with sort options */}
      <div className="px-6 py-4 border-b border-[#FFB800]/10 sticky top-0 bg-white/80 backdrop-blur-sm z-5">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 font-semibold">
            {totalComments} bình luận
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6] transition-all duration-300">
              <FaSortAmountDown className="w-4 h-4" />
              <span className="text-sm font-medium">Sắp xếp theo</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-[#FFB800]/10 py-1 hidden group-hover:block animate-popup">
              <button
                onClick={() => setSortBy('newest')}
                className={`w-full px-4 py-2 text-left hover:bg-[#FFF4D6] transition-colors text-sm ${
                  sortBy === 'newest' ? 'text-[#FFB800]' : 'text-gray-700'
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => setSortBy('oldest')}
                className={`w-full px-4 py-2 text-left hover:bg-[#FFF4D6] transition-colors text-sm ${
                  sortBy === 'oldest' ? 'text-[#FFB800]' : 'text-gray-700'
                }`}
              >
                Cũ nhất
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`w-full px-4 py-2 text-left hover:bg-[#FFF4D6] transition-colors text-sm ${
                  sortBy === 'popular' ? 'text-[#FFB800]' : 'text-gray-700'
                }`}
              >
                Phổ biến nhất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-6 py-4 space-y-6">
        {comments?.map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onLike={handleLike}
          />
        ))}
        
        {/* Load More Button */}
        {hasNextPage && (
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className='hover:cursor-pointer text-[#FFB800] hover:text-[#FF9500] py-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Đang tải...' : 'Xem thêm bình luận'}
          </button>
        )}
        
        {/* Loading indicator */}
        {loading && comments.length === 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800]"></div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {comments.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💭</span>
          </div>
          <p className="text-sm">Chưa có bình luận nào</p>
        </div>
      )}
    </div>
  );
};

export default CommentList;