import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  ScanLine, 
  Type, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ArrowRight,
  Compass,
  BookOpen,
  GraduationCap,
  Layers,
  HelpCircle,
  Move,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab } from '../types';

export interface GetStartedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: Tab) => void;
  currentTab?: Tab;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tabTarget?: Tab;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function GetStartedTour({ isOpen, onClose, onNavigateTab }: GetStartedTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, dontShowAgain]);

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('lexiscan_onboarding_completed', 'true');
      } catch (err) {
        console.error('Failed to save tour preference:', err);
      }
    }
    onClose();
  };

  const handleComplete = (targetTab?: Tab) => {
    try {
      localStorage.setItem('lexiscan_onboarding_completed', 'true');
    } catch (err) {
      console.error('Failed to save tour preference:', err);
    }
    if (targetTab) {
      onNavigateTab(targetTab);
    }
    onClose();
  };

  const steps: TourStep[] = [
    {
      id: 'welcome',
      badge: 'Platform Overview',
      title: 'Welcome to LexiScan AI',
      subtitle: 'Create, customize, and analyze classroom-ready ESL materials in seconds.',
      icon: <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            LexiScan AI unites <strong className="text-slate-900 dark:text-white font-bold">AI Worksheet Generation</strong> with <strong className="text-slate-900 dark:text-white font-bold">External Layout Analysis</strong> to give educators a complete classroom publishing workflow.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">1. Worksheet Generator</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Generates structured exercises with everyday themes, CEFR levels, multiple fonts, and QR companions.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">2. Layout Scanner</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Extracts and analyzes structural zones (titles, questions, response blanks) from scanned physical sheets.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-xs text-primary-800 dark:text-primary-300 flex items-center gap-2 mt-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-primary-600 dark:text-primary-400" />
            <span>Designed for standard A4 paper with margin guides and printer-safe contrast.</span>
          </div>
        </div>
      ),
    },
    {
      id: 'generator',
      badge: 'Core Feature 1',
      title: 'Worksheet Generator & Themes',
      subtitle: 'Generate structured lessons with everyday topics & CEFR levels.',
      tabTarget: 'generator',
      icon: <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Quickly scaffold ESL materials by typing a custom lesson theme or choosing from everyday life presets.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-2.5 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              1-Click Suggested Daily Themes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Grocery Shopping',
                'Commuting to Work',
                'Coffee Shop Ordering',
                'Family & Free Time',
                "Let's Have a Picnic"
              ].map((theme) => (
                <span
                  key={theme}
                  className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 font-semibold"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-center shadow-2xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block">Beginner</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">A1–A2 Basics</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-center shadow-2xs">
              <span className="text-sky-600 dark:text-sky-400 font-bold block">Intermediate</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">B1–B2 Grammar</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-center shadow-2xs">
              <span className="text-purple-600 dark:text-purple-400 font-bold block">Advanced</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">C1–C2 Discourse</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'fonts',
      badge: 'Typography Selection',
      title: 'Font Styles for Every Learner',
      subtitle: 'Toggle between clean sans-serif, academic serif, and handwriting.',
      tabTarget: 'generator',
      icon: <Type className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      content: (
        <div className="space-y-3.5">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Adapt worksheet typography to your instructional context with built-in font styles available in both generator and print preview:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Clean Sans-Serif (Plus Jakarta Sans)</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">High legibility, modern clarity, and dyslexia-friendly letter spacing.</p>
              </div>
              <span className="text-sm font-semibold font-worksheet-sans px-2.5 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs">
                Aa Bb 123
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Academic Serif (Lora)</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Classic literary book print for formal assessments & reading comprehension.</p>
              </div>
              <span className="text-sm font-serif px-2.5 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs">
                Aa Bb 123
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">School Handwriting (Patrick Hand)</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Casual penmanship model designed for primary ESL practice.</p>
              </div>
              <span className="text-base font-worksheet-handwriting px-2.5 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs">
                Aa Bb 123
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'qr_and_print',
      badge: 'Print & Digital Media',
      title: 'Digital QR Code & Client-Side PDF Export',
      subtitle: 'Connect paper worksheets with online audio & export high-resolution A4 PDFs.',
      tabTarget: 'generator',
      icon: <QrCode className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Turn physical handouts into interactive learning tools, export local PDFs, and preview on exact paper dimensions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
                <QrCode className="w-4 h-4" />
                <span>QR Code Companion</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Embed scannable codes for audio pronunciation, Quizlet sets, or British Council online quizzes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Printer className="w-4 h-4" />
                <span>Save PDF & Direct Print</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Client-side PDF generation powered by jsPDF saves pristine A4 documents locally without needing a printer.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Automatic section-aware page breaks ensure exercises never get cut in half across sheets.</span>
          </div>
        </div>
      ),
    },
    {
      id: 'dnd_builder',
      badge: 'Interactive Layout Builder',
      title: 'Drag & Drop Section & Question Builder',
      subtitle: 'Reorder questions, duplicate exercises, and reorganize worksheet sections intuitively.',
      tabTarget: 'generator',
      icon: <Move className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Fine-tune AI generated worksheets effortlessly using the built-in <strong className="text-slate-900 dark:text-white font-bold">Drag & Drop Builder</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
                <GripVertical className="w-4 h-4" />
                <span>Reorder Sections & Items</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Drag entire exercise sections up or down, or drag individual questions within a section.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Smart Auto-Renumbering</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Sections automatically re-label (Section A, B, C...) and questions re-index smoothly as you rearrange.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-500/20 text-xs text-primary-800 dark:text-primary-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-primary-600 dark:text-primary-400" />
            <span>Switch anytime between the Drag & Drop Builder and the exact A4 Document View.</span>
          </div>
        </div>
      ),
    },
    {
      id: 'scanner',
      badge: 'Core Feature 2',
      title: 'External Layout Scanner',
      subtitle: 'Upload physical worksheet scans to detect zones & layout structures.',
      tabTarget: 'scanner',
      icon: <ScanLine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Have an existing worksheet from a textbook or paper handout? Use the <strong className="text-slate-900 dark:text-white font-bold">External Layout Scanner</strong> to inspect its visual geometry.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Detected Structural Zones:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">98% Avg Confidence</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Title Blocks</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-yellow-500/10 border border-amber-200 dark:border-yellow-500/30 text-amber-700 dark:text-yellow-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Instructions Blocks</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-green-500/10 border border-emerald-200 dark:border-green-500/30 text-emerald-700 dark:text-green-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Question Items</span>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Response Lines</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Supports drag-and-drop image uploads with live zone overlays and bounding coordinates.
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (steps[nextIndex].tabTarget) {
        onNavigateTab(steps[nextIndex].tabTarget!);
      }
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (steps[prevIndex].tabTarget) {
        onNavigateTab(steps[prevIndex].tabTarget!);
      }
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    if (steps[index].tabTarget) {
      onNavigateTab(steps[index].tabTarget!);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="get-started-tour-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-step-title"
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Feature Tour • Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Close Tour (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div 
            className="bg-primary-600 dark:bg-primary-500 h-1 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Tour Step Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block mb-1">
                    {currentStep.badge}
                  </span>
                  <h3 id="tour-step-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    {currentStep.subtitle}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-2xs shrink-0">
                  {currentStep.icon}
                </div>
              </div>

              {/* Dynamic Body Component */}
              <div className="pt-2">
                {currentStep.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicators Dots */}
        <div className="px-6 py-2 flex items-center justify-center gap-2">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => handleJumpToStep(idx)}
              className={`h-2 rounded-full transition-all ${
                currentStepIndex === idx
                  ? 'w-6 bg-primary-600 dark:bg-primary-500'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              }`}
              title={`Go to step ${idx + 1}: ${step.title}`}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-primary-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Don't show on startup</span>
          </label>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={() => handleComplete('generator')}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
