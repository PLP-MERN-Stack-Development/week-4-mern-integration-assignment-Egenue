import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import CommentSection from './CommentSection';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, error, refetch } = useApi(`/posts/${id}`);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (post) {
      setLikes(post.likes || 0);
      setLiked(false); // Reset liked state (implement user-specific logic if needed)
    }
  }, [post]);

  const handleLike = async () => {
    if (!liked) {
      try {
        await fetch(`/posts/${id}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' } // Add auth if needed
        });
        setLikes(likes + 1);
        setLiked(true);
        refetch(); // Update post data
      } catch (err) {
        console.error('Like failed:', err);
      }
    }
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!post) return <div className="text-center text-4a5568">Loading...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-2b6cb0 hover:text-6b46c1"
      >
        ← Back
      </button>
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-4" />
      )}
      <h1 className="text-3xl font-bold text-2b6cb0 mb-2">{post.title}</h1>
      <p className="text-4a5568 mb-2">Category: {post.category?.name}</p>
      <p className="text-4a5568 mb-4">By {post.author?.username}</p>
      <div className="prose text-4a5568 mb-6">{post.content}</div>
      <button
        onClick={handleLike}
        disabled={liked}
        className={`btn ${liked ? 'btn-secondary' : 'btn-danger'} mb-4`}
      >
        Like {likes} {liked ? '(Liked)' : ''}
      </button>
      <CommentSection postId={id} />
    </div>
  );
}

export default PostDetail;