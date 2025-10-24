import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function NotFound() {
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">404 — Page not found</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-600 dark:text-blue-400">Go back to Home</a>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Floating background orbs with more variety and glow effects */}
      <div className="absolute floating-orb w-96 h-96 bg-gradient-to-br from-violet-400 to-purple-500 top-0 -left-48 animate-float-slow opacity-20 blur-xl" style={{ animationDelay: '0s' }}></div>
      <div className="absolute floating-orb w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 bottom-0 -right-48 animate-float opacity-20 blur-xl" style={{ animationDelay: '2s' }}></div>
      <div className="absolute floating-orb w-64 h-64 bg-gradient-to-br from-indigo-400 to-blue-500 top-1/2 left-1/2 animate-float-fast opacity-15 blur-lg" style={{ animationDelay: '4s' }}></div>
      <div className="absolute floating-orb w-48 h-48 bg-gradient-to-br from-pink-400 to-rose-500 top-1/4 right-1/4 animate-float opacity-25 blur-lg" style={{ animationDelay: '6s' }}></div>
      <div className="absolute floating-orb w-72 h-72 bg-gradient-to-br from-blue-400 to-cyan-500 bottom-1/4 left-1/4 animate-float-slow opacity-15 blur-xl" style={{ animationDelay: '8s' }}></div>

      {/* Enhanced Particle system with more variety */}
      <div className="absolute inset-0 particles pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute particle rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              background: `linear-gradient(45deg, hsl(${Math.random() * 60 + 240}, 70%, 60%), hsl(${Math.random() * 60 + 240}, 70%, 80%))`,
              animationDelay: `${Math.random() * 30}s`,
              animationDuration: `${Math.random() * 20 + 20}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.3) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      <Navbar />
      <main className="container mx-auto px-6 py-8 relative z-10 pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
