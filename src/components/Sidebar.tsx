import React from 'react';
import { LayoutDashboard, FileText, ScanLine, Bookmark, Settings, User, Compass, Sparkles } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  onOpenTour?: () => void;
}

export function Sidebar({ currentTab, setCurrentTab, onOpenTour }: SidebarProps) {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'chat', label: 'AI Chat Studio', icon: <Sparkles className="w-5 h-5 text-primary-500 dark:text-primary-400" /> },
    { id: 'generator', label: 'Worksheet Generator', icon: <FileText className="w-5 h-5" /> },
    { id: 'scanner', label: 'External Layout Scanner', icon: <ScanLine className="w-5 h-5" /> },
    { id: 'saved', label: 'Saved Sheets', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-[260px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center">
          <ScanLine className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">LexiScan AI</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              currentTab === item.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300 border border-primary-200/70 dark:border-primary-500/20 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {onOpenTour && (
        <div className="px-4 mb-2">
          <button
            onClick={onOpenTour}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 text-xs font-semibold transition-colors group shadow-xs"
            title="Open Feature Tour"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover:rotate-45 transition-transform" />
              <span>Get Started Tour</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary-200/60 dark:bg-primary-500/20 text-primary-800 dark:text-primary-300">5 steps</span>
          </button>
        </div>
      )}

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100/80 border border-slate-200/70 dark:bg-slate-800/40 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 font-medium">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Educator Workspace</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
