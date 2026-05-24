import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeCart();
    if (user) {
      navigate('/checkout');
    } else {
      toast('Please sign in to proceed to checkout', { icon: '🔒' });
      openAuthModal();
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-900 border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-gold-500/10 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="heading-serif text-xl text-white">Your Flight Order</h2>
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-white transition-colors relative z-10 p-2 cursor-pointer rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold-500/50 scrollbar-track-transparent">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <ShoppingBag className="w-16 h-16 text-gray-500" />
                  <p className="text-gray-400">Your order tray is empty</p>
                  <button 
                    onClick={closeCart}
                    className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950 transition-colors uppercase tracking-widest text-xs mt-4 rounded cursor-pointer"
                  >
                    View Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-dark-950 shrink-0 border border-white/5 group-hover:border-gold-500/30 transition-colors">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gold-500 text-xs italic opacity-50">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-white text-sm font-medium tracking-wide uppercase line-clamp-1">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gold-500 font-medium text-sm mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-white/10 rounded bg-dark-950/50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Clear Cart */}
                  <div className="pt-4 border-t border-white/5">
                     <button
                        onClick={clearCart}
                        className="text-gray-500 text-xs uppercase tracking-wider hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                       <Trash2 className="w-3 h-3"/> Clear Order
                     </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 shrink-0 bg-dark-950 border-t-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent pointer-events-none" />
                <div className="flex justify-between items-end mb-6 relative z-10">
                  <span className="text-gray-400 uppercase tracking-wider text-sm">Total</span>
                  <span className="text-gold-500 text-2xl font-medium tracking-wide">₹{totalPrice}</span>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-gold-500 text-dark-950 font-semibold uppercase tracking-widest text-sm hover:bg-gold-400 transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer relative z-10"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">Taxes and service charges calculated at checkout</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
