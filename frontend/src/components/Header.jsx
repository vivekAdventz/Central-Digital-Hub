/**
 * Header Component
 * -----------------
 * Top ribbon with Zuari and Adventz logos, user profile, and logout button.
 * Matches the reference HTML design exactly.
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, isAdmin, logout, setIsAdminModalOpen } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-[100] shadow-sm sticky top-0 transition-all">
      <div className="flex items-center gap-4">
        <img
          src="https://www.zuariindustries.in/assets/web/img/logo/zuari_logo.png"
          alt="Zuari Logo"
          className="h-10 md:h-12 w-auto object-contain cursor-pointer"
          onClick={() => navigate('/')}
        />
        {user && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-6 w-px bg-gray-200"></div>
            <span className="font-bold text-gray-800 uppercase tracking-tight text-xs md:text-sm">
              Enterprise <span className="text-indigo-600">Analytics Hub</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {user && isAdmin && (
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="px-3 md:px-4 py-2 border-2 border-gray-900 text-gray-900 rounded text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
          >
            Manage Hub
          </button>
        )}

        {user && (
          <>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-gray-900 leading-none">{user.name}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{user.role}</span>
            </div>
            <img src="https://www.zuariindustries.in/assets/web/img/logo/adventz.png" alt="Adventz Logo" className="h-8 md:h-10 w-auto object-contain" />
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 transition-all rounded-full hover:bg-red-50">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </>
        )}
        {!user && (
          <img src="https://www.zuariindustries.in/assets/web/img/logo/adventz.png" alt="Adventz Logo" className="h-10 w-auto object-contain" />
        )}
      </div>
    </header>
  );
};

export default Header;
