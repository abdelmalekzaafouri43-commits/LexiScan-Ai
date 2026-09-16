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
    name: 'Vocabulary Matching & Context',
    tagline: 'Match definitions, fill in blanks, & put words in correct forms',
    description: 'Builds lexical accuracy with word-to-definition matching, word bank cloze sentences, and word form derivations.',
    category: 'Vocabulary & Lexis',
    iconName: 'book-open',
    sections: [
      { code: 'SECTION A', title: 'Match the Words with Their Definitions', description: 'Match target vocabulary items (1-4) with their definitions (A-D).' },
      { code: 'SECTION B', title: 'Fill in the Blanks with Words from the Box', description: 'Complete sentences using the provided word bank.' },
      { code: 'SECTION C', title: 'Put the Words in the Right Form', description: 'Complete the sentences by placing bracketed root words into the correct grammatical form.' },
    ],
    suggestedTopics: [
      'Pollution & Environmental Protection',
      'Accommodations & Hotel Stays',
      'Celebrations & Cultural Festivals',
      'Travelling & Airport Transit',
      'Entertainments & Leisure Activities',
      'Family Relationships & Friendships'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Pollution & Environmental Care';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Beginner (A1-A2)').toUpperCase();

      return `Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (VOCABULARY & USAGE)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the instructions for each section carefully and write your answers clearly in the spaces provided.

SECTION A: Match the Words with Their Correct Definitions
Match each vocabulary term on the left with its corresponding definition on the right. Write the matching letter (A-D) in each bracket.

[   ] 1. Pollution                  A. Things that are thrown away because they are no longer needed
[   ] 2. Renewable Energy           B. The introduction of harmful substances into the air, water, or soil
[   ] 3. Toxic Waste                C. Power derived from natural resources like sunlight and wind
[   ] 4. Conservation               D. The wise protection and careful preservation of natural resources

SECTION B: Fill in the Blanks with Words from the Box
Word Bank: [ pollution | renewable energy | toxic waste | conservation ]
Choose the correct word from the word bank to complete each sentence:

1. Switching to _______________________ such as solar panels helps reduce greenhouse gases.
2. Plastic bottles and bags are a major cause of ocean _______________________ worldwide.
3. Strict laws prevent factories from dumping _______________________ into nearby rivers.
4. Wildlife _______________________ programs protect endangered animals and their natural habitats.

SECTION C: Put the Words in Brackets in the Right Form
Complete each sentence by putting the root word in parentheses into the correct grammatical form:

1. It is important to act (responsible) _______________________ when dealing with household trash.
2. Many countries are investing heavily in (clean) _______________________ public transport systems.
3. If we don't protect the forests, many species will face total (extinct) _______________________.
4. Air quality in major cities has (improve) _______________________ due to new eco-regulations.

SECTION D: What Would You Do?
If you were the leader of your city, what would you do to reduce pollution in your neighborhood? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  },

  grammar_exercise: {
    id: 'grammar_exercise',
    name: 'Grammar & Syntax Drill',
    tagline: 'Put verbs in right tenses, error spotting, & conditionals',
    description: 'Drills accurate sentence structures, verb tenses, error identification, and communicative transformations.',
    category: 'Grammar & Syntax',
    iconName: 'check-circle',
    sections: [
      { code: 'SECTION A', title: 'Put the Verbs in the Correct Tense or Form', description: 'Fill the blanks using the correct form of the verbs in parentheses.' },
      { code: 'SECTION B', title: 'Spot the Mistake & Rewrite Correctly', description: 'Identify the grammatical error in each sentence and rewrite it correctly.' },
      { code: 'SECTION C', title: 'If You Were... Hypothetical Scenarios', description: 'Complete conditional sentences starting with hypothetical prompts.' },
    ],
    suggestedTopics: [
      'Travelling & Vacation Plans (Past vs. Future)',
      'Accommodations & Hotel Booking Inquiries',
      'Friendships & Social Habits (Conditionals)',
      'Celebrations & Family Traditions (Passive Voice)',
      'Entertainments & Hobbies (Present Perfect)',
      'Protecting the Environment (Modals & Obligation)'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Travelling & Tourism';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Intermediate (B1-B2)').toUpperCase();

      return `Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (GRAMMAR & SYNTAX DRILL)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Review the grammar rules and complete all exercises below with proper syntax and punctuation.

SECTION A: Put the Words in Brackets into the Right Form or Tense
Complete each sentence by placing the verb in parentheses into the correct grammatical form:

1. Last summer, our family (travel) _______________________ across southern Europe by train.
2. If you visit Rome next month, you (see) _______________________ the ancient Colosseum.
3. We (not book) _______________________ our hotel accommodation yet because flight dates changed.
4. While they (wait) _______________________ at the boarding gate, the pilot made an announcement.

SECTION B: Spot the Mistake & Rewrite the Sentence
Each sentence below contains one grammatical error. Find the error and write the correct sentence on the line:

