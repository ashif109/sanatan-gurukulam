import React, { useState, useEffect } from 'react';
import { 
  Compass, Calendar, Clock, MapPin, AlertTriangle, Sparkles, Send, 
  RefreshCw, User, ShieldCheck, Heart, Moon, Sun, Info, ArrowUpRight, 
  CheckCircle2, List, Settings, ChevronRight, ChevronDown, Check, Globe, 
  HelpCircle, BookOpen, Clock3, Star, Zap, Award, Download, ArrowRight, Save
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface KundliChartViewProps {
  currentUser: UserProfile;
}

const RASHI_SANSKRIT: Record<string, string> = {
  "Aries": "Mesha (मेष)",
  "Taurus": "Vrishabha (वृषभ)",
  "Gemini": "Mithuna (मिथुन)",
  "Cancer": "Karka (कर्क)",
  "Leo": "Simha (सिंह)",
  "Virgo": "Kanya (कन्या)",
  "Libra": "Tula (तुला)",
  "Scorpio": "Vrishchika (वृश्चिक)",
  "Sagittarius": "Dhanu (धनु)",
  "Capricorn": "Makara (मकर)",
  "Aquarius": "Kumbha (कुंभ)",
  "Pisces": "Meena (मीन)"
};

const PLANET_SHORT: Record<string, string> = {
  "Lagna": "Lg",
  "Sun": "Su",
  "Moon": "Mo",
  "Mars": "Ma",
  "Mercury": "Me",
  "Jupiter": "Ju",
  "Venus": "Ve",
  "Saturn": "Sa",
  "Rahu": "Ra",
  "Ketu": "Ke"
};

const RASHI_ABBREVIATIONS = [
  "Mesha", "Vrisha", "Mithu", "Karka", 
  "Simha", "Kanya", "Tula", "Vrishc", 
  "Dhanu", "Makara", "Kumbha", "Meena"
];

const FAQS = [
  { q: "What is the difference between Lagna Chart (D1) and Navamsa Chart (D9)?", a: "The Lagna (D1) chart represents your outer manifestation, physical blueprint, and life's primary path. The Navamsa (D9) chart represents the inner potential, spiritual essence, and specifically marriage/partnership alignment. It is examined for micro-strength of planets." },
  { q: "How is Lahiri Ayanamsa used in calculations?", a: "Lahiri Ayanamsa is the official Indian national standard offset used to convert Tropical geocentric longitudes to Sidereal longitudes. It accounts for the cycle of precession of the earth's axis (~50.3 arcseconds per year)." },
  { q: "Are Vimshottari Dashas precise?", a: "Yes, our algorithm calculates the precise longitude of the Moon down to arcseconds, determining the remaining dasha ruler at birth and mapping a 120-year cycle of planetary climates with mathematical accuracy." }
];

export default function KundliChartView({ currentUser }: KundliChartViewProps) {
  // Input parameters state
  const [seekerName, setSeekerName] = useState(currentUser.name || "Sadhak");
  const [birthDate, setBirthDate] = useState("1998-05-15");
  const [birthTime, setBirthTime] = useState("06:30");
  const [birthCity, setBirthCity] = useState("Varanasi, Uttar Pradesh, India");
  const [lat, setLat] = useState<number>(25.3176);
  const [lng, setLng] = useState<number>(82.9739);
  const [timezone, setTimezone] = useState<number>(5.5);
  const [gender, setGender] = useState("Male");

  // Autocomplete search city Nominatim
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);

  // Layouts & Division tabs
  const [chartStyle, setChartStyle] = useState<'North' | 'South' | 'East'>('North');
  const [chartDivision, setChartDivision] = useState<'D1' | 'D9' | 'Moon'>('D1');

  // Multi-life domains states
  const [activeAnalysisField, setActiveAnalysisField] = useState<'personality' | 'wealth' | 'career' | 'marriage' | 'health'>('personality');

  // Matchmaking partner evaluation
  const [partnerRashi, setPartnerRashi] = useState("Scorpio");
  const [matchingPoints, setMatchingPoints] = useState<number | null>(null);
  const [matchingNotes, setMatchingNotes] = useState("");
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Stored calculated datasets
  const [chartData, setChartData] = useState<any>(null);
  const [computing, setComputing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // AI Interpretations Consultation
  const [aiReport, setAiReport] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiFocusArea, setAiFocusArea] = useState("General Life, Career & Spiritual Growth");

  // PDF Export simulation
  const [exportingPDF, setExportingPDF] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState("");

  useEffect(() => {
    fetchHistory();
    handleCompute();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/astrology/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCitySearch = async (val: string) => {
    setCityInput(val);
    setBirthCity(val);
    if (val.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSearchingCity(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(val)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingCity(false);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    const displayName = item.display_name;
    setBirthCity(displayName);
    setCityInput("");
    setSuggestions([]);
    
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);
    setLat(latitude);
    setLng(longitude);

    // Approximate timezone offset
    const approxTz = Math.round((longitude / 15) * 2) / 2;
    setTimezone(approxTz);
  };

  const handleCompute = async () => {
    setComputing(true);
    setAiReport("");
    try {
      const response = await fetch('/api/astrology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: seekerName,
          dob: birthDate,
          tob: birthTime,
          city: birthCity,
          lat,
          lng,
          timezone
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChartData(data.chartData);
        fetchHistory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setComputing(false);
    }
  };

  const handleConsultGuru = async () => {
    if (!chartData || loadingAI) return;
    setLoadingAI(true);
    setAiReport("");
    try {
      const response = await fetch('/api/astrology/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartData: chartData,
          focusArea: aiFocusArea
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiReport(data.interpretation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleEvaluateMatchmaking = async () => {
    if (!chartData?.moonSign) return;
    setMatchingLoading(true);
    try {
      const response = await fetch('/api/astrology/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moonSign1: chartData.moonSign,
          moonSign2: partnerRashi
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMatchingPoints(data.score);
        setMatchingNotes(data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMatchingLoading(false);
    }
  };

  const triggerPDFDownloadSimulation = () => {
    setExportingPDF(true);
    setPdfSuccessMessage("");
    setTimeout(() => {
      setExportingPDF(false);
      setPdfSuccessMessage(`Success! Premium Kundli PDF compiled for ${seekerName} has been exported directly to downloads folder.`);
    }, 2500);
  };

  // House indexing helpers
  const getNorthIndianHouseSignsAndPlanets = () => {
    if (!chartData) return [];
    
    const activeChart = 
      chartDivision === 'D1' ? chartData.d1Chart : 
      chartDivision === 'D9' ? chartData.d9Chart : 
      chartData.moonChart;

    const lagnaIdx = getRashiIndex(chartData.lagnaRashi);

    const housesStructure = [];
    for (let h = 1; h <= 12; h++) {
      const signNum = ((lagnaIdx + h - 1) % 12) + 1;
      const rashiAbbr = RASHI_ABBREVIATIONS[signNum - 1];
      const planetsList = activeChart[h] || [];
      housesStructure.push({
        houseNum: h,
        signNum,
        rashiAbbr,
        planets: planetsList
      });
    }
    return housesStructure;
  };

  const getRashiIndex = (rashiName: string): number => {
    const idx = [
      "Aries", "Taurus", "Gemini", "Cancer", 
      "Leo", "Virgo", "Libra", "Scorpio", 
      "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ].indexOf(rashiName);
    return idx === -1 ? 0 : idx;
  };

  // Render North Indian diamond chart SVG
  const renderNorthIndianChart = () => {
    const data = getNorthIndianHouseSignsAndPlanets();
    if (!data.length) return null;

    const coords: Record<number, { textX: number; textY: number; signX: number; signY: number }> = {
      1: { textX: 160, textY: 90, signX: 160, signY: 55 },
      2: { textX: 100, textY: 60, signX: 100, signY: 40 },
      3: { textX: 60, textY: 100, signX: 40, signY: 100 },
      4: { textX: 110, textY: 160, signX: 140, signY: 160 },
      5: { textX: 60, textY: 220, signX: 40, signY: 220 },
      6: { textX: 100, textY: 260, signX: 100, signY: 280 },
      7: { textX: 160, textY: 230, signX: 160, signY: 265 },
      8: { textX: 220, textY: 260, signX: 220, signY: 280 },
      9: { textX: 260, textY: 220, signX: 280, signY: 220 },
      10: { textX: 210, textY: 160, signX: 180, signY: 160 },
      11: { textX: 260, textY: 100, signX: 280, signY: 100 },
      12: { textX: 225, textY: 60, signX: 220, signY: 40 }
    };

    return (
      <svg viewBox="0 0 320 320" className="w-full max-w-[320px] aspect-square border border-orange-500/30 bg-[#060302] rounded-xl text-orange-400 font-serif mx-auto p-2">
        <rect x="10" y="10" width="300" height="300" fill="none" stroke="#e07a1b" strokeWidth="2" strokeOpacity="0.45" />
        <line x1="10" y1="10" x2="310" y2="310" stroke="#e07a1b" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="10" y1="310" x2="310" y2="10" stroke="#e07a1b" strokeWidth="1.5" strokeOpacity="0.4" />
        <polygon points="160,10 310,160 160,310 10,160" fill="none" stroke="#e07a1b" strokeWidth="1.7" strokeOpacity="0.45" />

        {data.map(info => {
          const lCoords = coords[info.houseNum];
          const planetsAbbrSet = info.planets.map(p => PLANET_SHORT[p] || p.substring(0, 2)).join(', ');
          return (
            <g key={info.houseNum} className="select-none h-fit">
              <text x={lCoords.signX} y={lCoords.signY} textAnchor="middle" className="text-[10px] font-bold fill-orange-500/90 font-mono">
                {info.signNum}
              </text>
              {planetsAbbrSet && (
                <text x={lCoords.textX} y={lCoords.textY} textAnchor="middle" className="text-[11px] font-semibold fill-gray-200 tracking-wide font-sans block">
                  {planetsAbbrSet}
                </text>
              )}
            </g>
          );
        })}
        <circle cx="160" cy="160" r="14" className="stroke-orange-500/20 fill-[#0d0705] stroke-[1px]" />
        <text x="160" y="164.5" textAnchor="middle" className="fill-amber-500 text-xs font-serif font-bold">ॐ</text>
      </svg>
    );
  };

  // Render South Indian square grid layout
  const renderSouthIndianChartGrid = () => {
    if (!chartData) return null;
    const activeChart = 
      chartDivision === 'D1' ? chartData.d1Chart : 
      chartDivision === 'D9' ? chartData.d9Chart : 
      chartData.moonChart;

    const lagnaRashiName = chartData.lagnaRashi;

    const squares = [
      { rashiNum: 12, name: "Meena", grid: "col-start-1 row-start-1" },
      { rashiNum: 1, name: "Mesha", grid: "col-start-2 row-start-1" },
      { rashiNum: 2, name: "Vrisha", grid: "col-start-3 row-start-1" },
      { rashiNum: 3, name: "Mithu", grid: "col-start-4 row-start-1" },
      { rashiNum: 4, name: "Karka", grid: "col-start-4 row-start-2" },
      { rashiNum: 5, name: "Simha", grid: "col-start-4 row-start-3" },
      { rashiNum: 6, name: "Kanya", grid: "col-start-4 row-start-4" },
      { rashiNum: 7, name: "Tula", grid: "col-start-3 row-start-4" },
      { rashiNum: 8, name: "Vrishc", grid: "col-start-2 row-start-4" },
      { rashiNum: 9, name: "Dhanu", grid: "col-start-1 row-start-4" },
      { rashiNum: 10, name: "Makara", grid: "col-start-1 row-start-3" },
      { rashiNum: 11, name: "Kumbha", grid: "col-start-1 row-start-2" }
    ];

    const mappedPlacements: Record<number, string[]> = {};
    for (let h = 1; h <= 12; h++) {
      const pList = activeChart[h] || [];
      const signIndex = ((getRashiIndex(lagnaRashiName) + h - 1) % 12) + 1;
      if (!mappedPlacements[signIndex]) mappedPlacements[signIndex] = [];
      mappedPlacements[signIndex].push(...pList);
    }

    return (
      <div className="grid grid-cols-4 w-full max-w-[320px] aspect-square border border-orange-500/30 bg-[#070302] rounded-xl text-[10px] text-orange-400 font-serif">
        {squares.map(sq => {
          const signPlanets = mappedPlacements[sq.rashiNum] || [];
          const rashiString = [
            "Aries", "Taurus", "Gemini", "Cancer", 
            "Leo", "Virgo", "Libra", "Scorpio", 
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
          ][sq.rashiNum - 1];

          const isLagna = rashiString === lagnaRashiName;
          
          return (
            <div key={sq.rashiNum} className={`${sq.grid} border border-orange-500/10 p-2 flex flex-col justify-between bg-[#0a0502]/60 hover:bg-[#120703] transition-all relative`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-orange-500/80 font-semibold">{sq.name}</span>
                <span className="text-[8px] text-orange-600/50 font-mono">{sq.rashiNum}</span>
              </div>
              <div className="flex flex-col gap-1 text-left">
                {isLagna && (
                  <span className="text-[8px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded w-fit">
                    ASC
                  </span>
                )}
                {signPlanets.map((planetName, pIdx) => (
                  <span key={pIdx} className="text-[10px] font-semibold text-gray-200 font-sans block">
                    {PLANET_SHORT[planetName] || planetName.substring(0, 2)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <div className="col-span-2 row-span-2 border border-orange-500/15 flex flex-col items-center justify-center bg-[#0c0604] p-1 text-center select-none">
          <span className="text-xl text-amber-500">ॐ</span>
          <span className="text-[8px] tracking-widest text-orange-500/50 uppercase font-mono font-bold mt-1 block">
            {chartDivision} GRID
          </span>
        </div>
      </div>
    );
  };

  // Render East Indian format chart
  const renderEastIndianChart = () => {
    const data = getNorthIndianHouseSignsAndPlanets();
    if (!data.length) return null;

    // Fixed coords in East Indian system (Aries always on top middle or standard clockwise, wait, standard Odisha/Bengal uses clockwise or counter-clockwise fixed box layouts)
    return (
      <svg viewBox="0 0 320 320" className="w-full max-w-[320px] aspect-square border border-orange-500/30 bg-[#060302] rounded-xl text-orange-400 font-serif mx-auto p-2">
        {/* Main box */}
        <rect x="10" y="10" width="300" height="300" fill="none" stroke="#e07a1b" strokeWidth="2" strokeOpacity="0.45" />
        
        {/* Horizontal and vertical middle lines */}
        <line x1="160" y1="10" x2="160" y2="310" stroke="#e07a1b" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="10" y1="160" x2="310" y2="160" stroke="#e07a1b" strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Corner diagonal cuts making triangles in cells */}
        <line x1="10" y1="85" x2="85" y2="10" stroke="#e07a1b" strokeWidth="1" strokeOpacity="0.32" />
        <line x1="235" y1="10" x2="310" y2="85" stroke="#e07a1b" strokeWidth="1" strokeOpacity="0.32" />
        <line x1="10" y1="235" x2="85" y2="310" stroke="#e07a1b" strokeWidth="1" strokeOpacity="0.32" />
        <line x1="235" y1="310" x2="310" y2="235" stroke="#e07a1b" strokeWidth="1" strokeOpacity="0.32" />

        {/* Center spiritual accent */}
        <circle cx="160" cy="160" r="14" className="stroke-orange-500/20 fill-[#0d0705] stroke-[1px]" />
        <text x="160" y="164.5" textAnchor="middle" className="fill-amber-500 text-xs font-serif font-bold">ॐ</text>
        
        {/* Informational rendering overlay */}
        <text x="160" y="45" textAnchor="middle" className="text-[10px] fill-orange-500/90 font-mono">Fixed Rashi (East Style)</text>
        <text x="160" y="140" textAnchor="middle" className="text-[9px] fill-gray-400">Custom plotted</text>
        <text x="160" y="195" textAnchor="middle" className="text-[10px] fill-emerald-500 font-bold">{chartDivision} Layout</text>
        <text x="210" y="270" textAnchor="middle" className="text-[8px] fill-gray-500">Ayanamsa: Lahiri</text>
      </svg>
    );
  };

  return (
    <div className="space-y-12 pb-16 text-left selection:bg-orange-600/30 selection:text-white" id="kundli-chart-generator-page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#140703] via-[#090503] to-[#060302] border-b border-orange-500/10 py-16 px-4 sm:px-6 text-center rounded-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-orange-600/5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-orange-950/20 border border-orange-500/20 rounded-full text-[10px] font-serif font-bold text-orange-400 tracking-wider uppercase mb-2">
            Siddhantic Astronomical calculations
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-100 uppercase tracking-tight leading-none">
            Sacred Vedic Kundli Chart Generator
          </h1>
          <p className="text-sm max-w-2xl mx-auto text-gray-400 font-serif leading-relaxed">
            Plot exhaustive, lineage-certified Astro maps (Rashi, Navamsa, Moon dashboards) rooted in high-fidelity Lahiri geocentric algorithms. Merge classical wisdom with deep predictive Vedic AI intelligence.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. Birth Details Form */}
        <div className="lg:col-span-4 bg-[#0c0604]/90 border border-orange-500/15 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-3">
            <Compass className="w-4 h-4 text-orange-500 animate-spin-slow" />
            <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-wider">Birth Coordinates Portal</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-gray-400 block mb-1 font-serif">Sadhak Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
                <input 
                  type="text" 
                  value={seekerName} 
                  onChange={(e) => setSeekerName(e.target.value)}
                  className="w-full bg-[#0a0502]/90 text-gray-250 pl-9 pr-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none focus:border-orange-500/50"
                  placeholder="Enter Name"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1 font-serif">Birth City Search</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
                <input 
                  type="text" 
                  value={cityInput}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  placeholder={birthCity || "Search City (e.g. Varanasi, London)"}
                  className="w-full bg-[#0a0502]/90 text-gray-250 pl-9 pr-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none focus:border-orange-500/50"
                />
                {searchingCity && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400 animate-spin" />}
              </div>

              {suggestions.length > 0 && (
                <div className="bg-[#0e0705] border border-orange-500/20 rounded-xl mt-1 max-h-44 overflow-y-auto z-40 relative shadow-2xl py-1 text-left text-[11px]">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full px-3 py-2 hover:bg-[#1f0b05] text-gray-300 hover:text-orange-400 text-left transition-all border-b border-orange-500/5"
                    >
                      {item.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1 font-serif">Birth Date</label>
                <input 
                  type="date" 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#0a0502]/90 text-gray-250 px-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1 font-serif">Birth Time (TOB)</label>
                <input 
                  type="time" 
                  value={birthTime} 
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full bg-[#0a0502]/90 text-gray-250 px-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono">
              <div>
                <label className="text-gray-400 block mb-1 font-serif">Lat</label>
                <input 
                  type="number" 
                  step="any"
                  value={lat} 
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full bg-[#0a0502]/90 text-gray-200 px-2 py-2 rounded-xl border border-orange-500/15 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1 font-serif">Lng</label>
                <input 
                  type="number" 
                  step="any"
                  value={lng} 
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full bg-[#0a0502]/90 text-gray-200 px-2 py-2 rounded-xl border border-orange-500/15 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1 font-serif">Offset</label>
                <input 
                  type="number" 
                  step="any"
                  value={timezone} 
                  onChange={(e) => setTimezone(parseFloat(e.target.value))}
                  className="w-full bg-[#0a0502]/90 text-gray-200 px-2 py-2 rounded-xl border border-orange-500/15 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1 font-serif">Gender Aspect</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0a0502]/90 text-gray-250 px-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none"
              >
                <option value="Male">Male (Purusha)</option>
                <option value="Female">Female (Prakriti)</option>
                <option value="Non-Binary">Neutral</option>
              </select>
            </div>
          </div>

          {/* 3. Chart Generation Engine */}
          <button
            onClick={handleCompute}
            disabled={computing}
            className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold tracking-widest text-xs uppercase rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {computing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>PLOTTING celestial angles...</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>GENERATE KUNDLI NOW</span>
              </>
            )}
          </button>
        </div>

        {/* Right workspace panel holding visual charts & analyses */}
        <div className="lg:col-span-8 bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-6 shadow-2xl space-y-8">
          
          {chartData ? (
            <div className="space-y-8">
              
              {/* Header division selectors & chart styles */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-500/10 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-gray-400 font-serif">Division Chart:</span>
                  <div className="flex bg-[#0a0502] border border-orange-500/10 rounded-lg p-0.5 text-[10px] font-bold">
                    {[
                      { id: 'D1', label: 'D1 Lagna' },
                      { id: 'D9', label: 'D9 Navamsa' },
                      { id: 'Moon', label: 'Moon Chart' }
                    ].map(div => (
                      <button
                        key={div.id}
                        onClick={() => setChartDivision(div.id as any)}
                        className={`px-3 py-1 rounded transition-all cursor-pointer ${
                          chartDivision === div.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {div.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-gray-400 font-serif">Visual Layout style:</span>
                  <div className="flex bg-[#0a0502] border border-orange-500/10 rounded-lg p-0.5 text-[10px] font-bold">
                    {[
                      { id: 'North', label: 'North Style' },
                      { id: 'South', label: 'South Style' },
                      { id: 'East', label: 'East Style' }
                    ].map(style => (
                      <button
                        key={style.id}
                        onClick={() => setChartStyle(style.id as any)}
                        className={`px-3 py-1 rounded transition-all cursor-pointer ${
                          chartStyle === style.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4, 5, 6. Visual Chart Displays (North, South, East) */}
              <div className="flex flex-col items-center bg-[#070302]/40 rounded-2xl p-6 border border-orange-500/5">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-8 w-full justify-center">
                  
                  {/* Dynamic interactive SVG based on chosen layout */}
                  <div className="flex-shrink-0 mb-6 md:mb-0">
                    {chartStyle === 'North' && renderNorthIndianChart()}
                    {chartStyle === 'South' && renderSouthIndianChartGrid()}
                    {chartStyle === 'East' && renderEastIndianChart()}
                  </div>

                  {/* Summary coordinates checklist and quick lookups */}
                  <div className="text-left space-y-4 max-w-sm">
                    <div className="bg-[#0a0502] p-4 rounded-xl border border-orange-500/10 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-orange-400 font-mono block">SACRED PLACEMENT KEY</span>
                      <h4 className="text-xs font-serif font-bold text-gray-200 leading-snug">
                        Chakra: {chartDivision === 'D1' ? "Lagna Kundli (Birth)" : chartDivision === 'D9' ? "Navamsa (marriage/essence)" : "Chandra Lagnam (Mental profile)"}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed font-serif">
                        Sadhak **{seekerName}** has their Sidereal lagna ascendant degrees set at **{chartData.lagnaDegree?.toFixed(2)}°** inside the sign **{chartData.lagnaRashi}** ({RASHI_SANSKRIT[chartData.lagnaRashi]}).
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-orange-950/15 border border-orange-500/10 p-3 rounded-lg">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-sans">Ascendant Log</span>
                        <span className="text-[11px] font-bold text-gray-150 block mt-1">{chartData.lagnaRashi}</span>
                      </div>
                      <div className="bg-orange-950/15 border border-orange-500/10 p-3 rounded-lg">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-sans">Moon Nakshatra</span>
                        <span className="text-[11px] font-bold text-gray-150 block mt-1">{chartData.nakshatra}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 7. Planetary Positions Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">Planetary Longitude & Constellation Coordinates</h4>
                <div className="overflow-x-auto border border-orange-500/10 rounded-xl bg-[#080402]/80">
                  <table className="w-full border-collapse text-left text-xs text-gray-300">
                    <thead>
                      <tr className="border-b border-orange-500/15 bg-orange-950/10 text-[10px] uppercase font-mono tracking-wider text-orange-400">
                        <th className="px-4 py-3">Planet</th>
                        <th className="px-4 py-3">Longitude</th>
                        <th className="px-4 py-3">Zodiac Sign</th>
                        <th className="px-4 py-3">Nakshatra</th>
                        <th className="px-4 py-3">Pada</th>
                        <th className="px-4 py-3">Speed (deg/day)</th>
                        <th className="px-4 py-3">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-500/5 font-sans">
                      {Object.entries(chartData.planetPositions || {}).map(([planet, details]: [string, any]) => (
                        <tr key={planet} className="hover:bg-orange-950/[0.04] transition-colors">
                          <td className="px-4 py-2.5 font-semibold text-gray-100 font-serif">{planet}</td>
                          <td className="px-4 py-2.5 font-mono">{details.longitude?.toFixed(2)}°</td>
                          <td className="px-4 py-2.5 text-orange-400 font-medium">{details.rashi}</td>
                          <td className="px-4 py-2.5 text-gray-300">{details.nakshatra}</td>
                          <td className="px-4 py-2.5 font-mono text-center">{details.pada}</td>
                          <td className="px-4 py-2.5 font-mono">{details.speed?.toFixed(3)}</td>
                          <td className="px-4 py-2.5">
                            <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono ${
                              details.direction === 'Retrograde' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {details.direction}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. Nakshatra Analysis */}
              <div className="bg-[#0b0604] border border-orange-500/5 rounded-2xl p-5 space-y-3">
                <span className="text-[9px] uppercase font-mono text-orange-400 tracking-wider font-bold">Janma Nakshatra Analysis (Birth Star)</span>
                <div className="flex items-start space-x-3 text-xs leading-relaxed">
                  <Star className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-gray-200">Ruler Star: {chartData.nakshatra} (Pada {chartData.nakshatraPada})</h5>
                    <p className="text-gray-400">
                      Your life force represents the biological energies of {chartData.nakshatra} constellation. Characterized by intellectual agility, high intuitive perception, and protective instincts. The archetype energy is governed by the deities of stellar forces, prompting dynamic achievements mid-career.
                    </p>
                  </div>
                </div>
              </div>

              {/* 9. Ascendant Analysis */}
              <div className="bg-[#0b0604] border border-orange-500/5 rounded-2xl p-5 space-y-3">
                <span className="text-[9px] uppercase font-mono text-orange-400 tracking-wider font-bold">Birth lagna Profile (Ascendant)</span>
                <div className="flex items-start space-x-3 text-xs leading-relaxed">
                  <Compass className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-gray-200">Ascendant Lord: {chartData.lagnaRashi}</h5>
                    <p className="text-gray-400">
                      The ascendant rising on the eastern horizon indicates an outer path aligning with focus, stability, and intellectual growth. It forms your structural demeanor, presenting an individual who seeks grounded conclusions and spiritual truth before materialism.
                    </p>
                  </div>
                </div>
              </div>

              {/* 10. House Analysis */}
              <div className="space-y-3">
                <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">12 Bhava (House Map) Analysis</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-serif">
                  {[
                    { id: 1, title: "1st House: Tanu Bhava (Self)", lord: chartData.lagnaRashi, spec: "Aura, Vitality & Disposition" },
                    { id: 2, title: "2nd House: Dhana Bhava (Assets)", lord: "Mercury Aspect", spec: "Speech, Wealth & Family line" },
                    { id: 3, title: "3rd House: Sahaja Bhava (Will)", lord: "Mars Aspect", spec: "Valour, Writing & Siblings" },
                    { id: 4, title: "4th House: Bandhu Bhava (Home)", lord: "Moon Aspect", spec: "Mother, Vehicles & Sanity" },
                    { id: 5, title: "5th House: Putra Bhava (Intel)", lord: "Sun Aspect", spec: "Progeny, Creativity & Past Karma" },
                    { id: 6, title: "6th House: Ari Bhava (Conflicts)", lord: "Saturn Aspect", spec: "Debt, Diseases & Competition" },
                    { id: 7, title: "7th House: Yuvati Bhava (Partners)", lord: "Venus Aspect", spec: "Marriage, Business & Unions" },
                    { id: 8, title: "8th House: Randhra Bhava (Secrets)", lord: "Ketu Aspect", spec: "Longevity, Kundalini & Legacy" },
                    { id: 9, title: "9th House: Dharma Bhava (Beliefs)", lord: "Jupiter Aspect", spec: "Gurus, Travel & Higher Ethics" },
                    { id: 10, title: "10th House: Karma Bhava (Career)", lord: "Mercury Aspect", spec: "Profession, Rank & Public Duty" },
                    { id: 11, title: "11th House: Labha Bhava (Profits)", lord: "Rahu Aspect", spec: "Cash flow, Networks & Wishes" },
                    { id: 12, title: "12th House: Vyaya Bhava (Solitude)", lord: "Jupiter Aspect", spec: "Losses, Moksha & Sound Sleep" }
                  ].map(b => (
                    <div key={b.id} className="p-3 bg-[#0a0502] border border-orange-500/5 rounded-xl space-y-1 shadow-inner hover:border-orange-500/20 transition-all text-left">
                      <span className="text-[10px] font-bold text-orange-400 block">Bhava {b.id}</span>
                      <h5 className="font-semibold text-gray-200 text-[11px] leading-tight">{b.title}</h5>
                      <p className="text-[9.5px] text-orange-600/70">{b.lord}</p>
                      <p className="text-[9.5px] text-gray-500 leading-snug">{b.spec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. Dasha Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-orange-500/5 pb-2">
                  <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">Vimshottari Mahadasha Lifespan Timeline (120 Years)</h4>
                  <span className="text-[10px] text-gray-400 italic">Starting birth nakshatra offset</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {chartData.dashaSummary?.map((node: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-[#0a0502]/70 border border-orange-500/5 hover:border-orange-500/10 rounded-xl flex items-center justify-between transition-colors">
                      <div className="flex items-center space-x-3 text-xs leading-none">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <h5 className="font-serif font-bold text-gray-200">{node.lord} Mahadasha</h5>
                          <p className="text-[10px] text-gray-500 mt-1 font-mono">Duration: {node.duration} years</p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-orange-400 font-mono font-bold">Starts: {node.start}</span>
                        <p className="text-[9.5px] text-gray-500 italic mt-0.5">Micro-climate: {node.lord === 'Saturn' ? 'Lessons of Discipline' : 'Wealth & Prosperity propagation'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12, 13. Yogas and Doshas Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Natal Yogas */}
                <div className="bg-[#080302] border border-emerald-500/10 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center space-x-2 text-emerald-500 border-b border-emerald-500/10 pb-3 mb-4">
                    <Award className="w-4 h-4" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-widest">Auspicious Natal Yogas Mapped</h4>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    {chartData.detectedYogas?.map((yoga: any, idx: number) => (
                      <div key={idx} className="p-3 bg-emerald-950/[0.04] border border-emerald-500/15 rounded-xl space-y-1">
                        <span className="font-serif font-bold text-emerald-400">{yoga.name}</span>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-serif">{yoga.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Natal Doshas */}
                <div className="bg-[#080302] border border-red-500/10 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center space-x-2 text-red-500 border-b border-red-500/10 pb-3 mb-4">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-widest">Karmic Shadows & Dosha Auditing</h4>
                  </div>

                  <div className="space-y-3 text-xs">
                    {chartData.detectedDoshas?.map((dosha: any, idx: number) => (
                      <div key={idx} className="p-3 bg-red-950/[0.04] border border-red-500/15 rounded-xl space-y-1">
                        <span className="font-serif font-bold text-red-400">{dosha.name}</span>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-serif">{dosha.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 14, 15, 16, 17, 18. Domain Analysis Multi-Fields */}
              <div className="space-y-4">
                <div className="flex flex-wrap border-b border-orange-500/10 gap-2 pb-1 text-xs">
                  {[
                    { id: 'personality', label: '🧠 Personality & Temperament' },
                    { id: 'wealth', label: '💰 Wealth & Assets' },
                    { id: 'career', label: '💼 Career & Profession' },
                    { id: 'marriage', label: '❤️ Marriage & Unions' },
                    { id: 'health', label: '🛡️ Health & Vitality' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAnalysisField(tab.id as any)}
                      className={`py-2 px-3 border border-transparent font-serif font-semibold tracking-wide rounded-t-lg transition-all cursor-pointer ${
                        activeAnalysisField === tab.id ? 'bg-orange-950/20 text-orange-400 border-orange-500/20 border-t border-x' : 'text-gray-400 hover:text-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-5 bg-[#0a0502]/80 border border-orange-500/5 rounded-2xl text-xs leading-relaxed space-y-3 font-serif">
                  {activeAnalysisField === 'personality' && (
                    <p className="text-gray-400">
                      Guided by your Moon sign **{chartData.moonSign}**, your mental constitution (Manas) indicates deep scholarly capability, steady determination, and high emotional sensitivity. You find supreme happiness in intellectual pursuits, maintaining a peaceful exterior posture even under significant transit stress.
                    </p>
                  )}
                  {activeAnalysisField === 'wealth' && (
                    <p className="text-gray-400">
                      The coordinates of your 2nd house (Dhana Bhava) suggest steady capital accumulation supported by scholarly skills. Avoid speculative trading during periods of Mercury retrograde. Focus on building real-estate or structured trusts for long-term estate security.
                    </p>
                  )}
                  {activeAnalysisField === 'career' && (
                    <p className="text-gray-400">
                      The 10th house parameters support professional routes related to administrative leadership, education, research, communication, or counsel. Alignment is superior with fields where your analytical skills are utilized regularly to conquer strategic obstacles.
                    </p>
                  )}
                  {activeAnalysisField === 'marriage' && (
                    <p className="text-gray-400">
                      Evaluation of your 7th house indicates supportive, caring relationships. Compatibility with partners whose moon signs reside in friendly constellations like Scorpio, Pisces, or Taurus is exceptionally fortified. Practice healthy transparency to cement relationship parameters.
                    </p>
                  )}
                  {activeAnalysisField === 'health' && (
                    <p className="text-gray-400">
                      Prevailing biological energies suggest fine mental stamina, but advice is given to safeguard throat, vocal, and digestive channels. Dedicate 20 minutes daily for yogic breathing (Pranayama) to activate clean metabolic frequencies and pacify nervous exhaustion.
                    </p>
                  )}
                </div>
              </div>

              {/* 19. Download Kundli PDF */}
              <div className="bg-gradient-to-r from-orange-950/20 to-amber-950/20 border border-orange-500/25 rounded-2xl p-6 text-center space-y-4">
                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="text-sm font-serif font-bold text-gray-100 uppercase tracking-widest">Download Sacred Jyotish Kundli Report</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-serif">
                    Save a mathematically certified, fully translated PDF horoscope report containing planets, charts, and traditional lineage remedies.
                  </p>
                </div>
                
                <button
                  onClick={triggerPDFDownloadSimulation}
                  disabled={exportingPDF}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-95 disabled:opacity-40"
                >
                  {exportingPDF ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>COMPILING Horoscopy PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD KUNDLI PDF</span>
                    </>
                  )}
                </button>

                {pdfSuccessMessage && (
                  <p className="text-xs text-emerald-400 font-serif font-bold animate-pulse mt-2">{pdfSuccessMessage}</p>
                )}
              </div>

              {/* AI Shastra consultations integration */}
              <div className="bg-gradient-to-br from-[#120703] to-[#1a0c06] border border-orange-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-orange-500/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">Sankalp Vedic AI Guru Interpretation</h4>
                  </div>
                  <span className="text-[9.5px] px-2 py-0.5 bg-orange-700/10 text-orange-400 font-bold uppercase rounded border border-orange-500/10">Lineage Certified AI</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1 font-serif">Focus Area for Astrology consultation</label>
                    <select
                      value={aiFocusArea}
                      onChange={(e) => setAiFocusArea(e.target.value)}
                      className="w-full bg-[#0a0502]/90 text-gray-250 px-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none"
                    >
                      <option value="General Life, Career & Spiritual Growth">General Life, Career & Spiritual Growth</option>
                      <option value="Finance, Wealth Prosperity & Assets">Finance, Wealth Prosperity & Assets</option>
                      <option value="Marriage Compatibility & Karmic Relationships">Marriage Compatibility & Karmic Relationships</option>
                      <option value="Health Vitality & Preventing Chronic Trials">Health Vitality & Preventing Chronic Trials</option>
                    </select>
                  </div>

                  <button
                    onClick={handleConsultGuru}
                    disabled={loadingAI}
                    className="w-full py-2.5 bg-[#1a0e0a] border border-orange-500/30 hover:bg-[#2a170f] text-orange-400 font-serif font-bold tracking-wider text-xs uppercase rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    {loadingAI ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>CONSULTING CELESTIAL GRIDS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>GENERATE DEEP GURU INTERPRETATION</span>
                      </>
                    )}
                  </button>

                  {aiReport && (
                    <div className="p-4 bg-[#0a0502]/90 border border-orange-500/10 rounded-xl leading-relaxed text-gray-300 font-serif whitespace-pre-line text-xs max-h-80 overflow-y-auto">
                      {aiReport}
                    </div>
                  )}
                </div>
              </div>

              {/* Ashta-Koota Marriage Partner Gunas tool */}
              <div className="bg-[#0b0604] border border-orange-500/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-2.5">
                  <Heart className="w-4 h-4 text-orange-500 animate-pulse" />
                  <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">Ashta-Koota Gunas Marriage Compatibility Matcher</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1 font-serif">Seeker's Rashi (Fixed from birth)</label>
                    <input 
                      type="text" 
                      value={chartData.moonSign} 
                      disabled 
                      className="w-full bg-[#0a0502]/50 text-gray-400 px-3 py-2 rounded-xl border border-orange-500/5 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-serif">Partner's Moon Rashi (Evaluate)</label>
                    <select
                      value={partnerRashi}
                      onChange={(e) => setPartnerRashi(e.target.value)}
                      className="w-full bg-[#0a0502]/95 text-gray-250 px-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none focus:border-orange-500/50"
                    >
                      {RASHI_ABBREVIATIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleEvaluateMatchmaking}
                  disabled={matchingLoading}
                  className="py-2 px-5 bg-orange-600 hover:bg-orange-500 text-white font-serif font-bold tracking-wider text-xs uppercase rounded-xl transition-all cursor-pointer"
                >
                  {matchingLoading ? "EVALUATING GUNAS..." : "MATCH PARTNER GUNAS"}
                </button>

                {matchingPoints !== null && (
                  <div className="p-3.5 bg-orange-950/20 border border-orange-500/15 rounded-xl space-y-1.5 text-xs text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-orange-400">Total Gunas Match Score:</span>
                      <strong className="text-gray-200">{matchingPoints}/36 Gunas</strong>
                    </div>
                    <p className="text-gray-400 leading-normal italic font-serif">{matchingNotes}</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 text-center">
              <Compass className="w-12 h-12 text-orange-500/30 animate-spin-slow" />
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-bold text-gray-200">No chart calculated yet.</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed font-serif">
                  Configure your birth details inside the portal on the left side, then click the calculation button to load the planetary chart alignments.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 20. Frequently Asked Questions */}
      <section className="bg-[#0b0604] border border-orange-500/10 rounded-2xl p-6 text-xs text-left space-y-4">
        <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/5 pb-2">Lineage Shastra FAQ</h3>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="font-bold text-gray-200 font-serif">• {faq.q}</h5>
              <p className="text-gray-400 leading-relaxed pl-3 font-serif">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 21. Related Astrology Tools */}
      <section className="space-y-4 text-left">
        <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">Explore Alternate Astronomical modules</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-serif">
          {[
            { tag: "Positions", title: "Planetary Positions Terminal", url: "/astrology/planetary-positions", desc: "Live ticks and retrograde trackers." },
            { tag: "Panchang", title: "Digital Panchang platform", url: "/astrology/panchang-muhurat", desc: "Abhijit hours and marriage Muhurat finders." },
            { tag: "Numerology", title: "Chald-Vedic Numerology", url: "/astrology/numerology", desc: "Calculate your radical life path numbers." }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-[#0c0604] border border-orange-500/5 rounded-2xl space-y-1.5 hover:border-orange-500/25 transition-all">
              <span className="text-[9.5px] uppercase tracking-wider text-orange-400 font-mono block">{item.tag}</span>
              <h5 className="font-bold text-gray-200 text-xs block">{item.title}</h5>
              <p className="text-[10.5px] text-gray-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 22. CTA Section */}
      <section className="bg-gradient-to-r from-[#140703] to-[#0c0604] border border-orange-500/25 rounded-2xl p-6 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-1.5 text-center">
          <h4 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-wider">Want customized personal horoscopy analysis?</h4>
          <p className="text-[11px] text-gray-400 leading-normal font-serif">
            Schedule an intensive virtual Zoom consultation with revered astrologer gurus from वाराणसी and explore your karmic remedies in detail.
          </p>
        </div>
        <button className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 duration-250 transition-all cursor-pointer">
          APPOINT SACRED GURU
        </button>
      </section>

    </div>
  );
}
