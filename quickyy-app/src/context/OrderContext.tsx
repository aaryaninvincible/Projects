import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, query, onSnapshot, where, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
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
      const q = query(collection(firebaseDb, 'orders'), where('userId', '==', uid));
      const unsub = onSnapshot(q, (snap) => {
        const payload = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        payload.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(payload);
      }, (error) => console.warn("Firestore Student Orders Error:", error.message));
      return () => unsub();
    } else if (role === 'vendor' && vendorDetails?.name) {
      // Vendors listen to orders placed specifically for their shop
      const q = query(collection(firebaseDb, 'orders'), where('shopName', '==', vendorDetails.name));
      const unsub = onSnapshot(q, (snap) => {
        const payload = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        payload.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setVendorOrders(payload);
      }, (error) => console.warn("Firestore Vendor Orders Error:", error.message));
      return () => unsub();
    }
  }, [role, uid, vendorDetails]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>, shopId: string) => {
    if (!firebaseDb || !uid) {
      Alert.alert("Authentication Error", "Please ensure Anonymous Login is enabled in your Firebase console. We could not verify your identity to place the order.");
      return;
    }
    
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
