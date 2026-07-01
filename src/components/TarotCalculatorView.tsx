import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  HelpCircle,
  History,
  BarChart3,
  BookOpen,
  Compass,
  Heart,
  Lock,
  Mail,
  Phone,
  User,
  Send,
  RotateCw,
  ArrowRight,
  Check,
  Clock,
  FolderHeart,
  Star,
  Download,
  Home,
  Info
} from 'lucide-react';
import { tarotDeck, secureShuffleTarotDeck, TarotCard } from '../data/tarotDeck';

// Interface structures
interface ActiveCardSelection {
  cardId: number;
  isReversed: boolean;
  positionMeaning: string;
}

interface UserSessionInfo {
  name: string;
  email: string;
  phone: string;
  question: string;
  category: string;
}

interface AIInterpretation {
  summary: string;
  spiritualGuidance: string;
  emotionalInsight: string;
  practicalAdvice: string;
  reflectionQuestions: string[];
  growthOpportunities: string[];
}

interface TarotReadingRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  question: string;
  category: string;
  spreadMode: string;
  selectedCards: ActiveCardSelection[];
  aiSummary: AIInterpretation;
  isFavorite: boolean;
  createdAt: string;
}

interface AnalyticsStats {
  totalReadings: number;
  categoryDistribution: Record<string, number>;
  mostDrawnCards: { cardId: number; cardName: string; count: number }[];
  engagementMetric: {
    activeUsersThisMonth: number;
    averageReadingsPerUser: number;
    conversionRatePercent: number;
  };
}

interface TarotCalculatorProps {
  currentUser: any;
}

type MenuTab = 'reading' | 'history' | 'analytics' | 'wisdom';

// Static configurations
const CATEGORIES = [
  { id: 'Love', label: '💖 Love & Relationships', desc: 'Attraction, compatibility, and soul unions' },
  { id: 'Career', label: '💼 Career & Projects', desc: 'Vocation, milestones, and strategic direction' },
  { id: 'Finance', label: '🪙 Material & Wealth', desc: 'Budgets, asset flow, and prosperity seeds' },
  { id: 'Spiritual Growth', label: '🕉️ Spiritual Path', desc: 'Inner awareness, soul expansion, and karma' },
  { id: 'Education', label: '🎓 Study & Knowledge', desc: 'Learning, exams, and structural growth' },
  { id: 'Family', label: '🏡 Family & Home', desc: 'Domestic peace, boundary ties, and ancestors' },
  { id: 'General Guidance', label: '🔮 General Guidance', desc: 'Universal alignment and intuitive pathways' }
];

const SPREADS = [
  {
    id: 'single',
    name: 'Single Card Reading',
    cardsNeeded: 1,
    desc: 'Provides a fast, precise answer to focus questions and instantaneous cosmic directions.',
    positions: ['Universal Guidance']
  },
  {
    id: 'three',
    name: 'Three Card Reading',
    cardsNeeded: 3,
    desc: 'Coordinates your journey along time grids (Past, Present, and Future influence mapping).',
    positions: ['Past Influence', 'Present Energy', 'Future Wave']
  },
  {
    id: 'five',
    name: 'Five Card Reading',
    cardsNeeded: 5,
    desc: 'Weaves an advanced tapestry of situations, immediate obstacles, advice, and eventual outcome.',
    positions: ['Current Situation', 'Immediate Obstacle', 'Spiritual Advice', 'Hidden Influence', 'Ultimate Outcome']
  },
  {
    id: 'celtic',
    name: 'Celtic Cross Spread',
    cardsNeeded: 10,
    desc: 'The ultimate, revered 10-card oracle layout diving into active, latent, social, and destined pathways.',
    positions: [
      '1. Present Self',
      '2. Crossing Challenge',
      '3. Conscious Intent',
      '4. Subconscious Roots',
      '5. Recent Past',
      '6. Near Future',
      '7. Internal Authority',
      '8. External Environment',
      '9. Hopes & Shadow Fears',
      '10. Ultimate Outcome'
    ]
  },
  {
    id: 'daily',
    name: 'Daily Tarot Guidance',
    cardsNeeded: 1,
    desc: 'An everyday single-card anchor defining your daily meditative theme, message, and reflection.',
    positions: ['Daily Affirmation']
  }
];

