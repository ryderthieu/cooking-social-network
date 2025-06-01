import React, { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import { FaSortAmountDown } from 'react-icons/fa';
import { getCommentsByTarget } from '@/services/commentService';

const CommentList = ({ post, reel, key }) => { 
  const [sortBy, setSortBy] = useState('newest');
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true)
  const targetId = post ? post._id : reel ? reel._id : '';
  const targetType = post ? 'post' : reel ? 'video' : '';
  const totalComments = post ? post.comments?.length : reel ? reel.comments?.length : 0;

  useEffect(() => {
    console.log('update comment')
  }, [])
  const fetchComments = async (currentPage = 1) => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('Fetching comments for page:', currentPage);
      
      const res = await getCommentsByTarget({ 
        targetId, 
        targetType, 
        page: currentPage, 
        limit: 5 
      });
      setHasNextPage(res.data.data.pagination.hasNextPage)
      const newComments = res.data.data.comments || [];
      console.log('Fetched comments:', newComments.length);
      
      if (currentPage === 1) {
        setComments(newComments);
      } else {
        setComments(prev => {
          console.log('Previous comments:', prev.length);
          const updated = [...prev, ...newComments];
          console.log('Updated comments:', updated.length);
          return updated;
        });
      }
      
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load comments when component mounts or targetId changes
  useEffect(() => {
    if (targetId) {
      console.log('Initial load for targetId:', targetId);
      setPage(1);
      setComments([]);
      fetchComments(1);
    }
  }, [targetId, targetType]);

  // Load more comments when page changes (but not on initial page 1)
  useEffect(() => {
    if (page > 1) {
      console.log('Loading page:', page);
      fetchComments(page);
    }
    console.log(page, comments)
  }, [page]);

  const handleLoadMore = () => {
    console.log('Load more clicked, current page:', page);
    console.log('Current comments length:', comments.length);
    console.log('Total comments:', totalComments);
    
    if (!loading && comments.length < totalComments) {
      setPage(prev => {
        const newPage = prev + 1;
        console.log('Setting new page:', newPage);
        return newPage;
      });
    }
  };

  console.log('Render - Comments length:', comments.length, 'Total:', totalComments, 'Loading:', loading);

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
          <CommentItem key={comment._id} comment={comment} />
        ))}
        
        {/* Load More Button - giống code gốc */}
        {hasNextPage && (
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className='hover:cursor-pointer text-[#FFB800] hover:text-[#FF9500] py-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Đang tải...' : `Xem thêm bình luận`}
          </button>
        )}
        
        {/* Loading indicator cho lần đầu load */}
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