import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type Mode = 'light' | 'dark' | 'system';

// Define theme tokens
interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    accent: string;
    overlay: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' };
    h2: { fontSize: number; fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' };
    h3: { fontSize: number; fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' };
    body: { fontSize: number; fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' };
    caption: { fontSize: number; fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' };
  };
  radius: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  elevation: {
    low: object;
    medium: object;
    high: object;
  };
}

// Light theme tokens
const lightTokens: ThemeTokens = {
  colors: {
    primary: '#1e293b', // slate-800
    secondary: '#64748b', // slate-500
    background: '#f8fafc', // slate-50
    surface: '#ffffff',
    text: '#0f172a', // slate-900
    textSecondary: '#64748b', // slate-500
    border: '#e2e8f0', // slate-200
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    success: '#10b981', // emerald-500
    accent: '#3b82f6', // blue-500
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '800' },
    h2: { fontSize: 24, fontWeight: '700' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '400' },
  },
  radius: {
    small: 4,
    medium: 8,
    large: 16,
    xlarge: 24,
  },
  elevation: {
    low: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    medium: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
    high: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  },
};

// Dark theme tokens
const darkTokens: ThemeTokens = {
  colors: {
    primary: '#cbd5e1', // slate-300
    secondary: '#94a3b8', // slate-400
    background: '#0f172a', // slate-900
    surface: '#1e293b', // slate-800
    text: '#f8fafc', // slate-50
    textSecondary: '#94a3b8', // slate-400
    border: '#334155', // slate-700
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    success: '#10b981', // emerald-500
    accent: '#60a5fa', // blue-400
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '800' },
    h2: { fontSize: 24, fontWeight: '700' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '400' },
  },
  radius: {
    small: 4,
    medium: 8,
    large: 16,
    xlarge: 24,
  },
  elevation: {
    low: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 2 },
    medium: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
    high: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  },
};

type ThemeContextType = {
  mode: Mode;
  setMode: (m: Mode) => void;
  effective: 'light' | 'dark';
  tokens: ThemeTokens;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderCustom({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('system');
  const system = useRNColorScheme() ?? 'light';

  const effective = useMemo<'light' | 'dark'>(
    () => (mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode),
    [mode, system]
  );

  const tokens = useMemo(
    () => (effective === 'dark' ? darkTokens : lightTokens),
    [effective]
  );

  const value = useMemo(() => ({ mode, setMode, effective, tokens }), [mode, effective, tokens]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProviderCustom');
  return ctx;
}

// Custom hook to access theme tokens
export function useThemeTokens() {
  const { tokens } = useThemeMode();
  return tokens;
}
