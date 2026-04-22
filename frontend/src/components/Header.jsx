/**
 * Header Component
 * -----------------
 * Top ribbon with Zuari and Adventz logos, user profile, and logout button.
 * Matches the reference HTML design exactly.
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Simple logout: clear state and storage
    logout();
    
    // Hard refresh to root to ensure clean state
    window.location.href = '/';
  };

  return (
    <header className="h-[64px] bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-[100] transition-all">
      {/* Left: Zuari Logo */}
      <div className="flex items-center">
        <img
          src="https://www.zuariindustries.in/assets/web/img/logo/zuari_logo.png"
          alt="Zuari Logo"
          className="h-7 md:h-9 w-auto object-contain"
        />
      </div>

      {/* Center Group */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="h-4 w-px bg-slate-200"></div>
        <span className="text-[20px] font-black text-slate-800 uppercase tracking-tighter">
          Intelligence <span className="text-indigo-600">Hub</span>
        </span>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden xs:flex flex-col text-right">
            <span className="text-[10px] font-black text-slate-900 leading-none capitalize">
              {user.name.split(' ')[0]}
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Authorized
            </span>
          </div>
        )}

        <img
          src="https://www.zuariindustries.in/assets/web/img/logo/adventz.png"
          alt="Adventz Logo"
          className="h-7 md:h-9 w-auto object-contain "
        />

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Logout"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
