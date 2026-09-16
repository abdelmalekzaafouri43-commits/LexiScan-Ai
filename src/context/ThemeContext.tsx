import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'sapphire' | 'emerald' | 'violet' | 'indigo';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  setColor: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<ThemeColor>('indigo');
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Load from local storage initially
  useEffect(() => {
    const savedColor = localStorage.getItem('app_theme_color') as ThemeColor;
    const savedMode = localStorage.getItem('app_theme_mode') as ThemeMode;
    if (savedColor) setColor(savedColor);
    if (savedMode) setMode(savedMode);
  }, []);

  // Update classes and storage
  useEffect(() => {
    document.documentElement.className = mode;
    document.documentElement.setAttribute('data-theme', color);
    
    localStorage.setItem('app_theme_color', color);
    localStorage.setItem('app_theme_mode', mode);
  }, [mode, color]);

  return (
    <ThemeContext.Provider value={{ color, mode, setColor, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
