import React, { useState } from 'react';
import { 
  Leaf, 
  Hotel, 
  Sparkles, 
  Plane, 
  Tv, 
  Users, 
  Heart, 
  ChevronRight, 
  BookOpen, 
  Check, 
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  THEME_CATEGORIES, 
  WorksheetThemeItem, 
  ThemeCategory 
} from '../utils/worksheetThemes';

interface ThemeExplorerBarProps {
  currentTopic: string;
  onSelectTheme: (theme: WorksheetThemeItem) => void;
}

export function ThemeExplorerBar({ currentTopic, onSelectTheme }: ThemeExplorerBarProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('environment');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeThemeDetail, setActiveThemeDetail] = useState<WorksheetThemeItem | null>(null);

  const activeCategory = THEME_CATEGORIES.find(c => c.id === selectedCategoryId) || THEME_CATEGORIES[0];

  const getCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'leaf': return <Leaf className={className} />;
      case 'hotel': return <Hotel className={className} />;
      case 'sparkles': return <Sparkles className={className} />;
      case 'plane': return <Plane className={className} />;
      case 'tv': return <Tv className={className} />;
      case 'users': return <Users className={className} />;
      case 'heart': return <Heart className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  const getCategoryColorClasses = (color: string, isSelected: boolean) => {
    if (isSelected) {
      switch (color) {
        case 'emerald': return 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20';
        case 'amber': return 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/20';
        case 'purple': return 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-500/20';
        case 'blue': return 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20';
        case 'rose': return 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20';
        case 'cyan': return 'bg-cyan-600 text-white shadow-sm ring-2 ring-cyan-500/20';
        case 'teal': return 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-500/20';
        default: return 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-500/20';
      }
    }
    return 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Curriculum Themes & Modules
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800">
                ESL/EFL Focus
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a thematic unit to auto-load targeted vocabulary, grammar targets, and illustrations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center self-start sm:self-auto gap-1"
        >
          {isExpanded ? 'Show Compact View' : 'Browse All Theme Cards'}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {THEME_CATEGORIES.map(category => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategoryId(category.id);
                setActiveThemeDetail(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${getCategoryColorClasses(category.color, isSelected)}`}
            >
              {getCategoryIcon(category.iconName, 'w-3.5 h-3.5')}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Themes Row / Expanded Cards */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {activeCategory.themes.map(theme => {
            const isCurrentTopic = currentTopic.toLowerCase().includes(theme.name.toLowerCase()) ||
              theme.name.toLowerCase().includes(currentTopic.toLowerCase());

            return (
              <div
                key={theme.id}
                className={`relative group p-3 rounded-lg border transition-all text-left flex flex-col justify-between bg-white dark:bg-slate-800/90 ${
                  isCurrentTopic 
                    ? 'border-primary-500 dark:border-primary-500 shadow-sm ring-1 ring-primary-500/20' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-1.5">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      {theme.name}
                    </h5>
                    {isCurrentTopic && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2 line-clamp-2">
                    {theme.description}
                  </p>

                  {/* Vocabulary Chips */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {theme.keyVocabulary.slice(0, 4).map((vocab, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono"
                      >
                        {vocab}
                      </span>
                    ))}
                    {theme.keyVocabulary.length > 4 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1 py-0.5">
                        +{theme.keyVocabulary.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-750">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                    {theme.suggestedGrammar.split('&')[0]}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectTheme(theme)}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 group-hover:translate-x-0.5 transition-transform"
                  >
                    Use Theme
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
