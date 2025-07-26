import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

function DashboardNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show only on dashboard-related pages
  if (!["/dashboard", "/overview", "/profile"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="fixed w-full bg-[#D9D9D9]/50 backdrop-blur-md py-4 md:py-5 top-0 z-20">
        <div className="w-full md:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="text-[#3F48CC] text-xl font-bold no-underline transition-all duration-200 active:opacity-80"
          >
            Daily Wellbeing Tracker
          </Link>
          <div className="hidden md:block text-black/80 text-base sm:text-lg font-medium">
            {user ? `Welcome, ${user.name}` : ""}
          </div>
          <button
            className="md:hidden text-black/80 text-xl focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="hidden md:flex space-x-6">
            <Link
              to="/dashboard"
              className={`${
                isActive("/dashboard") ? "text-[#915941]" : "text-[#000000]/80"
              } text-lg font-medium no-underline hover:underline transition-all duration-200 ${
                isActive("/dashboard") ? "" : "active:opacity-80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/overview"
              className={`${
                isActive("/overview") ? "text-[#915941]" : "text-[#000000]/80"
              } text-lg font-medium no-underline hover:underline transition-all duration-200 ${
                isActive("/overview") ? "" : "active:opacity-80"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/profile"
              className={`${
                isActive("/profile") ? "text-[#915941]" : "text-[#000000]/80"
              } text-lg font-medium no-underline hover:underline transition-all duration-200 ${
                isActive("/profile") ? "" : "active:opacity-80"
              }`}
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-[#000000]/80 text-lg font-medium no-underline hover:underline transition-all duration-200 active:opacity-80"
            >
              Log Out
            </button>
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
              <span className="text-[#3F48CC] text-lg font-bold">
                {user ? `Welcome, ${user.name}` : "Menu"}
              </span>
              <button
                className="text-black/80 text-4xl"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="flex flex-col space-y-4 px-6 py-4">
              <Link
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`${
                  isActive("/dashboard")
                    ? "text-[#915941]"
                    : "text-[#000000]/80"
                } text-lg font-medium no-underline hover:underline transition-all duration-200`}
              >
                Dashboard
              </Link>
              <Link
                to="/overview"
                onClick={() => setSidebarOpen(false)}
                className={`${
                  isActive("/overview") ? "text-[#915941]" : "text-[#000000]/80"
                } text-lg font-medium no-underline hover:underline transition-all duration-200`}
              >
                Overview
              </Link>
              <Link
                to="/profile"
                onClick={() => setSidebarOpen(false)}
                className={`${
                  isActive("/profile") ? "text-[#915941]" : "text-[#000000]/80"
                } text-lg font-medium no-underline hover:underline transition-all duration-200`}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="text-[#000000]/80 text-lg font-medium no-underline hover:underline transition-all duration-200 text-left"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardNavbar;
