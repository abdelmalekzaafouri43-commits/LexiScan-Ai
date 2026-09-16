import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Hotel, 
  Sparkles, 
  Plane, 
  Tv, 
  Users, 
  Heart, 
  BookOpen, 
  Shuffle, 
  Check, 
  ChevronDown,
  Info,
  PenTool,
  GraduationCap,
  Sparkle
} from 'lucide-react';
import { 
  THEME_CATEGORIES, 
  WorksheetThemeItem, 
  ThemeCategory 
} from '../utils/worksheetThemes';

interface CurriculumThemeSelectorProps {
  currentTopic: string;
  onSelectTheme: (theme: WorksheetThemeItem) => void;
  onCustomTopicChange: (topic: string) => void;
}

export function CurriculumThemeSelector({
  currentTopic,
  onSelectTheme,
  onCustomTopicChange
}: CurriculumThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [activeTheme, setActiveTheme] = useState<WorksheetThemeItem | null>(null);
  const [isCustomEditing, setIsCustomEditing] = useState<boolean>(false);

  // Flatten all themes for easy lookup
  const allThemes: WorksheetThemeItem[] = THEME_CATEGORIES.flatMap(cat => cat.themes);

  // Sync active theme with currentTopic if matched
  useEffect(() => {
    const matched = allThemes.find(t => 
      t.name.toLowerCase() === currentTopic.toLowerCase() ||
      t.id === currentTopic ||
      currentTopic.toLowerCase().includes(t.name.toLowerCase())
    );

    if (matched) {
      setSelectedThemeId(matched.id);
      setActiveTheme(matched);
    } else if (!currentTopic) {
      setSelectedThemeId('');
      setActiveTheme(null);
    }
  }, [currentTopic]);

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomEditing(true);
      setSelectedThemeId('custom');
      setActiveTheme(null);
      return;
    }

    const found = allThemes.find(t => t.id === value);
    if (found) {
      setSelectedThemeId(found.id);
      setActiveTheme(found);
      setIsCustomEditing(false);
      onSelectTheme(found);
    }
  };

  const handleCategoryQuickSelect = (categoryId: string) => {
    const category = THEME_CATEGORIES.find(c => c.id === categoryId);
    if (category && category.themes.length > 0) {
      const firstTheme = category.themes[0];
      setSelectedThemeId(firstTheme.id);
      setActiveTheme(firstTheme);
      setIsCustomEditing(false);
      onSelectTheme(firstTheme);
    }
  };

  const handleShuffle = () => {
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    setSelectedThemeId(randomTheme.id);
    setActiveTheme(randomTheme);
    setIsCustomEditing(false);
    onSelectTheme(randomTheme);
  };

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

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
      
      {/* Header & Quick Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <label htmlFor="curriculum-theme-dropdown" className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
              Thematic Curriculum Units
              <span className="text-[10px] normal-case font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                7 Core Domains
              </span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="text-xs font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Pick a random curriculum theme"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Random Theme</span>
        </button>
      </div>

      {/* Main Thematic Dropdown Selector */}
      <div className="relative">
        <select
          id="curriculum-theme-dropdown"
          value={selectedThemeId || (isCustomEditing ? 'custom' : '')}
          onChange={handleDropdownChange}
          className="w-full bg-white dark:bg-slate-950 border-2 border-primary-200 dark:border-primary-900/60 hover:border-primary-400 dark:hover:border-primary-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer pr-10 shadow-xs"
        >
          <option value="" disabled>
            Select a Curriculum Theme (Pollution, Travel, Celebrations...)...
          </option>

          {THEME_CATEGORIES.map((category) => (
            <optgroup key={category.id} label={`─── ${category.name.toUpperCase()} ───`}>
              {category.themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.categoryIcon === 'leaf' ? '🌿' : 
                   theme.categoryIcon === 'hotel' ? '🏨' : 
                   theme.categoryIcon === 'sparkles' ? '🎉' : 
                   theme.categoryIcon === 'plane' ? '✈️' : 
                   theme.categoryIcon === 'tv' ? '🎭' : 
                   theme.categoryIcon === 'users' ? '👨‍👩‍👧‍👦' : '🤝'} {theme.name} ({theme.category})
                </option>
              ))}
            </optgroup>
          ))}

          <optgroup label="─── CUSTOM / FREE TEXT ───">
            <option value="custom">✏️ Custom Topic / Type Your Own...</option>
          </optgroup>
        </select>

        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* 7 Quick-Select Category Chips */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
          Or 1-Click Quick Select Theme Domain:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {THEME_CATEGORIES.map((cat) => {
            const isCatActive = activeTheme?.category === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryQuickSelect(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  isCatActive
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs ring-2 ring-primary-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                {getCategoryIcon(cat.iconName, 'w-3.5 h-3.5')}
                <span>{cat.name.split(' & ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Theme Pedagogical Info Card or Custom Text Editor */}
      {isCustomEditing || selectedThemeId === 'custom' ? (
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-primary-600" />
              <span>Custom Topic / Free Text</span>
            </label>
            <span className="text-[10px] text-slate-400">Type any custom theme</span>
          </div>
          <input
            type="text"
            value={currentTopic}
            onChange={(e) => onCustomTopicChange(e.target.value)}
            placeholder="e.g. Solar System, Job Interview Skills, Ancient Rome..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      ) : activeTheme ? (
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  {activeTheme.name}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                  {activeTheme.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {activeTheme.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomEditing(true)}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 flex items-center gap-1"
            >
              <PenTool className="w-3 h-3" />
              <span>Edit Title</span>
            </button>
          </div>

          {/* Key Target Vocabulary */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Target Vocabulary Bank:
            </span>
            <div className="flex flex-wrap gap-1">
              {activeTheme.keyVocabulary.map((vocab) => (
                <span
                  key={vocab}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/80 text-indigo-800 dark:text-indigo-300 shadow-2xs"
                >
                  {vocab}
                </span>
              ))}
            </div>
          </div>

          {/* Target Grammar Focus */}
          <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/50 flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 shrink-0">Grammar Focus:</span>
            <span className="text-slate-600 dark:text-slate-400">{activeTheme.suggestedGrammar}</span>
          </div>
        </div>
      ) : null}

    </div>
  );
}
