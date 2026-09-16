import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, ExternalLink, Sparkles, Volume2, Globe, CheckCircle2 } from 'lucide-react';

export interface QRCodeSettings {
  enabled: boolean;
  url: string;
  title: string;
  description: string;
  position: 'header' | 'footer';
}

interface WorksheetQRCardProps {
  settings: QRCodeSettings;
  variant?: 'header' | 'footer' | 'standalone';
  className?: string;
  topic?: string;
}

export function WorksheetQRCard({
  settings,
  variant = 'header',
  className = '',
  topic = ''
}: WorksheetQRCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const targetUrl = settings.url.trim() || 'https://learnenglish.britishcouncil.org';

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a', // Deep slate for crisp print contrast
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setGenError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to render QR Code', err);
          setGenError('Could not render QR code');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetUrl]);

  if (!settings.enabled) return null;

  // Header placement (compact, prints cleanly next to Name/Date on sheet)
  if (variant === 'header') {
    return (
      <div 
        className={`qr-code-header-block border border-slate-300 rounded-lg p-2.5 bg-slate-50/80 flex items-center gap-3 max-w-[280px] shadow-sm select-none ${className}`}
      >
        <div className="w-[72px] h-[72px] bg-white border border-slate-200 rounded p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="Worksheet Resource QR Code" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-[10px] text-slate-400 text-center">Loading QR...</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 font-sans">
            <QrCode className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Digital Companion</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-900 leading-tight mt-0.5 line-clamp-2 font-sans">
            {settings.title || 'Scan for Audio & Exercises'}
          </p>
          <p className="text-[9px] text-slate-500 mt-1 line-clamp-1 truncate font-mono">
            {targetUrl.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>
    );
  }

  // Footer / Extension placement (broad banner for homework, self-study, or listening audio)
  return (
    <div 
      className={`qr-code-footer-block border-2 border-slate-300 rounded-xl p-4 bg-slate-50/90 flex items-center justify-between gap-4 shadow-sm select-none ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-[84px] h-[84px] bg-white border border-slate-200 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center shadow-sm">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="Worksheet Resource QR Code" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-[10px] text-slate-400 text-center">Loading QR...</div>
          )}
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-100 text-primary-800 text-[10px] font-bold uppercase tracking-wider font-sans">
            <QrCode className="w-3 h-3" />
            <span>Digital Study Resource</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1 font-sans">
            {settings.title || 'Scan to Access Online Practice & Audio'}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5 max-w-md font-sans">
            {settings.description || 'Open your smartphone camera and point it at this QR code to access interactive quizzes, listening tracks, and vocabulary review.'}
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-1 truncate">
            <Globe className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{targetUrl}</span>
          </p>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-slate-300 bg-white/60 text-center min-w-[110px]">
        <span className="text-[10px] font-bold text-slate-700 uppercase">Self-Study</span>
        <span className="text-[9px] text-slate-500 mt-0.5">Free Access</span>
        <div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-600 font-medium">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </div>
      </div>
    </div>
  );
}
