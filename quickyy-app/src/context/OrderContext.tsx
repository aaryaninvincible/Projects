import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, query, onSnapshot, orderBy, where, updateDoc } from 'firebase/firestore';
import { firebaseDb } from '../lib/firebase';
import { useAuth } from './AuthContext';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  shopName: string;
  items: OrderItem[];
  total: number;
  status: 'Preparing' | 'Out for Delivery' | 'Delivered';
  date: string;
};

type OrderContextType = {
  orders: Order[];
  vendorOrders: Order[]; // Live queue for vendors
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>, shopId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const { role, uid, vendorDetails } = useAuth();

  // Listen to live orders globally dependent on Role
  useEffect(() => {
    if (!firebaseDb || !uid) return;

    if (role === 'student') {
      // Students listen to their own orders
      const q = query(collection(firebaseDb, 'orders'), where('userId', '==', uid), orderBy('date', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      });
      return () => unsub();
    } else if (role === 'vendor' && vendorDetails?.name) {
      // Vendors listen to orders placed specifically for their shop
      const q = query(collection(firebaseDb, 'orders'), where('shopName', '==', vendorDetails.name), orderBy('date', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        setVendorOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      });
      return () => unsub();
    }
  }, [role, uid, vendorDetails]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>, shopId: string) => {
    if (!firebaseDb || !uid) return;
    
    const newOrderId = Math.random().toString(36).substr(2, 9);
    
    const newOrder = {
      ...orderData,
      id: newOrderId,
      shopId: shopId,
      userId: uid,
      date: new Date().toISOString(),
      status: 'Preparing',
    };

    await setDoc(doc(firebaseDb, 'orders', newOrderId), newOrder);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!firebaseDb) return;
    await updateDoc(doc(firebaseDb, 'orders', orderId), { status });
  };

  return (
    <OrderContext.Provider value={{ orders, vendorOrders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider');
  return context;
};
