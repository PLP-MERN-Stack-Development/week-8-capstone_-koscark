import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide navbar on dashboard-related pages
  if (['/dashboard', '/overview', '/profile'].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="fixed w-full bg-[#D9D9D9]/50 backdrop-blur-md py-4 md:py-5 top-0 z-20">
        <div className="w-full md:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <Link
            to="/"
            className="text-[#3F48CC] text-xl font-bold no-underline transition-all duration-200 active:opacity-80"
          >
            Daily Wellbeing Tracker
          </Link>
          <button
            className="md:hidden text-black/80 text-xl focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="hidden md:flex space-x-6">
            {user ? (
              <button
                onClick={logout}
                className="text-[#000000]/80 text-lg font-medium no-underline hover:underline transition-all duration-200 active:opacity-80"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className={`${
                    isActive('/signup') ? 'text-[#915941]' : 'text-[#000000]/80'
                  } text-lg font-medium no-underline hover:underline transition-all duration-200 ${
                    isActive('/signup') ? '' : 'active:opacity-80'
                  }`}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className={`${
                    isActive('/login') ? 'text-[#915941]' : 'text-[#000000]/80'
                  } text-lg font-medium no-underline hover:underline transition-all duration-200 ${
                    isActive('/login') ? '' : 'active:opacity-80'
                  }`}
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 flex"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-1/3 h-full backdrop-blur-sm bg-black/10" />
          <div
            className="w-2/3 h-full bg-[#F1EFE1] shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-14 px-6 border-b border-gray-300">
              <span className="text-[#3F48CC] text-lg font-bold">Menu</span>
              <button
                className="text-black/80 text-4xl"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="flex flex-col space-y-4 px-6 py-4">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="text-[#000000]/80 text-lg font-medium no-underline hover:underline transition-all duration-200 text-left"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setSidebarOpen(false)}
                    className={`${
                      isActive('/signup') ? 'text-[#915941]' : 'text-[#000000]/80'
                    } text-lg font-medium no-underline hover:underline transition-all duration-200`}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className={`${
                      isActive('/login') ? 'text-[#915941]' : 'text-[#000000]/80'
                    } text-lg font-medium no-underline hover:underline transition-all duration-200`}
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;