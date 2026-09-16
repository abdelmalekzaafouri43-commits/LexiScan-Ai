export type WorksheetTemplateId = 
  | 'vocab_matching' 
  | 'grammar_exercise' 
  | 'quiz' 
  | 'comprehensive'
  | 'reading_comprehension';

export interface WorksheetTemplate {
  id: WorksheetTemplateId;
  name: string;
  tagline: string;
  description: string;
  category: string;
  iconName: 'book-open' | 'check-circle' | 'help-circle' | 'layers' | 'file-text';
  sections: {
    code: string;
    title: string;
    description: string;
  }[];
  suggestedTopics: string[];
  sampleGenerator: (topic: string, gradeLevel: string) => string;
}

export const WORKSHEET_TEMPLATES: Record<WorksheetTemplateId, WorksheetTemplate> = {
  vocab_matching: {
    id: 'vocab_matching',
    name: 'Vocabulary Matching',
    tagline: 'Term association, word banks, and context usage',
    description: 'Focuses on building lexical mastery through definitions matching, cloze sentences, and active word application.',
    category: 'Vocabulary & Lexis',
    iconName: 'book-open',
    sections: [
      { code: 'SECTION A', title: 'Target Vocabulary Matching', description: 'Match 4-5 key terms to precise definitions (A-D/E).' },
      { code: 'SECTION B', title: 'Fill-in-the-Blank (Cloze Practice)', description: 'Complete sentences using terms from the provided word bank.' },
      { code: 'SECTION C', title: 'Word in Action (Creative Writing)', description: 'Write original sentences utilizing the new target vocabulary.' },
    ],
    suggestedTopics: [
      'Kitchen & Culinary Tools',
      'Airport & Travel Essentials',
      'Medical & Pharmacy Terms',
      'Office & Digital Collaboration',
      'At the Restaurant & Ordering',
      'Weather & Climate Terms'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Kitchen & Cooking';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Beginner (A1-A2)').toUpperCase();

      return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic} (VOCABULARY MATCHING)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the following sections carefully and complete the exercises.

SECTION A: Target Vocabulary Matching
Match each key vocabulary word on the left with its correct definition on the right. Write the matching letter (A-D) in each bracket.

[   ] 1. Essential Tool            A. A clear, step-by-step guide explaining how to prepare a dish
[   ] 2. Fresh Ingredient          B. A specific utensil or device used to perform a culinary task
[   ] 3. Detailed Recipe           C. An item of food used in combination with others to make a meal
[   ] 4. Safe Preparation          D. The careful act of washing, cutting, and seasoning food safely

SECTION B: Fill-in-the-Blank Sentences
Word Bank: [ essential tool | fresh ingredient | detailed recipe | safe preparation ]
Choose the correct term from the word bank to complete each statement:

1. Before starting to cook, follow proper _______________________ by washing your hands and surfaces.
2. Fresh garlic is a key _______________________ that adds rich flavor to many home meals.
3. A good chef's knife is an _______________________ that makes cutting vegetables much faster.
4. She consulted the _______________________ to make sure she added the exact amount of olive oil.

SECTION C: Word in Action (Original Sentences)
Choose two words from Section A and compose one complete sentence for each, describing your own experience with ${cleanTopic}:

1. Word: _______________________
   Sentence: _______________________________________________________________________________
   _________________________________________________________________________________________

2. Word: _______________________
   Sentence: _______________________________________________________________________________
   _________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  },

  grammar_exercise: {
    id: 'grammar_exercise',
    name: 'Grammar Exercise',
    tagline: 'Targeted syntax drills, error correction, & transformations',
    description: 'Drills accurate sentence structures, verb tenses, error identification, and communicative transformations.',
    category: 'Grammar & Syntax',
    iconName: 'check-circle',
    sections: [
      { code: 'SECTION A', title: 'Verb Conjugation & Form Selection', description: 'Fill the blanks using the correct form of the verbs in parentheses.' },
      { code: 'SECTION B', title: 'Error Correction & Spotting', description: 'Identify the grammatical error in each sentence and rewrite it correctly.' },
      { code: 'SECTION C', title: 'Sentence Transformation / Combining', description: 'Rewrite sentences using target conjunctions or conditional clauses.' },
    ],
    suggestedTopics: [
      'Past Simple vs. Present Perfect',
      'First & Second Conditionals',
      'Prepositions of Place & Time',
      'Modals of Advice & Obligation (Should / Must)',
      'Comparative & Superlative Adjectives',
      'Passive Voice in Everyday News'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Past Simple vs. Present Perfect';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Intermediate (B1-B2)').toUpperCase();

      return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic} (GRAMMAR DRILL)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Review the grammar focus carefully and complete all three sections below.

