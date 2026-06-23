import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { 
  Sparkles, Calculator, Calendar, User, Heart, Briefcase, 
  DollarSign, Activity, Award, BarChart2, Smartphone, Car, 
  BookOpen, Compass, ChevronRight, Lock, CheckCircle, RefreshCw, 
  HelpCircle, ShieldAlert, Layers, Key
} from 'lucide-react';
import { 
  KNOWLEDGE_BASE, 
  calculateLifePathNumber, 
  calculateBirthNumber, 
  calculateDestinyNumber, 
  calculateSoulUrgeNumber, 
  calculatePersonalityNumber, 
  calculateExpressionNumber,
  checkNumerologyCompatibility,
  assessBusinessName,
  analyzeMobileNumber,
  analyzeVehicleNumber
} from '../utils/numerologyEngine';

// Validation schema using Zod
const numerologyInputSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dob: z.string().nonempty({ message: "Date of Birth is required." }),
  gender: z.string().optional(),
  email: z.string().email({ message: "Invalid email structure." }).or(z.literal('')),
  phone: z.string().or(z.literal(''))
});

type NumerologyInputData = z.infer<typeof numerologyInputSchema>;

const PLANETARY_RULERS: Record<number, { planet: string; deity: string; metal: string; element: string; power: string; mantra: string }> = {
  1: { planet: "Surya (Sun)", deity: "Agni / Rama", metal: "Copper / Gold", element: "Fire", power: "Willpower, Authority, Vitality & Ego alignment", mantra: "Om Hram Hreem Hroum Sah Suryaya Namah" },
  2: { planet: "Chandra (Moon)", deity: "Parvati / Shiva", metal: "Silver", element: "Water", power: "Subconscious mind, Intuition, Emotions & Peace", mantra: "Om Shram Shreem Shroum Sah Somaya Namah" },
  3: { planet: "Guru (Jupiter)", deity: "Vishnu / Indra", metal: "Gold / Brass", element: "Ether / Space", power: "Spiritual Wisdom, Expansion, Teaching & Fortune", mantra: "Om Gram Greem Groum Sah Gurave Namah" },
  4: { planet: "Rahu (North Node)", deity: "Durga", metal: "Lead / Bronze", element: "Air", power: "Sudden innovation, Out-of-the-box ideas & Destiny shifts", mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah" },
  5: { planet: "Budh (Mercury)", deity: "Vishnu", metal: "Alloys / Bronze", element: "Earth", power: "Intellect, Communication, Speech & Trade dexterity", mantra: "Om Bram Breem Broum Sah Budhaya Namah" },
  6: { planet: "Shukra (Venus)", deity: "Lakshmi", metal: "Silver / White Gold", element: "Water", power: "Luxury, Aesthetics, Romance, Art & Healing", mantra: "Om Dram Dreem Droum Sah Shukraya Namah" },
  7: { planet: "Ketu (South Node)", deity: "Ganesha", metal: "Iron", element: "Universal", power: "Renunciation, Introspection, Occult studies & Release", mantra: "Om Sram Sreem Sroum Sah Ketave Namah" },
  8: { planet: "Shani (Saturn)", deity: "Shiva / Yama", metal: "Iron / Steel", element: "Earth / Air", power: "Karma, Endurance, Structure, Service & Patience", mantra: "Om Pram Preem Proum Sah Shanaishcharaya Namah" },
  9: { planet: "Mangal (Mars)", deity: "Hanuman / Kartikeya", metal: "Copper", element: "Fire", power: "Courage, Physical vitality, Protection & Action", mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah" },
  11: { planet: "Cosmic Channel (Master 11)", deity: "Uranus", metal: "White Gold", element: "Spirit", power: "Intuitive illumination & prophetic catalyst", mantra: "Om Hreem Chandraya Namah" },
  22: { planet: "Master Builder (Master 22)", deity: "Saraswati", metal: "Bronze", element: "Earth", power: "Materializing large global visions into solid structures", mantra: "Om Shreem Mahalakshmyei Namah" },
  33: { planet: "Universal Devoted (Master 33)", deity: "Shiva-Shakti", metal: "Pure Gold", element: "Heart", power: "Selfless spiritual teaching & healing caretaking", mantra: "Om Namah Shivaya" }
};

const extractSectionText = (text: string, titleKeywords: string[]): string => {
  if (!text) return '';
  const lines = text.split('\n');
  let currentSectionLines: string[] = [];
  let recording = false;
  
  for (const line of lines) {
    if (line.trim().startsWith('###') || line.trim().startsWith('##')) {
      const lowerLine = line.toLowerCase();
      const matchesKeyword = titleKeywords.some(keyword => lowerLine.includes(keyword.toLowerCase()));
      if (matchesKeyword) {
        recording = true;
        continue;
      } else if (recording) {
        recording = false;
      }
    }
    
    if (recording) {
      currentSectionLines.push(line);
    }
  }
  
  return currentSectionLines.join('\n').trim();
};

const parseMarkdownContent = (text: string) => {
  if (!text) return null;
  const blocks = text.split('\n\n');
  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        const tBlock = block.trim();
        if (!tBlock) return null;
        if (tBlock.startsWith('###') || tBlock.startsWith('##')) {
          return (
            <h5 key={idx} className="text-orange-400 font-serif font-bold text-xs uppercase tracking-wide border-l border-orange-500/30 pl-2 py-0.5 mt-4 mb-2">
              {tBlock.replace(/^###*\s*/, '')}
            </h5>
          );
        }
        if (tBlock.startsWith('*') || tBlock.startsWith('-')) {
          return (
            <ul key={idx} className="space-y-1.5 pl-4 list-disc text-gray-300 text-[11px] leading-relaxed">
              {tBlock.split('\n').map((l, lIdx) => (
                <li key={lIdx}>
                  {l.replace(/^[\s*-]+\s*/, '')}
                </li>
              ))}
            </ul>
          );
        }
        if (tBlock.startsWith('>')) {
          return (
            <blockquote key={idx} className="border-l-2 border-orange-500/40 bg-orange-950/5 pl-3 py-1.5 rounded-r-lg italic text-[11px] text-orange-200/80">
              {tBlock.replace(/^>\s*/, '')}
            </blockquote>
          );
        }
        return (
          <p key={idx} className="text-[11px] text-gray-300 leading-relaxed font-serif">
            {tBlock}
          </p>
        );
      })}
    </div>
  );
};

