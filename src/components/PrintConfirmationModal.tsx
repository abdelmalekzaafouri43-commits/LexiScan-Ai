import React, { useEffect } from 'react';
import { 
  Printer, 
  X, 
  Type, 
  GraduationCap, 
  Layout, 
  CheckCircle2, 
  FileText, 
  QrCode, 
  Sparkles,
  ArrowRight,
  FileDown
} from 'lucide-react';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';
import { QRCodeSettings } from './WorksheetQRCard';

export interface PrintConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrint: () => void;
  onSavePdf?: () => void;
  topic: string;
  gradeLevel: string;
  fontStyle: WorksheetFont;
  marginType?: 'normal' | 'narrow' | 'wide';
  pageCount?: number;
  qrSettings?: QRCodeSettings;
  onChangeFont?: (font: WorksheetFont) => void;
  onChangeMargin?: (margin: 'normal' | 'narrow' | 'wide') => void;
}

export function PrintConfirmationModal({
  isOpen,
  onClose,
  onConfirmPrint,
  onSavePdf,
  topic,
  gradeLevel,
  fontStyle,
  marginType = 'normal',
  pageCount = 1,
  qrSettings,
  onChangeFont,
  onChangeMargin,
}: PrintConfirmationModalProps) {
  const fontConfig = WORKSHEET_FONTS[fontStyle] || WORKSHEET_FONTS.sans;

  // Handle keyboard events (Esc to cancel, Enter to confirm)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onConfirmPrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirmPrint]);

  if (!isOpen) return null;

  // Derive difficulty details
  const getDifficultyMeta = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes('beginner') || lower.includes('a1') || lower.includes('a2')) {
      return {
        cefr: 'CEFR A1–A2',
        label: 'Beginner',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        detail: 'Simple sentence structures, core daily vocabulary, and scaffolded fill-in-the-blank drills.'
      };
    } else if (lower.includes('intermediate') || lower.includes('b1') || lower.includes('b2')) {
      return {
        cefr: 'CEFR B1–B2',
        label: 'Intermediate',
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        detail: 'Contextual reading passages, idioms, multi-step grammar questions, and open-ended dialogue.'
      };
    } else {
      return {
        cefr: 'CEFR C1–C2',
        label: 'Advanced',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        detail: 'Nuanced discourse, academic and formal vocabulary, and analytical discussion prompts.'
      };
    }
  };

  const diffMeta = getDifficultyMeta(gradeLevel);

  const marginLabels: Record<'normal' | 'narrow' | 'wide', { name: string; specs: string }> = {
    normal: { name: 'Normal Margins', specs: '12.7 mm (48px safe padding)' },
    narrow: { name: 'Narrow Margins', specs: '8.5 mm (32px compact padding)' },
    wide: { name: 'Wide Margins', specs: '17 mm (64px spacious padding)' },
  };

  return (
    <div 
      id="print-confirmation-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-500/15 border border-primary-200 dark:border-primary-500/30 text-primary-600 dark:text-primary-400 shadow-2xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 id="confirm-dialog-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Confirm Print Settings
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Review your typography, difficulty, and A4 layout parameters before printing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cancel and close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Body: Settings Summary */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Card 1: Font & Typography */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Type className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>Selected Typography</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20">
                {fontConfig.name}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-2xs">
              <p className={`text-base text-slate-900 dark:text-white ${fontConfig.className} leading-snug font-medium`}>
                The quick brown fox jumps over the lazy dog. 1234567890
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                {fontConfig.description}
              </p>
            </div>

            {onChangeFont && (
              <div className="flex items-center justify-end gap-1.5 pt-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Quick change:</span>
                {(['sans', 'serif', 'handwriting'] as WorksheetFont[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => onChangeFont(f)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      fontStyle === f
                        ? 'bg-primary-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f === 'sans' ? 'Sans' : f === 'serif' ? 'Serif' : 'Handwriting'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Difficulty & Content Target */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Difficulty & Target Level</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diffMeta.color}`}>
                {diffMeta.label} ({diffMeta.cefr})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/40 shadow-2xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Topic / Lesson Theme:</span>
                <span className="text-slate-900 dark:text-white font-semibold truncate block mt-0.5">
                  {topic || 'General English Practice'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Target Learner Profile:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold block mt-0.5">
                  {diffMeta.label} ESL Learners
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
              {diffMeta.detail}
            </p>
          </div>

          {/* Card 3: Layout & Physical Print Specs */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Layout className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>A4 Layout & Page Configuration</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} Estimated
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/40 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Paper Format</span>
                <span className="text-slate-900 dark:text-white font-semibold block mt-0.5">A4 Portrait</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">210 × 297 mm</span>
              </div>

              <div className="bg-white dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/40 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Page Margins</span>
                <span className="text-slate-900 dark:text-white font-semibold block mt-0.5 capitalize">{marginType}</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block truncate">{marginLabels[marginType].specs}</span>
              </div>

              <div className="bg-white dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/40 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Digital QR Code</span>
                <span className="text-slate-900 dark:text-white font-semibold block mt-0.5">
                  {qrSettings?.enabled ? `Enabled (${qrSettings.position})` : 'Disabled'}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block truncate">
                  {qrSettings?.enabled ? 'Includes Audio & Quiz' : 'Paper-only layout'}
                </span>
              </div>
            </div>

            {onChangeMargin && (
              <div className="flex items-center justify-end gap-1.5 pt-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Adjust margins:</span>
                {(['normal', 'narrow', 'wide'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChangeMargin(m)}
                    className={`px-2.5 py-1 rounded-md text-[11px] capitalize font-semibold transition-colors ${
                      marginType === m
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verification Checklist */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="leading-tight font-medium">
              Worksheet formatted with exact printable contrast, page break divisions, and student response blanks.
            </span>
          </div>
        </div>

        {/* Dialog Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700 transition-colors shadow-2xs"
          >
            Back & Edit Settings
          </button>

          <div className="flex items-center gap-2">
            {onSavePdf && (
              <button
                type="button"
                onClick={onSavePdf}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800/60 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="Download worksheet directly as an A4 PDF document"
              >
                <FileDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Save as PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={onConfirmPrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Confirm & Print Now</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
