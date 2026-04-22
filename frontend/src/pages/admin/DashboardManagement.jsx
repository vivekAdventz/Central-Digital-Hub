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
    shareable: true
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
        shareable: dash.shareable
      });
    } else {
      setEditingDash(null);
      setFormData({
        title: '',
        category: '',
        powerBiIframe: '',
        description: '',
        shareable: true
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
    <div className="p-8 max-w-6xl mx-auto w-full fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hub Management</h2>
          <p className="text-sm text-gray-500 mt-1">Configure and assign reports for user access.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-bold shadow hover:bg-indigo-700 transition uppercase tracking-wider"
        >
          + Add Report
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {dashboards.length === 0 && !loading && (
          <div className="text-center p-12 bg-white rounded border border-gray-200 text-gray-400">
            No dashboards configured yet.
          </div>
        )}
        
        {dashboards.map((dash, idx) => (
          <div key={dash._id} className="bg-white p-6 border-l-4 border-gray-200 hover:border-indigo-500 rounded shadow-sm transition-all flex flex-col gap-4">
             <div className="flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                      <h3 className="text-lg font-bold text-gray-900">{dash.title}</h3>
                      {!dash.shareable && (
                        <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-[10px] uppercase font-bold tracking-widest rounded-sm flex items-center gap-1">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                           Secure Mode
                        </span>
                      )}
                   </div>
                   <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-1">{dash.category}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleOpenModal(dash)} className="px-4 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold uppercase rounded hover:bg-gray-50 transition">Edit</button>
                   <button onClick={() => handleDelete(dash._id)} className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold uppercase rounded hover:bg-red-100 transition">Delete</button>
                </div>
             </div>
             
             <div className="bg-gray-50 p-3 rounded border border-gray-100 text-xs font-mono text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                {dash.powerBiIframe}
             </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{editingDash ? 'Edit Component' : 'New Component'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="dashForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Report Title *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Q3 Regional Sales" />
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category (Group) *</label>
                  <input required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Sales" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Power BI Embed Code / Source URL *</label>
                  <textarea required name="powerBiIframe" value={formData.powerBiIframe} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:border-indigo-500 outline-none h-24" placeholder="<iframe src='...' /> or raw URL" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Strategic Overview (Optional)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none h-20" placeholder="Summary of this report..." />
                </div>

                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded border border-amber-200">
                  <input type="checkbox" id="shareable" name="shareable" checked={formData.shareable} onChange={handleChange} className="mt-1 custom-checkbox shrink-0" />
                  <div>
                    <label htmlFor="shareable" className="text-sm font-bold text-gray-900 cursor-pointer block">Shareable Report (Standard Access)</label>
                    <p className="text-xs text-amber-800 mt-1">If unchecked, the source URL is strictly hidden from the browser. Users see a "Confidential View" and cannot access internal PBI functions.</p>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button type="button" onClick={handleCloseModal} className="px-5 py-2 border border-gray-300 text-sm font-bold text-gray-600 rounded bg-white hover:bg-gray-50 uppercase tracking-widest transition">Cancel</button>
              <button type="submit" form="dashForm" className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 shadow uppercase tracking-widest transition">{editingDash ? 'Save Changes' : 'Create Report'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardManagement;
