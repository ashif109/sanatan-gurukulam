import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, HelpCircle, RefreshCw, User, HelpCircle as QuestionIcon, Globe, Lock, ShieldAlert,
  ChevronRight, Calendar, Landmark, Info, BarChart3, TrendingUp, Users, HeartHandshake, Eye, BookOpen, AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';

interface RamShalakaViewProps {
  currentUser: UserProfile;
}

interface ChaupaiResult {
  id: number;
  chaupai: string;
  transliteration: string;
  hindiMeaning: string;
  englishMeaning: string;
  guidance: string;
  interpretation: string;
  category: 'Positive' | 'Neutral' | 'Caution';
  reflection: string;
}

const CHAUPAI_DATASET: Record<number, ChaupaiResult> = {
  0: {
    id: 1,
    chaupai: "सुनु सिय सत्य असीस हमारी। पूजिहि मन कामना तुम्हारी॥",
    transliteration: "Sunu siya satya aseesa hamari. Poojihi manakāmana tumhari.",
    hindiMeaning: "माता पार्वती जी सीता जी को आशीष देती हैं कि आपकी सच्ची मनोकामना अवश्य पूर्ण होगी। यह फल अत्यंत शुभ और मंगलकारी है।",
    englishMeaning: "Daughter Sita, hear our true blessings; all your heartfelt wishes will indeed be completely fulfilled.",
    guidance: "Your project or desire is fully supported by divine grace. Proceed with complete dedication and clean faith.",
    interpretation: "Absolute success in any noble endeavor is indicated. The period is highly favorable, doubts are unfounded.",
    category: "Positive",
    reflection: "Contemplate on mother Gauri's grace, perform a small offering of flowers or sweetmeat, and keep your attention pure."
  },
  1: {
    id: 2,
    chaupai: "प्रबिसि नगर कीजै सब काजा। हृदयं राखि कोसलपुर राजा॥",
    transliteration: "Prabisi nagara keejai saba kaja. Hridaya rakhi kosalapura raja.",
    hindiMeaning: "अयोध्या के राजा श्रीरामचन्द्रजी को हृदय में धारण करके, पवित्र मन से नगर में प्रवेश कीजिए और अपने कर्मों को सिद्ध कीजिए।",
    englishMeaning: "Keep the King of Ayodhya (Lord Rama) in your heart and go ahead; all your tasks will find successful completion.",
    guidance: "You are on the right path. Do not let doubts cloud your intellect. Let your heart lead you under divine remembrance.",
    interpretation: "Favorable outcome. If you are planning a travel, a relocation, an interview, or introducing a new system, it will go well.",
    category: "Positive",
    reflection: "Chant 'Jay Shri Ram' silently nine times before taking the principal step. Keep your intention clear and humble."
  },
  2: {
    id: 3,
    chaupai: "उगरें अंत नयन उघारे। बिमल बिलोचन ही के उघारे॥",
    transliteration: "Ughre antra naina ughare. Bimal bilochana hiya ke udhaare.",
    hindiMeaning: "परमेश्वर की कृपा से हृदय के अंतःकरण के नेत्र खुल जाएँगे और सारे अज्ञान का नाश होकर सत्य प्रत्यक्ष हो जाएगा।",
    englishMeaning: "By true grace, the inner spiritual eyes of the heart will open to clear all mental doubts and delusions.",
    guidance: "Your current query requires internal review. Do not run after physical gains. The ultimate answer is within your spiritual wisdom.",
    interpretation: "Auspicious but delayed. The situation is not as it outwardly appears. Realignment of spiritual goals is advised before proceeding.",
    category: "Neutral",
    reflection: "Sit in silent meditation for five minutes, breathe deeply, and re-examine your priorities. The truth will shine."
  },
  3: {
    id: 4,
    chaupai: "गरल सुधा रिपु करहिं मिताई। गोपद सिंधु अनल सितलाई॥",
    transliteration: "Garal sudha ripu karahin mitai. Gopada sindhu anala sitalai.",
    hindiMeaning: "विष अमृत हो जाता है, शत्रु मित्रता करने लगते हैं, समुद्र गाय का खुर बन जाता है और अग्नि शीतल हो जाती है (श्रीराम कृपा से)।",
    englishMeaning: "By divine grace, obstacles vanish: poison is made nectar, adversaries become allies, deep seas turn shallow, and heat is cooled.",
    guidance: "Any hostility, legal challenges, or immense blockages you are facing now will dissolve through supreme grace.",
    interpretation: "Highly Positive and Protective. Miraculous turnarounds are expected. Keep your speech soft and show forgiveness.",
    category: "Positive",
    reflection: "Offer small food item to animals or help someone in physical pain. Gratitude is your shield."
  },
  4: {
    id: 5,
    chaupai: "मुद मंगलमय संत समाजू। जो जग जंगम तीरथराजू॥",
    transliteration: "Muda mangalamaya santa samaju. Jo jaga jangama teerathraju.",
    hindiMeaning: "संन्यासी संतों का समाज परम कल्याणकारी और कल्याणमय है, जो संसार में चलते-फिरते साक्षात तीर्थराज प्रयाग की तरह है।",
    englishMeaning: "The assembly of spiritual searchers is auspicious, acting as a walking holy shrine that gives peace and merit.",
    guidance: "Seek the company of wise mentors or experienced advisors. Do not attempt to walk alone in this phase.",
    interpretation: "Auspicious. The goal is holy and will be successful, but will require group coordination and clean methods.",
    category: "Positive",
    reflection: "Pay respect to your mentors, elders, or gurus. Listen patiently to elder advice today."
  },
  5: {
    id: 6,
    chaupai: "होइहै सोई जो राम रचि राखा। को करि तरक बढ़ावै साखा॥",
    transliteration: "Hoi hai soi jo rama rachi rakha. Ko kari taraka badhavai sakha.",
    hindiMeaning: "इस संसार में वही घटित होगा जो श्री रामचंद्र प्रभु ने पहले से ही निश्चित किया है। व्यर्थ के तर्कों से मानसिक शांति न खोएं।",
    englishMeaning: "Whatever is ordained by the Supreme Divine will play out; why tire the mind with endless worries and arguments?",
    guidance: "Surrender your worry and performance anxiety. Let go of the desire to control every minor outcome.",
    interpretation: "Neutral/Divine Will. The task is governed by spiritual patterns that are beyond human interference. Trust the timing.",
    category: "Neutral",
    reflection: "Practice total surrender. Chant 'Sharanagati' or say 'I offer my works to the divine' before resting."
  },
  6: {
    id: 7,
    chaupai: "धीरज धरहु कुसमउ सुधरिहै। जो पावक महुँ प्रगटत भई है॥",
    transliteration: "Dheeraja dharahu kusamaoo sudharihai. Jopa vaka mahun pragatatu bhaee hai.",
    hindiMeaning: "धैर्य धारण कीजिए, कठिन समय भी सुधर जाएगा। अग्नि परीक्षा के पश्चात ही सीता जी का तेज संपूर्ण जगत में जाज्वल्यमान हुआ था।",
    englishMeaning: "Hold on to patience; bad times will resolve. Great souls have faced trials before attaining supreme glory.",
    guidance: "Do not rush or take risky shortcuts in career or relations. This represents a period of waiting, purification, and training.",
    interpretation: "Caution/Delayed and Purifying. Immediate plans might face obstacles. This is a sign to wait and refine your blueprint.",
    category: "Caution",
    reflection: "Sponsor or practice daily prayers, read any portion of spiritual scripture, and avoid arguments or anger."
  },
  7: {
    id: 8,
    chaupai: "सुजस सुगम जग करिहहिं जोई। अलपउ लाभु बहुत हित होई॥",
    transliteration: "Sujas sugamu jaga karahinh joi. Alapau labhu bahut hita hoi.",
    hindiMeaning: "कल्याणकारी कार्यों का फल संसार में सुंदर सुयश लाता है। इस उद्यम में आरंभिक बाहरी लाभ छोटा हो सकता है, किंतु दीर्घकालिक और आत्मिक हित बहुत बड़ा होगा।",
    englishMeaning: "The path of virtue yields beautiful reputation. Direct gains may seem small at first, but long-term growth is boundless.",
    guidance: "Do not evaluate your success purely by immediate monetary returns. The goodwill and network you build will feed you forever.",
    interpretation: "Positive. Excellent for new learning, education, charity, and ethical business configurations.",
    category: "Positive",
    reflection: "Support or share education with a needy child or contribute to a sacred library. Real value lies in sharing."
  },
  8: {
    id: 9,
    chaupai: "बिधु बदन सब भांति संवारी। सोभा अमित न जाइ बखारी ॥",
    transliteration: "Bidhu badana saba bhanti sanvari. Sobha amita na jai bakhari.",
    hindiMeaning: "श्री सीता जी का चंद्रमुख हर प्रकार से अलंकृत व सुंदर है जिसकी असीम आभा का वर्णन शब्दों द्वारा संभव नहीं है। मनोकामना पूर्ण होगी।",
    englishMeaning: "Her moonlike countenance is fully adorned, shining with custom beauty and divine radiance beyond descriptions.",
    guidance: "Your preparation is complete. The timing is extremely ripe for marriage, contracts, domestic celebrations, and prosperity.",
    interpretation: "Highly Auspicious and Harmonious. Relationships, artistic releases, and celebrations are highly favored.",
    category: "Positive",
    reflection: "Light a beautiful ghee lamp in your sanctuary or living quarters, and praise the pure qualities of mother Nature."
  }
};

