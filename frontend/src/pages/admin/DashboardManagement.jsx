import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';

const DashboardManagement = () => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingDash, setEditingDash] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    powerBiIframe: '',
    description: '',
    shareable: true,
    isActive: true
  });

  const fetchDashboards = async () => {
    setLoading(true);
    try {
      const response = await API.get('/dashboards');
      setDashboards(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboards. Permissions error or server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleOpenModal = (dash = null) => {
    if (dash) {
      setEditingDash(dash);
      setFormData({
        title: dash.title,
        category: dash.category,
        powerBiIframe: dash.powerBiIframe,
        description: dash.description || '',
        shareable: dash.shareable,
        isActive: dash.isActive !== undefined ? dash.isActive : true
      });
    } else {
      setEditingDash(null);
      setFormData({
        title: '',
        category: '',
        powerBiIframe: '',
        description: '',
        shareable: true,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDash(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDash) {
        await API.put(`/dashboards/${editingDash._id}`, formData);
      } else {
        await API.post('/dashboards', formData);
      }
      fetchDashboards();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save dashboard');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await API.patch(`/dashboards/${id}/toggle-active`);
      fetchDashboards();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dashboard? This cannot be undone.')) {
      try {
        await API.delete(`/dashboards/${id}`);
        fetchDashboards();
      } catch (err) {
        alert('Failed to delete dashboard');
      }
    }
  };

  if (loading && dashboards.length === 0) {
    return <div className="h-full flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="p-8 w-full fade-in flex flex-col h-full bg-[#F8FAFC]">
      {/* Header card */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reports Hub</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Create and manage corporate analytics dashboards.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-6 h-12 rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 uppercase tracking-widest"
        >
          + Add New Report
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 font-bold text-sm tracking-tight">{error}</div>}

      {/* Main Table Container */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 items-center">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">#</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Report Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/4">Description</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dashboards.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">No reports configured.</td>
                </tr>
              ) : (
                dashboards.map((dash, idx) => (
                  <tr key={dash._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-xs font-black text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-[200px]">
                        <h3 className="text-sm font-black text-slate-900 leading-none truncate" title={dash.title}>{dash.title}</h3>
                        {!dash.shareable && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
                            Secure View
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 max-w-[300px]" title={dash.description}>
                        {dash.description || <span className="italic opacity-30 italic">No description provided</span>}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-nowrap">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{dash.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleActive(dash._id)}
                          className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${dash.isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${dash.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${dash.isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {dash.isActive ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(dash)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100/50"
                          title="Edit Report"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(dash._id)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Delete Report"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Polished Curvy Design */}
      {showModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 fade-in cursor-pointer"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/20 cursor-default">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {editingDash ? 'Modify Intelligence' : 'Provision Report'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-8 custom-scrollbar">
              <form id="dashForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Report Title</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 h-12 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all" placeholder="e.g. Executive Summary" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Department / Vertical</label>
                    <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 h-12 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all" placeholder="e.g. Logistics" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Configuration (Embed Code / URL)</label>
                  <textarea required name="powerBiIframe" value={formData.powerBiIframe} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-mono text-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none h-28 resize-none transition-all" placeholder="Paste iframe or direct URL" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Insight Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none h-24 resize-none transition-all" placeholder="Brief summary for users..." />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50">
                    <input type="checkbox" id="shareable" name="shareable" checked={formData.shareable} onChange={handleChange} className="w-5 h-5 rounded-lg border-indigo-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                    <div>
                      <label htmlFor="shareable" className="text-xs font-black text-slate-900 cursor-pointer block uppercase tracking-tight">Enable Shared View</label>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Regular users can view and use PBI standard tools.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50">
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded-lg border-emerald-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer" />
                    <div>
                      <label htmlFor="isActive" className="text-xs font-black text-slate-900 cursor-pointer block uppercase tracking-tight">Active In Hub</label>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Toggle visibility on the employee-side dashboard list.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-8 py-6 border-t border-slate-50 flex justify-end gap-3 bg-slate-50/30 rounded-b-[2.5rem]">
              <button type="button" onClick={handleCloseModal} className="px-6 h-12 text-[10px] font-black text-slate-400 rounded-2xl hover:bg-slate-100 uppercase tracking-widest transition-all">Cancel</button>
              <button type="submit" form="dashForm" className="px-8 h-12 bg-slate-950 text-white text-[10px] font-black rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 uppercase tracking-widest transition-all">
                {editingDash ? 'Update Strategy' : 'Authorize Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardManagement;
