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

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
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
    <div className="space-y-24 animate-in fade-in duration-300 pb-16" id="beautiful-gurukul-home">
      
      {/* Toast Notification for quick interactive responses */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-orange-950 border border-orange-500 rounded-xl shadow-2xl text-white text-xs font-serif animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION: Double column matching references layout exactly but using our custom branding colors */}
      <section className="relative overflow-hidden pt-8 pb-16 border-b border-orange-500/10">
        <ThreeCelestialCanvas color="#f97316" particleCount={220} className="absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block text-[11px] font-bold tracking-widest text-orange-500 uppercase font-mono bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              INDIA'S MOST TRUSTED ASTROLOGY INSTITUTE
            </span>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-[1.12]">
              Turn your curiosity <br className="hidden sm:inline" />
              about the cosmos <br />
              into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400">certified skill</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-serif max-w-xl">
              Learn from India's finest occult scholars and get certified with globally recognized credentials.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => handleRegisterWebinar("Free Masterclass Session")}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl shadow-lg shadow-orange-600/10 font-bold text-xs uppercase tracking-wider font-serif transition-all"
              >
                Join Free Masterclass
              </button>
              <button 
                onClick={() => onNavigate('explore')}
                className="px-6 py-3.5 bg-[#0c0604] hover:bg-orange-950/20 text-orange-400 hover:text-orange-300 font-bold text-xs uppercase tracking-wider font-serif rounded-xl border border-orange-500/20 transition-all"
              >
                Explore all courses
              </button>
            </div>

            {/* Microstats block inside the Hero as represented in the screenshots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-orange-500/10 mt-8">
              {[
                { val: "6,00,000+", label: "Learners" },
                { val: "60+", label: "Learning Paths" },
                { val: "4.7+", label: "Google Rating" },
                { val: "30+", label: "Expert Mentors" }
              ].map((stat, i) => (
                <div key={i} className="text-left">
                  <span className="block text-xl sm:text-2xl font-black text-white font-serif tracking-tight">{stat.val}</span>
                  <span className="text-[10px] sm:text-xs text-orange-400 font-mono tracking-wider uppercase font-bold">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Zodiac Ring Mask Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              <ThreeCelestialCanvas color="#f59e0b" particleCount={110} className="absolute inset-0 opacity-50 z-0" />
              
              {/* Outer Astrology Zodiac ring */}
              <div className="absolute inset-0 border border-orange-500/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-3 border border-dashed border-amber-500/15 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
              <div className="absolute inset-8 border border-orange-500/5 rounded-full"></div>

              {/* Zodiac text markers representing the wheel in screenshots */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <defs>
                  <path id="circlePath" d="M 50, 50 m -43, 0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0" />
                </defs>
                <text className="text-[2.2px] font-mono fill-orange-500/40 uppercase tracking-[4px]">
                  <textPath href="#circlePath">
                    • ARIES • TAURUS • GEMINI • CANCER • LEO • VIRGO • LIBRA • SCORPIO • SAGITTARIUS • CAPRICORN • AQUARIUS • PISCES 
                  </textPath>
                </text>
              </svg>

              {/* Inside core Mask with high precision portrait */}
              <div className="absolute inset-10 rounded-full overflow-hidden border border-orange-500/20 shadow-2xl bg-gradient-to-b from-orange-950/20 to-[#0c0604]">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80" 
                  alt="Vedic Scholar Guide" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter contrast-105 brightness-95 transform hover:scale-105 transition-all duration-700" 
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. PRESS RETENTION EMBLEMS BAR (Horizontal representation of references) */}
      <section className="bg-[#0c0604]/80 py-6 border-y border-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] font-mono text-center text-orange-500/50 uppercase tracking-widest font-bold mb-4">FEATURING & RECOGNIZED IN LEADING PUBLICATIONS</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-75">
            {[
              "The Tribune", "Dainik Jagran", "Spotify", "mid-day", "Lokmat Times", 
              "TEDx", "TRS Show", "dailyhunt", "ZEE NEWS", "Hindustan Times"
            ].map((logoName, idx) => (
              <span 
                key={idx} 
                className="text-white/60 hover:text-orange-400 font-serif text-xs font-black tracking-widest uppercase border border-white/5 bg-white/5 py-1 px-3 rounded text-center transition-colors"
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
          <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">LIVE & INTERACTIVE</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-1">Upcoming Webinars</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {webinars.map((web) => (
            <div 
              key={web.id} 
              className="bg-[#0a0503] border border-orange-500/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full shadow-lg hover:-translate-y-1"
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
                    Register Now
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
          <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">TRENDING PROGRAMS</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-1">Most Popular Courses</h2>
          <p className="text-xs sm:text-sm text-gray-400 font-serif max-w-xl mx-auto mt-2">
            Learn at your own pace and become a certified astrology practitioner
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-[#0a0503] border border-orange-500/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full shadow-lg"
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
                      Learn More
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRY FREE TOOLS BEFORE YOU LEARN */}
      <section className="bg-gradient-to-b from-[#0a0503] to-[#040201] py-16 border-y border-orange-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">Try <span className="text-orange-500">Free Tools</span> before you learn</h2>
            <p className="text-xs sm:text-sm text-gray-400 font-serif max-w-sm mx-auto mt-2">
              Explore powerful astrology tools for free
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-amber-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tl, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-[#090503] border border-orange-500/10 hover:border-orange-500/30 hover:scale-[1.02] flex flex-col md:flex-row items-center gap-5 transition-all duration-300"
              >
                {/* Visual Icon Box */}
                <div className="w-16 h-16 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center shrink-0">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border border-orange-500/15 rounded-full animate-spin-slow"></div>
                    <span className="text-lg text-orange-400 font-serif font-black">ॐ</span>
                  </div>
                </div>

                <div className="text-center md:text-left space-y-2 flex-grow">
                  <h4 className="text-sm font-bold font-serif text-white uppercase tracking-widest">{tl.title}</h4>
                  <p className="text-xs text-gray-400 font-serif leading-relaxed">{tl.desc}</p>
                  
                  <button 
                    onClick={() => onNavigate(tl.tab)}
                    className="pt-2 text-xs font-serif font-bold tracking-wider text-orange-400 hover:text-orange-300 uppercase flex items-center justify-center md:justify-start space-x-1"
                  >
                    <span>Try for free</span>
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
          <div className="lg:col-span-7 bg-[#0a0503] border border-orange-500/10 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all flex flex-col justify-between">
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
                className="bg-[#0a0503] border border-orange-500/10 rounded-2xl p-5 hover:border-orange-500/20 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-stretch"
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
              className="group bg-[#0a0503] border border-orange-500/10 rounded-2xl overflow-hidden shadow-lg hover:border-orange-500/35 transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden bg-orange-950/20">
                <img 
                  src={men.image} 
                  alt={men.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500" 
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
              className="p-5 bg-[#0a0503] border border-orange-500/10 rounded-2xl flex flex-col justify-between shadow-xl"
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

                <p className="text-xs text-gray-400 font-serif leading-relaxed italic">
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
      <section className="bg-gradient-to-r from-[#0c0604] via-[#0f0805] to-[#0c0604] py-16 border-y border-orange-500/10 text-center">
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
      <footer className="border-t border-orange-500/10 pt-16 pb-8 text-left bg-[#070302]">
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

    </div>
  );
}
