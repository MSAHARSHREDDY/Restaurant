import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { menuItems } from '../api/client';

export interface CartItem {
  id: string | number;
  categoryId?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, token } = useAuth();
  const initFetchDone = useRef(false);

  // Fetch cart initially from localStorage and reconcile with current menu
  useEffect(() => {
    const savedCart = localStorage.getItem('localCart');
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        
        // Reconcile with latest menu items to get updated prices & names
        const reconciled = parsedCart.map(cartItem => {
          const menuItem = menuItems.find(m => String(m.id) === String(cartItem.id));
          if (menuItem) {
            return {
              ...cartItem,
              categoryId: menuItem.categoryId,
              name: `${menuItem.categoryId} - ${menuItem.name}`,
              price: menuItem.price, // Latest price
            };
          }
          return cartItem;
        });
        
        setItems(reconciled);
      } catch(e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('localCart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // Find the original item to ensure latest category and name
    const menuItem = menuItems.find(m => String(m.id) === String(item.id));
    const enrichedItem = menuItem ? {
      ...item,
      categoryId: menuItem.categoryId,
      name: `${menuItem.categoryId} - ${menuItem.name}`,
      price: menuItem.price
    } : item;

    setItems((prev) => {
      const existing = prev.find((i) => String(i.id) === String(enrichedItem.id));
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(enrichedItem.id) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...enrichedItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (String(i.id) === String(id) ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
