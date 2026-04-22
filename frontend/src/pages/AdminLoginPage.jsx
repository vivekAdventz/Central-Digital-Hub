/**
 * Admin Login Page
 * -----------------
 * Separate login page for admin at /admin/login.
 * Admin enters email + password which are validated against .env values on the backend.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const { adminLogin, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin, redirect
  if (user && user.role === 'admin') {
    navigate('/admin/dashboards');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await adminLogin(email, password);

    if (result.success) {
      navigate('/admin/dashboards');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white">
      {/* Left Hero Section */}
      <div className="md:w-1/2 bg-slate-900 text-white p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="relative z-10 max-w-lg mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Admin <span className="text-indigo-400">Console</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Manage dashboards, users, and hub configurations. Restricted access for administrators only.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full fade-in">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Sign-in</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your administrator credentials.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zuari.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-black transition-all uppercase text-sm tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Admin Login'}
            </button>
          </form>

          {/* Back to user login */}
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm text-indigo-600 hover:underline font-medium cursor-pointer"
          >
            ← Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
