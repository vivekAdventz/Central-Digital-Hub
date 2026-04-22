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
    if (window.confirm('Delete this user permanently?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full fade-in flex flex-col h-full">
      <div className="mb-8 bg-white p-6 rounded border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Access Control list</h2>
        <p className="text-sm text-gray-500 mt-1">Manage personnel authorized to access the intelligence hub.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        
        {/* Left: Add User Form */}
        <div className="md:w-1/3 bg-white p-6 rounded border border-gray-200 h-fit">
           <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-6">Authorize New Access</h3>
           <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                 <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Corporate Email</label>
                 <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none" placeholder="jane.doe@zuari.com" />
              </div>
              <button disabled={adding} type="submit" className="w-full bg-slate-900 text-white font-bold text-sm tracking-widest uppercase py-2.5 rounded hover:bg-black transition disabled:opacity-50 mt-4">
                 {adding ? 'Provisioning...' : 'Provision Access'}
              </button>
           </form>
        </div>

        {/* Right: User List */}
        <div className="md:w-2/3 flex flex-col bg-white rounded border border-gray-200 overflow-hidden h-full">
           <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Active Directory ({users.length})</span>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {loading ? (
                <div className="p-12 flex justify-center"><Spinner /></div>
              ) : error ? (
                <div className="p-4 text-red-600 text-sm">{error}</div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">No external users provisioned yet.</div>
              ) : (
                <div className="space-y-2">
                   {users.map(user => (
                      <div key={user._id} className={`flex items-center justify-between p-4 border rounded ${user.isActive ? 'border-gray-200 bg-white' : 'border-red-100 bg-red-50/30'}`}>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="text-sm font-bold text-gray-900">{user.name}</h4>
                               {user.isActive ? 
                                 <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span> : 
                                 <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Revoked</span>
                               }
                            </div>
                            <p className="text-xs font-mono text-gray-500 mt-1">{user.email}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleActive(user._id)} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded border ${user.isActive ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
                              {user.isActive ? 'Revoke' : 'Restore'}
                            </button>
                            <button onClick={() => handleDelete(user._id)} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded border text-red-700 bg-red-50 border-red-200 hover:bg-red-100">
                              Delete
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;
