import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Copy, 
  Download, 
  FilePlus2, 
  Sparkles, 
  FileText, 
  Printer, 
  Eye, 
  Type, 
  AlertCircle, 
  RefreshCw, 
  FileDown, 
  Check,
  LayoutList,
  Move,
  Layers,
  LayoutTemplate,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { PrintPreviewModal } from './PrintPreviewModal';
import { WorksheetQRCard, QRCodeSettings } from './WorksheetQRCard';
import { QRCodeConfigPanel } from './QRCodeConfigPanel';
import { WorksheetFont, WORKSHEET_FONTS } from '../utils/worksheetFonts';
import { FontSelector } from './FontSelector';
import { PrintConfirmationModal } from './PrintConfirmationModal';
import { exportWorksheetToPdf } from '../utils/pdfExport';
import { WorksheetDndBuilder } from './WorksheetDndBuilder';
import { 
  WorksheetTemplateId, 
  WORKSHEET_TEMPLATES 
} from '../utils/worksheetTemplates';
import { WorksheetTemplateSelector } from './WorksheetTemplateSelector';
import { WorksheetVisual, VisualStyle } from '../types/worksheetVisuals';
import { getCuratedVisualForTopic, createMatchingVisualBank } from '../utils/curatedVisualLibrary';
import { WorksheetVisualBlock } from './WorksheetVisualBlock';
import { VisualsManagerModal } from './VisualsManagerModal';
import { WorksheetSkeletonLoader } from './WorksheetSkeletonLoader';
import { ThemeExplorerBar } from './ThemeExplorerBar';
import { CurriculumThemeSelector } from './CurriculumThemeSelector';
import { WorksheetThemeItem } from '../utils/worksheetThemes';
import { WorksheetDocumentRenderer, WorksheetThemeColor, WorksheetBorderStyle } from './WorksheetDocumentRenderer';
import { WorksheetStyleToolbar } from './WorksheetStyleToolbar';
import { TemplatePreloadData } from '../types';
import { Image as ImageIcon, Palette, UploadCloud, FileUp } from 'lucide-react';

export interface WorksheetGeneratorProps {
  scannedLayoutData?: {
    prompt: string;
    sampleWorksheet: string;
    metadata: { topic: string; gradeLevel: string; layoutTitle: string };
  } | null;
  onClearScannedLayout?: () => void;
  templatePreloadData?: TemplatePreloadData | null;
  onClearTemplatePreload?: () => void;
  onNavigateToScanner?: () => void;
}

