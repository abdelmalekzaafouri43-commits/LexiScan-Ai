export interface WorksheetThemeItem {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  badgeColor: string;
  description: string;
  keyVocabulary: string[];
  suggestedGrammar: string;
  sampleReadingSnippet: string;
  suggestedPrompt: string;
}

export interface ThemeCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  themes: WorksheetThemeItem[];
}

export const THEME_CATEGORIES: ThemeCategory[] = [
  {
    id: 'environment',
    name: 'Pollution & Environment',
    iconName: 'leaf',
    color: 'emerald',
    themes: [
      {
        id: 'env_pollution_waste',
        name: 'Air & Water Pollution',
        category: 'Pollution & Environment',
        categoryIcon: 'leaf',
        badgeColor: 'emerald',
        description: 'Industrial emissions, plastic waste in oceans, toxic runoff, and urban smog.',
        keyVocabulary: ['emissions', 'toxic waste', 'smog', 'contamination', 'pollutant', 'microplastics', 'ecosystem', 'biodiversity'],
        suggestedGrammar: 'Passive Voice (e.g., "Oceans are polluted by...", "Taxes should be imposed on...") & Cause/Effect connectors',
        sampleReadingSnippet: 'Every year, millions of tons of single-use plastic enter river networks and oceans, harming marine life and disrupting delicate coastal ecosystems.',
        suggestedPrompt: 'Create an engaging intermediate English worksheet focusing on industrial smog, plastic waste in waterways, and solutions for clean air.'
      },
      {
        id: 'env_recycling_green',
        name: 'Recycling & Eco-Friendly Habits',
        category: 'Pollution & Environment',
        categoryIcon: 'leaf',
        badgeColor: 'emerald',
        description: 'Zero-waste lifestyle, composting, renewable energy, and community recycling programs.',
        keyVocabulary: ['biodegradable', 'compost', 'renewable energy', 'carbon footprint', 'conservation', 'sustainability', 'reusable', 'solar power'],
        suggestedGrammar: 'Modal verbs of obligation (must, should, ought to, have to) for eco-habits',
        sampleReadingSnippet: 'Adopting sustainable household habits, such as separating organic compost and utilizing solar energy, drastically reduces our individual carbon footprint.',
        suggestedPrompt: 'Generate a worksheet about household recycling, zero-waste shopping, and practical steps students can take to protect nature.'
      },
      {
        id: 'env_climate_change',
        name: 'Climate Change & Global Warming',
        category: 'Pollution & Environment',
        categoryIcon: 'leaf',
        badgeColor: 'emerald',
        description: 'Rising temperatures, extreme weather events, deforestation, and polar ice melting.',
        keyVocabulary: ['greenhouse effect', 'deforestation', 'drought', 'rising sea levels', 'glacier', 'fossil fuels', 'catastrophe', 'adaptation'],
        suggestedGrammar: 'First and Second Conditionals (e.g., "If temperatures rise by 2°C, coastal cities will face flooding...")',
        sampleReadingSnippet: 'Scientists emphasize that if greenhouse gas emissions are not reduced immediately, global temperature anomalies will trigger frequent severe droughts and floods.',
        suggestedPrompt: 'Generate a reading comprehension and debate worksheet discussing global warming causes, impacts on agriculture, and clean energy solutions.'
      }
    ]
  },
  {
    id: 'accommodations',
    name: 'Accommodations & Hotels',
    iconName: 'hotel',
    color: 'amber',
    themes: [
      {
        id: 'acc_hotel_booking',
        name: 'Hotel Booking & Check-in',
        category: 'Accommodations & Hotels',
        categoryIcon: 'hotel',
        badgeColor: 'amber',
        description: 'Front desk vocabulary, reserving rooms, room types, amenities, and hotel check-in/out dialogues.',
        keyVocabulary: ['reservation', 'front desk', 'complimentary breakfast', 'key card', 'suite', 'check-in / check-out', 'room service', 'amenities'],
        suggestedGrammar: 'Polite requests & inquiries (e.g., "Could you please confirm...", "Would it be possible to request a late check-out?")',
        sampleReadingSnippet: 'Upon arriving at the Grand Continental Hotel, Mr. Davis presented his booking confirmation at the front desk and requested a quiet room overlooking the garden courtyard.',
        suggestedPrompt: 'Design a practical situational English worksheet covering hotel booking, asking about complimentary amenities, and resolving room complaints.'
      },
      {
        id: 'acc_hostels_rentals',
        name: 'Vacation Rentals & Hostels',
        category: 'Accommodations & Hotels',
        categoryIcon: 'hotel',
        badgeColor: 'amber',
        description: 'Backpacker youth hostels, Airbnb apartments, homestays, bunk beds, and shared facilities.',
        keyVocabulary: ['dormitory', 'bunk bed', 'communal kitchen', 'host family', 'vacation rental', 'deposit', 'lockers', 'house rules'],
        suggestedGrammar: 'Prepositions of place & direction in accommodations',
        sampleReadingSnippet: 'Staying in a youth hostel offers budget travelers a communal kitchen, secure storage lockers, and a vibrant common room to exchange travel tips with fellow explorers.',
        suggestedPrompt: 'Create an interactive vocabulary matching and dialogue worksheet about staying at youth hostels, homestays, and holiday apartments.'
      },
      {
        id: 'acc_resorts_camping',
        name: 'Resorts & Eco-Lodges',
        category: 'Accommodations & Hotels',
        categoryIcon: 'hotel',
        badgeColor: 'amber',
        description: 'All-inclusive resorts, spa retreats, glamping, mountain lodges, and nature campgrounds.',
        keyVocabulary: ['all-inclusive', 'spa retreat', 'concierge', 'glamping', 'shuttle service', 'panoramic view', 'housekeeping', 'hospitality'],
        suggestedGrammar: 'Comparatives and Superlatives (e.g., "The eco-lodge is more peaceful than the crowded city hotel")',
        sampleReadingSnippet: 'Eco-lodges combine sustainable solar-powered cabins with authentic hospitality, allowing guests to enjoy panoramic nature views with minimal ecological impact.',
        suggestedPrompt: 'Generate a reading and vocabulary worksheet comparing luxury beach resorts with rustic nature campsites.'
      }
    ]
  },
  {
    id: 'celebrations',
    name: 'Celebrations & Festivals',
    iconName: 'sparkles',
    color: 'purple',
    themes: [
      {
        id: 'cel_holidays_traditions',
        name: 'Holidays & Cultural Traditions',
        category: 'Celebrations & Festivals',
        categoryIcon: 'sparkles',
        badgeColor: 'purple',
        description: 'National celebrations, thanksgiving, cultural customs, heritage carnivals, and sacred days.',
        keyVocabulary: ['tradition', 'festivity', 'gathering', 'heritage', 'costume', 'commemorate', 'parade', 'symbolism'],
        suggestedGrammar: 'Past Simple vs. Present Simple for discussing historical origins and annual recurring traditions',
        sampleReadingSnippet: 'Across different continents, families gather each autumn to share traditional feasts, expressing gratitude for the harvest and honoring ancestral customs.',
        suggestedPrompt: 'Create a cultural English worksheet discussing world harvest festivals, traditional costumes, and festive customs.'
      },
      {
        id: 'cel_birthdays_parties',
        name: 'Birthdays & Milestone Events',
        category: 'Celebrations & Festivals',
        categoryIcon: 'purple',
        badgeColor: 'purple',
        description: 'Birthday celebrations, surprise parties, invitations, gift giving, and anniversary toasts.',
        keyVocabulary: ['invitation', 'milestone', 'surprise party', 'gift-giving', 'toast', 'celebrant', 'decorations', 'wishes'],
        suggestedGrammar: 'Future Tenses (Going to vs. Will) for event planning and invitation writing',
        sampleReadingSnippet: 'To celebrate Lucas’s graduation milestone, his classmates coordinated a surprise gathering decorated with colorful balloons, hand-written cards, and a custom cake.',
        suggestedPrompt: 'Design a fun English worksheet on planning surprise birthday parties, writing invitations, and sending congratulations messages.'
      },
      {
        id: 'cel_new_year_carnivals',
        name: 'New Year & Street Carnivals',
        category: 'Celebrations & Festivals',
        categoryIcon: 'sparkles',
        badgeColor: 'purple',
        description: 'Midnight countdowns, New Year resolutions, spectacular fireworks, street dancers, and music parades.',
        keyVocabulary: ['countdown', 'resolutions', 'fireworks display', 'spectacle', 'cheering', 'confetti', 'lanterns', 'renewal'],
        suggestedGrammar: 'Expressions of future intention and hope (e.g., "I intend to...", "I resolve to...", "Looking forward to...")',
        sampleReadingSnippet: 'As the giant clock struck midnight, vibrant fireworks illuminated the harbor skyline while thousands of spectators cheered, welcomed the new year, and made heartfelt resolutions.',
        suggestedPrompt: 'Create a motivating worksheet about New Year resolutions, street parades, and midnight festivities around the world.'
      }
    ]
  },
  {
    id: 'travelling',
    name: 'Travelling & Tourism',
    iconName: 'plane',
    color: 'blue',
    themes: [
      {
        id: 'trav_airport_flights',
        name: 'Airports & Flight Transit',
        category: 'Travelling & Tourism',
        categoryIcon: 'plane',
        badgeColor: 'blue',
        description: 'Boarding passes, security checks, baggage drop, duty-free, gates, customs, and flight delays.',
        keyVocabulary: ['boarding pass', 'security screening', 'customs declaration', 'carry-on luggage', 'departure lounge', 'layover', 'flight attendant', 'terminal'],
        suggestedGrammar: 'Airport announcement listening phrases & Passive sentences (e.g., "Passengers are requested to proceed to Gate 14")',
        sampleReadingSnippet: 'After passing through the security screening, travelers should confirm their departure gate on the digital monitors before boarding the aircraft.',
        suggestedPrompt: 'Generate a practical situational English worksheet covering airport check-in counters, security rules, and flight announcements.'
      },
      {
        id: 'trav_sightseeing_tours',
        name: 'City Sightseeing & Guided Tours',
        category: 'Travelling & Tourism',
        categoryIcon: 'plane',
        badgeColor: 'blue',
        description: 'Famous landmarks, historical monuments, tour guides, itineraries, audio guides, and travel photography.',
        keyVocabulary: ['monument', 'landmark', 'guided tour', 'itinerary', 'audio guide', 'souvenir', 'breathtaking view', 'heritage site'],
        suggestedGrammar: 'Giving directions (e.g., "Turn left at the cathedral, walk straight for 200 meters...") & Asking for local recommendations',
        sampleReadingSnippet: 'The historic walking tour took the group through ancient cobblestone alleys, stopping at Gothic cathedrals and bustling open-air craft markets.',
        suggestedPrompt: 'Create an engaging worksheet about city exploration, following travel itineraries, and asking for directions.'
      },
      {
        id: 'trav_backpacking_adventure',
        name: 'Backpacking & Solo Adventures',
        category: 'Travelling & Tourism',
        categoryIcon: 'plane',
        badgeColor: 'blue',
        description: 'Budget exploration, train passes, hiking trails, meeting locals, phrasebooks, and unexpected detours.',
        keyVocabulary: ['backpacking', 'scenic route', 'hiking trail', 'budget travel', 'phrasebook', 'spontaneous', 'cross-country', 'currency exchange'],
        suggestedGrammar: 'Narrative tenses (Past Continuous & Past Simple: "While I was hiking through the valley, I met a local farmer who...")',
        sampleReadingSnippet: 'Equipped with only a lightweight backpack and a train pass, Elena spent three weeks discovering remote mountain villages and connecting with hospitable locals.',
        suggestedPrompt: 'Design a storytelling and vocabulary worksheet about backpacking adventures, train journeys, and cross-cultural encounters.'
      }
    ]
  },
  {
    id: 'entertainments',
    name: 'Entertainments & Leisure',
    iconName: 'tv',
    color: 'rose',
    themes: [
      {
        id: 'ent_cinema_movies',
        name: 'Cinema & Movie Genres',
        category: 'Entertainments & Leisure',
        categoryIcon: 'tv',
        badgeColor: 'rose',
        description: 'Film genres, plot twists, soundtrack, director, cinematography, movie critiques, and box office hits.',
        keyVocabulary: ['blockbuster', 'cinematography', 'plot twist', 'soundtrack', 'protagonist', 'antagonist', 'genre', 'film review'],
        suggestedGrammar: 'Expressing opinions and preferences (e.g., "I found the ending rather predictable, whereas the visual effects were stellar")',
        sampleReadingSnippet: 'The gripping sci-fi blockbuster kept viewers on the edge of their seats thanks to its breathtaking cinematography and unexpected plot twists.',
        suggestedPrompt: 'Generate a worksheet about movie genres, writing short film reviews, and discussing favorite actors and directors.'
      },
      {
        id: 'ent_concerts_music',
        name: 'Concerts & Live Music',
        category: 'Entertainments & Leisure',
        categoryIcon: 'tv',
        badgeColor: 'rose',
        description: 'Live bands, music festivals, acoustic performances, stage lighting, encores, and musical instruments.',
        keyVocabulary: ['live performance', 'headliner', 'acoustic', 'encore', 'stadium concert', 'lyrics', 'rhythm', 'ticket venue'],
        suggestedGrammar: 'Present Perfect vs. Past Simple (e.g., "Have you ever attended a live festival?")',
        sampleReadingSnippet: 'Over fifty thousand music enthusiasts filled the outdoor arena, singing along to the headline band as dazzling lights synchronized with every drumbeat.',
        suggestedPrompt: 'Create an English worksheet covering musical instruments, attending live concerts, and describing songs.'
      },
      {
        id: 'ent_gaming_digital',
        name: 'Video Games & Esports',
        category: 'Entertainments & Leisure',
        categoryIcon: 'tv',
        badgeColor: 'rose',
        description: 'Multiplayer games, virtual reality, game mechanics, esports tournaments, streaming, and teamwork in gaming.',
        keyVocabulary: ['esports tournament', 'multiplayer', 'virtual reality', 'strategy', 'game mechanics', 'leaderboard', 'gameplay', 'streaming'],
        suggestedGrammar: 'Zero and First Conditionals for rules and strategy ("If you press the trigger button, the character dashes forward")',
        sampleReadingSnippet: 'Competitive esports tournaments attract millions of global viewers who tune in to watch professional gamers coordinate complex strategies under intense time pressure.',
        suggestedPrompt: 'Design a modern worksheet about video game genres, esports competitions, and digital leisure activities.'
      }
    ]
  },
  {
    id: 'family',
    name: 'Family Relationships',
    iconName: 'users',
    color: 'cyan',
    themes: [
      {
        id: 'fam_generations_bonds',
        name: 'Family Dynamics & Generations',
        category: 'Family Relationships',
        categoryIcon: 'users',
        badgeColor: 'cyan',
        description: 'Extended family, grandparents, upbringing, family trees, generational differences, and mutual support.',
        keyVocabulary: ['ancestors', 'upbringing', 'extended family', 'generation gap', 'nurture', 'kinship', 'values', 'guardian'],
        suggestedGrammar: 'Used to / Would for childhood memories ("My grandmother used to tell us traditional bedtime stories every evening")',
        sampleReadingSnippet: 'Multi-generational households foster strong emotional bonds, allowing children to learn timeless cultural values and ancestral wisdom directly from their grandparents.',
        suggestedPrompt: 'Create a heartfelt worksheet exploring family trees, childhood memories with grandparents, and generational similarities.'
      },
      {
        id: 'fam_siblings_household',
        name: 'Sibling Bonds & Household Life',
        category: 'Family Relationships',
        categoryIcon: 'users',
        badgeColor: 'cyan',
        description: 'Brothers and sisters, sharing responsibilities, resolving small conflicts, household chores, and family meals.',
        keyVocabulary: ['sibling rivalry', 'cooperation', 'chores', 'compromise', 'affection', 'household duties', 'empathy', 'supportive'],
        suggestedGrammar: 'Phrasal verbs related to family (e.g., take after, grow up, bring up, look up to, get along with)',
        sampleReadingSnippet: 'While siblings may occasionally experience petty disagreements over household chores, they learn vital life skills in compromise, empathy, and lifelong loyalty.',
        suggestedPrompt: 'Generate a worksheet on family phrasal verbs (get along with, take after), dividing household chores, and sibling relationships.'
      },
      {
        id: 'fam_traditions_reunions',
        name: 'Family Reunions & Traditions',
        category: 'Family Relationships',
        categoryIcon: 'users',
        badgeColor: 'cyan',
        description: 'Annual family gatherings, photo albums, storytelling around the dinner table, and heirloom recipes.',
        keyVocabulary: ['reunion', 'heirloom', 'fond memories', 'cherished', 'anniversary', 'nostalgia', 'celebrate', 'unconditional love'],
        suggestedGrammar: 'Adjectives of personality and character traits (e.g., patient, compassionate, generous, strict, open-minded)',
        sampleReadingSnippet: 'Every summer, relatives from across the country travel back to their hometown for a weekend family reunion filled with home-cooked heirloom recipes and nostalgic stories.',
        suggestedPrompt: 'Design a descriptive writing and vocabulary worksheet about describing family members, reunions, and family traditions.'
      }
    ]
  },
  {
    id: 'friendships',
    name: 'Friendships & Social Life',
    iconName: 'heart',
    color: 'teal',
    themes: [
      {
        id: 'fri_true_friends_trust',
        name: 'Qualities of a True Friend',
        category: 'Friendships & Social Life',
        categoryIcon: 'heart',
        badgeColor: 'teal',
        description: 'Trust, honesty, standing by someone in tough times, sharing secrets, active listening, and mutual respect.',
        keyVocabulary: ['trustworthy', 'loyalty', 'confidant', 'dependable', 'empathy', 'mutual respect', 'sincerity', 'camaraderie'],
        suggestedGrammar: 'Relative clauses (e.g., "A true friend is someone who stands by you...", "A confidant is a person to whom you can tell anything")',
        sampleReadingSnippet: 'True friendship is built on unwavering trust and mutual empathy, providing a safe harbor where individuals can express their authentic thoughts without fear of judgment.',
        suggestedPrompt: 'Create a reflective English worksheet on defining a good friend, exploring personality traits, and practicing relative clauses.'
      },
      {
        id: 'fri_meeting_socializing',
        name: 'Meeting People & Socializing',
        category: 'Friendships & Social Life',
        categoryIcon: 'heart',
        badgeColor: 'teal',
        description: 'Making new friends at school or clubs, small talk, breaking the ice, shared hobbies, and body language.',
        keyVocabulary: ['break the ice', 'acquaintance', 'small talk', 'common ground', 'outgoing', 'approachable', 'social circle', 'bonding'],
        suggestedGrammar: 'Question tags and conversational softeners (e.g., "You love playing tennis, don\'t you?", "By the way...")',
        sampleReadingSnippet: 'Finding common ground—such as a shared passion for drawing or basketball—is the easiest way to break the ice and turn a casual acquaintance into a close friend.',
        suggestedPrompt: 'Generate a conversational English worksheet focusing on breaking the ice, small talk questions, and meeting classmates.'
      },
      {
        id: 'fri_teamwork_resolving',
        name: 'Teamwork & Resolving Conflicts',
        category: 'Friendships & Social Life',
        categoryIcon: 'heart',
        badgeColor: 'teal',
        description: 'Collaborating in group projects, apologizing sincerely, active listening, and resolving misunderstandings.',
        keyVocabulary: ['collaboration', 'misunderstanding', 'apologize', 'forgiveness', 'reconcile', 'open communication', 'compromise', 'constructive'],
        suggestedGrammar: 'Second and Third Conditionals for resolving misunderstandings ("If I had known earlier, I would have apologized right away")',
        sampleReadingSnippet: 'Whenever misunderstandings arise between close friends, calm dialogue and honest apologies pave the way toward swift reconciliation and stronger mutual bonds.',
        suggestedPrompt: 'Create an English worksheet with roleplay scenarios for resolving friend arguments, apologizing politely, and working in teams.'
      }
    ]
  }
];

export const ALL_WORKSHEET_THEMES = THEME_CATEGORIES.flatMap(cat => cat.themes);

export function getThemeById(id: string): WorksheetThemeItem | undefined {
  return ALL_WORKSHEET_THEMES.find(t => t.id === id);
}

export function findThemeByName(name: string): WorksheetThemeItem | undefined {
  const normalized = name.toLowerCase().trim();
  return ALL_WORKSHEET_THEMES.find(t => 
    t.name.toLowerCase().includes(normalized) || 
    normalized.includes(t.name.toLowerCase()) ||
    t.category.toLowerCase().includes(normalized)
  );
}
