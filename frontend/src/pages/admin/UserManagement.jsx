import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '' });

  const fetchUsers = async () => {
    try {
       const response = await API.get('/users');
       setUsers(response.data.data);
    } catch (err) {
       setError('Failed to fetch users');
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await API.post('/users', formData);
      setFormData({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add user');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await API.patch(`/users/${id}/toggle-active`);
      fetchUsers();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user permanently? This will revoke all access immediately.')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-8 w-full fade-in flex flex-col h-full bg-[#F8FAFC]">
      {/* Header card */}
      <div className="mb-8 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Control</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Manage personnel and security permissions for the Hub.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 flex-1 min-h-0">
        
        {/* Left: Add User Form - Polished Card */}
        <div className="xl:w-[320px] bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-lg h-fit">
           <div className="flex items-center gap-2 mb-8">
             <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authorize Personnel</h3>
           </div>

           <form onSubmit={handleAddSubmit} className="space-y-6">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                 <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all" 
                    placeholder="e.g. John Smith" 
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Corporate Email</label>
                 <input 
                    required 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all" 
                    placeholder="name@zuari.com" 
                 />
              </div>
              <button 
                disabled={adding} 
                type="submit" 
                className="w-full h-14 bg-slate-950 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                 {adding ? 'Processing...' : 'Provision Access'}
              </button>
           </form>
        </div>

        {/* Right: User Table - Immersive Design */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-xl overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Registry ({users.length})</span>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-20 flex justify-center"><Spinner /></div>
              ) : error ? (
                <div className="p-4 text-rose-600 text-sm font-bold">{error}</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/10 border-b border-slate-50">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">#</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Information</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Access Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm italic">No users provisioned.</td>
                      </tr>
                    ) : (
                      users.map((u, idx) => (
                        <tr key={u._id} className={`group hover:bg-slate-50/50 transition-colors ${!u.isActive ? 'bg-rose-50/10' : ''}`}>
                           <td className="px-6 py-5">
                             <span className="text-xs font-black text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${u.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                  {u.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className={`text-sm font-black tracking-tight ${u.isActive ? 'text-slate-900' : 'text-slate-400'}`}>{u.name}</h4>
                                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{u.email}</p>
                                </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleToggleActive(u._id)}
                                  className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${u.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                >
                                  <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${u.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${u.isActive ? 'text-emerald-600' : 'text-rose-400'}`}>
                                  {u.isActive ? 'Verified' : 'Revoked'}
                                </span>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button 
                                onClick={() => handleDelete(u._id)} 
                                className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm group-hover:bg-white"
                                title="Delete Permanently"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                           </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;