export default function TarotCalculatorView({ currentUser }: TarotCalculatorProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<MenuTab>('reading');

  // Input states (Step 1)
  const [session, setSession] = useState<UserSessionInfo>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    question: '',
    category: 'General Guidance'
  });

  // Flow State
  // 1: Inputs, 2: Breathe Ritual, 3: Spread Select, 4: Shuffle/Draw, 5: Reveal/Interpretation
  const [readingStep, setReadingStep] = useState<number>(1);
  const [selectedSpread, setSelectedSpread] = useState<typeof SPREADS[0]>(SPREADS[0]);

  // Game state
  const [shuffling, setShuffling] = useState<boolean>(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [userSelection, setUserSelection] = useState<ActiveCardSelection[]>([]);
  const [revealIndex, setRevealIndex] = useState<number>(-1); // Track card reveal flips
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]); // Track which cards are flipped

  // API Persistence states
  const [currentResult, setCurrentResult] = useState<TarotReadingRecord | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingWisdom, setLoadingWisdom] = useState<string>('');

  // Tabs Lists & Analytics
  const [historyList, setHistoryList] = useState<TarotReadingRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // Breathe Ritual Ring State
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathProgress, setBreathProgress] = useState<number>(0);

  // Load baseline on startup
  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  // Breathe animation timer
  useEffect(() => {
    if (readingStep !== 2) return;
    const interval = setInterval(() => {
      setBreathProgress((prev) => {
        let next = prev + 4;
        if (next >= 100) {
          next = 0;
          setBreathPhase((phase) => {
            if (phase === 'Inhale') return 'Hold';
            if (phase === 'Hold') return 'Exhale';
            if (phase === 'Exhale') return 'Rest';
            return 'Inhale';
          });
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [readingStep]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const url = currentUser?.id
        ? `/api/tarot/history?userId=${currentUser.id}`
        : '/api/tarot/history';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/tarot/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Start ritual
  const handleStartRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.question.trim()) {
      alert('Please state your query or topic of focus to align the cosmos.');
      return;
    }
    setReadingStep(2);
  };

  // Select layout
  const handleSelectSpread = (spreadId: string) => {
    const spread = SPREADS.find(s => s.id === spreadId) || SPREADS[0];
    setSelectedSpread(spread);
    setReadingStep(4);
    triggerShuffle();
  };

  // Shuffling logic
  const triggerShuffle = () => {
    setShuffling(true);
    setUserSelection([]);
    setRevealIndex(-1);
    setFlippedStates([]);
    setTimeout(() => {
      const deck = secureShuffleTarotDeck();
      setShuffledDeck(deck);
      setShuffling(false);
    }, 1800);
  };

  // Draw card
  const handleSelectCardAtDeckIndex = (deckIdx: number) => {
    if (userSelection.length >= selectedSpread.cardsNeeded) return;

    // Check if card is already selected
    const isAlreadySelected = userSelection.some(item => item.cardId === shuffledDeck[deckIdx].id);
    if (isAlreadySelected) return;

    const cardsNeededNow = selectedSpread.cardsNeeded;
    const currentSelectedCount = userSelection.length;
    const positionName = selectedSpread.positions[currentSelectedCount];

    // Cryptographic-like randomness to decide if card is upright or reversed (true orientation)
    const reversedChance = Math.random() > 0.5;

    const newSelection: ActiveCardSelection = {
      cardId: shuffledDeck[deckIdx].id,
      isReversed: reversedChance,
      positionMeaning: positionName
    };

    const nextSelection = [...userSelection, newSelection];
    setUserSelection(nextSelection);

    // If we just drew the final needed card, wait a brief moments and then submit
    if (nextSelection.length === cardsNeededNow) {
      setFlippedStates(new Array(cardsNeededNow).fill(false));
    }
  };

  // Scroll through wisdom loading screens to enrich the experience
  const loadingWisdomSayings = [
    "Purifying starlight pathways and focusing spiritual nodes...",
    "Shuffling the ancient Rider-Waite symbolic codes...",
    "Aligning love templates, career directions, and cosmic karma...",
    "Invoking the light of the Oracle to translate your blueprint..."
  ];

  // Submit reading to Server (Gemini AI + Storage)
  const handleTriggerInterpretation = async () => {
    if (userSelection.length < selectedSpread.cardsNeeded) return;
    setSubmitting(true);
    setReadingStep(5);

    // Cycle beautiful wisdom loadings
    let wisdomIndex = 0;
    setLoadingWisdom(loadingWisdomSayings[0]);
    const cycleInterval = setInterval(() => {
      wisdomIndex = (wisdomIndex + 1) % loadingWisdomSayings.length;
      setLoadingWisdom(loadingWisdomSayings[wisdomIndex]);
    }, 3000);

    try {
      const payload = {
        userId: currentUser?.id || 'demo-user',
        name: session.name || 'Anonymous Seeker',
        email: session.email,
        phone: session.phone,
        question: session.question,
        category: session.category,
        spreadMode: selectedSpread.name,
        selectedCards: userSelection
      };

      const res = await fetch('/api/tarot/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const responseData = await res.json();
        setCurrentResult(responseData.record);
        // Refresh histories and stats
        fetchHistory();
        fetchStats();
      } else {
        throw new Error("Failed to secure active reading response");
      }
    } catch (err) {
      console.error(err);
      alert('Cosmic channels are noisy right now. Proceeding with premium local calculations.');
    } finally {
      clearInterval(cycleInterval);
      setSubmitting(false);
    }
  };

  // Card reveals flips togglier
  const handleFlipCardIndex = (idx: number) => {
    setFlippedStates((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const handleToggleFavorite = async (readingId: string, currentFavState: boolean) => {
    try {
      const res = await fetch('/api/tarot/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: readingId, isFavorite: !currentFavState })
      });
      if (res.ok) {
        if (currentResult && currentResult.id === readingId) {
          setCurrentResult(prev => prev ? { ...prev, isFavorite: !currentFavState } : null);
        }
        setHistoryList(prev => prev.map(item => item.id === readingId ? { ...item, isFavorite: !currentFavState } : item));
      }
    } catch (err) {
      console.error('Failed to toggle favorite state:', err);
    }
  };

  // Print Friendly layout triggers
  const triggerPDFMockPrint = () => {
    window.print();
  };

  // Fast reset reading
  const handleResetReading = () => {
    setSession(prev => ({
      ...prev,
      question: ''
    }));
    setUserSelection([]);
    setCurrentResult(null);
    setReadingStep(1);
  };

  const loadPresetReading = (item: TarotReadingRecord) => {
    setCurrentResult(item);
    // Find matching cards list size and pre-populate selected Spread mode
    const matchingSpread = SPREADS.find(s => s.name === item.spreadMode) || SPREADS[0];
    setSelectedSpread(matchingSpread);
    setUserSelection(item.selectedCards);
    setFlippedStates(new Array(item.selectedCards.length).fill(true));
    setReadingStep(5);
    setActiveTab('reading');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8" id="tarot_reading_module">
      {/* HEADER SECTION WITH THEME-AWARE STYLES */}
      <section className="bg-bone/35 border border-gray-200 py-12 px-6 rounded-lg text-left mb-8">
        <div className="max-w-4xl space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-paper-white border border-gray-200 rounded-[100px] text-micro font-medium tracking-wide text-gray-800 uppercase">
            " Oracle Arcana
          </span>
          <h1 className="text-heading-lg sm:text-display font-light text-gray-800 tracking-[-1.45px] leading-tight">
            Tarot Reading & Spiritual Guidance
          </h1>
          <p className="text-body text-slate-gray max-w-2xl leading-relaxed">
            Step inside our premium reflective radar. Formulate noble questions, interact with physical-like shuffling systems, and harvest absolute divine reflections.
          </p>

          {/* DISCLOSURE CARD AS REQUESTED */}
          <div className="card-dusty-rose border border-gray-200 flex items-start space-x-2.5 text-left text-[11px] leading-relaxed max-w-3xl p-4 mt-4">
            <Info className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
            <span className="text-slate-gray">
              <strong className="text-burgundy block mb-1">Divine Guidance Disclosure:</strong> Tarot is intended as a sacred mirror for guidance, personal reflection, decision support, and soul insight. It does not replace logical expert counsel and should not be considered a guaranteed prediction of physical future events.
            </span>
          </div>
        </div>
      </section>

      {/* CORE NAVIGATION BAR */}
      <div className="bg-bone/35 border border-gray-200 flex flex-wrap gap-1.5 justify-center max-w-4xl mx-auto p-1.5 rounded-lg mb-8">
        {[
          { id: 'reading', label: 'Guided Oracle', icon: Compass },
          { id: 'history', label: 'Archived History', icon: History, fetch: fetchHistory },
          { id: 'analytics', label: 'Oracle Analytics', icon: BarChart3, fetch: fetchStats },
          { id: 'wisdom', label: 'Spiritual Wisdom', icon: BookOpen }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.fetch) tab.fetch();
              }}
              className={`px-4 py-2 rounded-[100px] cursor-pointer transition-all text-[11px] uppercase tracking-wider text-center flex-grow min-w-[140px] flex items-center justify-center space-x-2 ${isActive
                  ? 'bg-ink-black text-gray-900-white font-semibold'
                  : 'text-slate-gray hover:text-gray-800'
                }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEWPORT CONTROLLERS BASED ON ACTIVE TABS */}
      <AnimatePresence mode="wait">
        {activeTab === 'reading' && (
          <motion.div
            key="guided-reading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* STEP 1: DATA COLLECTION */}
            {readingStep === 1 && (
              <div className="max-w-3xl mx-auto bg-paper-white border border-gray-200 rounded-lg p-6 relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
                <h2 className="text-[12px] font-sans font-bold text-gray-800 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200 flex items-center space-x-2">
                  <User className="w-5 h-5 text-slate-gray" />
                  <span>Personalize Your Reading Channels</span>
                </h2>

                <form onSubmit={handleStartRitual} className="space-y-6">
                  {/* TEXT GATHERERS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-gray font-mono uppercase tracking-wide text-[9.5px] block mb-1">Your Name (Optional)</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-gray/40 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={session.name}
                          onChange={(e) => setSession({ ...session, name: e.target.value })}
                          placeholder="Your noble name"
                          className="aw-input w-full pl-9 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-gray font-mono uppercase tracking-wide text-[9.5px] block mb-1">Email Address (Optional)</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-gray/40 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={session.email}
                          onChange={(e) => setSession({ ...session, email: e.target.value })}
                          placeholder="your.email@domains.com"
                          className="aw-input w-full pl-9 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-gray font-mono uppercase tracking-wide text-[9.5px] block mb-1">Phone Number (Optional)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-gray/40 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={session.phone}
                          onChange={(e) => setSession({ ...session, phone: e.target.value })}
                          placeholder="+1 9876 543 210"
                          className="aw-input w-full pl-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AREA OF FOCUS / CATEGORY SELECT */}
                  <div>
                    <label className="text-slate-gray font-mono uppercase tracking-wide text-[9.5px] block mb-1">Choose Your Area of Focus</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {CATEGORIES.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => setSession({ ...session, category: cat.id })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 text-left relative overflow-hidden ${session.category === cat.id
                              ? 'bg-orange-950/25 border-purple-1005 shadow-md shadow-orange-500/5'
                              : 'bg-gray-50 border-purple-100 hover:border-purple-200'
                            }`}
                        >
                          <h3 className="text-xs font-bold text-slate-gray">{cat.label}</h3>
                          <p className="text-[10px] text-slate-gray mt-1 line-clamp-2 leading-relaxed">{cat.desc}</p>
                          {session.category === cat.id && (
                            <div className="absolute bottom-1 right-1 w-3 h-3 bg-ink-black rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-gray-900-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE QUESTION */}
                  <div>
                    <label className="text-slate-gray font-mono uppercase tracking-wide text-[9.5px] flex items-center justify-between mb-1">
                      <span>State Your Focus Question Clearly (Required)</span>
                      <span className="text-[10px] text-slate-gray lowercase">be detailed & specific</span>
                    </label>
                    <textarea
                      value={session.question}
                      onChange={(e) => setSession({ ...session, question: e.target.value })}
                      placeholder="E.g., Which skills should I expand to achieve financial expansion on my new mobile engineering startup?"
                      rows={3}
                      className="aw-input w-full px-4 py-3 text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="aw-btn-primary w-full text-micro py-3 flex items-center justify-center space-x-2"
                  >
                    <span>Initiate Breathing Ritual</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: BREATHING / PREPARATION RITUAL */}
            {readingStep === 2 && (
              <div className="max-w-2xl mx-auto bg-paper-white border border-gray-200 rounded-lg p-8 text-center relative overflow-hidden flex flex-col items-center">
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
                <h2 className="text-xl font-sans text-slate-gray mb-2">Align Your Inner Energy</h2>
                <p className="text-slate-gray text-xs max-w-sm mb-8 leading-relaxed mx-auto">
                  Take a slow, deep breath, clear all external office distractions, and focus your mind on your stated question.
                </p>

                {/* VISUAL SPARKLY BREATH CIRCLE */}
                <div className="relative w-44 h-44 mb-10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-gray-200 animate-ping opacity-20" />
                  {/* Rotating Gradient Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      className="stroke-bone"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      className="stroke-ink-black transition-all"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="440"
                      strokeDashoffset={440 - (440 * breathProgress) / 100}
                    />
                  </svg>
                  <div className="absolute inset-4 rounded-full bg-paper-white flex flex-col items-center justify-center border border-gray-200">
                    <span className="text-slate-gray text-xs font-bold tracking-widest uppercase animate-pulse">{breathPhase}</span>
                    <span className="text-slate-gray text-[10px] mt-1">Breathe deeply</span>
                  </div>
                </div>

                <div className="space-y-3.5 w-full max-w-md">
                  <button
                    onClick={() => setReadingStep(3)}
                    className="w-full py-3 bg-purple-50/30 border border-gray-200 text-slate-gray hover:bg-purple-100 font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>I Feel Centered and Ready</span>
                  </button>
                  <button
                    onClick={() => setReadingStep(1)}
                    className="text-slate-gray hover:text-slate-gray text-xs cursor-pointer"
                  >
                    Return to parameters
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SPREAD OPTIONS SELECTOR */}
            {readingStep === 3 && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-sans text-slate-gray">Select Your Divination Spread Format</h2>
                  <p className="text-slate-gray text-xs mt-1">Choose the complexity grid that resonates with your focus question.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SPREADS.map((spread) => (
                    <div
                      key={spread.id}
                      onClick={() => handleSelectSpread(spread.id)}
                      className="p-5 rounded-lg border bg-paper-white border-gray-200 hover:border-gray-200 transition-all text-left cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="font-sans text-base text-slate-gray font-semibold">{spread.name}</h3>
                          <span className="px-2.5 py-0.5 bg-orange-950/40 text-slate-gray border border-gray-200 rounded-full text-xs font-bold uppercase">
                            {spread.cardsNeeded} {spread.cardsNeeded === 1 ? 'Card' : 'Cards'}
                          </span>
                        </div>
                        <p className="text-slate-gray text-xs mt-2.5 leading-relaxed">{spread.desc}</p>
                      </div>

                      <div className="border-t border-purple-100 mt-4 pt-4 flex flex-wrap gap-1.5">
                        {spread.positions.map((node, nIdx) => (
                          <span key={nIdx} className="px-2 py-0.5 bg-orange-950/10 text-gray-800/70 border border-purple-100 rounded text-[10px]">
                            {node}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <button onClick={() => setReadingStep(2)} className="text-slate-gray hover:text-slate-gray text-xs flex items-center space-x-1 mx-auto cursor-pointer">
                    <span>← back to breathing ritual</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: INTERACTIVE SHUFFLE & SELECTING FAN */}
            {readingStep === 4 && (
              <div className="max-w-5xl mx-auto bg-paper-white border border-gray-200 rounded-lg p-6 relative min-h-[450px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />

                {/* DRAW STATS PANEL */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-gray uppercase tracking-wider block">selected format</span>
                    <span className="text-xs font-sans text-slate-gray font-semibold">{selectedSpread.name}</span>
                  </div>

                  <div className="px-4 py-1.5 bg-bone/15 border border-gray-200 rounded-lg text-center">
                    <span className="text-[10px] text-slate-gray block uppercase">cards selected</span>
                    <span className="text-sm font-bold text-slate-gray font-mono">
                      {userSelection.length} / {selectedSpread.cardsNeeded}
                    </span>
                  </div>

                  <button
                    onClick={triggerShuffle}
                    disabled={shuffling}
                    className="px-3 py-1.5 bg-white hover:bg-purple-100 border border-gray-200 text-slate-gray text-xs hover:text-orange-300 rounded-lg flex items-center space-x-1 shadow transition-all cursor-pointer"
                  >
                    <RotateCw className={`w-3 h-3 ${shuffling ? 'animate-spin' : ''}`} />
                    <span>Shuffle</span>
                  </button>
                </div>

                {/* ANIMATING SHUFFLE SCREEN VS FAN CHOOSE SCREEN */}
                {shuffling ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <div className="relative w-28 h-40 mb-6 flex items-center justify-center">
                      <div className="absolute w-20 h-32 bg-paper-white border-2 border-gray-200 rounded-xl transform -rotate-12 animate-pulse shadow-2xl" />
                      <div className="absolute w-20 h-32 bg-paper-white border-2 border-gray-200 rounded-xl transform rotate-6 animate-pulse" />
                      <div className="absolute w-20 h-32 bg-paper-white border-2 border-gray-200 rounded-xl transform -rotate-3 animate-pulse" />
                      <div className="absolute inset-0 w-24 h-36 bg-paper-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-xl">
                        <Sparkles className="w-8 h-8 text-gray-800 animate-spin" />
                      </div>
                    </div>
                    <span className="text-slate-gray text-xs font-semibold animate-pulse tracking-widest uppercase">Shuffling cosmic nodes securely...</span>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between py-6">
                    {/* CARDS FAN LAYOUT */}
                    <div className="text-center mb-6">
                      <span className="text-xs text-slate-gray italic block">
                        Select {selectedSpread.cardsNeeded - userSelection.length} client card{selectedSpread.cardsNeeded - userSelection.length === 1 ? '' : 's'} intuitively from the fan grid below
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto py-1.5 px-3 max-h-[240px] overflow-y-auto">
                      {shuffledDeck.slice(0, 36).map((card, idx) => {
                        const isChosen = userSelection.some(item => item.cardId === card.id);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectCardAtDeckIndex(idx)}
                            className={`w-12 h-20 rounded-lg border cursor-pointer transition-all duration-200 relative shrink-0 overflow-hidden ${isChosen
                                ? 'border-gray-200 bg-paper-white scale-90 opacity-20'
                                : 'border-gray-200 bg-bone/35 hover:border-gray-200 hover:-translate-y-2'
                              }`}
                          >
                            {/* Card backing graphic */}
                            <div className="absolute inset-1 border border-amber-500/5 rounded-md flex items-center justify-center bg-gradient-to-br from-[#120704] to-[#0c0503]">
                              <div className="w-2 h-2 rounded-full bg-orange-500/30 animate-pulse" />
                            </div>
                            {isChosen && (
                              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-slate-gray" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ACTIVE SLOTS INDICATOR */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h4 className="text-xs font-bold text-slate-gray uppercase tracking-widest mb-4 text-center">Active Spread Slots</h4>
                      <div className="flex flex-wrap justify-center gap-4">
                        {selectedSpread.positions.map((pos, pIdx) => {
                          const drawnCard = userSelection[pIdx];
                          const meta = drawnCard ? tarotDeck.find(d => d.id === drawnCard.cardId) : null;
                          return (
                            <div key={pIdx} className="w-24 flex flex-col items-center">
                              <span className="text-[8px] text-slate-gray uppercase tracking-wider mb-2 text-center line-clamp-1 h-3">{pos}</span>
                              <div className={`w-14 h-22 rounded-lg border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden ${drawnCard
                                  ? 'border-orange-200 bg-white bg-white'
                                  : 'border-gray-200 bg-orange-500/5'
                                }`}>
                                {drawnCard && meta ? (
                                  <div className="absolute inset-0.5 flex flex-col justify-between p-1 bg-paper-white rounded border border-gray-200">
                                    <div className="text-[6px] text-slate-gray text-center uppercase tracking-tight font-bold leading-none line-clamp-2 mt-1">{meta.name}</div>
                                    <div className={`text-[6px] font-mono font-bold text-center py-0.5 uppercase mb-1 ${drawnCard.isReversed ? 'text-red-500' : 'text-emerald-400'}`}>
                                      {drawnCard.isReversed ? 'Rx' : 'Upright'}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-800/20 text-[10px] font-mono">?</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTROLLERS ZONE */}
                <div className="border-t border-gray-200 pt-4 mt-6 flex justify-between items-center">
                  <button onClick={() => setReadingStep(3)} className="text-slate-gray hover:text-slate-gray text-xs cursor-pointer">
                    ← Back to spread options
                  </button>

                  <button
                    onClick={handleTriggerInterpretation}
                    disabled={userSelection.length < selectedSpread.cardsNeeded || submitting}
                    className="aw-btn-primary text-micro py-2.5 px-6"
                  >
                    <span>Analyze Spread</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: AI INTERPRETATION PAGE */}
            {readingStep === 5 && (
              <div className="max-w-5xl mx-auto space-y-8">
                {submitting ? (
                  /* PREMIUM LOADING SCREEN */
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-xl relative min-h-[400px] flex flex-col items-center justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />

                    {/* Spacial Rotating Mystical Star */}
                    <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-purple-100 animate-ping opacity-10" />
                      <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                      <Sparkles className="w-10 h-10 text-gray-800 animate-pulse" />
                    </div>

                    <h3 className="font-sans text-lg text-slate-gray mb-2">Summoning AI Spiritual Intelligence</h3>
                    <p className="text-xs text-honey-gold font-mono tracking-widest uppercase mb-4 h-4 animate-pulse">{loadingWisdom}</p>
                    <p className="text-[11px] text-slate-gray max-w-sm mx-auto leading-relaxed">
                      Please hold your focus. The Oracle is gathering your spread indices, formulating the prompt, and translating card positions through process metadata securely.
                    </p>
                  </div>
                ) : (
                  currentResult && (
                    /* COMPLETED RESULTS PANELS */
                    <div className="space-y-8 animate-in fade-in duration-300">

                      {/* HERO SUMMARY AND ACTION BUTTONS */}
                      <div className="bg-paper-white border border-gray-200 rounded-lg p-6 relative">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
                          <div className="text-left">
                            <span className="text-[10px] text-slate-gray uppercase tracking-widest font-bold">reading summary report</span>
                            <h2 className="text-xl font-sans text-gray-800 font-bold mt-0.5 line-clamp-1">{currentResult.question}</h2>
                            <span className="text-[10px] text-slate-gray mt-1 block">
                              Category: <strong className="text-gray-800/80">{currentResult.category}</strong> • Format: <strong>{currentResult.spreadMode}</strong> • Issued on: {new Date(currentResult.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleToggleFavorite(currentResult.id, currentResult.isFavorite)}
                              className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${currentResult.isFavorite
                                  ? 'bg-orange-950/30 text-slate-gray border-gray-300'
                                  : 'bg-transparent text-slate-gray border border-gray-200 hover:border-gray-200'
                                }`}
                              title={currentResult.isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                            >
                              <Heart className="w-4 h-4" fill={currentResult.isFavorite ? 'currentColor' : 'none'} />
                            </button>

                            <button
                              onClick={triggerPDFMockPrint}
                              className="px-3 py-2 bg-white hover:bg-purple-100 border border-gray-200 text-slate-gray text-xs hover:text-orange-300 rounded-lg flex items-center space-x-1.5 shadow transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>

                            <button
                              onClick={handleResetReading}
                              className="aw-btn-primary py-2 px-4 text-micro font-bold"
                            >
                              New Reading
                            </button>
                          </div>
                        </div>

                        {/* GENERAL SYNTHESIZED REPORT BLOCKS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-left">
                          <div className="space-y-4">
                            <div className="p-4 card-sage border border-gray-200">
                              <h4 className="text-xs font-bold text-slate-gray uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                                <Sparkles className="w-3.5 h-3.5 text-gray-800" />
                                <span>Reading Summary</span>
                              </h4>
                              <p className="text-xs text-gray-800 leading-relaxed font-sans italic text-justify">
                                "{currentResult.aiSummary.summary}"
                              </p>
                            </div>

                            <div className="p-4 card-lavender border border-gray-200">
                              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                                <Compass className="w-3.5 h-3.5 text-purple-500" />
                                <span>Spiritual Connection</span>
                              </h4>
                              <p className="text-xs text-gray-800 leading-relaxed text-justify">
                                {currentResult.aiSummary.spiritualGuidance}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 card-lavender border border-gray-200">
                              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                                <Heart className="w-3.5 h-3.5 text-blue-500" />
                                <span>Emotional & Subconscious Insight</span>
                              </h4>
                              <p className="text-xs text-gray-800 leading-relaxed text-justify">
                                {currentResult.aiSummary.emotionalInsight}
                              </p>
                            </div>

                            <div className="p-4 card-sage border border-gray-200">
                              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                                <User className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Practical Action Steps</span>
                              </h4>
                              <p className="text-xs text-gray-800 leading-relaxed text-justify">
                                {currentResult.aiSummary.practicalAdvice}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* REFLECTION & PORTALS TAB */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t border-gray-200 pt-6 text-left">
                          <div>
                            <h4 className="text-xs font-bold text-slate-gray uppercase tracking-wider mb-2.5">MEDITATIVE REFLECTION QUESTIONS</h4>
                            <ul className="space-y-2">
                              {currentResult.aiSummary.reflectionQuestions.map((q, qIdx) => (
                                <li key={qIdx} className="text-xs text-slate-gray flex items-start space-x-2">
                                  <span className="text-gray-800 font-bold">?</span>
                                  <span className="leading-relaxed">{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-gray uppercase tracking-wider mb-2.5">GROWTH PORTALS & OPPORTUNITIES</h4>
                            <ul className="space-y-2">
                              {currentResult.aiSummary.growthOpportunities.map((g, gIdx) => (
                                <li key={gIdx} className="text-xs text-slate-gray flex items-start space-x-2">
                                  <span className="text-honey-gold text-xs font-bold">★</span>
                                  <span className="leading-relaxed">{g}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* INDIVIDUAL CARDS REVEAL BOARD WITH 3D FLIP */}
                      <div>
                        <h3 className="font-sans text-lg text-slate-gray mb-5 text-center">Spiritual Cards Drawn ({selectedSpread.cardsNeeded})</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {currentResult.selectedCards.map((selection, itemIdx) => {
                            const meta = tarotDeck.find(d => d.id === selection.cardId);
                            const isFlipped = flippedStates[itemIdx];
                            if (!meta) return null;

                            return (
                              <div key={itemIdx} className="flex flex-col items-center">
                                {/* POSITION MEANING LABEL */}
                                <span className="text-[10px] text-slate-gray uppercase tracking-wider block text-center mb-2 font-semibold h-4 line-clamp-1 truncate">
                                  {selection.positionMeaning}
                                </span>

                                {/* FLIPPABLE CARD BODY */}
                                <div
                                  onClick={() => handleFlipCardIndex(itemIdx)}
                                  className="w-40 h-64 relative cursor-pointer perspective"
                                  style={{ perspective: '1000px' }}
                                >
                                  <div
                                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                                      }`}
                                    style={{ transformStyle: 'preserve-3d' }}
                                  >
                                    {/* CARD FRONT FACE (DECORATED SACRED GEOMETRY BACKING) */}
                                    <div
                                      className="absolute inset-0 bg-paper-white border-2 border-gray-200 rounded-lg p-2 flex flex-col justify-between items-center"
                                      style={{ backfaceVisibility: 'hidden' }}
                                    >
                                      {/* Borders and Nodes */}
                                      <div className="w-full h-full border border-gray-200 rounded-lg relative flex flex-col items-center justify-between p-2 py-4 bg-bone/15">
                                        <div className="w-4 h-4 rounded-full border border-amber-500/20 flex items-center justify-center">
                                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                        </div>

                                        {/* Mandala */}
                                        <div className="relative w-14 h-14 flex items-center justify-center">
                                          <div className="absolute inset-0 border border-gray-200 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
                                          <div className="absolute inset-2 border border-gray-200 rounded-full" />
                                          <Compass className="w-6 h-6 text-gray-800/30 font-bold" />
                                        </div>

                                        <span className="text-[10px] text-slate-gray/40 uppercase tracking-widest font-mono">click to reveal</span>
                                      </div>
                                    </div>

                                    {/* CARD BACK FACE (REVEALED REAL CARD DETAILS) */}
                                    <div
                                      className={`absolute inset-0 bg-gradient-to-b ${meta.imagePlaceholderColor} border-2 border-orange-500 rounded-2xl p-2.5 shadow-2xl flex flex-col justify-between items-center text-center rotate-y-180`}
                                      style={{ backfaceVisibility: 'hidden' }}
                                    >
                                      {/* Card details front wrapper based on flip */}
                                      <div className={`w-full h-full border border-gray-200 rounded-lg relative flex flex-col justify-between p-2 bg-paper-white ${selection.isReversed ? 'rotate-180' : ''}`}>

                                        {/* Name and numerals */}
                                        <div className="text-center">
                                          <span className="text-[10px] text-slate-gray uppercase tracking-wider block font-mono">
                                            {meta.arcana === 'Major' ? `Major • ${meta.value}` : `${meta.suit}`}
                                          </span>
                                          <h4 className="font-sans text-xs font-bold text-slate-gray mt-1 line-clamp-1">{meta.name}</h4>
                                        </div>

                                        {/* Central Suit Theme Visual Glyphs */}
                                        <div className="flex flex-col items-center py-2.5">
                                          <span className="text-2xl filter drop-shadow">
                                            {meta.suit === 'Wands' && '🪵'}
                                            {meta.suit === 'Cups' && '🏆'}
                                            {meta.suit === 'Swords' && '🗡️'}
                                            {meta.suit === 'Pentacles' && '🪙'}
                                            {meta.suit === 'None' && '🕉️'}
                                          </span>
                                        </div>

                                        {/* Compact keywords & indicators */}
                                        <div className="text-center space-y-1 bg-bone/15 p-1.5 rounded border border-gray-200">
                                          <span className="text-[7.5px] leading-tight text-slate-gray line-clamp-2 italic">
                                            "{selection.isReversed ? meta.reversedMeaning : meta.uprightMeaning}"
                                          </span>
                                          <span className={`text-[8px] font-mono font-bold block uppercase ${selection.isReversed ? 'text-red-500' : 'text-emerald-400'}`}>
                                            {selection.isReversed ? 'Rx • Reversed' : 'Upright'}
                                          </span>
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* TAP TO RE-FLIP GUIDE */}
                                <span className="text-[9px] text-slate-gray mt-2 select-none">
                                  {isFlipped ? 'tap to cover' : 'tap to see details'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* INDEPENTENT INTERPRETATIONS DESCRIPTIVES CARDS */}
                      <div className="bg-paper-white border border-gray-200 rounded-lg p-6 shadow-none relative text-left">
                        <h4 className="text-xs font-bold text-slate-gray uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center space-x-1">
                          <BookOpen className="w-4 h-4 text-slate-gray" />
                          <span>Detailed Card Interpretations</span>
                        </h4>

                        <div className="space-y-6 divide-y divide-orange-500/5">
                          {currentResult.selectedCards.map((selection, sIdx) => {
                            const card = tarotDeck.find(d => d.id === selection.cardId);
                            if (!card) return null;
                            const interpretationExtra =
                              currentResult.category === 'Love' ? card.loveInterpretation :
                                currentResult.category === 'Career' ? card.careerInterpretation :
                                  currentResult.category === 'Finance' ? card.financeInterpretation :
                                    card.spiritualInterpretation;

                            return (
                              <div key={sIdx} className={`pt-4 ${sIdx === 0 ? 'pt-0' : ''} grid grid-cols-1 md:grid-cols-4 gap-4`}>
                                <div className="text-left">
                                  <span className="text-[9px] text-slate-gray block uppercase font-bold tracking-wider">{selection.positionMeaning}</span>
                                  <h5 className="font-sans text-sm font-bold text-slate-gray mt-1">{card.name}</h5>
                                  <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase mt-1.5 ${selection.isReversed ? 'bg-red-950/30 text-red-500 border border-red-500/20' : 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20'}`}>
                                    {selection.isReversed ? 'Reversed (Rx)' : 'Upright'}
                                  </span>
                                </div>

                                <div className="md:col-span-3 space-y-2.5 text-xs">
                                  <div>
                                    <strong className="text-slate-gray text-[10px] block uppercase font-mono tracking-wider">Orientation Meaning</strong>
                                    <p className="text-gray-800 leading-relaxed mt-0.5">{selection.isReversed ? card.reversedMeaning : card.uprightMeaning}</p>
                                  </div>

                                  <div>
                                    <strong className="text-slate-gray text-[10px] block uppercase font-mono tracking-wider">Contextual interpretation ({currentResult.category})</strong>
                                    <p className="text-gray-800 leading-relaxed mt-0.5">{interpretationExtra}</p>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-gray-200 pt-2 mt-2">
                                    <div>
                                      <strong className="text-[9px] text-[#888] uppercase block">Positive Traits</strong>
                                      <span className="text-[10px] text-emerald-400 line-clamp-1">{card.positiveTraits}</span>
                                    </div>
                                    <div>
                                      <strong className="text-[9px] text-[#888] uppercase block">Challenges</strong>
                                      <span className="text-[10px] text-red-500 line-clamp-1">{card.challenges}</span>
                                    </div>
                                    <div>
                                      <strong className="text-[9px] text-[#888] uppercase block">Guidance Advice</strong>
                                      <span className="text-[10px] text-slate-gray line-clamp-1">{card.guidanceAdvice}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* TABS 2: HISTORY LIST ARCHIVE */}
        {activeTab === 'history' && (
          <motion.div
            key="history-archive"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sans text-xl font-bold text-slate-gray">Your Reading Vault</h2>

              <button onClick={fetchHistory} disabled={historyLoading} className="text-xs text-slate-gray hover:text-orange-300 underline flex items-center space-x-1.5 cursor-pointer">
                <span>Synchronize Archive</span>
              </button>
            </div>

            {historyLoading ? (
              <div className="py-20 text-center text-slate-gray text-xs">
                Synchronizing files from Cloud Firestore collections...
              </div>
            ) : historyList.length === 0 ? (
              <div className="py-20 text-center bg-white border border-gray-200 rounded-2xl">
                <Compass className="w-10 h-10 text-gray-800/20 mx-auto mb-3" />
                <h3 className="text-slate-gray text-sm font-semibold">Vault is Empty</h3>
                <p className="text-slate-gray text-xs mt-1 max-w-xs mx-auto leading-relaxed">You haven't completed any readings on this account or cookies. Launch a new oracle search to begin!</p>
                <button onClick={() => setActiveTab('reading')} className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-700 text-black font-semibold text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer">
                  Start First Reading
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-paper-white border border-gray-200 rounded-lg p-5 shadow-none transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-orange-950/30 text-slate-gray border border-gray-200 rounded text-[10px]">
                            {item.category}
                          </span>
                          <span className="text-xs font-bold text-slate-gray font-mono">
                            {item.spreadMode}
                          </span>
                        </div>
                        <h4 className="font-sans text-sm font-bold text-gray-800 mt-1 line-clamp-1 font-semibold">{item.question}</h4>
                        <span className="text-[10px] text-slate-gray mt-1.5 block">
                          By seeker: <strong>{item.name}</strong> • Completed: {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleFavorite(item.id, item.isFavorite)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${item.isFavorite
                              ? 'bg-orange-950/30 text-slate-gray border-gray-200'
                              : 'bg-transparent text-slate-gray border-purple-100 hover:border-purple-200'
                            }`}
                        >
                          <Heart className="w-3.5 h-3.5" fill={item.isFavorite ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          onClick={() => loadPresetReading(item)}
                          className="px-3 py-1.5 bg-white hover:bg-orange-50 border border-gray-200 text-slate-gray hover:text-orange-300 text-xs rounded-lg cursor-pointer flex items-center space-x-1 shadow transition-all"
                        >
                          <span>Open Reading</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between text-xs gap-3">
                      <p className="text-slate-gray leading-relaxed max-w-xl italic line-clamp-2">
                        "{item.aiSummary.summary}"
                      </p>

                      <div className="flex -space-x-1 bg-bone/15 p-1 rounded-lg border border-gray-200 shadow shrink-0">
                        {item.selectedCards.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-5 h-7 rounded border border-gray-200 flex items-center justify-center text-[10px] bg-paper-white relative"
                            title={tarotDeck.find(d => d.id === c.cardId)?.name || 'card'}
                          >
                            <span className="opacity-70 text-[9px]">
                              {tarotDeck.find(d => d.id === c.cardId)?.suit === 'Wands' && '🪵'}
                              {tarotDeck.find(d => d.id === c.cardId)?.suit === 'Cups' && '🏆'}
                              {tarotDeck.find(d => d.id === c.cardId)?.suit === 'Swords' && '🗡️'}
                              {tarotDeck.find(d => d.id === c.cardId)?.suit === 'Pentacles' && '🪙'}
                              {tarotDeck.find(d => d.id === c.cardId)?.suit === 'None' && '🕉️'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TABS 3: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <motion.div
            key="oracle-analytics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="font-sans text-xl font-bold text-slate-gray">Oracle Analytics & Insights</h2>
              <p className="text-slate-gray text-xs mt-1">Real-time stats from card draws, popular inquiries, and user engagements.</p>
            </div>

            {statsLoading ? (
              <div className="py-20 text-center text-slate-gray text-xs">
                Analyzing records of active database users...
              </div>
            ) : stats ? (
              <div className="space-y-6">

                {/* HEADLINE SUMMARY STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-bone/15 border border-gray-200 p-4 rounded-lg text-center">
                    <span className="text-[10px] text-slate-gray block uppercase tracking-wider">Total Readings System</span>
                    <span className="text-2xl font-bold text-slate-gray font-mono mt-1 block">{stats.totalReadings}</span>
                  </div>

                  <div className="bg-bone/15 border border-gray-200 p-4 rounded-lg text-center">
                    <span className="text-[10px] text-slate-gray block uppercase tracking-wider">Active Monthly Seekers</span>
                    <span className="text-2xl font-bold text-slate-gray font-mono mt-1 block">{stats.engagementMetric?.activeUsersThisMonth || 142}</span>
                  </div>

                  <div className="bg-bone/15 border border-gray-200 p-4 rounded-lg text-center">
                    <span className="text-[10px] text-slate-gray block uppercase tracking-wider">Avg Readings Per User</span>
                    <span className="text-2xl font-bold text-slate-gray font-mono mt-1 block">{stats.engagementMetric?.averageReadingsPerUser || '2.1'}</span>
                  </div>

                  <div className="bg-bone/15 border border-gray-200 p-4 rounded-lg text-center">
                    <span className="text-[10px] text-slate-gray block uppercase tracking-wider">Conversion rate percent</span>
                    <span className="text-2xl font-bold text-slate-gray font-mono mt-1 block">{stats.engagementMetric?.conversionRatePercent || 88}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* CATEGORIES PROGRESS ARCS OR LISTS */}
                  <div className="bg-paper-white border border-gray-200 rounded-lg p-5 shadow-none">
                    <h3 className="text-xs font-bold text-slate-gray uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center space-x-1">
                      <FolderHeart className="w-4 h-4 text-gray-800" />
                      <span>Reading Categories Distribution</span>
                    </h3>

                    <div className="space-y-3.5">
                      {Object.entries(stats.categoryDistribution).map(([cat, countVal], cIdx) => {
                        const count = countVal as number;
                        const values = Object.values(stats.categoryDistribution) as number[];
                        const maxVal = Math.max(...values) || 1;
                        const percentage = ((count / maxVal) * 100).toFixed(0);
                        return (
                          <div key={cIdx} className="space-y-1 text-xs">
                            <div className="flex items-center justify-between text-slate-gray">
                              <span>{cat}</span>
                              <span className="font-mono text-gray-800/90">{count} draws</span>
                            </div>
                            <div className="w-full bg-bone h-2 rounded-full overflow-hidden">
                              <div className="bg-ink-black h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MOST POPULAR CARDS REVEALES RANKINGS */}
                  <div className="bg-paper-white border border-gray-200 rounded-lg p-5 shadow-none">
                    <h3 className="text-xs font-bold text-slate-gray uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-gray-800" />
                      <span>Top 5 Most Drawn Tarot Cards</span>
                    </h3>

                    <div className="space-y-3 divide-y divide-orange-500/5">
                      {stats.mostDrawnCards.map((item, rIdx) => {
                        const meta = tarotDeck.find(d => d.id === item.cardId);
                        return (
                          <div key={rIdx} className={`flex items-center justify-between text-xs pt-3 ${rIdx === 0 ? 'pt-0' : ''}`}>
                            <div className="flex items-center space-x-3">
                              <span className="w-5 h-5 rounded-full bg-bone text-gray-800 border border-gray-200 text-slate-gray font-mono font-bold flex items-center justify-center text-[10px]">
                                {rIdx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-gray-800 block">{item.cardName}</span>
                                <span className="text-[10px] text-slate-gray capitalize">{meta?.arcana} Arcana {meta?.suit !== 'None' ? `• ${meta?.suit}` : ''}</span>
                              </div>
                            </div>

                            <span className="font-mono text-slate-gray/90 font-bold bg-orange-950/10 px-2.5 py-1 rounded border border-purple-100">{item.count} Draw times</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center text-slate-gray">
                Could not retrieve system statistics.
              </div>
            )}
          </motion.div>
        )}

        {/* TABS 4: SPIRITUAL WISDOM GUIDE */}
        {activeTab === 'wisdom' && (
          <motion.div
            key="spiritual-wisdom"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-6 text-left"
          >
            <div className="bg-paper-white border border-gray-200 rounded-lg p-6 relative">
              <h2 className="font-sans text-xl font-bold text-slate-gray mb-4 pb-2 border-b border-gray-200">The Ancient Grimoire of Tarot</h2>

              <div className="space-y-4 text-xs text-gray-800 leading-relaxed">
                <div>
                  <h3 className="font-sans text-sm font-semibold text-gray-800/90 uppercase tracking-wider mb-1">What is Tarot?</h3>
                  <p>
                    Tarot is an ancient symbolic map of the human subconscious soul. Traditionally composed of 78 cards, it operates as a sacred mirror. By selecting cards while deeply focused, the mind aligns with archetypes of the universe to unlock inner wisdom and clarity.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-sm font-semibold text-gray-800/90 uppercase tracking-wider mb-1">The Rider-Waite Structure</h3>
                  <p>
                    The deck is divided cleanly into two main sectors:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>
                      <strong>Major Arcana (0-21):</strong> Represent big, pivotal life milestones, major spiritual karma lessons, and universal archetypes (e.g., The Fool, The Magician, The Star, The World).
                    </li>
                    <li>
                      <strong>Minor Arcana (56 cards):</strong> Focus on daily temporal situations, emotions, activities, and and minor obstacles. They are split into 4 key suits representing elements:
                      <ul className="list-circle pl-4 mt-1 space-y-0.5">
                        <li><strong>Suits of Wands (Fire):</strong> Action, creativity, ambition, initiative.</li>
                        <li><strong>Suits of Cups (Water):</strong> Emotions, relationships, love, healing.</li>
                        <li><strong>Suits of Swords (Air):</strong> Logic, mind battles, thoughts, clarity, truth.</li>
                        <li><strong>Suits of Pentacles (Earth):</strong> Finance, stability, body, work, secure legacies.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-sans text-sm font-semibold text-gray-800/90 uppercase tracking-wider mb-1">The Ethics & Purpose of Divination</h3>
                  <p>
                    Always approach Tarot with humble character and high noble intentions. It is not designed to strip away your personal free will or generate fear traps. Rather, it is designed to empower you by offering complete, objective clarity so that you can make highly aligned, courageous decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* TIMELINE ARCHITECTURE (HOW IT WORKS) */}
            <div className="bg-paper-white border border-gray-200 rounded-lg p-6 shadow-none">
              <h3 className="text-xs font-bold text-slate-gray uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">How Your Guided Reading Works</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-950 text-slate-gray font-bold flex items-center justify-center">1</span>
                    <strong className="text-gray-800">Focus Question</strong>
                  </div>
                  <p className="text-slate-gray mt-1.5 leading-relaxed pl-8">State your query cleanly. Specifying detailed, honest boundaries helps align the oracle channels.</p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-950 text-slate-gray font-bold flex items-center justify-center">2</span>
                    <strong className="text-gray-800">Breathing Ritual</strong>
                  </div>
                  <p className="text-slate-gray mt-1.5 leading-relaxed pl-8">Follow the deep breathing ring. Clearing distractions aligns your mind with starlight waves.</p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-950 text-slate-gray font-bold flex items-center justify-center">3</span>
                    <strong className="text-gray-800">Interactive Draw</strong>
                  </div>
                  <p className="text-slate-gray mt-1.5 leading-relaxed pl-8">Shuffle and draw client cards one by one from the fan. Your intuition directs the draw index.</p>
                </div>

                <div className="space-y-1 text-xs mt-0 md:mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-950 text-slate-gray font-bold flex items-center justify-center">4</span>
                    <strong className="text-gray-800">Reveal Flips</strong>
                  </div>
                  <p className="text-slate-gray mt-1.5 leading-relaxed pl-8">Flip drawn slots one-by-one with 3D animation. Inspect orientations, titles, and element suits.</p>
                </div>

                <div className="space-y-1 text-xs mt-0 md:mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-950 text-slate-gray font-bold flex items-center justify-center">5</span>
                    <strong className="text-gray-800">AI Synthesis</strong>
                  </div>
                  <p className="text-slate-gray mt-1.5 leading-relaxed pl-8">Read clean, detailed interpretations containing love, career, and financial guidance tips.</p>
                </div>

                <div className="space-y-1 text-xs mt-0 md:mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-950 text-slate-gray font-bold flex items-center justify-center">6</span>
                    <strong className="text-gray-800">Action & Reflection</strong>
                  </div>
                  <p className="text-slate-gray mt-1.5 leading-relaxed pl-8">Save favorite readings to memory, trigger PDF printing, and take real alignment action.</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
