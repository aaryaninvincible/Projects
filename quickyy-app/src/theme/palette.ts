export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  transparent: string;
  danger: string;
};

export const lightColors: ThemeColors = {
  primary: '#0f766e',
  secondary: '#0ea5e9',
  accent: '#10b981',
  background: '#f1f5f9',
  surface: '#ffffff',
  text: '#0f172a',
  textMuted: '#475569',
  border: '#dbe3ee',
  transparent: 'transparent',
  danger: '#dc2626',
};

export const darkColors: ThemeColors = {
  primary: '#22d3ee',
  secondary: '#14b8a6',
  accent: '#34d399',
  background: '#020617',
  surface: '#0f172a',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  border: '#1e293b',
  transparent: 'transparent',
  danger: '#ef4444',
};
