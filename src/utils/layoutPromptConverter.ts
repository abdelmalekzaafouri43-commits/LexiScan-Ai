export interface ScannedZone {
  id: string;
  zone: string;
  confidence: string;
  type: 'title' | 'instructions' | 'matching' | 'questions' | 'reading' | 'dialogue' | 'true_false' | 'grammar';
  box: { top: string; left: string; width: string; height: string; color: string };
  detectedItemsCount?: number;
  description?: string;
}

export interface PromptConversionOptions {
  topic: string;
  gradeLevel: string;
  includeAnswerKey?: boolean;
  spacingDensity?: 'compact' | 'comfortable' | 'spacious';
}

/**
 * Converts detected document hierarchy zones into an AI Prompt Layout for Gemini.
 */
export function convertZonesToAiPrompt(
  zones: ScannedZone[],
  options: PromptConversionOptions
): string {
  const topic = options.topic.trim() || 'English Everyday Practice';
  const level = options.gradeLevel || 'beginner (A1-A2)';

  let sectionDirectives: string[] = [];
  let sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  let sectionIndex = 0;

  for (const zone of zones) {
    if (zone.type === 'title') {
      // Handled in base header layout
      continue;
    }
    if (zone.type === 'instructions') {
      // Handled in instructions directive
      continue;
    }

    const secLetter = sectionLetters[sectionIndex] || `S${sectionIndex + 1}`;
    sectionIndex++;

    switch (zone.type) {
      case 'matching':
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: Vocabulary or Concept Matching
- Quantity: Provide ${zone.detectedItemsCount || 4} targeted vocabulary items on the left and clear definitions on the right.
- Visual Layout: Use bracket format [   ] 1-4 on the left and letters A-D on the right.
- Constraint: Randomize order so students write the letter inside the bracket.`);
        break;

      case 'questions':
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: Comprehension / Direct Questions
- Quantity: Provide ${zone.detectedItemsCount || 3} questions testing understanding of "${topic}".
- Visual Layout: Underneath each question, provide 2 clear response lines:
  _________________________________________________________________________________________
  _________________________________________________________________________________________`);
        break;

      case 'true_false':
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: True or False Statements
- Quantity: Provide ${zone.detectedItemsCount || 3} factual statements related to "${topic}".
- Visual Layout: Format with checkbox brackets [   ] TRUE    [   ] FALSE
- Visual Line: Add an "Explanation / Evidence:" line under each item:
  Explanation: ___________________________________________________________________________`);
        break;

      case 'grammar':
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: Grammar Structure & Conjugation
- Quantity: Provide ${zone.detectedItemsCount || 4} fill-in-the-blank practice sentences with base verbs in parentheses (e.g., (walk)).
- Visual Layout: Use clear blanks: "Yesterday, she _______________________ (go) to the store."`);
        break;

      case 'dialogue':
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: Conversational Dialogue & Pair Discussion
- Structure: Provide a realistic, natural 4-line exchange between two speakers (Speaker 1 and Speaker 2) discussing "${topic}".
- Task: Follow with 2 short inquiry questions for pair partner review with blank lines.`);
        break;

      case 'reading':
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: Reading Passage
- Structure: Provide a clean 2-paragraph reading passage about "${topic}".
- Task: Follow with 3 text-dependent analysis questions with blank lines underneath.`);
        break;

      default:
        sectionDirectives.push(`SECTION ${secLetter}: ${zone.zone.toUpperCase()}
- Format: Exercises matching the scanned section density (${zone.detectedItemsCount || 3} items).
- Visual Layout: Clean printable worksheet layout with blank response lines.`);
        break;
    }
  }

  // If no exercise zones were detected, fallback to standard section definitions
  if (sectionDirectives.length === 0) {
    sectionDirectives = [
      `SECTION A: TARGET EXERCISES (MATCHING)
- Provide 4 matching items using [   ] 1-4 and letters A-D.`,
      `SECTION B: COMPREHENSION & PRACTICE
- Provide 3 inquiry questions with blank lines ____________________ for written answers.`,
    ];
  }

  const prompt = `You are an expert curriculum designer and English teacher.
Generate a high-quality educational worksheet about "${topic}" for students at the "${level}" proficiency level.

CRITICAL FORMATTING RULES:
1. Output strictly plain text only. Do NOT output any markdown (no asterisks **, no hashes #, no backticks).
2. Follow the exact structural layout scanned from the external document specified below:

---------------- LAYOUT SPECIFICATION ----------------

Name: ______________________ Date: ___________ Score: _____ / 100

Worksheet Topic: ${topic.toUpperCase()}
Target Level: ${level.toUpperCase()}

INSTRUCTIONS:
Read the directions for each section carefully and write your answers neatly in the designated spaces.

${sectionDirectives.join('\n\n')}

--- End of Worksheet ---

${options.includeAnswerKey ? `\n\nANSWER KEY & TEACHER NOTES:\n(Provide concise answer key for all sections above)` : ''}`;

  return prompt;
}

