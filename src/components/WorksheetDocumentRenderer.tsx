import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  PenTool, 
  Lightbulb, 
  Layers, 
  Sparkles,
  ArrowRight,
  Split,
  MessageSquare
} from 'lucide-react';
import { parseWorksheetText, WorksheetDocument, WorksheetSection, WorksheetQuestion } from '../utils/worksheetParser';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';
import { WorksheetVisual } from '../types/worksheetVisuals';
import { WorksheetVisualBlock } from './WorksheetVisualBlock';
import { WorksheetQRCard, QRCodeSettings } from './WorksheetQRCard';

export type WorksheetThemeColor = 'navy' | 'emerald' | 'indigo' | 'amber' | 'monochrome';
export type WorksheetBorderStyle = 'classic_frame' | 'modern_cards' | 'lined_notebook';

export interface WorksheetDocumentRendererProps {
  worksheetText: string;
  topic?: string;
  gradeLevel?: string;
  fontStyle?: WorksheetFont;
  themeColor?: WorksheetThemeColor;
  borderStyle?: WorksheetBorderStyle;
  qrSettings?: QRCodeSettings;
  visuals?: WorksheetVisual[];
  isPrintMode?: boolean;
  pageNumber?: number;
  totalPages?: number;
  showTeacherGuide?: boolean;
  paperFormat?: 'a4' | 'letter';
  marginSize?: 'compact' | 'normal' | 'spacious';
}

export const THEME_COLOR_CONFIG: Record<WorksheetThemeColor, {
  name: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  accentBg: string;
  headerBorder: string;
  pillBorder: string;
  wordBankBg: string;
  wordBankBorder: string;
  wordBankText: string;
  highlightText: string;
  bracketBorder: string;
  cardBg: string;
  cardBorder: string;
  cardHeaderBg: string;
}> = {
  navy: {
    name: 'Classic Navy',
    badgeBg: 'bg-blue-900',
    badgeText: 'text-white',
    accentBorder: 'border-blue-900',
    accentBg: 'bg-blue-50/60',
    headerBorder: 'border-blue-900',
    pillBorder: 'border-blue-300',
    wordBankBg: 'bg-blue-50/80',
    wordBankBorder: 'border-blue-400',
    wordBankText: 'text-blue-950',
    highlightText: 'text-blue-900',
    bracketBorder: 'border-blue-400',
    cardBg: 'bg-blue-50/10',
    cardBorder: 'border-blue-100',
    cardHeaderBg: 'bg-blue-50/40',
  },
  emerald: {
    name: 'Forest Emerald',
    badgeBg: 'bg-emerald-800',
    badgeText: 'text-white',
    accentBorder: 'border-emerald-800',
    accentBg: 'bg-emerald-50/60',
    headerBorder: 'border-emerald-800',
    pillBorder: 'border-emerald-300',
    wordBankBg: 'bg-emerald-50/80',
    wordBankBorder: 'border-emerald-400',
    wordBankText: 'text-emerald-950',
    highlightText: 'text-emerald-900',
    bracketBorder: 'border-emerald-400',
    cardBg: 'bg-emerald-50/10',
    cardBorder: 'border-emerald-100',
    cardHeaderBg: 'bg-emerald-50/40',
  },
  indigo: {
    name: 'Royal Indigo',
    badgeBg: 'bg-indigo-900',
    badgeText: 'text-white',
    accentBorder: 'border-indigo-900',
    accentBg: 'bg-indigo-50/60',
    headerBorder: 'border-indigo-900',
    pillBorder: 'border-indigo-300',
    wordBankBg: 'bg-indigo-50/80',
    wordBankBorder: 'border-indigo-400',
    wordBankText: 'text-indigo-950',
    highlightText: 'text-indigo-900',
    bracketBorder: 'border-indigo-400',
    cardBg: 'bg-indigo-50/10',
    cardBorder: 'border-indigo-100',
    cardHeaderBg: 'bg-indigo-50/40',
  },
  amber: {
    name: 'Schoolhouse Amber',
    badgeBg: 'bg-amber-800',
    badgeText: 'text-white',
    accentBorder: 'border-amber-800',
    accentBg: 'bg-amber-50/60',
    headerBorder: 'border-amber-800',
    pillBorder: 'border-amber-300',
    wordBankBg: 'bg-amber-50/80',
    wordBankBorder: 'border-amber-400',
    wordBankText: 'text-amber-950',
    highlightText: 'text-amber-900',
    bracketBorder: 'border-amber-400',
    cardBg: 'bg-amber-50/10',
    cardBorder: 'border-amber-100',
    cardHeaderBg: 'bg-amber-50/40',
  },
  monochrome: {
    name: 'Black & White (Print Master)',
    badgeBg: 'bg-slate-900',
    badgeText: 'text-white',
    accentBorder: 'border-slate-900',
    accentBg: 'bg-slate-50',
    headerBorder: 'border-slate-900',
    pillBorder: 'border-slate-400',
    wordBankBg: 'bg-slate-100',
    wordBankBorder: 'border-slate-800',
    wordBankText: 'text-slate-950',
    highlightText: 'text-slate-900',
    bracketBorder: 'border-slate-700',
    cardBg: 'bg-slate-50/10',
    cardBorder: 'border-slate-300',
    cardHeaderBg: 'bg-slate-100/40',
  }
};

