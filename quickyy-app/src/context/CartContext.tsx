import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  shopId: string;
  shopName: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: any, shop: any) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: any, shop: any) => {
    setItems((prev) => {
      // Logic: Only allow items from one shop at a time for simplicity (like Swiggy)
      if (prev.length > 0 && prev[0].shopId !== shop.id) {
        Alert.alert("Different Restaurant", "You can only order from one restaurant at a time. Cart reset!");
        return [{ id: item.id, name: item.name, price: item.price, quantity: 1, shopId: shop.id, shopName: shop.name }];
      }

      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, shopId: shop.id, shopName: shop.name }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  };

  const clearCart = () => setItems([]);

  const getCartTotal = () => items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
