import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
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
  const baseHeader = `You are an expert English language (ESL) teacher. 
Create a highly realistic, professional English worksheet about "${topic}" for students at the "${level}" proficiency level.

Format the worksheet strictly as plain text (do not output any markdown like ** or #, just clean plain text for printing):

Name: ______________________ Date: ___________

Worksheet Topic: ${topic.toUpperCase()}
Proficiency Level: ${level.toUpperCase()}

INSTRUCTIONS: 
Read the following sections carefully and complete the exercises.`;

  if (template === 'vocab_matching') {
    return `${baseHeader}

SECTION A: Target Vocabulary Matching
(Provide 4 actual vocabulary words or phrases related to "${topic}" and clear, accurate definitions, randomized for matching with brackets [   ] 1-4 and letters A-D).

SECTION B: Fill-in-the-Blank Sentences
(Provide a Word Bank containing the 4 terms from Section A. Then provide 4 fill-in-the-blank sentences testing those words in context with blank lines: _______________________).

SECTION C: Word in Action (Original Sentences)
(Instruct students to pick 2 words and write original sentences describing their experience with "${topic}", providing blank lines for each).

--- End of Worksheet ---`;
  }

  if (template === 'grammar_exercise') {
    return `${baseHeader}

SECTION A: Verb Form Selection & Fill-in-the-Blank
(Provide 4 targeted grammar/syntax practice sentences related to "${topic}" with verbs or words in parentheses like (go) or (study), and clear blanks _______________________ for students to conjugate or fill).

SECTION B: Spot the Mistake & Rewrite Correctly
(Provide 3 sentences that each contain one realistic grammar mistake related to "${topic}". Include lines underneath for students to write the corrected version: Correction: _____________________________________________________________________________).

SECTION C: Sentence Transformation
(Provide 3 sentence transformation prompts where students rewrite a given sentence using target grammar words like conditionals, modals, or tenses while keeping the meaning intact).

--- End of Worksheet ---`;
  }

  if (template === 'quiz') {
    return `You are an expert English language (ESL) teacher. 
Create a formal, realistic assessment quiz about "${topic}" for students at the "${level}" proficiency level.

Format strictly as plain text (do not output markdown like ** or #):

Name: ______________________ Date: ___________ Score: _____ / 20

Worksheet Topic: ${topic.toUpperCase()} (ASSESSMENT QUIZ)
Proficiency Level: ${level.toUpperCase()}

INSTRUCTIONS: 
Read each question carefully and answer all questions directly on this exam sheet. Total time: 25 minutes.

SECTION A: Multiple Choice Questions (4 Points)
(Provide 3-4 realistic multiple-choice questions about "${topic}". For each question, provide 4 choices formatted as [   ] A. ..., [   ] B. ..., [   ] C. ..., [   ] D. ... with exactly one correct answer).

SECTION B: True or False Statements (3 Points)
(Provide 2-3 True or False statements about "${topic}". Format with [        ] brackets for TRUE/FALSE and provide an Explanation line underneath).

SECTION C: Short Answer Inquiry (3 Points)
(Provide 1 conceptual question requiring students to explain a key rule or concept about "${topic}" in 2-3 complete sentences, with blank lines underneath).

--- End of Worksheet ---`;
  }

  if (template === 'reading_comprehension') {
    return `${baseHeader}

SECTION A: Reading Passage
(Provide an informative, high-quality 2-paragraph reading passage about "${topic}" marked with [Paragraph 1] and [Paragraph 2]).

SECTION B: Text-Dependent Comprehension Questions
(Provide 3 comprehension questions that require students to retrieve facts and make inferences from the passage, with blank lines underneath).

SECTION C: Critical Thinking & Reflection
(Provide 1 thought-provoking discussion prompt relating "${topic}" to the student's personal opinion, with lines underneath).

--- End of Worksheet ---`;
  }

  // Default 'comprehensive'
  return `${baseHeader}

SECTION A: Everyday Vocabulary Matching
(Provide 4 actual vocabulary words or phrases related to "${topic}" and their definitions, mixed up for a matching exercise with [   ] and letters A-D).

SECTION B: Reading Comprehension (Dialogue)
(Provide a short, realistic, engaging dialogue between two people about "${topic}").
(Provide 2-3 reading comprehension questions with blank lines underneath for answers).

SECTION C: Speaking & Roleplay Practice
(Provide a brief roleplay scenario or speaking prompt for pair work related to "${topic}").
(Provide space/lines for students to write notes before speaking).

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
