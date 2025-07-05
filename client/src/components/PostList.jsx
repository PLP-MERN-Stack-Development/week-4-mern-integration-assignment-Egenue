import { useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

function PostList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data: postsData, loading, error } = useApi(`/posts?page=${page}&search=${search}&category=${category}`);
  const { data: categories } = useApi('/categories');

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {categories?.map(cat => (
            <option key={cat._id} value={cat._id} className="bg-white">
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSearch('') + setCategory('')}
          className="btn btn-secondary w-full sm:w-auto"
        >
          Clear Filters
        </button>
      </div>

      {loading && <div className="text-center text-blue-600 animate-pulse">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsData?.posts?.map(post => (
          <Link
            to={`/post/${post._id}`}
            key={post._id}
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:scale-105"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.category?.name}</p>
              <p className="text-gray-500 text-sm">By {post.author?.username}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700 self-center">{page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= postsData?.totalPages}
          className="btn btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PostList;