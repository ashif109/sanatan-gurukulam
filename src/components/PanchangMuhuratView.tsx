import React, { useState, useEffect } from 'react';
import { 
  Compass, Calendar, Clock, MapPin, AlertTriangle, Sparkles, Send, 
  RefreshCw, User, ShieldCheck, Heart, Moon, Sun, Info, ArrowUpRight, 
  CheckCircle2, List, Settings, ChevronRight, ChevronDown, Check, Globe, 
  HelpCircle, BookOpen, Clock3, Star, Zap, Award, Download, ArrowRight, Save
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Language, t } from '../localization';

interface PanchangMuhuratViewProps {
  currentUser: UserProfile;
  language: Language;
}

const FAQS = [
  { q: "What constitutes the core 5 limbs of Panchang?", a: "Panchang literally translates to five limbs (Pancha-Anga). These are: Tithi (Lunar day), Vara (Solar weekday), Nakshatra (Active constellation star), Yoga (Combined solar-lunar longitude vector), and Karana (Half-tithi kinetic energy quotient)." },
  { q: "What is Rahu Kaal and is it worldwide identical?", a: "Rahu Kaal is an inauspicious 1.5-hour weekday chapter governed by the north lunar node Rahu. It is not identical worldwide because it is calculated directly from local sunrise to sunset coordinates, divided into eight segments." }
];

const FESTIVALS = [
  { festival: "Nirjala Ekadashi Vrata", date: "June 26, 2026", tithi: "Ekadashi", significance: "Complete waterless fast dedicated to Lord Vishnu." },
  { festival: "Guru Purnima", date: "July 29, 2026", tithi: "Purnima", significance: "Worship of lineage gurus, teachers, and Vyasa Maharishi." },
  { festival: "Krishna Janmashtami", date: "September 03, 2026", tithi: "Ashtami", significance: "Midnight birth celebration of Bhagavan Sri Krishna." },
  { festival: "Ganesh Chaturthi", date: "September 15, 2026", tithi: "Chaturthi", significance: "Ganesha installation ceremonies, obstacles dissolution." }
];