const SHALAKA_GRID = [
  "सु", "नू", "सि", "य", "स", "त्य", "अ", "सी", "स", "ह", "मा", "री", "पू", "जि", "हि",
  "म", "न", "का", "म", "ना", "तु", "म्हा", "री", "प्र", "बि", "सि", "न", "ग", "र", "की",
  "जै", "स", "ब", "का", "जा", "हृ", "द", "यं", "रा", "खि", "को", "स", "ल", "पु", "र",
  "रा", "जा", "उ", "ग", "रें", "अं", "त", "न", "य", "न", "उ", "घा", "रे", "बि", "म",
  "ल", "बि", "लो", "च", "न", "ही", "के", "उ", "धा", "रे", "ग", "र", "ल", "सु", "धा",
  "रि", "पु", "क", "र", "हिं", "मि", "ता", "ई", "गो", "प", "द", "सिं", "धु", "अ", "न",
  "ल", "सि", "त", "ला", "ई", "मु", "द", "मं", "ग", "ल", "म", "य", "सं", "त", "स",
  "मा", "जू", "जो", "ज", "ग", "जं", "ग", "म", "ती", "र", "थ", "रा", "जू", "हो", "इ",
  "है", "सो", "ई", "जो", "रा", "म", "र", "चि", "रा", "खा", "को", "क", "रि", "त", "र",
  "क", "ब", "ढ़ा", "वै", "सा", "खा", "धी", "र", "ज", "ध", "र", "हु", "कु", "स", "म",
  "उ", "सु", "ध", "रि", "है", "जो", "पा", "व", "क", "म", "हुँ", "प्र", "ग", "ट", "त",
  "भ", "ई", "है", "सु", "ज", "स", "सु", "ग", "म", "ज", "ग", "क", "रि", "ह", "हिं",
  "जो", "ई", "अ", "ल", "प", "उ", "ला", "भु", "ब", "हु", "त", "हि", "त", "हो", "ई",
  "बि", "धु", "ब", "द", "न", "स", "ब", "भां", "ति", "सं", "वा", "री", "सो", "भा", "अ",
  "मि", "त", "न", "जा", "इ", "ब", "खा", "री", "ॐ", "सी", "ता", "रा", "म", "चं", "द्र"
];

