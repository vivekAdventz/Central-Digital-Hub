import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex bg-gray-50 overflow-hidden">
      {/* Sidebar - 1/5 width */}
      <div className="w-1/5 min-w-[250px] max-w-[300px] bg-slate-900 border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Admin Console</h2>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">System Configuration</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/dashboards"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded text-sm font-bold tracking-wide transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard Hub
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded text-sm font-bold tracking-wide transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Access
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Platform v1.0</span>
        </div>
      </div>

      {/* Main Content Area - 4/5 width */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-gray-50 flex flex-col">
        {/* Render active admin tab content here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
