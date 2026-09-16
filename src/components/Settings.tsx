import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Check, Palette } from 'lucide-react';

export function Settings() {
  const { color, mode, setColor, setMode } = useTheme();

  const colors = [
    { id: 'indigo', name: 'Indigo', bg: 'bg-[#6366f1]' },
    { id: 'sapphire', name: 'Sapphire', bg: 'bg-[#3b82f6]' },
    { id: 'emerald', name: 'Emerald', bg: 'bg-[#10b981]' },
    { id: 'violet', name: 'Violet', bg: 'bg-[#8b5cf6]' }
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Settings</h2>
        <p className="text-slate-600 dark:text-slate-400">Manage your application preferences and appearance.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm space-y-8 shadow-sm">
        
        {/* Appearance Mode */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            {mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('light')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${mode === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <Sun className={`w-8 h-8 ${mode === 'light' ? 'text-primary-500' : 'text-slate-400'}`} />
              <span className={`font-medium ${mode === 'light' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>Light Mode</span>
            </button>
            <button 
              onClick={() => setMode('dark')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${mode === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <Moon className={`w-8 h-8 ${mode === 'dark' ? 'text-primary-500' : 'text-slate-400'}`} />
              <span className={`font-medium ${mode === 'dark' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>Dark Mode</span>
            </button>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700/50" />

        {/* Accent Color */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" />
            Accent Color
          </h3>
          <div className="flex flex-wrap gap-4">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${color === c.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${c.bg}`}>
                  {color === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`font-medium ${color === c.id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
