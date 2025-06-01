import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../../components/common/Post';
import SharePopup from '../../components/common/SharePopup';
import postsService, { getAllPost } from '@/services/postService';
import { useSocket } from '@/context/SocketContext';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null, postTitle: null });
  const navigate = useNavigate();
  const { sendNotification } = useSocket();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost();
        console.log(response);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await postsService.toggleLike(id);
      const updatedPost = res.data.post;
      const isLiking = res.data.message === "Đã like bài viết";
      console.log('update', updatedPost);
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === id ? updatedPost : post))
      );

      // Chỉ gửi thông báo khi like, không gửi khi unlike
      if (isLiking && updatedPost.author._id !== res.data.userId) {
        sendNotification({
          receiverId: updatedPost.author._id,
          type: 'like',
          postId: id,
        });
      }
    }
    catch (error) {
      console.log(error.message)
    }
  };

  return (
    <div className="max-w-2xl">
      {posts?.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post._id)}
          onComment={() => navigate(`/posts/${post._id}`)}
          onShare={() => setSharePopup({ open: true, postId: post._id, postTitle: post.content })}
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
};

export default Posts;