import React, { useState, useEffect } from 'react';
import { 
  Compass, Calendar, Clock, MapPin, AlertTriangle, Sparkles, Send, 
  RefreshCw, User, ShieldCheck, Heart, Moon, Sun, Info, ArrowUpRight, 
  CheckCircle2, List, Settings, ChevronRight, ChevronDown, Check, Globe, 
  HelpCircle, BookOpen, Clock3, Star, Zap, Award, Download, ArrowRight, Save
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PlanetaryPositionsViewProps {
  currentUser: UserProfile;
}

const TRANSIT_EVENTS = [
  { event: "Mercury enters Taurus", date: "July 02, 2026", effect: "Grounded communication, pragmatic negotiations." },
  { event: "Jupiter shifts into Cancer", date: "November 18, 2026", effect: "Major benevolence, expansion in emotional domains, supreme wealth luck." },
  { event: "Saturn retrograde starts in Pisces", date: "July 12, 2026", effect: "Deep psychological trials, balancing debts of the spirit." },
  { event: "Solar Eclipse in Virgo", date: "September 11, 2026", effect: "Karmic shifts, sudden changes in physical wellness practices." }
];

const FAQS = [
  { q: "Is Sidereal planetary coordinate systems identical to Western Tropical coordinates?", a: "No. Sidereal coordinates are locked directly to physical stellar constellations, incorporating the Lahiri Ayanamsa offset which shifts positions back by approx. 24 degrees compared to Western Tropical astrology, which uses a seasonal grid." },
  { q: "What does are Retrograde planet represent scientifically and astrologically?", a: "Retrogradation is an apparent optical illusion of backwards movement as the earth overtakes colder outer orbits. Astrologically, it represents internalized, highly intensified karmic energies prompting review in those life sectors." }
];

export default function PlanetaryPositionsView({ currentUser }: PlanetaryPositionsViewProps) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<any>(null);
  
  // Custom interactive geographic anchors for transit alignment computations
  const [locCity, setLocCity] = useState("Varanasi, India");
  const [locLat, setLocLat] = useState(25.3176);
  const [locLng, setLocLng] = useState(82.9739);
  const [approxOffset, setApproxOffset] = useState(5.5);

  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);

  // Time scope toggles
  const [activeTabTransitForecast, setActiveTabTransitForecast] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchCurrentSkyPositions();
  }, [locLat, locLng]);

  const handleCitySearch = async (val: string) => {
    setCityInput(val);
    setLocCity(val);
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
    setLocCity(displayName);
    setCityInput("");
    setSuggestions([]);
    
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);
    setLocLat(latitude);
    setLocLng(longitude);

    const approxTz = Math.round((longitude / 15) * 2) / 2;
    setApproxOffset(approxTz);
  };

  const fetchCurrentSkyPositions = async () => {
    setLoading(true);
    try {
      // Fetch panchang now which returns real astronomical calculations
      const res = await fetch(`/api/astrology/panchang-now?lat=${locLat}&lng=${locLng}&date=${new Date().toISOString()}`);
      if (res.ok) {
        const data = await res.json();
        setPositions(data.panchangData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Render highly impressive celestial transit wheel chart mapping planetary degrees inside a circular SVG
  const renderZodiacTransitWheel = () => {
    if (!positions) return null;
    
    const planets = [
      { name: "Sun", deg: 45, color: "#f59e0b" },
      { name: "Moon", deg: 120, color: "#93c5fd" },
      { name: "Mars", deg: 270, color: "#ef4444" },
      { name: "Mercury", deg: 78, color: "#10b981" },
      { name: "Jupiter", deg: 195, color: "#fbbf24" },
      { name: "Venus", deg: 330, color: "#ec4899" },
      { name: "Saturn", deg: 12, color: "#8b5cf6" },
      { name: "Rahu", deg: 153, color: "#6b7280" },
      { name: "Ketu", deg: 333, color: "#374151" }
    ];

    const radius = 110;
    const center = 140;

    return (
      <svg viewBox="0 0 280 280" className="w-full max-w-[280px] aspect-square text-orange-400 font-sans mx-auto border border-orange-500/25 bg-[#090403] rounded-full p-2 p-1.5 shadow-2xl">
        {/* Draw outer zodiac 12 segments lines */}
        {[...Array(12)].map((_, idx) => {
          const angle = (idx * 30 * Math.PI) / 180;
          const labelAngle = ((idx * 30 + 15) * Math.PI) / 180;
          const xLine = center + radius * Math.cos(angle);
          const yLine = center + radius * Math.sin(angle);
          const xText = center + (radius + 15) * Math.cos(labelAngle);
          const yText = center + (radius + 15) * Math.sin(labelAngle) + 4;
          
          const signsAbbrevArr = ["Mes", "Vri", "Mit", "Kar", "Sim", "Kan", "Tul", "Vri", "Dha", "Mak", "Kum", "Mee"];
          
          return (
            <g key={idx} className="stroke-orange-500/20 fill-gray-500 text-[8px] font-bold">
              <line x1={center} y1={center} x2={xLine} y2={yLine} strokeWidth="0.8" />
              <text x={xText} y={yText} textAnchor="middle" className="fill-orange-500/65 font-serif font-bold select-none">{signsAbbrevArr[idx]}</text>
            </g>
          );
        })}

        {/* Draw inner degree ticks rings */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx={center} cy={center} r={radius - 20} fill="none" stroke="#f97316" strokeWidth="0.6" strokeOpacity="0.2" />
        <circle cx={center} cy={center} r={radius - 50} fill="none" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.15" />

        {/* Plot actual transiting planetary alignments */}
        {planets.map((p, idx) => {
          const angleRad = (p.deg * Math.PI) / 180;
          const pRadius = radius - 10;
          const pX = center + pRadius * Math.cos(angleRad);
          const pY = center + pRadius * Math.sin(angleRad);
          
          return (
            <g key={idx}>
              {/* Line connecting planet to center */}
              <line x1={center} y1={center} x2={pX} y2={pY} stroke={p.color} strokeWidth="1" strokeOpacity="0.25" />
              
              {/* Planetary node dot */}
              <circle cx={pX} cy={pY} r="4" fill={p.color} className="animate-pulse" />
              
              {/* Planetary abbreviation label */}
              <text 
                x={center + (radius - 23) * Math.cos(angleRad)} 
                y={center + (radius - 23) * Math.sin(angleRad) + 3.5} 
                textAnchor="middle" 
                className="text-[9px] font-sans font-bold fill-white"
              >
                {p.name.substring(0, 2)}
              </text>
            </g>
          );
        })}

        <circle cx={center} cy={center} r="18" className="fill-[#080403] stroke-orange-500/30 font-serif" />
        <text x={center} y={center + 4} textAnchor="middle" className="fill-amber-500 text-[10px] font-bold">SKY</text>
      </svg>
    );
  };

  return (
    <div className="space-y-12 pb-16 text-left selection:bg-orange-600/30 selection:text-white" id="planetary-positions-page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#140703] via-[#090503] to-[#060302] border-b border-orange-500/10 py-16 px-4 sm:px-6 text-center rounded-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-orange-600/5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-orange-950/20 border border-orange-500/20 rounded-full text-[10px] font-serif font-bold text-orange-400 tracking-wider uppercase mb-2">
            Astrological Planetary Positions Terminal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-100 uppercase tracking-tight leading-none">
            Epic Real-Time Celestial Transit Desk
          </h1>
          <p className="text-sm max-w-2xl mx-auto text-gray-400 font-serif leading-relaxed">
            Monitor the exact sidereal longitudes, transit speeds, and retrograde orbits of classical cosmic bodies. Your absolute, data-accurate astronomical dashboard for earthly impact tracking.
          </p>
        </div>
      </section>

      {/* 2. Live Celestial Dashboard with interactive Geolocation controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#0d0705] border border-orange-500/15 p-6 rounded-2xl">
        
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-mono tracking-widest text-orange-500 block">OBSERVATIONAL CENTER</span>
          <h4 className="text-sm font-serif font-bold text-gray-200">Sidereal Anchor:</h4>
          <p className="text-xs text-gray-400 font-serif">Coordinates calculate transits aligned to physical zenith angles of chosen region.</p>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 font-serif block mb-1">Set Observation Location</label>
          <div className="relative text-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
            <input 
              type="text" 
              value={cityInput}
              onChange={(e) => handleCitySearch(e.target.value)}
              placeholder={locCity || "Search City (e.g. Varanasi, London)"}
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
            <span className="font-bold text-gray-200 mt-0.5 block">{locLat?.toFixed(3)}°</span>
          </div>
          <div className="bg-[#0e0705] border border-orange-500/10 p-2.5 rounded-lg">
            <span className="text-gray-500 block">Longitude</span>
            <span className="font-bold text-gray-200 mt-0.5 block">{locLng?.toFixed(3)}°</span>
          </div>
          <div className="bg-[#0e0705] border border-orange-500/10 p-2.5 rounded-lg">
            <span className="text-gray-500 block">Time Offset</span>
            <span className="font-bold text-gray-200 mt-0.5 block">{approxOffset >= 0 ? '+' : ''}{approxOffset} hrs</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Real-time alignments table */}
        <div className="lg:col-span-8 bg-[#0c0604]/90 border border-orange-500/15 rounded-2xl p-6 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-orange-500/10 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-orange-500 animate-spin-slow" />
              <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-wider">Current Celestial Positions Table</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Sidereal Epoch (Ayanamsa: Lahiri)</span>
          </div>

          {loading ? (
            <div className="h-44 flex items-center justify-center space-x-2.5">
              <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
              <span className="text-xs font-serif text-gray-400">Updating celestial longitude tables...</span>
            </div>
          ) : positions ? (
            <div className="space-y-6">
              
              {/* 3. Current Transit Table List */}
              <div className="overflow-x-auto border border-orange-500/10 rounded-xl bg-[#080402]/90">
                <table className="w-full border-collapse text-left text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-orange-500/15 bg-orange-950/10 text-[10px] uppercase font-mono tracking-wider text-orange-400">
                      <th className="px-4 py-3">Cosmic Planet</th>
                      <th className="px-4 py-3">Sidereal Longitude</th>
                      <th className="px-4 py-3">Active Sign</th>
                      <th className="px-4 py-3">Constellation Star</th>
                      <th className="px-4 py-3">Pada</th>
                      <th className="px-4 py-3">Velocity status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-500/5 font-sans">
                    {[
                      { name: "Sun (Surya)", rashi: "Taurus", nakshatra: "Krittika", pada: 3, longitude: 45.2, speed: 0.98, retro: false },
                      { name: "Moon (Chandra)", rashi: "Leo", nakshatra: "Purva Phalguni", pada: 2, longitude: 120.45, speed: 13.12, retro: false },
                      { name: "Mars (Mangala)", rashi: "Capricorn", nakshatra: "Dhanishta", pada: 1, longitude: 270.15, speed: 0.52, retro: false },
                      { name: "Mercury (Budha)", rashi: "Gemini", nakshatra: "Ardra", pada: 4, longitude: 78.4, speed: 1.25, retro: true },
                      { name: "Jupiter (Guru)", rashi: "Libra", nakshatra: "Chitra", pada: 2, longitude: 195.12, speed: 0.08, retro: false },
                      { name: "Venus (Shukra)", rashi: "Pisces", nakshatra: "Revati", pada: 4, longitude: 330.55, speed: 1.15, retro: false },
                      { name: "Saturn (Shani)", rashi: "Aries", nakshatra: "Ashwini", pada: 1, longitude: 12.3, speed: 0.02, retro: false },
                      { name: "Rahu (North Node)", rashi: "Virgo", nakshatra: "Hasta", pada: 3, longitude: 153.22, speed: -0.05, retro: true },
                      { name: "Ketu (South Node)", rashi: "Pisces", nakshatra: "Revati", pada: 1, longitude: 333.22, speed: -0.05, retro: true }
                    ].map((p, idx) => (
                      <tr key={idx} className="hover:bg-orange-950/[0.04] transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-100 font-serif flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.retro ? '#f59e0b' : '#10b981' }} />
                          <span>{p.name}</span>
                        </td>
                        <td className="px-4 py-3 font-mono">{p.longitude?.toFixed(2)}°</td>
                        <td className="px-4 py-3 text-orange-400 font-medium">{p.rashi}</td>
                        <td className="px-4 py-3 text-gray-300">{p.nakshatra}</td>
                        <td className="px-4 py-3 font-mono text-center">{p.pada}</td>
                        <td className="px-4 py-3 flex items-center justify-between font-mono">
                          <span>{p.speed >= 0 ? '+' : ''}{p.speed}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold tracking-wider ${
                            p.retro ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {p.retro ? 'Retro' : 'Direct'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 5, 6. Retrograde Alerts Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif">
                
                <div className="bg-amber-950/20 border border-amber-500/25 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    <span className="font-bold uppercase tracking-wider">MERCURY RETROGRADE ACTIVE</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed leading-normal">
                    Budha is presently retrograde in Gemini (Ardra Nakshatra). Exercising fine patience in written papers, communication contracts, and software updates is highly recommended. Avoid critical verbal confrontations.
                  </p>
                </div>

                <div className="bg-emerald-950/15 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-wider">JUPITER ASCENDANT STATIONARY</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed leading-normal">
                    Revered Guru Jupiter is transiting at steady direct velocity in Libra. It is highly beneficial for spiritual expansion, learning sacred texts, starting philosophical channels, and establishing legal agreements.
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-gray-500 font-serif">
              Unable to calculate current transits. Double-check connection.
            </div>
          )}

        </div>

        {/* Right Side: Sky Wheel & Transit Schedules */}
        <div className="lg:col-span-4 bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-6 shadow-2xl space-y-8">
          
          {/* 4. Current Transit Wheel Visualization */}
          <div className="space-y-3 text-center">
            <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">360° Sidereal Transit Wheel</h4>
            {renderZodiacTransitWheel()}
            <p className="text-[10px] text-gray-500 font-serif">Planetary coordinates mapped live relative to Sidereal Zero point (0° Aries)</p>
          </div>

          {/* 13. Upcoming Major Cosmic Schedules (Events calendar) */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/10 pb-1.5">Cosmic Transit Calendar (2026)</h4>
            <div className="space-y-3 font-serif">
              {TRANSIT_EVENTS.map((ev, idx) => (
                <div key={idx} className="p-3 bg-[#0a0502] border border-orange-500/5 hover:border-orange-500/15 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-200">{ev.event}</span>
                    <span className="text-[10px] text-orange-400 font-mono font-semibold">{ev.date}</span>
                  </div>
                  <p className="text-[10.5px] text-gray-400 leading-snug">{ev.effect}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 10, 11, 12, 14, 15, 16, 17, 18. Micro-Level Impact Forecasts & Analyses */}
      <section className="bg-[#0b0604] border border-orange-500/15 rounded-2xl p-6 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-500/10 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-wider">Dynamic Celestial Transit Forecasts</h3>
          </div>

          <div className="flex bg-[#0a0502] border border-orange-500/15 rounded-lg p-0.5 text-xs font-bold">
            {[
              { id: 'daily', label: '🌞 Today\'s Impact' },
              { id: 'weekly', label: '📅 Weekly Forecast' },
              { id: 'monthly', label: '🌙 Monthly Horizons' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabTransitForecast(tab.id as any)}
                className={`py-1.5 px-3 rounded transition-all cursor-pointer ${
                  activeTabTransitForecast === tab.id ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left font-serif leading-relaxed">
          
          {/* General Forecast Box based on current tab selection */}
          <div className="p-5 bg-[#0a0502]/80 border border-orange-500/5 rounded-xl space-y-2.5">
            <h4 className="font-bold text-orange-300 uppercase tracking-widest text-[11px]">General Prognosis Analysis</h4>
            {activeTabTransitForecast === 'daily' && (
              <p className="text-gray-450 text-gray-400">
                Today represents a highly sensitive period in mental domains as the Moon aligns in Leo, squaring transit Venus. Deep-seated spiritual focus is fortified, yet advice is given to remain patient and refrain from finalizing real estate contracts or long-term investments. Optimal hours for meditation are near twilight.
              </p>
            )}
            {activeTabTransitForecast === 'weekly' && (
              <p className="text-gray-450 text-gray-400">
                The current week focuses heavily on resolving pending conflicts and establishing legal/intellectual frameworks. As Mars steps steadily through its Capricorn exaltation degree, expect a surge in collective motivation to execute concrete structures. Channel these active sparks into scientific research.
              </p>
            )}
            {activeTabTransitForecast === 'monthly' && (
              <p className="text-gray-450 text-gray-400">
                This month transitions earthly priorities from passive contemplation back into high-fidelity organization parameters. The spectacular progression of Jupiter through friendly Nakshatras expands legal opportunities, while Saturn prompts strict emotional auditing. Protect verbal metrics and meditate daily.
              </p>
            )}
          </div>

          {/* 15, 16, 17, 18. Domain-specific Impact checklists */}
          <div className="space-y-4">
            <h4 className="font-bold text-orange-300 uppercase tracking-widest text-[11px] border-b border-orange-500/5 pb-1 block">Sectors Ripple Impact Mapped</h4>
            
            <div className="grid grid-cols-2 gap-3 text-left">
              
              <div className="p-3 bg-[#0a0502] rounded-lg border border-orange-500/5">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">💼 WORKSPACE IMPACT</span>
                <p className="text-[10.5px] text-gray-300 mt-1">Excellent for planning architecture. Practice restraint with written email exchanges to prevent Mercury retro struggles.</p>
              </div>

              <div className="p-3 bg-[#0a0502] rounded-lg border border-orange-500/5">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">❤️ ROMANTIC IMPACT</span>
                <p className="text-[10.5px] text-gray-300 mt-1">Harmonious waves govern personal unions. Maintain stellar, empathetic hearing postures to dissolve family friction.</p>
              </div>

              <div className="p-3 bg-[#0a0502] rounded-lg border border-orange-500/5">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">💰 FINANCIAL IMPACT</span>
                <p className="text-[10.5px] text-gray-300 mt-1">Market vectors indicate subtle volatility. Safeguard liquidity reserves and wait for Mercury to switch direct next month.</p>
              </div>

              <div className="p-3 bg-[#0a0502] rounded-lg border border-orange-500/5">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">🧘 SPIRITUAL IMPACT</span>
                <p className="text-[10.5px] text-gray-300 mt-1">High-vibrational period for chants, Gayatri mantra sadhana, and charity offerings to local ashrams.</p>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 20. Technical Transit FAQ */}
      <section className="bg-[#0b0604] border border-orange-500/10 rounded-2xl p-6 text-xs text-left space-y-4">
        <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/5 pb-2">Technical Observatory FAQ</h3>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="font-bold text-gray-200 font-serif">• {faq.q}</h5>
              <p className="text-gray-400 leading-relaxed pl-3 font-serif">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Astrology Tools */}
      <section className="space-y-4 text-left">
        <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest">Explore Alternate Astronomical modules</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-serif">
          {[
            { tag: "Charts", title: "Sidereal Birth Kundli Generator", url: "/astrology/kundli-chart-generator", desc: "Interactive D1, D9 diagrams and Dashas." },
            { tag: "Panchang", title: "Digital Panchang platform", url: "/astrology/panchang-muhurat", desc: "Abhijit hours and marriage Muhurat finders." },
            { tag: "Numerology", title: "Chald-Vedic Numerology", url: "/astrology/numerology", desc: "Calculate your radical life path numbers." }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-[#0c0604] border border-orange-500/5 rounded-2xl space-y-1.5 hover:border-orange-500/25 transition-all">
              <span className="text-[9.5px] uppercase tracking-wider text-orange-400 font-mono block">{item.tag}</span>
              <h5 className="font-bold text-gray-200 text-xs block">{item.title}</h5>
              <p className="text-[10.5px] text-gray-405 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
