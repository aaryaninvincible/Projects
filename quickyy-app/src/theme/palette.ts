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
  primary: '#e23744',
  secondary: '#fc8019',
  accent: '#10b981',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#1c1c1c',
  textMuted: '#686b78',
  border: '#e9e9eb',
  transparent: 'transparent',
  danger: '#dc2626',
};

export const darkColors: ThemeColors = {
  primary: '#f0525f',
  secondary: '#ff9a3d',
  accent: '#34d399',
  background: '#0f1216',
  surface: '#171b21',
  text: '#f3f4f6',
  textMuted: '#a1a1aa',
  border: '#272c35',
  transparent: 'transparent',
  danger: '#ef4444',
};
