import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  FileText, 
  Sparkles,
  LayoutTemplate,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  WorksheetTemplateId, 
  WORKSHEET_TEMPLATES, 
  WorksheetTemplate 
} from '../utils/worksheetTemplates';

interface WorksheetTemplateSelectorProps {
  selectedTemplateId: WorksheetTemplateId;
  onSelectTemplate: (templateId: WorksheetTemplateId, autoLoadSample?: boolean) => void;
  onApplyTemplateSample: (templateId: WorksheetTemplateId) => void;
  hasExistingWorksheet?: boolean;
}

export function WorksheetTemplateSelector({
  selectedTemplateId,
  onSelectTemplate,
  onApplyTemplateSample,
  hasExistingWorksheet = false,
}: WorksheetTemplateSelectorProps) {
  const currentTemplate = WORKSHEET_TEMPLATES[selectedTemplateId] || WORKSHEET_TEMPLATES.vocab_matching;

  const templateIcons: Record<string, React.ReactNode> = {
    'book-open': <BookOpen className="w-4 h-4" />,
    'check-circle': <CheckCircle2 className="w-4 h-4" />,
    'help-circle': <HelpCircle className="w-4 h-4" />,
    'layers': <Layers className="w-4 h-4" />,
    'file-text': <FileText className="w-4 h-4" />,
  };

  const templatesList = Object.values(WORKSHEET_TEMPLATES);

  return (
    <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
              Worksheet Layout Template
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Select an educational layout to auto-adjust exercise structures
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 mb-4">
        {templatesList.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id, false)}
              className={`w-full text-left p-3 rounded-xl border transition-all relative flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-500/60 dark:border-primary-500/50 shadow-2xs'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {templateIcons[tpl.iconName]}
                  </div>
                  <span className={`text-xs font-bold ${
                    isSelected
                      ? 'text-primary-900 dark:text-primary-200'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {tpl.name}
                  </span>
                </div>

                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                  isSelected
                    ? 'bg-primary-100/80 dark:bg-primary-900/60 border-primary-200 dark:border-primary-700 text-primary-800 dark:text-primary-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {tpl.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 pl-8">
                {tpl.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Auto-Adjusted Structure Blueprint Preview */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>Auto-Configured Structure ({currentTemplate.name})</span>
          </div>

          <button
            type="button"
            onClick={() => onApplyTemplateSample(currentTemplate.id)}
            className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors underline-offset-2 hover:underline"
            title="Populate the builder with this layout's sample structure"
          >
            <span>{hasExistingWorksheet ? 'Load Template Layout' : 'Preview Layout'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Section Structure Chips */}
        <div className="space-y-1.5">
          {currentTemplate.sections.map((sec, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800"
            >
              <span className="font-mono font-bold text-[10px] text-primary-600 dark:text-primary-400 shrink-0 bg-primary-50 dark:bg-primary-950 px-1.5 py-0.5 rounded border border-primary-200 dark:border-primary-800/60">
                {sec.code}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-slate-900 dark:text-slate-200">{sec.title}: </span>
                <span className="text-slate-500 dark:text-slate-400">{sec.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
