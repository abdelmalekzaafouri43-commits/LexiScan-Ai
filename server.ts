import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient Model cascade: gemini-3.8-flash -> gemini-3.1-flash-lite -> gemini-flash-latest -> gemini-3.1-pro-preview
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.1-pro-preview'];

function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }
  return cleaned;
}

function generateThematicSvgFallback(topic: string, style: string = 'line_art', description?: string): string {
  const t = (topic || '').toLowerCase();
  const isLineArt = style === 'line_art';
  const strokeColor = '#1e293b';
  const bgColor = isLineArt ? '#ffffff' : '#f8fafc';
  const accentFill1 = isLineArt ? '#ffffff' : '#e0f2fe';
  const accentFill2 = isLineArt ? '#ffffff' : '#fef3c7';
  const accentFill3 = isLineArt ? '#ffffff' : '#ecfdf5';
  const strokeAccent = isLineArt ? strokeColor : '#0284c7';

  // Food / Cooking
  if (t.includes('food') || t.includes('cook') || t.includes('kitchen') || t.includes('fruit') || t.includes('meal') || t.includes('eat') || t.includes('restaurant')) {
    return `<svg viewBox="0 0 400 240" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="380" height="220" rx="14" fill="${bgColor}" stroke="${isLineArt ? strokeColor : '#cbd5e1'}" stroke-width="2" />
      <line x1="30" y1="190" x2="370" y2="190" stroke-width="3" />
      <!-- Bowl -->
      <path d="M120 120 C120 190, 280 190, 280 120 Z" fill="${accentFill3}" stroke="${isLineArt ? strokeColor : '#059669'}" />
      <ellipse cx="200" cy="120" rx="80" ry="16" fill="${accentFill3}" />
      <!-- Apple -->
      <path d="M180 110 C170 95, 190 80, 200 92 C210 80, 230 95, 220 110 C215 125, 185 125, 180 110 Z" fill="${isLineArt ? '#ffffff' : '#fee2e2'}" stroke="${isLineArt ? strokeColor : '#dc2626'}" />
      <path d="M200 92 C200 80, 206 72, 210 70" />
      <!-- Carrot -->
      <path d="M60 160 L115 185 C118 186, 120 182, 116 180 L95 135 C92 130, 65 150, 60 160 Z" fill="${isLineArt ? '#ffffff' : '#ffedd5'}" stroke="${isLineArt ? strokeColor : '#ea580c'}" />
      <path d="M60 152 C48 145, 42 138, 38 135" />
      <!-- Glass -->
      <path d="M300 120 L310 188 C310 190, 340 190, 340 188 L350 120 Z" fill="${accentFill1}" stroke="${strokeAccent}" />
      <ellipse cx="325" cy="120" rx="25" ry="8" fill="${accentFill1}" />
    </svg>`;
  }

  // Travel / Airport / Transit
  if (t.includes('travel') || t.includes('airport') || t.includes('transit') || t.includes('flight') || t.includes('city') || t.includes('hotel') || t.includes('tour') || t.includes('vacation')) {
    return `<svg viewBox="0 0 400 240" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="380" height="220" rx="14" fill="${bgColor}" stroke="${isLineArt ? strokeColor : '#cbd5e1'}" stroke-width="2" />
      <line x1="30" y1="200" x2="370" y2="200" stroke-width="3" />
      <!-- Suitcase -->
      <rect x="70" y="90" width="90" height="100" rx="10" fill="${accentFill1}" stroke="${strokeAccent}" />
      <path d="M100 90 V55 H130 V90" stroke-width="2.5" />
      <line x1="70" y1="125" x2="160" y2="125" stroke-dasharray="3 3" />
      <line x1="70" y1="155" x2="160" y2="155" stroke-dasharray="3 3" />
      <circle cx="88" cy="195" r="5" fill="${strokeColor}" />
      <circle cx="142" cy="195" r="5" fill="${strokeColor}" />
      <!-- Airplane -->
      <path d="M220 130 L270 120 L320 80 L330 90 L300 130 L345 140 L355 130 L358 145 L335 155 L260 165 L220 150 Z" fill="${accentFill2}" stroke="${isLineArt ? strokeColor : '#d97706'}" />
    </svg>`;
  }

  // Study / Classroom / Grammar / Reading / Books
  return `<svg viewBox="0 0 400 240" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="380" height="220" rx="14" fill="${bgColor}" stroke="${isLineArt ? strokeColor : '#cbd5e1'}" stroke-width="2" />
    <line x1="30" y1="200" x2="370" y2="200" stroke-width="3" />
    <!-- Open Book -->
    <path d="M80 180 C130 165, 180 180, 200 185 C220 180, 270 165, 320 180 L320 90 C270 75, 220 90, 200 95 C180 90, 130 75, 80 90 Z" fill="${accentFill1}" stroke="${strokeAccent}" />
    <line x1="200" y1="95" x2="200" y2="185" stroke-width="2" />
    <!-- Left book lines -->
    <line x1="100" y1="110" x2="175" y2="105" stroke-dasharray="4 4" />
    <line x1="100" y1="130" x2="175" y2="125" stroke-dasharray="4 4" />
    <line x1="100" y1="150" x2="175" y2="145" stroke-dasharray="4 4" />
    <!-- Right book lines -->
    <line x1="225" y1="105" x2="300" y2="110" stroke-dasharray="4 4" />
    <line x1="225" y1="125" x2="300" y2="130" stroke-dasharray="4 4" />
    <line x1="225" y1="145" x2="300" y2="150" stroke-dasharray="4 4" />
    <!-- Pencil -->
    <path d="M280 60 L340 30 L355 45 L295 75 Z" fill="${accentFill2}" stroke="${isLineArt ? strokeColor : '#d97706'}" />
    <polygon points="280,60 265,65 295,75" fill="${isLineArt ? '#ffffff' : '#fed7aa'}" />
  </svg>`;
}

