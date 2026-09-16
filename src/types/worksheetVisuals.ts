export type VisualStyle = 'line_art' | 'vector_accent' | 'photorealistic';
export type VisualPlacement = 'header_banner' | 'section_header' | 'inline_exercise' | 'matching_bank';

export interface VisualMatchingItem {
  letter: string; // e.g. 'A', 'B', 'C', 'D'
  label: string;  // e.g. 'Fresh Apples', 'Chef Knife'
  svgContent?: string;
  imageUrl?: string;
}

export interface WorksheetVisual {
  id: string;
  sectionId?: string; // If attached to a specific section; 'header' if header banner
  placement: VisualPlacement;
  title: string;
  caption?: string;
  style: VisualStyle;
  category: string;
  prompt?: string;
  svgContent?: string;
  imageUrl?: string;
  altText: string;
  size: 'sm' | 'md' | 'lg' | 'full';
  matchingItems?: VisualMatchingItem[];
}

export interface VisualLibraryItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  svgLineArt: string;
  svgVectorAccent: string;
  defaultCaption: string;
}
