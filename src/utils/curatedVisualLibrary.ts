import { VisualLibraryItem, WorksheetVisual } from '../types/worksheetVisuals';

/**
 * Handcrafted, clean, infinitely scalable educational SVGs.
 * Designed with high contrast lines and optional pastel accents,
 * optimal for black-and-white school photocopying as well as digital/color print.
 */
export const CURATED_VISUAL_LIBRARY: VisualLibraryItem[] = [
  // 1. Food & Culinary
  {
    id: 'food_healthy_ingredients',
    title: 'Fresh Fruits & Vegetables',
    category: 'Food & Nutrition',
    tags: ['food', 'nutrition', 'kitchen', 'cooking', 'healthy', 'fruit', 'vegetables', 'diet', 'meal', 'restaurant'],
    defaultCaption: 'Figure 1: Target Vocabulary — Fresh ingredients and healthy meal planning',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <!-- Table surface -->
      <line x1="20" y1="200" x2="380" y2="200" stroke-width="3" />
      <!-- Big Bowl -->
      <path d="M120 120 C120 190, 280 190, 280 120 Z" fill="#ffffff" />
      <ellipse cx="200" cy="120" rx="80" ry="16" />
      <!-- Apple inside bowl -->
      <path d="M180 112 C170 95, 190 80, 200 92 C210 80, 230 95, 220 112 C215 125, 185 125, 180 112 Z" />
      <path d="M200 92 C200 80, 206 72, 210 70" />
      <path d="M202 78 C212 75, 218 82, 218 82" />
      <!-- Carrot to the left -->
      <path d="M60 170 L115 195 C118 196, 120 192, 116 190 L95 145 C92 140, 65 160, 60 170 Z" />
      <path d="M60 162 C48 155, 42 148, 38 145" />
      <path d="M63 165 C55 158, 48 155, 44 158" />
      <line x1="80" y1="168" x2="90" y2="172" />
      <line x1="88" y1="158" x2="100" y2="164" />
      <!-- Water Glass to the right -->
      <path d="M300 130 L310 198 C310 200, 340 200, 340 198 L350 130 Z" />
      <ellipse cx="325" cy="130" rx="25" ry="8" />
      <path d="M305 155 Q325 160 345 155" stroke-dasharray="4 3" />
      <!-- Cut lemon slice -->
      <circle cx="100" cy="180" r="18" />
      <circle cx="100" cy="180" r="13" stroke-dasharray="2 3" />
      <line x1="100" y1="167" x2="100" y2="193" />
      <line x1="87" y1="180" x2="113" y2="180" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="30" y1="195" x2="370" y2="195" stroke="#94a3b8" stroke-width="3" />
      <!-- Big Bowl with emerald accent fill -->
      <path d="M120 120 C120 190, 280 190, 280 120 Z" fill="#ecfdf5" stroke="#059669" />
      <ellipse cx="200" cy="120" rx="80" ry="16" fill="#d1fae5" stroke="#059669" />
      <!-- Apple with soft red accent -->
      <path d="M180 112 C170 95, 190 80, 200 92 C210 80, 230 95, 220 112 C215 125, 185 125, 180 112 Z" fill="#fee2e2" stroke="#dc2626" />
      <path d="M200 92 C200 80, 206 72, 210 70" stroke="#1e293b" />
      <path d="M202 78 C212 75, 218 82, 218 82" fill="#86efac" stroke="#16a34a" />
      <!-- Carrot with amber accent -->
      <path d="M60 170 L115 195 C118 196, 120 192, 116 190 L95 145 C92 140, 65 160, 60 170 Z" fill="#ffedd5" stroke="#ea580c" />
      <path d="M60 162 C48 155, 42 148, 38 145" stroke="#16a34a" />
      <!-- Water Glass with sky blue accent -->
      <path d="M300 130 L310 198 C310 200, 340 200, 340 198 L350 130 Z" fill="#f0f9ff" stroke="#0284c7" />
      <ellipse cx="325" cy="130" rx="25" ry="8" fill="#e0f2fe" stroke="#0284c7" />
      <circle cx="100" cy="180" r="18" fill="#fef08a" stroke="#ca8a04" />
    </svg>`,
  },

  // 2. Travel & Transportation
  {
    id: 'travel_airport_essentials',
    title: 'Travel, Airport & Packing',
    category: 'Travel & Transport',
    tags: ['travel', 'airport', 'transportation', 'vacation', 'luggage', 'flight', 'ticket', 'tourism', 'city', 'hotel'],
    defaultCaption: 'Figure 1: Target Vocabulary — Travel essentials, transit, and boarding preparation',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <!-- Ground line -->
      <line x1="20" y1="210" x2="380" y2="210" stroke-width="3" />
      <!-- Suitcase -->
      <rect x="70" y="100" width="90" height="100" rx="10" />
      <!-- Handle -->
      <path d="M100 100 V65 H130 V100" stroke-width="2" />
      <line x1="115" y1="65" x2="115" y2="100" />
      <!-- Suitcase bands -->
      <line x1="70" y1="135" x2="160" y2="135" stroke-dasharray="3 3" />
      <line x1="70" y1="165" x2="160" y2="165" stroke-dasharray="3 3" />
      <!-- Wheels -->
      <circle cx="85" cy="205" r="5" />
      <circle cx="145" cy="205" r="5" />
      <!-- Passport & Boarding Pass -->
      <rect x="185" y="115" width="75" height="95" rx="5" transform="rotate(-8 185 115)" />
      <circle cx="218" cy="155" r="14" />
      <line x1="200" y1="185" x2="236" y2="180" />
      <!-- Airplane in sky -->
      <path d="M260 70 L340 50 L350 58 L325 75 L350 82 L345 88 L315 82 L290 100 L275 96 L295 82 L260 70 Z" />
      <!-- Flight vapour line -->
      <path d="M210 82 Q235 78 255 72" stroke-dasharray="4 4" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="30" y1="205" x2="370" y2="205" stroke="#94a3b8" stroke-width="3" />
      <!-- Suitcase with warm amber accent -->
      <rect x="70" y="100" width="90" height="100" rx="10" fill="#fef3c7" stroke="#d97706" />
      <path d="M100 100 V65 H130 V100" stroke="#78350f" stroke-width="2" />
      <line x1="70" y1="135" x2="160" y2="135" stroke="#d97706" stroke-dasharray="3 3" />
      <!-- Passport with indigo blue accent -->
      <rect x="185" y="115" width="75" height="95" rx="5" transform="rotate(-8 185 115)" fill="#e0e7ff" stroke="#4338ca" />
      <circle cx="218" cy="155" r="14" stroke="#4338ca" fill="#c7d2fe" />
      <!-- Airplane in flight with sky blue -->
      <path d="M260 70 L340 50 L350 58 L325 75 L350 82 L345 88 L315 82 L290 100 L275 96 L295 82 L260 70 Z" fill="#e0f2fe" stroke="#0284c7" />
      <path d="M210 82 Q235 78 255 72" stroke="#0284c7" stroke-dasharray="4 4" />
    </svg>`,
  },

  // 3. School, Education & Study
  {
    id: 'school_study_desk',
    title: 'School, Books & Study Desk',
    category: 'School & Study',
    tags: ['school', 'study', 'education', 'reading', 'books', 'classroom', 'student', 'exam', 'homework', 'learning', 'grammar'],
    defaultCaption: 'Figure 1: Target Vocabulary — Classroom study tools and reading materials',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <!-- Desk line -->
      <line x1="20" y1="200" x2="380" y2="200" stroke-width="3" />
      <!-- Open Book in center -->
      <path d="M130 180 C165 170, 195 175, 200 185 C205 175, 235 170, 270 180 L270 125 C235 115, 205 120, 200 130 C195 120, 165 115, 130 125 Z" />
      <line x1="200" y1="130" x2="200" y2="185" />
      <!-- Text lines in book -->
      <line x1="145" y1="138" x2="185" y2="135" stroke-width="1.5" />
      <line x1="145" y1="150" x2="185" y2="147" stroke-width="1.5" />
      <line x1="145" y1="162" x2="175" y2="159" stroke-width="1.5" />
      <line x1="215" y1="135" x2="255" y2="138" stroke-width="1.5" />
      <line x1="215" y1="147" x2="255" y2="150" stroke-width="1.5" />
      <line x1="215" y1="159" x2="245" y2="162" stroke-width="1.5" />
      <!-- Stack of closed books on left -->
      <rect x="40" y="170" width="70" height="25" rx="3" />
      <rect x="45" y="145" width="65" height="25" rx="3" />
      <rect x="42" y="125" width="60" height="20" rx="3" />
      <!-- Pencil Holder on right -->
      <rect x="295" y="130" width="45" height="65" rx="4" />
      <line x1="305" y1="130" x2="295" y2="95" stroke-width="2.5" />
      <line x1="318" y1="130" x2="318" y2="90" stroke-width="2.5" />
      <line x1="330" y1="130" x2="340" y2="100" stroke-width="2.5" />
      <!-- Apple on book stack -->
      <circle cx="70" cy="112" r="12" />
      <path d="M70 100 Q74 92 78 90" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="30" y1="195" x2="370" y2="195" stroke="#94a3b8" stroke-width="3" />
      <!-- Open Book with soft amber pages -->
      <path d="M130 180 C165 170, 195 175, 200 185 C205 175, 235 170, 270 180 L270 125 C235 115, 205 120, 200 130 C195 120, 165 115, 130 125 Z" fill="#fffbeb" stroke="#b45309" />
      <line x1="200" y1="130" x2="200" y2="185" stroke="#b45309" />
      <!-- Book stack with blue, emerald, purple fills -->
      <rect x="40" y="170" width="70" height="25" rx="3" fill="#dbeafe" stroke="#1d4ed8" />
      <rect x="45" y="145" width="65" height="25" rx="3" fill="#dcfce7" stroke="#15803d" />
      <rect x="42" y="125" width="60" height="20" rx="3" fill="#f3e8ff" stroke="#7e22ce" />
      <!-- Pencil Cup -->
      <rect x="295" y="130" width="45" height="65" rx="4" fill="#e0f2fe" stroke="#0284c7" />
      <circle cx="70" cy="112" r="12" fill="#fee2e2" stroke="#dc2626" />
    </svg>`,
  },

  // 4. Nature, Animals & Environment
  {
    id: 'nature_animals_outdoors',
    title: 'Nature, Wildlife & Outdoor Scenery',
    category: 'Nature & Animals',
    tags: ['nature', 'animals', 'wildlife', 'environment', 'forest', 'trees', 'outdoors', 'weather', 'earth', 'landscape'],
    defaultCaption: 'Figure 1: Target Vocabulary — Natural landscapes, habitat, and flora/fauna',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <!-- Mountain background -->
      <path d="M40 180 L120 70 L200 180" />
      <path d="M105 91 L120 100 L135 91" />
      <path d="M160 180 L230 90 L300 180" />
      <path d="M215 109 L230 118 L245 109" />
      <!-- Sun -->
      <circle cx="330" cy="65" r="22" />
      <line x1="330" y1="35" x2="330" y2="25" />
      <line x1="330" y1="95" x2="330" y2="105" />
      <line x1="300" y1="65" x2="290" y2="65" />
      <line x1="360" y1="65" x2="370" y2="65" />
      <!-- Rolling hills ground -->
      <path d="M10 200 Q100 170 200 195 T390 185" stroke-width="3" />
      <!-- Pine tree on left -->
      <path d="M60 195 L60 150 M45 165 L60 140 L75 165 M48 150 L60 130 L72 150 M52 135 L60 120 L68 135" />
      <!-- Friendly Bird flying -->
      <path d="M250 50 Q260 42 270 50 Q280 42 290 50" />
      <!-- Flower on ground -->
      <path d="M320 200 Q325 185 330 175" />
      <circle cx="330" cy="172" r="5" />
      <circle cx="330" cy="165" r="3" />
      <circle cx="337" cy="172" r="3" />
      <circle cx="330" cy="179" r="3" />
      <circle cx="323" cy="172" r="3" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f0fdf4" stroke="#dcfce7" stroke-width="1.5" />
      <!-- Sun with yellow fill -->
      <circle cx="330" cy="65" r="22" fill="#fef08a" stroke="#ca8a04" />
      <!-- Mountain with cool slate fill -->
      <path d="M40 180 L120 70 L200 180 Z" fill="#e2e8f0" stroke="#475569" />
      <path d="M120 70 L105 91 L120 100 L135 91 Z" fill="#ffffff" stroke="#475569" />
      <path d="M160 180 L230 90 L300 180 Z" fill="#cbd5e1" stroke="#475569" />
      <!-- Green rolling hill -->
      <path d="M0 200 Q100 170 200 195 T400 185 L400 240 L0 240 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="2" />
      <!-- Pine tree -->
      <path d="M45 165 L60 140 L75 165 Z" fill="#22c55e" stroke="#15803d" />
      <path d="M48 150 L60 130 L72 150 Z" fill="#16a34a" stroke="#15803d" />
      <path d="M52 135 L60 120 L68 135 Z" fill="#15803d" stroke="#14532d" />
    </svg>`,
  },

  // 5. Science, Technology & Innovation
  {
    id: 'science_lab_technology',
    title: 'Science, Laboratory & Innovation',
    category: 'Science & Tech',
    tags: ['science', 'technology', 'laboratory', 'experiment', 'digital', 'computer', 'idea', 'innovation', 'robot', 'research'],
    defaultCaption: 'Figure 1: Target Vocabulary — Laboratory tools, scientific inquiry, and technology',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="205" x2="380" y2="205" stroke-width="3" />
      <!-- Microscope -->
      <rect x="70" y="190" width="70" height="15" rx="3" />
      <path d="M120 190 C120 120 90 110 80 140" />
      <line x1="85" y1="150" x2="115" y2="150" />
      <rect x="70" y="85" width="22" height="60" rx="3" transform="rotate(25 70 85)" />
      <rect x="85" y="70" width="12" height="20" rx="2" transform="rotate(25 85 70)" />
      <!-- Beaker / Flask with liquid -->
      <path d="M195 90 H215 V125 L245 190 C250 200 240 205 230 205 H180 C170 205 160 200 165 190 L195 125 Z" />
      <path d="M178 165 Q205 170 232 165" stroke-dasharray="3 3" />
      <circle cx="195" cy="180" r="3" />
      <circle cx="215" cy="175" r="4" />
      <circle cx="205" cy="190" r="2.5" />
      <!-- Lightbulb Idea on Right -->
      <path d="M295 110 C275 110 265 95 265 80 C265 60 280 45 305 45 C330 45 345 60 345 80 C345 95 335 110 315 110 V125 H295 Z" />
      <line x1="295" y1="133" x2="315" y2="133" />
      <line x1="300" y1="140" x2="310" y2="140" />
      <!-- Rays -->
      <line x1="305" y1="30" x2="305" y2="20" />
      <line x1="260" y1="50" x2="250" y2="42" />
      <line x1="350" y1="50" x2="360" y2="42" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="30" y1="205" x2="370" y2="205" stroke="#94a3b8" stroke-width="3" />
      <!-- Flask with glowing cyan liquid -->
      <path d="M195 90 H215 V125 L245 190 C250 200 240 205 230 205 H180 C170 205 160 200 165 190 L195 125 Z" fill="#e0f2fe" stroke="#0284c7" />
      <path d="M178 165 L165 190 C160 200 170 205 180 205 H230 C240 205 250 200 245 190 L232 165 Z" fill="#38bdf8" fill-opacity="0.3" stroke="#0284c7" />
      <!-- Microscope with indigo accents -->
      <rect x="70" y="190" width="70" height="15" rx="3" fill="#cbd5e1" stroke="#475569" />
      <path d="M120 190 C120 120 90 110 80 140" stroke="#475569" stroke-width="4" />
      <rect x="70" y="85" width="22" height="60" rx="3" transform="rotate(25 70 85)" fill="#e0e7ff" stroke="#4338ca" />
      <!-- Lightbulb with golden yellow glow -->
      <path d="M295 110 C275 110 265 95 265 80 C265 60 280 45 305 45 C330 45 345 60 345 80 C345 95 335 110 315 110 V125 H295 Z" fill="#fef08a" stroke="#ca8a04" />
    </svg>`,
  },

  // 6. Daily Routine, Home & Time
  {
    id: 'daily_routine_clock_home',
    title: 'Daily Routine, Habits & Home',
    category: 'Daily Life',
    tags: ['daily', 'routine', 'clock', 'time', 'home', 'house', 'morning', 'habits', 'schedule', 'chores', 'family'],
    defaultCaption: 'Figure 1: Target Vocabulary — Daily schedules, morning habits, and home activities',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="210" x2="380" y2="210" stroke-width="3" />
      <!-- Alarm Clock -->
      <circle cx="110" cy="140" r="45" />
      <path d="M85 85 L100 98" stroke-width="3" />
      <path d="M135 85 L120 98" stroke-width="3" />
      <!-- Clock legs -->
      <line x1="85" y1="178" x2="75" y2="195" stroke-width="3" />
      <line x1="135" y1="178" x2="145" y2="195" stroke-width="3" />
      <!-- Clock hands at 7:15 -->
      <line x1="110" y1="140" x2="110" y2="112" stroke-width="3" />
      <line x1="110" y1="140" x2="132" y2="140" stroke-width="2.5" />
      <circle cx="110" cy="140" r="3" fill="#1e293b" />
      <!-- Cozy House on right -->
      <polygon points="260,70 330,120 190,120" />
      <rect x="205" y="120" width="110" height="85" />
      <rect x="245" y="145" width="30" height="60" />
      <circle cx="270" cy="175" r="2.5" fill="#1e293b" />
      <rect x="215" y="135" width="22" height="25" />
      <rect x="283" y="135" width="22" height="25" />
      <!-- Chimney with smoke -->
      <rect x="290" y="75" width="16" height="28" />
      <path d="M298 65 Q305 55 295 45 Q305 35 300 25" stroke-dasharray="3 3" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="30" y1="205" x2="370" y2="205" stroke="#94a3b8" stroke-width="3" />
      <!-- Clock in mint green -->
      <circle cx="110" cy="140" r="45" fill="#ecfdf5" stroke="#059669" />
      <line x1="110" y1="140" x2="110" y2="112" stroke="#059669" stroke-width="3" />
      <line x1="110" y1="140" x2="132" y2="140" stroke="#059669" stroke-width="2.5" />
      <!-- House with warm terracotta roof -->
      <polygon points="260,70 330,120 190,120" fill="#fed7aa" stroke="#ea580c" />
      <rect x="205" y="120" width="110" height="85" fill="#fef3c7" stroke="#d97706" />
      <rect x="245" y="145" width="30" height="60" fill="#f97316" stroke="#c2410c" />
      <rect x="215" y="135" width="22" height="25" fill="#e0f2fe" stroke="#0284c7" />
      <rect x="283" y="135" width="22" height="25" fill="#e0f2fe" stroke="#0284c7" />
    </svg>`,
  },

  // 7. Health, Medicine & Wellness
  {
    id: 'health_wellness_doctor',
    title: 'Health, Medicine & Healthcare',
    category: 'Health & Wellness',
    tags: ['health', 'medical', 'doctor', 'hospital', 'medicine', 'wellness', 'pharmacy', 'sick', 'body', 'nutrition'],
    defaultCaption: 'Figure 1: Target Vocabulary — Healthcare professionals, medical supplies, and wellness',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <!-- Stethoscope -->
      <path d="M120 60 V110 C120 150 170 150 170 110 V60" />
      <circle cx="120" cy="55" r="5" />
      <circle cx="170" cy="55" r="5" />
      <path d="M145 142 V175 C145 195 195 195 195 160" />
      <circle cx="195" cy="155" r="12" />
      <!-- First aid kit box -->
      <rect x="230" y="100" width="110" height="95" rx="10" />
      <path d="M265 100 V80 H305 V100" stroke-width="2" />
      <!-- Cross symbol -->
      <rect x="275" y="125" width="20" height="45" rx="3" />
      <rect x="262" y="137" width="46" height="20" rx="3" />
      <!-- Medicine bottle -->
      <rect x="55" y="125" width="40" height="65" rx="4" />
      <rect x="62" y="112" width="26" height="13" rx="2" />
      <line x1="62" y1="145" x2="88" y2="145" stroke-dasharray="2 2" />
      <line x1="62" y1="160" x2="88" y2="160" stroke-dasharray="2 2" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <!-- First aid box in clean white & bright red -->
      <rect x="230" y="100" width="110" height="95" rx="10" fill="#ffffff" stroke="#e11d48" />
      <path d="M265 100 V80 H305 V100" stroke="#9f1239" stroke-width="2" />
      <rect x="275" y="125" width="20" height="45" rx="3" fill="#e11d48" stroke="#be123c" />
      <rect x="262" y="137" width="46" height="20" rx="3" fill="#e11d48" stroke="#be123c" />
      <!-- Stethoscope in teal -->
      <path d="M120 60 V110 C120 150 170 150 170 110 V60" stroke="#0f766e" stroke-width="3" />
      <circle cx="195" cy="155" r="12" fill="#ccfbf1" stroke="#0f766e" />
    </svg>`,
  },

  // 8. Sports, Hobbies & Music
  {
    id: 'sports_hobbies_leisure',
    title: 'Sports, Arts & Leisure Hobbies',
    category: 'Sports & Hobbies',
    tags: ['sports', 'hobbies', 'music', 'art', 'football', 'soccer', 'guitar', 'painting', 'exercise', 'games', 'leisure'],
    defaultCaption: 'Figure 1: Target Vocabulary — Active sports, artistic pastimes, and musical instruments',
    svgLineArt: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <!-- Soccer Ball -->
      <circle cx="95" cy="140" r="40" />
      <polygon points="95,125 107,133 103,147 87,147 83,133" />
      <line x1="95" y1="125" x2="95" y2="100" />
      <line x1="107" y1="133" x2="130" y2="125" />
      <line x1="103" y1="147" x2="120" y2="168" />
      <line x1="87" y1="147" x2="70" y2="168" />
      <line x1="83" y1="133" x2="60" y2="125" />
      <!-- Painter Palette -->
      <path d="M180 140 C180 105 240 105 265 130 C280 145 280 170 260 175 C240 180 235 160 215 165 C195 170 180 160 180 140 Z" />
      <circle cx="250" cy="158" r="6" />
      <circle cx="205" cy="130" r="5" />
      <circle cx="225" cy="120" r="5" />
      <circle cx="248" cy="130" r="5" />
      <!-- Paint Brush through palette -->
      <line x1="190" y1="185" x2="275" y2="90" stroke-width="3" />
      <!-- Acoustic Guitar on right -->
      <ellipse cx="330" cy="170" rx="30" ry="25" />
      <circle cx="330" cy="170" r="8" />
      <ellipse cx="330" cy="135" rx="22" ry="18" />
      <line x1="330" y1="117" x2="330" y2="60" stroke-width="3" />
      <rect x="325" y="45" width="10" height="15" rx="2" />
    </svg>`,
    svgVectorAccent: `<svg viewBox="0 0 400 240" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
      <!-- Soccer ball with high contrast accents -->
      <circle cx="95" cy="140" r="40" fill="#ffffff" stroke="#1e293b" />
      <polygon points="95,125 107,133 103,147 87,147 83,133" fill="#1e293b" />
      <!-- Painter palette with colorful drops -->
      <path d="M180 140 C180 105 240 105 265 130 C280 145 280 170 260 175 C240 180 235 160 215 165 C195 170 180 160 180 140 Z" fill="#fef3c7" stroke="#d97706" />
      <circle cx="205" cy="130" r="5" fill="#ef4444" stroke="#dc2626" />
      <circle cx="225" cy="120" r="5" fill="#3b82f6" stroke="#2563eb" />
      <circle cx="248" cy="130" r="5" fill="#22c55e" stroke="#16a34a" />
      <!-- Guitar in warm wood tones -->
      <ellipse cx="330" cy="170" rx="30" ry="25" fill="#ffedd5" stroke="#ea580c" />
      <ellipse cx="330" cy="135" rx="22" ry="18" fill="#ffedd5" stroke="#ea580c" />
    </svg>`,
  }
];

