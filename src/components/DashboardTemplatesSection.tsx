import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Eye, 
  GraduationCap, 
  SlidersHorizontal,
  X,
  Zap
} from 'lucide-react';
import { WorksheetTemplateId, WORKSHEET_TEMPLATES, WorksheetTemplate } from '../utils/worksheetTemplates';
import { WorksheetDocumentRenderer } from './WorksheetDocumentRenderer';

interface DashboardTemplatesSectionProps {
  onSelectTemplate: (templateId: WorksheetTemplateId, topic?: string, gradeLevel?: string) => void;
}

type TemplateFilter = 'all' | 'grammar' | 'reading' | 'vocab' | 'quiz';

export function DashboardTemplatesSection({ onSelectTemplate }: DashboardTemplatesSectionProps) {
  const [filter, setFilter] = useState<TemplateFilter>('all');
  const [selectedTopics, setSelectedTopics] = useState<Record<WorksheetTemplateId, string>>({
    vocab_matching: 'Pollution & Environmental Protection',
    grammar_exercise: 'Travelling & Vacation Plans (Past vs. Future)',
    reading_comprehension: 'Pollution & The Future of Oceans',
    quiz: 'Family Relationships & Household Roles',
    comprehensive: 'Accommodations & Hotel Booking',
  });

  const [selectedLevels, setSelectedLevels] = useState<Record<WorksheetTemplateId, string>>({
    vocab_matching: 'beginner (A1-A2)',
    grammar_exercise: 'intermediate (B1-B2)',
    reading_comprehension: 'intermediate (B1-B2)',
    quiz: 'beginner (A1-A2)',
    comprehensive: 'intermediate (B1-B2)',
  });

  const [previewTemplateId, setPreviewTemplateId] = useState<WorksheetTemplateId | null>(null);

  const templatesList = Object.values(WORKSHEET_TEMPLATES);

  const filteredTemplates = templatesList.filter((tpl) => {
    if (filter === 'all') return true;
    if (filter === 'grammar') return tpl.id === 'grammar_exercise';
    if (filter === 'reading') return tpl.id === 'reading_comprehension';
    if (filter === 'vocab') return tpl.id === 'vocab_matching';
    if (filter === 'quiz') return tpl.id === 'quiz' || tpl.id === 'comprehensive';
    return true;
  });

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'check-circle':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'help-circle':
        return <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'layers':
      default:
        return <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getTemplateThemeAccent = (id: WorksheetTemplateId) => {
    switch (id) {
      case 'grammar_exercise':
        return {
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
          borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-500/50',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
          accentPill: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
        };
      case 'reading_comprehension':
        return {
          badgeBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
          borderHover: 'hover:border-blue-400 dark:hover:border-blue-500/50',
          buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
          accentPill: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
        };
      case 'vocab_matching':
        return {
          badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
          borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-500/50',
          buttonBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20',
          accentPill: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
        };
      case 'quiz':
        return {
          badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
          borderHover: 'hover:border-amber-400 dark:hover:border-amber-500/50',
          buttonBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
          accentPill: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
        };
      case 'comprehensive':
      default:
        return {
          badgeBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
          borderHover: 'hover:border-purple-400 dark:hover:border-purple-500/50',
          buttonBg: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20',
          accentPill: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
        };
    }
  };

  const handleUseTemplate = (tplId: WorksheetTemplateId) => {
    const topicToUse = selectedTopics[tplId] || WORKSHEET_TEMPLATES[tplId].suggestedTopics[0] || 'English Practice';
    const levelToUse = selectedLevels[tplId] || 'intermediate (B1-B2)';
    onSelectTemplate(tplId, topicToUse, levelToUse);
  };

  return (
    <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-primary-500" />
              <span>Predefined Layouts</span>
            </span>
            <span className="text-xs font-semibold text-slate-400">
              • Instant One-Click Pre-fill
            </span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Worksheet Templates
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Select a specialized pedagogical template—including <strong>Grammar Exercise</strong>, <strong>Reading Comprehension</strong>, and <strong>Vocabulary Matching</strong>—to instantly configure and pre-fill the generator.
          </p>
        </div>

        {/* Filter Navigation Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'all' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Templates
          </button>
          <button
            onClick={() => setFilter('grammar')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'grammar' 
                ? 'bg-emerald-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Grammar Exercise
          </button>
          <button
            onClick={() => setFilter('reading')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'reading' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reading Comprehension
          </button>
          <button
            onClick={() => setFilter('vocab')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'vocab' 
                ? 'bg-indigo-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => setFilter('quiz')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'quiz' 
                ? 'bg-amber-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quizzes & Exams
          </button>
        </div>
      </div>

      {/* Templates Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => {
          const accents = getTemplateThemeAccent(template.id);
          const currentTopic = selectedTopics[template.id] || template.suggestedTopics[0];
          const currentLevel = selectedLevels[template.id] || 'intermediate (B1-B2)';

          return (
            <div
              key={template.id}
              className={`bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${accents.borderHover} group relative`}
            >
              <div>
                {/* Top Badge & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {getTemplateIcon(template.iconName)}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${accents.badgeBg}`}>
                      {template.category}
                    </span>
                  </div>

                  <button
                    onClick={() => setPreviewTemplateId(template.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                    title="Quick preview sample layout"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Template Title & Tagline */}
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {template.name}
                </h4>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {template.tagline}
                </p>

                {/* Pre-structured Sections List */}
                <div className="my-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Pre-structured Exercises:
                  </span>
                  {template.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${template.id === 'grammar_exercise' ? 'bg-emerald-500' : template.id === 'reading_comprehension' ? 'bg-blue-500' : 'bg-indigo-500'}`} />
                      <span className="font-semibold text-[11px] truncate">
                        {sec.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Suggested Topic Selector Pills */}
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                    Pre-fill Target Topic:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {template.suggestedTopics.slice(0, 3).map((topicItem, tIdx) => {
                      const isSelected = currentTopic === topicItem;
                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => {
                            setSelectedTopics((prev) => ({ ...prev, [template.id]: topicItem }));
                          }}
                          className={`text-[10.5px] px-2.5 py-1 rounded-lg font-medium transition-all text-left truncate max-w-full ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs font-bold'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                          title={`Pre-fill topic: ${topicItem}`}
                        >
                          {topicItem.split(' (')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${accents.buttonBg}`}
                  title={`Pre-fill generator with ${template.name}`}
                >
                  <span>Pre-fill Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* QUICK PREVIEW MODAL                                       */}
      {/* ========================================================= */}
      {previewTemplateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400">
                  {getTemplateIcon(WORKSHEET_TEMPLATES[previewTemplateId].iconName)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {WORKSHEET_TEMPLATES[previewTemplateId].name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sample Structure Preview & Exercise Blueprint
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewTemplateId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70 dark:bg-slate-950/60 flex justify-center">
              <div className="w-full max-w-[700px] bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                <WorksheetDocumentRenderer
                  worksheetText={WORKSHEET_TEMPLATES[previewTemplateId].sampleGenerator(
                    selectedTopics[previewTemplateId] || WORKSHEET_TEMPLATES[previewTemplateId].suggestedTopics[0],
                    'Intermediate (B1-B2)'
                  )}
                  topic={selectedTopics[previewTemplateId] || WORKSHEET_TEMPLATES[previewTemplateId].suggestedTopics[0]}
                  gradeLevel="Intermediate (B1-B2)"
                  themeColor={previewTemplateId === 'grammar_exercise' ? 'emerald' : previewTemplateId === 'reading_comprehension' ? 'navy' : 'indigo'}
                  borderStyle="classic_frame"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Clicking "Use This Template" will pre-fill all parameters and open the interactive builder.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewTemplateId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const id = previewTemplateId;
                    setPreviewTemplateId(null);
                    handleUseTemplate(id);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
