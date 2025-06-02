import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../../components/common/Post';
import SharePopup from '../../components/common/SharePopup';
import postsService, { getAllPosts, editPost, deletePost } from '@/services/postService';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { deleteSavedPost, savePost } from '@/services/userService';
import { useCloudinary } from '@/context/CloudinaryContext';
import { toast } from 'react-toastify';

const Posts = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null, postTitle: null });
  const navigate = useNavigate();
  const { sendNotification } = useSocket();
  const { user } = useAuth();
  const { uploadImage } = useCloudinary();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        console.log(response);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Expose handleNewPost method to parent component
  useImperativeHandle(ref, () => ({
    handleNewPost: (newPost) => {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
  }));

  const handleLike = async (id) => {
    try {
      const res = await postsService.toggleLike(id);
      const updatedPost = res.data.post;
      const isLiking = res.data.message === "Đã like bài viết";
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === id ? updatedPost : post))
      );

      // Gửi thông báo khi like bài viết
      if (isLiking) {
        const post = posts.find(p => p._id === id);
        if (post && post.author._id !== user._id) {
          sendNotification({
            receiverId: post.author._id,
            type: 'like',
            postId: id,
          });
        }
      }
    }
    catch (error) {
      console.log(error.message);
    }
  };

  const handleBookmark = async (id) => {
    try {
      if (user.savedPost.includes(id)) {
        await deleteSavedPost({ postId: id });
      }
      else {
        await savePost({ postId: id });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (postId, editedData) => {
    try {
      // Cập nhật state posts với dữ liệu mới
      setPosts(prevPosts =>
        prevPosts.map(post => post._id === postId ? editedData : post)
      );
      
      toast.success('Đã cập nhật bài viết thành công!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    }
  };

  const handleDelete = (postId) => {
    try {
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success('Đã xóa bài viết thành công!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài viết');
    }
  };

  return (
    <div className="max-w-2xl">
      {posts?.map(post => (
        <PostCard
          key={post._id}
          post={post}
          onLike={() => handleLike(post._id)}
          onComment={() => navigate(`/posts/${post._id}`)}
          onShare={() => setSharePopup({ open: true, postId: post._id, postTitle: post.content })}
          onBookmark={() => handleBookmark(post._id)}
          onPostUpdated={(editedData) => handleEdit(post._id, editedData)}
          onDelete={() => handleDelete(post._id)}
        />
      ))}

      <SharePopup
        open={sharePopup.open}
        postId={sharePopup.postId}
        postTitle={sharePopup.postTitle}
        onClose={() => setSharePopup({ open: false, postId: null, postTitle: null })}
      />
    </div>
  );
});

export default Posts;