/**
 * 4-Item Visual Matching Exercise Sets for Vocabulary Quizzes
 */
export const VISUAL_MATCHING_BANKS: Record<string, { letter: string; label: string; svg: string }[]> = {
  food: [
    {
      letter: 'A',
      label: 'Crisp Red Apple',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 35 C40 20, 25 25, 25 45 C25 75, 45 85, 50 85 C55 85, 75 75, 75 45 C75 25, 60 20, 50 35 Z" fill="#fee2e2" />
        <path d="M50 35 V20" stroke-width="3" />
        <path d="M50 25 Q60 20 62 25" stroke="#16a34a" />
      </svg>`
    },
    {
      letter: 'B',
      label: 'Chef Knife',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 75 L40 60 L85 20 Q88 18 80 30 L55 65 L40 60 Z" fill="#e2e8f0" />
        <path d="M20 75 L12 85 L25 90 L35 78 Z" fill="#78350f" />
      </svg>`
    },
    {
      letter: 'C',
      label: 'Recipe Book',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="20" width="50" height="65" rx="4" fill="#fef3c7" />
        <line x1="35" y1="35" x2="65" y2="35" />
        <line x1="35" y1="48" x2="65" y2="48" />
        <line x1="35" y1="60" x2="55" y2="60" />
      </svg>`
    },
    {
      letter: 'D',
      label: 'Fresh Orange',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="52" r="30" fill="#ffedd5" />
        <path d="M50 22 V15" stroke="#16a34a" stroke-width="3" />
        <path d="M50 18 Q62 14 62 22" stroke="#16a34a" fill="#dcfce7" />
      </svg>`
    }
  ],

  travel: [
    {
      letter: 'A',
      label: 'Airplane',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 50 L75 30 L85 36 L65 52 L80 58 L77 64 L58 58 L40 72 L30 68 L45 58 Z" fill="#e0f2fe" />
      </svg>`
    },
    {
      letter: 'B',
      label: 'Passport',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="20" width="50" height="65" rx="4" fill="#e0e7ff" />
        <circle cx="50" cy="48" r="10" stroke="#4338ca" />
      </svg>`
    },
    {
      letter: 'C',
      label: 'Suitcase',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="35" width="50" height="50" rx="6" fill="#fef3c7" />
        <path d="M40 35 V24 H60 V35" />
        <circle cx="35" cy="85" r="3" fill="#1e293b" />
        <circle cx="65" cy="85" r="3" fill="#1e293b" />
      </svg>`
    },
    {
      letter: 'D',
      label: 'Ticket / Boarding Pass',
      svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="30" width="64" height="40" rx="4" fill="#f1f5f9" />
        <line x1="60" y1="30" x2="60" y2="70" stroke-dasharray="3 3" />
        <circle cx="18" cy="50" r="4" fill="#ffffff" />
        <circle cx="82" cy="50" r="4" fill="#ffffff" />
      </svg>`
    }
  ]
};