function generatePedagogicalFallback(topic: string, gradeLevel: string, template: string = 'comprehensive'): string {
  const cleanTopic = (topic || 'Everyday Communication').trim();
  const upperTopic = cleanTopic.toUpperCase();
  const upperLevel = (gradeLevel || 'Beginner (A1-A2)').toUpperCase();

  if (template === 'vocab_matching') {
    return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic} (VOCABULARY MATCHING)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the following sections carefully and complete the exercises.

SECTION A: Target Vocabulary Matching
Match each key vocabulary word on the left with its correct definition on the right. Write the matching letter (A-D) in each bracket.

[   ] 1. Essential Expression       A. A polite question used to obtain needed assistance or information
[   ] 2. Routine Practice           B. A fundamental phrase or word used regularly in this context
[   ] 3. Clear Request              C. A regular, habitual action performed as part of the daily schedule
[   ] 4. Practical Solution         D. A sensible and effective method of completing a common daily task

SECTION B: Fill-in-the-Blank Sentences
Word Bank: [ essential expression | routine practice | clear request | practical solution ]
Choose the correct term from the word bank to complete each statement:

1. Making a _______________________ helps everyone understand what you need without confusion.
2. Reviewing new words every morning is a _______________________ that accelerates language learning.
3. Saying "could you please assist me?" is an _______________________ for customer service situations.
4. Finding a quiet area to study proved to be a _______________________ for improving concentration.

SECTION C: Word in Action (Original Sentences)
Choose two terms from Section A and compose one complete, original sentence for each regarding ${cleanTopic}:

1. Term: _______________________
   Sentence: _______________________________________________________________________________
   _________________________________________________________________________________________

2. Term: _______________________
   Sentence: _______________________________________________________________________________
   _________________________________________________________________________________________

--- End of Worksheet ---`;
  }

  if (template === 'grammar_exercise') {
    return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic} (GRAMMAR DRILL)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Review the grammar focus carefully and complete all three sections below.

SECTION A: Verb Form Selection & Fill-in-the-Blank
Complete each sentence by placing the verb in parentheses into the correct tense or grammatical form for ${cleanTopic}:

1. Yesterday afternoon, the team _______________________ (complete) the final review before the deadline.
2. She _______________________ (not submit) her travel report yet because she is still verifying costs.
3. If they arrive early tomorrow, we _______________________ (start) the workshop immediately.
4. While I _______________________ (prepare) the presentation slides, my colleague called with updates.

SECTION B: Spot the Mistake & Rewrite Correctly
Each sentence below contains one grammatical error. Underline the mistake and write the corrected sentence on the line:

1. Sentence: "She has went to the central library yesterday morning after her lecture."
   Correction: _____________________________________________________________________________

2. Sentence: "They didn't heard the flight announcement because of the loud music."
   Correction: _____________________________________________________________________________

3. Sentence: "If it will rain this afternoon, we will cancel our outdoor practice."
   Correction: _____________________________________________________________________________

SECTION C: Sentence Transformation
Rewrite each sentence using the prompt words given, keeping the original meaning intact:

1. Original: "I started working on this project two years ago, and I am still working on it."
   Rewrite (Use 'have worked'): ___________________________________________________________

2. Original: "It is necessary for all passengers to show their boarding passes at the gate."
   Rewrite (Use 'must'): ___________________________________________________________________

3. Original: "Because he didn't check the schedule, he arrived thirty minutes late."
   Rewrite (Use 'If he had'): _____________________________________________________________

--- End of Worksheet ---`;
  }

  if (template === 'quiz') {
    return `Name: ______________________ Date: ___________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (ASSESSMENT QUIZ)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read each question carefully. Answer all questions directly on the test paper. Total time: 25 minutes.

SECTION A: Multiple Choice Questions (4 Points)
Circle the letter of the correct answer for each question regarding ${cleanTopic}:

1. Which phrase is the most natural and polite way to begin an inquiry?
   [   ] A. "Hey, do this for me now."
   [   ] B. "Excuse me, could you please tell me where the meeting is?"
   [   ] C. "Tell me where to go right away."
   [   ] D. "I demand an immediate answer."

2. When you do not understand what someone just said, what should you say?
   [   ] A. "You are speaking unclearly."
   [   ] B. "Talk louder and slower."
   [   ] C. "Pardon me, could you repeat that once more, please?"
   [   ] D. "Never mind, forget it."

3. Which expression indicates agreement during a collaborative discussion?
   [   ] A. "I see your point and I completely agree."
   [   ] B. "That makes zero sense to me."
   [   ] C. "I don't care what you think."
   [   ] D. "You are definitely wrong."

SECTION B: True or False Statements (3 Points)
Write 'TRUE' or 'FALSE' in the bracket. If false, write one sentence explaining why:

[        ] 1. Active listening involves nodding and asking clarifying questions when appropriate.
Explanation: _______________________________________________________________________________

[        ] 2. In professional communication, informal slang is always preferred over polite standard terms.
Explanation: _______________________________________________________________________________

SECTION C: Short Answer Inquiry (3 Points)
Answer the prompt below in 2-3 complete, well-crafted sentences:

Prompt: Explain why clear communication and proper vocabulary are essential when discussing ${cleanTopic}:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
  }

  if (template === 'reading_comprehension') {
    return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic} (READING & ANALYSIS)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the informational text below. Annotate key points, then answer the questions in Sections B and C.

SECTION A: Reading Passage
[Paragraph 1] In everyday life, the principles of ${cleanTopic} play a central role in how people collaborate and build successful habits. When individuals take time to plan their approaches carefully, they navigate unexpected challenges with far greater confidence and composure.

[Paragraph 2] Educational studies consistently demonstrate that active engagement with practical scenarios strengthens long-term memory retention. By analyzing real-world examples, students develop nuanced problem-solving skills that translate seamlessly beyond the classroom.

SECTION B: Text-Dependent Comprehension Questions
Answer each question in 1-2 complete sentences based on the reading passage:

1. According to Paragraph 1, what benefit do individuals experience when planning their approaches carefully?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

2. According to Paragraph 2, how does active engagement with practical scenarios benefit students?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

SECTION C: Critical Thinking & Reflection
Answer the following prompt in 2-3 complete sentences:

Prompt: How can you apply the core insights of ${cleanTopic} to improve your own daily learning routine?
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
  }

  // Default 'comprehensive'
  return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic}
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the following sections carefully and complete the exercises.

SECTION A: Everyday Vocabulary Matching
Match each key vocabulary term on the left with its correct definition on the right. Write the corresponding letter (A-D) in each bracket.

[   ] 1. Essential Expression       A. A polite question used to obtain needed information or assistance
[   ] 2. Routine Practice           B. A fundamental word or phrase used regularly in this context
[   ] 3. Clear Request              C. A regular, habitual action performed as part of the daily schedule
[   ] 4. Practical Solution         D. A sensible and effective method of completing a common daily task

SECTION B: Reading Comprehension (Dialogue)
Read the dialogue below between two speakers discussing ${cleanTopic}:

Speaker 1 (Alex): "Hello! Are you getting ready for our plans regarding ${cleanTopic}?"
Speaker 2 (Jordan): "Hi Alex! Yes, I am just reviewing my notes so that everything goes smoothly."
Speaker 1 (Alex): "That is a great habit. Preparing key words in advance makes speaking much easier and more natural."
Speaker 2 (Jordan): "I completely agree. Let's practice our conversation now so we feel confident."

Comprehension Questions:
1. What was Jordan doing to prepare for ${cleanTopic}?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

2. According to Alex, what makes speaking English easier and more natural?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

3. Write one question you would ask a partner about ${cleanTopic}:
   _________________________________________________________________________________________
   _________________________________________________________________________________________

SECTION C: Speaking & Roleplay Practice
Pair Work Activity:
Work with a partner. Student A asks three questions regarding ${cleanTopic}. Student B answers using complete sentences. Switch roles after three minutes.

My Speaking Notes & Vocabulary:
• _________________________________________________________________________________________
• _________________________________________________________________________________________
• _________________________________________________________________________________________

--- End of Worksheet ---`;
}

