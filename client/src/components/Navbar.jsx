import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-300 hover:text-yellow-400">
          MERN Blog
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-yellow-300 transition-colors">Home</Link>
          {user && <Link to="/create" className="hover:text-yellow-300 transition-colors">Create Post</Link>}
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-yellow-300 transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;