export default function NumerologyView({ currentUser }: { currentUser: any }) {
  // Global Active Navigation for Numerology tools
  const [activeTool, setActiveTool] = useState<'profile' | 'compatibility' | 'business' | 'mobile' | 'vehicle' | 'shastras' | 'admin'>('profile');
  
  // Results State
  const [calcResult, setCalcResult] = useState<any | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [activeReportTab, setActiveReportTab] = useState<string>('matrix');
  const [loadingCalculation, setLoadingCalculation] = useState<boolean>(false);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Partner Compatibility State
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerDob, setPartnerDob] = useState<string>('');
  const [compatibilityResult, setCompatibilityResult] = useState<any | null>(null);

  // Business Suitability State
  const [businessName, setBusinessName] = useState<string>('');
  const [businessResult, setBusinessResult] = useState<any | null>(null);

  // Mobile / Phone Vibe State
  const [mobileNum, setMobileNum] = useState<string>('');
  const [mobileResult, setMobileResult] = useState<any | null>(null);

  // Vehicle Plate State
  const [vehicleNum, setVehicleNum] = useState<string>('');
  const [vehicleResult, setVehicleResult] = useState<any | null>(null);

  // Selected Number for Knowledge Base lookup
  const [selectedKbNumber, setSelectedKbNumber] = useState<number>(1);

  // Administration Analytics State
  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(false);

  // React Hook Form for core calculator
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NumerologyInputData>({
    resolver: zodResolver(numerologyInputSchema),
    defaultValues: {
      fullName: currentUser?.name || '',
      dob: '2004-08-15', // Default matching the user examples
      gender: 'male',
      email: currentUser?.email || '',
      phone: ''
    }
  });

  // Calculate and trigger save to API
  const onCalculate = async (data: NumerologyInputData) => {
    setLoadingCalculation(true);
    setAiInterpretation('');
    try {
      const response = await fetch('/api/numerology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          dob: data.dob,
          gender: data.gender,
          email: data.email,
          phone: data.phone
        })
      });
      if (response.ok) {
        const json = await response.json();
        setCalcResult(json);
        
        // Trigger AI Reading automatically using client results
        onGenerateAIInterpretation(data.fullName, data.dob, data.gender || 'male', json.calculations);
      }
    } catch (err) {
      console.error("Calculation transmission failed, running offline calculations:", err);
      // Perfect offline fallback calculations
      const mockResult = {
        record: { name: data.fullName, dob: data.dob, gender: data.gender, email: data.email, phone: data.phone },
        calculations: {
          lifePathNumber: calculateLifePathNumber(data.dob),
          birthNumber: calculateBirthNumber(data.dob),
          destinyNumber: calculateDestinyNumber(data.fullName),
          soulUrgeNumber: calculateSoulUrgeNumber(data.fullName),
          personalityNumber: calculatePersonalityNumber(data.fullName),
          expressionNumber: calculateExpressionNumber(data.fullName)
        }
      };
      setCalcResult(mockResult);
    } finally {
      setLoadingCalculation(false);
    }
  };

  // Generate Personalized AI interpretation
  const onGenerateAIInterpretation = async (name: string, dob: string, gender: string, profile: any) => {
    setLoadingAI(true);
    try {
      const response = await fetch('/api/numerology/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dob, gender, profile })
      });
      if (response.ok) {
        const json = await response.json();
        setAiInterpretation(json.interpretation);
      }
    } catch (err) {
      console.error("AI Generation request failed:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Partner Compatibility Handler
  const handleCheckCompatibility = () => {
    if (!calcResult) {
      alert("Please calculate your own profile in the main dashboard first!");
      return;
    }
    if (!partnerName || !partnerDob) {
      alert("Please specify Partner's full name and birth date!");
      return;
    }

    const partnerLifePath = calculateLifePathNumber(partnerDob);
    const partnerDestiny = calculateDestinyNumber(partnerName);
    const myLifePath = calcResult.calculations.lifePathNumber;

    const compat = checkNumerologyCompatibility(myLifePath, partnerLifePath);
    setCompatibilityResult({
      partnerLifePath,
      partnerDestiny,
      ...compat
    });
  };

  // Business suit handler
  const handleBusinessCheck = () => {
    if (!businessName) return;
    const suit = assessBusinessName(businessName);
    setBusinessResult(suit);
  };

  // Mobile handler
  const handleMobileCheck = () => {
    if (!mobileNum) return;
    const analysis = analyzeMobileNumber(mobileNum);
    setMobileResult(analysis);
  };

  // Vehicle plate analyzer
  const handleVehicleCheck = () => {
    if (!vehicleNum) return;
    const analysis = analyzeVehicleNumber(vehicleNum);
    setVehicleResult(analysis);
  };

  // Admin Stats loader
  const loadAdminStats = async () => {
    setLoadingAdmin(true);
    try {
      const response = await fetch('/api/numerology/analytics');
      if (response.ok) {
        const json = await response.json();
        setAdminStats(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdmin(false);
    }
  };

  useEffect(() => {
    if (activeTool === 'admin') {
      loadAdminStats();
    }
  }, [activeTool]);

  return (
    <div className="space-y-8 animate-in fade-in" id="numerology-calculator-module">
      {/* Decorative Sharda Banner */}
      <div className="text-center max-w-2xl mx-auto pb-4">
        <span className="text-[10px] text-orange-400 font-serif font-bold uppercase tracking-widest block">Sharda Mathematics Laboratory</span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-100 uppercase mt-1">Chald-Vedic Numerology</h2>
        <p className="text-xs text-gray-400 mt-2 font-serif leading-relaxed">
          Decipher the cosmic vibration codes embedded within your birth coordinates and name. Discover your Life Path structure, match marital and brand names, and request elite Shastra computations in real-time.
        </p>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="border-b border-orange-500/15 flex flex-wrap gap-1 justify-center max-w-4xl mx-auto p-1 bg-[#0a0503] rounded-2xl">
        {[
          { id: 'profile', label: '👤 Personal Profile', desc: 'Life Path, Destiny & Vows' },
          { id: 'compatibility', label: '👥 Relationship Compatibility', desc: 'Match Partners \& Friends' },
          { id: 'business', label: '🏢 Brand \& Business', desc: 'Identify Auspicious Names' },
          { id: 'mobile', label: '📱 Mobile Analyzer', desc: 'Vibrational Codes' },
          { id: 'vehicle', label: '🚗 Vehicle Numerology', desc: 'Chariot Harmony' },
          { id: 'shastras', label: '📚 Shastras Reference', desc: 'Knowledge Base' },
          { id: 'admin', label: '📊 Admin Analytics', desc: 'Calculations Traffic', adminOnly: true }
        ].map((tool) => {
          // If adminOnly check
          if (tool.adminOnly && currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
            return null; // hide for students by default, although can toggle
          }

          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-serif font-bold uppercase tracking-wider text-center flex-1 min-w-[150px] ${
                isActive 
                  ? 'bg-gradient-to-b from-orange-600/30 to-amber-600/10 border-t-2 border-orange-500 text-orange-400'
                  : 'text-gray-400 hover:text-orange-400 hover:bg-orange-950/10'
              }`}
            >
              <div className="block">{tool.label}</div>
              <span className="text-[9px] lowercase font-sans text-gray-500 font-normal leading-tight block">{tool.desc}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: PERSONAL CALCULATOR MODULE */}
      {activeTool === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calculations Inputs */}
          <div className="lg:col-span-5 bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 space-y-6" id="numerology-calc-form">
            <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-4">
              <Calculator className="w-5 h-5 text-orange-500 animate-pulse" />
              <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Profile Initialization</h3>
            </div>

            <form onSubmit={handleSubmit(onCalculate)} className="space-y-4 font-sans text-sm">
              <div className="space-y-1">
                <label className="text-xs text-orange-400 font-bold uppercase block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="Enter full name (letters only)"
                    className="w-full bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 pl-10 pr-4 text-gray-200 text-xs focus:outline-none"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-orange-400 font-bold uppercase block">Date of Birth</label>
                  <div className="relative w-full">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      {...register("dob")}
                      className="w-full bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 pl-10 pr-4 text-gray-200 text-xs focus:outline-none"
                    />
                  </div>
                  {errors.dob && <p className="text-[10px] text-red-500 font-bold">{errors.dob.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-orange-400 font-bold uppercase block">Gender (Optional)</label>
                  <select
                    {...register("gender")}
                    className="w-full bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none h-[38px]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer Not To Say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-orange-400 font-bold uppercase block">Email (Optional)</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="contact@example.com"
                  className="w-full bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-orange-400 font-bold uppercase block">Phone Number (Optional)</label>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="+91 99999-99999"
                  className="w-full bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingCalculation}
                className="w-full cursor-pointer py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-serif font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-orange-950/40 disabled:opacity-50"
              >
                {loadingCalculation ? (
                  <span className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating coordinates...</span>
                  </span>
                ) : (
                  <span>Submit Astrological Sums</span>
                )}
              </button>
            </form>
          </div>

          {/* Calculations Results / Shastra Summary Cards */}
          <div className="lg:col-span-7 space-y-6" id="numerology-calc-results">
            {calcResult ? (
              <div className="space-y-6">
                
                {/* Numeric Results Grid */}
                <div>
                  <h4 className="text-sm font-serif text-orange-400 font-bold uppercase tracking-wider mb-3">Vibrational Sum Cards</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { title: "Life Path Number", num: calcResult.calculations.lifePathNumber, desc: "Sum of total DOB digits", color: "from-amber-600/20 to-orange-600/10" },
                      { title: "Birth Number (Mulank)", num: calcResult.calculations.birthNumber, desc: "Root birth day single digit", color: "from-orange-600/20 to-yellow-600/10" },
                      { title: "Destiny Number", num: calcResult.calculations.destinyNumber, desc: "Total Chaldean name sum", color: "from-amber-600/20 to-yellow-600/10" },
                      { title: "Soul Urge", num: calcResult.calculations.soulUrgeNumber, desc: "Vowels-only energy", color: "from-orange-950/30 to-amber-950/20" },
                      { title: "Personality", num: calcResult.calculations.personalityNumber, desc: "Consonants-only vibe", color: "from-orange-950/30 to-yellow-950/20" },
                      { title: "Expression Number", num: calcResult.calculations.expressionNumber, desc: "Complete word total", color: "from-amber-950/30 to-orange-950/20" }
                    ].map((card, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-[#0d0705] border border-orange-500/15 hover:border-orange-500/35 rounded-2xl p-4 flex flex-col justify-between text-center relative overflow-hidden`}
                      >
                        <div className="text-[10px] uppercase font-serif text-orange-400/80 tracking-widest">{card.title}</div>
                        <div className="text-4xl font-serif font-black text-gray-100 my-2 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-orange-400">
                          {card.num}
                        </div>
                        <div className="text-[10px] text-gray-500 font-light mt-1 leading-normal">{card.desc}</div>
                        {/* Sharda watermark background */}
                        <div className="absolute right-[-10px] bottom-[-15px] opacity-10 text-7xl font-bold font-serif pointer-events-none select-none">ॐ</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Interpretative Deck / Lineage Astrological Report */}
                <div className="bg-[#0b0504] border border-orange-500/10 rounded-3xl p-6 relative overflow-hidden" id="lineage-celestial-report">
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 opacity-10 text-[90px] font-black pointer-events-none select-none text-orange-600 font-serif translate-x-4 -translate-y-8">ॐ</div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-orange-500/10 pb-4 mb-5 gap-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                      <div>
                        <h3 className="font-serif font-bold text-gray-100 text-sm sm:text-base uppercase tracking-wider">Lineage Astrological Synthesis</h3>
                        <p className="text-[10px] text-gray-500 font-sans tracking-wide">Chald-Vedic Mathematical Soul Codes Analysis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {loadingAI && <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />}
                      <span className="text-[10px] font-mono text-orange-400 bg-orange-950/20 px-2 py-1 border border-orange-500/10 rounded-lg">
                        Real-time Data Active
                      </span>
                    </div>
                  </div>

                  {/* Celestial formulated metadata block */}
                  <div className="text-[11px] text-orange-400 bg-orange-950/10 px-3.5 py-2.5 border border-orange-500/10 rounded-xl mb-6 italic flex flex-wrap gap-x-6 gap-y-1 items-center justify-between font-serif">
                    <span>
                      Celestial Report formulated specifically for <strong>{calcResult.record.name}</strong> 
                    </span>
                    <span>
                      Birth Solstice: <strong>{calcResult.record.dob}</strong>
                    </span>
                  </div>

                  {/* Interactive Shastra Sub-navigation */}
                  <div className="flex flex-wrap gap-1 bg-[#050201] p-1 rounded-xl border border-orange-500/5 mb-6 overflow-x-auto text-[10px] font-serif font-bold uppercase tracking-wider">
                    {[
                      { id: 'matrix', label: '🌌 Cosmic Lattice' },
                      { id: 'synthesis', label: '👁️ Soul Synthesis' },
                      { id: 'karma', label: '⚖️ Karmic Weights' },
                      { id: 'vocation', label: '💼 Career & Finance' },
                      { id: 'harmony', label: '💖 Marriage & Wellness' },
                      { id: 'remedies', label: '📿 Sacred Sadhana' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveReportTab(tab.id)}
                        className={`flex-1 min-w-[95px] px-2 py-2 rounded-lg cursor-pointer text-center transition-all ${
                          activeReportTab === tab.id
                            ? 'bg-gradient-to-b from-orange-600/30 to-amber-600/10 text-orange-400 border border-orange-500/20'
                            : 'text-gray-400 hover:text-orange-400'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {loadingAI ? (
                    <div className="space-y-4 py-12 text-center text-gray-400" id="ai-loading-panel">
                      <p className="text-xs font-serif animate-pulse">Deep-diving into sacred mathematical coordinates and computing Chaldean resonances...</p>
                      <div className="h-1 bg-orange-950 rounded-full max-w-md mx-auto overflow-hidden">
                        <div className="bg-orange-500 h-1 animate-infinite-loading w-2/3 rounded-full"></div>
                      </div>
                      <p className="text-[10px] text-gray-500">Your temporary report is already loaded below. Dynamic astrological details are arriving in a moment.</p>
                    </div>
                  ) : aiInterpretation && (
                    <div className="text-[11px] text-amber-500/80 bg-amber-950/5 px-3 py-2 border border-amber-500/10 rounded-lg mb-6 italic font-serif flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span>Shastri Shastra AI dynamic calculations successfully verified and synced.</span>
                    </div>
                  )}

                  {/* SUB-TAB CONTENTS */}
                  <div className="space-y-4 min-h-[300px]">
                    
                    {/* 1. COSMIC LATTICE (LOSHU/VEDIC PLANETARY MATRIX) */}
                    {activeReportTab === 'matrix' && (
                      <div className="space-y-5 animate-in fade-in" id="report-tab-matrix">
                        <div className="bg-[#050201] p-4 rounded-2xl border border-orange-500/5">
                          <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold mb-3 text-center">Active Planetary alignment Coordinates</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            
                            {/* 3x3 Grid Layout */}
                            <div className="grid grid-cols-3 gap-2 bg-[#090403] p-3 rounded-xl border border-orange-500/10 max-w-sm mx-auto w-full aspect-square">
                              {[
                                { val: 4, planet: "Rahu", title: "Intellect / Fortune", element: "Air" },
                                { val: 9, planet: "Mars", title: "Action / Courage", element: "Fire" },
                                { val: 2, planet: "Moon", title: "Mind / Intuition", element: "Water" },
                                { val: 3, planet: "Jupiter", title: "Wealth / Wisdom", element: "Ether" },
                                { val: 5, planet: "Mercury", title: "Wit / Commerce", element: "Earth" },
                                { val: 7, planet: "Ketu", title: "Insight", element: "Spirit" },
                                { val: 8, planet: "Saturn", title: "Discipline", element: "Earth" },
                                { val: 1, planet: "Sun", title: "Power / Authority", element: "Fire" },
                                { val: 6, planet: "Venus", title: "Luxury / Arts", element: "Water" }
                              ].map((cell, idx) => {
                                // Check if user's numbers contain this val (we handle both strings and numeric equivalents)
                                const activeNumbers = [
                                  calcResult.calculations.lifePathNumber,
                                  calcResult.calculations.birthNumber,
                                  calcResult.calculations.destinyNumber,
                                  calcResult.calculations.soulUrgeNumber,
                                  calcResult.calculations.personalityNumber,
                                  calcResult.calculations.expressionNumber
                                ].map(n => n === 11 ? 2 : n === 22 ? 4 : n === 33 ? 6 : n); // reduce masters for Vedic grid representation

                                const isActive = activeNumbers.includes(cell.val);

                                return (
                                  <div 
                                    key={idx}
                                    className={`flex flex-col justify-between items-center p-2 rounded-lg text-center transition-all border ${
                                      isActive 
                                        ? 'bg-gradient-to-b from-orange-600/35 to-amber-600/10 border-orange-500/50 shadow-md shadow-orange-950/20 text-orange-100 font-bold'
                                        : 'bg-[#0d0705]/40 border-orange-500/5 text-gray-600 opacity-30'
                                    }`}
                                  >
                                    <div className="text-[10px] font-mono select-none">{cell.planet}</div>
                                    <div className="text-2xl font-serif">{cell.val}</div>
                                    <div className="text-[8px] font-light tracking-tight truncate max-w-full">{cell.element}</div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Descriptive analysis card on matrix */}
                            <div className="space-y-3 prose prose-xs text-gray-400">
                              <h5 className="font-serif text-gray-200 text-xs font-bold uppercase tracking-wider">The Ancient Vedic Coordinates Matrix</h5>
                              <p className="text-[11px] leading-relaxed font-serif text-gray-300">
                                This circular Vedic geometry allocates planetary numbers into traditional shastra grids. Active golden cards represent energies fully populated in your birth blueprint:
                              </p>
                              <div className="space-y-1 text-[11px] font-sans">
                                <div className="flex items-center space-x-1.5">
                                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                  <span>Gold Nodes: Active conscious paths of power.</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <span className="w-2 h-2 rounded-full bg-orange-950"></span>
                                  <span>Dim Nodes: Empty vectors awaiting remedies or sadhanas.</span>
                                </div>
                              </div>
                              <p className="text-[10px] italic text-orange-400 bg-orange-950/10 p-2 rounded-lg border border-orange-500/5">
                                *Note: Master numbers 11, 22, and 33 resolve to root frequencies (2, 4, 6 respectively) to identify your coordinates in traditional Loshu Shastra frameworks.
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* Vedic Matrix Interpretations derived from AI if present */}
                        {aiInterpretation && (
                          <div className="bg-[#0e0705] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold flex items-center space-x-1.5">
                              <Compass className="w-4 h-4 text-orange-500" />
                              <span>Planetary vibrations analysis</span>
                            </h4>
                            <div className="prose prose-invert prose-xs select-text">
                              {/* Parse intro parts / dynamic details */}
                              {parseMarkdownContent(extractSectionText(aiInterpretation, ["Synthesis", "Personality", "Divine", "Alchemist"])) || (
                                <p className="text-gray-400 italic">Planetary frequencies being computed. Please review other tabs for complete structural details.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. SOUL SYNTHESIS (PERSONALITY & INNER VIBE) */}
                    {activeReportTab === 'synthesis' && (
                      <div className="space-y-5 animate-in fade-in" id="report-tab-synthesis">
                        
                        {/* Dynamic calculated numbers matching rulers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { title: "Sanyank (Life Path)", num: calcResult.calculations.lifePathNumber, label: "Core Journey" },
                            { title: "Mulank (Birth)", num: calcResult.calculations.birthNumber, label: "Daily Mindset" },
                            { title: "Bhagyank (Destiny)", num: calcResult.calculations.destinyNumber, label: "Outer Manifestation" }
                          ].map((item, idx) => {
                            const ruler = PLANETARY_RULERS[item.num] || { planet: "Divine Matrix", deity: "Ishvara", power: "Harmonization", metal: "Copper", element: "Ether" };
                            return (
                              <div key={idx} className="bg-[#070302] p-4 rounded-xl border border-orange-500/10 space-y-3 relative overflow-hidden">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-serif block">{item.title}</span>
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-3xl font-serif text-orange-400 font-bold">{item.num}</span>
                                  <span className="text-[10px] text-gray-500 italic">ruler: {ruler.planet}</span>
                                </div>
                                <div className="space-y-1 text-[10px] text-gray-300 font-sans leading-normal border-t border-orange-500/10 pt-2">
                                  <div><strong className="text-orange-500">Divine Deity:</strong> {ruler.deity}</div>
                                  <div><strong className="text-orange-500">Governing Axis:</strong> {ruler.power}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Comprehensive Knowledge descriptions */}
                        <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-4">
                          <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Sacred Soul blueprint summary</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed">
                            <div className="p-3 bg-[#0d0705] rounded-xl border border-orange-500/5">
                              <strong className="text-orange-400 text-[10px] uppercase block tracking-wider mb-1">Your Primary Life Vibe</strong>
                              <p className="text-[11px] text-gray-300">
                                {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.personality || "Vibrational energies aligning with high-conscious celestial structures."}
                              </p>
                            </div>
                            <div className="p-3 bg-[#0d0705] rounded-xl border border-orange-500/5">
                              <strong className="text-orange-400 text-[10px] uppercase block tracking-wider mb-1">Your Inner Soul Urge Energy</strong>
                              <p className="text-[11px] text-gray-300">
                                {KNOWLEDGE_BASE[calcResult.calculations.soulUrgeNumber]?.personality || "Deeper vowel mechanics point towards internal spiritual clarity."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* AI dynamic writeup */}
                        {aiInterpretation && (
                          <div className="bg-[#0e0705] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Divine Astrological Personality Synthesis</h4>
                            <div className="prose prose-invert prose-xs select-text">
                              {parseMarkdownContent(extractSectionText(aiInterpretation, ["Synthesis", "Personality", "Divine", "Alchemist"])) || (
                                <p className="text-gray-400 italic">No custom synthesis paragraph detected from AI. Displaying stable mathematical coordinates.</p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* 3. KARMIC WEIGHTS (STRENGTHS & SHADOW WORK) */}
                    {activeReportTab === 'karma' && (
                      <div className="space-y-5 animate-in fade-in" id="report-tab-karma">
                        
                        {/* Two Columns for Strengths (Siddhis) vs Shadows (Klesh) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Karmic Siddhis / Strengths */}
                          <div className="bg-[#070302] p-5 rounded-2xl border border-green-500/10 space-y-3">
                            <div className="flex items-center space-x-1.5 border-b border-green-500/10 pb-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <h4 className="text-xs text-green-400 uppercase font-serif tracking-widest font-bold">Vedic Siddhis (Planetary Blessings)</h4>
                            </div>
                            <ul className="space-y-2">
                              {(KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.strengths || ["Creative", "Adaptable", "Persistent"]).map((strength, i) => (
                                <li key={i} className="flex items-start space-x-2 text-[11px] text-gray-300 font-sans leading-relaxed">
                                  <span className="text-green-500 mt-0.5">✔</span>
                                  <span><strong>{strength}</strong>: Natural capacity to manifest in alignment with destiny and professional endeavors.</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Karmic Klesh / Shadow-work */}
                          <div className="bg-[#070302] p-5 rounded-2xl border border-red-500/10 space-y-3">
                            <div className="flex items-center space-x-1.5 border-b border-red-500/10 pb-2 mb-2">
                              <ShieldAlert className="w-4 h-4 text-red-500" />
                              <h4 className="text-xs text-red-400 uppercase font-serif tracking-widest font-bold">Vedic Klesh (Karmic Blindspots)</h4>
                            </div>
                            <ul className="space-y-2">
                              {(KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.weaknesses || ["Impatient", "Overthinking", "Stubborn"]).map((weakness, i) => (
                                <li key={i} className="flex items-start space-x-2 text-[11px] text-gray-300 font-sans leading-relaxed">
                                  <span className="text-red-500 mt-0.5">✕</span>
                                  <span><strong>{weakness}</strong>: Hidden sub-conscious resistance, indicating spaces where self-control is mandatory.</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>

                        {/* Spiritual Growth Area Card */}
                        <div className="bg-[#050201] p-4 rounded-xl border border-orange-500/10 text-xs font-serif leading-relaxed text-gray-300">
                          <strong className="text-orange-400 font-serif block uppercase tracking-widest text-[10px] mb-1">Celestial Transformation Mantra</strong>
                          <p className="text-[11px] leading-relaxed">
                            {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.growthAreas || "Cultivating daily silent meditation is essential to quieten planetary frictions."}
                          </p>
                        </div>

                        {/* AI dynamic assessment */}
                        {aiInterpretation && (
                          <div className="bg-[#0e0705] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Karmic Strengths and Shadow Work Analysis</h4>
                            <div className="prose prose-invert prose-xs select-text">
                              {parseMarkdownContent(extractSectionText(aiInterpretation, ["Strengths", "Shadow", "Karmic"])) || (
                                <p className="text-gray-400 italic">No custom shadow assessment paragraph detected from AI. Presenting mathematical balances.</p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* 4. VOCATION & WEALTH (CAREER SECTORS & FINANCE) */}
                    {activeReportTab === 'vocation' && (
                      <div className="space-y-5 animate-in fade-in" id="report-tab-vocation">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Recommended Vocation badging */}
                          <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Dominant Fields of Excellence</h4>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {(KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.recommendedCareers || ["Strategist", "Counselor", "Tech Innovator"]).map((job, i) => (
                                <span key={i} className="text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-950/20 text-orange-300 border border-orange-500/20 px-2.5 py-1 rounded-lg">
                                  {job}
                                </span>
                              ))}
                            </div>
                            <p className="text-[11px] leading-relaxed text-gray-400 font-serif pt-2">
                              {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.career || "Thrives in settings where strategic intelligence can operate autonomously."}
                            </p>
                          </div>

                          {/* Style definitions */}
                          <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3 text-xs leading-normal font-serif">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Occupational Signature</h4>
                            <div className="space-y-2 text-[11px]">
                              <div>
                                <strong className="text-orange-500 uppercase block tracking-wider text-[9px] font-sans">Leadership Profile:</strong>
                                <span className="text-gray-300">{KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.leadershipStyle || "Inspires teams through active model setting and empathetic listens."}</span>
                              </div>
                              <div>
                                <strong className="text-orange-500 uppercase block tracking-wider text-[9px] font-sans">Communicative Dexterity:</strong>
                                <span className="text-gray-300">{KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.communicationStyle || "Persuasive and deep, keeping expectations clearly aligned."}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Financial Vibe Card */}
                        <div className="bg-[#050201] p-4 rounded-xl border border-orange-500/10 text-xs font-serif leading-relaxed text-gray-300">
                          <strong className="text-orange-400 font-serif block uppercase tracking-widest text-[10px] mb-1">Financial Shastra Law (Wealth Vows)</strong>
                          <p className="text-[11px]">
                            {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.finance || "Steady and secure accumulation. Generosity acts as a mystical conduit for financial protection."}
                          </p>
                        </div>

                        {/* AI career details */}
                        {aiInterpretation && (
                          <div className="bg-[#0e0705] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Ascendant Career Paths and Finance Vows</h4>
                            <div className="prose prose-invert prose-xs select-text">
                              {parseMarkdownContent(extractSectionText(aiInterpretation, ["Career", "Finance", "Vocation", "Vows"])) || (
                                <p className="text-gray-400 italic">No custom wealth shastra details received from AI. Showing standard shastra guidelines.</p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* 5. MARRIAGE & WELLNESS (PARTNERSHIPS & AYURVEDA) */}
                    {activeReportTab === 'harmony' && (
                      <div className="space-y-5 animate-in fade-in" id="report-tab-harmony">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Love and Partner Compatibility details */}
                          <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold flex items-center space-x-1 border-b border-orange-500/10 pb-1.5">
                              <Heart className="w-3.5 h-3.5 text-red-500" />
                              <span>Soul Unions & Romantic Dynamics</span>
                            </h4>
                            <p className="text-[11px] leading-relaxed text-gray-300 font-serif">
                              {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.love || "Deeply loyal, sensitive, and emotionally expressive. Seeks spiritual security."}
                            </p>
                            <div className="text-[10px] text-orange-400 bg-orange-950/15 p-2 rounded-lg border border-orange-500/5 leading-normal">
                              <strong>Friendly Sanyank Frequencies:</strong> {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.luckyNumbers.join(', ')}
                            </div>
                          </div>

                          {/* Bodily health profiles */}
                          <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold flex items-center space-x-1 border-b border-orange-500/10 pb-1.5">
                              <Activity className="w-3.5 h-3.5 text-orange-500" />
                              <span>Planetary Ayurwellness Indicators</span>
                            </h4>
                            <p className="text-[11px] leading-relaxed text-gray-300 font-serif">
                              {KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.health || "Delicate baseline. Needs to manage neural stresses, fluid balance, or comfortable lifestyle habits."}
                            </p>
                            <div className="text-[10px] text-orange-400 bg-orange-950/15 p-2 rounded-lg border border-orange-500/5 leading-normal">
                              <strong>Vocal/Bodily vulnerabilities:</strong> Mindful yoga, physical grounding, and conscious breathing is highly recommended.
                            </div>
                          </div>

                        </div>

                        {/* AI dynamic details */}
                        {aiInterpretation && (
                          <div className="bg-[#0e0705] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Sacred Love, Marriage Compatibility, and Health Rhythms</h4>
                            <div className="prose prose-invert prose-xs select-text">
                              {parseMarkdownContent(extractSectionText(aiInterpretation, ["Love", "Marriage", "Compatibility", "Health", "Rhythms"])) || (
                                <p className="text-gray-400 italic">No custom alliance or health analysis returned. Showing stable physical planetary outlines.</p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* 6. SACRED SADHANA (REMEDIES, MANTRAS & COLORS) */}
                    {activeReportTab === 'remedies' && (
                      <div className="space-y-5 animate-in fade-in" id="report-tab-remedies">
                        
                        {/* Remedies Table Card */}
                        <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-4">
                          <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold text-center border-b border-orange-500/10 pb-2">
                             Astrological Remedial coordinates table
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-serif leading-relaxed">
                            <div className="bg-[#0d0705] p-3 rounded-xl border border-orange-500/5">
                              <strong className="text-orange-500 uppercase text-[9px] block mb-0.5 font-sans">Radiant Colors</strong>
                              <span className="text-gray-300">{(KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.luckyColors || ["Gold", "Silver", "Crimson"]).join(', ')}</span>
                            </div>
                            <div className="bg-[#0d0705] p-3 rounded-xl border border-orange-500/5">
                              <strong className="text-orange-500 uppercase text-[9px] block mb-0.5 font-sans">Auspicious Solstice Days</strong>
                              <span className="text-gray-300">{(KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.luckyDays || ["Monday", "Thursday"]).join(', ')}</span>
                            </div>
                            <div className="bg-[#0d0705] p-3 rounded-xl border border-orange-500/5">
                              <strong className="text-orange-500 uppercase text-[9px] block mb-0.5 font-sans">Sacred Resonance Numbers</strong>
                              <span className="text-gray-300">{(KNOWLEDGE_BASE[calcResult.calculations.lifePathNumber]?.luckyNumbers || [3, 9, 1]).join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mantra and Gemstone Block */}
                        <div className="bg-[#050201] p-5 rounded-xl border border-orange-500/15 space-y-3">
                          <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Vedic Shastra Mantra Activations</h4>
                          
                          <div className="space-y-3 font-serif text-gray-300 text-xs">
                            <div className="border-l-2 border-orange-500 pl-4 py-1 italic bg-[#0c0604] p-3 rounded-r-xl">
                              <strong className="text-orange-400 block uppercase font-sans text-[9px] tracking-wider mb-1">Mantra to chant (108 repetitions):</strong>
                              "{PLANETARY_RULERS[calcResult.calculations.lifePathNumber]?.mantra || "Om Namah Shivaya"}"
                            </div>
                            
                            <div className="text-[11px] leading-relaxed">
                              <strong className="text-orange-500">Gemstone Therapy:</strong> Emerald, Pearl, or Yellow Sapphire corresponding with your core governing rulers. Consult a lineage master before initiating heavy copper ring placements.
                            </div>
                          </div>
                        </div>

                        {/* Concluding Shastra details */}
                        {aiInterpretation && (
                          <div className="bg-[#0e0705] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                            <h4 className="text-xs text-orange-400 uppercase font-serif tracking-widest font-bold">Sacred Morning Sadhana & Concluding Blessings</h4>
                            <div className="prose prose-invert prose-xs select-text">
                              {/* Matches Sadhana, remedies, blessings or ending matrix */}
                              {parseMarkdownContent(extractSectionText(aiInterpretation, ["Sadhana", "Remedy", "Remedies", "Pranams", "Blessings"])) || (
                                <p className="text-gray-400 italic">No custom ending blessings paragraph returned. We pass you infinite light and divine protection.</p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                </div>

              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center bg-[#0d0705] border border-dashed border-orange-500/15 rounded-3xl p-6">
                <Calculator className="w-12 h-12 text-orange-600/30 mb-3 animate-bounce" />
                <h4 className="font-serif font-bold text-gray-300 uppercase text-sm tracking-wider">Awaiting Astrological Inputs</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
                  Enter your Name and Date of Birth to calculate your divine multi-number profile, planetary frequencies, and customized guidance report.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 2: PARTNER RELATIONSHIP COMPATIBILITY CHECKER */}
      {activeTool === 'compatibility' && (
        <div className="bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-4 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Partner Harmony & Marriage Compatibility</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Input fields */}
            <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-4">
              <h4 className="text-xs font-serif font-bold uppercase text-orange-400 tracking-wider">Specify Partner Credentials</h4>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold block">Partner Full Name</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter partner name"
                  className="w-full bg-[#0d0705] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold block">Partner's Date of Birth</label>
                <input
                  type="date"
                  value={partnerDob}
                  onChange={(e) => setPartnerDob(e.target.value)}
                  className="w-full bg-[#0d0705] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={handleCheckCompatibility}
                className="w-full cursor-pointer py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-serif font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow"
              >
                Analyze Shastra Compatibility
              </button>
            </div>

            {/* Assessment results */}
            <div className="space-y-4">
              {compatibilityResult ? (
                <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-4 relative overflow-hidden">
                  <div className="text-center pb-2">
                    <span className="text-[10px] uppercase font-serif text-orange-500 font-bold block">Vibrational Compatibility Score</span>
                    <div className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 my-1">
                      {compatibilityResult.score}%
                    </div>
                    <div className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-lg uppercase tracking-widest font-bold ${
                      compatibilityResult.grade === 'EXCELLENT' ? 'bg-green-950/20 text-green-400 border border-green-500/20' :
                      compatibilityResult.grade === 'COMPATIBLE' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/20' :
                      compatibilityResult.grade === 'NEUTRAL' ? 'bg-yellow-950/20 text-yellow-400 border border-yellow-500/25' :
                      'bg-red-950/20 text-red-400 border border-red-500/20'
                    }`}>
                      {compatibilityResult.grade} Harmony
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-300 font-serif leading-relaxed">
                    <p>{compatibilityResult.description}</p>
                    
                    <div className="border-t border-orange-500/10 pt-3 mt-2 grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-sans">
                      <div>Your LP Number: <strong className="text-orange-400 font-serif text-xs">{calcResult?.calculations?.lifePathNumber}</strong></div>
                      <div>Partner LP Number: <strong className="text-orange-400 font-serif text-xs">{compatibilityResult.partnerLifePath}</strong></div>
                      <div>Your Destiny Code: <strong className="text-orange-400 font-serif text-xs">{calcResult?.calculations?.destinyNumber}</strong></div>
                      <div>Partner Destiny Code: <strong className="text-orange-400 font-serif text-xs">{compatibilityResult.partnerDestiny}</strong></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center bg-[#070302] rounded-2xl border border-dashed border-orange-500/15 p-4">
                  <Heart className="w-8 h-8 text-red-500/20 mb-2 animate-pulse" />
                  <h4 className="text-xs font-serif font-bold text-gray-300 uppercase">Awaiting Relationship Match</h4>
                  <p className="text-[11px] text-gray-500 max-w-xs mt-1 leading-relaxed">
                    Calculate your profile first, and then enter partner credentials above to weigh active celestial friendly/hostile planetary coordinates.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TOOL 3: BUSINESS AND BRAND SUITABILITY */}
      {activeTool === 'business' && (
        <div className="bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-4">
            <Briefcase className="w-5 h-5 text-orange-500" />
            <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Corporate Brand \& Business Name Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-orange-400 font-bold uppercase block">Proposed Brand/Business Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sanatan Gurukul Academy"
                  className="flex-1 bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
                <button
                  onClick={handleBusinessCheck}
                  className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-serif font-bold text-xs tracking-wider uppercase rounded-xl transition-colors whitespace-nowrap"
                >
                  Analyze Name Vibe
                </button>
              </div>
            </div>

            {businessResult && (
              <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                <div className="flex items-center justify-between border-b border-orange-500/10 pb-2">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase font-sans">Business Chaldean Number</span>
                    <div className="text-3xl font-serif font-bold text-orange-400">{businessResult.number}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 uppercase font-sans">Suitability Rating</span>
                    <div className={`text-xs font-serif font-black uppercase tracking-wider block ${
                      businessResult.suitability === 'EXCELLENT' ? 'text-green-400' :
                      businessResult.suitability === 'GOOD' ? 'text-blue-400' :
                      'text-yellow-400'
                    }`}>{businessResult.suitability}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-serif text-gray-300 leading-relaxed">
                  <div>
                    <strong className="text-orange-400 text-[10px] uppercase font-sans tracking-wide block">Energetic Harmony vibes</strong>
                    <span>{businessResult.vibes}</span>
                  </div>
                  <div className="mt-2">
                    <strong className="text-orange-400 text-[10px] uppercase font-sans tracking-wide block">Shastra Advisory Vows</strong>
                    <span>{businessResult.advice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 4: MOBILE PHONE VIBRATIONS */}
      {activeTool === 'mobile' && (
        <div className="bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-4">
            <Smartphone className="w-5 h-5 text-orange-500" />
            <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Mobile Number Energy Vibration Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-orange-400 font-bold uppercase block">Current Mobile Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mobileNum}
                  onChange={(e) => setMobileNum(e.target.value)}
                  placeholder="e.g. 9876543210 (digits only)"
                  className="flex-1 bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
                <button
                  onClick={handleMobileCheck}
                  className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-serif font-bold text-xs tracking-wider uppercase rounded-xl transition-colors whitespace-nowrap"
                >
                  Weigh Digit Vibe
                </button>
              </div>
            </div>

            {mobileResult && (
              <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                <div className="flex items-center justify-between border-b border-orange-500/10 pb-2">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase font-sans">Accumulated Digit Sum</span>
                    <div className="text-xl font-mono text-gray-200 font-bold">{mobileResult.totalSum} <span className="text-[10px] text-gray-500">reduces to</span> <strong className="text-orange-400 font-serif text-2xl">{mobileResult.reduced}</strong></div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-serif text-gray-300 leading-relaxed">
                  <div>
                    <strong className="text-orange-400 text-[10px] uppercase font-sans tracking-wide block">Active Energy Aura</strong>
                    <span>{mobileResult.vibe}</span>
                  </div>
                  <div className="mt-2">
                    <strong className="text-orange-400 text-[10px] uppercase font-sans tracking-wide block">Astrological Suitability</strong>
                    <span>{mobileResult.suitability}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 5: VEHICLE PLATE HARMONY */}
      {activeTool === 'vehicle' && (
        <div className="bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-4">
            <Car className="w-5 h-5 text-orange-500" />
            <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Vehicle Number & Chariot Harmony</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-orange-400 font-bold uppercase block">Vehicle Registration Plate Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vehicleNum}
                  onChange={(e) => setVehicleNum(e.target.value)}
                  placeholder="e.g. DL 3C AB 1234 (alphabets and digits)"
                  className="flex-1 bg-[#070302] border border-orange-500/15 focus:border-orange-500/40 rounded-xl py-2.5 px-3.5 text-gray-200 text-xs focus:outline-none"
                />
                <button
                  onClick={handleVehicleCheck}
                  className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-serif font-bold text-xs tracking-wider uppercase rounded-xl transition-colors whitespace-nowrap"
                >
                  Assess Vehicle Plate
                </button>
              </div>
            </div>

            {vehicleResult && (
              <div className="bg-[#070302] p-5 rounded-2xl border border-orange-500/10 space-y-3">
                <div className="flex items-center justify-between border-b border-orange-500/10 pb-2">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase font-sans">Reduced Plate Vibration Number</span>
                    <div className="text-2xl font-serif font-bold text-orange-400">{vehicleResult.reduced}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 uppercase font-sans">Aura Status</span>
                    <div className={`text-xs font-serif font-black uppercase block ${
                      vehicleResult.energy === 'HIGHLY HARMONIOUS' ? 'text-green-400' :
                      vehicleResult.energy === 'STABLE' ? 'text-blue-400' :
                      'text-red-400'
                    }`}>{vehicleResult.energy}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-serif text-gray-300 leading-relaxed">
                  <div>
                    <strong className="text-orange-400 text-[10px] uppercase font-sans tracking-wide block">Highway Aura \& Vibe</strong>
                    <span>{vehicleResult.vibe}</span>
                  </div>
                  <div className="mt-2">
                    <strong className="text-orange-400 text-[10px] uppercase font-sans tracking-wide block">Glovebox Remedial Protection Vow</strong>
                    <span className="text-orange-300 bg-orange-950/15 px-2 py-1 border border-orange-500/10 rounded-lg block mt-1">{vehicleResult.remedy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 6: SHASTRA REFERENCE KNOWLEDGE BASE */}
      {activeTool === 'shastras' && (
        <div className="bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 space-y-6" id="shastras-catalog-wiki">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-orange-500/10 pb-4 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Sharda Number Reference Wiki</h3>
            </div>
            
            {/* Quick matrix select */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedKbNumber(num)}
                  className={`w-7.5 h-7.5 rounded-lg cursor-pointer text-xs font-serif font-bold transition-all text-center flex items-center justify-center ${
                    selectedKbNumber === num 
                      ? 'bg-orange-600 text-white shadow shadow-orange-600/30' 
                      : 'bg-[#070302] border border-orange-500/10 text-gray-300 hover:text-orange-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Core definitions layout */}
          {KNOWLEDGE_BASE[selectedKbNumber] && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start font-serif">
              
              {/* Left detail Column */}
              <div className="md:col-span-1 bg-[#070302] p-5 rounded-2xl border border-orange-500/10 text-center space-y-4">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-orange-400 py-2">
                  {selectedKbNumber}
                </div>
                <div>
                  <h4 className="font-bold text-gray-100 uppercase text-sm tracking-wider">{KNOWLEDGE_BASE[selectedKbNumber].name}</h4>
                  <p className="text-[10px] text-orange-400 italic font-sans uppercase mt-1">{KNOWLEDGE_BASE[selectedKbNumber].vibe}</p>
                </div>

                <div className="border-t border-orange-500/10 pt-3 space-y-2 text-left text-[11px] font-sans">
                  <div>
                    <strong className="text-orange-400 block uppercase tracking-wider text-[9px]">Lucky Days</strong>
                    <span className="text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].luckyDays.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="text-orange-400 block uppercase tracking-wider text-[9px]">Lucky Colors</strong>
                    <span className="text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].luckyColors.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="text-orange-400 block uppercase tracking-wider text-[9px]">Lucky Numbers</strong>
                    <span className="text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].luckyNumbers.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="text-orange-400 block uppercase tracking-wider text-[9px]">Recommended Careers</strong>
                    <span className="text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].recommendedCareers.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Right text detail column */}
              <div className="md:col-span-2 space-y-5 text-gray-300 text-xs leading-relaxed font-sans">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0d0705] p-3.5 rounded-xl border border-orange-500/5">
                    <strong className="text-orange-400 text-[10px] uppercase font-serif tracking-widest block mb-1">Personality Matrix</strong>
                    <p className="text-[11px] text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].personality}</p>
                  </div>
                  <div className="bg-[#0d0705] p-3.5 rounded-xl border border-orange-500/5">
                    <strong className="text-orange-400 text-[10px] uppercase font-serif tracking-widest block mb-1">Career & Vocation</strong>
                    <p className="text-[11px] text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].career}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0d0705] p-3.5 rounded-xl border border-orange-500/5">
                    <strong className="text-orange-400 text-[10px] uppercase font-serif tracking-widest block mb-1">Romance & Soul Unions</strong>
                    <p className="text-[11px] text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].love}</p>
                  </div>
                  <div className="bg-[#0d0705] p-3.5 rounded-xl border border-orange-500/5">
                    <strong className="text-orange-400 text-[10px] uppercase font-serif tracking-widest block mb-1">Wealth & Finance</strong>
                    <p className="text-[11px] text-gray-300">{KNOWLEDGE_BASE[selectedKbNumber].finance}</p>
                  </div>
                </div>

                <div className="bg-[#0d0705] p-4 rounded-xl border border-orange-500/5">
                  <strong className="text-orange-400 text-[10px] uppercase font-serif tracking-widest block mb-1.5">Shorthand Planetary Diagnostics</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-sans">
                    <div>
                      <strong className="text-orange-500 uppercase block tracking-wider mb-0.5">Physical Health:</strong>
                      <span>{KNOWLEDGE_BASE[selectedKbNumber].health}</span>
                    </div>
                    <div>
                      <strong className="text-orange-500 uppercase block tracking-wider mb-0.5">Natural Gifts:</strong>
                      <ul className="list-disc list-inside">
                        {KNOWLEDGE_BASE[selectedKbNumber].strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-orange-500 uppercase block tracking-wider mb-0.5">Karmic Blindspots:</strong>
                      <ul className="list-disc list-inside">
                        {KNOWLEDGE_BASE[selectedKbNumber].weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* TOOL 7: ADMIN ANALYTICS DASHBOARD */}
      {activeTool === 'admin' && (
        <div className="bg-[#0e0705] border border-orange-500/10 rounded-3xl p-6 space-y-6" id="admin-numerology-dashboard">
          <div className="flex justify-between items-center border-b border-orange-500/10 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-orange-500" />
              <h3 className="font-serif font-bold text-gray-100 text-lg uppercase">Numerical calculations Traffic Audit</h3>
            </div>
            <button
              onClick={loadAdminStats}
              disabled={loadingAdmin}
              className="cursor-pointer text-[10px] font-sans p-1.5 border border-orange-500/20 text-orange-400 hover:text-white rounded-lg flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingAdmin ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {loadingAdmin ? (
            <div className="text-center py-12 text-gray-400 font-serif">Compiling administrator dashboard matrix analytics...</div>
          ) : adminStats ? (
            <div className="space-y-6">
              
              {/* Core numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-[#070302] border border-orange-500/10 rounded-2xl p-4">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Active calculations</span>
                  <div className="text-3xl font-mono text-orange-400 font-black mt-1">{adminStats.totalCalculations}</div>
                  <span className="text-[9px] text-gray-500 block">Logged securely in Firestore</span>
                </div>
                <div className="bg-[#070302] border border-orange-500/10 rounded-2xl p-4">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Auspicious Life Path Mode</span>
                  <div className="text-3xl font-mono text-orange-400 font-black mt-1">Number {adminStats.mostCommonLifePath}</div>
                  <span className="text-[9px] text-gray-500 block">Most calculated birth number</span>
                </div>
                <div className="bg-[#070302] border border-orange-500/10 rounded-2xl p-4">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Dominant Destiny Number</span>
                  <div className="text-3xl font-mono text-orange-400 font-black mt-1">Number {adminStats.mostCommonDestinyNumber}</div>
                  <span className="text-[9px] text-gray-500 block">Most calculated name total</span>
                </div>
                <div className="bg-[#070302] border border-orange-500/10 rounded-2xl p-4">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Traffic Conversion Speed</span>
                  <div className="text-3xl font-mono text-orange-400 font-black mt-1">{adminStats.conversionMetrics.conversionRate}%</div>
                  <span className="text-[9px] text-gray-500 block">{adminStats.conversionMetrics.completedCalculations} results / {adminStats.conversionMetrics.totalVisitors} views</span>
                </div>
              </div>

              {/* Graphical representation / logs chart fallback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Traffic history */}
                <div className="bg-[#070302] border border-orange-500/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-serif font-bold uppercase text-orange-400 tracking-wider">Calculations Velocity (Last 7 Days)</h4>
                  <div className="space-y-2 pt-2">
                    {adminStats.calculationHistory.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{item.date}</span>
                        <div className="flex-1 mx-3 h-1.5 bg-orange-950/40 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: `${(item.count / 80) * 100}%` }}></div>
                        </div>
                        <span className="text-orange-400 font-bold">{item.count} calculated</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender distribution */}
                <div className="bg-[#070302] border border-orange-500/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-serif font-bold uppercase text-orange-400 tracking-wider">Calculations Demography By Gender</h4>
                  <div className="space-y-3 pt-2 font-mono text-xs">
                    {[
                      { key: 'male', label: 'Male Seeker', color: 'bg-orange-500' },
                      { key: 'female', label: 'Female Seeker', color: 'bg-amber-500' },
                      { key: 'other', label: 'Other', color: 'bg-yellow-500' },
                      { key: 'prefer_not_to_say', label: 'Not Specified', color: 'bg-gray-600' }
                    ].map((g, i) => {
                      const count = adminStats.genderDistribution[g.key] || 0;
                      const total = Object.values(adminStats.genderDistribution).reduce((a: any, b: any) => a + b, 0) as number;
                      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-300">{g.label}</span>
                            <span className="text-orange-400 font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1 bg-orange-950/30 rounded-full overflow-hidden">
                            <div className={`${g.color} h-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 font-serif">No analytics compiled. Check Firestore connection fallback.</div>
          )}
        </div>
      )}

    </div>
  );
}
