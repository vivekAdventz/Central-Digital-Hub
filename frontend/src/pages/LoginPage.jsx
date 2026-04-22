/**
 * Login Page
 * -----------
 * Split layout matching the reference HTML:
 * - Left half: Dark hero with "Enterprise Intelligence, Secured." heading
 * - Right half: Microsoft login button for users + link to admin login
 *
 * Users authenticate via Microsoft (MSAL popup).
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../config/msalConfig';

const LoginPage = () => {
  const { instance } = useMsal();
  const { loginWithMicrosoft, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle redirect response from Microsoft login
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Safe check: handleRedirectPromise() should only be called if PCA is ready
        // In MSAL-React, the provider handles most of this, but we'll add a catch-all
        const response = await instance.handleRedirectPromise();
        
        if (response && response.account) {
          setLoading(true);
          const result = await loginWithMicrosoft(response.account);

          if (result.success) {
            navigate('/dashboard');
          } else {
            setError(result.message);
          }
          setLoading(false);
        }
      } catch (err) {
        // If it's the uninitialized error, we just ignore it for now as it will retry on next render or once ready
        if (err.errorCode === 'uninitialized_public_client_application') {
          return;
        }
        
        const isRealError = err.errorCode || err.message?.includes('interaction');
        if (isRealError && !err.message?.includes('user_cancelled')) {
           setError('Microsoft authentication failed. Please try again.');
        }
      }
    };

    handleRedirect();
  }, [instance, loginWithMicrosoft, navigate]);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboards' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  /**
   * Handle Microsoft login via MSAL redirect
   */
  const handleMicrosoftLogin = () => {
    setLoading(true);
    setError('');

    // Redirect to Microsoft login page
    instance.loginRedirect(loginRequest).catch((err) => {
      setLoading(false);
      setError('Failed to initiate login redirect.');
    });
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg mb-6">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Enterprise Secure</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
            Intelligence,<br />
            <span className="text-indigo-500">Delivered.</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-sm font-medium">
            Strategic analytics and confidential Power BI intelligence for Zuari Industries. Verified corporate access only.
          </p>
        </div>
      </div>

      {/* Right - Minimalist Login */}
      <div className="md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 md:p-8 bg-[#F8FAFC]">
        <div className="max-w-sm w-full fade-in space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Portal Access</h2>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">
              Identity Verification Required
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold animate-shake flex items-center gap-2">
                {error}
              </div>
            )}

            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              <span className="uppercase text-[10px] tracking-widest">Microsoft Login</span>
            </button>
          </div>
          
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-loose">
            © 2026 Zuari Digital • v2.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
