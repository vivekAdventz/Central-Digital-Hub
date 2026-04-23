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
        if (err.errorCode === 'uninitialized_public_client_application') return;
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
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleMicrosoftLogin = () => {
    setLoading(true);
    setError('');
    instance.loginRedirect(loginRequest).catch((err) => {
      setLoading(false);
      setError('Failed to initiate login redirect.');
    });
  };

  if (user) return null;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white overflow-hidden font-sans">
      {/* LEFT HERO */}
      <div className="md:w-1/2 bg-slate-900 text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
        >
          <source src="/background-Central-hub.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="relative z-10 max-w-lg">
          <div className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 rounded">Identity Verified Gateway</div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Enterprise Intelligence, <span className="text-indigo-400">Secured.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            Zuari Industries Analytics Hub. A strictly governed environment for real-time corporate reporting and strategic decision support.
          </p>
        </div>
      </div>

      {/* RIGHT SIGNIN */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Sign-in</h2>
            <p className="text-gray-500 text-sm">Use your enterprise credentials to access the data hub.</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded font-bold hover:bg-indigo-700 transition-all uppercase text-xs tracking-[0.2em] shadow-lg shadow-indigo-200 flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? (
                <span>Authorizing...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  Authorized User Access
                </>
              )}
            </button>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                Power Bi Hub version 1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
