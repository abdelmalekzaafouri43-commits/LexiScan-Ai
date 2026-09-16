import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Loader2, 
  Scan, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Code, 
  Eye, 
  ImageIcon, 
  AlertCircle 
} from 'lucide-react';
import { 
  ScannedZone, 
  SCANNER_DOCUMENT_PRESETS, 
  DocumentPreset 
} from '../utils/layoutPromptConverter';
import { LayoutPromptModal } from './LayoutPromptModal';

interface LayoutScannerProps {
  onApplyToGenerator?: (prompt: string, sampleWorksheet: string, metadata: { topic: string; gradeLevel: string; layoutTitle: string }) => void;
}

export function LayoutScanner({ onApplyToGenerator }: LayoutScannerProps) {
  const [selectedPreset, setSelectedPreset] = useState<DocumentPreset>(SCANNER_DOCUMENT_PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasImage, setHasImage] = useState(true);
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<ScannedZone[]>(SCANNER_DOCUMENT_PRESETS[0].zones);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [hierarchyViewMode, setHierarchyViewMode] = useState<'cards' | 'json'>('cards');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectPreset = (preset: DocumentPreset) => {
    setSelectedPreset(preset);
    setCustomImageSrc(null);
    setCustomFileName(null);
    setHasImage(true);
    setIsProcessing(true);
    setScanResults([]);

    setTimeout(() => {
      setScanResults(preset.zones);
      setIsProcessing(false);
      showToast(`Scanned layout preset: ${preset.name}`);
    }, 1000);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.pdf') && !file.name.endsWith('.png') && !file.name.endsWith('.jpg') && !file.name.endsWith('.jpeg')) {
      showToast('Please upload an image file (PNG, JPEG, WebP) or PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCustomImageSrc(result);
      setCustomFileName(file.name);
      setHasImage(true);
      setIsProcessing(true);
      setScanResults([]);

      // Perform simulated OCR and layout geometry detection on uploaded document
      setTimeout(() => {
        setScanResults([
          {
            id: 'cz-1',
            zone: 'Scanned Header & Identification',
            confidence: '99%',
            type: 'title',
            box: { top: '5%', left: '7%', width: '86%', height: '11%', color: 'border-blue-500 bg-blue-500/10' },
            description: 'Detected student name, date, and document title.'
          },
          {
            id: 'cz-2',
            zone: 'Scanned Directions & Rules',
            confidence: '95%',
            type: 'instructions',
            box: { top: '18%', left: '7%', width: '86%', height: '10%', color: 'border-amber-500 bg-amber-500/10' },
            description: 'Section guidance and time allocation instructions.'
          },
          {
            id: 'cz-3',
            zone: 'Section 1: Vocabulary Matching Matrix',
            confidence: '97%',
            type: 'matching',
            detectedItemsCount: 4,
            box: { top: '30%', left: '7%', width: '86%', height: '28%', color: 'border-emerald-500 bg-emerald-500/10' },
            description: '4-item bracket pairing matrix detected on left and right.'
          },
          {
            id: 'cz-4',
            zone: 'Section 2: Syntax Inquiries & Sentences',
            confidence: '96%',
            type: 'questions',
            detectedItemsCount: 3,
            box: { top: '61%', left: '7%', width: '86%', height: '32%', color: 'border-purple-500 bg-purple-500/10' },
            description: '3 guided practice questions with answer lines.'
          }
        ]);
        setIsProcessing(false);
        showToast(`Document "${file.name}" scanned successfully`);
      }, 1500);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleReScan = () => {
    setIsProcessing(true);
    setScanResults([]);
    setTimeout(() => {
      setScanResults(selectedPreset.zones);
      setIsProcessing(false);
      showToast('Layout re-analyzed');
    }, 1200);
  };

  const currentTitle = customFileName || selectedPreset.name;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 h-[calc(100vh-5rem)] overflow-hidden">
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange} 
        accept="image/*,.pdf" 
        className="hidden" 
      />

      {/* Left / Main: Scanner Interactive Canvas */}
      <div className="w-full lg:w-2/3 flex flex-col h-full bg-slate-100/90 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Canvas Toolbar */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Layout Scanner Canvas</span>
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {currentTitle}
            </span>
          </div>

          {/* Preset Selector Chips & Upload Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 hidden sm:inline">Presets:</span>
            {SCANNER_DOCUMENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors border ${
                  !customFileName && selectedPreset.id === preset.id
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800 transition-colors flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
        
        {/* Canvas Display Area */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex-1 overflow-y-auto p-6 bg-slate-200/50 dark:bg-slate-950/60 flex justify-center items-center relative"
        >
          {!hasImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-xl h-80 border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:border-emerald-500/50 dark:bg-slate-900/50 dark:hover:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer group shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Upload Worksheet Layout
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mb-4">
                Drag and drop an external worksheet image/PDF here to scan its structural layout, or click to browse.
              </p>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                Select File
              </span>
            </div>
          ) : (
            <div className="w-full max-w-[560px] aspect-[1/1.414] bg-white rounded-lg shadow-xl shadow-slate-300/60 dark:shadow-2xl dark:shadow-black/60 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden flex flex-col">
              
              {/* Document Background: Custom Image or Simulated Document Pattern */}
              {customImageSrc ? (
                <img 
                  src={customImageSrc} 
                  alt="Scanned Document" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="absolute inset-0 p-8 flex flex-col gap-6 select-none pointer-events-none opacity-40">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-300">
                    <div className="space-y-1">
                      <div className="h-4 w-44 bg-slate-800 rounded"></div>
                      <div className="h-2.5 w-28 bg-slate-400 rounded"></div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="h-3 w-28 bg-slate-400 rounded ml-auto"></div>
                      <div className="h-3 w-20 bg-slate-300 rounded ml-auto"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-300 rounded"></div>
                    <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="h-3.5 w-36 bg-slate-700 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="h-2.5 w-full bg-slate-300 rounded"></div>
                        <div className="h-2.5 w-5/6 bg-slate-300 rounded"></div>
                        <div className="h-2.5 w-4/5 bg-slate-300 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2.5 w-full bg-slate-200 rounded"></div>
                        <div className="h-2.5 w-5/6 bg-slate-200 rounded"></div>
                        <div className="h-2.5 w-4/5 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="h-3.5 w-32 bg-slate-700 rounded"></div>
                    <div className="space-y-3">
                      <div className="h-2.5 w-full bg-slate-300 rounded"></div>
                      <div className="h-2 w-full bg-slate-200 rounded"></div>
                      <div className="h-2.5 w-4/5 bg-slate-300 rounded"></div>
                      <div className="h-2 w-full bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Laser / Scanner Line during processing */}
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3">
                    <Scan className="w-7 h-7 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="w-44 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs font-semibold tracking-wider text-slate-200">
                    Extracting Layout Hierarchy & Zones...
                  </p>
                </div>
              )}

              {/* Rendered Bounding Boxes */}
              {!isProcessing && scanResults.map((result, idx) => {
                const isSelected = selectedZoneId === result.id;
                return (
                  <div 
                    key={result.id || idx}
                    onClick={() => setSelectedZoneId(isSelected ? null : result.id)}
                    className={`absolute border-2 rounded-md ${result.box.color} transition-all duration-300 cursor-pointer group hover:ring-2 hover:ring-emerald-400 ${
                      isSelected ? 'ring-2 ring-emerald-500 shadow-lg' : ''
                    }`}
                    style={{ 
                      top: result.box.top, 
                      left: result.box.left, 
                      width: result.box.width, 
                      height: result.box.height 
                    }}
                  >
                    {/* Hover Card */}
                    <div className="absolute -top-7 left-0 bg-slate-900/95 text-white text-[11px] px-2.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-medium flex items-center gap-1.5 border border-slate-700 pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{result.zone}</span>
                      <span className="text-slate-400 font-mono">({result.confidence})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Detected Hierarchy & Convert to AI Prompt Layout */}
      <div className="w-full lg:w-1/3 flex flex-col h-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden">
        
        {/* Right Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/90">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Detected Hierarchy</span>
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setHierarchyViewMode('cards')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                hierarchyViewMode === 'cards' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setHierarchyViewMode('json')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                hierarchyViewMode === 'json' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              JSON
            </button>
          </div>
        </div>
        
        {/* Right Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
          {scanResults.length > 0 ? (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{scanResults.length} zones successfully indexed</span>
                <button 
                  onClick={handleReScan}
                  className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-scan</span>
                </button>
              </div>

              {hierarchyViewMode === 'cards' ? (
                <div className="space-y-2.5">
                  {scanResults.map((zone, idx) => {
                    const isSelected = selectedZoneId === zone.id;
                    return (
                      <div 
                        key={zone.id || idx}
                        onClick={() => setSelectedZoneId(isSelected ? null : zone.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 shadow-xs' 
                            : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              zone.type === 'title' ? 'bg-blue-500' :
                              zone.type === 'instructions' ? 'bg-amber-500' :
                              zone.type === 'matching' ? 'bg-emerald-500' :
                              zone.type === 'grammar' ? 'bg-indigo-500' :
                              zone.type === 'true_false' ? 'bg-purple-500' : 'bg-cyan-500'
                            }`} />
                            {zone.zone}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                            {zone.confidence}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {zone.description || `Spatial region height: ${zone.box.height}, width: ${zone.box.width}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-200 overflow-x-auto shadow-inner border border-slate-800 max-h-72">
                  <pre>{JSON.stringify(scanResults.map(r => ({ zone: r.zone, type: r.type, confidence: r.confidence, box: r.box })), null, 2)}</pre>
                </div>
              )}

              {/* Conversion Highlight Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Ready for AI Prompt Conversion</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Convert these {scanResults.length} detected geometric zones into a plain-text prompt layout for Gemini, or apply it directly to the Worksheet Generator.
                </p>
              </div>

              {/* THE BUTTON: Convert to AI Prompt Layout */}
              <button 
                onClick={() => setIsPromptModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/20 text-sm cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Convert to AI Prompt Layout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <Scan className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No layout data detected yet.<br/>Upload a document or choose a preset to begin scanning.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Prompt Layout Converter Modal */}
      <LayoutPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        zones={scanResults}
        layoutTitle={currentTitle}
        defaultTopic={selectedPreset.topic}
        defaultGradeLevel={selectedPreset.gradeLevel}
        onApplyToGenerator={(prompt, sampleWorksheet, metadata) => {
          if (onApplyToGenerator) {
            onApplyToGenerator(prompt, sampleWorksheet, metadata);
          } else {
            showToast('Applied prompt layout to Worksheet Generator!');
          }
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
