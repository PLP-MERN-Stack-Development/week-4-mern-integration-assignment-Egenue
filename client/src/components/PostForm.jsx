import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext.jsx';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { data: post } = useApi(id ? `/posts/${id}` : null);
  const { data: categories } = useApi('/categories');
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category?._id || '',
    image: post?.image || ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category?._id || '',
        image: post.image || ''
      });
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to create a post');
      return;
    }
    setLoading(true);
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/posts/${id}` : '/posts';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      };
      const response = await fetch(`/api${url}`, {
        method,
        headers,
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData
      });
      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    }
  };

  if (!user) {
    return <div className="text-center text-4a5568 p-4">Please log in to create or edit a post.</div>;
  }

  return (
    <div className="fixed inset-0 bg-4a5568 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-2b6cb0">
            {id ? 'Edit Post' : 'Create Post'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-2b6cb0 hover:text-6b46c1 text-xl font-bold"
          >
            X
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-4a5568 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-2b6cb0"
              required
            />
          </div>
          <div>
            <label className="block text-4a5568 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-2b6cb0"
            >
              <option value="">Select Category</option>
              {categories?.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-4a5568 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
            )}
          </div>
          <div>
            <label className="block text-4a5568 mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-2b6cb0 h-32"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostForm;