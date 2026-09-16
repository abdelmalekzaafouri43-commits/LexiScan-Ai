export type Tab = 'dashboard' | 'generator' | 'scanner' | 'saved' | 'settings';

export interface WorksheetData {
  title: string;
  instructions: string;
  questions: string[];
}
