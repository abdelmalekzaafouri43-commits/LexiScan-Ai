export type WorksheetFont = 'sans' | 'serif' | 'handwriting';

export interface WorksheetFontOption {
  id: WorksheetFont;
  name: string;
  badge: string;
  description: string;
  className: string;
  fontFamily: string;
  sample: string;
  textClass: string;
}

export const WORKSHEET_FONTS: Record<WorksheetFont, WorksheetFontOption> = {
  'sans': {
    id: 'sans',
    name: 'Clean Sans-Serif',
    badge: 'Modern & High Legibility',
    description: 'Crisp, contemporary letterforms optimal for clear reading, visual comprehension, and dyslexic learners.',
    className: 'font-worksheet-sans',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    sample: 'Quick brown fox jumps • Aa Bb 123',
    textClass: 'text-[15px] leading-relaxed',
  },
  'serif': {
    id: 'serif',
    name: 'Academic Serif',
    badge: 'Classic Print & Literature',
    description: 'Traditional literary book typography with graceful serifs, ideal for reading comprehension stories and formal exams.',
    className: 'font-worksheet-serif',
    fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
    sample: 'Quick brown fox jumps • Aa Bb 123',
    textClass: 'text-[15px] leading-relaxed',
  },
  'handwriting': {
    id: 'handwriting',
    name: 'School Handwriting',
    badge: 'Friendly Penmanship & Primary',
    description: 'Casual classroom print script designed for young learners, penmanship modeling, and approachable ESL practice.',
    className: 'font-worksheet-handwriting',
    fontFamily: "'Patrick Hand', 'Comic Neue', cursive",
    sample: 'Quick brown fox jumps • Aa Bb 123',
    textClass: 'text-[16px] leading-relaxed tracking-wide',
  },
};
