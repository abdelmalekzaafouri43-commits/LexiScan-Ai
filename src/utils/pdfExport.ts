import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import QRCode from 'qrcode';
import { WorksheetFont, WORKSHEET_FONTS } from './worksheetFonts';
import { QRCodeSettings } from '../components/WorksheetQRCard';

export type MarginType = 'normal' | 'narrow' | 'wide';

export interface PdfExportOptions {
  worksheetText: string;
  topic: string;
  gradeLevel: string;
  fontStyle?: WorksheetFont;
  qrSettings?: QRCodeSettings;
  marginType?: MarginType;
  onProgress?: (status: { step: string; current: number; total: number }) => void;
}

// Margin definitions matching PrintPreviewModal
export const MARGIN_CONFIG: Record<MarginType, { label: string; mm: number; px: number; py: number }> = {
  normal: { label: 'Normal (20mm / 0.8")', mm: 20, px: 75, py: 75 },
  narrow: { label: 'Narrow (12.7mm / 0.5")', mm: 12.7, px: 48, py: 48 },
  wide: { label: 'Wide (25.4mm / 1.0")', mm: 25.4, px: 96, py: 96 },
};

/**
 * Intelligent line splitter matching the print preview layout
 */
export function splitWorksheetIntoPages(text: string, margin: MarginType = 'normal'): string[] {
  const rawLines = text.split('\n');
  const linesPerPage = margin === 'narrow' ? 48 : margin === 'wide' ? 38 : 42;

  if (rawLines.length <= linesPerPage) {
    return [text];
  }

  const pages: string[] = [];
  let currentPageLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const isSectionHeader = /^SECTION [A-Z]:/i.test(line.trim());

    if (currentPageLines.length >= linesPerPage || (isSectionHeader && currentPageLines.length >= linesPerPage - 8)) {
      pages.push(currentPageLines.join('\n'));
      currentPageLines = [line];
    } else {
      currentPageLines.push(line);
    }
  }

  if (currentPageLines.length > 0) {
    pages.push(currentPageLines.join('\n'));
  }

  return pages;
}

/**
 * Generates and downloads a client-side A4 PDF document using jsPDF and html2canvas.
 */