/**
 * Generates an instant sample worksheet conforming to the scanned zones structure.
 */
export function generateSampleFromZones(
  zones: ScannedZone[],
  topic: string = 'Public Transit & Commuting',
  gradeLevel: string = 'intermediate (B1-B2)'
): string {
  const t = topic.toUpperCase();
  const lvl = gradeLevel.toUpperCase();

  const lines: string[] = [];
  lines.push(`Name: ______________________ Date: ___________ Score: _____ / 100\n`);
  lines.push(`Worksheet Topic: ${t}`);
  lines.push(`Proficiency Level: ${lvl}\n`);
  lines.push(`INSTRUCTIONS:`);
  lines.push(`Read the following sections carefully and complete all tasks on this sheet.\n`);

  let sectionLetters = ['A', 'B', 'C', 'D', 'E'];
  let sIndex = 0;

  for (const zone of zones) {
    if (zone.type === 'title' || zone.type === 'instructions') continue;

    const letter = sectionLetters[sIndex] || `S${sIndex + 1}`;
    sIndex++;

    if (zone.type === 'matching') {
      lines.push(`SECTION ${letter}: ${zone.zone.toUpperCase()} (MATCHING)`);
      lines.push(`Match each key term related to ${topic} on the left with its proper definition on the right. Write the corresponding letter (A-D) in each bracket.\n`);
      lines.push(`[   ] 1. Primary Route              A. The central designated path or transit corridor`);
      lines.push(`[   ] 2. Departure Window           B. The specific scheduled timeframe during which service operates`);
      lines.push(`[   ] 3. Transfer Terminal          C. A major interchange station facilitating multiple connecting lines`);
      lines.push(`[   ] 4. Fare Validation            D. The process of scanning or stamping a ticket before boarding\n`);
    } else if (zone.type === 'true_false') {
      lines.push(`SECTION ${letter}: ${zone.zone.toUpperCase()} (TRUE OR FALSE)`);
      lines.push(`Decide whether each statement is True or False. Mark the box and write a brief explanation.\n`);
      lines.push(`1. Passengers must validate their tickets prior to boarding the platform.`);
      lines.push(`   [   ] TRUE    [   ] FALSE`);
      lines.push(`   Explanation: _____________________________________________________________________\n`);
      lines.push(`2. Scheduled transfer times are identical on weekdays and public holidays.`);
      lines.push(`   [   ] TRUE    [   ] FALSE`);
      lines.push(`   Explanation: _____________________________________________________________________\n`);
    } else if (zone.type === 'grammar') {
      lines.push(`SECTION ${letter}: ${zone.zone.toUpperCase()} (STRUCTURE & CONJUGATION)`);
      lines.push(`Complete the sentences below by putting the verbs in parentheses into the correct tense for ${topic}.\n`);
      lines.push(`1. If the morning train _______________________ (arrive) on time, we will reach the center by 9 AM.`);
      lines.push(`2. Commuters who _______________________ (purchase) a monthly pass save over thirty percent.`);
      lines.push(`3. Yesterday, transit authorities _______________________ (announce) additional evening departures.\n`);
    } else {
      lines.push(`SECTION ${letter}: ${zone.zone.toUpperCase()} (COMPREHENSION & SHORT ANSWER)`);
      lines.push(`Answer each question in complete sentences based on standard guidelines for ${topic}.\n`);
      lines.push(`1. What is the most efficient course of action if a passenger misses their scheduled connection?`);
      lines.push(`   _________________________________________________________________________________________`);
      lines.push(`   _________________________________________________________________________________________\n`);
      lines.push(`2. Identify two essential factors commuters should consider when planning their daily journey:`);
      lines.push(`   • Factor 1: _____________________________________________________________________________`);
      lines.push(`   • Factor 2: _____________________________________________________________________________\n`);
    }
  }

  lines.push(`--- End of Worksheet ---`);
  return lines.join('\n');
}

export interface DocumentPreset {
  id: string;
  name: string;
  description: string;
  topic: string;
  gradeLevel: string;
  zones: ScannedZone[];
}

