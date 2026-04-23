import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-50/50 font-sans">
      {/* Governance Header & Tabs */}
      <div className="px-8 pt-8 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Governance Manager</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Strategic Hub Administration</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <NavLink
            to="/admin/dashboards"
            className={({ isActive }) =>
              `pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Assets
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Personnel
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </>
            )}
          </NavLink>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