export async function exportWorksheetToPdf({
  worksheetText,
  topic,
  gradeLevel,
  fontStyle = 'sans',
  qrSettings,
  marginType = 'normal',
  onProgress,
}: PdfExportOptions): Promise<void> {
  if (!worksheetText) {
    throw new Error('Worksheet content is empty.');
  }

  const pages = splitWorksheetIntoPages(worksheetText, marginType);
  const activeMargin = MARGIN_CONFIG[marginType];
  const fontConfig = WORKSHEET_FONTS[fontStyle] || WORKSHEET_FONTS.sans;

  onProgress?.({ step: 'Preparing pages...', current: 0, total: pages.length });

  // Generate QR Code Data URL if enabled
  let qrDataUrl: string | null = null;
  if (qrSettings?.enabled) {
    try {
      qrDataUrl = await QRCode.toDataURL(qrSettings.url || 'https://learnenglish.britishcouncil.org', {
        width: 280,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.warn('Could not generate QR code for PDF', err);
    }
  }

  // Create an offscreen staging container
  const stage = document.createElement('div');
  stage.id = 'pdf-export-stage';
  stage.style.position = 'fixed';
  stage.style.left = '-9999px';
  stage.style.top = '0';
  stage.style.width = '794px';
  stage.style.zIndex = '-1000';
  stage.style.background = '#ffffff';
  stage.style.color = '#0f172a';
  document.body.appendChild(stage);

  // Initialize jsPDF (A4 standard: 210mm x 297mm in portrait mode)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const safeTopic = (topic || 'ESL_Worksheet').trim();
  pdf.setProperties({
    title: `${safeTopic} - LexiScan AI Worksheet`,
    subject: `CEFR Level: ${gradeLevel.toUpperCase()}`,
    author: 'LexiScan AI',
    creator: 'LexiScan AI Worksheet Publishing Engine',
  });

  try {
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      onProgress?.({
        step: `Rendering page ${pageIndex + 1} of ${pages.length}...`,
        current: pageIndex + 1,
        total: pages.length,
      });

      // Build DOM node for this A4 page
      const pageEl = document.createElement('div');
      pageEl.style.width = '794px';
      pageEl.style.height = '1123px';
      pageEl.style.backgroundColor = '#ffffff';
      pageEl.style.color = '#0f172a';
      pageEl.style.boxSizing = 'border-box';
      pageEl.style.display = 'flex';
      pageEl.style.flexDirection = 'column';
      pageEl.style.justifyContent = 'space-between';
      pageEl.style.paddingTop = `${activeMargin.py}px`;
      pageEl.style.paddingBottom = `${activeMargin.py}px`;
      pageEl.style.paddingLeft = `${activeMargin.px}px`;
      pageEl.style.paddingRight = `${activeMargin.px}px`;
      pageEl.style.fontFamily = fontConfig.fontFamily;
      pageEl.style.position = 'relative';
      pageEl.style.overflow = 'hidden';

      // Header markup
      const headerEl = document.createElement('div');
      headerEl.style.paddingBottom = '12px';
      headerEl.style.borderBottom = '1px solid #e2e8f0';
      headerEl.style.display = 'flex';
      headerEl.style.alignItems = 'center';
      headerEl.style.justifyContent = 'space-between';
      headerEl.style.fontSize = '11px';
      headerEl.style.color = '#64748b';
      headerEl.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
      headerEl.innerHTML = `
        <span style="font-weight: 600; color: #334155;">LexiScan AI • ESL Worksheet Series</span>
        <span style="font-weight: 500;">CEFR: ${gradeLevel.toUpperCase()}</span>
      `;
      pageEl.appendChild(headerEl);

      // Body markup
      const bodyEl = document.createElement('div');
      bodyEl.style.flex = '1';
      bodyEl.style.paddingTop = '16px';
      bodyEl.style.paddingBottom = '16px';
      bodyEl.style.position = 'relative';
      bodyEl.style.overflow = 'hidden';

      // Header QR Card if first page and header position
      if (qrSettings?.enabled && qrSettings.position === 'header' && pageIndex === 0 && qrDataUrl) {
        const qrHeader = document.createElement('div');
        qrHeader.style.float = 'right';
        qrHeader.style.marginLeft = '16px';
        qrHeader.style.marginBottom = '12px';
        qrHeader.style.border = '1px solid #cbd5e1';
        qrHeader.style.borderRadius = '8px';
        qrHeader.style.padding = '8px 10px';
        qrHeader.style.backgroundColor = '#f8fafc';
        qrHeader.style.display = 'flex';
        qrHeader.style.alignItems = 'center';
        qrHeader.style.gap = '10px';
        qrHeader.style.maxWidth = '260px';
        qrHeader.innerHTML = `
          <div style="width: 60px; height: 60px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 2px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
            <img src="${qrDataUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
            <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #2563eb; letter-spacing: 0.5px;">Digital Companion</div>
            <div style="font-size: 10px; font-weight: 700; color: #0f172a; line-height: 1.2; margin-top: 2px;">${qrSettings.title || 'Audio & Practice'}</div>
            <div style="font-size: 8px; color: #64748b; font-family: monospace; margin-top: 2px;">${(qrSettings.url || '').replace(/^https?:\/\//, '').slice(0, 30)}</div>
          </div>
        `;
        bodyEl.appendChild(qrHeader);
      }

      // Worksheet text
      const textPre = document.createElement('pre');
      textPre.style.whiteSpace = 'pre-wrap';
      textPre.style.fontFamily = fontConfig.fontFamily;
      textPre.style.fontSize = fontStyle === 'handwriting' ? '16px' : '14px';
      textPre.style.lineHeight = '1.6';
      textPre.style.color = '#0f172a';
      textPre.style.margin = '0';
      textPre.textContent = pages[pageIndex];
      bodyEl.appendChild(textPre);

      // Footer QR Card if last page and footer position
      if (qrSettings?.enabled && qrSettings.position === 'footer' && pageIndex === pages.length - 1 && qrDataUrl) {
        const qrFooter = document.createElement('div');
        qrFooter.style.marginTop = '16px';
        qrFooter.style.paddingTop = '12px';
        qrFooter.style.borderTop = '1px solid #e2e8f0';
        qrFooter.style.display = 'flex';
        qrFooter.style.alignItems = 'center';
        qrFooter.style.justifyContent = 'space-between';
        qrFooter.style.padding = '12px';
        qrFooter.style.backgroundColor = '#f8fafc';
        qrFooter.style.border = '1px solid #cbd5e1';
        qrFooter.style.borderRadius = '8px';
        qrFooter.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 64px; height: 64px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px; flex-shrink: 0;">
              <img src="${qrDataUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
              <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #2563eb;">Digital Study Resource</div>
              <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 1px;">${qrSettings.title || 'Scan for Online Practice'}</div>
              <div style="font-size: 9px; color: #64748b; margin-top: 2px;">${qrSettings.description || 'Scan with your smartphone camera to access listening dialogues and interactive exercises.'}</div>
            </div>
          </div>
        `;
        bodyEl.appendChild(qrFooter);
      }

      pageEl.appendChild(bodyEl);

      // Footer markup
      const footerEl = document.createElement('div');
      footerEl.style.paddingTop = '12px';
      footerEl.style.borderTop = '1px solid #e2e8f0';
      footerEl.style.display = 'flex';
      footerEl.style.alignItems = 'center';
      footerEl.style.justifyContent = 'space-between';
      footerEl.style.fontSize = '10px';
      footerEl.style.color = '#94a3b8';
      footerEl.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
      footerEl.innerHTML = `
        <span>Topic: ${topic || 'English Language Study'}</span>
        <span>Page ${pageIndex + 1} of ${pages.length}</span>
      `;
      pageEl.appendChild(footerEl);

      // Render to staging area
      stage.replaceChildren(pageEl);

      // Yield frame so browser calculates layout & font metrics
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Rasterize page to high-res canvas (scale: 2 produces 1588x2246 ~300 DPI sharpness)
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (pageIndex > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Add image filling standard A4 dimensions (210mm x 297mm)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    onProgress?.({
      step: 'Saving PDF file...',
      current: pages.length,
      total: pages.length,
    });

    const sanitizedFilename = (topic || 'worksheet')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/gi, '_')
      .replace(/_+/g, '_');

    pdf.save(`${sanitizedFilename}_a4_worksheet.pdf`);

    onProgress?.({
      step: 'PDF exported successfully!',
      current: pages.length,
      total: pages.length,
    });
  } finally {
    // Clean up staging DOM
    if (stage.parentNode) {
      stage.parentNode.removeChild(stage);
    }
  }
}
