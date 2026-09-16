import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Check, 
  RefreshCw, 
  Layers, 
  Palette, 
  Search,
  Grid,
  Maximize2
} from 'lucide-react';
import { WorksheetVisual, VisualStyle } from '../types/worksheetVisuals';
import { CURATED_VISUAL_LIBRARY, VISUAL_MATCHING_BANKS } from '../utils/curatedVisualLibrary';

interface VisualsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVisual?: WorksheetVisual | null;
  onSelectVisual: (visual: WorksheetVisual) => void;
  currentTopic: string;
}

export const VisualsManagerModal: React.FC<VisualsManagerModalProps> = ({
  isOpen,
  onClose,
  currentVisual,
  onSelectVisual,
  currentTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'ai_generate' | 'matching_bank'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>(currentVisual?.style || 'line_art');
  
  // Custom AI Generator State
  const [customPrompt, setCustomPrompt] = useState<string>(`A clear educational illustration of ${currentTopic || 'classroom objects'}`);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(CURATED_VISUAL_LIBRARY.map(item => item.category)))];

  const filteredLibrary = CURATED_VISUAL_LIBRARY.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectFromLibrary = (item: typeof CURATED_VISUAL_LIBRARY[0]) => {
    const svg = visualStyle === 'line_art' ? item.svgLineArt : item.svgVectorAccent;
    const newVisual: WorksheetVisual = {
      id: `visual-${Date.now()}-${item.id}`,
      placement: 'header_banner',
      title: item.title,
      caption: item.defaultCaption.replace('Target Vocabulary', currentTopic || item.title),
      style: visualStyle,
      category: item.category,
      svgContent: svg,
      altText: item.title,
      size: 'md',
    };
    onSelectVisual(newVisual);
    onClose();
  };

  const handleGenerateAiVisual = async () => {
    if (!customPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic || 'Classroom Lesson',
          style: visualStyle,
          promptDescription: customPrompt.trim(),
        }),
      });

      const data = await response.json();
      if (data.svg) {
        setGeneratedSvg(data.svg);
      } else {
        setAiError(data.error || 'Could not generate illustration. Please try again or select from the library.');
      }
    } catch (err: any) {
      setAiError('Network error while generating illustration.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAiVisual = () => {
    if (!generatedSvg) return;
    const newVisual: WorksheetVisual = {
      id: `visual-ai-${Date.now()}`,
      placement: 'header_banner',
      title: `AI Illustration: ${currentTopic || 'Custom Visual'}`,
      caption: `Figure 1: ${customPrompt.slice(0, 70)}...`,
      style: visualStyle,
      category: 'AI Generated',
      svgContent: generatedSvg,
      altText: customPrompt,
      size: 'md',
    };
    onSelectVisual(newVisual);
    onClose();
  };

  const handleSelectMatchingBank = (bankKey: string) => {
    const items = VISUAL_MATCHING_BANKS[bankKey];
    if (!items) return;
    const newVisual: WorksheetVisual = {
      id: `visual-matching-${Date.now()}`,
      placement: 'matching_bank',
      title: `${bankKey.toUpperCase()} 4-Item Visual Bank`,
      caption: 'Look at illustrations [A - D] and match each item with the corresponding numbered word.',
      style: 'line_art',
      category: 'Matching Exercise',
      altText: '4-Item Visual Matching Exercise Bank',
      size: 'full',
      matchingItems: items.map(item => ({
        letter: item.letter,
        label: item.label,
        svgContent: item.svg
      }))
    };
    onSelectVisual(newVisual);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Worksheet Visuals & Illustrations</h2>
              <p className="text-xs text-slate-500">Insert print-ready vector graphics, diagrams, and visual matching sets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style & Tab Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Curated Library
            </button>
            <button
              onClick={() => setActiveTab('matching_bank')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'matching_bank'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              4-Item Matching Banks
            </button>
            <button
              onClick={() => setActiveTab('ai_generate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'ai_generate'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              AI Prompt Synthesizer
            </button>
          </div>

          {/* Style Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Style:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setVisualStyle('line_art')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  visualStyle === 'line_art'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Line Art (Photocopy Safe)
              </button>
              <button
                type="button"
                onClick={() => setVisualStyle('vector_accent')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  visualStyle === 'vector_accent'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vector Color Accent
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: CURATED LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search illustrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs capitalize whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Visuals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLibrary.map((item) => {
                  const svg = visualStyle === 'line_art' ? item.svgLineArt : item.svgVectorAccent;
                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">{item.title}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.category}</span>
                      </div>
                      
                      {/* SVG Render Box */}
                      <div 
                        className="p-4 flex items-center justify-center h-36 w-full bg-white [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />

                      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 truncate">{item.tags.slice(0, 3).join(', ')}</span>
                        <button
                          type="button"
                          onClick={() => handleSelectFromLibrary(item)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Insert
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredLibrary.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No illustrations matching "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try another search term or generate one with AI</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MATCHING EXERCISE BANKS */}
          {activeTab === 'matching_bank' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Interactive Visual Matching Exercises</p>
                  <p className="text-amber-700 mt-0.5">
                    Inserts a 4-item visual identification grid [A, B, C, D] directly onto the worksheet for vocabulary matching quizzes and warm-up activities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(VISUAL_MATCHING_BANKS).map(([bankKey, items]) => (
                  <div key={bankKey} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 capitalize">{bankKey} Vocabulary Bank</h3>
                        <p className="text-xs text-slate-500">4 distinct high-contrast line-art items</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectMatchingBank(bankKey)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Apply Bank
                      </button>
                    </div>

                    {/* 4-Item Preview Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {items.map((item) => (
                        <div key={item.letter} className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 flex flex-col items-center text-center">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center mb-1">
                            {item.letter}
                          </span>
                          <div 
                            className="h-16 w-16 [&>svg]:w-full [&>svg]:h-full flex items-center justify-center my-1"
                            dangerouslySetInnerHTML={{ __html: item.svg }}
                          />
                          <span className="text-[11px] font-medium text-slate-700 truncate w-full">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI SYNTHESIZER */}
          {activeTab === 'ai_generate' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3>AI Educational Vector Synthesizer</h3>
                </div>
                <p className="text-xs text-indigo-700">
                  Synthesizes custom print-ready vector line art tailored to any unique English topic or classroom vocabulary set.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  What would you like the illustration to depict?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. A library reading desk with microscope and graduation cap"
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiVisual}
                    disabled={isGeneratingAi || !customPrompt.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Synthesizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Generate Illustration
                      </>
                    )}
                  </button>
                </div>
                {aiError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {aiError}
                  </p>
                )}
              </div>

              {/* Generated Result Preview */}
              {generatedSvg && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">Generated SVG Preview</span>
                    <button
                      type="button"
                      onClick={handleApplyAiVisual}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      Apply to Worksheet
                    </button>
                  </div>
                  <div 
                    className="p-4 flex items-center justify-center h-48 bg-slate-50/50 rounded-lg border border-slate-100 [&>svg]:max-h-full [&>svg]:w-auto"
                    dangerouslySetInnerHTML={{ __html: generatedSvg }}
                  />
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>All illustrations are formatted as high-contrast scalable SVGs for crisp A4 paper printouts.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