1. Sentence: "She has went to the airport ticket counter two hours ago."
   Correction: _____________________________________________________________________________

2. Sentence: "If I will have enough money, I will travel to Japan next spring."
   Correction: _____________________________________________________________________________

3. Sentence: "They didn't enjoyed their stay at the seaside resort because of the rain."
   Correction: _____________________________________________________________________________

SECTION C: Conditional & Hypothetical Production
If you were planning a trip to a foreign country with your best friends, what would you do first? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  },

  quiz: {
    id: 'quiz',
    name: 'Formative Assessment Quiz',
    tagline: 'Multiple choice, True/False with evidence, & open inquiry',
    description: 'Diagnostic or summative test featuring scoring rubrics, multiple-choice, true/false, and short essays.',
    category: 'Assessment & Test',
    iconName: 'help-circle',
    sections: [
      { code: 'SECTION A', title: 'Multiple Choice Questions (4 Points)', description: 'Select the single best answer from choices A, B, C, or D.' },
      { code: 'SECTION B', title: 'True or False with Evidence (3 Points)', description: 'Determine validity of factual statements and note the reason.' },
      { code: 'SECTION C', title: 'Short Answer & Scenario Reflection (3 Points)', description: 'Demonstrate deep conceptual mastery in 2-3 complete sentences.' },
    ],
    suggestedTopics: [
      'Family Relationships & Household Roles',
      'Friendships & Conflict Resolution',
      'Accommodations & Hotel Etiquette',
      'Celebrations & Cultural Holidays',
      'Entertainments, Cinema & Media Habits',
      'Environmental Challenges & Pollution'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Family Relationships & Friendships';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Beginner (A1-A2)').toUpperCase();

      return `Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (FORMATIVE ASSESSMENT)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read each question carefully. Answer all questions directly on the test paper. Total time: 25 minutes.

SECTION A: Multiple Choice Questions (4 Points)
Circle the letter of the correct answer for each statement:

1. Which quality is most important for maintaining a healthy, long-lasting friendship?
   [   ] A. Gossiping about private secrets
   [   ] B. Mutual trust, empathy, and active listening
   [   ] C. Competing over who has more possessions
   [   ] D. Ignoring messages when a friend needs help

2. When a disagreement occurs between family members, what is the best approach?
   [   ] A. Shout louder than everyone else
   [   ] B. Refuse to speak for several weeks
   [   ] C. Communicate calmly and listen to the other perspective
   [   ] D. Blame others immediately without discussion

3. Which phrase is an expression of genuine appreciation towards a family member?
   [   ] A. "You always make mistakes."
   [   ] B. "Thank you for always supporting me when I need encouragement."
   [   ] C. "Whatever, I don't care."
   [   ] D. "Do this for me right now."

SECTION B: True or False Statements (3 Points)
Write 'TRUE' or 'FALSE' in the bracket. If false, write one sentence explaining why:

[        ] 1. True friends encourage each other to achieve their personal and academic goals.
Explanation: _______________________________________________________________________________

[        ] 2. Sharing household chores with family members creates unnecessary conflict.
Explanation: _______________________________________________________________________________

SECTION C: Hypothetical Scenario & Reflection (3 Points)
If you were organizing a special celebration to surprise a dear friend or family member, what would you do? Explain your plan in 2-3 sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  },

  comprehensive: {
    id: 'comprehensive',
    name: 'Comprehensive Lesson Pack',
    tagline: 'Matching, Cloze, Grammar Forms, & Communicative Tasks',
    description: 'Integrated multi-skill layout featuring vocabulary matching, fill in the blanks, verb form drills, and dialogue analysis.',
    category: 'Integrated Skills',
    iconName: 'layers',
    sections: [
      { code: 'SECTION A', title: 'Match the Words with Their Definitions', description: 'Vocabulary building with definition pairing.' },
      { code: 'SECTION B', title: 'Fill in the Blanks with Words from the Box', description: 'Cloze sentence practice using target lexis.' },
      { code: 'SECTION C', title: 'Put the Words in the Right Form & Tense', description: 'Syntactic practice with grammatical bracketed words.' },
      { code: 'SECTION D', title: 'What Would You Do? Expressive Prompt', description: 'Real-world application and personal response writing.' },
    ],
    suggestedTopics: [
      'Accommodations & Hotel Booking',
      'Celebrations & Cultural Traditions',
      'Pollution & Eco-Friendly Living',
      'Travelling & Vacation Adventures',
      'Entertainments, Gaming & Cinema',
      'Friendships & Social Connections'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Accommodations & Hotel Stays';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Intermediate (B1-B2)').toUpperCase();

      return `Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (COMPREHENSIVE UNIT)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Complete all activities below. Pay attention to spelling, verb agreements, and neat handwriting.

SECTION A: Match the Words with Their Correct Definitions
Match each vocabulary term on the left with its definition on the right. Write the matching letter (A-D) in each bracket.

[   ] 1. Reservation                A. The designated desk where guests register and receive room keys
[   ] 2. Front Desk Reception       B. An advance arrangement to secure a hotel room or rental
[   ] 3. Complimentary Amenity      C. Leaving a hotel after settling the bill and returning keys
[   ] 4. Check-out Procedure        D. A free service provided by the hotel, such as breakfast or Wi-Fi

SECTION B: Fill in the Blanks with Words from the Box
Word Bank: [ reservation | front desk reception | complimentary amenity | check-out procedure ]
Complete each sentence using the appropriate term from the word bank:

1. When we arrived at midnight, the staff at the _______________________ greeted us warmly.
2. The resort offers free airport shuttle rides as a _______________________ for all guests.
3. Please remember that the official _______________________ requires returning room keys by 11:00 AM.
4. I confirmed our double room _______________________ two weeks before our holiday started.

SECTION C: Put the Words in Brackets in the Right Form or Tense
Complete each sentence with the correct grammatical form of the word in parentheses:

1. The hotel staff provided an (exception) _______________________ service throughout our stay.
2. If the room is noisy, the manager (offer) _______________________ to move you to another floor.
3. Guests are (request) _______________________ to keep noise levels down after 10:00 PM.
4. She was highly (satisfy) _______________________ with the cleanliness of the holiday apartment.

SECTION D: What Would You Do?
If you arrived at a hotel and discovered that your room reservation was cancelled by mistake, what would you do? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  },

  reading_comprehension: {
    id: 'reading_comprehension',
    name: 'Reading, Reference & Analysis',
    tagline: 'Text passage, "What does underlined word refer to?", & debate',
    description: 'Designed for reading stamina, identifying pronoun references, text-dependent comprehension, and hypothetical argumentation.',
    category: 'Reading & Literacy',
    iconName: 'file-text',
    sections: [
      { code: 'SECTION A', title: 'Reading Passage', description: 'Curated passage with paragraph markers and target vocabulary.' },
      { code: 'SECTION B', title: 'Reference & Factual Comprehension Questions', description: 'Factual retrieval, inference, and "What does the underlined word refer to?"' },
      { code: 'SECTION C', title: 'What Would You Do? Critical Reflection', description: 'Open-ended reflection encouraging personal opinion and argumentation.' },
    ],
    suggestedTopics: [
      'Pollution & The Future of Oceans',
      'Travelling: Cultural Discovery vs Mass Tourism',
      'Celebrations Around the World',
      'Entertainments & The Rise of Digital Streaming',
      'Family Relationships Across Different Generations',
      'Friendships in the Age of Social Media'
    ],
    sampleGenerator: (topic: string, gradeLevel: string) => {
      const cleanTopic = topic.trim() || 'Pollution & Ocean Conservation';
      const upperTopic = cleanTopic.toUpperCase();
      const upperLevel = (gradeLevel || 'Intermediate (B1-B2)').toUpperCase();

      return `Name: ______________________ Date: ___________ Class: ________ Score: _____ / 20

Worksheet Topic: ${upperTopic} (READING & ANALYSIS)
Proficiency Level: ${upperLevel}

INSTRUCTIONS: 
Read the informational text below. Pay attention to the underlined words, then answer the questions in Sections B and C.

SECTION A: Reading Passage
[Paragraph 1] Every year, millions of tons of plastic waste enter our oceans, threatening marine ecosystems and human health. Scientists warn that if current consumption patterns continue, plastic could outweigh fish in the sea by 2050. Many coastal communities rely on healthy oceans for their livelihood, but <u>they</u> are facing unprecedented economic and environmental disruption.

[Paragraph 2] Fortunately, young innovators around the globe are developing creative technologies to clean polluted waterways. From automated river barriers to biodegradable packaging made from seaweed, <u>these inventions</u> offer tangible hope. However, experts agree that technological solutions alone are insufficient; governments and citizens must collaborate to stop pollution at its source.

SECTION B: Comprehension & Reference Questions
Answer each question in 1-2 complete sentences based on the reading text:

1. According to Paragraph 1, what severe consequence could occur by the year 2050?
   _________________________________________________________________________________________
   _________________________________________________________________________________________

2. Reference Question: What does the underlined word <u>they</u> in Paragraph 1 refer to?
   _________________________________________________________________________________________

3. Reference Question: What does the underlined phrase <u>these inventions</u> in Paragraph 2 refer to?
   _________________________________________________________________________________________

SECTION C: Put the Words in Brackets in the Right Form
Complete each sentence based on ideas from the text:
1. Marine animals face severe (danger) _______________________ from microplastic debris.
2. Governments must act (quick) _______________________ to ban single-use plastic bags.

SECTION D: What Would You Do?
If you were invited to give a 2-minute speech to your school about reducing plastic pollution, what two main actions would you ask students to do? Write 2-3 complete sentences:
____________________________________________________________________________________________
____________________________________________________________________________________________
____________________________________________________________________________________________

--- End of Worksheet ---`;
    }
  }
};
