import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Users, 
  Activity,
  ShieldAlert
} from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  isAdmin: boolean;
}

export function AdminUsers() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = () => {
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUsers(data);
        } else {
          toast.error(data.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('Failed to load user registries from server.');
      });
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const toggleAdmin = async (id: string, currentStatus: boolean) => {
    if (id === currentUser?.id) {
      toast.error("You cannot change your own admin status.");
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/users/${id}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isAdmin: !currentStatus })
      });
      if (res.ok) {
        toast.success(`User role updated successfully.`);
        fetchUsers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update user role');
      }
    } catch(e) {
      toast.error('Failed to update user role');
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.mobile && u.mobile.toLowerCase().includes(q))
    );
  });

  // Pagination calculation
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 space-y-4">
        <Activity className="w-12 h-12 stroke-[1.5] text-gold-500 animate-pulse" />
        <p className="text-sm font-mono tracking-wide">Reading flight passenger profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-950 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <span className="text-gold-500 text-xs font-mono tracking-widest uppercase mb-1 block">Cabin Security Panel</span>
          <h3 className="text-3xl font-serif text-white">Manage Users</h3>
          <p className="text-gray-400 text-sm mt-1">Audit guest logs, configure passenger roles, and manage privileges.</p>
        </div>
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
          <Users className="w-5 h-5 text-gold-500" />
          <div>
            <span className="block text-[10px] font-mono text-gray-500 uppercase">Passengers Registered</span>
            <span className="text-sm font-bold text-white font-mono">{users.length} user sheets</span>
          </div>
        </div>
      </div>

      {/* Control Box: Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search passengers by name, email id, or mobile contact number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-gold-500 outline-none transition-all placeholder-gray-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase border-b border-white/10 text-white font-mono tracking-wider animate-fade-in">
              <tr>
                <th className="px-6 py-4">Passenger Name</th>
                <th className="px-6 py-4">Email ID</th>
                <th className="px-6 py-4">Mobile contact</th>
                <th className="px-6 py-4">Security Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {paginatedUsers.map(u => (
                <tr key={u._id} className="hover:bg-white/3 transition-colors">
                  
                  {/* Passenger Name */}
                  <td className="px-6 py-4 text-white font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold-400/10 border border-gold-500/20 text-gold-500 flex items-center justify-center font-serif text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  
                  {/* Email ID */}
                  <td className="px-6 py-4 font-mono text-xs">{u.email}</td>
                  
                  {/* Mobile */}
                  <td className="px-6 py-4 font-mono text-xs">{u.mobile || 'Not provided'}</td>
                  
                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider ${
                      u.isAdmin 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {u.isAdmin ? 'Admin Co-Pilot' : 'Authorized Passenger'}
                    </span>
                  </td>
                  
                  {/* Actions Button */}
                  <td className="px-6 py-4 text-right font-mono">
                    {u._id !== currentUser?.id ? (
                      <button
                        onClick={() => toggleAdmin(u._id, u.isAdmin)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                          u.isAdmin 
                            ? 'border-red-500/40 hover:border-red-500 text-red-500 hover:bg-red-500/5' 
                            : 'border-gold-500/40 hover:border-gold-500 text-gold-500 hover:bg-gold-500/5'
                        }`}
                      >
                        {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono italic flex items-center justify-end gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-gold-500/70" />
                        Active Agent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500 font-mono text-xs">
                    No passenger records found matching query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Customized Pagination Footer Bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-white/3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400 font-mono">
              Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-gold-500 font-bold">{totalItems}</span> passenger sheets
            </span>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 border border-white/15 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                    currentPage === page 
                      ? 'bg-gold-500 border-gold-500 text-dark-950 shadow-md font-bold' 
                      : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30 bg-transparent'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 border border-white/15 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