function buildTemplatePrompt(topic: string, gradeLevel: string, template: string = 'comprehensive'): string {
  const level = gradeLevel || 'beginner (A1-A2)';
  const baseHeader = `You are an expert English as a Foreign Language (EFL/ESL) teacher. 
Create a highly structured, realistic classroom worksheet about "${topic}" for students at the "${level}" proficiency level.

Formatting Requirements (Plain text for school worksheets, no markdown backticks):
Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${topic.toUpperCase()}
Proficiency Level: ${level.toUpperCase()}

INSTRUCTIONS: 
Read the instructions for each section carefully and write your answers clearly in the spaces provided.`;

  if (template === 'vocab_matching') {
    return `${baseHeader}

SECTION A: Match the Words with Their Definitions
(Provide 4 key vocabulary words on the left with brackets [   ] 1-4 and 4 accurate, clear definitions on the right with letters A-D related to "${topic}").

SECTION B: Fill in the Blanks with Words from the Box
(Provide: Word Bank: [ word1 | word2 | word3 | word4 ])
(Provide 4 fill-in-the-blank sentences using the word bank words with clear blank lines: _______________________).

SECTION C: Put the Words in Brackets in the Right Form
(Provide 3-4 sentences where students put bracketed root words like (pollute), (travel), (danger), (careful) into the correct grammatical form on the blank line: _______________________).

SECTION D: What Would You Do? (Hypothetical Reflection)
If you were in a situation related to "${topic}", what would you do? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
  }

  if (template === 'grammar_exercise') {
    return `${baseHeader}

SECTION A: Put the Verbs in the Correct Tense or Form
(Provide 4 grammar practice sentences related to "${topic}" with verbs in parentheses like (travel), (not see), (arrive), (be) and blanks: _______________________).

SECTION B: Spot the Mistake & Rewrite Correctly
(Provide 3 sentences that each contain one grammatical error. Include lines underneath: Correction: _____________________________________________________________________________).

SECTION C: Sentence Transformation & Conditionals
(Provide 2-3 sentence transformations or "If you were..." conditional prompts related to "${topic}").

--- End of Worksheet ---`;
  }

  if (template === 'quiz') {
    return `You are an expert ESL test writer.
Create a formal, clean formative assessment quiz about "${topic}" for "${level}" students.

Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${topic.toUpperCase()} (ASSESSMENT QUIZ)
Proficiency Level: ${level.toUpperCase()}

INSTRUCTIONS: 
Read each question carefully and write your answers directly on this paper.

SECTION A: Multiple Choice Questions (4 Points)
(Provide 3-4 realistic multiple choice questions about "${topic}" with choices [   ] A. ..., [   ] B. ..., [   ] C. ..., [   ] D. ...).

SECTION B: True or False Statements (3 Points)
(Provide 2-3 statements with [        ] brackets for TRUE/FALSE and an Explanation line underneath).

SECTION C: What Would You Do? (Scenario Reflection) (3 Points)
(Provide 1 hypothetical scenario prompt: "If you were... what would you do? Explain in 2-3 sentences:" with 3 blank lines).

--- End of Worksheet ---`;
  }

  if (template === 'reading_comprehension') {
    return `${baseHeader}

SECTION A: Reading Passage
(Provide a 2-paragraph engaging text about "${topic}". Include 2 underlined words like <u>they</u> or <u>this solution</u> in the text).

SECTION B: Comprehension & Reference Questions
(Provide 2 text comprehension questions, plus 1 Reference Question: "What does the underlined word '...' in paragraph 1 refer to?").

SECTION C: Put the Words in Brackets in the Right Form
(Provide 2 sentences testing word forms from the text with blanks _______________________).

SECTION D: What Would You Do? (Critical Reflection)
If you were in a real-world scenario regarding "${topic}", what would you do? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
  }

  // Default 'comprehensive'
  return `${baseHeader}

SECTION A: Match the Words with Their Definitions
(Provide 4 key vocabulary terms [   ] 1-4 and definitions A-D about "${topic}").

SECTION B: Fill in the Blanks with Words from the Box
(Provide: Word Bank: [ word1 | word2 | word3 | word4 ] and 4 cloze sentences with blanks _______________________).

SECTION C: Put the Words in Brackets in the Right Form
(Provide 3 sentences with bracketed words to conjugate or derive).

SECTION D: What Would You Do? (Expressive Prompt)
If you were in a scenario regarding "${topic}", what would you do? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/generate-illustration', async (req, res) => {
    try {
      const { topic, style, promptDescription } = req.body;
      const targetTopic = (topic || 'Classroom Study').trim();
      const visualStyle = style || 'line_art';

      const systemPrompt = `You are a professional educational textbook illustrator. 
Generate a clean, high-contrast, black-and-white or subtly accented SVG illustration for a classroom worksheet topic: "${targetTopic}".
${promptDescription ? `Specific detail: ${promptDescription}` : ''}
Style guidelines:
- Output ONLY valid, clean SVG markup starting with <svg and ending with </svg>.
- Use viewBox="0 0 400 240", stroke-width="2.5", stroke-linecap="round", stroke-linejoin="round".
- ${visualStyle === 'line_art' ? 'Stroke should be "#1e293b", fill="none" (or "#ffffff" for solid foregrounds), crisp and optimized for school photocopying and clear printing.' : 'Stroke should be "#1e293b" with gentle pastel educational fills (#e0f2fe, #fef3c7, #ecfdf5, #fee2e2) and clear outline borders.'}
- The graphic must clearly depict 2-3 recognizable objects or elements relevant to "${targetTopic}".
- Do NOT include any markdown code fences, backticks, or explanatory text before or after the <svg> tags.`;

      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not configured. Providing educational vector fallback.');
        const fallbackSvg = generateThematicSvgFallback(targetTopic, visualStyle, promptDescription);
        return res.json({ svg: fallbackSvg, source: 'synthesizer' });
      }

      let generatedSvg: string | null = null;
      let usedModel: string | null = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const ai = getGenAI();
          const response = await ai.models.generateContent({
            model: modelName,
            contents: systemPrompt,
            config: {
              temperature: 0.4,
            },
          });

          if (response && response.text) {
            let text = response.text.trim();
            // Clean up any potential markdown fences
            if (text.includes('```xml')) {
              text = text.replace(/```xml/g, '').replace(/```/g, '').trim();
            } else if (text.includes('```svg')) {
              text = text.replace(/```svg/g, '').replace(/```/g, '').trim();
            } else if (text.includes('```')) {
              text = text.replace(/```/g, '').trim();
            }

            const svgStart = text.indexOf('<svg');
            const svgEnd = text.lastIndexOf('</svg>');
            if (svgStart !== -1 && svgEnd !== -1) {
              generatedSvg = text.slice(svgStart, svgEnd + 6);
              usedModel = modelName;
              break;
            }
          }
        } catch (err: any) {
          const status = err?.status || err?.code || 500;
          const errStr = (err?.message || String(err)).toLowerCase();
          const isHighDemand = status === 503 || errStr.includes('503') || errStr.includes('high demand') || errStr.includes('unavailable');
          
          if (isHighDemand) {
            console.log(`[LexiScan AI] Illustration model ${modelName} experiencing temporary peak demand (503). Cascading to next model...`);
            await new Promise((r) => setTimeout(r, 250));
          } else {
            console.log(`[LexiScan AI] Illustration gen notice on ${modelName}:`, err?.message || 'Error');
            await new Promise((r) => setTimeout(r, 150));
          }
        }
      }

      if (generatedSvg) {
        return res.json({ svg: generatedSvg, source: 'ai', model: usedModel });
      }

      // If AI models encounter temporary peak demand, synthesize educational vector graphic
      const fallbackSvg = generateThematicSvgFallback(targetTopic, visualStyle, promptDescription);
      return res.json({ 
        svg: fallbackSvg, 
        source: 'synthesizer',
        notice: 'Generated using curriculum vector synthesizer during temporary model capacity peak.'
      });
    } catch (err: any) {
      console.log('[LexiScan AI] Illustration handled with vector fallback:', err?.message || err);
      const fallbackSvg = generateThematicSvgFallback(
        req.body?.topic || 'Classroom Study', 
        req.body?.style || 'line_art', 
        req.body?.promptDescription
      );
      res.json({ 
        svg: fallbackSvg, 
        source: 'synthesizer', 
        details: err?.message || 'Handled with vector synthesizer fallback' 
      });
    }
  });

  app.post('/api/generate-worksheet', async (req, res) => {
    try {
      const { topic, gradeLevel, template, customPrompt } = req.body;
      const selectedTemplate = template || 'comprehensive';
      
      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const prompt = customPrompt && typeof customPrompt === 'string' && customPrompt.trim().length > 30
        ? customPrompt.trim()
        : buildTemplatePrompt(topic.trim(), gradeLevel, selectedTemplate);

      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not configured. Providing educational fallback.');
        const fallback = generatePedagogicalFallback(topic, gradeLevel, selectedTemplate);
        return res.json({ worksheet: fallback, source: 'fallback' });
      }

      let generatedWorksheet: string | null = null;
      let usedModelName: string | null = null;

      // Try candidate models in order, with exponential backoff on 503 / 429 high demand spikes
      for (const modelName of CANDIDATE_MODELS) {
        try {
          console.log(`[LexiScan AI] Generating worksheet via model ${modelName} (Template: ${selectedTemplate})...`);
          const ai = getGenAI();
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              temperature: 0.7,
            },
          });

          if (response && response.text && response.text.trim().length > 0) {
            generatedWorksheet = response.text;
            usedModelName = modelName;
            console.log(`[LexiScan AI] Successfully generated worksheet using model: ${modelName}`);
            break;
          }
        } catch (err: any) {
          const status = err?.status || err?.code || 500;
          const errStr = (err?.message || String(err)).toLowerCase();
          const isHighDemand = status === 503 || errStr.includes('503') || errStr.includes('high demand') || errStr.includes('unavailable');
          const isRateLimited = status === 429 || errStr.includes('429') || errStr.includes('rate limit') || errStr.includes('quota');

          if (isHighDemand || isRateLimited) {
            console.log(`[LexiScan AI] Model ${modelName} is experiencing temporary high demand/rate limit (${status}). Seamlessly switching to next model...`);
            // Brief 250ms pause before attempting next candidate model
            await new Promise(resolve => setTimeout(resolve, 250));
          } else {
            console.log(`[LexiScan AI] Model ${modelName} notice: ${err?.message || 'Error'}. Proceeding to alternate candidate...`);
          }
        }
      }

      if (generatedWorksheet) {
        return res.json({ worksheet: generatedWorksheet, source: 'ai', model: usedModelName });
      }

      // If all candidate models encounter temporary 503 high demand or capacity limits, fallback gracefully
      console.log('[LexiScan AI] All AI models currently at peak demand. Delivering curriculum template fallback.');
      const fallbackWorksheet = generatePedagogicalFallback(topic, gradeLevel, selectedTemplate);
      return res.json({ 
        worksheet: fallbackWorksheet, 
        source: 'fallback',
        notice: 'Generated using curriculum template due to temporary AI model capacity limits.'
      });

    } catch (error: any) {
      console.log('[LexiScan AI] Handled generation error with curriculum fallback:', error?.message || error);
      const fallbackWorksheet = generatePedagogicalFallback(
        req.body?.topic || 'English Lesson', 
        req.body?.gradeLevel || 'Beginner', 
        req.body?.template || 'comprehensive'
      );
      res.json({ 
        worksheet: fallbackWorksheet, 
        source: 'fallback', 
        details: error?.message || 'Handled gracefully with template fallback' 
      });
    }
  });

  app.post('/api/chat-worksheet', async (req, res) => {
    try {
      const { messages, currentWorksheet } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages history is required' });
      }

      // Convert messages to history string
      const conversationHistory = messages.map((m: any) => {
        const role = m.sender === 'user' ? 'User (Teacher)' : 'Assistant (Curriculum Designer)';
        return `${role}: ${m.text}`;
      }).join('\n\n');

      const systemInstruction = `You are a distinguished Senior English Teacher and Curriculum Specialist with over 20 years of classroom experience.
You specialize in designing balanced, engaging, and pedagogically sound English worksheets for students of all proficiency levels.
Your persona is warm, encouraging, highly professional, articulate, and deeply committed to student academic growth.
Your conversational responses MUST reflect this Senior English Teacher persona:
- Use encouraging, professional educational vocabulary (e.g. "pedagogical progression", "scaffolded exercises", "conceptual reinforcement").
- Briefly offer practical tips on how to deliver or scaffold the exercises in class.
- Support and validate the teacher's requests with professional enthusiasm.

Your primary task is to help the teacher design, generate, and refine high-quality educational worksheets.
The user is having a conversational chat with you. Based on the history, understand what change or creation is requested.
If there is an existing worksheet provided, always keep or refine its parts instead of discarding it unless asked to start fresh.

You MUST respond with a JSON object containing EXACTLY:
1. "assistantResponse": A warm, professional response (1-3 sentences) in your Senior English Teacher voice describing the educational reasoning behind what you did/refined (e.g., "I have successfully generated a new grammar drill on travelling, scaffolded with 5 questions to reinforce past participle forms. I suggest reading these aloud in class first!").
2. "worksheet": The full, complete plain-text worksheet itself. Never truncate, omit sections, or output short snippets. Always render the entire worksheet.

Worksheet format rules:
- Name and Date blank lines at the very top.
- Clear, descriptive title.
- High-quality instructional text for each section.
- Exercises using standard types: Match definitions, fill in the blanks, conjugate/word forms in brackets, reading comprehension passage with underlined words, or critical reflection questions ("If you were... what would you do?").
- Include blanks (e.g. "_______________________") for students to write answers.`;

      const prompt = `CONVERSATION HISTORY:
${conversationHistory}

${currentWorksheet ? `CURRENT WORKSHEET IN BUILDER (Modify or expand this based on the user's last message):
${currentWorksheet}` : 'No worksheet generated yet. Create a beautiful new worksheet based on the user\'s prompt.'}

Please output the JSON matching the required schema.`;

      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not configured for chat. Providing educational fallback response.');
        const lastUserMsg = messages.filter((m: any) => m.sender === 'user').pop()?.text || 'English Lesson';
        const fallbackWorksheet = generatePedagogicalFallback(lastUserMsg, 'Intermediate (B1-B2)', 'comprehensive');
        return res.json({
          assistantResponse: "Here is a beautifully structured worksheet customized to your request.",
          worksheet: fallbackWorksheet,
          source: 'fallback'
        });
      }

      let resultObj: any = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          console.log(`[LexiScan Chat] Invoking model ${modelName} for conversational worksheet creation...`);
          const ai = getGenAI();
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.6,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  assistantResponse: {
                    type: Type.STRING,
                    description: "A short, friendly 1-2 sentence message describing what was done or changed."
                  },
                  worksheet: {
                    type: Type.STRING,
                    description: "The complete, fully revised plain-text worksheet ready for A4 printing."
                  }
                },
                required: ["assistantResponse", "worksheet"]
              }
            }
          });

          if (response && response.text) {
            const cleanedText = cleanJsonResponse(response.text);
            const parsed = JSON.parse(cleanedText);
            if (parsed.assistantResponse && parsed.worksheet) {
              resultObj = parsed;
              console.log(`[LexiScan Chat] Successfully completed conversational turn via ${modelName}`);
              break;
            }
          }
        } catch (err: any) {
          const status = err?.status || err?.code || 500;
          const errStr = (err?.message || String(err)).toLowerCase();
          const isHighDemand = status === 503 || errStr.includes('503') || errStr.includes('high demand') || errStr.includes('unavailable');
          const isRateLimited = status === 429 || errStr.includes('429') || errStr.includes('rate limit') || errStr.includes('quota');

          if (isHighDemand || isRateLimited) {
            console.log(`[LexiScan Chat] Model ${modelName} is temporarily overloaded/busy (${status}). Cascading to next candidate...`);
            await new Promise(resolve => setTimeout(resolve, 250));
          } else {
            console.log(`[LexiScan Chat] Model ${modelName} trial notice:`, err?.message || err);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      if (resultObj) {
        return res.json({
          assistantResponse: resultObj.assistantResponse,
          worksheet: resultObj.worksheet,
          source: 'ai'
        });
      }

      // Final fallback
      const lastUserMsg = messages.filter((m: any) => m.sender === 'user').pop()?.text || 'English Lesson';
      const fallbackWorksheet = generatePedagogicalFallback(lastUserMsg, 'Intermediate (B1-B2)', 'comprehensive');
      res.json({
        assistantResponse: "I processed your request and established this standard curriculum template for you.",
        worksheet: fallbackWorksheet,
        source: 'fallback'
      });

    } catch (error: any) {
      console.error('[LexiScan Chat] Fatal chat route error:', error);
      res.json({
        assistantResponse: "I encountered a minor processing issue, so I provided a structured template for your topic.",
        worksheet: generatePedagogicalFallback('Grammar & Vocabulary Practice', 'Intermediate (B1-B2)', 'comprehensive'),
        source: 'fallback'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