SECTION A: Verb Tense Selection & Conjugation
Complete the sentences by placing the verb in parentheses into the correct tense for ${cleanTopic}:

1. Last summer, Maria _______________________ (travel) to Spain for an intensive language workshop.
2. I _______________________ (not finish) my homework yet, so I cannot go out tonight.
3. We _______________________ (visit) that science museum three times since it opened last year.
4. When they _______________________ (arrive) at the airport yesterday, the flight was already boarding.

SECTION B: Spot the Mistake & Rewrite Correctly
Each sentence below contains one grammatical error. Underline the mistake and write the corrected sentence on the line below:

1. Sentence: "He has gone to the bookstore yesterday afternoon after his class."
   Correction: _____________________________________________________________________________

2. Sentence: "I didn't saw my best friend since last Monday morning."
   Correction: _____________________________________________________________________________

3. Sentence: "Did you already finished reading the chapter that was assigned?"
   Correction: _____________________________________________________________________________

SECTION C: Sentence Transformation
Rewrite each sentence starting with the prompt words given, keeping the original meaning intact:

1. Original: "I started living in this city five years ago, and I still live here."
   Rewrite (Use 'have lived'): _____________________________________________________________

2. Original: "It has been three months since Daniel last called his cousin."
   Rewrite (Use 'for three months'): _______________________________________________________

3. Original: "She bought the tickets on Friday and still has them in her pocket."
   Rewrite (Use 'already'): _______________________________________________________________

--- End of Worksheet ---`;
    }
  },

  quiz: {
    id: 'quiz',
    name: 'Quiz (Assessment)',
    tagline: 'Formal assessment with MCQs, True/False, & open inquiry',
    description: 'Structured diagnostic or summative test featuring scoring rubrics, multiple-choice, true/false, and short essays.',
    category: 'Assessment & Test',
    iconName: 'help-circle',
    sections: [
      { code: 'SECTION A', title: 'Multiple Choice Questions (MCQ)', description: 'Select the single best answer from choices A, B, C, or D.' },
      { code: 'SECTION B', title: 'True or False with Evidence', description: 'Determine validity of factual statements and note the reason.' },
      { code: 'SECTION C', title: 'Short Answer Inquiry & Explanation', description: 'Demonstrate deep conceptual mastery in 2-3 complete sentences.' },
    ],
    suggestedTopics: [
      'Travel & Cultural Etiquette Quiz',
      'Business Email & Workplace Review',
      'Daily Conversation & Polite Phrasing',
      'Health, Fitness & Wellness Checkup',
      'Environmental Awareness & Sustainability',
      'Everyday Phrasal Verbs Assessment'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Travel Etiquette & Customs';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Beginner (A1-A2)').toUpperCase();

      return `Name: ______________________ Date: ___________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (FORMATIVE QUIZ)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read each question carefully. Answer all questions directly on the test paper. Total time: 25 minutes.

SECTION A: Multiple Choice Questions (4 Points)
Circle the letter of the correct answer for each question regarding ${cleanTopic}:

1. What is the most appropriate phrase when greeting a shopkeeper in English?
   [   ] A. "Hey you, give me that."
   [   ] B. "Good morning! Could you help me find this item, please?"
   [   ] C. "How much is this right now?"
   [   ] D. "I demand to see your manager immediately."

2. When asking for directions to the nearest train station, which question is most polite?
   [   ] A. "Where train station?"
   [   ] B. "Take me to the train right now."
   [   ] C. "Excuse me, could you tell me the way to the central train station?"
   [   ] D. "Is train open?"

3. Which phrase is commonly used to politely ask for clarification during a conversation?
   [   ] A. "Speak louder!"
   [   ] B. "I beg your pardon, could you repeat that once more?"
   [   ] C. "You are not speaking clearly."
   [   ] D. "Never mind."

SECTION B: True or False Statements (3 Points)
Write 'TRUE' or 'FALSE' in the bracket. If false, write one sentence explaining why:

