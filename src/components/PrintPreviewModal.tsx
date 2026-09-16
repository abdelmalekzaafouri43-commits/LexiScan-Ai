import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  EyeOff, 
  Download, 
  FileText, 
  Scissors, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  QrCode,
  FileDown,
  Loader2,
  Check,
  Palette,
  Frame,
  Type,
  LayoutGrid,
  Columns,
  Sparkles,
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize,
  Minimize,
  RefreshCw,
  Droplets,
  BookOpen
} from 'lucide-react';
import { WorksheetQRCard, QRCodeSettings } from './WorksheetQRCard';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';
import { exportWorksheetToPdf, splitWorksheetIntoPages } from '../utils/pdfExport';
import { WorksheetVisual } from '../types/worksheetVisuals';
import { WorksheetVisualBlock } from './WorksheetVisualBlock';
import { WorksheetDocumentRenderer, WorksheetThemeColor, WorksheetBorderStyle, THEME_COLOR_CONFIG } from './WorksheetDocumentRenderer';

export type PaperFormat = 'a4' | 'letter';
export type PaperOrientation = 'portrait' | 'landscape';
export type MarginType = 'normal' | 'narrow' | 'wide' | 'minimal';
export type PreviewLayoutView = 'single' | 'spread' | 'continuous';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  worksheetText: string;
  topic: string;
  gradeLevel: string;
  onDownloadTxt?: () => void;
  qrSettings?: QRCodeSettings;
  onUpdateQrSettings?: (settings: QRCodeSettings) => void;
  fontStyle?: WorksheetFont;
  onUpdateFontStyle?: (font: WorksheetFont) => void;
  themeColor?: WorksheetThemeColor;
  onUpdateThemeColor?: (color: WorksheetThemeColor) => void;
  borderStyle?: WorksheetBorderStyle;
  onUpdateBorderStyle?: (style: WorksheetBorderStyle) => void;
  visuals?: WorksheetVisual[];
}

