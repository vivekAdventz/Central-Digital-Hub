/**
 * Admin Login Page
 * -----------------
 * Separate login page for admin at /admin/login.
 * Admin enters email + password which are validated against .env values on the backend.
 */

import { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await adminLogin(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (user && user.role === 'admin') return null;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden">
      {/* Left - Hero with Video Background */}
      <div className="md:w-1/2 lg:w-[55%] bg-slate-950 text-white p-6 md:p-12 flex flex-col justify-center relative ">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
        >
          <source src="/background-Central-hub.mp4" type="video/mp4" />
        </video>

        {/* Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg mx-auto md:mx-0 slide-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-lg mb-6">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">Restricted Admin Access</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
            Control<br />
            <span className="text-amber-500">Center.</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-sm font-medium">
            System administration and report management. Authorized administrative credentials required to proceed.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 md:p-8 bg-[#F8FAFC]">
        <div className="max-w-sm w-full fade-in space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Sign-in</h2>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">
              Enter secure credentials
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold animate-shake flex items-center gap-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adventz.com"
                  required
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200"
              >
                {loading ? 'Authenticating...' : 'Authorize Access'}
              </button>
            </form>
          </div>
          
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-loose">
            Power Bi Hub version 1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
