import React from 'react';
import { Key, Menu, Compass, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  onOpenTour?: () => void;
}

export function Header({ title, onMenuClick, onOpenTour }: HeaderProps) {
  const { mode, setMode } = useTheme();

  return (
    <header className="h-20 px-4 lg:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 flex-shrink-0 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h2>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Theme Toggle Button */}
        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all shadow-xs group"
          title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {mode === 'light' ? (
            <>
              <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-primary-400 group-hover:-rotate-12 transition-transform" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>

        {onOpenTour && (
          <button 
            onClick={onOpenTour}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 hover:bg-primary-100/80 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 border border-primary-200 dark:border-primary-500/30 text-xs font-semibold text-primary-700 dark:text-primary-300 transition-colors shadow-xs"
            title="Open Interactive Feature Tour"
          >
            <Compass className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span className="hidden md:inline">Get Started Tour</span>
            <span className="md:hidden">Tour</span>
          </button>
        )}

        <button className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xs">
          <Key className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Setup API Key</span>
        </button>
      </div>
    </header>
  );
}