export function PrintPreviewModal({
  isOpen,
  onClose,
  worksheetText,
  topic,
  gradeLevel,
  onDownloadTxt,
  qrSettings,
  onUpdateQrSettings,
  fontStyle = 'sans',
  onUpdateFontStyle,
  themeColor = 'navy',
  onUpdateThemeColor,
  borderStyle = 'classic_frame',
  onUpdateBorderStyle,
  visuals = []
}: PrintPreviewModalProps) {
  // Modal Navigation & Paper Display State
  const [scale, setScale] = useState(0.85);
  const [paperFormat, setPaperFormat] = useState<PaperFormat>('a4');
  const [orientation, setOrientation] = useState<PaperOrientation>('portrait');
  const [marginType, setMarginType] = useState<MarginType>('normal');
  const [layoutView, setLayoutView] = useState<PreviewLayoutView>('continuous');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showMarginGuides, setShowMarginGuides] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showTeacherGuide, setShowTeacherGuide] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // PDF Export & Print states
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgressMessage, setPdfProgressMessage] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [printSuccessToast, setPrintSuccessToast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fontConfig = WORKSHEET_FONTS[fontStyle] || WORKSHEET_FONTS.sans;

  // Split worksheet text into realistic paper pages
  const pages = React.useMemo(() => {
    return splitWorksheetIntoPages(worksheetText, marginType === 'minimal' ? 'narrow' : marginType);
  }, [worksheetText, marginType]);

  // Adjust active page index if pages change
  useEffect(() => {
    if (currentPageIndex >= pages.length) {
      setCurrentPageIndex(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPageIndex]);

  // Dimension calculations for A4 vs Letter in CSS standard 96 DPI
  const paperDimensions = React.useMemo(() => {
    if (paperFormat === 'a4') {
      return orientation === 'portrait' 
        ? { width: 794, height: 1123, label: 'A4 (210 × 297 mm)', cssW: '210mm', cssH: '297mm' }
        : { width: 1123, height: 794, label: 'A4 Landscape (297 × 210 mm)', cssW: '297mm', cssH: '210mm' };
    } else {
      // US Letter (8.5 x 11 inches)
      return orientation === 'portrait'
        ? { width: 816, height: 1056, label: 'US Letter (8.5 × 11 in)', cssW: '8.5in', cssH: '11in' }
        : { width: 1056, height: 816, label: 'US Letter Landscape (11 × 8.5 in)', cssW: '11in', cssH: '8.5in' };
    }
  }, [paperFormat, orientation]);

  const marginOptions: { id: MarginType; label: string; inset: string; px: number }[] = [
    { id: 'normal', label: 'Normal (20 mm / 0.75 in)', inset: '20mm', px: 75 },
    { id: 'narrow', label: 'Narrow (12.7 mm / 0.5 in)', inset: '12.7mm', px: 48 },
    { id: 'wide', label: 'Wide (25.4 mm / 1.0 in)', inset: '25.4mm', px: 96 },
    { id: 'minimal', label: 'Minimal (6 mm / 0.25 in)', inset: '6mm', px: 24 },
  ];

  const colorThemes: { id: WorksheetThemeColor; label: string; dotClass: string; desc: string }[] = [
    { id: 'navy', label: 'Classic Navy', dotClass: 'bg-blue-900', desc: 'Scholastic deep blue' },
    { id: 'emerald', label: 'Forest Emerald', dotClass: 'bg-emerald-700', desc: 'Eco & science green' },
    { id: 'indigo', label: 'Royal Indigo', dotClass: 'bg-indigo-700', desc: 'Modern academic indigo' },
    { id: 'amber', label: 'Schoolhouse Amber', dotClass: 'bg-amber-600', desc: 'Warm classroom tone' },
    { id: 'monochrome', label: 'Black & White (Print Master)', dotClass: 'bg-slate-950', desc: 'Eco photocopy & toner saver' },
  ];

  const borderStyles: { id: WorksheetBorderStyle; label: string }[] = [
    { id: 'classic_frame', label: 'Academic Double Frame' },
    { id: 'modern_cards', label: 'Modern Activity Cards' },
    { id: 'lined_notebook', label: 'Clean Notebook Line' },
  ];

  // Fit to screen helper
  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const availableHeight = window.innerHeight - 180;
    const calculatedScale = Math.min(1.1, Math.max(0.45, availableHeight / paperDimensions.height));
    setScale(Number(calculatedScale.toFixed(2)));
  };

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleExecutePrint();
      } else if (e.key === '+' || e.key === '=') {
        setScale(s => Math.min(1.5, Number((s + 0.1).toFixed(2))));
      } else if (e.key === '-' || e.key === '_') {
        setScale(s => Math.max(0.4, Number((s - 0.1).toFixed(2))));
      } else if (e.key === '0') {
        handleFitToScreen();
      } else if (e.key === 'ArrowRight' && layoutView === 'single') {
        setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' && layoutView === 'single') {
        setCurrentPageIndex(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, layoutView, pages.length]);

  // Direct Execution of Native Print Dialog
  const handleExecutePrint = () => {
    setPrintSuccessToast(true);
    setTimeout(() => setPrintSuccessToast(false), 4000);
    window.print();
  };

  // PDF Export
  const handleExportPdf = async () => {
    if (isExportingPdf || !worksheetText) return;
    setIsExportingPdf(true);
    setPdfSuccess(false);
    setPdfProgressMessage('Rendering print vectors...');

    try {
      await exportWorksheetToPdf({
        worksheetText,
        topic,
        gradeLevel,
        fontStyle,
        qrSettings,
        marginType: marginType === 'minimal' ? 'narrow' : marginType,
        onProgress: (prog) => {
          setPdfProgressMessage(prog.step);
        }
      });
      setPdfSuccess(true);
      setTimeout(() => {
        setPdfSuccess(false);
        setPdfProgressMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setPdfProgressMessage('Export failed. Please try again.');
      setTimeout(() => setPdfProgressMessage(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="print-preview-modal"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md text-white select-none animate-in fade-in duration-200"
    >
      {/* ========================================================= */}
      {/* 1. TOP DEDICATED PRINT STUDIO NAVIGATION & CONTROL BAR   */}
      {/* ========================================================= */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 shadow-xl print:hidden z-20">
        
        {/* Left Info: Document Name & Page Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {topic || 'English Curriculum Worksheet'}
              </h2>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{pages.length} {pages.length === 1 ? 'Page' : 'Pages'} ({paperFormat.toUpperCase()})</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              Dedicated Paper Simulator • True-to-scale vector print fidelity
            </p>
          </div>
        </div>

        {/* Center: View Layout Modes & Pagination */}
        <div className="hidden md:flex items-center gap-3 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
          {/* View Modes */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-800 text-xs">
            <button
              onClick={() => setLayoutView('continuous')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-all ${
                layoutView === 'continuous' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Continuous Vertical Page Scroll"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[11px]">Continuous</span>
            </button>
            <button
              onClick={() => setLayoutView('single')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-all ${
                layoutView === 'single' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Single Page Presentation"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[11px]">Single</span>
            </button>
            {pages.length > 1 && (
              <button
                onClick={() => setLayoutView('spread')}
                className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-all ${
                  layoutView === 'spread' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
                }`}
                title="2-Page Book Spread"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="text-[11px]">Book Spread</span>
              </button>
            )}
          </div>

          {/* Page Navigator when in Single View */}
          {layoutView === 'single' && pages.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <button
                onClick={() => setCurrentPageIndex(p => Math.max(0, p - 1))}
                disabled={currentPageIndex === 0}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Previous Page (Left Arrow)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] font-bold">
                Page {currentPageIndex + 1} / {pages.length}
              </span>
              <button
                onClick={() => setCurrentPageIndex(p => Math.min(pages.length - 1, p + 1))}
                disabled={currentPageIndex === pages.length - 1}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Next Page (Right Arrow)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Zoom Zoom Controls */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setScale(s => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zoom out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-300 w-11 text-center text-[11px]">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(1.5, Number((s + 0.1).toFixed(2))))}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitToScreen}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
              title="Fit to Page Height (0)"
            >
              Fit
            </button>
          </div>
        </div>

        {/* Right Actions: Print, PDF, Inspector & Close */}
        <div className="flex items-center gap-2">
          {/* Pre-flight Inspector Button */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showInspector 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Toggle Print Pre-Flight Inspector & Tips"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline text-[11px]">Print Inspector</span>
          </button>

          {/* TXT Download */}
          {onDownloadTxt && (
            <button
              onClick={onDownloadTxt}
              className="hidden sm:flex px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold items-center gap-1.5 transition-colors border border-slate-700"
              title="Download clean plain text"
            >
              <Download className="w-3.5 h-3.5" />
              <span>TXT</span>
            </button>
          )}

          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition-all disabled:opacity-50"
            title="Export local A4 PDF file"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : pdfSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isExportingPdf ? 'Exporting...' : 'Save PDF'}</span>
          </button>

          {/* Direct Print Button */}
          <button
            onClick={handleExecutePrint}
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
            title="Open system print dialog (Ctrl+P)"
          >
            <Printer className="w-4 h-4" />
            <span>Print Worksheet</span>
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Exit Print Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. SUB-BAR: LIVE PRE-PRINT FORMAT & STYLING CONTROLS     */}
      {/* ========================================================= */}
      <div className="h-12 px-4 sm:px-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto text-xs shrink-0 select-none print:hidden">
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* Paper Format Selector (A4 vs Letter) */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase">Format:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setPaperFormat('a4')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  paperFormat === 'a4' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A4
              </button>
              <button
                onClick={() => setPaperFormat('letter')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  paperFormat === 'letter' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Letter
              </button>
            </div>
          </div>

          {/* Margins Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase">Margins:</span>
            <select
              value={marginType}
              onChange={(e) => setMarginType(e.target.value as MarginType)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold focus:outline-none"
            >
              {marginOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label.split(' ')[0]} ({opt.inset})
                </option>
              ))}
            </select>
          </div>

          {/* Color Palette Swatches */}
          {onUpdateThemeColor && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <Palette className="w-3.5 h-3.5 text-primary-400" />
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {colorThemes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateThemeColor(t.id)}
                    className={`p-1 rounded-md transition-all ${
                      themeColor === t.id ? 'bg-slate-800 ring-2 ring-primary-500 shadow-2xs' : 'hover:bg-slate-800/60 opacity-80 hover:opacity-100'
                    }`}
                    title={`${t.label} - ${t.desc}`}
                  >
                    <span className={`w-3 h-3 rounded-full block ${t.dotClass}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Border Frame Selector */}
          {onUpdateBorderStyle && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <Frame className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={borderStyle}
                onChange={(e) => onUpdateBorderStyle(e.target.value as WorksheetBorderStyle)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-semibold focus:outline-none"
              >
                {borderStyles.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Typography Selector */}
          {onUpdateFontStyle && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={fontStyle}
                onChange={(e) => onUpdateFontStyle(e.target.value as WorksheetFont)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-semibold focus:outline-none"
              >
                <option value="sans">Clean Sans</option>
                <option value="serif">Classic Serif</option>
                <option value="handwriting">School Script</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Toggle Aids */}
        <div className="flex items-center gap-3">
          {/* Toggle Margin Boundary Guides */}
          <button
            onClick={() => setShowMarginGuides(!showMarginGuides)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              showMarginGuides
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Show printable boundary guides on the canvas"
          >
            {showMarginGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[11px]">Margin Guides</span>
          </button>

          {/* Teacher Guide Edition Toggle */}
          <button
            onClick={() => setShowTeacherGuide(!showTeacherGuide)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              showTeacherGuide
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Teacher Edition Header Badge"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[11px]">Teacher Header</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN DRAFTING CANVAS & PRE-FLIGHT INSPECTOR PANEL     */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Paper Scroll Stage */}
        <main 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-start gap-10 bg-slate-950/60 print:bg-white print:p-0 print:m-0 print:overflow-visible print:block relative"
        >
          {/* Active Layout Rendering */}
          {layoutView === 'spread' && pages.length > 1 ? (
            /* 2-Page Book Spread View */
            <div 
              className="flex flex-wrap items-start justify-center gap-8 print:block"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
              {pages.slice(0, 2).map((pageText, idx) => (
                <div 
                  key={idx}
                  className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300 relative print-page-sheet overflow-hidden"
                  style={{
                    width: `${paperDimensions.width}px`,
                    minHeight: `${paperDimensions.height}px`,
                  }}
                >
                  {/* Visual Margin Safety Guides Overlay */}
                  {showMarginGuides && (
                    <div 
                      className="absolute pointer-events-none border-2 border-dashed border-cyan-500/60 z-30"
                      style={{
                        top: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                        bottom: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                        left: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                        right: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                      }}
                    >
                      <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-cyan-600 text-white font-mono text-[9px] font-bold">
                        Printable Area ({marginType})
                      </span>
                    </div>
                  )}

                  <WorksheetDocumentRenderer 
                    worksheetText={pageText}
                    topic={topic}
                    gradeLevel={gradeLevel}
                    fontStyle={fontStyle}
                    themeColor={themeColor}
                    borderStyle={borderStyle}
                    qrSettings={qrSettings}
                    visuals={idx === 0 ? visuals : []}
                    isPrintMode={true}
                    pageNumber={idx + 1}
                    totalPages={pages.length}
                    showTeacherGuide={showTeacherGuide}
                    paperFormat={paperFormat}
                  />
                </div>
              ))}
            </div>
          ) : layoutView === 'single' ? (
            /* Single Page View */
            <div 
              className="flex flex-col items-center"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
              <div 
                className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300 relative print-page-sheet overflow-hidden"
                style={{
                  width: `${paperDimensions.width}px`,
                  minHeight: `${paperDimensions.height}px`,
                }}
              >
                {/* Visual Margin Safety Guides Overlay */}
                {showMarginGuides && (
                  <div 
                    className="absolute pointer-events-none border-2 border-dashed border-cyan-500/60 z-30"
                    style={{
                      top: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                      bottom: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                      left: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                      right: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                    }}
                  >
                    <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-cyan-600 text-white font-mono text-[9px] font-bold">
                      Printable Area ({marginType})
                    </span>
                  </div>
                )}

                <WorksheetDocumentRenderer 
                  worksheetText={pages[currentPageIndex] || worksheetText}
                  topic={topic}
                  gradeLevel={gradeLevel}
                  fontStyle={fontStyle}
                  themeColor={themeColor}
                  borderStyle={borderStyle}
                  qrSettings={qrSettings}
                  visuals={currentPageIndex === 0 ? visuals : []}
                  isPrintMode={true}
                  pageNumber={currentPageIndex + 1}
                  totalPages={pages.length}
                  showTeacherGuide={showTeacherGuide}
                  paperFormat={paperFormat}
                />
              </div>
            </div>
          ) : (
            /* Continuous Vertical Stream View */
            <div 
              className="flex flex-col items-center gap-8 w-full"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
              {pages.map((pageText, pIdx) => (
                <React.Fragment key={pIdx}>
                  <div 
                    className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300 relative print-page-sheet overflow-hidden shrink-0"
                    style={{
                      width: `${paperDimensions.width}px`,
                      minHeight: `${paperDimensions.height}px`,
                    }}
                  >
                    {/* Visual Margin Safety Guides Overlay */}
                    {showMarginGuides && (
                      <div 
                        className="absolute pointer-events-none border-2 border-dashed border-cyan-500/60 z-30"
                        style={{
                          top: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                          bottom: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                          left: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                          right: `${marginOptions.find(m => m.id === marginType)?.px || 75}px`,
                        }}
                      >
                        <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-cyan-600 text-white font-mono text-[9px] font-bold">
                          Printable Area ({marginType})
                        </span>
                      </div>
                    )}

                    <WorksheetDocumentRenderer 
                      worksheetText={pageText}
                      topic={topic}
                      gradeLevel={gradeLevel}
                      fontStyle={fontStyle}
                      themeColor={themeColor}
                      borderStyle={borderStyle}
                      qrSettings={qrSettings}
                      visuals={pIdx === 0 ? visuals : []}
                      isPrintMode={true}
                      pageNumber={pIdx + 1}
                      totalPages={pages.length}
                      showTeacherGuide={showTeacherGuide}
                      paperFormat={paperFormat}
                    />
                  </div>

                  {/* Physical Page Break Line between pages */}
                  {pIdx < pages.length - 1 && (
                    <div 
                      className="w-full flex items-center gap-3 my-2 print:hidden select-none"
                      style={{ width: `${paperDimensions.width}px` }}
                    >
                      <div className="flex-1 border-t-2 border-dashed border-amber-400/60" />
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md">
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Physical Page Break • End of Page {pIdx + 1}</span>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-amber-400/60" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* 4. PRE-FLIGHT INSPECTOR & PRINT ADVISORY SIDEBAR          */}
        {/* ========================================================= */}
        {showInspector && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 p-5 overflow-y-auto flex flex-col gap-5 shrink-0 z-20 print:hidden animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Pre-Flight Print Check</h3>
              </div>
              <button 
                onClick={() => setShowInspector(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Print Readiness Checks */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Document Readiness Checklist
              </span>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Page Boundary Safety</span>
                  <span className="text-slate-400 text-[11px]">
                    Formatted into {pages.length} clean {pages.length === 1 ? 'page' : 'pages'} with zero clipping.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Contrast & Legibility</span>
                  <span className="text-slate-400 text-[11px]">
                    Passes WCAG AA for sharp photocopier & laser printer reproduction.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Student Credentials</span>
                  <span className="text-slate-400 text-[11px]">
                    Name, Class, Date, and Score boxes ready for handwriting.
                  </span>
                </div>
              </div>
            </div>

            {/* Browser Print Dialog Tips */}
            <div className="p-4 rounded-xl bg-primary-950/40 border border-primary-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-primary-300 font-bold text-xs">
                <Info className="w-4 h-4" />
                <span>Browser Print Dialog Settings</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong className="text-white">Background Graphics:</strong> Check <em>"ON"</em> to print colored headers & badge cards.</li>
                <li><strong className="text-white">Headers & Footers:</strong> Uncheck to hide browser URLs and dates.</li>
                <li><strong className="text-white">Destination:</strong> Choose your printer or <em>"Save as PDF"</em>.</li>
              </ul>
            </div>

            {/* Quick Toner Saver Switch */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-xs text-white">Eco Toner Saver Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Switch to high-contrast monochrome mode to maximize toner conservation during high-volume classroom printing.
              </p>
              <button
                type="button"
                onClick={() => onUpdateThemeColor && onUpdateThemeColor('monochrome')}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                Apply B&W Print Master
              </button>
            </div>

            {/* Launch Print Button in Inspector */}
            <button
              onClick={handleExecutePrint}
              className="w-full mt-auto py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now (Ctrl+P)</span>
            </button>
          </aside>
        )}
      </div>

      {/* Notification Toast when Print triggered */}
      {printSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-primary-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 print:hidden">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center">
            <Printer className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">System Print Dialog Opened</h4>
            <p className="text-[11px] text-slate-400">
              Ensure "Background Graphics" is enabled for crisp borders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
