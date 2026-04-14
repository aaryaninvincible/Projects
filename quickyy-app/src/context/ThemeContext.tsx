import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors, ThemeMode } from '../theme/palette';

type ThemeContextType = {
  mode: ThemeMode;
  resolvedScheme: 'light' | 'dark';
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const THEME_KEY = '@theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } catch (error) {
        console.error('Failed to load theme mode', error);
      }
    };
    load();
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(THEME_KEY, nextMode);
  };

  const resolvedScheme: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemScheme]);

  const colors = resolvedScheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, resolvedScheme, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeSettings = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeSettings must be used within ThemeProvider');
  }
  return ctx;
};
