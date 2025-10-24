import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiHome, FiCalendar, FiGrid, FiLogOut, FiLogIn, FiUserPlus, FiMoon, FiSun } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleLogout() {
    logout();
    nav('/login');
  }

  useEffect(() => {
    const checkModal = () => {
      const modal = document.querySelector('[class*="fixed inset-0"]');
      setIsModalOpen(!!modal);
    };

    // Check immediately
    checkModal();

    // Set up observer for DOM changes
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in w-full max-w-7xl mx-auto px-6 transition-opacity duration-300 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="glass rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50 backdrop-blur-2xl hover:shadow-3xl transition-all duration-500">
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-xl shadow-violet-500/60 animate-pulse-glow hover-glow">
                <HiSparkles className="w-8 h-8 text-white animate-float" />
              </div>
              <span className="text-3xl font-black hero-text-gradient group-hover:scale-105 transition-all duration-300 tracking-tight">
                Reserve Space
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/" className="nav-link group">
                <FiHome className="w-6 h-6 group-hover:scale-110 transition-all duration-300 icon-hover" />
                <span className="hidden lg:inline font-semibold">Home</span>
              </Link>

              {user && (
                <Link to="/my-bookings" className="nav-link group">
                  <FiCalendar className="w-6 h-6 group-hover:scale-110 transition-all duration-300 icon-hover" />
                  <span className="hidden lg:inline font-semibold">My Bookings</span>
                </Link>
              )}

              {user && user.role === 'admin' && (
                <Link to="/admin" className="nav-link bg-gradient-to-r from-violet-500/20 to-purple-500/20 dark:from-violet-500/30 dark:to-purple-500/30 group border border-violet-200/50 dark:border-violet-700/50">
                  <FiGrid className="w-6 h-6 group-hover:scale-110 transition-all duration-300 icon-hover" />
                  <span className="hidden lg:inline font-semibold">Admin Panel</span>
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-violet-50 dark:hover:bg-violet-900/40 transition-all duration-300 hover:scale-110 focus-ring hover-glow shadow-lg"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FiSun className="w-6 h-6 text-yellow-500 animate-pulse" />
                ) : (
                  <FiMoon className="w-6 h-6 text-violet-600 animate-pulse" />
                )}
              </button>

              {!user ? (
                <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-white/30 dark:border-slate-600/50">
                  <Link to="/login" className="px-6 py-3 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 flex items-center space-x-3 hover:scale-105 hover:shadow-lg font-semibold">
                    <FiLogIn className="w-5 h-5" />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                  <Link to="/register" className="btn-primary flex items-center space-x-3 hover:scale-105 transition-all duration-300 shadow-xl">
                    <FiUserPlus className="w-5 h-5" />
                    <span className="hidden lg:inline">Register</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-6 ml-8 pl-8 border-l border-white/30 dark:border-slate-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-violet-500/40 hover:scale-110 transition-all duration-300 animate-pulse-glow">
                      {(user.name || user.email)?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 hidden lg:block text-lg">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="px-6 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center space-x-3 shadow-xl shadow-red-500/50 hover:scale-105 hover-glow font-semibold">
                    <FiLogOut className="w-5 h-5" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
