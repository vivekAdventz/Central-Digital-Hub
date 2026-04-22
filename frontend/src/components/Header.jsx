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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-[100]">
      {/* Left: Zuari Logo */}
      <div className="flex items-center">
        <img
          src="https://www.zuariindustries.in/assets/web/img/logo/zuari_logo.png"
          alt="Zuari Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Center: Hub indicator */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-gray-200"></div>
          <span className="font-bold text-gray-800 uppercase tracking-tight text-sm">
            Enterprise <span className="text-indigo-600">Analytics Hub</span>
          </span>
        </div>
      )}

      {/* Right: User profile + Adventz logo + Logout */}
      <div className="flex items-center gap-4">
        {/* Admin badge */}
        {isAdmin && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded">
            Admin
          </span>
        )}

        {/* User profile info */}
        {user && (
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-gray-900 leading-none">
              {user.name}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              {isAdmin ? 'Root Access' : 'Authorized Access'}
            </span>
          </div>
        )}

        {/* Adventz Logo */}
        <img
          src="https://www.zuariindustries.in/assets/web/img/logo/adventz.png"
          alt="Adventz Logo"
          className="h-[42px] w-auto object-contain"
        />

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 transition-all cursor-pointer"
            title="Logout"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
