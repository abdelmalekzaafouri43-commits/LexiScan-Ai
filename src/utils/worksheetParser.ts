import { WorksheetVisual } from '../types/worksheetVisuals';

export interface WorksheetQuestion {
  id: string;
  type: 'question' | 'vocab' | 'dialogue' | 'prompt' | 'blank' | 'custom';
  content: string;
  originalIndex?: number;
}

export interface WorksheetSection {
  id: string;
  sectionCode: string; // e.g. "SECTION A"
  title: string;       // e.g. "Everyday Vocabulary Matching"
  instruction: string; // e.g. "Match each key vocabulary term..."
  questions: WorksheetQuestion[];
  visual?: WorksheetVisual; // Optional inline or section-specific visual illustration
}

export interface WorksheetDocument {
  studentInfo: string;
  topic: string;
  level: string;
  instructions: string;
  sections: WorksheetSection[];
  footer: string;
  visuals?: WorksheetVisual[]; // Banner or document-level illustrations
}

/**
 * Parses raw worksheet plain text into a structured document model with sections and questions.
 */
export function parseWorksheetText(text: string): WorksheetDocument {
  if (!text || !text.trim()) {
    return {
      studentInfo: 'Name: ______________________ Date: ___________',
      topic: '',
      level: '',
      instructions: 'Read the following sections carefully and complete the exercises.',
      sections: [],
      footer: '--- End of Worksheet ---'
    };
  }

  const lines = text.split('\n');
  let studentInfo = 'Name: ______________________ Date: ___________';
  let topic = '';
  let level = '';
  let generalInstructions = 'Read the following sections carefully and complete the exercises.';
  let footer = '--- End of Worksheet ---';

  const sectionRawBlocks: { header: string; contentLines: string[] }[] = [];
  let currentBlock: { header: string; contentLines: string[] } | null = null;
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Strip markdown bold asterisks, headers (#), list markers from the start/end
    const cleanedLine = trimmed
      .replace(/^[\s#*_-]+/, '') // Leading #, *, -, _
      .replace(/[\s*_-]+$/, ''); // Trailing *, -, _

    // Section header check (checking either trimmed or cleanedLine)
    const sectionMatch = cleanedLine.match(/^SECTION\s+([A-Z0-9]+)[:\s]*(.*)$/i);
    if (sectionMatch) {
      inHeader = false;
      if (currentBlock) {
        sectionRawBlocks.push(currentBlock);
      }
      currentBlock = {
        header: cleanedLine,
        contentLines: []
      };
      continue;
    }

    // Check footer
    if (trimmed.startsWith('--- End of Worksheet') || trimmed.startsWith('=== DIGITAL COMPANION') || cleanedLine.startsWith('End of Worksheet')) {
      if (trimmed.startsWith('--- End of Worksheet')) {
        footer = trimmed;
      }
      if (currentBlock) {
        sectionRawBlocks.push(currentBlock);
        currentBlock = null;
      }
      break;
    }

    if (inHeader) {
      if (/^name:/i.test(cleanedLine)) {
        studentInfo = trimmed;
      } else if (/^worksheet topic:/i.test(cleanedLine)) {
        topic = cleanedLine.replace(/^worksheet topic:\s*/i, '');
      } else if (/^proficiency level:/i.test(cleanedLine)) {
        level = cleanedLine.replace(/^proficiency level:\s*/i, '');
      } else if (/^instructions?:/i.test(cleanedLine)) {
        // Look ahead for instruction text
        const instLines: string[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const nextCleaned = lines[j].trim().replace(/^[\s#*_-]+/, '').replace(/[\s*_-]+$/, '');
          if (/^SECTION\s+[A-Z0-9]+:/i.test(nextCleaned)) {
            break;
          }
          if (lines[j].trim()) instLines.push(lines[j].trim());
          j++;
        }
        if (instLines.length > 0) {
          generalInstructions = instLines.join(' ');
          i = j - 1;
        }
      }
    } else if (currentBlock) {
      currentBlock.contentLines.push(line);
    }
  }

  if (currentBlock) {
    sectionRawBlocks.push(currentBlock);
  }

  // Fallback: If no section blocks were parsed, but there is content, group all content into a default section
  if (sectionRawBlocks.length === 0 && text.trim()) {
    const contentLines = lines.filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      const cleaned = trimmed.replace(/^[\s#*_-]+/, '').replace(/[\s*_-]+$/, '');
      if (/^name:/i.test(cleaned)) return false;
      if (/^worksheet topic:/i.test(cleaned)) return false;
      if (/^proficiency level:/i.test(cleaned)) return false;
      if (/^instructions?:/i.test(cleaned)) return false;
      if (trimmed.startsWith('--- End of Worksheet')) return false;
      return true;
    });

    if (contentLines.length > 0) {
      sectionRawBlocks.push({
        header: 'SECTION A: Exercises & Assessment Activities',
        contentLines
      });
    }
  }

  // Parse each section block into title, instruction, and questions
  const sections: WorksheetSection[] = sectionRawBlocks.map((block, secIdx) => {
    const secLetter = String.fromCharCode(65 + secIdx);
    const headerMatch = block.header.match(/^SECTION\s+([A-Z0-9]+)[:\s]*(.*)$/i);
    const code = headerMatch ? `SECTION ${headerMatch[1].toUpperCase()}` : `SECTION ${secLetter}`;
    const title = headerMatch && headerMatch[2] ? headerMatch[2].trim() : `Section ${secLetter}`;

    const content = block.contentLines.join('\n').trim();
    const { instruction, questions } = parseSectionQuestions(content, secIdx);

    return {
      id: `section-${secIdx}-${Date.now().toString(36)}`,
      sectionCode: code,
      title: title || `Activity ${secLetter}`,
      instruction,
      questions
    };
  });

  return {
    studentInfo,
    topic,
    level,
    instructions: generalInstructions,
    sections,
    footer
  };
}

/**
 * Parses the body of a section into instructions and discrete questions/items.
 */
function parseSectionQuestions(rawText: string, secIdx: number): { instruction: string; questions: WorksheetQuestion[] } {
  if (!rawText) {
    return { instruction: '', questions: [] };
  }

  const lines = rawText.split('\n');
  let instruction = '';
  const questionRawBlocks: string[] = [];
  let currentQBlock: string[] = [];

  let readingInstruction = true;

  // Regex patterns to identify a new item/question boundary
  const itemStartPatterns = [
    /^\[\s*\]\s*\d+\./, // [   ] 1.
    /^\[\s*[A-Z]?\s*\]/,  // [ ] or [ A ]
    /^\d+\.\s+/,         // 1. What is...
    /^[A-D]\.\s+/,       // A. Definition...
    /^Q\d+[:.]/i,        // Q1:
    /^•\s+/,             // • bullet
    /^Speaker\s+\d+/i,   // Speaker 1 (Alex):
    /^Student\s+[A-B]/i, // Student A:
    /^Pair Work Activity:/i,
    /^My Speaking Notes/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (currentQBlock.length > 0) {
        currentQBlock.push('');
      }
      continue;
    }

    const isNewItem = itemStartPatterns.some(p => p.test(trimmed));

    if (readingInstruction) {
      if (isNewItem) {
        readingInstruction = false;
        if (currentQBlock.length > 0) {
          questionRawBlocks.push(currentQBlock.join('\n').trim());
          currentQBlock = [];
        }
        currentQBlock.push(line);
      } else {
        // Check if this line looks like instruction or dialog intro
        if (instruction) {
          instruction += '\n' + trimmed;
        } else {
          instruction = trimmed;
        }
      }
    } else {
      if (isNewItem) {
        if (currentQBlock.length > 0) {
          questionRawBlocks.push(currentQBlock.join('\n').trim());
          currentQBlock = [];
        }
      }
      currentQBlock.push(line);
    }
  }

  if (currentQBlock.length > 0) {
    questionRawBlocks.push(currentQBlock.join('\n').trim());
  }

  // If no questions were parsed by pattern, split on double newlines
  let finalBlocks = questionRawBlocks.filter(b => b.length > 0);
  if (finalBlocks.length === 0 && rawText.trim()) {
    const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length > 1) {
      instruction = paragraphs[0];
      finalBlocks = paragraphs.slice(1);
    } else {
      finalBlocks = [rawText.trim()];
    }
  }

  const questions: WorksheetQuestion[] = finalBlocks.map((blockText, qIdx) => {
    let type: WorksheetQuestion['type'] = 'question';
    if (/^\[\s*\]/i.test(blockText)) type = 'vocab';
    else if (/^Speaker/i.test(blockText)) type = 'dialogue';
    else if (/^•/i.test(blockText)) type = 'blank';
    else if (/Pair Work|Roleplay/i.test(blockText)) type = 'prompt';

    return {
      id: `q-${secIdx}-${qIdx}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      content: blockText,
      originalIndex: qIdx + 1
    };
  });

  return { instruction, questions };
}

/**
 * Serializes a WorksheetDocument back to formatted plain text,
 * automatically keeping section letters (A, B, C...) and question numbering consistent.
 */
export function serializeWorksheetDocument(doc: WorksheetDocument, autoRenumber: boolean = true): string {
  const parts: string[] = [];

  // Header info
  parts.push(doc.studentInfo || 'Name: ______________________ Date: ___________');
  parts.push('');
  if (doc.topic) {
    parts.push(`Worksheet Topic: ${doc.topic.toUpperCase()}`);
  }
  if (doc.level) {
    parts.push(`Proficiency Level: ${doc.level.toUpperCase()}`);
  }
  parts.push('');
  parts.push('INSTRUCTIONS:');
  parts.push(doc.instructions || 'Read the following sections carefully and complete the exercises.');

  // Sections
  doc.sections.forEach((section, sIdx) => {
    parts.push('');
    const letter = autoRenumber ? String.fromCharCode(65 + sIdx) : (section.sectionCode.replace(/^SECTION\s*/i, '') || String.fromCharCode(65 + sIdx));
    parts.push(`SECTION ${letter}: ${section.title}`);

    if (section.instruction && section.instruction.trim()) {
      parts.push(section.instruction.trim());
      parts.push('');
    }

    section.questions.forEach((q, qIdx) => {
      let content = q.content.trim();
      
      // Auto-renumber numbered questions if requested
      if (autoRenumber) {
        const num = qIdx + 1;
        // Check if question starts with [   ] 1. or [ ] 1.
        if (/^\[\s*\]\s*\d+\.\s*/.test(content)) {
          content = content.replace(/^\[\s*\]\s*\d+\.\s*/, `[   ] ${num}. `);
        } else if (/^\d+\.\s+/.test(content)) {
          // Standard numbered question like "1. What is..."
          content = content.replace(/^\d+\.\s+/, `${num}. `);
        }
      }

      parts.push(content);
      parts.push('');
    });
  });

  // Footer
  parts.push(doc.footer || '--- End of Worksheet ---');

  return parts.join('\n').replace(/\n{3,}/g, '\n\n');
}