export function WorksheetDocumentRenderer({
  worksheetText,
  topic = '',
  gradeLevel = '',
  fontStyle = 'sans',
  themeColor = 'navy',
  borderStyle = 'classic_frame',
  qrSettings,
  visuals = [],
  isPrintMode = false,
  pageNumber,
  totalPages,
  showTeacherGuide = false,
  paperFormat = 'a4',
  marginSize = 'normal',
}: WorksheetDocumentRendererProps) {
  const parsedDoc: WorksheetDocument = React.useMemo(() => {
    return parseWorksheetText(worksheetText);
  }, [worksheetText]);

  const fontConfig = WORKSHEET_FONTS[fontStyle] || WORKSHEET_FONTS.sans;
  const colors = THEME_COLOR_CONFIG[themeColor] || THEME_COLOR_CONFIG.navy;

  const paddingClass = 
    marginSize === 'compact' 
      ? 'p-4 sm:p-6' 
      : marginSize === 'spacious' 
      ? 'p-10 sm:p-14' 
      : 'p-8 sm:p-10';

  const displayTopic = (topic || parsedDoc.topic || 'English Language Worksheet').trim();
  const displayLevel = (gradeLevel || parsedDoc.level || 'All Levels').trim();

  // Helper to render question text with styled underline words, brackets, or blanks
  const renderStyledContent = (content: string) => {
    // Check for Word Bank block
    const wordBankMatch = content.match(/Word Bank:\s*\[(.*?)\]/i);
    if (wordBankMatch) {
      const words = wordBankMatch[1].split('|').map(w => w.trim()).filter(Boolean);
      return (
        <div className="my-2.5 p-2.5 rounded-lg border-2 border-dashed bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center gap-2 text-xs font-semibold"
             style={{ borderColor: themeColor === 'monochrome' ? '#334155' : undefined }}>
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.badgeBg} ${colors.badgeText}`}>
            Word Bank
          </span>
          <div className="flex flex-wrap gap-1.5 items-center">
            {words.map((w, idx) => (
              <span 
                key={idx} 
                className={`px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border ${colors.pillBorder} text-slate-900 font-bold text-xs shadow-2xs`}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Check for Matching Item: [   ] 1. Term       A. Definition
    const matchingMatch = content.match(/^\[(.*?)\]\s*(\d+\.)\s*(.*?)\s{3,}([A-Z]\..*)$/);
    if (matchingMatch) {
      const [, bracketVal, num, leftTerm, rightDef] = matchingMatch;
      return (
        <div className="flex items-center justify-between gap-4 py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors border-b border-dotted border-slate-200">
          <div className="flex items-center gap-3 flex-1">
            <span className={`inline-flex items-center justify-center w-8 h-7 rounded border-2 ${colors.bracketBorder} bg-white text-xs font-mono font-bold text-slate-800 text-center`}>
              {bracketVal.trim() || ' '}
            </span>
            <span className="font-bold text-slate-900 text-xs min-w-[20px]">{num}</span>
            <span className="font-semibold text-slate-900 text-xs">{leftTerm.trim()}</span>
          </div>
          <div className="text-slate-400 text-xs select-none">┈┈┈┈┈┈┈►</div>
          <div className="flex-1 text-slate-800 text-xs font-medium pl-2">
            {rightDef.trim()}
          </div>
        </div>
      );
    }

    // Check for Underlined Word Reference Question: e.g. "What does the underlined word..."
    if (/underlined/i.test(content) || /refers? to/i.test(content)) {
      return (
        <div className="my-1.5 p-2.5 rounded-lg bg-amber-50/50 border border-amber-300 text-xs text-slate-900">
          <div className="font-bold flex items-center gap-1.5 text-amber-950 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Reference & Meaning Inquiry:</span>
          </div>
          <div className="font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </div>
      );
    }

    // Check for "If you were..." Hypothetical question
    if (/^If you were/i.test(content) || /what would you do/i.test(content)) {
      return (
        <div className="my-2 p-3 rounded-lg border-2 border-indigo-200 bg-indigo-50/40 text-xs text-slate-900">
          <div className="font-bold flex items-center gap-1.5 text-indigo-950 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-700" />
            <span className="uppercase tracking-wider text-[11px]">Hypothetical Scenario / Reflection:</span>
          </div>
          <p className="font-semibold text-slate-900 mb-2 leading-relaxed">{content}</p>
          <div className="space-y-2 pt-1">
            <div className="w-full border-b border-slate-400 border-dashed h-4" />
            <div className="w-full border-b border-slate-400 border-dashed h-4" />
            <div className="w-full border-b border-slate-400 border-dashed h-4" />
          </div>
        </div>
      );
    }

    // Standard question / sentence with blanks (e.g. "_____")
    return (
      <div className="text-xs text-slate-900 leading-relaxed font-medium py-1">
        {content.split('\n').map((line, lIdx) => {
          // Highlight blanks like ________________
          const highlightedLine = line.replace(/_{3,}/g, '__________');
          return (
            <div key={lIdx} className="my-0.5">
              {highlightedLine}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`worksheet-document-root text-slate-900 bg-white relative select-text ${fontConfig.className} ${
        borderStyle === 'classic_frame'
          ? 'border-4 border-double ' + colors.headerBorder + ' ' + paddingClass
          : borderStyle === 'modern_cards'
          ? 'border-2 ' + colors.headerBorder + ' rounded-xl shadow-xs ' + paddingClass
          : 'border-t-8 border-b-4 ' + colors.headerBorder + ' ' + paddingClass
      }`}
      style={{ minHeight: '100%' }}
    >
      {/* ========================================================= */}
      {/* 1. SCHOOL / INSTITUTION HEADER & STUDENT INFORMATION BOX */}
      {/* ========================================================= */}
      <div className="border-b-2 pb-4 mb-5" style={{ borderColor: themeColor === 'monochrome' ? '#0f172a' : undefined }}>
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${colors.badgeBg} ${colors.badgeText} flex items-center justify-center font-black text-sm shadow-xs`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                {displayTopic}
              </h1>
              <p className="text-[11px] font-bold text-slate-600 tracking-wide uppercase">
                Curriculum Worksheet & Skills Assessment • Level: {displayLevel}
              </p>
            </div>
          </div>

          {/* Optional QR Code in Header */}
          {qrSettings?.enabled && qrSettings.position === 'header' && (
            <div className="shrink-0">
              <WorksheetQRCard settings={qrSettings} variant="header" topic={displayTopic} />
            </div>
          )}
        </div>

        {/* Formatted Student Credentials Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-semibold">
          <div className="p-2 rounded border border-slate-300 bg-slate-50/70 flex items-center justify-between">
            <span className="text-slate-500 font-bold text-[10px] uppercase">Student Name:</span>
            <span className="text-slate-900 font-mono text-[11px] border-b border-slate-400 flex-1 ml-2"></span>
          </div>
          <div className="p-2 rounded border border-slate-300 bg-slate-50/70 flex items-center justify-between">
            <span className="text-slate-500 font-bold text-[10px] uppercase">Class / Grade:</span>
            <span className="text-slate-900 font-mono text-[11px] border-b border-slate-400 flex-1 ml-2"></span>
          </div>
          <div className="p-2 rounded border border-slate-300 bg-slate-50/70 flex items-center justify-between">
            <span className="text-slate-500 font-bold text-[10px] uppercase">Date:</span>
            <span className="text-slate-900 font-mono text-[11px] border-b border-slate-400 flex-1 ml-2"></span>
          </div>
          <div className={`p-2 rounded border-2 ${colors.accentBorder} ${colors.accentBg} flex items-center justify-between`}>
            <span className="font-extrabold text-[10px] uppercase text-slate-800">Score:</span>
            <span className="font-black text-xs text-slate-900">____ / 20</span>
          </div>
        </div>
      </div>

      {/* General Instructions Banner */}
      {parsedDoc.instructions && (
        <div className="mb-5 px-3.5 py-2 rounded-lg bg-slate-100/90 border-l-4 border-slate-700 text-xs font-medium text-slate-800 flex items-center gap-2">
          <span className="font-bold text-slate-900 uppercase text-[10px] shrink-0 tracking-wider">Instructions:</span>
          <span>{parsedDoc.instructions}</span>
        </div>
      )}

      {/* Document-level Curated Visuals */}
      {visuals && visuals.length > 0 && (
        <div className="mb-5">
          {visuals.map((visual, idx) => (
            <WorksheetVisualBlock
              key={visual.id || idx}
              visual={visual}
              isEditable={false}
            />
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. STRUCTURED SECTIONS & QUESTIONS */}
      {/* ========================================================= */}
      <div className="space-y-6">
        {parsedDoc.sections.map((section, sIdx) => {
          const isMatching = /match/i.test(section.title) || /matching/i.test(section.instruction);
          const isGrammar = /verb|tense|form|grammar/i.test(section.title);
          const isReading = /reading|passage|comprehension|text/i.test(section.title);
          const isHypothetical = /if you were|action|reflection|speaking/i.test(section.title);

          return (
            <div 
              key={section.id || sIdx}
              className={`rounded-xl transition-all border-2 overflow-hidden shadow-xs p-4 bg-white ${colors.cardBorder} ${
                borderStyle === 'classic_frame'
                  ? 'border-t-4 ' + colors.accentBorder
                  : borderStyle === 'modern_cards'
                  ? 'shadow-sm'
                  : ''
              }`}
            >
              {/* Section Header Banner */}
              <div className={`flex items-center justify-between p-3 -mx-4 -mt-4 mb-3 border-b ${colors.cardBorder} ${colors.cardHeaderBg}`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase ${colors.badgeBg} ${colors.badgeText} shadow-2xs`}>
                    {section.sectionCode}
                  </span>
                  <h3 className={`font-black text-xs sm:text-sm tracking-tight ${themeColor === 'monochrome' ? 'text-slate-900' : colors.highlightText}`}>
                    {section.title}
                  </h3>
                </div>

                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1 bg-white/80 dark:bg-slate-900/40 px-2 py-0.5 rounded-md border border-slate-200/50">
                  {isMatching && <Split className="w-3 h-3 text-primary-600 animate-pulse" />}
                  {isGrammar && <PenTool className="w-3 h-3 text-emerald-600 animate-pulse" />}
                  {isReading && <BookOpen className="w-3 h-3 text-blue-600 animate-pulse" />}
                  {isHypothetical && <Lightbulb className="w-3 h-3 text-amber-600 animate-pulse" />}
                  <span>Activity {sIdx + 1}</span>
                </div>
              </div>

              {/* Section-specific instruction */}
              {section.instruction && (
                <div className="text-[11.5px] font-semibold text-slate-700 mb-3 italic pl-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{section.instruction}</span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-2">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx}>
                    {renderStyledContent(q.content)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 3. FOOTER & DIGITAL QR COMPANION */}
      {/* ========================================================= */}
      <div className="mt-8 pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
        <div className="flex items-center gap-2">
          <span>LexiScan Educational Materials • Formatted for Classroom Practice & Evaluation</span>
          {showTeacherGuide && (
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] uppercase">
              Teacher Guide Edition
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span>Teacher Signature / Stamp: ___________________</span>
          {totalPages && totalPages > 1 && (
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Page {pageNumber || 1} of {totalPages}
            </span>
          )}
        </div>

        {qrSettings?.enabled && qrSettings.position === 'footer' && (
          <div className="w-full mt-3 pt-3 border-t border-slate-200">
            <WorksheetQRCard settings={qrSettings} variant="footer" topic={displayTopic} />
          </div>
        )}
      </div>
    </div>
  );
}
