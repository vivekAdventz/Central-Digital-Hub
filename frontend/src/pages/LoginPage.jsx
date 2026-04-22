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
        setLoading(true);
        const response = await instance.handleRedirectPromise();
        if (response && response.account) {
          // Send Microsoft account info to our backend
          const result = await loginWithMicrosoft(response.account);

          if (result.success) {
            navigate('/dashboard');
          } else {
            setError(result.message);
          }
        }
      } catch (err) {
        setError('Microsoft login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [instance, loginWithMicrosoft, navigate]);

  // If already logged in, redirect
  if (user) {
    navigate(user.role === 'admin' ? '/admin/dashboards' : '/dashboard');
    return null;
  }

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
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white">
      {/* Left Hero Section */}
      <div className="md:w-1/2 bg-slate-900 text-white p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="relative z-10 max-w-lg mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Enterprise Intelligence,{' '}
            <span className="text-indigo-400">Secured.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Zuari Industries Analytics Hub. Secure identity-verified environment
            for corporate reports and Power BI dashboards.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full fade-in">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign-in</h2>
            <p className="text-gray-500 text-sm mt-1">
              Use your Microsoft work account to continue.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Microsoft Login Button */}
          <div className="space-y-4">
            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition-all uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  {/* Microsoft icon */}
                  <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  Sign in with Microsoft
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Admin Login Link */}
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full border border-gray-900 text-gray-900 py-3 rounded font-bold hover:bg-gray-900 hover:text-white transition-all uppercase text-sm tracking-wider cursor-pointer"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