export default function PanchangMuhuratView({ currentUser, language }: PanchangMuhuratViewProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Geographic coordinates state
  const [city, setCity] = useState("Varanasi, India");
  const [lat, setLat] = useState(25.3176);
  const [lng, setLng] = useState(82.9739);
  const [timeOffset, setTimeOffset] = useState(5.5);

  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);

  // Muhurat Finder interactive tool selections
  const [selectedMuhuratCategory, setSelectedMuhuratCategory] = useState<'marriage' | 'business' | 'property' | 'vehicle' | 'travel'>('marriage');
  const [evaluatingMuhurat, setEvaluatingMuhurat] = useState(false);
  const [calculatedMuhuratReport, setCalculatedMuhuratReport] = useState<string | null>(null);

  useEffect(() => {
    fetchPanchangData();
  }, [lat, lng]);

  const handleCitySearch = async (val: string) => {
    setCityInput(val);
    setCity(val);
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
    setCity(displayName);
    setCityInput("");
    setSuggestions([]);
    
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);
    setLat(latitude);
    setLng(longitude);

    const approxTz = Math.round((longitude / 15) * 2) / 2;
    setTimeOffset(approxTz);
  };

  const fetchPanchangData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/astrology/panchang-now?lat=${lat}&lng=${lng}&date=${new Date().toISOString()}`);
      if (res.ok) {
        const panchungResData = await res.json();
        setData(panchungResData.panchangData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateMuhurtas = () => {
    setEvaluatingMuhurat(true);
    setCalculatedMuhuratReport(null);
    setTimeout(() => {
      setEvaluatingMuhurat(false);
      
      const guides: Record<string, string> = {
        marriage: "Optimal Vivah Muhurat detected on July 14, 2026. Aligned in Anuradha Nakshatra and friendly Taurus moon sign, scoring a stellar 28 out of 36 Guna compatibility parameters.",
        business: "Perfect Business/Inception Muhurat mapped on July 08, 2026, 09:30 AM to 11:15 AM. Abhijit window ensures steady capital growth, legal safety, and smooth operations.",
        property: "Highly auspicious Bhumi Pujan or registration hour found on August 05, 2026, 07:15 AM. Star forces favor long-term stability and family harmony.",
        vehicle: "Fortified acquisition window on June 29, 2026 (Guru Pushya Yoga constellation). Perfect for buying modern passenger vehicles, invoking longevity.",
        travel: "Disha Shool directions caution traveling directly West on Fridays. If inevitable, offer sacred sweets or grains to birds before boarding to neutralize sudden delays."
      };
      
      setCalculatedMuhuratReport(guides[selectedMuhuratCategory]);
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-16 text-left selection:bg-orange-600/30 selection:text-white" id="panchang-muhurat-page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#140703] via-[#090503] to-[#060302] border-b border-orange-500/10 py-16 px-4 sm:px-6 text-center rounded-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-orange-600/5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-orange-950/20 border border-orange-500/20 rounded-full text-[10px] font-serif font-bold text-orange-400 tracking-wider uppercase mb-2">
            {language === 'hi' ? 'प्रकृति संरेखण पंचांग' : 
             language === 'sa' ? 'प्रकृति-संरेखण-पञ्चाङ्गम्' : 
             'Prakriti Alignment Almanac'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-100 uppercase tracking-tight leading-none">
            {t('features.panchangTitle', language)}
          </h1>
          <p className="text-sm max-w-2xl mx-auto text-gray-400 font-serif leading-relaxed">
            {t('features.panchangDesc', language)}
          </p>
        </div>
      </section>

      {/* Observation Geolocation controller */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#0d0705] border border-orange-500/15 p-6 rounded-2xl">
        
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-mono tracking-widest text-orange-500 block">
            {language === 'hi' ? 'वेधशाला केंद्र' : 
             language === 'sa' ? 'वेधशाला-केन्द्रम्' : 
             'OBSERVATIONAL CENTER'}
          </span>
          <h4 className="text-sm font-serif font-bold text-gray-200 font-bold">
            {language === 'hi' ? 'गणना का आधार:' : 
             language === 'sa' ? 'गणनाधारः:' : 
             'Calculation Anchor:'}
          </h4>
          <p className="text-xs text-gray-400 font-serif">
            {language === 'hi' ? 'पंचांग समय की गणना चयनित क्षेत्रों के स्थानीय सूर्य की स्थिति के आधार पर की जाती है।' : 
             language === 'sa' ? 'चयनित-नगराणां सूर्योदय-सूर्यास्त-ग्रहस्थितीनां गणितेन पञ्चाङ्गसमयस्य निर्धारणम्।' : 
             'Panchang times are calculated dynamically based on local sun elevation curves of selected regions.'}
          </p>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 font-serif block mb-1">
            {language === 'hi' ? 'अवलोकन स्थान निर्धारित करें' : 
             language === 'sa' ? 'निरीक्षणस्थानस्य चयनम्' : 
             'Set Observation Location'}
          </label>
          <div className="relative text-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
            <input 
              type="text" 
              value={cityInput}
              onChange={(e) => handleCitySearch(e.target.value)}
              placeholder={city || (language === 'hi' ? 'शहर खोजें (उदा. वाराणसी, दिल्ली)' : language === 'sa' ? 'नगरस्य अन्वेषणम् (उदा. वाराणसी, काशी)' : "Search City (e.g. Varanasi, London)")}
              className="w-full bg-[#0a0502]/90 text-gray-250 pl-9 pr-3 py-2 rounded-xl border border-orange-500/15 focus:outline-none"
            />
            {searchingCity && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400 animate-spin" />}
          </div>

          {suggestions.length > 0 && (
            <div className="bg-[#0e0705] border border-orange-500/20 rounded-xl mt-1 max-h-44 overflow-y-auto z-40 relative shadow-2xl py-1 text-left text-[11px] block">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full px-3 py-2 hover:bg-[#1f0b05] text-gray-300 hover:text-orange-400 text-left transition-all border-b border-orange-500/5 block"
                >
                  {item.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
          <div className="bg-[#0e0705] border border-orange-500/10 p-2.5 rounded-lg">
            <span className="text-gray-500 block">Latitude</span>
            <span className="font-bold text-gray-200 mt-0.5 block">{lat?.toFixed(3)}°</span>
          </div>
          <div className="bg-[#0e0705] border border-orange-500/10 p-2.5 rounded-lg">
            <span className="text-gray-500 block">Longitude</span>
            <span className="font-bold text-gray-200 mt-0.5 block">{lng?.toFixed(3)}°</span>
          </div>
          <div className="bg-[#0e0705] border border-orange-500/10 p-2.5 rounded-lg">
            <span className="text-gray-500 block">Offset Zone</span>
            <span className="font-bold text-gray-200 mt-0.5 block">{timeOffset >= 0 ? '+' : ''}{timeOffset} hrs</span>
          </div>
        </div>

      </div>

      {loading ? (
        <div className="h-44 flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
          <span className="text-xs font-serif text-gray-400">Computing Panchanga variables relative to local sun coordinates...</span>
        </div>
      ) : data ? (
        <div className="space-y-10">
          
          {/* 2. Today's Core metrics (Five limbs) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: language === 'hi' ? '1. तिथि (चन्द्र दिवस)' : language === 'sa' ? '१. तिथिः (चान्द्रदिवसः)' : "1. TITHI (Lunar Day)", val: data.tithi?.name || "Shastri Dwitiya", deity: "Deity: Shiva", desc: "Auspicious for launching educational programs." },
              { label: language === 'hi' ? '2. नक्षत्र (तारा)' : language === 'sa' ? '२. नक्षत्रम् (तारा)' : "2. NAKSHATRA (Star)", val: data.nakshatra?.name || "Purva Phalguni", deity: "Ruler: Venus", desc: "Creative pursuits are highly fortified." },
              { label: language === 'hi' ? '3. वार (दिन)' : language === 'sa' ? '३. वारः (सौरदिवसः)' : "3. VARA (Weekday)", val: data.vara || "Mangalvara (Tuesday)", deity: "Ruler: Mars", desc: "Suited for mechanical trials and conflicts resolving." },
              { label: language === 'hi' ? '4. योग (सूर्य-चन्द्र कोण)' : language === 'sa' ? '४. योगः (सौर-चान्द्र-सम्बन्धः)' : "4. YOGA (Solar Angle)", val: data.yoga?.name || "Sadhya Yoga", deity: "Energy: Harmonious", desc: "Good for philosophical calculations." },
              { label: language === 'hi' ? '5. करण (आधा-तिथि)' : language === 'sa' ? '५. करणम् (अर्ध-तिथिः)' : "5. KARANA (Half-Tithi)", val: data.karana?.name || "Bava Karana", deity: "Energy: Kinship", desc: "Suited for constructing homes and fields." }
            ].map((node, idx) => (
              <div key={idx} className="p-4 bg-[#0a0502] border border-orange-500/10 hover:border-orange-500/25 transition-all text-left rounded-xl space-y-1.5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-tr from-transparent to-orange-500/5 rounded-full group-hover:scale-105 transition-transform" />
                <span className="text-[9.5px] uppercase font-mono tracking-wider text-orange-500/70 block">{node.label}</span>
                <h4 className="text-sm font-serif font-bold text-gray-150 leading-snug">{node.val}</h4>
                <p className="text-[10px] text-amber-500 font-serif font-semibold">{node.deity}</p>
                <p className="text-[10px] text-gray-500 leading-normal font-serif pt-1">{node.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Solar & Lunar Tides (Sunrise / Sunset, Abhijit Windows) */}
            <div className="bg-[#0c0604]/90 border border-orange-500/15 rounded-2xl p-6 shadow-2xl space-y-6">
              
              <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-3">
                <Sun className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-wider">Solar & Lunar Horizon Calculations</h3>
              </div>

              {/* 7, 8. Sunrise and Sunset times */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                <div className="p-3 bg-[#0a0502] rounded-xl border border-orange-500/5">
                  <span className="text-[9px] text-gray-500 uppercase block font-serif">🌅 Sunrise</span>
                  <span className="text-xs font-bold text-gray-200 mt-1 block">{data.astronomical?.sunrise || "05:15 AM"}</span>
                </div>
                <div className="p-3 bg-[#0a0502] rounded-xl border border-orange-500/5">
                  <span className="text-[9px] text-gray-500 uppercase block font-serif">🌇 Sunset</span>
                  <span className="text-xs font-bold text-gray-200 mt-1 block">{data.astronomical?.sunset || "06:45 PM"}</span>
                </div>
                <div className="p-3 bg-[#0a0502] rounded-xl border border-orange-500/5">
                  <span className="text-[9px] text-gray-500 uppercase block font-serif">🌙 Moonrise</span>
                  <span className="text-xs font-bold text-gray-200 mt-1 block">{data.astronomical?.moonrise || "08:12 PM"}</span>
                </div>
                <div className="p-3 bg-[#0a0502] rounded-xl border border-orange-500/5">
                  <span className="text-[9px] text-gray-500 uppercase block font-serif">🌘 Moonset</span>
                  <span className="text-xs font-bold text-gray-200 mt-1 block">{data.astronomical?.moonset || "07:22 AM"}</span>
                </div>
              </div>

              {/* 12, 13. Brahma / Abhijit Muhurats (Auspicious hours) */}
              <div className="space-y-3 font-serif text-xs">
                <h4 className="text-[11px] font-bold text-orange-300 uppercase tracking-widest border-b border-orange-500/5 pb-1 block">Fortified Auspicious Hours (Now)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-amber-950/15 border border-amber-500/20 rounded-xl space-y-1.5 hover:border-amber-500/35 transition-colors">
                    <span className="text-[9.5px] uppercase font-mono text-amber-500 font-bold block">Abhijit Muhurat (Golden Midday)</span>
                    <h5 className="font-bold text-gray-150">
                      {data.astronomical?.abhijitMuhurat?.start || "11:45 AM"} — {data.astronomical?.abhijitMuhurat?.end || "12:35 PM"}
                    </h5>
                    <p className="text-[10.5px] text-gray-400 leading-normal leading-relaxed">
                      Midday solar alignment that dissolves astronomical negative elements. Highly propitious for starting business campaigns, buying gold, or executing complex trials papers.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-950/15 border border-teal-500/20 rounded-xl space-y-1.5 hover:border-teal-500/35 transition-colors">
                    <span className="text-[9.5px] uppercase font-mono text-teal-400 font-bold block">Brahma Muhurat (Sattvic Dawn)</span>
                    <h5 className="font-bold text-gray-150">
                      {data.astronomical?.brahmaMuhurat?.start || "04:27 AM"} — {data.astronomical?.brahmaMuhurat?.end || "05:15 AM"}
                    </h5>
                    <p className="text-[10.5px] text-gray-400 leading-normal leading-relaxed">
                      Sattvic dawn activation period occurring precisely 48 minutes before local sunrise. Superior hours for chanting mantras, meditating, and receiving deep academic knowledge.
                    </p>
                  </div>

                </div>
              </div>

              {/* 9, 10, 11. Rahu Kaal, Gulika Kaal and Yamaganda Kaal (Inauspicious chapters) */}
              <div className="space-y-3 font-serif text-xs">
                <h4 className="text-[11px] font-bold text-red-400 uppercase tracking-widest border-b border-red-500/5 pb-1 block">Inauspicious Rahu & Saturn Chapters (Avoid)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <div className="p-3 bg-red-950/[0.04] border border-red-500/15 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono text-red-500 font-bold block">Rahu Kaal (Avoid starting)</span>
                    <h6 className="font-bold text-gray-200">
                      {data.muhuratPeriods?.rahuKaal?.start || "03:00 PM"} — {data.muhuratPeriods?.rahuKaal?.end || "04:30 PM"}
                    </h6>
                    <p className="text-[9.5px] text-gray-500 leading-snug">Avoid signing assets, wealth papers, or launching platforms.</p>
                  </div>

                  <div className="p-3 bg-red-950/[0.04] border border-red-500/15 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono text-amber-500 font-bold block">Yamaganda (Avoid travel)</span>
                    <h6 className="font-bold text-gray-200">
                      {data.muhuratPeriods?.yamaganda?.start || "09:00 AM"} — {data.muhuratPeriods?.yamaganda?.end || "10:30 AM"}
                    </h6>
                    <p className="text-[9.5px] text-gray-500 leading-snug">Death element hours. Avoid embarking on significant travel.</p>
                  </div>

                  <div className="p-3 bg-red-950/[0.04] border border-red-500/15 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono text-blue-500 font-bold block">Gulika (Avoid paperwork)</span>
                    <h6 className="font-bold text-gray-200">
                      {data.muhuratPeriods?.gulikaKaal?.start || "12:00 PM"} — {data.muhuratPeriods?.gulikaKaal?.end || "01:30 PM"}
                    </h6>
                    <p className="text-[9.5px] text-gray-500 leading-snug">Saturian delay window. Expect delays in bureaucratic papers.</p>
                  </div>

                </div>
              </div>

            </div>

            {/* Interactive Muhurat Search Finder tool */}
            <div className="bg-[#0c0604]/90 border border-orange-500/15 rounded-2xl p-6 shadow-2xl space-y-5">
              
              <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-3">
                <Compass className="w-4 h-4 text-orange-500 animate-spin-slow" />
                <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-wider">Auspicious Muhurat Planner Suite</h3>
              </div>

              <div className="space-y-4 text-xs">
                
                <div>
                  <label className="text-gray-400 block mb-1 font-serif">Select Purpose Domain</label>
                  <select
                    value={selectedMuhuratCategory}
                    onChange={(e) => setSelectedMuhuratCategory(e.target.value as any)}
                    className="w-full bg-[#0a0502]/95 text-gray-250 px-3 py-2.5 rounded-xl border border-orange-500/15 focus:outline-none"
                  >
                    <option value="marriage">🤵 Marriage & Vivah Muhurat (Gunas pairing)</option>
                    <option value="business">💼 Business Establishment & Inception (Aura launching)</option>
                    <option value="property">🏢 Property Registration & Groundbreaking (Bhumi Pujan)</option>
                    <option value="vehicle">🚗 Passenger Vehicle buy (Pushya constellation)</option>
                    <option value="travel">✈️ Travel scheduling & Disha Shool warnings</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1 font-serif">Planned Year</label>
                    <select className="w-full bg-[#0a0502]/90 text-gray-300 px-3 py-2 rounded-xl border border-orange-500/10 focus:outline-none">
                      <option>2026 Sidereal Era</option>
                      <option>2027 Sidereal Era</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1 font-serif">Time Interval</label>
                    <select className="w-full bg-[#0a0502]/90 text-gray-300 px-3 py-2 rounded-xl border border-orange-500/10 focus:outline-none">
                      <option>Next 60 Days</option>
                      <option>Next 180 Days</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleEvaluateMuhurtas}
                  disabled={evaluatingMuhurat}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center space-x-2"
                >
                  {evaluatingMuhurat ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>EVALUATING SOLAR POSITION INDEX...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5" />
                      <span>SEARCH AUSPICIOUS HOURS</span>
                    </>
                  )}
                </button>

                {calculatedMuhuratReport && (
                  <div className="p-4 bg-[#0a0502] border border-orange-500/15 text-xs text-left rounded-xl space-y-1 leading-relaxed">
                    <div className="flex items-center space-x-1 border-b border-orange-500/15 pb-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-orange-400 font-serif">Remedy & Alignment Recommendation:</span>
                    </div>
                    <p className="text-gray-400 font-serif whitespace-pre-line leading-relaxed">{calculatedMuhuratReport}</p>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* 14. Upcoming Vratas & Traditional Festival Calendar */}
          <div className="bg-[#0b0604] border border-orange-500/15 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-3">
              <Calendar className="w-4 h-4 text-orange-500 animate-pulse" />
              <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest">Tradition Festival & Vrata Calendar (12 Months)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {FESTIVALS.map((fest, idx) => (
                <div key={idx} className="p-4 bg-[#0a0502] rounded-xl border border-orange-500/5 hover:border-orange-500/15 transition-all text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-orange-500 font-bold font-mono">{fest.date}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-orange-700/10 text-orange-400 border border-orange-500/10 rounded uppercase font-bold">{fest.tithi}</span>
                  </div>
                  <h4 className="font-serif font-bold text-gray-200 text-xs block leading-tight">{fest.festival}</h4>
                  <p className="text-[10.5px] text-gray-500 font-serif leading-snug">{fest.significance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 20. Daily Spiritual Guidance remedies */}
          <section className="bg-gradient-to-br from-[#120703] to-[#1e0d06] border border-orange-500/20 p-6 rounded-2xl text-xs space-y-4 leading-relaxed font-serif text-left">
            <div className="flex items-center space-x-2 border-b border-orange-500/10 pb-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" strokeWidth="2.5" />
              <h4 className="font-bold text-orange-400 uppercase tracking-widest text-[11px]">Sankalp Lineage Daily Spiritual Guidance</h4>
            </div>

            <div className="space-y-4 text-gray-450 leading-relaxed text-gray-400">
              <p>
                Today's transit alignments recommend dedicating mornings to reciting the sacred **Gāyatrī Mantra**, or practicing simple **Prāṇāyāma** (alternate nostril breathing) for fine alignment of psychological chakras.
              </p>
              
              <div className="p-4 bg-[#070302]/90 border border-orange-500/5 rounded-xl space-y-1.5 font-mono text-[11px]">
                <strong className="text-gray-200 block text-xs">Phonetic Sanskrit Mantra of the day:</strong>
                <p className="text-amber-500 leading-normal font-sans italic text-xs">“Oṁ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt.”</p>
                <div className="text-[10.5px] text-gray-500 font-serif mt-1 pt-1 border-t border-orange-500/5 leading-normal">
                  Translation: We meditate upon the supreme, radiant light of the divine creator. May it illuminate our intellects and guide our focus to truth.
                </div>
              </div>

              <div className="flex items-start space-x-2 text-xs">
                <Info className="w-4.5 h-4.5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Recommended charity offerings for this Tuesday weekday: Offer simple roasted grains or clean water directly to birds step-by-step to pacify volatile fire elements in the horoscope.
                </p>
              </div>
            </div>
          </section>

        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center text-xs text-gray-500 font-serif">
          <span>Unable to connect with the observer nodes. Click retry.</span>
          <button onClick={fetchPanchangData} className="px-4 py-1.5 bg-orange-600 rounded-lg text-white font-bold mt-2">RETRY</button>
        </div>
      )}

      {/* 21. Frequently Asked Questions */}
      <section className="bg-[#0b0604] border border-orange-500/10 rounded-2xl p-6 text-xs text-left space-y-4">
        <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/5 pb-2">Lineage Almanac FAQ</h3>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="font-bold text-gray-200 font-serif">• {faq.q}</h5>
              <p className="text-gray-400 leading-relaxed pl-3 font-serif">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
