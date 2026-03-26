import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { toggleTheme, getTheme } from '@utils/theme';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState(getTheme());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Menu size={24} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">NA</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
                Nagrik AI
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Logout Button */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}

            {/* Login Link */}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