export const SCANNER_DOCUMENT_PRESETS: DocumentPreset[] = [
  {
    id: 'exam_quiz',
    name: '3-Part Assessment Quiz Sheet',
    description: 'Header block, General exam rules, 4x Multiple-choice items, True/False inquiries, and Written reflection.',
    topic: 'Travel & Airport Procedures',
    gradeLevel: 'intermediate (B1-B2)',
    zones: [
      {
        id: 'z-1',
        zone: 'Title & Examination Header',
        confidence: '99%',
        type: 'title',
        box: { top: '5%', left: '8%', width: '84%', height: '11%', color: 'border-blue-500 bg-blue-500/10' },
        description: 'Candidate name, examination date, and maximum score field.'
      },
      {
        id: 'z-2',
        zone: 'Exam Instructions Block',
        confidence: '97%',
        type: 'instructions',
        box: { top: '18%', left: '8%', width: '84%', height: '10%', color: 'border-amber-500 bg-amber-500/10' },
        description: 'Pacing instructions and marking rules.'
      },
      {
        id: 'z-3',
        zone: 'Multiple Choice Question Block',
        confidence: '98%',
        type: 'matching',
        detectedItemsCount: 4,
        box: { top: '30%', left: '8%', width: '84%', height: '24%', color: 'border-emerald-500 bg-emerald-500/10' },
        description: '4 standardized 4-choice questions with [ ] brackets.'
      },
      {
        id: 'z-4',
        zone: 'True/False Verification Block',
        confidence: '95%',
        type: 'true_false',
        detectedItemsCount: 2,
        box: { top: '56%', left: '8%', width: '84%', height: '20%', color: 'border-purple-500 bg-purple-500/10' },
        description: '2 binary evaluation statements with rationale lines.'
      },
      {
        id: 'z-5',
        zone: 'Short Answer Inquiry Block',
        confidence: '96%',
        type: 'questions',
        detectedItemsCount: 2,
        box: { top: '78%', left: '8%', width: '84%', height: '17%', color: 'border-cyan-500 bg-cyan-500/10' },
        description: 'Open response prompt with ruled answer lines.'
      },
    ]
  },
  {
    id: 'grammar_matching',
    name: 'Vocabulary Matching & Grammar Practice',
    description: 'Target vocabulary matching with bracket layout, fill-in-the-blank verb drills, and sentence transformations.',
    topic: 'Daily Commute & City Transportation',
    gradeLevel: 'beginner (A1-A2)',
    zones: [
      {
        id: 'z-1',
        zone: 'Worksheet Header',
        confidence: '98%',
        type: 'title',
        box: { top: '6%', left: '10%', width: '80%', height: '12%', color: 'border-blue-500 bg-blue-500/10' },
        description: 'Class, student name, and date header.'
      },
      {
        id: 'z-2',
        zone: 'Section Instructions',
        confidence: '94%',
        type: 'instructions',
        box: { top: '20%', left: '10%', width: '80%', height: '10%', color: 'border-amber-500 bg-amber-500/10' },
        description: 'Instructions on matching terms with definitions.'
      },
      {
        id: 'z-3',
        zone: 'Vocabulary Matching Table',
        confidence: '99%',
        type: 'matching',
        detectedItemsCount: 4,
        box: { top: '32%', left: '10%', width: '80%', height: '28%', color: 'border-emerald-500 bg-emerald-500/10' },
        description: '4 key terms with definition brackets [ ] 1-4 and A-D.'
      },
      {
        id: 'z-4',
        zone: 'Verb Form Grammar Practice',
        confidence: '97%',
        type: 'grammar',
        detectedItemsCount: 3,
        box: { top: '63%', left: '10%', width: '80%', height: '28%', color: 'border-indigo-500 bg-indigo-500/10' },
        description: 'Sentences with blanks and base verbs in parentheses.'
      },
    ]
  },
  {
    id: 'reading_comprehension',
    name: 'Reading Passage & Analysis Sheet',
    description: 'Two-column text reading passage followed by analytical comprehension inquiries.',
    topic: 'Renewable Energy & Green Cities',
    gradeLevel: 'advanced (C1-C2)',
    zones: [
      {
        id: 'z-1',
        zone: 'Header Block',
        confidence: '99%',
        type: 'title',
        box: { top: '6%', left: '8%', width: '84%', height: '10%', color: 'border-blue-500 bg-blue-500/10' },
        description: 'Document title and academic metadata.'
      },
      {
        id: 'z-2',
        zone: 'Informative Reading Passage',
        confidence: '98%',
        type: 'reading',
        detectedItemsCount: 2,
        box: { top: '18%', left: '8%', width: '84%', height: '36%', color: 'border-teal-500 bg-teal-500/10' },
        description: 'Two paragraph dense expository text block.'
      },
      {
        id: 'z-3',
        zone: 'Critical Thinking & Inference Inquiries',
        confidence: '96%',
        type: 'questions',
        detectedItemsCount: 3,
        box: { top: '56%', left: '8%', width: '84%', height: '36%', color: 'border-cyan-500 bg-cyan-500/10' },
        description: '3 deep conceptual questions with response lines.'
      },
    ]
  }
];
