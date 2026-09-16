import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText,
  Trash2, 
  Maximize2, 
  Palette,
  Loader2,
  BookOpen,
  ArrowRight,
  GraduationCap,
  MessageSquare,
  RefreshCw,
  Plus,
  Compass,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Wand2
} from 'lucide-react';
import { WorksheetDocumentRenderer, WorksheetThemeColor, WorksheetBorderStyle } from './WorksheetDocumentRenderer';
import { WorksheetFont } from '../utils/worksheetFonts';
import { exportWorksheetToPdf } from '../utils/pdfExport';
import { PrintPreviewModal } from './PrintPreviewModal';
import { WorksheetVisual, VisualStyle } from '../types/worksheetVisuals';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  feedback?: 'agreed' | 'disagreed' | null;
  feedbackReason?: string;
  worksheetAtThisStep?: string;
}

export function AIChatStudio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello, colleague! I am your Senior English Curriculum Partner. With years of experience drafting assessments and interactive lesson plans, I'm here to co-create beautifully structured, pedagogically sound worksheets for your classroom. Tell me your topic, proficiency levels, or desired exercise formats, and let's build the perfect study companion!"
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [worksheetText, setWorksheetText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Design styling options
  const [themeColor, setThemeColor] = useState<WorksheetThemeColor>('navy');
  const [borderStyle, setBorderStyle] = useState<WorksheetBorderStyle>('classic_frame');
  const [fontStyle, setFontStyle] = useState<WorksheetFont>('sans');

  // Copy success feedback state
  const [copySuccess, setCopySuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  
  // Print preview modal toggle
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'text'>('chat');

  // Dynamic thematic illustration states
  const [illustration, setIllustration] = useState<WorksheetVisual | null>(null);
  const [isGeneratingIllustration, setIsGeneratingIllustration] = useState(false);
  const [illustrationStyle, setIllustrationStyle] = useState<VisualStyle>('line_art');
  const [showIllustrationPanel, setShowIllustrationPanel] = useState(false);
  const [customIllustrationPrompt, setCustomIllustrationPrompt] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract parsed topic from current worksheet
  const parsedTopic = React.useMemo(() => {
    if (!worksheetText) return '';
    const match = worksheetText.match(/Worksheet Topic:\s*(.*)/i);
    return match ? match[1].trim() : '';
  }, [worksheetText]);

  // Call the server-side Gemini system to generate custom SVG vector diagrams
  const handleGenerateIllustration = async () => {
    setIsGeneratingIllustration(true);
    try {
      const topicToUse = customIllustrationPrompt.trim() || parsedTopic || 'English Study';
      const response = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topicToUse,
          style: illustrationStyle,
          promptDescription: customIllustrationPrompt.trim() || undefined
        }),
      });

      const data = await response.json();
      if (data.svg) {
        setIllustration({
          id: 'ai-chat-illustration-' + Date.now(),
          placement: 'header_banner',
          title: topicToUse,
          style: illustrationStyle,
          category: 'ai_generated',
          svgContent: data.svg,
          altText: `Thematic illustration of ${topicToUse}`,
          size: 'md'
        });
        setShowIllustrationPanel(false);
      }
    } catch (err) {
      console.error('[AI Chat Studio] Failed to generate thematic illustration:', err);
    } finally {
      setIsGeneratingIllustration(false);
    }
  };

  const starterSuggestions = [
    {
      label: "Reading on Traveling",
      prompt: "Create a Reading Comprehension worksheet about Traveling and airport routines for intermediate learners with 3 factual questions and 1 reference word question."
    },
    {
      label: "Grammar: Past & Future",
      prompt: "Create a Grammar Exercise worksheet focusing on Past vs Future tenses based on the theme of Celebrations and relationships."
    },
    {
      label: "Vocab: Pollution",
      prompt: "Create a Vocabulary Matching worksheet about pollution and environmental problems with a word bank and fill-in-the-blank sentences."
    },
    {
      label: "Comprehension: Friends",
      prompt: "Generate a reading passage about the value of friendships with 3 open comprehension questions and a 'What would you do?' reflective question."
    }
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isProcessing) return;

    setInputText('');
    const updatedHistory: Message[] = [
      ...messages,
      { sender: 'user', text: textToSend }
    ];
    
    setMessages(updatedHistory);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          currentWorksheet: worksheetText || undefined
        })
      });

      const data = await response.json();
      
      if (data.worksheet) {
        setWorksheetText(data.worksheet);
        setMessages([
          ...updatedHistory,
          { 
            sender: 'assistant', 
            text: data.assistantResponse || "Here is your updated worksheet!",
            worksheetAtThisStep: data.worksheet
          }
        ]);

        // Adapt the theme color dynamically based on content matching
        const textLower = textToSend.toLowerCase();
        if (textLower.includes('grammar') || textLower.includes('verb')) {
          setThemeColor('emerald');
        } else if (textLower.includes('reading') || textLower.includes('comprehension')) {
          setThemeColor('navy');
        } else if (textLower.includes('vocabulary') || textLower.includes('matching') || textLower.includes('word')) {
          setThemeColor('indigo');
        } else if (textLower.includes('quiz') || textLower.includes('test')) {
          setThemeColor('amber');
        }
      } else {
        setMessages([
          ...updatedHistory,
          { sender: 'assistant', text: "I ran into a minor issue generating the worksheet. Please try again with different instructions." }
        ]);
      }
    } catch (err) {
      console.error('[AI Chat Studio] Error sending chat message:', err);
      setMessages([
        ...updatedHistory,
        { sender: 'assistant', text: "I had trouble connecting to the AI models. Please make sure your server is online." }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickCommand = (command: string) => {
    let promptText = "";
    if (command === 'harder') {
      promptText = "Make the questions a bit more advanced and add critical-thinking vocabulary.";
    } else if (command === 'simpler') {
      promptText = "Simplify the vocabulary and reading passage for beginner level students.";
    } else if (command === 'add_section') {
      promptText = "Add a standard Section with 'What would you do? (Critical Reflection)' scenario questions at the bottom.";
    } else if (command === 'add_bracket') {
      promptText = "Add a new grammar section testing 'Put the words in brackets in the correct form'.";
    }

    if (promptText) {
      handleSendMessage(promptText);
    }
  };

  const handleCopyText = async () => {
    if (!worksheetText) return;
    try {
      await navigator.clipboard.writeText(worksheetText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.warn('Could not copy worksheet text:', err);
    }
  };

  const handleExportPdf = async () => {
    if (!worksheetText) return;
    setIsProcessing(true);
    setPdfSuccess(false);

    try {
      await exportWorksheetToPdf({
        worksheetText: worksheetText,
        topic: 'AI Conversational Worksheet',
        gradeLevel: 'All Levels',
        fontStyle: fontStyle
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectPrint = () => {
    setIsPrintPreviewOpen(true);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the conversation and start a new worksheet?")) {
      setMessages([
        {
          sender: 'assistant',
          text: "Hello! I am your AI Curriculum Design Assistant. Tell me what kind of worksheet you need (e.g., topic, student age, or exercise types), and I will build it for you instantly. You can refine or edit it anytime simply by chatting!"
        }
      ]);
      setWorksheetText('');
    }
  };

  const handleFeedback = (idx: number, status: 'agreed' | 'disagreed') => {
    const updated = [...messages];
    updated[idx] = {
      ...updated[idx],
      feedback: status,
      feedbackReason: undefined
    };
    setMessages(updated);
  };

  const handleRefineReason = (idx: number, reason: string) => {
    const updated = [...messages];
    updated[idx] = {
      ...updated[idx],
      feedbackReason: reason
    };
    setMessages(updated);

    let promptText = "";
    if (reason === 'too_simple') {
      promptText = "Refine the worksheet: the exercises are currently too simple. Please make them more challenging, add more complex vocabulary, and introduce advanced questions.";
    } else if (reason === 'repetitive') {
      promptText = "Refine the worksheet: the questions look a bit repetitive. Please vary the questions and add a new kind of interactive task.";
    } else if (reason === 'add_activities') {
      promptText = "Refine the worksheet: I need more practice exercises. Please double the number of questions in each section.";
    } else if (reason === 'change_topic') {
      promptText = "Refine the worksheet: please shift the theme context slightly to make it more relevant to daily real-life situations.";
    } else {
      promptText = `Refine the worksheet: ${reason}`;
    }

    handleSendMessage(promptText);
  };

  const handleRestoreVersion = (sheetText: string) => {
    if (!sheetText) return;
    setWorksheetText(sheetText);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] bg-slate-50 dark:bg-[#0B0F19] overflow-hidden relative">
      
      {/* Premium Ambient Background Blobs for Glass Refraction */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-primary-400/15 to-indigo-500/15 blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-emerald-400/10 to-primary-500/15 blur-3xl opacity-70 pointer-events-none" />
      
      {/* LEFT CHAT CONTROL PANEL */}
      <div className="w-full lg:w-[460px] xl:w-[500px] m-4 rounded-2xl border border-white/50 dark:border-white/10 bg-white/45 dark:bg-[#0F172A]/25 backdrop-blur-2xl flex flex-col justify-between shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] relative shrink-0 z-10 overflow-hidden ring-1 ring-primary-500/15 dark:ring-primary-400/5">
        
        {/* Chat Panel Header */}
        <div className="p-4 border-b border-white/40 dark:border-white/5 bg-white/25 dark:bg-slate-900/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  Conversational AI Studio
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Type what you want, get a worksheet instantly
                </p>
              </div>
            </div>

            {worksheetText && (
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-xs flex items-center gap-1"
                title="Start a fresh worksheet"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="font-semibold text-[10px]">Restart</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="px-4 py-1.5 border-b border-slate-200/40 dark:border-slate-800/25 bg-white/20 dark:bg-slate-900/5 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveLeftTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeLeftTab === 'chat'
                ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Assistant Chat</span>
          </button>
          <button
            onClick={() => setActiveLeftTab('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeLeftTab === 'text'
                ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Plain Worksheet Text</span>
            {worksheetText && activeLeftTab !== 'text' && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {activeLeftTab === 'chat' ? (
          /* Scrollable Messages Stream */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-primary-600/90 border-primary-500/35 text-white backdrop-blur-xs font-semibold shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/45 backdrop-blur-md text-slate-800 dark:text-slate-200 border-white/30 dark:border-slate-800/30 shadow-xs'
                }`}>
                  <p>{msg.text}</p>

                  {/* Worksheet visual preview embedded inside the assistant's response bubble */}
                  {msg.sender === 'assistant' && idx > 0 && worksheetText && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold border-b border-slate-200/50 dark:border-slate-800/50 pb-1.5">
                        <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
                          <FileText className="w-3.5 h-3.5" />
                          Worksheet Content
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleExportPdf}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-0.5"
                            title="Download PDF"
                          >
                            <Download className="w-3 h-3" />
                            <span className="text-[9px] font-extrabold uppercase">PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDirectPrint}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-0.5"
                            title="Print preview"
                          >
                            <Printer className="w-3 h-3" />
                            <span className="text-[9px] font-extrabold uppercase">Print</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCopyText}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors"
                            title="Copy plain text"
                          >
                            {copySuccess ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveLeftTab('text')}
                            className="px-2 py-0.5 rounded-md bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-extrabold text-[10px]"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <pre className="text-[10px] font-mono whitespace-pre-wrap max-h-[160px] overflow-y-auto leading-relaxed opacity-90 p-1">
                        {msg.worksheetAtThisStep || worksheetText}
                      </pre>
                    </div>
                  )}

                  {/* Real Agreement / Disagreement Interactive Feedback Panel */}
                  {msg.sender === 'assistant' && idx > 0 && msg.worksheetAtThisStep && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>Teacher Draft Approval:</span>
                        {worksheetText !== msg.worksheetAtThisStep && (
                          <button
                            onClick={() => handleRestoreVersion(msg.worksheetAtThisStep!)}
                            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-extrabold text-[9px]"
                            title="Restore this older version of the worksheet to the active canvas"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Restore This Version</span>
                          </button>
                        )}
                      </div>

                      {!msg.feedback ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleFeedback(idx, 'agreed')}
                            className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-center gap-1 transition-all text-[10px]"
                          >
                            <ThumbsUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Accept & Agree</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, 'disagreed')}
                            className="flex-1 py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-bold border border-rose-200/50 dark:border-rose-800/50 flex items-center justify-center gap-1 transition-all text-[10px]"
                          >
                            <ThumbsDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                            <span>Disagree & Refine</span>
                          </button>
                        </div>
                      ) : msg.feedback === 'agreed' ? (
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 text-[10px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Final Draft Accepted! Ready to print & save as PDF.</span>
                          <button 
                            onClick={() => {
                              const updated = [...messages];
                              updated[idx].feedback = null;
                              setMessages(updated);
                            }}
                            className="ml-auto text-slate-400 hover:text-slate-600 text-[9px]"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5 bg-rose-500/5 border border-rose-500/20 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-800 dark:text-rose-400">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Draft Disagreed. Tell the AI how to improve:</span>
                            <button 
                              onClick={() => {
                                const updated = [...messages];
                                updated[idx].feedback = null;
                                setMessages(updated);
                              }}
                              className="ml-auto text-slate-400 hover:text-slate-600 text-[9px]"
                            >
                              Back
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() => handleRefineReason(idx, 'too_simple')}
                              className="py-1 px-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 text-[9px] font-semibold text-left truncate"
                            >
                              ⚠️ Too simple / easy
                            </button>
                            <button
                              onClick={() => handleRefineReason(idx, 'repetitive')}
                              className="py-1 px-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 text-[9px] font-semibold text-left truncate"
                            >
                              🔄 Repetitive questions
                            </button>
                            <button
                              onClick={() => handleRefineReason(idx, 'add_activities')}
                              className="py-1 px-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 text-[9px] font-semibold text-left truncate"
                            >
                              ➕ Needs more questions
                            </button>
                            <button
                              onClick={() => handleRefineReason(idx, 'change_topic')}
                              className="py-1 px-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 text-[9px] font-semibold text-left truncate"
                            >
                              🌍 Needs real-life context
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  <span className="font-medium animate-pulse">Designing and formatting exercises...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Plain Worksheet Text Editor / Viewer inside the AI area */
          <div className="flex-1 flex flex-col p-4 space-y-2 overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
              <span>View or edit raw worksheet details:</span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportPdf}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 transition-all text-[11px]"
                  title="Save high quality PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleDirectPrint}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 transition-all text-[11px]"
                  title="Print worksheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Preview</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-[11px]"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>
            </div>
            
            <textarea
              value={worksheetText}
              onChange={(e) => setWorksheetText(e.target.value)}
              placeholder="No worksheet generated yet. Tell the AI what you want on the Chat tab to start!"
              className="flex-1 w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 text-[11px] font-mono resize-none focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 leading-relaxed shadow-3xs"
            />
          </div>
        )}

        {/* Quick Suggestion Prompts / Quick actions */}
        <div className="px-4 py-3 bg-white/20 dark:bg-slate-900/10 border-t border-slate-200/40 dark:border-slate-800/25 backdrop-blur-xs">
          {!worksheetText ? (
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Tap to quick start:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {starterSuggestions.map((suggestion, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(suggestion.prompt)}
                    className="text-left text-[10.5px] p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-primary-400 dark:hover:border-primary-600 text-slate-700 dark:text-slate-300 transition-all truncate shadow-3xs"
                    title={suggestion.prompt}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Quick Edit Commands:
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => handleQuickCommand('harder')}
                  disabled={isProcessing}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600 text-slate-700 dark:text-slate-300 transition-all shadow-3xs"
                >
                  🚀 Make Harder
                </button>
                <button
                  onClick={() => handleQuickCommand('simpler')}
                  disabled={isProcessing}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600 text-slate-700 dark:text-slate-300 transition-all shadow-3xs"
                >
                  📉 Make Simpler
                </button>
                <button
                  onClick={() => handleQuickCommand('add_section')}
                  disabled={isProcessing}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600 text-slate-700 dark:text-slate-300 transition-all shadow-3xs"
                >
                  💡 Add Reflection
                </button>
                <button
                  onClick={() => handleQuickCommand('add_bracket')}
                  disabled={isProcessing}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600 text-slate-700 dark:text-slate-300 transition-all shadow-3xs"
                >
                  📝 Bracket Forms
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Text Input Block */}
        <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/25 bg-white/30 dark:bg-slate-900/15 backdrop-blur-xs">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-white/80 dark:bg-slate-850/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-1.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all shadow-3xs"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
              placeholder={isProcessing ? "AI is typing..." : "Explain your changes or add sections..."}
              className="flex-1 bg-transparent border-none text-slate-900 dark:text-white px-2.5 py-1.5 focus:outline-hidden text-xs placeholder-slate-400"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 transition-all shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-semibold px-1 mt-2">
            <span>💡 Tip: Ask to add matching, reading passages, or grammar blanks</span>
            <span>Enter to send</span>
          </div>
        </div>

      </div>

      {/* RIGHT INSTANT A4 PAPER PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Preview Actions Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
          
          {/* Layout controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setThemeColor('navy')}
                className={`w-5 h-5 rounded-md bg-sky-900 border border-slate-200 dark:border-slate-700 transition-all ${themeColor === 'navy' ? 'ring-2 ring-primary-500 scale-110' : 'opacity-60'}`}
                title="Navy theme"
              />
              <button
                onClick={() => setThemeColor('emerald')}
                className={`w-5 h-5 rounded-md bg-emerald-700 border border-slate-200 dark:border-slate-700 transition-all ${themeColor === 'emerald' ? 'ring-2 ring-primary-500 scale-110' : 'opacity-60'}`}
                title="Emerald theme"
              />
              <button
                onClick={() => setThemeColor('indigo')}
                className={`w-5 h-5 rounded-md bg-indigo-700 border border-slate-200 dark:border-slate-700 transition-all ${themeColor === 'indigo' ? 'ring-2 ring-primary-500 scale-110' : 'opacity-60'}`}
                title="Indigo theme"
              />
              <button
                onClick={() => setThemeColor('amber')}
                className={`w-5 h-5 rounded-md bg-amber-600 border border-slate-200 dark:border-slate-700 transition-all ${themeColor === 'amber' ? 'ring-2 ring-primary-500 scale-110' : 'opacity-60'}`}
                title="Amber theme"
              />
              <button
                onClick={() => setThemeColor('monochrome')}
                className={`w-5 h-5 rounded-md bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all ${themeColor === 'monochrome' ? 'ring-2 ring-primary-500 scale-110' : 'opacity-60'}`}
                title="Monochrome theme"
              />
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setBorderStyle('classic_frame')}
                className={`px-2 py-1 rounded-md ${borderStyle === 'classic_frame' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              >
                Frame
              </button>
              <button
                onClick={() => setBorderStyle('modern_cards')}
                className={`px-2 py-1 rounded-md ${borderStyle === 'modern_cards' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              >
                Modern
              </button>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setFontStyle('sans')}
                className={`px-2 py-1 rounded-md ${fontStyle === 'sans' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontStyle('serif')}
                className={`px-2 py-1 rounded-md ${fontStyle === 'serif' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontStyle('handwriting')}
                className={`px-2 py-1 rounded-md ${fontStyle === 'handwriting' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              >
                Script
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            <button
              onClick={() => {
                setShowIllustrationPanel(!showIllustrationPanel);
                if (!customIllustrationPrompt && parsedTopic) {
                  setCustomIllustrationPrompt(parsedTopic);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                illustration 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
              title="Enhance your worksheet with a custom dynamic illustration or diagram"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{illustration ? 'Illustration Loaded' : 'Add Illustration'}</span>
            </button>
          </div>

          {/* Core print/pdf actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectPrint}
              disabled={!worksheetText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all disabled:opacity-30 disabled:hover:bg-primary-600 shadow-sm"
              title="Open full print layout preview"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={!worksheetText}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-30 disabled:hover:bg-transparent ${
                pdfSuccess 
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
              }`}
              title="Save worksheet locally as high quality PDF"
            >
              {pdfSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved PDF!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Save PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyText}
              disabled={!worksheetText}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30"
              title="Copy text content to clipboard"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Dynamic Illustration generator configuration sub-panel */}
        {showIllustrationPanel && (
          <div className="mx-6 mt-4 p-4 rounded-xl border border-primary-200 dark:border-primary-900/40 bg-white dark:bg-[#0d1527] flex flex-col gap-3 shadow-md text-slate-800 dark:text-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Thematic Illustration & Diagram Generator</span>
              </div>
              <button 
                onClick={() => setShowIllustrationPanel(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Design a beautiful, topic-relevant vector illustration or diagram to enhance the visual appeal of this worksheet.
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Illustration Prompt / Subject</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customIllustrationPrompt}
                    onChange={(e) => setCustomIllustrationPrompt(e.target.value)}
                    placeholder={parsedTopic ? `e.g. ${parsedTopic} objects, scientific tools, or diagrams...` : "e.g. Classroom learning objects, books, atoms, laboratory flask..."}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-primary-500"
                  />
                  {parsedTopic && (
                    <button
                      type="button"
                      onClick={() => setCustomIllustrationPrompt(parsedTopic)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                    >
                      Use Topic
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-fit flex flex-col gap-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Art Style & Theme</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold h-fit my-auto">
                  <button
                    onClick={() => setIllustrationStyle('line_art')}
                    className={`px-3 py-1.5 rounded-md transition-all ${illustrationStyle === 'line_art' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
                  >
                    Line Art
                  </button>
                  <button
                    onClick={() => setIllustrationStyle('vector_accent')}
                    className={`px-3 py-1.5 rounded-md transition-all ${illustrationStyle === 'vector_accent' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
                  >
                    Color Accent
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <button
                onClick={handleGenerateIllustration}
                disabled={isGeneratingIllustration || !worksheetText}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all disabled:opacity-40 shadow-sm"
              >
                {isGeneratingIllustration ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Drawing Custom Graphic via AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Vector Illustration</span>
                  </>
                )}
              </button>

              {illustration && (
                <button
                  onClick={() => setIllustration(null)}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/10 text-xs font-semibold transition-all"
                >
                  Remove Illustration
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Paper Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100/60 dark:bg-slate-950/60 flex justify-center">
          
          {worksheetText ? (
            <div 
              id="chat-worksheet-printable-area"
              className={`bg-white text-slate-950 rounded-lg shadow-xl border border-slate-200 max-w-[800px] w-full p-8 transition-all duration-200 font-${fontStyle}`}
              style={{ minHeight: '1129px' }} // Proportional A4 aspect
            >
              <WorksheetDocumentRenderer
                worksheetText={worksheetText}
                topic={parsedTopic || "AI Conversational Worksheet"}
                gradeLevel="All Levels"
                themeColor={themeColor}
                borderStyle={borderStyle}
                visuals={illustration ? [illustration] : []}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md h-fit my-auto">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary-500 mb-6 shadow-xs animate-pulse">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Your Worksheet is Ready to Build
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Choose one of the quick suggestions on the left, or write a custom description like *"Generate a reading comprehension with 3 exercises on friendship for grade 6"* to begin.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* FULL PRINT PREVIEW MODAL INTEGRATION */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        worksheetText={worksheetText}
        topic={parsedTopic || "AI Chat Worksheet"}
        gradeLevel="All Grades"
        onDownloadTxt={handleCopyText}
        fontStyle={fontStyle}
        onUpdateFontStyle={setFontStyle}
        themeColor={themeColor}
        onUpdateThemeColor={setThemeColor}
        borderStyle={borderStyle}
        onUpdateBorderStyle={setBorderStyle}
        visuals={illustration ? [illustration] : []}
      />

    </div>
  );
}
