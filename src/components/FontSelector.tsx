import React from 'react';
import { Type, Check } from 'lucide-react';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';

interface FontSelectorProps {
  value: WorksheetFont;
  onChange: (font: WorksheetFont) => void;
  variant?: 'card' | 'inline' | 'compact';
}

export function FontSelector({ value, onChange, variant = 'card' }: FontSelectorProps) {
  const currentFont = WORKSHEET_FONTS[value] || WORKSHEET_FONTS.sans;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
        <span className="text-slate-600 dark:text-slate-400 pl-2 pr-1 font-semibold flex items-center gap-1">
          <Type className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span className="hidden sm:inline">Font:</span>
        </span>
        {(Object.keys(WORKSHEET_FONTS) as WorksheetFont[]).map((fontKey) => {
          const font = WORKSHEET_FONTS[fontKey];
          const isSelected = value === fontKey;
          return (
            <button
              key={fontKey}
              type="button"
              onClick={() => onChange(fontKey)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
              } ${font.className}`}
              title={font.description}
            >
              {fontKey === 'sans' ? 'Sans-Serif' : fontKey === 'serif' ? 'Serif' : 'Handwriting'}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>Worksheet Font Style</span>
        </label>
        <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
          {currentFont.name}
        </span>
      </div>

      {/* Font Selection Dropdown */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as WorksheetFont)}
          className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all appearance-none cursor-pointer font-medium ${currentFont.className}`}
        >
          <option value="sans">Sans-Serif — Modern, high-legibility & dyslexia-friendly</option>
          <option value="serif">Serif — Academic, classic literature & comprehension print</option>
          <option value="handwriting">Handwriting — Friendly classroom penmanship for ESL</option>
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Visual Font Cards Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {(Object.keys(WORKSHEET_FONTS) as WorksheetFont[]).map((fontKey) => {
          const font = WORKSHEET_FONTS[fontKey];
          const isSelected = value === fontKey;
          return (
            <button
              key={fontKey}
              type="button"
              onClick={() => onChange(fontKey)}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-950 dark:bg-primary-950/40 dark:text-primary-100 shadow-xs ring-1 ring-primary-500/50'
                  : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold leading-tight truncate">
                  {fontKey === 'sans' ? 'Sans-Serif' : fontKey === 'serif' ? 'Serif' : 'Handwriting'}
                </span>
                {isSelected && (
                  <span className="w-3.5 h-3.5 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className={`text-base font-semibold leading-none text-slate-900 dark:text-slate-100 py-1 ${font.className}`}>
                Aa Bb 123
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                {fontKey === 'sans' ? 'Modern Clean' : fontKey === 'serif' ? 'Book Print' : 'Penmanship'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
