import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Minimalist narrow width */}
      <div className="w-full md:w-[240px] lg:w-[260px] bg-slate-950 border-b md:border-b-0 md:border-r border-slate-900 flex flex-col h-auto md:h-full z-10 shadow-xl transition-all">
        <div className="p-5 border-b border-slate-900">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Management</h2>
        </div>

        <nav className="flex md:flex-col p-3 md:p-4 gap-2 md:gap-2.5 overflow-x-auto md:overflow-visible">
          <NavLink
            to="/admin/dashboards"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-3 rounded-xl text-[11px] font-bold tracking-wide transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-500 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Reports Hub
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-3 rounded-xl text-[11px] font-bold tracking-wide transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-500 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Access
          </NavLink>
        </nav>

        <div className="hidden md:block mt-auto p-5 border-t border-slate-900 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">
          Terminal v2.4
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-[#F8FAFC]">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