/**
 * Helper to retrieve or synthesize a topic-matching visual
 */
export function getCuratedVisualForTopic(topic: string, style: 'line_art' | 'vector_accent' = 'line_art'): WorksheetVisual {
  const lowerTopic = (topic || '').toLowerCase();

  let matched = CURATED_VISUAL_LIBRARY.find((item) =>
    item.tags.some((tag) => lowerTopic.includes(tag))
  );

  if (!matched) {
    // Default to school & study desk as universally appropriate for worksheets
    matched = CURATED_VISUAL_LIBRARY[2];
  }

  const svg = style === 'line_art' ? matched.svgLineArt : matched.svgVectorAccent;

  return {
    id: `visual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    placement: 'header_banner',
    title: matched.title,
    caption: matched.defaultCaption.replace('Target Vocabulary', topic.trim() || 'Core Lesson Concepts'),
    style,
    category: matched.category,
    svgContent: svg,
    altText: matched.title,
    size: 'md',
  };
}

/**
 * Generates a 4-item visual matching bank for vocabulary worksheets
 */
export function createMatchingVisualBank(topic: string): WorksheetVisual {
  const lowerTopic = (topic || '').toLowerCase();
  const bankKey = lowerTopic.includes('travel') || lowerTopic.includes('airport') ? 'travel' : 'food';
  const items = VISUAL_MATCHING_BANKS[bankKey] || VISUAL_MATCHING_BANKS.food;

  return {
    id: `visual-matching-${Date.now()}`,
    placement: 'matching_bank',
    title: 'Visual Matching Bank',
    caption: 'Match the target vocabulary words (1-4) with the corresponding illustrations [A - D] below.',
    style: 'line_art',
    category: 'Vocabulary Matching',
    altText: '4-Item Visual Matching Exercise Bank',
    size: 'full',
    matchingItems: items.map(item => ({
      letter: item.letter,
      label: item.label,
      svgContent: item.svg
    }))
  };
}
