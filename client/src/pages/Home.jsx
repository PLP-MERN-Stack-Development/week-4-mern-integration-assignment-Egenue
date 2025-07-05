import PostList from '../components/PostList';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8 animate-fade-in">
        Welcome to MERN Blog
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Explore a world of ideas, stories, and insights from our vibrant community.
      </p>
      <PostList />
    </div>
  );
}

export default Home;