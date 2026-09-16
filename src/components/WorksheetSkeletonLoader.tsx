import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Layers, CheckCircle2, QrCode, Image as ImageIcon, FileText, Bot } from 'lucide-react';

interface WorksheetSkeletonLoaderProps {
  topic?: string;
  gradeLevel?: string;
  templateName?: string;
}

const GENERATION_STEPS = [
  { id: 1, label: 'Analyzing grade level & pedagogical structure', icon: BookOpen },
  { id: 2, label: 'Generating vocabulary & contextual reading passage', icon: FileText },
  { id: 3, label: 'Synthesizing varied exercise formats & answer keys', icon: Layers },
  { id: 4, label: 'Aligning A4 typography, vector art & QR companion', icon: Sparkles },
];

export function WorksheetSkeletonLoader({
  topic = 'English Topic',
  gradeLevel = 'Elementary (A2)',
  templateName = 'Standard Worksheet',
}: WorksheetSkeletonLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  // Progressive step animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 90) {
          const increment = Math.floor(Math.random() * 8) + 4;
          return Math.min(prev + increment, 90);
        }
        return prev;
      });
    }, 450);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-2 animate-in fade-in zoom-in-95 duration-300">
      {/* Floating AI Progress Bar Card */}
      <div className="w-full bg-white dark:bg-slate-900 border border-primary-200 dark:border-primary-900/60 shadow-lg shadow-primary-500/5 rounded-2xl p-5 relative overflow-hidden">
        {/* Glowing Top Shimmer Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-linear-to-r from-primary-500 via-indigo-500 to-sky-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>AI Worksheet Engine Busy</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium">
                    {progressPercent}%
                  </span>
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Generating <strong className="text-slate-800 dark:text-slate-200 font-semibold">{templateName}</strong> for <strong className="text-primary-600 dark:text-primary-400 font-semibold">{topic || 'Lesson'}</strong> ({gradeLevel})
              </p>
            </div>
          </div>

          {/* Real-time Stage Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {GENERATION_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                      : isCurrent
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700 shadow-2xs animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                  title={step.label}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">Step {idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Active Step Callout */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-500 animate-ping" />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {GENERATION_STEPS[currentStepIndex].label}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 hidden sm:inline">
            Structuring formatted exercises & illustrations...
          </span>
        </div>
      </div>

      {/* Realistic A4 Worksheet Document Skeleton */}
      <div className="w-full bg-white dark:bg-slate-900 shadow-xl shadow-slate-300/40 dark:shadow-2xl dark:shadow-black/40 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-10 relative overflow-hidden min-h-[600px]">
        {/* Shimmer Sweep Animation Overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-slate-100/60 dark:via-slate-800/40 to-transparent pointer-events-none" />

        {/* Header Block: Title & Student Info Lines */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="space-y-2.5 flex-1">
            <div className="h-6 w-3/4 max-w-xs bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-3.5 w-1/2 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-48">
            <div className="flex items-center gap-2">
              <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded-sm" />
              <div className="h-3 flex-1 border-b border-slate-300 dark:border-slate-700 border-dashed" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded-sm" />
              <div className="h-3 flex-1 border-b border-slate-300 dark:border-slate-700 border-dashed" />
            </div>
          </div>
        </div>

        {/* Section 1: Illustration & Vocabulary Bank Skeleton */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vector Art Box Skeleton */}
          <div className="md:col-span-1 h-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <ImageIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
          </div>

          {/* Word Bank / Objectives Skeleton */}
          <div className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            <div className="flex flex-wrap gap-2 pt-1">
              {[64, 80, 56, 92, 70, 60].map((width, i) => (
                <div
                  key={i}
                  className="h-6 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse"
                  style={{ width: `${width}px` }}
                />
              ))}
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md" />
          </div>
        </div>

        {/* Section 2: Questions & Exercise Blocks Skeleton */}
        <div className="mt-8 space-y-6">
          {/* Exercise 1: Matching / Gap Fill */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
              <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3].map((q) => (
                <div key={q} className="flex items-center gap-3">
                  <span className="w-4 text-xs font-bold text-slate-300 dark:text-slate-700">{q}.</span>
                  <div className="h-3.5 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
                  <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md border-b border-slate-300 dark:border-slate-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Exercise 2: Multiple Choice / Dialogue Skeleton */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/90 space-y-4">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((opt) => (
                <div
                  key={opt}
                  className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 p-2.5 flex items-center gap-2.5"
                >
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                  <div className="h-3 flex-1 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Digital QR Companion Skeleton Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            <div className="h-2.5 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          </div>
          <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <QrCode className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