export function WorksheetGenerator({
  scannedLayoutData,
  onClearScannedLayout,
  templatePreloadData,
  onClearTemplatePreload,
  onNavigateToScanner,
}: WorksheetGeneratorProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'builder' | 'document'>('builder');
  const [selectedTemplate, setSelectedTemplate] = useState<WorksheetTemplateId>('vocab_matching');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isDirectPrintConfirmOpen, setIsDirectPrintConfirmOpen] = useState(false);
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);

  const generatorFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Visuals & Illustrations state
  const [includeVisuals, setIncludeVisuals] = useState(true);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('line_art');
  const [visuals, setVisuals] = useState<WorksheetVisual[]>(() => {
    const defaultVisual = getCuratedVisualForTopic('Kitchen & Cooking', 'line_art');
    return defaultVisual ? [defaultVisual] : [];
  });

  const [activeCustomPrompt, setActiveCustomPrompt] = useState<string | null>(null);
  const [customLayoutTitle, setCustomLayoutTitle] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'config' | 'preview'>('config');
  const [highlightPreview, setHighlightPreview] = useState(false);
  const previewContainerRef = React.useRef<HTMLDivElement | null>(null);

  const focusPreviewCanvas = () => {
    setMobileTab('preview');
    setHighlightPreview(true);
    setTimeout(() => {
      setHighlightPreview(false);
    }, 2500);
    if (previewContainerRef.current) {
      previewContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  
  const [topic, setTopic] = useState('Kitchen & Cooking');
  const [gradeLevel, setGradeLevel] = useState('beginner (A1-A2)');
  const [fontStyle, setFontStyle] = useState<WorksheetFont>('sans');
  const [themeColor, setThemeColor] = useState<WorksheetThemeColor>('navy');
  const [borderStyle, setBorderStyle] = useState<WorksheetBorderStyle>('classic_frame');
  const [marginSize, setMarginSize] = useState<'compact' | 'normal' | 'spacious'>('normal');

  const fontConfig = WORKSHEET_FONTS[fontStyle] || WORKSHEET_FONTS.sans;
  const activeTemplate = WORKSHEET_TEMPLATES[selectedTemplate] || WORKSHEET_TEMPLATES.vocab_matching;

  // React to incoming template preload from Dashboard
  useEffect(() => {
    if (templatePreloadData && templatePreloadData.templateId) {
      const tplId = templatePreloadData.templateId;
      const tpl = WORKSHEET_TEMPLATES[tplId];
      if (tpl) {
        setSelectedTemplate(tplId);
        setActiveCustomPrompt(null);
        setCustomLayoutTitle(null);

        const targetTopic = templatePreloadData.topic || tpl.suggestedTopics[0] || 'English Language Skills';
        const targetLevel = templatePreloadData.gradeLevel || 'intermediate (B1-B2)';

        setTopic(targetTopic);
        setGradeLevel(targetLevel);

        // Apply theme color based on template category
        if (tplId === 'grammar_exercise') {
          setThemeColor('emerald');
        } else if (tplId === 'reading_comprehension') {
          setThemeColor('navy');
        } else if (tplId === 'vocab_matching') {
          setThemeColor('indigo');
        } else if (tplId === 'quiz') {
          setThemeColor('amber');
        }

        // Apply curated visual for topic
        if (includeVisuals) {
          const vis = getCuratedVisualForTopic(targetTopic, visualStyle);
          setVisuals(vis ? [vis] : []);
        }

        // Preload sample worksheet if requested
        if (templatePreloadData.autoLoadSample) {
          const sample = tpl.sampleGenerator(targetTopic, targetLevel);
          setWorksheet(sample);
          setPreviewMode('builder');
          setGenerationNotice(`Pre-filled generator settings with "${tpl.name}" template.`);
        }

        if (onClearTemplatePreload) {
          onClearTemplatePreload();
        }
      }
    }
  }, [templatePreloadData, onClearTemplatePreload, includeVisuals, visualStyle]);

  // React to incoming scanned prompt blueprint from Layout Scanner
  useEffect(() => {
    if (scannedLayoutData) {
      setActiveCustomPrompt(scannedLayoutData.prompt);
      setCustomLayoutTitle(scannedLayoutData.metadata.layoutTitle);
      if (scannedLayoutData.metadata.topic) {
        setTopic(scannedLayoutData.metadata.topic);
      }
      if (scannedLayoutData.metadata.gradeLevel) {
        setGradeLevel(scannedLayoutData.metadata.gradeLevel);
      }
      setWorksheet(scannedLayoutData.sampleWorksheet);
      setPreviewMode('builder');
      setGenerationNotice(`Loaded layout structure from Scanned Blueprint: "${scannedLayoutData.metadata.layoutTitle}"`);
    }
  }, [scannedLayoutData]);

  const [qrSettings, setQrSettings] = useState<QRCodeSettings>({
    enabled: true,
    url: 'https://learnenglish.britishcouncil.org',
    title: 'Scan for Audio & Online Practice',
    description: 'Scan with your mobile camera to listen to dialogue pronunciation and complete interactive exercises.',
    position: 'header',
  });

  const handleSelectTheme = (themeName: string) => {
    setTopic(themeName);
    if (includeVisuals) {
      if (selectedTemplate === 'vocab_matching') {
        const matchingBank = createMatchingVisualBank(themeName);
        if (matchingBank) {
          setVisuals([matchingBank]);
        } else {
          const vis = getCuratedVisualForTopic(themeName, visualStyle);
          setVisuals(vis ? [vis] : []);
        }
      } else {
        const vis = getCuratedVisualForTopic(themeName, visualStyle);
        setVisuals(vis ? [vis] : []);
      }
    }
    setQrSettings(prev => ({
      ...prev,
      title: `${themeName} • Audio & Exercises`,
      url: prev.url.includes('forvo') 
        ? `https://forvo.com/search/${encodeURIComponent(themeName)}/`
        : prev.url.includes('quizlet')
        ? `https://quizlet.com/search?query=${encodeURIComponent(themeName)}&type=sets`
        : `https://learnenglish.britishcouncil.org/search?keywords=${encodeURIComponent(themeName)}`
    }));
  };

  const handleApplyCurriculumTheme = (themeItem: WorksheetThemeItem) => {
    setTopic(themeItem.name);
    // Construct rich prompt guidance incorporating key vocabulary and grammar focus
    const enrichedPrompt = `Focus strictly on the pedagogical theme: "${themeItem.name}" (${themeItem.category}).
Key Target Vocabulary to include: ${themeItem.keyVocabulary.join(', ')}.
Grammar & Linguistic Focus: ${themeItem.suggestedGrammar}.
Context & Reading Snippet: ${themeItem.sampleReadingSnippet}.
Instructional Goal: ${themeItem.suggestedPrompt}`;
    setActiveCustomPrompt(enrichedPrompt);
    setCustomLayoutTitle(`${themeItem.name} (${themeItem.category})`);

    if (includeVisuals) {
      if (selectedTemplate === 'vocab_matching') {
        const matchingBank = createMatchingVisualBank(themeItem.name);
        if (matchingBank) {
          setVisuals([matchingBank]);
        } else {
          const vis = getCuratedVisualForTopic(themeItem.name, visualStyle);
          setVisuals(vis ? [vis] : []);
        }
      } else {
        const vis = getCuratedVisualForTopic(themeItem.name, visualStyle);
        setVisuals(vis ? [vis] : []);
      }
    }

    setQrSettings(prev => ({
      ...prev,
      title: `${themeItem.name} • Audio & Exercises`,
      url: `https://learnenglish.britishcouncil.org/search?keywords=${encodeURIComponent(themeItem.name)}`
    }));

    setGenerationNotice(`Selected Theme: "${themeItem.name}" • Target vocabulary (${themeItem.keyVocabulary.slice(0, 4).join(', ')}...) & grammar loaded`);
  };

  const handleSelectTemplate = (templateId: WorksheetTemplateId, autoLoadSample: boolean = false) => {
    setSelectedTemplate(templateId);
    const tpl = WORKSHEET_TEMPLATES[templateId];

    // If current topic is empty or matches a default suggested topic from other templates, auto-suggest first topic of new template
    const currentTopicEmpty = !topic.trim();
    const isPreviousDefault = Object.values(WORKSHEET_TEMPLATES).some(t => t.suggestedTopics.includes(topic));
    let activeTopic = topic;
    if (currentTopicEmpty || isPreviousDefault) {
      if (tpl.suggestedTopics[0]) {
        activeTopic = tpl.suggestedTopics[0];
        setTopic(activeTopic);
      }
    }

    if (includeVisuals) {
      if (templateId === 'vocab_matching') {
        const matchingBank = createMatchingVisualBank(activeTopic);
        setVisuals(matchingBank ? [matchingBank] : []);
      } else {
        const vis = getCuratedVisualForTopic(activeTopic, visualStyle);
        setVisuals(vis ? [vis] : []);
      }
    }

    // Auto-adjust structure if no worksheet exists or explicit autoLoadSample is true
    if (!worksheet || autoLoadSample) {
      const topicToUse = activeTopic.trim() || tpl.suggestedTopics[0] || 'Everyday English';
      const sample = tpl.sampleGenerator(topicToUse, gradeLevel);
      setWorksheet(sample);
      setPreviewMode('builder');
      setGenerationNotice(`Switched to "${tpl.name}" layout • Sections auto-adjusted`);
    } else {
      setGenerationNotice(`Selected "${tpl.name}" layout • Click "Load Template Layout" or "Generate" to apply`);
    }
  };

  const handleApplyTemplateSample = (templateId: WorksheetTemplateId) => {
    setSelectedTemplate(templateId);
    const tpl = WORKSHEET_TEMPLATES[templateId];
    const activeTopic = topic.trim() || tpl.suggestedTopics[0] || 'Everyday English';
    setTopic(activeTopic);
    const sample = tpl.sampleGenerator(activeTopic, gradeLevel);
    setWorksheet(sample);
    if (includeVisuals) {
      if (templateId === 'vocab_matching') {
        const matchingBank = createMatchingVisualBank(activeTopic);
        setVisuals(matchingBank ? [matchingBank] : []);
      } else {
        const vis = getCuratedVisualForTopic(activeTopic, visualStyle);
        setVisuals(vis ? [vis] : []);
      }
    }
    setPreviewMode('builder');
    setGenerationNotice(`Loaded "${tpl.name}" structure • Ready for Drag-and-Drop editing`);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationNotice(null);
    
    try {
      const response = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic.trim(), 
          gradeLevel,
          template: selectedTemplate,
          customPrompt: activeCustomPrompt 
        }),
      });
      
      const data = await response.json();
      
      if (data.worksheet) {
        setWorksheet(data.worksheet);
        if (includeVisuals && visuals.length === 0) {
          const autoVis = selectedTemplate === 'vocab_matching'
            ? createMatchingVisualBank(topic)
            : getCuratedVisualForTopic(topic, visualStyle);
          if (autoVis) setVisuals([autoVis]);
        }
        if (data.notice) {
          setGenerationNotice(data.notice);
        } else {
          setGenerationNotice(`Generated with "${activeTemplate.name}" layout`);
        }
        focusPreviewCanvas();
      } else {
        setErrorMessage(data.error || data.details || 'Unable to generate worksheet. Please try again.');
      }
    } catch (error: any) {
      console.warn('Network / backend endpoint unavailable (static hosting mode). Generating local template:', error);
      // Seamless static fallback for GitHub Pages and offline phone usage
      const fallbackWorksheet = activeTemplate.sampleGenerator(topic.trim(), gradeLevel);
      setWorksheet(fallbackWorksheet);
      if (includeVisuals && visuals.length === 0) {
        const autoVis = selectedTemplate === 'vocab_matching'
          ? createMatchingVisualBank(topic)
          : getCuratedVisualForTopic(topic, visualStyle);
        if (autoVis) setVisuals([autoVis]);
      }
      setGenerationNotice(`Generated structured "${activeTemplate.name}" worksheet (Static Engine)`);
      focusPreviewCanvas();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadSample = () => {
    const selectedTopic = topic.trim() || activeTemplate.suggestedTopics[0] || 'Kitchen & Cooking';
    setTopic(selectedTopic);
    const sample = activeTemplate.sampleGenerator(selectedTopic, gradeLevel);

    setWorksheet(sample);
    setPreviewMode('builder');
    setGenerationNotice(`Loaded "${activeTemplate.name}" structure • Ready for Drag-and-Drop Reordering`);
    focusPreviewCanvas();
  };

  const getExportText = () => {
    if (!worksheet) return '';
    if (!qrSettings.enabled) return worksheet;
    return `${worksheet}\n\n==========================================\nDIGITAL COMPANION RESOURCE (QR CODE ON PRINTED SHEET)\nResource: ${qrSettings.title}\nDirect Link: ${qrSettings.url}\nInstructions: ${qrSettings.description}\n==========================================`;
  };

  const copyToClipboard = () => {
    if (worksheet) {
      navigator.clipboard.writeText(getExportText());
    }
  };

  const handleDownloadTxt = () => {
    if (!worksheet) return;
    const element = document.createElement('a');
    const file = new Blob([getExportText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const safeTitle = (topic || 'worksheet').toLowerCase().replace(/[^a-z0-9]/g, '_');
    element.download = `${safeTitle}_a4_worksheet.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPdf = async () => {
    if (!worksheet || isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfSuccess(false);
    setPdfProgressText('Generating A4 PDF...');

    try {
      await exportWorksheetToPdf({
        worksheetText: worksheet,
        topic,
        gradeLevel,
        fontStyle,
        qrSettings,
        marginType: 'normal',
        onProgress: (p) => setPdfProgressText(p.step),
      });
      setPdfSuccess(true);
      setTimeout(() => {
        setPdfSuccess(false);
        setPdfProgressText(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setPdfProgressText('PDF export failed. Try again.');
      setTimeout(() => setPdfProgressText(null), 3500);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleProcessDroppedFile = (file: File) => {
    if (!file) return;
    
    // Check if it's a text/markdown file
    const isText = file.type.startsWith('text/') || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md') || 
      file.name.endsWith('.doc') || 
      file.name.endsWith('.json');

    if (isText) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content && content.trim()) {
          setWorksheet(content);
          setPreviewMode('builder');
          setGenerationNotice(`Imported external worksheet: "${file.name}"`);
          
          // Auto-detect topic from file name
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          if (cleanName && cleanName.length > 2) {
            setTopic(cleanName);
          }
        }
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/') || file.name.endsWith('.pdf')) {
      // It's an image or PDF - if scanner navigation is available, guide them or load directly
      if (onNavigateToScanner) {
        onNavigateToScanner();
      } else {
        setGenerationNotice(`Image/PDF detected ("${file.name}"). Switch to the "External Layout Scanner" tab to scan its visual layout.`);
      }
    } else {
      setGenerationNotice(`Unsupported file format. Please drop a .txt, .md, or switch to External Layout Scanner for images/PDFs.`);
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverCanvas(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessDroppedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8 overflow-hidden">
      
      {/* Mobile/Tablet Screen Switcher (visible on < lg screens) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl mb-4 border border-slate-300 dark:border-slate-700 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('config')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'config'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Setup & Parameters</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>2. Live Worksheet Preview</span>
          {worksheet ? (
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Ready
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          )}
        </button>
      </div>

      {/* Main Two-Column Viewport */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 overflow-hidden">
        
        {/* Left Column: Controls */}
        <div className={`w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-1 pb-8 ${
          mobileTab === 'config' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Generation Parameters
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Step 1 of 2
              </span>
            </div>
          
          <div className="space-y-5">
            {/* Scanned Layout Active Banner */}
            {activeCustomPrompt && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold">Scanned Prompt Layout Active</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold">
                    Custom Blueprint
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Using structural directives converted from: <strong>{customLayoutTitle || 'External Worksheet'}</strong>
                </p>
                <div className="pt-1 flex items-center justify-between border-t border-emerald-200 dark:border-emerald-800/80 text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400">AI generation will follow this custom layout</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCustomPrompt(null);
                      setCustomLayoutTitle(null);
                      if (onClearScannedLayout) onClearScannedLayout();
                    }}
                    className="font-semibold text-emerald-800 dark:text-emerald-200 hover:underline cursor-pointer"
                  >
                    Revert to Default
                  </button>
                </div>
              </div>
            )}

            {/* Template Selector Component */}
            <WorksheetTemplateSelector
              selectedTemplateId={selectedTemplate}
              onSelectTemplate={(id) => {
                // If user clicks a standard template, prompt them or clear the custom scanned prompt
                setActiveCustomPrompt(null);
                setCustomLayoutTitle(null);
                if (onClearScannedLayout) onClearScannedLayout();
                handleSelectTemplate(id, false);
              }}
              onApplyTemplateSample={(id) => {
                setActiveCustomPrompt(null);
                setCustomLayoutTitle(null);
                if (onClearScannedLayout) onClearScannedLayout();
                handleApplyTemplateSample(id);
              }}
              hasExistingWorksheet={!!worksheet}
            />

            {/* Thematic Curriculum Dropdown & Quick Selector (Pollution, Accommodations, Celebrations, Travelling, Entertainments, Family, Friendships) */}
            <CurriculumThemeSelector
              currentTopic={topic}
              onSelectTheme={handleApplyCurriculumTheme}
              onCustomTopicChange={(customTopic) => {
                setTopic(customTopic);
                handleSelectTheme(customTopic);
              }}
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Proficiency Level
              </label>
              <div className="relative">
                <select 
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="beginner (A1-A2)">Beginner (A1-A2)</option>
                  <option value="intermediate (B1-B2)">Intermediate (B1-B2)</option>
                  <option value="advanced (C1-C2)">Advanced (C1-C2)</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Font Style Selection */}
            <FontSelector
              value={fontStyle}
              onChange={setFontStyle}
              variant="card"
            />

            {/* Visuals & Educational Illustrations Config Section */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Worksheet Illustrations
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVisuals}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setIncludeVisuals(enabled);
                      if (enabled && visuals.length === 0) {
                        const autoVis = selectedTemplate === 'vocab_matching'
                          ? createMatchingVisualBank(topic)
                          : getCuratedVisualForTopic(topic, visualStyle);
                        if (autoVis) setVisuals([autoVis]);
                      } else if (!enabled) {
                        setVisuals([]);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {includeVisuals && (
                <div className="space-y-2.5 pt-1">
                  {/* Style Toggle */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Visual Style:</span>
                    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          setVisualStyle('line_art');
                          if (visuals.length > 0) {
                            setVisuals(visuals.map(v => ({ ...v, style: 'line_art' })));
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                          visualStyle === 'line_art'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 font-bold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Line Art
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVisualStyle('vector_accent');
                          if (visuals.length > 0) {
                            setVisuals(visuals.map(v => ({ ...v, style: 'vector_accent' })));
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                          visualStyle === 'vector_accent'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 font-bold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Color Accent
                      </button>
                    </div>
                  </div>

                  {/* Active Visual indicator & Modal trigger */}
                  <div className="flex items-center justify-between pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {visuals.length > 0 ? `${visuals.length} graphic attached` : 'No graphic attached'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsVisualModalOpen(true)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Browse / Synthesize
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className={`w-full mt-4 flex items-center justify-center gap-2 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                activeCustomPrompt
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating {activeCustomPrompt ? 'from Scanned Layout' : activeTemplate.name}...
                </>
              ) : (
                <>
                  {activeCustomPrompt ? <Sparkles className="w-5 h-5" /> : <FilePlus2 className="w-5 h-5" />}
                  {activeCustomPrompt ? 'Generate from Scanned Layout' : `Generate ${activeTemplate.name}`}
                </>
              )}
            </button>

            {worksheet && (
              <button
                type="button"
                onClick={focusPreviewCanvas}
                className="w-full mt-2.5 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-primary-50 hover:from-indigo-100 hover:to-primary-100 dark:from-indigo-950/70 dark:to-primary-950/70 text-primary-700 dark:text-primary-300 text-xs font-bold border border-primary-200 dark:border-primary-800/80 transition-all shadow-xs group"
              >
                <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>View Sheet in Live Preview Canvas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* QR Code Digital Resource Config Section */}
        <QRCodeConfigPanel
          settings={qrSettings}
          onChange={setQrSettings}
          topic={topic}
        />
      </div>

      {/* Right Column: Live Preview & Interactive Builder */}
      <div 
        ref={previewContainerRef}
        className={`w-full lg:w-2/3 flex flex-col h-full overflow-hidden bg-slate-100/90 dark:bg-slate-950/70 border rounded-2xl shadow-sm transition-all duration-500 ${
          mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
        } ${
          highlightPreview 
            ? 'ring-4 ring-primary-500/60 border-primary-500 shadow-xl' 
            : 'border-slate-200/90 dark:border-slate-800'
        }`}
      >
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/90">
          
          {/* Left: Mode Switcher & Metadata */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Live Preview Indicator Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>LIVE PREVIEW</span>
            </div>

            {/* Segmented View Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setPreviewMode('builder')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewMode === 'builder'
                    ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Drag-and-Drop builder to easily reorder sections and questions"
              >
                <Move className="w-3.5 h-3.5" />
                <span>Drag & Drop Builder</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('document')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewMode === 'document'
                    ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Exact A4 printed sheet document preview"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>A4 Document</span>
              </button>
            </div>

            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 ${
              activeCustomPrompt
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20'
            }`}>
              <LayoutTemplate className={`w-3 h-3 ${activeCustomPrompt ? 'text-emerald-500' : 'text-primary-500'}`} />
              <span>Layout: <strong className="font-semibold">{activeCustomPrompt ? `Scanned (${customLayoutTitle || 'External'})` : activeTemplate.name}</strong></span>
            </span>

            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium ${fontConfig.className}`}>
              {fontConfig.name}
            </span>

            {qrSettings.enabled && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 font-medium">
                QR Code Linked ({qrSettings.position === 'header' ? 'Header' : 'Footer'})
              </span>
            )}
            
            {generationNotice && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-medium truncate max-w-xs">
                {generationNotice}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Hidden file input for manual upload */}
            <input 
              type="file"
              ref={generatorFileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleProcessDroppedFile(e.target.files[0]);
                }
              }}
              accept=".txt,.md,.doc,.json,image/*,.pdf"
              className="hidden"
            />

            <button
              onClick={() => generatorFileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              title="Import or drop an external worksheet file (.txt, .md, image, or .pdf)"
            >
              <FileUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Import File</span>
            </button>

            <button 
              onClick={() => setIsPrintPreviewOpen(true)}
              disabled={!worksheet || isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all disabled:opacity-30 disabled:hover:bg-primary-600 shadow-sm shadow-primary-600/20"
              title="Open Dedicated Print Preview Modal"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>

            {/* Client-Side Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={!worksheet || isExportingPdf}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs ${
                pdfSuccess 
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
              }`}
              title="Export and save worksheet locally as an A4 PDF document"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 dark:text-rose-400" />
              ) : pdfSuccess ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              )}
              <span>{isExportingPdf ? 'Exporting...' : pdfSuccess ? 'PDF Saved!' : 'Save PDF'}</span>
            </button>
             <button 
              onClick={copyToClipboard}
              disabled={!worksheet || isExportingPdf}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Copy to Clipboard (includes Digital Resource info)"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDownloadTxt}
              disabled={!worksheet || isExportingPdf}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Download TXT"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOverCanvas(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDraggingOverCanvas(true);
          }}
          onDragLeave={(e) => {
            // Only deactivate if leaving the container
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDraggingOverCanvas(false);
            }
          }}
          onDrop={handleCanvasDrop}
          className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-200/50 dark:bg-slate-950/60 flex justify-center print-area relative"
        >
          {/* Drag & Drop Visual Overlay */}
          {isDraggingOverCanvas && (
            <div className="absolute inset-0 z-50 bg-primary-600/90 dark:bg-primary-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-white border-4 border-dashed border-white/80 rounded-xl m-4 animate-in fade-in zoom-in-95 pointer-events-none">
              <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center mb-3">
                <UploadCloud className="w-8 h-8 text-white animate-bounce" />
              </div>
              <h3 className="text-xl font-bold">Drop Worksheet File Here</h3>
              <p className="text-xs text-white/80 mt-1 max-w-sm text-center">
                Release your file to instantly import into the Interactive Drag & Drop Builder
              </p>
            </div>
          )}

          {errorMessage ? (
            <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto my-auto text-center gap-4 bg-white dark:bg-slate-900 border border-red-500/30 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">Generation Notice</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            </div>
          ) : isGenerating ? (
            <WorksheetSkeletonLoader 
              topic={topic}
              gradeLevel={gradeLevel}
              templateName={activeTemplate.name}
            />
          ) : worksheet ? (
            previewMode === 'builder' ? (
              /* Drag-and-Drop Interactive Builder View */
              <div className="w-full max-w-4xl">
                <WorksheetDndBuilder 
                  worksheetText={worksheet} 
                  onChange={setWorksheet} 
                  topic={topic} 
                  gradeLevel={gradeLevel}
                  visuals={visuals}
                  onUpdateVisuals={setVisuals}
                />
              </div>
            ) : (
              /* Standard A4 Formatted Document View with Structured Pedagogical Styling */
              <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 w-full max-w-[1100px] relative animate-fadeIn">
                
                {/* FLOATING QUICK CUSTOMIZER PANEL */}
                <div className="w-full xl:w-56 shrink-0 xl:sticky xl:top-6 space-y-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                    <Sliders className="w-4 h-4 text-primary-500" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Quick Layout Panel</span>
                  </div>

                  {/* Font Toggles */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">Worksheet Typography</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => setFontStyle('sans')}
                        className={`py-1 rounded-md transition-all ${fontStyle === 'sans' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Sans
                      </button>
                      <button
                        onClick={() => setFontStyle('serif')}
                        className={`py-1 rounded-md transition-all ${fontStyle === 'serif' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Serif
                      </button>
                      <button
                        onClick={() => setFontStyle('handwriting')}
                        className={`py-1 rounded-md transition-all ${fontStyle === 'handwriting' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Script
                      </button>
                    </div>
                  </div>

                  {/* Margin Size Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">Worksheet Margin Sizes</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => setMarginSize('compact')}
                        className={`py-1 rounded-md transition-all ${marginSize === 'compact' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Compact
                      </button>
                      <button
                        onClick={() => setMarginSize('normal')}
                        className={`py-1 rounded-md transition-all ${marginSize === 'normal' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setMarginSize('spacious')}
                        className={`py-1 rounded-md transition-all ${marginSize === 'spacious' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Wide
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main A4 sheet layout & toolbar */}
                <div className="flex-1 flex flex-col items-center gap-4 w-full max-w-[794px]">
                  {/* Document Styling Toolbar (Color themes, border styles, font family) */}
                  <div className="w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800">
                    <WorksheetStyleToolbar 
                      themeColor={themeColor}
                      onChangeThemeColor={setThemeColor}
                      borderStyle={borderStyle}
                      onChangeBorderStyle={setBorderStyle}
                      fontStyle={fontStyle}
                      onChangeFontStyle={setFontStyle}
                    />
                  </div>

                  <div className="w-full bg-white shadow-xl shadow-slate-300/60 dark:shadow-2xl dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 rounded-sm min-h-[1123px] shrink-0 print-page text-slate-900 relative">
                    <WorksheetDocumentRenderer 
                      worksheetText={worksheet}
                      topic={topic}
                      gradeLevel={gradeLevel}
                      fontStyle={fontStyle}
                      themeColor={themeColor}
                      borderStyle={borderStyle}
                      qrSettings={qrSettings}
                      visuals={includeVisuals ? visuals : []}
                      marginSize={marginSize}
                    />
                  </div>
                </div>

              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4 h-full max-w-lg text-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200 dark:border-slate-800 rounded-2xl my-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 flex items-center justify-center border border-primary-200 dark:border-primary-800/60 text-primary-600 dark:text-primary-400 shadow-2xs">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 mb-2">
                  Live Preview Canvas
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Your Worksheet Will Appear Here</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  This right panel is your live A4 preview and interactive builder. Once you click <strong className="text-primary-600 dark:text-primary-400">"Generate"</strong> or choose a sample below, your full worksheet, questions, and illustrations will render right here ready to edit, reorder, and export to PDF.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 w-full pt-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-xs shadow-primary-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Load {activeTemplate.name} Sample to Preview Now</span>
                </button>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-2">
                    Or quickly preview a specific layout:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyTemplateSample('vocab_matching')}
                      className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-500/20 dark:hover:text-primary-300 border border-slate-200 dark:border-slate-700 transition-colors truncate"
                    >
                      Vocab Match
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplateSample('grammar_exercise')}
                      className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-500/20 dark:hover:text-primary-300 border border-slate-200 dark:border-slate-700 transition-colors truncate"
                    >
                      Grammar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplateSample('quiz')}
                      className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-500/20 dark:hover:text-primary-300 border border-slate-200 dark:border-slate-700 transition-colors truncate"
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Visual A4 Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        worksheetText={worksheet || ''}
        topic={topic}
        gradeLevel={gradeLevel}
        onDownloadTxt={handleDownloadTxt}
        qrSettings={qrSettings}
        onUpdateQrSettings={setQrSettings}
        fontStyle={fontStyle}
        onUpdateFontStyle={setFontStyle}
        themeColor={themeColor}
        onUpdateThemeColor={setThemeColor}
        borderStyle={borderStyle}
        onUpdateBorderStyle={setBorderStyle}
        visuals={visuals}
      />

      {/* Visuals Manager Modal for generator sidebar trigger */}
      <VisualsManagerModal
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
        currentTopic={topic}
        onSelectVisual={(newVisual) => {
          setVisuals([newVisual]);
          setIncludeVisuals(true);
        }}
      />

      {/* User Confirmation Dialog before triggering Print directly */}
      <PrintConfirmationModal
        isOpen={isDirectPrintConfirmOpen}
        onClose={() => setIsDirectPrintConfirmOpen(false)}
        onConfirmPrint={() => {
          setIsDirectPrintConfirmOpen(false);
          setIsPrintPreviewOpen(true);
          setTimeout(() => {
            window.print();
          }, 300);
        }}
        onSavePdf={() => {
          setIsDirectPrintConfirmOpen(false);
          handleExportPdf();
        }}
        topic={topic}
        gradeLevel={gradeLevel}
        fontStyle={fontStyle}
        qrSettings={qrSettings}
        onChangeFont={setFontStyle}
      />

      {/* Floating Status Notification for Direct PDF Export */}
      {pdfProgressText && (
        <div 
          id="direct-pdf-export-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3"
        >
          {isExportingPdf && <Loader2 className="w-4 h-4 animate-spin text-rose-400" />}
          {pdfSuccess && <Check className="w-4 h-4 text-emerald-400" />}
          <span className="text-slate-200">{pdfProgressText}</span>
        </div>
      )}
    </div>
  );
}