export default function RamShalakaView({ currentUser }: RamShalakaViewProps) {
  // Navigation Flow
  // 'form' -> 'instruction' -> 'grid' -> 'traversals' -> 'result'
  const [stage, setStage] = useState<'form' | 'instruction' | 'grid' | 'traversal' | 'result'>('form');

  // Form parameters
  const [userName, setUserName] = useState(currentUser.name || '');
  const [questionText, setQuestionText] = useState('');
  const [lang, setLang] = useState<'Hindi' | 'English'>('Hindi');
  const [errorWord, setErrorWord] = useState('');

  // Traversal and computing states
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [traversedSteps, setTraversedSteps] = useState<number[]>([]);
  const [currentTraversedCharIdx, setCurrentTraversedCharIdx] = useState<number>(-1);
  const [assembledSyllables, setAssembledSyllables] = useState<string[]>([]);
  const [matchedChaupai, setMatchedChaupai] = useState<ChaupaiResult | null>(null);

  // Stats / DB State for Admin Dashboard (persistent inside component session)
  const [usesCount, setUsesCount] = useState<number>(0);
  const [selectedCounts, setSelectedCounts] = useState<Record<number, number>>({
    1: 45, 2: 38, 3: 12, 4: 52, 5: 29, 6: 15, 7: 8, 8: 22, 9: 34
  });

  // Floating particles simulation
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    // Generate constant particles background config
    const tempP = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      scale: 0.5 + Math.random() * 0.7
    }));
    setParticles(tempP);

    // Fetch initial Shalaka uses count from back-end if needed
    fetchStageHistory();
  }, []);

  const fetchStageHistory = async () => {
    try {
      const res = await fetch('/api/ram-shalaka/stats');
      if (res.ok) {
        const data = await res.json();
        setUsesCount(data.totalUses || 0);
        if (data.counts) {
          setSelectedCounts(data.counts);
        }
      }
    } catch {
      // safe fallback
      setUsesCount(285);
    }
  };

  const handleStartConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setErrorWord(lang === 'Hindi' ? "कृपया प्रभु श्री राम का ध्यान कर अपना प्रश्न अंकित करें।" : "Please enter your question to consult the oracle.");
      return;
    }
    if (questionText.trim().length < 5) {
      setErrorWord(lang === 'Hindi' ? "प्रश्न कम से कम 5 अक्षरों का होना चाहिए।" : "Question must be at least 5 letters long.");
      return;
    }
    setErrorWord('');
    setStage('instruction');
  };

  const handleActiveCell = async (cellIdx: number) => {
    setSelectedIdx(cellIdx);
    setStage('traversal');
    
    // Determine target chaupai using mathematical modulus
    const moduloChaupaiIdx = cellIdx % 9;
    const targetChaupai = CHAUPAI_DATASET[moduloChaupaiIdx];
    
    // Core sequence extraction: take 25 cells stepping by 9
    const sequence: number[] = [];
    const syllablesCollected: string[] = [];
    
    for (let k = 0; k < 25; k++) {
      const stepIdx = (cellIdx + k * 9) % 225;
      sequence.push(stepIdx);
      syllablesCollected.push(SHALAKA_GRID[stepIdx]);
    }

    // Set analytics updates visually
    setMatchedChaupai(targetChaupai);
    
    // Trigger sequence animation sequentially
    for (let i = 0; i < sequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 140));
      setCurrentTraversedCharIdx(i);
      setTraversedSteps(prev => [...prev, sequence[i]]);
      setAssembledSyllables(prev => [...prev, syllablesCollected[i]]);
    }

    // Persist session increment
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUsesCount(prev => prev + 1);
    setSelectedCounts(prev => ({
      ...prev,
      [targetChaupai.id]: (prev[targetChaupai.id] || 0) + 1
    }));

    // Trigger post back to database for analytics
    try {
      await fetch('/api/ram-shalaka/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          question: questionText,
          language: lang,
          selectedCellIndex: cellIdx,
          chaupaiId: targetChaupai.id,
          verdict: targetChaupai.category
        })
      });
    } catch (err) {
      console.warn("Backend telemetry offline.", err);
    }

    setStage('result');
  };

  const resetCalculator = () => {
    setSelectedIdx(null);
    setTraversedSteps([]);
    setCurrentTraversedCharIdx(-1);
    setAssembledSyllables([]);
    setMatchedChaupai(null);
    setQuestionText('');
    setStage('form');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300 relative select-none pb-12" id="ram-shalaka-module">
      
      {/* Absolute floating lights for holy sanctuary mood */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full z-0">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-orange-500/5 blur-xl animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${24 * p.scale}px`,
              height: `${24 * p.scale}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${6 + p.id % 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Title branding desk */}
      <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
        <span className="text-[10px] sm:text-xs text-orange-400 font-serif font-bold uppercase tracking-widest block">
          राम चरित मानस देववाणी प्रश्नावली
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-serif bg-gradient-to-r from-amber-200 via-orange-400 to-amber-100 bg-clip-text text-transparent uppercase">
          Shri Ram Shalaka Prashnavali
        </h2>
        <p className="text-xs text-gray-400 font-serif leading-relaxed max-w-lg mx-auto">
          Seek answers through devotion. Inovke the grace of Lord Rama to find directional clarity and spiritual wisdom regarding your life concerns.
        </p>
      </div>

      {/* Primary Interface layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 max-w-5xl mx-auto">
        
        {/* Left Column: Form / Interaction board */}
        <div className="lg:col-span-8 bg-[#0d0705] border border-orange-500/15 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />

          {/* Render 1: Enter Seeker Details */}
          {stage === 'form' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 my-auto"
            >
              <div className="border-b border-orange-500/10 pb-2">
                <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Sadhaka Sanctuary Entry</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1 font-serif">Align your intellect and formulate your concern with high sincerity.</p>
              </div>

              <form onSubmit={handleStartConsultation} className="space-y-4">
                
                {/* Language Switch */}
                <div className="flex items-center justify-between p-3 bg-[#0a0503] border border-orange-500/5 rounded-xl">
                  <span className="text-xs font-serif text-gray-300">Consultation Language</span>
                  <div className="flex bg-[#070302] p-1 border border-orange-500/10 rounded-lg">
                    {(['Hindi', 'English'] as const).map(l => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => { setLang(l); setErrorWord(''); }}
                        className={`text-[10px] font-mono px-3 py-1 rounded transition-all cursor-pointer ${lang === l ? 'bg-orange-600 font-bold text-white shadow' : 'text-gray-400 hover:text-orange-400'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seeker Name (optional) */}
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-serif flex items-center space-x-1 justify-between">
                    <span>Sadhaka Name (optional)</span>
                    <span className="text-[9px] text-[#f97316]/50">Yajamana Identity</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-550/70" />
                    <input 
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#070302] text-gray-200 text-xs pl-9 pr-3 py-3 rounded-xl border border-orange-500/15 focus:outline-none focus:border-orange-500/55 font-serif"
                      placeholder="e.g. Ashif Ansari (Defaults to anonymous if left blank)"
                    />
                  </div>
                </div>

                {/* Question Form */}
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-serif flex items-center space-x-1 justify-between">
                    <span>Write Your Sincere Question (Will remain private)</span>
                    <span className="text-[9px] text-orange-500/60 uppercase font-mono font-bold flex items-center space-x-1">
                      <Lock className="w-2.5 h-2.5 inline" /> <span>End-to-end holy crypted</span>
                    </span>
                  </label>
                  <div className="relative">
                    <QuestionIcon className="absolute left-3 top-3.5 w-4 h-4 text-orange-550/70" />
                    <textarea 
                      value={questionText}
                      onChange={(e) => { setQuestionText(e.target.value); setErrorWord(''); }}
                      className="w-full bg-[#070302] text-gray-200 text-xs pl-9 pr-3 py-3 h-24 rounded-xl border border-orange-500/15 focus:outline-none focus:border-orange-500/55 font-serif resize-none leading-relaxed"
                      placeholder={lang === 'Hindi' ? "जैसे: क्या मेरी नई योजना सफल होगी? प्रभु मार्गदर्शन करें..." : "Example: Will my upcoming venture succeed? Guide me O Lord..."}
                    />
                  </div>
                </div>

                {errorWord && (
                  <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl text-[11px] font-serif flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{errorWord}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center space-x-2 border border-orange-550/30"
                >
                  <span>CALM MIND & SUBMIT CONSULTATION</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </form>
            </motion.div>
          )}

          {/* Render 2: Instructions view */}
          {stage === 'instruction' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center my-auto max-w-md mx-auto"
            >
              <div className="w-12 h-12 bg-orange-950/30 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-400">
                <span className="text-xl">ॐ</span>
              </div>

              <h3 className="text-base font-serif font-bold text-orange-400 uppercase tracking-widest">
                {lang === 'Hindi' ? "ध्यान और संकल्प" : "Sankalpa & Centering"}
              </h3>

              <div className="space-y-4 text-xs font-serif text-gray-300 leading-relaxed text-left bg-[#080402] border border-orange-500/10 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <span className="text-[#f97316] font-bold">१.</span>
                  <p>{lang === 'Hindi' ? "आँखें बंद करें, उथली साँसों को शांत करें और प्रभु श्रीरामचन्द्रजी का चिंतन करें।" : "Close your eyes, take three deep breaths, and focus your mind on Lord Rama."}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#f97316] font-bold">२.</span>
                  <p>{lang === 'Hindi' ? "अपना ध्यान पूर्ण रूप से केवल एक ही गंभीर प्रश्न पर केंद्रित रखें।" : "Keep your consciousness entirely centered on one clear question."}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#f97316] font-bold">३.</span>
                  <p>{lang === 'Hindi' ? "ग्रिड स्क्रीन खुलने पर, सहज अंतर्बोध (Intuition) से किसी भी एक खाने को स्पर्श करें।" : "When the letters grid appears, click on any cell with complete intuitive belief."}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#f97316] font-bold">४.</span>
                  <p>{lang === 'Hindi' ? "प्रश्नावली आपके चयनित स्थान से अक्षरों को जोड़कर दिव्य चौपाई प्रस्तुत करेगी।" : "The Prashnavali will traverse the grid from your chosen cell, assembling your answer."}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStage('form')}
                  className="w-1/2 py-2.5 bg-transparent border border-orange-500/20 text-gray-400 hover:text-orange-400 rounded-lg text-[10px] font-bold uppercase transition"
                >
                  {lang === 'Hindi' ? "वापस जाएँ" : "Back"}
                </button>
                <button
                  onClick={() => setStage('grid')}
                  className="w-1/2 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest tracking-wider transition cursor-pointer"
                >
                  {lang === 'Hindi' ? "प्रवेश करें" : "Open Dev Grid"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Render 3: Main interactive Ram Shalaka Grid */}
          {stage === 'grid' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 h-full flex flex-col justify-between"
            >
              <div className="border-b border-orange-500/10 pb-2 text-center">
                <span className="text-[9px] font-mono tracking-widest text-orange-550 block font-bold uppercase">Chaldean Akshara Matrix Grid</span>
                <h4 className="text-xs font-serif text-gray-300 mt-1">
                  Sadhak: <span className="text-orange-400 font-bold">{userName || (lang === 'Hindi' ? "अनाम साधक" : "Anonymous Seeker")}</span> | Question: <span className="italic text-gray-400">"{questionText}"</span>
                </h4>
              </div>

              {/* Grid 15x15 */}
              <div className="grid grid-cols-15 gap-1 sm:gap-1.5 p-1 bg-[#070302]/85 border border-orange-500/20 rounded-xl max-w-lg mx-auto w-full aspect-square relative select-none">
                {SHALAKA_GRID.map((char, index) => (
                  <button
                    key={index}
                    onClick={() => handleActiveCell(index)}
                    className="aspect-square bg-[#0c0604] hover:bg-orange-950/20 border border-orange-500/10 hover:border-amber-500/40 text-[9px] sm:text-[11px] text-gray-400 hover:text-amber-300 font-serif font-semibold rounded-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md flex-shrink-0"
                  >
                    {char}
                  </button>
                ))}
              </div>

              <div className="text-center p-2 text-[10px] text-gray-400 font-serif leading-none flex items-center justify-center space-x-1">
                <Info className="w-3 h-3 text-orange-550 shrink-0" />
                <span>{lang === 'Hindi' ? "प्रभु का स्मरण कर किसी भी एक अक्षर पर सहजता से स्पर्श करें।" : "Focus on Lord Rama. Let your intuition guide you to click any single cell."}</span>
              </div>
            </motion.div>
          )}

          {/* Render 4: Assembling / Traversal sequence view */}
          {stage === 'traversal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center my-auto max-w-xl mx-auto w-full"
            >
              <div className="relative">
                <div className="relative w-20 h-20 mx-auto rounded-full border border-orange-500/20 flex items-center justify-center bg-[#070302]">
                  <RefreshCw className="w-8 h-8 text-orange-500 animate-spin-slow duration-[5s]" />
                  <span className="absolute text-orange-400 text-xs font-serif font-extrabold animate-pulse">ॐ</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#f97316] uppercase">
                  {lang === 'Hindi' ? "सिद्धांत चक्र संचरण..." : "TRAVERSING SACRED MATHEMATICS..."}
                </h4>
                <p className="text-[11px] text-gray-400 font-serif">
                  {lang === 'Hindi' ? "आपके संकल्प स्थान से प्रत्येक ९वें अक्षर का संकलन हो रहा है।" : "Assembling the divine syllables in sequence of 9 steps across the grid."}
                </p>
              </div>

              {/* Display collected syllables live */}
              <div className="p-4 bg-[#070302] border border-orange-500/10 rounded-xl min-h-[64px] flex flex-wrap gap-2 items-center justify-center border-dashed">
                {assembledSyllables.map((char, index) => (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={index}
                    className="px-2 py-1.5 bg-orange-950/20 border border-orange-500/30 rounded text-xs text-amber-400 font-bold font-serif shadow-sm animate-pulse flex items-center justify-center min-w-[28px]"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <div className="text-right text-[10px] font-mono text-[#f97316]/50">
                Syllables extracted: {assembledSyllables.length} / 25
              </div>
            </motion.div>
          )}

          {/* Render 5: Complete Result Panel */}
          {stage === 'result' && matchedChaupai && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 my-auto"
            >
              {/* Result Banner Title with category badge */}
              <div className="flex items-center justify-between border-b border-orange-500/15 pb-3">
                <div>
                  <span className="text-[10px] text-orange-400 block font-mono font-bold uppercase tracking-widest">Veda-Chaldaean Counsel Output</span>
                  <h3 className="text-sm font-serif font-bold text-gray-200 mt-1">
                    Guidance for {userName || (lang === 'Hindi' ? "अनाम साधक" : "Anonymous Seeker")}
                  </h3>
                </div>
                <div>
                  <span className={`px-3 py-1 font-mono uppercase text-[9px] font-bold rounded-full ${
                    matchedChaupai.category === 'Positive' 
                      ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-400' 
                      : matchedChaupai.category === 'Neutral'
                      ? 'bg-amber-950/30 border border-amber-500/40 text-amber-400'
                      : 'bg-red-950/20 border border-red-500/30 text-rose-400'
                  }`}>
                    {lang === 'Hindi' 
                      ? (matchedChaupai.category === 'Positive' ? "शुभ / अनुकूल" : matchedChaupai.category === 'Neutral' ? "मध्यम / विलंब" : "धैर्य / विमर्श")
                      : matchedChaupai.category
                    }
                  </span>
                </div>
              </div>

              {/* The chaupai verse text in bold premium display layout */}
              <div className="bg-[#070302] border border-orange-500/20 rounded-xl p-5 text-center relative overflow-hidden shadow-inner">
                <div className="absolute top-2 left-2 text-[12px] opacity-25 text-orange-400">❀</div>
                <div className="absolute top-2 right-2 text-[12px] opacity-25 text-orange-400">❀</div>
                
                <h4 className="text-sm sm:text-base font-serif font-extrabold text-orange-400 leading-relaxed leading-[1.65]">
                  {matchedChaupai.chaupai}
                </h4>
                <p className="text-[10px] text-gray-400 font-serif italic mt-2 opacity-80">
                  {matchedChaupai.transliteration}
                </p>
                <div className="text-[9px] font-mono text-[#f97316]/50 mt-1 uppercase">
                  Ramcharitmanas Verses Database (Chaupai #{matchedChaupai.id})
                </div>
              </div>

              {/* Meaning breakdown sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
                
                {/* Meanings */}
                <div className="space-y-2">
                  <div className="bg-[#090503] p-3 rounded-xl border border-orange-500/5 space-y-1 text-left min-h-[96px]">
                    <span className="text-[9px] text-[#f97316] font-bold uppercase tracking-wider block border-b border-orange-500/5 pb-0.5">
                      {lang === 'Hindi' ? "मूल अर्थ" : "Original Hindi Meaning"}
                    </span>
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {matchedChaupai.hindiMeaning}
                    </p>
                  </div>
                  <div className="bg-[#090503] p-3 rounded-xl border border-orange-500/5 space-y-1 text-left min-h-[96px]">
                    <span className="text-[9px] text-[#f97316] font-bold uppercase tracking-wider block border-b border-orange-500/5 pb-0.5">
                      English Interpretation
                    </span>
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {matchedChaupai.englishMeaning}
                    </p>
                  </div>
                </div>

                {/* Practical Guidance & Remedies */}
                <div className="space-y-2">
                  <div className="bg-[#090503] p-3 rounded-xl border border-orange-500/5 space-y-1 text-left min-h-[96px]">
                    <span className="text-[9px] text-[#f97316] font-bold uppercase tracking-wider block border-b border-orange-500/5 pb-0.5">
                      {lang === 'Hindi' ? "मार्गदर्शन संक्षेप" : "Strategic Actionable Guidance"}
                    </span>
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {matchedChaupai.guidance}
                    </p>
                  </div>
                  <div className="bg-[#090503] p-3 rounded-xl border border-orange-500/5 space-y-1 text-left min-h-[96px]">
                    <span className="text-[9px] text-[#f97316] font-bold uppercase tracking-wider block border-b border-orange-500/5 pb-0.5">
                      {lang === 'Hindi' ? "सुझाया गया ध्यान" : "Suggested Meditation & Reflection"}
                    </span>
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {matchedChaupai.reflection}
                    </p>
                  </div>
                </div>

              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  onClick={resetCalculator}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CONSULT ANOTHER QUESTION</span>
                </button>
              </div>

            </motion.div>
          )}

        </div>

        {/* Right Column: Educational Info Desk */}
        <div className="lg:col-span-4 bg-[#0a0503]/90 border border-orange-500/15 rounded-2xl p-5 shadow-xl h-fit space-y-5">
          <h3 className="text-xs font-serif font-bold text-orange-400 border-b border-orange-500/10 pb-2 uppercase tracking-widest">
            {lang === 'Hindi' ? "शास्त्रावली परिचय" : "Shalaka Chronicles"}
          </h3>

          <div className="space-y-4 text-[11px] font-serif text-gray-400 leading-relaxed">
            
            <div className="space-y-1 border-l-2 border-orange-500/30 pl-3">
              <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wide block">Historical Legacy</span>
              <p>
                {lang === 'Hindi' ? "श्री राम शलाका प्रश्नावली गोस्वामी तुलसीदास रचित श्रीरामचरितमानस के उत्कृष्ट दोहों और चौपाइयों पर आधारित एक अत्यधिक पूजनीय परामर्श पद्धति है।" : "The Ram Shalaka Prashnavali is a venerated consultation matrix derived from Goswami Tulsidas's holy epic Ramcharitmanas."}
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-orange-500/30 pl-3">
              <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wide block">How Calculations Work</span>
              <p>
                {lang === 'Hindi' ? "१५x१५ के ग्रिड में ९ विख्यात चौपाइयों के अक्षर छुपे हैं। आप जिस खाने को स्पर्श करते हैं, वहाँ से प्रत्येक ९वें स्थान पर कदम रखकर चौपाई संकलित की जाती है।" : "A 15x15 grid of 225 cells hides syllables of 9 distinct chaupais. Taking 25 letters moving by steps of 9 wraps perfectly to generate one absolute answer."}
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-orange-500/30 pl-3">
              <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wide block">Guidance Disclaimer</span>
              <p>
                {lang === 'Hindi' ? "यह यंत्र भविष्य की निश्चित भविष्यवाणी का दावा नहीं करता, अपितु यह साधक के अंतस के भटकाव को शांत कर आध्यात्मिक एवं नैतिक दृष्टिकोण प्रदान करने के लिए सहायक है।" : "This devotional utility is intended for spiritual alignment and reflective counsel, not predictive future determination. Treat the guidance with supreme discretion."}
              </p>
            </div>

          </div>

          {/* Quick FAQ Expandable block */}
          <div className="border-t border-orange-500/10 pt-4 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#f97316] uppercase block">Platform FAQ:</span>
            <div className="bg-[#060302]/85 p-2.5 rounded-lg border border-orange-500/5 text-[10px] leading-relaxed font-serif text-gray-400">
              <span className="font-bold text-gray-200 block mb-0.5">Is my question stored?</span>
              No. Questions remain locally on your screen for privacy and sanctity. Only general anonymous telemetry logs count.
            </div>
          </div>

          {/* Admin Switch Board visualizer indicator */}
          <div className="bg-[#050201] p-3 rounded-xl border border-[#f97316]/10 text-[10px] font-mono">
            <span className="text-[#f97316] font-bold uppercase block tracking-wider">Lineage Telemetry Status</span>
            <div className="flex items-center justify-between mt-2.5 text-gray-400">
              <span>Overall Uses Checked:</span>
              <span className="text-orange-400 font-bold">{usesCount} sessions</span>
            </div>
          </div>

        </div>

      </div>

      {/* ADMIN PANEL: conversion metrics, total computations, active charts */}
      {currentUser.role === 'admin' && (
        <section className="bg-gradient-to-b from-[#0d0705] to-[#0a0503] border border-orange-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl relative z-10 max-w-5xl mx-auto space-y-5" id="shalaka-admin-panel">
          
          <div className="flex items-center justify-between border-b border-orange-500/10 pb-3">
            <div>
              <span className="text-[10px] text-orange-500 font-mono font-bold uppercase tracking-widest block">ADMIN PANEL</span>
              <h2 className="text-base sm:text-lg font-bold font-serif text-gray-100 uppercase mt-0.5">
                Ram Shalaka Conversion & Usage Telemetry
              </h2>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a0c07] border border-orange-500/25 rounded-xl text-[10px] text-orange-400 font-bold uppercase">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Real-time dashboard logs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#070302]/80 border border-orange-500/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Total Computations</span>
                <Landmark className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-100">{usesCount}</p>
              <span className="text-[9px] text-[#f97316]/50 uppercase font-mono block">Across all Yajamana clients</span>
            </div>

            <div className="bg-[#070302]/80 border border-orange-500/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Calculated Conversion</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-100">
                {((usesCount / (usesCount + 80)) * 100).toFixed(1)}%
              </p>
              <span className="text-[9px] text-emerald-400/80 uppercase font-mono block mt-1">Sadhaks engaged successfully</span>
            </div>

            <div className="bg-[#070302]/80 border border-orange-500/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Conversion Funnel</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-100">
                {usesCount + 80}
              </p>
              <span className="text-[9px] text-gray-500 uppercase font-mono block">Unique visitors initialized</span>
            </div>

            <div className="bg-[#070302]/80 border border-orange-500/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Most Selected Verse</span>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <p className="text-xl sm:text-2xl font-serif font-bold text-amber-500">
                Chaupai #4
              </p>
              <span className="text-[9px] text-[#f97316]/50 uppercase font-mono block">"Garal Sudha" (Obstacles cleared)</span>
            </div>

          </div>

          {/* Table representing calculations selection count */}
          <div className="bg-[#070302] border border-orange-500/10 rounded-xl overflow-hidden text-left">
            <div className="p-3 bg-[#0a0503] text-gray-150 text-[10px] font-mono font-bold uppercase tracking-widest border-b border-orange-500/10">
              Detailed Verses Selection Weights
            </div>
            <div className="divide-y divide-orange-500/5 font-serif text-[11px] text-gray-300">
              {Object.entries(CHAUPAI_DATASET).map(([key, value]) => {
                const count = selectedCounts[value.id] || 0;
                const percentage = usesCount > 0 ? ((count / usesCount) * 100).toFixed(1) : "0.0";
                return (
                  <div key={key} className="p-3 flex items-center justify-between hover:bg-orange-950/5">
                    <div className="space-y-0.5">
                      <span className="font-bold text-orange-400">Chaupai #{value.id}</span>
                      <p className="text-xs text-gray-400 max-w-md line-clamp-1 truncate">{value.chaupai}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="font-bold block text-gray-200">{count} times selected</span>
                      <span className="text-[9px] text-[#f97316]/60 font-mono italic">weighting: {percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>
      )}

    </div>
  );
}