[        ] 1. It is considered polite to say "Thank you" and "Have a nice day" when leaving a store.
Explanation: _______________________________________________________________________________

[        ] 2. Interrupting someone while they are speaking is acceptable in formal discussions.
Explanation: _______________________________________________________________________________

SECTION C: Short Answer Inquiry (3 Points)
Answer the prompt below in 2-3 complete, well-formed sentences:

Prompt: Describe one essential etiquette rule you should always remember when communicating about ${cleanTopic} in an English-speaking country:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  },

  comprehensive: {
    id: 'comprehensive',
    name: 'Comprehensive Lesson',
    tagline: 'Balanced 3-part layout: Vocab, Dialogue, & Roleplay',
    description: 'The standard integrated communicative layout combining vocabulary matching, dialogue comprehension, and peer roleplay.',
    category: 'Integrated Skills',
    iconName: 'layers',
    sections: [
      { code: 'SECTION A', title: 'Everyday Vocabulary Matching', description: 'Vocabulary building with definition pairing.' },
      { code: 'SECTION B', title: 'Reading Comprehension (Dialogue)', description: 'Real-world conversational dialogue with text-based questions.' },
      { code: 'SECTION C', title: 'Speaking & Roleplay Practice', description: 'Collaborative partner prompt with guided speaking notes.' },
    ],
    suggestedTopics: [
      'Grocery Shopping',
      'Commuting to Work',
      'Coffee Shop Ordering',
      'Family & Weekend Plans',
      'Free Time Activities',
      'Visiting the Doctor'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Grocery Shopping';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Beginner (A1-A2)').toUpperCase();

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
  },

  reading_comprehension: {
    id: 'reading_comprehension',
    name: 'Reading & Analysis',
    tagline: 'Informational article, comprehension questions, & debate',
    description: 'Designed for developing reading stamina, summarizing main ideas, contextual inference, and analytical discussion.',
    category: 'Reading & Literacy',
    iconName: 'file-text',
    sections: [
      { code: 'SECTION A', title: 'Reading Passage / Informational Text', description: 'Curated passage with paragraph markers and target vocabulary.' },
      { code: 'SECTION B', title: 'Text-Dependent Comprehension Questions', description: 'Factual retrieval, inference, and vocabulary in context.' },
      { code: 'SECTION C', title: 'Critical Thinking & Reflection Prompt', description: 'Open-ended reflection encouraging personal opinion and argumentation.' },
    ],
    suggestedTopics: [
      'The History of the Olympic Games',
      'Artificial Intelligence in Modern Schools',
      'Sustainable Cities & Green Energy',
      'The Psychology of Habit Formation',
      'Cultural Festivals Around the World',
      'The Importance of Sleep for Brain Health'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Sustainable Living & Clean Energy';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Intermediate (B1-B2)').toUpperCase();

      return `Name: ______________________ Date: ___________

Worksheet Topic: ${upperTopic} (READING & ANALYSIS)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the article below carefully. Annotate key points as you read, then complete the questions in Sections B and C.

SECTION A: Reading Passage
[Paragraph 1] In recent decades, conversations surrounding ${cleanTopic} have evolved from specialized scientific research into mainstream global priority. Communities worldwide are reconsidering everyday habits, from how electricity is generated to how goods are packaged and transported. Small adjustments in daily routines, when multiplied across millions of households, yield measurable positive environmental outcomes.

[Paragraph 2] Modern educators emphasize that understanding ${cleanTopic} requires both factual awareness and active critical thinking. Individuals who develop sustainable habits early in life often inspire their peers, workplaces, and local civic organizations to adopt greener solutions.

SECTION B: Text-Dependent Comprehension Questions
Answer each question in 1-2 complete sentences based directly on the reading passage:

1. According to Paragraph 1, how has the conversation regarding this topic changed in recent decades?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

2. What does the author identify as the result of multiplying small adjustments across millions of households?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

3. According to Paragraph 2, why is it beneficial for individuals to establish these habits early in life?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

SECTION C: Critical Thinking & Personal Reflection
Reflect on the text and write a short response (3-4 sentences) addressing the prompt below:

Prompt: If your school or workplace asked you to propose one practical improvement regarding ${cleanTopic}, what specific action would you recommend and why?
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  }
};
