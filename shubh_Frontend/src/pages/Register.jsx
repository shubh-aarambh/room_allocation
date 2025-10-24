import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Account created! Please login.');
      nav('/login');
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center animate-fade-in perspective-1000 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-2xl animate-float-fast"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-slide-down">
          <div className="inline-flex p-6 bg-gradient-to-br from-green-600 via-teal-600 to-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-green-500/60 animate-pulse-glow hover-glow">
            <HiSparkles className="w-14 h-14 text-white animate-float" />
          </div>
          <h2 className="text-5xl font-black hero-text-gradient mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Join us and start booking resources</p>
        </div>

        <div className="glass rounded-3xl p-10 shadow-3xl animate-slide-up card-3d border border-white/20 dark:border-slate-700/50 hover:shadow-violet-500/20 transition-all duration-500">
          <form onSubmit={submit} className="space-y-6">
            <div className="relative group">
              <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-6 h-6 transition-all duration-300 group-focus-within:text-green-500 group-focus-within:scale-110" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Full name"
                className="input-modern pl-14 focus-ring"
              />
            </div>

            <div className="relative group">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-6 h-6 transition-all duration-300 group-focus-within:text-green-500 group-focus-within:scale-110" />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="input-modern pl-14 focus-ring"
              />
            </div>

            <div className="relative group">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-6 h-6 transition-all duration-300 group-focus-within:text-green-500 group-focus-within:scale-110" />
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="input-modern pl-14 focus-ring"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group hover-glow"
            >
              <span className="relative z-10 text-lg font-bold">{loading ? 'Creating account...' : 'Create Account'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-teal-400/30 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all duration-300 hover:scale-105 inline-block">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
