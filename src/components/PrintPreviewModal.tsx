import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { WorksheetQRCard, QRCodeSettings } from './WorksheetQRCard';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';
import { FontSelector } from './FontSelector';
import { PrintConfirmationModal } from './PrintConfirmationModal';
import { exportWorksheetToPdf } from '../utils/pdfExport';
import { WorksheetVisual } from '../types/worksheetVisuals';
import { WorksheetVisualBlock } from './WorksheetVisualBlock';

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
  visuals?: WorksheetVisual[];
}

type MarginType = 'normal' | 'narrow' | 'wide';

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
  visuals = []
}: PrintPreviewModalProps) {
  const [scale, setScale] = useState(0.85);
  const [marginType, setMarginType] = useState<MarginType>('normal');
  const [showMarginGuides, setShowMarginGuides] = useState(true);
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [isConfirmPrintOpen, setIsConfirmPrintOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgressMessage, setPdfProgressMessage] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const fontConfig = WORKSHEET_FONTS[fontStyle] || WORKSHEET_FONTS.sans;

  const handleExportPdf = async () => {
    if (isExportingPdf || !worksheetText) return;
    setIsExportingPdf(true);
    setPdfSuccess(false);
    setPdfProgressMessage('Initializing PDF engine...');

    try {
      await exportWorksheetToPdf({
        worksheetText,
        topic,
        gradeLevel,
        fontStyle,
        qrSettings,
        marginType,
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isConfirmPrintOpen) {
          setIsConfirmPrintOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirmPrintOpen, onClose]);

  if (!isOpen || !worksheetText) return null;

  // Margin definitions (in mm and corresponding tailwind padding / style)
  const marginConfig = {
    normal: { label: 'Normal (20mm / 0.8")', mm: 20, px: 75, py: 75, tailwind: 'p-[75px]' },
    narrow: { label: 'Narrow (12.7mm / 0.5")', mm: 12.7, px: 48, py: 48, tailwind: 'p-[48px]' },
    wide: { label: 'Wide (25.4mm / 1.0")', mm: 25.4, px: 96, py: 96, tailwind: 'p-[96px]' },
  };

  const activeMargin = marginConfig[marginType];

  // Pagination heuristic for A4 pages
  // An A4 sheet at 794px × 1123px with 15px font fits roughly 42-48 lines depending on padding
  const splitIntoPages = (text: string, margin: MarginType): string[] => {
    const rawLines = text.split('\n');
    const linesPerPage = margin === 'narrow' ? 48 : margin === 'wide' ? 38 : 42;

    if (rawLines.length <= linesPerPage) {
      return [text];
    }

    // Attempt intelligent splitting at section boundaries
    const pages: string[] = [];
    let currentPageLines: string[] = [];

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const isSectionHeader = /^SECTION [A-Z]:/i.test(line.trim());

      // If adding this line exceeds page capacity and we are past line 30, break here
      if (currentPageLines.length >= linesPerPage || (isSectionHeader && currentPageLines.length >= linesPerPage - 8)) {
        pages.push(currentPageLines.join('\n'));
        currentPageLines = [line];
      } else {
        currentPageLines.push(line);
      }
    }

    if (currentPageLines.length > 0) {
      pages.push(currentPageLines.join('\n'));
    }

    return pages;
  };

  const pages = splitIntoPages(worksheetText, marginType);

  const handlePrint = () => {
    setIsConfirmPrintOpen(true);
  };

  const executePrint = () => {
    setIsConfirmPrintOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div 
      id="print-preview-modal" 
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-md text-slate-900 dark:text-slate-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Controls Toolbar */}
      <header className="h-16 px-6 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 shadow-sm select-none print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                A4 Print Preview
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                  210 × 297 mm
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs font-medium">
                {topic || 'Worksheet'} • {gradeLevel}
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Page Count Indicator */}
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 hidden md:flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>{pages.length} {pages.length === 1 ? 'Page' : 'Pages'}</span>
          </div>
        </div>

        {/* Center / Layout Controls */}
        <div className="flex items-center gap-3">
          {/* Margin Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <span className="text-slate-600 dark:text-slate-400 pl-2 pr-1 font-semibold">Margins:</span>
            {(['normal', 'narrow', 'wide'] as MarginType[]).map((type) => (
              <button
                key={type}
                onClick={() => setMarginType(type)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                  marginType === type
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Toggle Margin Guides */}
          <button
            onClick={() => setShowMarginGuides(!showMarginGuides)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showMarginGuides 
                ? 'bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-500/15 dark:text-primary-300 dark:border-primary-500/30' 
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:text-slate-200'
            }`}
            title="Toggle visual margin boundary guides"
          >
            {showMarginGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Margin Guides
          </button>

          {/* Font Selector */}
          {onUpdateFontStyle && (
            <div className="hidden xl:block">
              <FontSelector value={fontStyle} onChange={onUpdateFontStyle} variant="compact" />
            </div>
          )}

          {/* Toggle QR Code on Sheet */}
          {qrSettings && onUpdateQrSettings && (
            <button
              onClick={() => onUpdateQrSettings({ ...qrSettings, enabled: !qrSettings.enabled })}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                qrSettings.enabled 
                  ? 'bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-500/15 dark:text-primary-300 dark:border-primary-500/30' 
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:text-slate-200'
              }`}
              title="Toggle printed QR code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code: {qrSettings.enabled ? 'On' : 'Off'}</span>
            </button>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 p-0.5 text-xs">
            <button
              onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-slate-800 dark:text-slate-300 min-w-[48px] text-center font-semibold">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(2))))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setScale(0.85)}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 border-l border-slate-200 dark:border-slate-700 rounded-r-lg transition-colors font-medium"
              title="Reset Zoom"
            >
              Fit
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {onDownloadTxt && (
            <button
              onClick={onDownloadTxt}
              disabled={isExportingPdf}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 transition-colors shadow-2xs disabled:opacity-50"
              title="Download plain text file"
            >
              <Download className="w-3.5 h-3.5" />
              Download TXT
            </button>
          )}

          {/* Client-Side Export PDF using jsPDF */}
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              pdfSuccess
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 shadow-2xs hover:scale-[1.02] active:scale-[0.98]'
            } disabled:opacity-50`}
            title="Export and save worksheet locally as an A4 PDF document"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-600 dark:text-rose-400" />
            ) : pdfSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <FileDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
            <span>{isExportingPdf ? 'Exporting...' : pdfSuccess ? 'PDF Saved!' : 'Save PDF'}</span>
          </button>

          {/* Browser Print / Physical Print */}
          <button
            onClick={handlePrint}
            disabled={isExportingPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            title="Open browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors ml-1"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Stage */}
      <main className="flex-1 overflow-auto p-8 lg:p-12 flex flex-col items-center gap-12 bg-slate-200/70 dark:bg-slate-950/70 print:p-0 print:m-0 print:bg-white">
        {pages.map((pageText, pageIndex) => (
          <div key={pageIndex} className="flex flex-col items-center">
            {/* Page header tag */}
            <div className="w-[794px] max-w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2 px-2 print:hidden select-none"
                 style={{ width: `${794 * scale}px` }}>
              <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-300">
                <FileText className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                Sheet {pageIndex + 1} of {pages.length} (A4 Standard)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                Safe Printable Area • {activeMargin.label}
              </span>
            </div>

            {/* Simulated A4 Paper Canvas */}
            <div 
              className="print-page-sheet relative bg-white text-slate-900 rounded-none shadow-xl shadow-slate-400/40 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-slate-300/80 dark:border-slate-800 select-text overflow-hidden transition-all duration-150 print:shadow-none print:border-none print:m-0 print:transform-none"
              style={{
                width: '794px',
                height: '1123px', // Exactly A4 210mm x 297mm at 96 DPI
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                marginBottom: scale < 1 ? `-${1123 * (1 - scale)}px` : `${1123 * (scale - 1)}px`
              }}
            >
              {/* Optional Visual Margin Guides Overlay */}
              {showMarginGuides && (
                <div 
                  className="absolute pointer-events-none print:hidden border border-dashed border-sky-400/60 bg-sky-500/[0.02]"
                  style={{
                    top: `${activeMargin.py}px`,
                    left: `${activeMargin.px}px`,
                    right: `${activeMargin.px}px`,
                    bottom: `${activeMargin.py}px`,
                  }}
                >
                  {/* Margin dimension labels */}
                  <span className="absolute -top-5 left-2 text-[10px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    Top Margin: {activeMargin.mm}mm
                  </span>
                  <span className="absolute -bottom-5 left-2 text-[10px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    Bottom Margin: {activeMargin.mm}mm
                  </span>
                  <span className="absolute top-2 -left-3 -rotate-90 origin-top-left text-[10px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    Left: {activeMargin.mm}mm
                  </span>
                  <span className="absolute top-2 -right-3 rotate-90 origin-top-right text-[10px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    Right: {activeMargin.mm}mm
                  </span>
                </div>
              )}

              {/* Sheet Content Inner Area */}
              <div 
                className="h-full flex flex-col justify-between"
                style={{
                  paddingTop: `${activeMargin.py}px`,
                  paddingBottom: `${activeMargin.py}px`,
                  paddingLeft: `${activeMargin.px}px`,
                  paddingRight: `${activeMargin.px}px`,
                }}
              >
                {/* Header info in print */}
                <div className="pb-3 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <span>LexiScan AI • ESL Worksheet Series</span>
                  <span>CEFR: {gradeLevel.toUpperCase()}</span>
                </div>

                {/* Worksheet Text Body */}
                <div className="flex-1 py-4 overflow-hidden relative">
                  {qrSettings?.enabled && qrSettings.position === 'header' && pageIndex === 0 && (
                    <div className="float-right ml-4 mb-3">
                      <WorksheetQRCard settings={qrSettings} variant="header" topic={topic} />
                    </div>
                  )}

                  {/* Render Visuals on Page 1 if present */}
                  {pageIndex === 0 && visuals.length > 0 && (
                    <div className="mb-4">
                      {visuals.map((visual, idx) => (
                        <WorksheetVisualBlock
                          key={visual.id || idx}
                          visual={visual}
                          isEditable={false}
                        />
                      ))}
                    </div>
                  )}

                  <pre className={`text-slate-900 whitespace-pre-wrap ${fontConfig.className} ${fontConfig.textClass}`}>
                    {pageText}
                  </pre>

                  {qrSettings?.enabled && qrSettings.position === 'footer' && pageIndex === pages.length - 1 && (
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <WorksheetQRCard settings={qrSettings} variant="footer" topic={topic} />
                    </div>
                  )}
                </div>

                {/* Page Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span>Topic: {topic || 'English Study Material'}</span>
                  <span>Page {pageIndex + 1} of {pages.length}</span>
                </div>
              </div>
            </div>

            {/* Clear Page Break Visual Divider between pages */}
            {showPageBreaks && pageIndex < pages.length - 1 && (
              <div 
                className="w-full max-w-[794px] my-6 flex items-center gap-3 print:hidden select-none"
                style={{ width: `${794 * scale}px` }}
              >
                <div className="flex-1 border-t-2 border-dashed border-amber-400/60" />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-2xs">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>A4 Physical Page Break (Page {pageIndex + 1} Ends)</span>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-amber-400/60" />
              </div>
            )}
          </div>
        ))}
      </main>

      {/* User Confirmation Dialog before triggering Print */}
      <PrintConfirmationModal
        isOpen={isConfirmPrintOpen}
        onClose={() => setIsConfirmPrintOpen(false)}
        onConfirmPrint={executePrint}
        onSavePdf={() => {
          setIsConfirmPrintOpen(false);
          handleExportPdf();
        }}
        topic={topic}
        gradeLevel={gradeLevel}
        fontStyle={fontStyle}
        marginType={marginType}
        pageCount={pages.length}
        qrSettings={qrSettings}
        onChangeFont={onUpdateFontStyle}
        onChangeMargin={setMarginType}
      />

      {/* Floating Status Notification for PDF Export */}
      {pdfProgressMessage && (
        <div 
          id="pdf-export-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3"
        >
          {isExportingPdf && <Loader2 className="w-4 h-4 animate-spin text-rose-400" />}
          {pdfSuccess && <Check className="w-4 h-4 text-emerald-400" />}
          <span className="text-slate-200">{pdfProgressMessage}</span>
        </div>
      )}
    </div>
  );
}
