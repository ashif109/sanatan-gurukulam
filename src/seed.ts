import { Course, Quiz } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Vedic Astrology Foundation (Parashari Method)",
    description: "Master the foundational pillars of Parashari Astrology. Learn how to interpret Houses (Bhavas), Signs (Rashis), Planets (Grahas), and their aspects (Drishtis). Gain complete operational proficiency in drawing and reading basic natal horoscopes with detailed accuracy.",
    category: "Astrology & Allied Sciences",
    difficulty: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80",
    price: 2999,
    originalPrice: 10999,
    rating: 4.9,
    reviewsCount: 312,
    instructorId: "inst-1",
    instructorName: "Pandit Ramachandra Shastri",
    highlights: [
      "Understand the 12 Bhavas and their deep psychological significance",
      "Analyze the strength of 9 Grahas through Shadbala parameters",
      "Map out primary and secondary planetary aspects (Drishtis)",
      "Interpret Navamsha (D-9) divisional charts for marital alignments"
    ],
    studentsCount: 1420,
    status: "approved",
    createdAt: "2026-01-10T00:00:00Z",
    chapters: [
      {
        id: "ch-1-1",
        title: "Module 1: Celestial Geography & Rashi Purusha",
        modules: [
          {
            id: "mod-1-1-1",
            title: "1.1 Introduction to the Sidereal Zodiac vs. Tropical Zodiac",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-background-shining-loop-47206-large.mp4",
            durationSeconds: 320
          },
          {
            id: "mod-1-1-2",
            title: "1.2 Elements and Attributes of the 12 Houses (Bhavas)",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-starry-universe-with-glowing-stars-back-background-47264-large.mp4",
            durationSeconds: 450
          }
        ]
      },
      {
        id: "ch-1-2",
        title: "Module 2: Graha Characteristics & Celestial Strength",
        modules: [
          {
            id: "mod-1-2-1",
            title: "2.1 Benefic vs. Malefic Functional Status of Planets",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-at-his-office-desk-34282-large.mp4",
            durationSeconds: 390
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Advanced Kundali Analysis & Dasha Prediction",
    description: "Deep dive into the timing of events using Vimshottari and Yogini Dasha systems. Learn to read planetary transits (Gochara), Ashtakavarga grids, and divisional charts (Vargas like D-10 for career and D-30 for obstacles). Predict core life milestones including career breakthroughs, wealth acquisitions, and spiritual awakenings.",
    category: "Astrology & Allied Sciences",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    price: 4999,
    originalPrice: 18999,
    rating: 4.8,
    reviewsCount: 224,
    instructorId: "inst-1",
    instructorName: "Pandit Ramachandra Shastri",
    highlights: [
      "Deconstruct Vimshottari Mahadasha, Antardasha, and Pratyantardasha cycles",
      "Calculate transit alignments (Gochara) using Shani's Sade Sati impact",
      "Evaluate Ashtakavarga points (Bindus) for precise quantitative strengths",
      "Perform Muhurta computations for wedding dates and corporate inaugurations"
    ],
    studentsCount: 890,
    status: "approved",
    createdAt: "2026-03-05T00:00:00Z",
    chapters: [
      {
        id: "ch-2-1",
        title: "Module 1: Dasha Chronology & Life Milestones",
        modules: [
          {
            id: "mod-2-1-1",
            title: "1.1 Mathematical Underpinnings of Vimshottari System",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-star-trails-glowing-in-the-night-sky-47285-large.mp4",
            durationSeconds: 520
          },
          {
            id: "mod-2-1-2",
            title: "1.2 Synthesizing Transit (Gochara) with Dasha Frames",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-glowing-computer-keyboard-in-the-dark-44161-large.mp4",
            durationSeconds: 480
          }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Sanskrit Grammar & Pronunciation Mastery",
    description: "Learn Sanskrit from scratch following the classical Ashtadhyayi guidelines laid down by Sage Panini. Obtain absolute precision in chanting sacred stotras, Vedas, Upanishads, and original Shlokas. Cover Maheshvara Sutras, sandhi modifications, noun declensions (vibhakti), and verb conjugation rules.",
    category: "Linguistics & Chanting",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    price: 3499,
    originalPrice: 12999,
    rating: 5.0,
    reviewsCount: 450,
    instructorId: "inst-3",
    instructorName: "Dr. Ananya Bharadwaj",
    highlights: [
      "Chant the 14 Maheshvara Sutras with accurate acoustic alignment",
      "Decode sandhi transition combinations (Svara, Vyanjana, and Visarga)",
      "Decline classical nouns in all 8 Vibhaktis (Declensions)",
      "Deconstruct philosophical verses from Upanishads with word-by-word meaning"
    ],
    studentsCount: 2150,
    status: "approved",
    createdAt: "2026-02-15T00:00:00Z",
    chapters: [
      {
        id: "ch-3-1",
        title: "Module 1: Phonetics & Sacred Acoustics",
        modules: [
          {
            id: "mod-3-1-1",
            title: "1.1 Anatomy of Sound: Varnas & Five Places of Articulation",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-burning-candle-flame-in-dark-32213-large.mp4",
            durationSeconds: 420
          }
        ]
      }
    ]
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "quiz-course-1",
    courseId: "course-1",
    title: "Introduction to Parashari Jyotish Principles",
    description: "Evaluate your core understanding of Rasis, Bhavas, and planetary aspects.",
    durationMinutes: 10,
    questions: [
      {
        id: "q-1-1",
        question: "Which of the following houses (Bhavas) is considered a primary 'Dharma Trikona'?",
        options: ["1st, 5th, and 9th Houses", "2nd, 6th, and 10th Houses", "3rd, 7th, and 11th Houses", "4th, 8th, and 12th Houses"],
        correctAnswerIndex: 0,
        explanation: "The Dharma Trikona houses are the 1st (Self), 5th (Intellect/Purvapunya), and 9th (Wisdom/Dharma) houses, establishing cosmic direction."
      },
      {
        id: "q-1-2",
        question: "Which planet is exalted (Ucha) in the sign of Aries (Mesha)?",
        options: ["Saturn (Shani)", "Sun (Surya)", "Jupiter (Guru)", "Venus (Shukra)"],
        correctAnswerIndex: 1,
        explanation: "Surya (the Sun) is exalted at 10 degrees in Aries, signifying highest vitality, leadership potential, and self-realization."
      }
    ]
  },
  {
    id: "quiz-course-3",
    courseId: "course-3",
    title: "Sanskrit Grammar & Sacred Sounds Evaluation",
    description: "Test your skills on sound articulation, Paninian rules, and sandhi structures.",
    durationMinutes: 10,
    questions: [
      {
        id: "q-3-1",
        question: "Which sutras describe the phonemes of the Sanskrit language in Panini's grammar?",
        options: ["Maheshvara Sutras", "Patanjali Sutras", "Yoga Sutras", "Brahma Sutras"],
        correctAnswerIndex: 0,
        explanation: "The 14 Maheshvara Sutras are the foundational sound syllables revealed to Sage Panini, representing the entire seed-matrix of Sanskrit phonetics."
      }
    ]
  }
];
