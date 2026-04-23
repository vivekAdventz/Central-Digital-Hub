import { useState, useEffect } from 'react';
import API from '../../api/api';
import Spinner from '../../components/Spinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState(null);

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

  const handleToggleStatus = async (id) => {
    try {
      await API.patch(`/users/${id}/toggle-active`);
      fetchUsers();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const startEditingUser = (u) => {
    setEditingUserId(u._id);
    setEditUserData({ ...u });
  };

  const saveUserChanges = async () => {
    try {
      if (editingUserId.startsWith('new-')) {
        const { _id, ...data } = editUserData;
        await API.post('/users', data);
      } else {
        await API.put(`/users/${editingUserId}`, editUserData);
      }
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to save user');
    }
  };

  const removeUser = async (id) => {
    if (id.startsWith('new-')) {
      setUsers(users.filter(u => u._id !== id));
      return;
    }
    if (window.confirm('Remove this personnel?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const addNewUser = () => {
    const newUser = { _id: `new-${Date.now()}`, name: 'New Personnel', email: 'user@zuari.com', role: 'User', isActive: true };
    setUsers([...users, newUser]);
    startEditingUser(newUser);
  };

  if (loading && users.length === 0) {
    return <div className="h-full flex items-center justify-center font-sans tracking-widest text-[10px] text-gray-400">Verifying Security Registry...</div>;
  }

  return (
    <div className="animate-in fade-in duration-300 font-sans max-w-5xl mx-auto pb-20">
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded">{error}</div>}
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-[9px] uppercase font-black text-gray-400">
            <tr>
              <th className="p-4">Personnel</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => {
              const isEditing = editingUserId === u._id;
              return (
                <tr key={u._id} className={isEditing ? 'bg-indigo-50/30' : ''}>
                  <td className="p-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="w-full p-1 border rounded text-[11px] font-bold" 
                        value={editUserData.name} 
                        onChange={e => setEditUserData({...editUserData, name: e.target.value})} 
                      />
                    ) : (
                      <b>{u.name}</b>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <input 
                        type="email" 
                        className="w-full p-1 border rounded text-[11px] font-mono" 
                        value={editUserData.email} 
                        onChange={e => setEditUserData({...editUserData, email: e.target.value})} 
                      />
                    ) : (
                      <span className="text-gray-400 font-mono">{u.email}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(u._id)} 
                      className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase transition-all ${
                        u.isActive ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' : 'text-red-400 border-red-100 bg-red-50/30'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Revoked'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2 text-[10px] font-black uppercase tracking-widest">
                        <button onClick={saveUserChanges} className="text-indigo-600">Save</button>
                        <button onClick={() => setEditingUserId(null)} className="text-gray-400">X</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3 text-[10px] font-black uppercase tracking-widest">
                        <button onClick={() => startEditingUser(u)} className="text-gray-400 hover:text-gray-600">Edit</button>
                        <button onClick={() => removeUser(u._id)} className="text-red-300 hover:text-red-500">X</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-6">
        <button 
          onClick={addNewUser} 
          className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-800 transition-all"
        >
          + Add Personnel
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
