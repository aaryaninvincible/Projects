import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb, firebaseEnabled } from '../lib/firebase';

type Role = 'student' | 'vendor' | null;

type VendorAuthPayload = {
  email?: string;
  password?: string;
  [key: string]: unknown;
};

interface AuthContextType {
  role: Role;
  vendorDetails: any | null;
  uid: string | null;
  isLoading: boolean;
  loginAsStudent: () => Promise<void>;
  registerAsVendor: (details: VendorAuthPayload) => Promise<void>;
  loginVendor: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [vendorDetails, setVendorDetails] = useState<any | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted auth state
    const loadAuth = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('@auth_role');
        const storedVendor = await AsyncStorage.getItem('@vendor_details');
        const storedUid = await AsyncStorage.getItem('@auth_uid');
        
        if (storedRole) setRole(storedRole as Role);
        if (storedVendor) setVendorDetails(JSON.parse(storedVendor));
        if (storedUid) setUid(storedUid);
        
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const loginAsStudent = async () => {
    if (firebaseEnabled && firebaseAuth) {
      try {
        const result = await signInAnonymously(firebaseAuth);
        setUid(result.user.uid);
        await AsyncStorage.setItem('@auth_uid', result.user.uid);
      } catch (error) {
        console.error('Firebase anonymous login failed', error);
      }
    }

    setRole('student');
    await AsyncStorage.setItem('@auth_role', 'student');
  };

  const registerAsVendor = async (details: VendorAuthPayload) => {
    let nextUid: string | null = null;

    if (firebaseEnabled && firebaseAuth && firebaseDb && details.email && details.password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          firebaseAuth,
          details.email,
          details.password,
        );
        nextUid = userCredential.user.uid;

        await setDoc(doc(firebaseDb, 'vendors', nextUid), {
          ...details,
          role: 'vendor',
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Firebase vendor registration failed', error);
      }
    }

    setRole('vendor');
    setVendorDetails(details);
    setUid(nextUid);

    await AsyncStorage.setItem('@auth_role', 'vendor');
    await AsyncStorage.setItem('@vendor_details', JSON.stringify(details));
    if (nextUid) await AsyncStorage.setItem('@auth_uid', nextUid);
  };

  const loginVendor = async (email: string, password: string) => {
    let nextUid: string | null = null;

    if (firebaseEnabled && firebaseAuth) {
      try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        nextUid = userCredential.user.uid;
      } catch (error) {
        console.error('Firebase vendor login failed', error);
        throw error;
      }
    }

    setRole('vendor');
    setUid(nextUid);
    await AsyncStorage.setItem('@auth_role', 'vendor');
    if (nextUid) await AsyncStorage.setItem('@auth_uid', nextUid);
  };

  const logout = async () => {
    if (firebaseEnabled && firebaseAuth) {
      try {
        await signOut(firebaseAuth);
      } catch (error) {
        console.error('Firebase logout failed', error);
      }
    }

    setRole(null);
    setVendorDetails(null);
    setUid(null);

    await AsyncStorage.removeItem('@auth_role');
    await AsyncStorage.removeItem('@vendor_details');
    await AsyncStorage.removeItem('@auth_uid');
  };

  return (
    <AuthContext.Provider
      value={{ role, vendorDetails, uid, isLoading, loginAsStudent, registerAsVendor, loginVendor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
