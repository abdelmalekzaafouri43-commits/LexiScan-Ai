import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  ExternalLink, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Globe, 
  Video, 
  Link2,
  Check,
  RotateCcw,
  Sliders,
  Eye
} from 'lucide-react';
import { QRCodeSettings } from './WorksheetQRCard';

interface QRCodeConfigPanelProps {
  settings: QRCodeSettings;
  onChange: (newSettings: QRCodeSettings) => void;
  topic: string;
}

export function QRCodeConfigPanel({
  settings,
  onChange,
  topic
}: QRCodeConfigPanelProps) {
  const [thumbDataUrl, setThumbDataUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Generate thumbnail preview
  useEffect(() => {
    const url = settings.url.trim() || 'https://learnenglish.britishcouncil.org';
    QRCode.toDataURL(url, {
      width: 140,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then((data) => setThumbDataUrl(data)).catch(() => setThumbDataUrl(null));
  }, [settings.url]);

  const cleanTopic = topic.trim() || 'Everyday English';
  const encodedTopic = encodeURIComponent(cleanTopic);

  const presets = [
    {
      id: 'audio',
      icon: <Volume2 className="w-3.5 h-3.5 text-amber-500" />,
      label: 'Audio Pronunciation',
      url: `https://forvo.com/search/${encodedTopic}/`,
      title: `${cleanTopic} • Audio Pronunciation Guide`,
      description: 'Scan to listen to native speaker pronunciation of key vocabulary and dialogues.',
    },
    {
      id: 'quizlet',
      icon: <BookOpen className="w-3.5 h-3.5 text-sky-500" />,
      label: 'Quizlet Flashcards',
      url: `https://quizlet.com/search?query=${encodedTopic}&type=sets`,
      title: `${cleanTopic} • Vocabulary Flashcards`,
      description: 'Scan to practice spaced-repetition flashcards and test yourself on mobile.',
    },
    {
      id: 'video',
      icon: <Video className="w-3.5 h-3.5 text-rose-500" />,
      label: 'Video Dialogue',
      url: `https://www.youtube.com/results?search_query=learn+english+${encodedTopic}+dialogue`,
      title: `${cleanTopic} • Conversational Video`,
      description: 'Scan with your smartphone to watch real-life ESL conversations and exercises.',
    },
    {
      id: 'portal',
      icon: <Globe className="w-3.5 h-3.5 text-emerald-500" />,
      label: 'British Council Portal',
      url: `https://learnenglish.britishcouncil.org/search?keywords=${encodedTopic}`,
      title: `${cleanTopic} • Online Learning Hub`,
      description: 'Scan to access grammar notes, audio tracks, and self-graded quizzes.',
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    onChange({
      ...settings,
      enabled: true,
      url: preset.url,
      title: preset.title,
      description: preset.description,
    });
  };

  const handleCopyUrl = () => {
    if (settings.url) {
      navigator.clipboard.writeText(settings.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header with Master Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg transition-colors ${
            settings.enabled 
              ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Digital Resource QR Code
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Printed Link
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prints a scannable link for audio, quizzes, or companion videos
            </p>
          </div>
        </div>

        {/* Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
          {/* Quick Presets based on current topic */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-500" />
                Suggested Resource Presets:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="p-1 rounded bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 flex-shrink-0">
                    {preset.icon}
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* URL & Preview Row */}
          <div className="flex gap-3 items-start">
            {/* Live Thumbnail */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-[76px] h-[76px] bg-white border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm flex items-center justify-center overflow-hidden">
                {thumbDataUrl ? (
                  <img src={thumbDataUrl} alt="QR Thumbnail" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-[9px] text-slate-400">QR Code</div>
                )}
              </div>
              <a
                href={settings.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-0.5"
                title="Test destination URL in a new browser tab"
              >
                <span>Test</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* URL Input & Title */}
            <div className="flex-1 space-y-2.5 min-w-0">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Destination URL (Resource link for students)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={settings.url}
                    onChange={(e) => onChange({ ...settings, url: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono"
                  />
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  {settings.url && (
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Callout Title on Paper
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scan for Audio & Interactive Exercises"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Position on Paper */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Placement on Worksheet
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...settings, position: 'header' })}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  settings.position === 'header'
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border-primary-400 dark:border-primary-600 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Top-Right Header</span>
                <span className="text-[10px] text-slate-400">(Quick Access)</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...settings, position: 'footer' })}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  settings.position === 'footer'
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border-primary-400 dark:border-primary-600 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Bottom Banner</span>
                <span className="text-[10px] text-slate-400">(Self-Study Box)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
