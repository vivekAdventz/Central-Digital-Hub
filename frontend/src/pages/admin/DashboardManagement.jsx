import { useState, useEffect } from 'react';
import API from '../../api/api';
import Spinner from '../../components/Spinner';

const DashboardManagement = ({ refreshDashboards }) => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const fetchDashboards = async () => {
    setLoading(true);
    try {
      const response = await API.get('/dashboards');
      setDashboards(response.data.data);
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const updateDashItem = async (id, key, val) => {
    const updated = dashboards.map(d => d._id === id ? { ...d, [key]: val } : d);
    setDashboards(updated);
  };

  const handleAction = async (dash) => {
    if (editingId !== dash._id) {
      setEditingId(dash._id);
      return;
    }

    try {
      if (dash._id.startsWith('new-')) {
        const { _id, ...data } = dash;
        await API.post('/dashboards', data);
      } else {
        await API.put(`/dashboards/${dash._id}`, dash);
      }
      setEditingId(null);
      fetchDashboards();
      if (refreshDashboards) refreshDashboards();
    } catch (err) {
      alert('Failed to save dashboard');
    }
  };

  const addNewDashItem = () => {
    const newId = `new-${Date.now()}`;
    const newItem = {
      _id: newId,
      title: 'New Analytics Module',
      description: 'Strategic overview of core metrics...',
      powerBiIframe: 'https://app.powerbi.com/view?r=',
      category: 'General'
    };
    setDashboards([...dashboards, newItem]);
    setEditingId(newId);
  };

  const removeDashItem = async (id) => {
    if (id.startsWith('new-')) {
      setDashboards(dashboards.filter(d => d._id !== id));
      if (editingId === id) setEditingId(null);
      return;
    }
    if (window.confirm('Delete this asset?')) {
      try {
        await API.delete(`/dashboards/${id}`);
        fetchDashboards();
        if (refreshDashboards) refreshDashboards();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading && dashboards.length === 0) {
    return <div className="h-full flex items-center justify-center font-sans uppercase tracking-[0.2em] text-[10px] text-gray-400">Synchronizing Assets...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans max-w-4xl mx-auto pb-20">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded">{error}</div>}
      
      {dashboards.map((d, idx) => {
        const isEditing = editingId === d._id;
        return (
          <div key={d._id} className={`p-6 rounded-lg border shadow-sm relative space-y-4 transition-all duration-300 ${isEditing ? 'bg-white border-indigo-200 ring-1 ring-indigo-50' : 'bg-gray-50/30 border-gray-100'}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${isEditing ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 bg-gray-100'}`}>Asset #{idx + 1} {isEditing && '• Recording Changes'}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => removeDashItem(d._id)} className="text-[9px] font-bold text-red-400 hover:text-red-700 uppercase">Delete Asset</button>
                <button 
                  onClick={() => handleAction(d)} 
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-all ${isEditing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-indigo-600 hover:bg-white hover:shadow-sm'}`}
                >
                  {isEditing ? 'Save Changes' : 'Edit Asset'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    type="text" 
                    value={d.title} 
                    disabled={!isEditing}
                    placeholder="Dashboard Title" 
                    onChange={(e) => updateDashItem(d._id, 'title', e.target.value)} 
                    className="w-full px-3 py-2 text-[11px] bg-white border border-gray-200 rounded font-bold focus:ring-1 focus:ring-indigo-500 transition-all outline-none disabled:opacity-60 disabled:bg-gray-50/50 disabled:cursor-not-allowed" 
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <input 
                    type="text" 
                    value={d.category} 
                    disabled={!isEditing}
                    placeholder="Category" 
                    onChange={(e) => updateDashItem(d._id, 'category', e.target.value)} 
                    className="w-full px-3 py-2 text-[11px] bg-white border border-gray-200 rounded font-bold focus:ring-1 focus:ring-indigo-500 transition-all outline-none disabled:opacity-60 disabled:bg-gray-50/50 disabled:cursor-not-allowed" 
                  />
               </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Iframe Source / URL</label>
              <textarea 
                value={d.powerBiIframe} 
                disabled={!isEditing}
                placeholder="Iframe HTML Source" 
                onChange={(e) => updateDashItem(d._id, 'powerBiIframe', e.target.value)} 
                className={`w-full h-20 px-3 py-2 font-mono text-[10px] rounded resize-none focus:ring-1 outline-none transition-all ${isEditing ? 'bg-slate-900 text-indigo-300 focus:ring-indigo-500' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Strategic Description</label>
              <textarea 
                value={d.description || ''} 
                disabled={!isEditing}
                placeholder="Strategy Context Description" 
                onChange={(e) => updateDashItem(d._id, 'description', e.target.value)} 
                className="w-full h-16 px-3 py-2 bg-white border border-gray-200 rounded text-[11px] resize-none italic focus:ring-1 focus:ring-indigo-500 transition-all outline-none disabled:opacity-60 disabled:bg-gray-50/50 disabled:cursor-not-allowed" 
              />
            </div>
          </div>
        );
      })}

      <div className="flex justify-center pt-4">
        <button 
          onClick={addNewDashItem} 
          className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-800 transition-all"
        >
          + New Asset Container
        </button>
      </div>
    </div>
  );
};

export default DashboardManagement;
