import React from 'react';
import { Palette, Frame, Type, Sparkles, Sliders } from 'lucide-react';
import { WorksheetThemeColor, WorksheetBorderStyle, THEME_COLOR_CONFIG } from './WorksheetDocumentRenderer';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';

interface WorksheetStyleToolbarProps {
  themeColor: WorksheetThemeColor;
  onChangeThemeColor: (color: WorksheetThemeColor) => void;
  borderStyle: WorksheetBorderStyle;
  onChangeBorderStyle: (style: WorksheetBorderStyle) => void;
  fontStyle: WorksheetFont;
  onChangeFontStyle: (font: WorksheetFont) => void;
}

export function WorksheetStyleToolbar({
  themeColor,
  onChangeThemeColor,
  borderStyle,
  onChangeBorderStyle,
  fontStyle,
  onChangeFontStyle,
}: WorksheetStyleToolbarProps) {
  const colorOptions: { id: WorksheetThemeColor; name: string; dotClass: string }[] = [
    { id: 'navy', name: 'Navy Blue', dotClass: 'bg-blue-900' },
    { id: 'emerald', name: 'Emerald Eco', dotClass: 'bg-emerald-700' },
    { id: 'indigo', name: 'Royal Indigo', dotClass: 'bg-indigo-700' },
    { id: 'amber', name: 'Schoolhouse Amber', dotClass: 'bg-amber-600' },
    { id: 'monochrome', name: 'B&W (Print Safe)', dotClass: 'bg-slate-900' },
  ];

  const borderOptions: { id: WorksheetBorderStyle; name: string }[] = [
    { id: 'classic_frame', name: 'Academic Frame' },
    { id: 'modern_cards', name: 'Modern Cards' },
    { id: 'lined_notebook', name: 'Clean Line' },
  ];

  const fontOptions: { id: WorksheetFont; name: string }[] = [
    { id: 'sans', name: 'Clean Sans' },
    { id: 'serif', name: 'Classic Serif' },
    { id: 'handwriting', name: 'School Script' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs select-none">
      
      {/* Color Preset Selector */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wide">
          <Palette className="w-3.5 h-3.5 text-primary-600" />
          <span>Color:</span>
        </span>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {colorOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeThemeColor(opt.id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                themeColor === opt.id
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={opt.name}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${opt.dotClass}`} />
              <span className="hidden sm:inline">{opt.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Border & Frame Style Selector */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wide">
          <Frame className="w-3.5 h-3.5 text-emerald-600" />
          <span>Border:</span>
        </span>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {borderOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeBorderStyle(opt.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                borderStyle === opt.id
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selector */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wide">
          <Type className="w-3.5 h-3.5 text-indigo-600" />
          <span>Font:</span>
        </span>
        <select
          value={fontStyle}
          onChange={(e) => onChangeFontStyle(e.target.value as WorksheetFont)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 text-[11px] font-semibold focus:outline-none focus:border-primary-500"
        >
          {fontOptions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
