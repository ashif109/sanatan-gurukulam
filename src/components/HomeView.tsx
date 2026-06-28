import React, { useState } from 'react';
import ThreeCelestialCanvas from './ThreeCelestialCanvas';
import { 
  Award, 
  BookOpen, 
  Flame, 
  Compass, 
  Eye, 
  ShieldCheck, 
  Volume2, 
  Search, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  Activity,
  Users,
  Database,
  Layers,
  Heart,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

import { Language, t } from '../localization';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  language: Language;
  theme?: 'light' | 'dark';
}

export default function HomeView({ onNavigate, language, theme = 'dark' }: HomeViewProps) {
  const [selectedWebinar, setSelectedWebinar] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegisterWebinar = (webinarTitle: string) => {
    setSelectedWebinar(webinarTitle);
    setSuccessMessage(`Congratulations! You have successfully booked a seat for the "${webinarTitle}". Details have been sent to your email.`);
    setTimeout(() => {
      setSuccessMessage(null);
      setSelectedWebinar(null);
    }, 5000);
  };

  const webinars = [
    {
      id: "webinar-1",
      title: "Mega Astrology Webinar",
      date: "Sat, 27 Jun",
      time: "1:00 PM",
      price: "₹99",
      originalPrice: "₹999",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      tag: "LIMITED SEATS",
      status: "Starts in 5 days"
    },
    {
      id: "webinar-2",
      title: "Kundli Pathshala Webinar",
      date: "Sat, 20 Jun",
      time: "7:30 PM",
      price: "₹11",
      originalPrice: "₹99",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
      tag: "POPULAR",
      status: "Starts in 2 days"
    },
    {
      id: "webinar-3",
      title: "Mega Numerology Webinar",
      date: "25th & 26th June, 2026",
      time: "8:00 PM",
      price: "₹99",
      originalPrice: "₹999",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
      tag: "RECOMMENDED",
      status: ""
    },
    {
      id: "webinar-4",
      title: "Palmistry Webinar",
      date: "Fri, 26 Jun",
      time: "8:00 PM",
      price: "₹49",
      originalPrice: "₹999",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
      tag: "FAST FILLING",
      status: ""
    }
  ];

  const popularCourses = [
    {
      id: "course-astrology-1",
      title: "Introduction to Astrology",
      desc: "Beginner-friendly astrology course covering houses, signs, and planets. Learn to read birth charts and planetary alignments with standard traditional methods.",
      duration: "2+ Hours",
      learners: "2,00,000+",
      rating: "4.9",
      reviews: "2,200+",
      price: "₹199",
      tag: "Basic",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&auto=format&fit=crop&q=80",
      details: "1 Year Access • Certificate Included • Live Practice"
    },
    {
      id: "course-numerology-1",
      title: "Learn Numerology with the Basic Numerology Course",
      desc: "Understand how numbers influence personality, relationships, and major life decisions with this beginner-friendly comprehensive guide.",
      duration: "4 Hours",
      learners: "2,00,000+",
      rating: "4.7",
      reviews: "2,800+",
      price: "₹999",
      tag: "Basic",
      image: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=500&auto=format&fit=crop&q=80",
      details: "1 Year Access • Certificate Included • Live Practice"
    },
    {
      id: "course-panchang-1",
      title: "Advanced Panchang Mastery Course",
      desc: "Predict Using Panchang Beyond Kundli. Go beyond basic astrologer perspectives and unlock the real predictive power of true sidereal daily computations.",
      duration: "25+ Hours",
      learners: "2,00,000+",
      rating: "4.8",
      reviews: "2,100+",
      price: "₹199",
      tag: "Advanced",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&auto=format&fit=crop&q=80",
      details: "1 Year Access • Certificate Included • Live Practice"
    }
  ];

  const tools = [
    {
      title: "Numerology Calculator",
      desc: "Unlock your personality, life purpose, and destiny in seconds",
      tab: "numerology"
    },
    {
      title: "Tarot Calculator",
      desc: "Guidance for Love, Career, Health and Life through Tarot Reading",
      tab: "tarot"
    },
    {
      title: "Ram Shalaka Calculator",
      desc: "Find Answers and Clarity Through Shri Ram Shalaka",
      tab: "ram-shalaka"
    }
  ];

  const journalBlogs = {
    featured: {
      title: "Aura Scanning Explained: Meaning, Benefits & Process",
      desc: "Many people have heard of aura scanner, aura reading, or aura check, but are not sure what they mean. Some think it is only for spiritual purposes. Others may think it is only for healers. The truth is aura scanning holds crucial deep diagnostics key to our emotional and physiological balance.",
      tag: "Blog",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80"
    },
    stacked: [
      {
        title: "Swar Vigyan - Ancient Science of Breath and Vedic Wisdom",
        desc: "In Vedic astrology and yoga traditions, Swar Vigyan is known as one of the most secret and powerful breathing dynamics...",
        tag: "Swar Vigyan",
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&auto=format&fit=crop&q=80"
      },
      {
        title: "How to Calculate Life Path Number (Step-by-Step Guide)",
        desc: "The life path number is one of the most important numbers in numerology. It is basic key of evaluating spiritual destiny...",
        tag: "Numerology",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80"
      }
    ]
  };

  const mentors = [
    {
      name: "Saurav Chaubey",
      skills: "Astrology, Numerology & Career-Relationship Growth Expert",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Prem Kumar Mishra",
      skills: "Lal Kitab Astrology | Parashari Jyotish | Bhrigu Nandi Nadi (BNN) | Swar Shastra",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Vishvaa Sureeliya",
      skills: "Vedic Astrology | Numerology | Vastu | KP Astrology | Lal Kitab",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Shreya Kundu",
      skills: "Vedic Astrology & Energy Healing expert",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const successStories = [
    {
      name: "Pooja Agarwal",
      role: "Tarot Card Reader, Numerologist and Healer",
      desc: "I feel truly grateful to have been a part of your numerology course. Your way of teaching is not just insightful but also deeply inspiring. The clarity with which you explained even the most complex concepts made it easy to understand and apply in real life.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Ishika Mehta",
      role: "Learner",
      desc: "I completed a basic numerology recorded course with Occult Gurukul, and it was truly amazing. The course was easy to follow and provided a great introduction to numerology. I learned a lot and found the content extremely engaging and transformative.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Santosh R Pandey",
      role: "Operations & Project Management Professional",
      desc: "Actively learning since last 6 months and want to pursue this as my full-time career within next 2 years. What attracted me to Arun sir's courses is the teaching style: It is very simple and perfectly paced. Complex subjects explained in a very understandable manner.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Alice Kapoor",
      role: "Occultist",
      desc: "Radhe Radhe Guruji, I wanted to express my heartfelt gratitude for the guidance you've shared through your courses. I attended my 1st webinar and decided to take the course. It is my immense pleasure to get associated with you. Your wisdom is timeless.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-300 pb-16 relative animate-fade-in" id="beautiful-gurukul-home">
      {/* 3D Sacred Yantra Background flowing behind the entire page */}
      <ThreeCelestialCanvas color="#f59e0b" particleCount={300} className="fixed inset-0 pointer-events-none z-0 opacity-35 dark:opacity-50" />
      
      {/* Toast Notification for quick interactive responses */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-orange-950/90 backdrop-blur-md border border-orange-500 rounded-xl shadow-2xl text-white text-xs font-serif animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION: Double column matching references layout exactly but using our custom branding colors */}
      <section className="relative overflow-hidden pt-8 pb-16 border-b border-orange-500/10" id="hero-section">
        
        {/* Left Slide Arrow */}
        <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all z-20 hidden md:flex select-none">
          <span className="text-xl leading-none">&lt;</span>
        </button>

        {/* Right Slide Arrow */}
        <button className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all z-20 hidden md:flex select-none">
          <span className="text-xl leading-none">&gt;</span>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20 select-none">
          <span className="w-6 h-1.5 rounded-full bg-orange-500 transition-all"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/50 transition-all cursor-pointer"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/50 transition-all cursor-pointer"></span>
        </div>

        {/* Sacred Yantra Background SVG */}
        <div className="absolute -left-16 -top-16 w-96 h-96 opacity-10 pointer-events-none z-0 select-none animate-spin-slow text-orange-500/40 hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.25">
            <rect x="15" y="15" width="70" height="70" />
            <rect x="22" y="10" width="56" height="80" />
            <rect x="10" y="22" width="80" height="56" />
            <circle cx="50" cy="50" r="32" />
            <circle cx="50" cy="50" r="28" />
            <polygon points="50,22 74.2,64 25.8,64" />
            <polygon points="50,78 74.2,36 25.8,36" />
            <circle cx="50" cy="50" r="2" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block text-[11px] font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase font-mono bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              {language === 'hi' ? 'भारत का सबसे भरोसेमंद ज्योतिष संस्थान' : 
               language === 'sa' ? 'भारतस्य सर्वाधिक-विश्वस्त-ज्योतिष-संस्थानम्' : 
               "INDIA'S MOST TRUSTED ASTROLOGY INSTITUTE"}
            </span>
            
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.12] ${
              theme === 'light' ? 'text-stone-900' : 'text-white'
            }`}>
              {language === 'hi' ? <>ब्रह्मांड के बारे में अपनी जिज्ञासा को <br />एक <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500">सत्यापित कौशल</span> में बदलें</> : 
               language === 'sa' ? <>ब्रह्माण्डविषयिणीं स्वजिज्ञासां <br />एकासु <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500">प्रमाणितकलासु</span> परिवर्तयन्तु</> : 
               <>Turn your curiosity <br className="hidden sm:inline" />about the cosmos <br />into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500">certified skill</span></>}
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed font-sans max-w-xl ${
              theme === 'light' ? 'text-stone-600' : 'text-gray-300'
            }`}>
              {language === 'hi' ? 'भारत के बेहतरीन गुप्त विज्ञान विद्वानों से सीखें और विश्व स्तर पर मान्यता प्राप्त क्रेडेंशियल्स के साथ प्रमाणित हों।' : 
               language === 'sa' ? 'भारतस्य श्रेष्ठैः गुह्यविद्याविद्वद्भिः सह पठन्तु, वैश्विकमान्यताप्राप्तप्रमाणपत्रैः सह अलङ्कुर्वन्तु च।' : 
               "Learn from India's finest occult scholars and get certified with globally recognized credentials."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => handleRegisterWebinar("Free Masterclass Session")}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl shadow-lg shadow-orange-600/10 font-bold text-xs uppercase tracking-wider font-sans transition-all cursor-pointer"
              >
                {language === 'hi' ? 'निःशुल्क मास्टरक्लास में शामिल हों' : 
                 language === 'sa' ? 'निःशुल्क-प्रबोधने प्रविशन्तु' : 
                 'Join Free Masterclass'}
              </button>
              <button 
                onClick={() => onNavigate('explore')}
                className={`px-6 py-3.5 font-bold text-xs uppercase tracking-wider font-sans rounded-xl border transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-stone-100 hover:bg-stone-200 text-orange-600 border-stone-300'
                    : 'bg-[#0c0604] hover:bg-orange-950/20 text-orange-400 hover:text-orange-300 border-orange-500/20'
                }`}
              >
                {language === 'hi' ? 'सभी पाठ्यक्रमों का अन्वेषण करें' : 
                 language === 'sa' ? 'सर्वपाठ्यक्रमाणां वीक्षणम्' : 
                 'Explore all courses'}
              </button>
            </div>

            {/* Microstats block inside the Hero arranged horizontally with vertical dividers */}
            <div className={`flex flex-wrap items-center gap-y-4 pt-8 border-t mt-8 ${
              theme === 'light' ? 'border-stone-200' : 'border-orange-500/10'
            }`}>
              {[
                { val: "6,00,000+", label: language === 'hi' ? 'साधक' : language === 'sa' ? 'अध्येतारः' : 'Learners' },
                { val: "60+", label: language === 'hi' ? 'शिक्षा मार्ग' : language === 'sa' ? 'अध्ययनमार्गाः' : 'Learning Paths' },
                { val: "4.7+", label: language === 'hi' ? 'गूगल रेटिंग' : language === 'sa' ? 'गूगल-मूल्याङ्कनम्' : 'Google Rating' },
                { val: "30+", label: language === 'hi' ? 'विशेषज्ञ गुरु' : language === 'sa' ? 'मार्गदर्शकाः' : 'Expert Mentors' }
              ].map((stat, i) => (
                <div key={i} className={`flex items-center ${i > 0 ? (theme === 'light' ? 'border-l border-stone-300 pl-6 ml-6' : 'border-l border-white/10 pl-6 ml-6') : ''}`}>
                  <div className="text-left font-sans">
                    <span className={`block text-xl sm:text-2xl font-black tracking-tight leading-none ${
                      theme === 'light' ? 'text-stone-900' : 'text-white'
                    }`}>{stat.val}</span>
                    <span className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-bold mt-1.5 block leading-none ${
                      theme === 'light' ? 'text-orange-700' : 'text-orange-400'
                    }`}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Zodiac Ring Mask Mockup */}
          <div className="lg:col-span-5 relative flex items-end justify-center h-[350px] sm:h-[480px] lg:h-[500px] overflow-hidden pt-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px] lg:w-[480px] lg:h-[480px] shrink-0">
                
                {/* Outer Astrology Zodiac ring */}
                <div className="absolute inset-0 border border-orange-500/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-3 border border-dashed border-amber-500/15 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                <div className="absolute inset-8 border border-orange-500/5 rounded-full"></div>

                {/* Zodiac text markers */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="stroke-orange-500/20" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" className="stroke-orange-500/30" />
                  
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 50 + 38 * Math.cos(angle);
                    const y1 = 50 + 38 * Math.sin(angle);
                    const x2 = 50 + 45 * Math.cos(angle);
                    const y2 = 50 + 45 * Math.sin(angle);
                    return (
                      <line 
                        key={i} 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        className="stroke-orange-500/30" 
                        strokeWidth="0.5" 
                      />
                    );
                  })}
                  
                  <circle cx="50" cy="50" r="8" className="fill-[#0c0604]/80 stroke-orange-500/40" strokeWidth="0.5" />
                  <polygon points="50,44 55,53 45,53" className="fill-none stroke-orange-500/40" strokeWidth="0.5" />
                  <polygon points="50,56 55,47 45,47" className="fill-none stroke-orange-500/40" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="1.5" className="fill-amber-500" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRESS RETENTION EMBLEMS BAR (Horizontal representation of references) */}
      <section className={`py-6 border-y ${
        theme === 'light' 
          ? 'bg-stone-50/70 border-stone-200' 
          : 'bg-[#0c0604]/40 border-orange-500/10 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className={`text-[9px] font-mono text-center uppercase tracking-widest font-bold mb-4 ${
            theme === 'light' ? 'text-stone-500' : 'text-orange-500/50'
          }`}>
            {language === 'hi' ? 'प्रमुख प्रकाशनों में उल्लेखित और मान्यता प्राप्त' : 
             language === 'sa' ? 'प्रमुखपत्रिकाभिः प्रशंसितं सम्पादितञ्च' : 
             "FEATURING & RECOGNIZED IN LEADING PUBLICATIONS"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            {[
              "The Tribune", "Dainik Jagran", "Spotify", "mid-day", "Lokmat Times", 
              "TEDx", "TRS Show", "dailyhunt", "ZEE NEWS", "Hindustan Times"
            ].map((logoName, idx) => (
              <span 
                key={idx} 
                className={`font-serif text-xs font-black tracking-widest uppercase py-1 px-3 rounded-lg text-center transition-all ${
                  theme === 'light'
                    ? 'text-stone-750 hover:text-orange-655 border border-stone-300 bg-stone-200/50 shadow-sm'
                    : 'text-white/60 hover:text-orange-400 border border-white/5 bg-white/5'
                }`}
              >
                {logoName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE & INTERACTIVE WEBINARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">
            {language === 'hi' ? 'लाइव और इंटरएक्टिव' : 
             language === 'sa' ? 'सजीव-संवाद-युक्तम्' : 
             'LIVE & INTERACTIVE'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-1">
            {language === 'hi' ? 'आगामी वेबिनार' : 
             language === 'sa' ? 'आगामी-सङ्गोष्ठ्यः' : 
             'Upcoming Webinars'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {webinars.map((web) => (
            <div 
              key={web.id} 
              className="bg-[#0a0503]/40 backdrop-blur-md border border-orange-500/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full shadow-lg hover:-translate-y-1 webinar-card"
            >
              <div className="relative h-48 overflow-hidden bg-orange-950/20">
                <img 
                  src={web.image} 
                  alt={web.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter contrast-105 whitespace-nowrap" 
                />
                
                {web.tag && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-mono tracking-wider uppercase font-bold py-1 px-2.5 rounded-md">
                    {web.tag}
                  </span>
                )}

                {web.status && (
                  <span className="absolute bottom-3 left-3 bg-amber-500 text-black text-[9px] font-mono tracking-wider uppercase font-bold py-1 px-2 rounded">
                    {web.status}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold font-serif text-white tracking-wide">{web.title}</h3>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    <span>{web.date} • {web.time}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-orange-500/5 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-amber-500 font-serif">{web.price}</span>
                    <span className="text-[10px] text-gray-500 line-through font-serif ml-1.5">{web.originalPrice}</span>
                  </div>

                  <button
                    onClick={() => handleRegisterWebinar(web.title)}
                    className="px-4 py-2 bg-transparent hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 hover:border-transparent rounded-lg text-[10px] font-serif uppercase tracking-widest font-black transition-all"
                  >
                    {language === 'hi' ? 'अभी रजिस्टर करें' : 
                     language === 'sa' ? 'पञ्जीकरणं कुर्वन्तु' : 
                     'Register Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRENDING PROGRAMS / POPULAR COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">
            {language === 'hi' ? 'ट्रेंडिंग कार्यक्रम' : 
             language === 'sa' ? 'प्रचलित-पाठ्यक्रमाः' : 
             'TRENDING PROGRAMS'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-1">
            {language === 'hi' ? 'सर्वाधिक लोकप्रिय पाठ्यक्रम' : 
             language === 'sa' ? 'अति-प्रियाः पाठ्यक्रमाः' : 
             'Most Popular Courses'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-serif max-w-xl mx-auto mt-2 text-gray-305">
            {language === 'hi' ? 'अपनी गति से सीखें और एक प्रमाणित ज्योतिष चिकित्सक बनें' : 
             language === 'sa' ? 'स्ववेगेन पठन्तु कुण्डली-शास्त्रिणः भवन्तु च' : 
             'Learn at your own pace and become a certified astrology practitioner'}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-[#0a0503]/40 backdrop-blur-md border border-orange-500/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full shadow-lg course-card"
            >
              <div className="relative h-52 overflow-hidden bg-orange-950/20">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center" 
                />
                
                <span className="absolute top-3 left-3 bg-orange-600 text-white text-[9px] font-mono tracking-wider uppercase font-bold py-1 px-2.5 rounded">
                  {course.tag}
                </span>

                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm shadow flex items-center space-x-1 py-1 px-2.5 rounded text-[10px] font-mono font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{course.rating} ({course.reviews})</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-white tracking-tight leading-snug mb-3 hover:text-orange-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-serif leading-relaxed line-clamp-3 mb-4">
                    {course.desc}
                  </p>

                  <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-mono uppercase pb-3 border-b border-orange-500/5 mb-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-amber-500" />
                      <span>{course.learners}</span>
                    </span>
                  </div>
                </div>

                <div>
                  {/* Curriculums points */}
                  <p className="text-[10px] text-gray-450 font-serif italic mb-4">{course.details}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-black text-white font-serif">{course.price}</span>
                    <button 
                      onClick={() => onNavigate('explore')}
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 font-serif text-xs font-bold tracking-widest uppercase text-white rounded-xl transition-all"
                    >
                      {language === 'hi' ? 'अधिक सीखें' : 
                       language === 'sa' ? 'विस्तृतं ज्ञानम्' : 
                       'Learn More'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRY FREE TOOLS BEFORE YOU LEARN */}
      <section className="bg-gradient-to-b from-[#0a0503]/40 to-[#040201]/20 backdrop-blur-sm py-16 border-y border-orange-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
              {language === 'hi' ? <>हमारे <span className="text-orange-500">मुफ़्त उपकरण</span> आज़माएं</> : 
               language === 'sa' ? <>निःशुल्क <span className="text-orange-500">ज्योतिष-यन्त्राणि</span> पश्यन्तु</> : 
               <>Try <span className="text-orange-500">Free Tools</span> before you learn</>}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-serif max-w-sm mx-auto mt-2 text-gray-305">
              {language === 'hi' ? 'मुफ़्त में शक्तिशाली ज्योतिष उपकरणों का अन्वेषण करें' : 
               language === 'sa' ? 'निःशुल्कं ज्योतिष्यन्त्राणाम् उपयोगं कुर्वन्तु' : 
               'Explore powerful astrology tools for free'}
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tl, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-[#090503]/40 backdrop-blur-md border border-orange-500/10 hover:border-orange-500/30 hover:scale-[1.02] flex flex-col md:flex-row items-center gap-5 transition-all duration-300 tool-card"
              >
                {/* Visual Icon Box */}
                <div className="w-16 h-16 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center shrink-0">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border border-orange-500/15 rounded-full animate-spin-slow"></div>
                    <span className="text-lg text-orange-400 font-serif font-black">ॐ</span>
                  </div>
                </div>

                <div className="text-center md:text-left space-y-2 flex-grow">
                  <h4 className="text-sm font-bold font-serif text-white uppercase tracking-widest">
                    {tl.tab === 'numerology' ? t('features.numerologyTitle', language) :
                     tl.tab === 'tarot' ? t('features.tarotTitle', language) :
                     t('features.ramshalakaTitle', language)}
                  </h4>
                  <p className="text-xs text-gray-400 font-serif leading-relaxed">
                    {tl.tab === 'numerology' ? t('features.numerologyDesc', language) :
                     tl.tab === 'tarot' ? t('features.tarotDesc', language) :
                     t('features.ramshalakaDesc', language)}
                  </p>
                  
                  <button 
                    onClick={() => onNavigate(tl.tab)}
                    className="pt-2 text-xs font-serif font-bold tracking-wider text-orange-400 hover:text-orange-300 uppercase flex items-center justify-center md:justify-start space-x-1"
                  >
                    <span>
                      {language === 'hi' ? 'मुफ़्त आज़माएं' :
                       language === 'sa' ? 'निःशुल्क-परीक्षणम्' :
                       'Try for free'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FROM THE OCCULT GURUKUL JOURNAL (Layout exact matching) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">JOURNAL HIGHLIGHTS</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-1">From the Occult Gurukul Journal</h2>
          <p className="text-xs sm:text-sm text-gray-400 font-serif max-w-md mx-auto mt-2">
            Insights, News, and stories from India's occult sciences community
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Large Column (Feature) */}
          <div className="lg:col-span-7 bg-[#0a0503]/40 backdrop-blur-md border border-orange-500/10 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all flex flex-col justify-between">
            <div>
              <div className="h-64 sm:h-80 overflow-hidden bg-orange-950/10">
                <img 
                  src={journalBlogs.featured.image} 
                  alt={journalBlogs.featured.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter grayscale-25" 
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="inline-block bg-orange-500/10 text-orange-400 text-[10px] font-mono tracking-wider uppercase font-bold px-2 py-1 rounded">
                  {journalBlogs.featured.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white hover:text-orange-400 transition-colors">
                  {journalBlogs.featured.title}
                </h3>
                <p className="text-xs text-gray-400 font-serif leading-relaxed">
                  {journalBlogs.featured.desc}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={() => onNavigate('explore')}
                className="text-xs font-serif font-bold tracking-widest text-orange-400 hover:text-orange-300 uppercase flex items-center space-x-1.5"
              >
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Smaller Grid Stack Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {journalBlogs.stacked.map((stk, idx) => (
              <div 
                key={idx} 
                className="bg-[#0a0503]/40 backdrop-blur-md border border-orange-500/10 rounded-2xl p-5 hover:border-orange-500/20 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-stretch"
              >
                <div className="w-full sm:w-36 h-36 overflow-hidden rounded-xl bg-orange-950/10 shrink-0">
                  <img 
                    src={stk.image} 
                    alt={stk.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center" 
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1 space-y-2">
                  <div>
                    <span className="inline-block bg-orange-500/10 text-orange-400 text-[9px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded">
                      {stk.tag}
                    </span>
                    <h4 className="text-sm font-semibold font-serif text-white hover:text-orange-400 transition-colors leading-snug mt-1.5">
                      {stk.title}
                    </h4>
                    <p className="text-[11px] text-gray-450 leading-relaxed font-serif line-clamp-2">
                      {stk.desc}
                    </p>
                  </div>

                  <button 
                    onClick={() => onNavigate('explore')}
                    className="text-xs font-serif font-bold tracking-widest text-orange-400 hover:text-orange-300 uppercase flex items-center space-x-1"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. MEET THE KEEPERS (Mentors Row representation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">Mentors</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-1 uppercase">Meet the keepers</h2>
          <p className="text-xs sm:text-sm text-gray-400 font-serif max-w-sm mx-auto mt-2">
            ancient timeless wisdom
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((men, i) => (
            <div 
              key={i} 
              className="group bg-[#0a0503]/40 backdrop-blur-md border border-orange-500/10 rounded-2xl overflow-hidden shadow-lg hover:border-orange-500/35 transition-all duration-300 mentor-card"
            >
              <div className="relative h-72 overflow-hidden bg-orange-950/20">
                <img 
                  src={men.image} 
                  alt={men.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500 mentor-image" 
                />
                
                {/* Dynamic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
                  <h4 className="text-sm font-bold font-serif text-white tracking-wide">{men.name}</h4>
                  <p className="text-[10px] text-orange-400 font-serif mt-1 leading-relaxed leading-snug line-clamp-2">
                    {men.skills}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SUCCESS STORIES CAROUSEL/GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-left">
            <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">SOCIAL PROOF</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mt-1">1,00,000+ success stories from around the world</h2>
          </div>
          <button 
            onClick={() => onNavigate('gurus')}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-serif tracking-widest font-black text-[10px] uppercase rounded-xl transition-all shadow-md shrink-0"
          >
            Join our team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {successStories.map((story, i) => (
            <div 
              key={i} 
              className="p-5 bg-[#0a0503]/40 backdrop-blur-md border border-orange-500/10 rounded-2xl flex flex-col justify-between shadow-xl testimonial-card"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <img 
                    src={story.avatar} 
                    alt={story.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-orange-500/20 object-cover" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-serif">{story.name}</h4>
                    <p className="text-[9px] text-orange-400 font-mono uppercase tracking-wider">{story.role}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 font-serif leading-relaxed italic testimonial-text">
                  “{story.desc}”
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-orange-500/5 text-right text-base opacity-25 text-amber-500 font-serif">
                ॐ
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NETWORK EVENT / PHOTO COLLAGE GRID (Double layout columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs sm:text-sm text-gray-450 leading-relaxed font-serif italic text-center">
            Join a Growing network of students, practitioners, and certified professionals transforming their passion into expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[480px]">
          
          {/* Main Large Left Box */}
          <div className="md:col-span-6 rounded-2xl overflow-hidden bg-orange-950/10 border border-orange-500/10 h-80 md:h-full relative group">
            <img 
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=850&auto=format&fit=crop&q=80" 
              alt="Occult gurukul networking" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform scale-102 group-hover:scale-105 transition-transform duration-700 brightness-90 filter brightness-95" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
              <span className="text-[10px] text-orange-400 font-mono uppercase tracking-widest font-bold">Annual Convocation</span>
              <h4 className="text-sm font-bold font-serif text-white uppercase mt-1">Siddhi & Diksha Gathering</h4>
            </div>
          </div>

          {/* Right Grid Column of 4 Smaller Items */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {[
              {
                title: "Traditional Guru Path",
                category: "Interactive Seminars",
                image: "https://images.unsplash.com/photo-1543165365-07246c723555?w=500&auto=format&fit=crop&q=80"
              },
              {
                title: "Academic Achievements",
                category: "Award Ceremonies",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80"
              },
              {
                title: "Scholarly Debates",
                category: "Shastrartha Sabha",
                image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80"
              },
              {
                title: "Global Reach",
                category: "Vedic Community Nodes",
                image: "https://images.unsplash.com/photo-1523580494863-6f303122450d?w=500&auto=format&fit=crop&q=80"
              }
            ].map((col, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden bg-orange-950/10 border border-orange-500/10 h-44 sm:h-auto relative group">
                <img 
                  src={col.image} 
                  alt={col.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 brightness-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[9px] text-amber-500 font-mono uppercase tracking-wider font-bold">{col.category}</span>
                  <p className="text-xs font-semibold font-serif text-white mt-0.5">{col.title}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. STATISTICS WRAPPER OVERVIEW (WHY LEARNERS CHOSE US) */}
      <section className="bg-gradient-to-r from-[#0c0604]/40 via-[#0f0805]/30 to-[#0c0604]/40 backdrop-blur-md py-16 border-y border-orange-500/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">Why 6,00,000+ learners chose us</h2>
            <p className="text-xs sm:text-sm text-gray-400 font-serif mt-2">
              Real skills. Trusted legacy. Proven career outcomes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-4">
              <span className="block text-4xl font-black text-amber-500 font-serif">6,00,000+</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Learners</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-black text-amber-500 font-serif">60+</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Learning Paths</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-black text-white font-serif">4.7★</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Google Rating</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-black text-amber-500 font-serif">51+</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Years of Legacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. COMPLETE GURUKUL FOOTER */}
      <footer className="border-t border-orange-500/10 pt-16 pb-8 text-left bg-[#070302]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl text-orange-500 font-serif font-bold">ॐ</span>
              <span className="text-sm font-black font-serif tracking-widest text-[#f97316]">Occult Gurukul</span>
            </div>
            <p className="text-xs text-gray-400 font-serif leading-relaxed">
              RISE TO THE ELITE 1%
            </p>
            <p className="text-xs text-gray-500 font-serif leading-relaxed">
              An elite ecosystem crafted to preserve and study classical Vedic treatises, traditional astrology sciences, and certified lineage computations.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-[10px] font-mono text-gray-300 font-black uppercase tracking-widest mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs text-gray-550 font-serif font-medium text-gray-400">
              <li><button onClick={() => onNavigate('gurus')} className="hover:text-orange-400 transition-colors">Who We Are</button></li>
              <li><button onClick={() => onNavigate('gurus')} className="hover:text-orange-400 transition-colors">Contact Us</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Terms & Conditions</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Refund Policy</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-[10px] font-mono text-gray-300 font-black uppercase tracking-widest mb-4">Resources</h5>
            <ul className="space-y-2.5 text-xs text-gray-400 font-serif">
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Blogs</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">News</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Videos</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">E-Books</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-[10px] font-mono text-gray-300 font-black uppercase tracking-widest mb-4">Courses</h5>
            <ul className="space-y-2.5 text-xs text-gray-400 font-serif">
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Rudraksha Course</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Kundli Mastery Course</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Retrograde Planet Course</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Lal Kitab Course</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Nakshatra Recorded Course</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Advance Numerology Course</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Medical Astrology Bootcamp</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-orange-400 transition-colors">Astro Vastu Course</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-[10px] font-mono text-gray-300 font-black uppercase tracking-widest mb-4">Webinar</h5>
            <ul className="space-y-2.5 text-xs text-gray-400 font-serif">
              <li><button onClick={() => handleRegisterWebinar("Mega Astrology Webinar")} className="hover:text-orange-400 transition-colors">Mega Astrology Webinar</button></li>
              <li><button onClick={() => handleRegisterWebinar("Kundli Pathshala Webinar")} className="hover:text-orange-400 transition-colors">Kundli Pathshala Webinar</button></li>
              <li><button onClick={() => handleRegisterWebinar("Mega Numerology Webinar")} className="hover:text-orange-400 transition-colors">Mega Numerology Webinar</button></li>
              <li><button onClick={() => handleRegisterWebinar("Palmistry Webinar")} className="hover:text-orange-400 transition-colors">Palmistry Webinar</button></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-orange-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <div>© {new Date().getFullYear()} Occult Gurukul. All Rights Reserved.</div>
          <div className="flex items-center space-x-1">
            <span>Server Status:</span>
            <span className="text-emerald-500 font-bold">Live</span>
          </div>
        </div>
      </footer>

      {/* Floating Widgets from the Screenshot */}
      <a 
        href="https://wa.me/#" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        title="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.161.001 6.132 1.23 8.368 3.467 2.237 2.237 3.464 5.207 3.464 8.371 0 6.525-5.322 11.85-11.852 11.85-2.003-.001-3.973-.508-5.729-1.476L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.405 0 9.801-4.393 9.804-9.797.001-2.618-1.01-5.08-2.858-6.93C16.478 2.029 14.02 1.002 11.4 1.002c-5.414 0-9.815 4.397-9.819 9.804-.002 1.741.464 3.441 1.349 4.925l-.99 3.612 3.707-.973zm11.758-6.84c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.3-1.57-1.45-1.83-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.8-1.9-.21-.52-.43-.45-.58-.45h-.5c-.17 0-.45.06-.69.32-.24.26-.92.9-1.09 1.1-.22.25-.49.5-.78.74-.83.69-1.63 1.29-2.5 1.83-.17.1-.34.21-.5.32-.42.27-.85.55-1.28.82-.44.28-.86.58-1.28.89-.13.1-.26.2-.39.3-.52.41-1 .85-1.45 1.32l.02.02c.39.38.83.74 1.29 1.07.46.33.95.63 1.45.9.1.05.2.1.3.15.54.27 1.1.51 1.67.72.6.22 1.21.41 1.83.56.55.13 1.11.23 1.67.3.74.09 1.49.12 2.24.1.75-.02 1.49-.07 2.23-.15.82-.09 1.63-.23 2.43-.42.26-.06.51-.13.77-.21.73-.23 1.44-.52 2.12-.86.26-.13.51-.27.76-.42.6-.35 1.17-.74 1.71-1.17.13-.1.26-.2.39-.31.52-.44 1-.92 1.45-1.43z" />
        </svg>
      </a>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2 select-none">
        {/* Chat Tooltip */}
        <div className="bg-white text-gray-800 text-xs px-3.5 py-2.5 rounded-xl shadow-2xl border border-gray-100 animate-in fade-in duration-300 font-sans font-medium flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1"></span>
          <span>We're Online! How may I help you today?</span>
        </div>
        <button 
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
          title="Live Help Chat"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </button>
      </div>

    </div>
  );
}
