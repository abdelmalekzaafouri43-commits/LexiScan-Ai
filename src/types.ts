import { WorksheetTemplateId } from './utils/worksheetTemplates';

export type Tab = 'dashboard' | 'chat' | 'generator' | 'scanner' | 'saved' | 'settings';

export interface WorksheetData {
  title: string;
  instructions: string;
  questions: string[];
}

export interface TemplatePreloadData {
  templateId: WorksheetTemplateId;
  topic?: string;
  gradeLevel?: string;
  autoLoadSample?: boolean;
}
