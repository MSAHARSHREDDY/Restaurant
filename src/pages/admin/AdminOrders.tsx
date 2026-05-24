import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Trash2, 
  MapPin, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  User,
  Activity
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  paymentStatus?: string;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
}

export function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Map state
  const [selectedMapAddress, setSelectedMapAddress] = useState<string | null>(null);

  // State-based deletion confirmation modal
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setOrders(data);
        } else {
          toast.error(data.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('Failed to load orders from server.');
      });
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders(); // Refresh list
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to update status');
      }
    } catch(e) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (order: Order) => {
    setDeleteConfirmOrder(order);
  };

  const confirmDeleteAction = async () => {
    if (!deleteConfirmOrder) return;
    const orderId = deleteConfirmOrder._id;
    setDeleteConfirmOrder(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success("Order deleted successfully!");
        fetchOrders();
        // Adjust page down if necessary
        const remainingFetchedOrders = orders.filter(o => o._id !== orderId);
        const maxPages = Math.ceil(remainingFetchedOrders.length / itemsPerPage);
        if (currentPage > maxPages && maxPages > 0) {
          setCurrentPage(maxPages);
        }
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to delete order record.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the order.");
    }
  };

  // Helper custom converter for Indian Standard Time (IST) timezone
  const formatIST = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium'
      }).format(date) + ' (IST)';
    } catch (e) {
      return dateStr;
    }
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customerName.toLowerCase().includes(term) ||
      order.customerEmail.toLowerCase().includes(term) ||
      (order.address && order.address.toLowerCase().includes(term)) ||
      order._id.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculation
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Navigate pages
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 space-y-4">
        <Activity className="w-12 h-12 stroke-[1.5] text-gold-500 animate-pulse" />
        <p className="text-sm font-mono tracking-wide">Reading order registries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-950 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <span className="text-gold-500 text-xs font-mono tracking-widest uppercase mb-1 block">Cabin Steward Desk</span>
          <h3 className="text-3xl font-serif text-white">Manage Orders</h3>
          <p className="text-gray-400 text-sm mt-1">Audit customer deliveries, update preparing cycles, and manage dining logs.</p>
        </div>
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-gold-500" />
          <div>
            <span className="block text-[10px] font-mono text-gray-500 uppercase">Total Tickets</span>
            <span className="text-sm font-bold text-white font-mono">{orders.length} order sheets</span>
          </div>
        </div>
      </div>

      {/* Control Box: Search and Status Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search Field */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by ID, customer name, email, or flight destination address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-gold-500 outline-none transition-all placeholder-gray-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-sm text-white focus:border-gold-500 outline-none appearance-none cursor-pointer transition-all font-medium"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            ▼
          </div>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase border-b border-white/10 text-white font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4">Reference ID</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Items Ordered & Delivery Destination</th>
                <th className="px-6 py-4 text-right">Order Valuation</th>
                <th className="px-6 py-4 text-center">Operational Progress</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.map(order => (
                <tr key={order._id} className="hover:bg-white/3 transition-colors align-top">
                  
                  {/* Order Reference ID */}
                  <td className="px-6 py-5">
                    <span className="bg-white/10 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-white/5 block w-max">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono mt-1 block">Full ID: {order._id}</span>
                  </td>

                  {/* Customer Details */}
                  <td className="px-6 py-5 min-w-[200px]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-tight">{order.customerName}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{order.customerEmail}</p>
                        {order.customerPhone && (
                          <p className="text-xs text-gold-400/90 font-mono mt-0.5 flex items-center gap-1">
                            <span>📞</span> {order.customerPhone}
                          </p>
                        )}
                        
                        {/* Time Stamp (IST) */}
                        <div className="flex items-center gap-1 mt-2 text-gold-500/80 font-mono text-[10px]">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{formatIST(order.createdAt)}</span>
                        </div>

                        {/* Real-time Payment Indicators */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wide ${
                            order.paymentMethod === 'Stripe' 
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            💳 {order.paymentMethod || 'Counter'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wide uppercase ${
                            order.paymentStatus === 'Paid' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Ordered Items & Address */}
                  <td className="px-6 py-5 max-w-sm">
                    {/* Items & Qualities */}
                    <div className="space-y-1.5 mb-4 bg-dark-950/40 p-2.5 border border-white/5 rounded-xl">
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Cuisine Pack Details</div>
                      {order.items && order.items.map((it, idx) => (
                        <div key={it.id || idx} className="flex justify-between text-xs text-gray-300">
                          <span className="font-medium text-white max-w-[220px] truncate">{it.name}</span>
                          <span className="font-mono text-gold-500 font-bold shrink-0">
                            x{it.quantity} <em className="text-[10px] text-gray-550 not-italic font-normal">(₹{it.price})</em>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Customer Delivery Destination Address */}
                    <div 
                      onClick={() => setSelectedMapAddress(order.address || "Main Galley Counter Check-In")}
                      className="flex items-start gap-1.5 text-xs text-gray-400 bg-white/3 border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/[0.02] p-2.5 rounded-xl cursor-pointer transition-all group"
                      title="Click to view live delivery spot map"
                    >
                      <MapPin className="w-4 h-4 text-rose-400 group-hover:text-gold-500 group-hover:scale-110 shrink-0 mt-0.5 transition-all text-red-500 duration-150" />
                      <div className="break-words w-full">
                        <span className="font-bold text-[10px] font-mono text-gray-400 group-hover:text-gold-400 uppercase block transition-colors">Delivery Cabin/Seat Address <em className="text-[9px] text-gray-600 font-normal lowercase">(view map)</em></span>
                        <p className="text-gray-300 group-hover:text-white leading-normal mt-0.5 transition-colors">{order.address || "Main Galley Counter Check-In"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Pricing Valuation */}
                  <td className="px-6 py-5 text-right font-mono">
                    <p className="text-gold-500 font-extrabold text-base">₹{order.totalAmount.toLocaleString()}</p>
                    <span className="text-[10px] text-gray-500 uppercase font-mono">Gourmet Fare</span>
                  </td>

                  {/* Operational Progress Status Selector */}
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider font-mono font-bold uppercase border
                        ${order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          order.status === 'Preparing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          order.status === 'Out for Delivery' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}
                      >
                        {order.status}
                      </span>
                      
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="bg-dark-950 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none w-28 text-center cursor-pointer hover:border-gold-500/50 transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Inflight Airway</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>

                  {/* Actions (Delete Icon) */}
                  <td className="px-5 py-5 text-center">
                    <button
                      onClick={() => handleDelete(order)}
                      title="Purge transaction ticket"
                      className="p-2 border border-white/5 hover:border-red-500/30 text-gray-500 hover:text-red-400 bg-white/3 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>

                </tr>
              ))}
              
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <p className="text-sm font-mono">No order records match the parameters.</p>
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
              Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-gold-500 font-bold">{totalItems}</span> dining logs
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

      {/* REUSABLE STATE-BASED TRANSACTION PURGE MODAL */}
      {deleteConfirmOrder !== null && (
        <div className="fixed inset-0 bg-dark-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-dark-900 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 border-b border-white/10 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0 text-red-500" />
              <h4 className="text-lg font-serif text-white font-medium">Purge Transaction Ticket</h4>
            </div>
            <div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Are you absolutely sure you want to permanently delete order record <strong className="text-white font-mono">#{deleteConfirmOrder._id.slice(-8).toUpperCase()}</strong>?
              </p>
              <div className="mt-3 bg-white/5 border border-white/5 p-3 rounded-lg space-y-1">
                <p className="text-xs text-gray-400"><strong className="text-gray-300 font-medium">Customer:</strong> {deleteConfirmOrder.customerName}</p>
                <p className="text-xs text-gray-400"><strong className="text-gray-300 font-medium">Amount:</strong> ₹{deleteConfirmOrder.totalAmount}</p>
                <p className="text-xs text-gray-400"><strong className="text-gray-300 font-medium">Timestamp:</strong> {formatIST(deleteConfirmOrder.createdAt)}</p>
              </div>
              <p className="text-[11px] text-red-400 mt-3 font-mono">
                * This execution removes files from the core dining logs. This action cannot be revoked.
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setDeleteConfirmOrder(null)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                Cancel Purge
              </button>
              <button
                onClick={confirmDeleteAction}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Live Google Map Modal */}
      {selectedMapAddress && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedMapAddress(null)} />
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-4xl relative overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-250">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-dark-950">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500 animate-pulse" />
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Flight Gourmet Delivery Destination Map</h4>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5 max-w-[500px] truncate">{selectedMapAddress}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMapAddress(null)}
                className="text-gray-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg border border-white/5 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Close Map
              </button>
            </div>

            {/* Frame Container */}
            <div className="relative aspect-video w-full bg-black/50">
              <iframe
                title="Google Maps Location Tracker representation"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMapAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-dark-950 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
              <span>Delivery Address Geolocation Node</span>
              <span>Google Maps Live Server Embed</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
