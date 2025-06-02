import React, { useState, useEffect } from 'react';
import { PostCard } from '../../common/Post';
import postsService, { deletePost } from '../../../services/postService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

export default function PostsTab({userId}) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response;
        
        if (userId) {
          response = await postsService.fetchPostsByUserId(userId);
        } else if (currentUser?._id) {
          response = await postsService.fetchUserPosts(currentUser._id);
        } else {
          setError('User information is not available');
          return;
        }
        // Extract the posts array from the response
        setPosts(response.data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      }
    };

    fetchPosts();
  }, [userId, currentUser]);

  // Handler functions with API integration
  const handleLike = async (postId) => {
    try {
      await postsService.toggleLike(postId);
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = (postId) => {
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = async (postId) => {
    try {
      await postsService.share(postId);
      // Optionally update UI to reflect the share
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const handleEdit = (postId, editedData) => {
    setPosts(prevPosts =>
      prevPosts.map(post => post._id === postId ? editedData : post)
    );
  };

  const handleDelete = async (postId) => {
    try {
      // Remove the post from the state
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success('Đã xóa bài viết thành công!');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Có lỗi xảy ra khi xóa bài viết');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-3xl text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có bài viết nào</h3>
        <p className="text-gray-600">
          Hãy chia sẻ những món ăn và công thức nấu ăn yêu thích của bạn!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => {
        return (
          <PostCard 
            key={post._id}
            post={post}
            onLike={() => handleLike(post._id)}
            onComment={() => handleComment(post._id)}
            onShare={() => handleShare(post._id)}
            onPostUpdated={(editedData) => handleEdit(post._id, editedData)}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}