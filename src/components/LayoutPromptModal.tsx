import React, { useState, useMemo } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileDown, 
  Sparkles, 
  ArrowRight, 
  Code, 
  Layers, 
  Eye, 
  CheckCircle2, 
  Sliders,
  FileText
} from 'lucide-react';
import { 
  ScannedZone, 
  convertZonesToAiPrompt, 
  generateSampleFromZones 
} from '../utils/layoutPromptConverter';

interface LayoutPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: ScannedZone[];
  layoutTitle?: string;
  defaultTopic?: string;
  defaultGradeLevel?: string;
  onApplyToGenerator: (prompt: string, sampleWorksheet: string, metadata: { topic: string; gradeLevel: string; layoutTitle: string }) => void;
}

export function LayoutPromptModal({
  isOpen,
  onClose,
  zones,
  layoutTitle = 'Scanned Worksheet Layout',
  defaultTopic = 'Public Transit & Commuting',
  defaultGradeLevel = 'intermediate (B1-B2)',
  onApplyToGenerator
}: LayoutPromptModalProps) {
  const [activeTab, setActiveTab] = useState<'prompt' | 'blueprint' | 'preview'>('prompt');
  const [topic, setTopic] = useState(defaultTopic);
  const [gradeLevel, setGradeLevel] = useState(defaultGradeLevel);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state if defaults change
  React.useEffect(() => {
    if (defaultTopic) setTopic(defaultTopic);
  }, [defaultTopic]);

  React.useEffect(() => {
    if (defaultGradeLevel) setGradeLevel(defaultGradeLevel);
  }, [defaultGradeLevel]);

  const generatedPrompt = useMemo(() => {
    return convertZonesToAiPrompt(zones, {
      topic,
      gradeLevel,
      includeAnswerKey,
    });
  }, [zones, topic, gradeLevel, includeAnswerKey]);

  const sampleWorksheet = useMemo(() => {
    return generateSampleFromZones(zones, topic, gradeLevel);
  }, [zones, topic, gradeLevel]);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_prompt_layout_${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    onApplyToGenerator(generatedPrompt, sampleWorksheet, {
      topic,
      gradeLevel,
      layoutTitle,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  AI Prompt Layout Blueprint
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                  {zones.length} Zones Converted
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Derived from scanned document structure: <span className="font-medium text-slate-700 dark:text-slate-300">{layoutTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Parameter Configuration Bar */}
        <div className="px-6 py-3 bg-slate-100/70 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Target Topic:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Asking for Directions"
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Proficiency:</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="beginner (A1-A2)">Beginner (A1-A2)</option>
              <option value="intermediate (B1-B2)">Intermediate (B1-B2)</option>
              <option value="advanced (C1-C2)">Advanced (C1-C2)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Include Answer Key Prompt</span>
            </label>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold transition-all ${
                activeTab === 'prompt'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Prompt Layout Text</span>
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold transition-all ${
                activeTab === 'blueprint'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Zone-to-Section Mapping</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Expected Output Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Copy prompt text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Download prompt file (.txt)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/40">
          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Gemini API Plain-Text Generation Directive</span>
                <span>~{Math.round(generatedPrompt.length / 4)} tokens</span>
              </div>
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 max-h-[440px] leading-relaxed select-text">
                <pre className="whitespace-pre-wrap">{generatedPrompt}</pre>
              </div>
            </div>
          )}

          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The scanner converted the physical document geometry into structured section directives:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {zones.map((zone, idx) => (
                  <div 
                    key={zone.id || idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {zone.zone}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {zone.confidence} confidence
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mapped to: <strong className="text-slate-700 dark:text-slate-300 uppercase">{zone.type} format</strong>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {zone.description || `Spatial region height: ${zone.box.height}, width: ${zone.box.width}. Configured for ${zone.detectedItemsCount || 3} items.`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Simulated Output Generated From This Layout</span>
                <span className="text-emerald-600 font-medium">Ready for Drag-and-Drop Builder</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs font-mono text-xs text-slate-800 dark:text-slate-200 max-h-[440px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {sampleWorksheet}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel & Return to Scanner
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span>Apply to Worksheet Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
