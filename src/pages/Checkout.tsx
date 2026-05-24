import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle, 
  ShieldCheck, 
  PartyPopper 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Auto-redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to proceed with checkout.');
      navigate('/');
    }
  }, [user, navigate]);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const address = formData.get('address') as string;

    if (!address) {
      toast.error('Please enter a delivery address.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Initializing gourmet order placement...');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          address,
          items,
          totalAmount: totalPrice + 50,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected order compilation.');
      }

      setOrderPlaced(true);
      clearCart();
      toast.success('Your Gourmet Order has been placed successfully!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Order registration failed. Please retry.', { id: toastId });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="w-full pt-32 pb-20 min-h-screen flex items-center justify-center font-sans bg-dark-950 text-white">
        <div className="max-w-md w-full p-8 mx-auto text-center border border-gold-500/30 rounded-2xl bg-gold-500/5 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="relative inline-block mb-3">
            <div className="absolute inset-0 bg-gold-500 rounded-full blur opacity-25 animate-ping"></div>
            <CheckCircle className="w-16 h-16 text-gold-500 relative" />
          </div>
          <h2 className="text-3xl font-medium heading-serif text-white mb-2">Order Confirmed</h2>
          <div className="flex justify-center gap-1.5 text-xs text-gold-500 font-bold mb-6">
            <PartyPopper className="w-4 h-4 animate-bounce" />
            <span>Gourmet meal scheduled in system</span>
          </div>
          <p className="text-gray-400 mb-8 font-light text-sm leading-relaxed">
            Your dining order is confirmed. Head chefs have initialized live gourmet configurations.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="w-full py-3.5 bg-gold-400 text-dark-950 font-bold uppercase tracking-widest text-xs hover:bg-gold-300 transition-colors rounded-lg cursor-pointer flex items-center justify-center gap-2"
          >
            Explore Menu <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-20 min-h-screen font-sans bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-gold-500 text-xs font-mono tracking-widest uppercase mb-1 block">Bharat BillPay Integration</span>
          <h2 className="heading-serif text-4xl sm:text-5xl text-white mb-4">Gourmet Checkout</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">Confirm your delivery details and place your order directly.</p>
          <div className="w-24 h-0.5 bg-gold-500/40 mx-auto mt-4" />
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Panel: Delivery Configuration & Order Placement Action */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-8 border border-white/10 rounded-2xl bg-dark-900/40 backdrop-blur-md">
              <h3 className="text-lg font-medium text-white mb-6 uppercase tracking-wider pb-3 border-b border-white/5 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold font-mono">1</span>
                Delivery Configuration
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest font-mono">Customer Name</label>
                    <input
                      required
                      type="text"
                      name="customerName"
                      defaultValue={user?.name || ''}
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest font-mono">Primary Email ID</label>
                    <input
                      required
                      type="email"
                      name="customerEmail"
                      defaultValue={user?.email || ''}
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest font-mono">Phone / Mobile Number</label>
                    <input
                      required
                      type="tel"
                      name="customerPhone"
                      defaultValue={user?.mobile || ''}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gold-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span> Delivery Address
                  </label>
                  <textarea
                    required
                    name="address"
                    rows={3}
                    placeholder="e.g. Flat/House No, Building, Street, Area, City, State, Pincode"
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:border-gold-500 transition-colors text-sm resize-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 italic">* Our delivery partners will ship fresh prepared dishes straight to your address.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Order Bill Summary & Cart Review */}
          <div className="lg:col-span-5 relative">
            <div className="p-8 border border-white/10 rounded-2xl bg-dark-900/50 backdrop-blur-md sticky top-32">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gold-500" />
                  <h3 className="text-xl font-medium text-white uppercase tracking-wider">Gourmet Order Bill</h3>
                </div>
                <span className="text-xs bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded border border-gold-500/20 font-mono font-bold">{items.length} items</span>
              </div>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-gray-400 font-light text-sm italic">No items selected. Empty cart.</p>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <span className="text-white text-sm tracking-wide capitalize">{item.name} <span className="text-gray-500 text-xs ml-1">x{item.quantity}</span></span>
                      </div>
                      <span className="text-gold-500 text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-light">Subtotal</span>
                  <span className="text-gray-200">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-light">Service & Delivery Fee</span>
                  <span className="text-gray-200">₹{items.length > 0 ? '50' : '0'}</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-white/10 font-bold">
                  <span className="text-white font-medium uppercase tracking-wider">Total Amount Payable</span>
                  <span className="text-gold-500 text-2xl font-mono">₹{items.length > 0 ? (totalPrice + 50).toLocaleString() : 0}</span>
                </div>
              </div>

              {/* Confirm & Place Order CTA - now placed precisely after the bill details */}
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full mt-6 py-4 bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold uppercase tracking-widest text-sm transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-gold-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Order...' : 'Confirm & Place Order'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400 border-t border-white/5 pt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Authorized Secure Checkout Protocol</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
