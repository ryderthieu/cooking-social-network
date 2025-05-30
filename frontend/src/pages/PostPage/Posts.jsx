import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../../components/common/Post';
import SharePopup from '../../components/common/SharePopup';
import { mockPosts } from './mockData';
import { getAllPost } from '@/services/postService';

const Posts = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
  const navigate = useNavigate();

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
  const handleLike = (id) => {
    setPosts(posts => posts.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="max-w-2xl">
      {posts?.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onComment={() => navigate(`/posts/${post.id}`)}
          onShare={() => setSharePopup({ open: true, postId: post.id })}
        />
      ))}

      <SharePopup
        open={sharePopup.open}
        postId={sharePopup.postId}
        onClose={() => setSharePopup({ open: false, postId: null })}
      />
    </div>
  );
};

export default Posts;