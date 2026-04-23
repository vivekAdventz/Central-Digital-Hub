import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardManagement from '../pages/admin/DashboardManagement';
import UserManagement from '../pages/admin/UserManagement';

const GovernanceModal = ({ onRefreshDashboards }) => {
  const { isAdminModalOpen, setIsAdminModalOpen } = useAuth();
  const [adminTab, setAdminTab] = useState('dashboards');

  if (!isAdminModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={() => setIsAdminModalOpen(false)}
      ></div>
      
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-xl shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-8 pt-8 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Governance Manager</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Strategic Hub Administration</p>
            </div>
            <button 
              onClick={() => setIsAdminModalOpen(false)} 
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Tabs */}
          <div className="flex gap-6">
            <button 
              onClick={() => setAdminTab('dashboards')} 
              className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                adminTab === 'dashboards' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Assets
              {adminTab === 'dashboards' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
            </button>
            <button 
              onClick={() => setAdminTab('users')} 
              className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                adminTab === 'users' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Personnel
              {adminTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {adminTab === 'dashboards' ? <DashboardManagement refreshDashboards={onRefreshDashboards} /> : <UserManagement />}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
          <button 
            onClick={() => setIsAdminModalOpen(false)} 
            className="px-6 py-2 bg-gray-900 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all"
          >
            Close Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernanceModal;
