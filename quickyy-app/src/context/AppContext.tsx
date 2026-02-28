import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collectReview, collectSettings, trackEvent } from '../services/dataCollection';
import { ThemeMode } from '../theme/palette';

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  college: string;
};

export type PaymentMethod = {
  id: string;
  type: 'UPI' | 'Card' | 'Cash' | 'Wallet';
  label: string;
  details: string;
  isDefault?: boolean;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Review = {
  id: string;
  shopId: string;
  shopName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type AppSettings = {
  themeMode: ThemeMode;
  language: string;
  orderNotifications: boolean;
  promoNotifications: boolean;
  soundEnabled: boolean;
  biometricLock: boolean;
  locationEnabled: boolean;
};

export type AppPermissions = {
  location: boolean;
  camera: boolean;
  mediaLibrary: boolean;
  notifications: boolean;
};

type AppContextType = {
  profile: UserProfile;
  settings: AppSettings;
  permissions: AppPermissions;
  paymentMethods: PaymentMethod[];
  notifications: AppNotification[];
  reviews: Review[];
  averageRating: number;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  updatePermission: (name: keyof AppPermissions, value: boolean) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  addNotification: (title: string, message: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
};

const STORAGE_KEY = '@app_state_v1';

const defaultState = {
  profile: {
    name: 'Aryan',
    email: 'aryan.college@student.edu',
    phone: '',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    college: 'Campus',
  } as UserProfile,
  settings: {
    themeMode: 'system' as ThemeMode,
    language: 'English',
    orderNotifications: true,
    promoNotifications: true,
    soundEnabled: true,
    biometricLock: false,
    locationEnabled: true,
  } as AppSettings,
  permissions: {
    location: true,
    camera: false,
    mediaLibrary: false,
    notifications: true,
  } as AppPermissions,
  paymentMethods: [
    { id: 'pm1', type: 'UPI' as const, label: 'Primary UPI', details: 'aryan@upi', isDefault: true },
  ] as PaymentMethod[],
  notifications: [] as AppNotification[],
  reviews: [] as Review[],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultState.profile);
  const [settings, setSettings] = useState<AppSettings>(defaultState.settings);
  const [permissions, setPermissions] = useState<AppPermissions>(defaultState.permissions);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultState.paymentMethods);
  const [notifications, setNotifications] = useState<AppNotification[]>(defaultState.notifications);
  const [reviews, setReviews] = useState<Review[]>(defaultState.reviews);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<typeof defaultState>;
        if (parsed.profile) setProfile(parsed.profile as UserProfile);
        if (parsed.settings) setSettings(parsed.settings as AppSettings);
        if (parsed.permissions) setPermissions(parsed.permissions as AppPermissions);
        if (parsed.paymentMethods) setPaymentMethods(parsed.paymentMethods as PaymentMethod[]);
        if (parsed.notifications) setNotifications(parsed.notifications as AppNotification[]);
        if (parsed.reviews) setReviews(parsed.reviews as Review[]);
      } catch (error) {
        console.error('Failed to load app state', error);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, settings, permissions, paymentMethods, notifications, reviews }),
    ).catch((error) => console.error('Failed to save app state', error));
  }, [profile, settings, permissions, paymentMethods, notifications, reviews, isLoaded]);

  const updateProfile = async (patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
    await trackEvent('profile_updated', patch as Record<string, unknown>);
  };

  const updateSettings = async (patch: Partial<AppSettings>) => {
    const merged = { ...settings, ...patch };
    setSettings(merged);
    await collectSettings(merged as unknown as Record<string, unknown>);
  };

  const updatePermission = async (name: keyof AppPermissions, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [name]: value }));
    await trackEvent('permission_changed', { permission: name, value });
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = { ...method, id: `pm_${Date.now()}` };
    setPaymentMethods((prev) => (prev.length === 0 ? [{ ...newMethod, isDefault: true }] : [...prev, newMethod]));
    await trackEvent('payment_method_added', newMethod as unknown as Record<string, unknown>);
  };

  const removePaymentMethod = async (id: string) => {
    setPaymentMethods((prev) => {
      const remaining = prev.filter((method) => method.id !== id);
      if (remaining.length > 0 && !remaining.some((method) => method.isDefault)) {
        remaining[0].isDefault = true;
      }
      return [...remaining];
    });
    await trackEvent('payment_method_removed', { id });
  };

  const setDefaultPaymentMethod = async (id: string) => {
    setPaymentMethods((prev) => prev.map((method) => ({ ...method, isDefault: method.id === id })));
    await trackEvent('payment_default_changed', { id });
  };

  const addNotification = async (title: string, message: string) => {
    const next: AppNotification = {
      id: `n_${Date.now()}`,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [next, ...prev]);
    await trackEvent('notification_created', { title });
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    const next: Review = {
      ...review,
      id: `r_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [next, ...prev]);
    await collectReview(next as unknown as Record<string, unknown>);
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  return (
    <AppContext.Provider
      value={{
        profile,
        settings,
        permissions,
        paymentMethods,
        notifications,
        reviews,
        averageRating,
        updateProfile,
        updateSettings,
        updatePermission,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        addNotification,
        markNotificationRead,
        addReview,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
