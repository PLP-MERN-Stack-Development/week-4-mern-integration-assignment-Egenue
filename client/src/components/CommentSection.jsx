import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import useApi from '../hooks/useApi';

function CommentSection({ postId, comments }) {
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);
  const { refetch } = useApi(`/posts/${postId}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ content })
      });
      setContent('');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Comments</h3>
      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>
        </form>
      )}
      <div className="space-y-4">
        {comments?.map(comment => (
          <div key={comment._id} className="border p-4 rounded">
            <p>{comment.content}</p>
            <p className="text-gray-500 text-sm">
              By {comment.author?.username} on {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;