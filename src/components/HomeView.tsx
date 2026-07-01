import React, { useState } from 'react';
import { Star, Clock, Users, Play, ChevronRight, MessageCircle } from 'lucide-react';
import { Language, t } from '../localization';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  language: Language;
  theme?: string;
}

export default function HomeView({ onNavigate, language }: HomeViewProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegisterWebinar = (webinarTitle: string) => {
    setSuccessMessage(`Congratulations! You have successfully booked a seat for "${webinarTitle}".`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const webinars = [
    { id: "webinar-1", title: "Mega Astrology Webinar", date: "Sat, 4 Jul", time: "1:00 PM", price: "₹99", originalPrice: "₹999", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", tag: "LIMITED SEATS", status: "Starts in 3 days" },
    { id: "webinar-2", title: "Kundli Pathshala Webinar", date: "4th July, 2026", time: "7:30 PM", price: "₹11", originalPrice: "₹99", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80", tag: "", status: "" },
    { id: "webinar-3", title: "Mega Numerology Webinar", date: "2nd & 3rd July, 2026", time: "9:00 PM", price: "₹99", originalPrice: "₹999", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80", tag: "", status: "" },
    { id: "webinar-4", title: "Palmistry Webinar", date: "Fri, 3 Jul", time: "8:00 PM", price: "₹49", originalPrice: "₹999", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80", tag: "", status: "" }
  ];

  const popularCourses = [
    { id: "course-1", title: "Introduction to Astrology", desc: "Beginner-friendly astrology course covering houses, signs, and planets. Learn to read birth charts and...", duration: "2+ Hours", learners: "2,00,000+", rating: "4.9", reviews: "2,200+", price: "₹199", tag: "Basic", image: "/astrology-course.png", details: "1 Year Access • Certificate Included • Live Practice" },
    { id: "course-2", title: "Learn Numerology with the Basic Numerology Course", desc: "Understand how numbers influence personality, relationships, and life decisions with this beginner-...", duration: "4 Hours", learners: "2,00,000+", rating: "4.7", reviews: "2,800+", price: "₹999", tag: "Basic", image: "/numerology-course.png", details: "1 Year Access • Certificate Included • Live Practice" },
    { id: "course-3", title: "Advanced Panchang Mastery Course", desc: "Predict Using Panchang Beyond Kundli Go beyond basic astrology and unlock the real power of...", duration: "25+ Hours", learners: "2,00,000+", rating: "4.8", reviews: "2,100+", price: "₹34999", tag: "Advanced", image: "/panchang-course.png", details: "1 Year Access • Certificate Included • Live Practice" }
  ];

  return (
    <div className="w-full bg-[var(--color-occult-bg)] pb-20 font-sans">

      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Floating WhatsApp / Chat Widgets */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex items-end">
        <div className="bg-white p-3 rounded-l-xl rounded-tr-xl shadow-lg border border-gray-100 mr-2 mb-2 w-48 text-sm relative">
          <p className="font-semibold text-gray-800">We're Online!</p>
          <p className="text-gray-500 text-xs">How may I help you today?</p>
          <div className="absolute -right-2 bottom-2 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
        </div>
        <button className="w-14 h-14 bg-[#0066ff] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>

      {/* 1. Hero Section */}
      <section className="w-full bg-[var(--color-occult-purple)] text-white overflow-hidden relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">

          {/* Text Column */}
          <div className="flex flex-col items-start w-full min-w-0 z-20">
            <h3 className="text-[#c4a9ff] font-bold tracking-wider text-xs lg:text-sm uppercase mb-3 sm:mb-4">
              INDIA'S MOST TRUSTED ASTROLOGY INSTITUTE
            </h3>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight mb-4 sm:mb-6 text-white drop-shadow-sm w-full break-words">
              Turn your curiosity about the cosmos into a certified skill
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8 sm:mb-10 max-w-lg font-medium">
              Learn from India's finest occult scholars and get certified with globally recognized credentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-12 w-full sm:w-auto">
              <button className="bg-white text-[var(--color-occult-purple)] px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto text-center shadow-lg">
                Join Free Masterclass
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="bg-transparent border border-white text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
              >
                Explore all courses
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 text-white w-full">
              <div>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-1">60+</h4>
                <p className="text-xs sm:text-sm text-[#c4a9ff] font-medium tracking-wide">Learners</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-1">60+</h4>
                <p className="text-xs sm:text-sm text-[#c4a9ff] font-medium tracking-wide">Learning Paths</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-1">4.7+</h4>
                <p className="text-xs sm:text-sm text-[#c4a9ff] font-medium tracking-wide">Google Rating</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-1">30+</h4>
                <p className="text-xs sm:text-sm text-[#c4a9ff] font-medium tracking-wide">Expert Mentors</p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative mt-8 lg:mt-0 flex justify-center items-end h-full min-h-[400px] lg:min-h-[600px] w-full min-w-0 pointer-events-none">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] lg:w-[600px] aspect-square border-[1px] border-white/10 rounded-full flex items-center justify-center">
              <div className="w-[80%] h-[80%] border-[1px] border-white/20 rounded-full flex items-center justify-center border-dashed animate-spin-slow">
                <div className="w-[70%] h-[70%] border-[1px] border-white/30 rounded-full"></div>
              </div>
            </div>
            {/* Main Image */}
            <div className="relative z-10 h-full flex items-end justify-center w-full max-w-[500px] mx-auto pointer-events-auto">
              <img
                src="/hero-image.png"
                alt="Occult Scholar Instructor"
                className="w-full max-w-[400px] lg:max-w-[480px] h-auto max-h-[500px] lg:max-h-[600px] object-cover object-top rounded-t-full shadow-2xl border-4 border-white/10 filter brightness-105 contrast-105"
              />
            </div>
          </div>

        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-8 h-1.5 bg-white rounded-full"></div>
          <div className="w-2 h-1.5 bg-white/40 rounded-full"></div>
          <div className="w-2 h-1.5 bg-white/40 rounded-full"></div>
        </div>
      </section>

      {/* 2. Popular Courses */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h4 className="text-[var(--color-occult-purple-light)] font-bold text-sm tracking-widest uppercase mb-2">TRENDING PROGRAMS</h4>
        <h2 className="text-4xl font-bold text-[var(--color-occult-purple)] font-serif mb-4">Most Popular Courses</h2>
        <p className="text-gray-500 mb-12">Learn at your own pace and become a certified astrology practitioner</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {popularCourses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] transition-shadow">
              {/* Image Header */}
              <div className="relative h-56 w-full">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                {course.tag && (
                  <div className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded shadow ${course.tag === 'Basic' ? 'bg-blue-200 text-blue-900' : 'bg-purple-600 text-white'}`}>
                    {course.tag}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.desc}</p>

                <div className="flex items-center text-gray-500 text-xs mb-4 space-x-4">
                  <div className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {course.duration}</div>
                  <div className="flex items-center"><Users className="w-3 h-3 mr-1" /> {course.learners}</div>
                </div>

                <div className="border-t border-b border-gray-100 py-3 mb-4 text-center">
                  <p className="text-[11px] text-gray-500 font-medium tracking-wide">{course.details}</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-sm ml-1 text-gray-900">{course.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">({course.reviews} reviews)</span>
                  </div>
                  <div className="font-bold text-xl text-gray-900">{course.price}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onNavigate('explore')} className="border border-[var(--color-occult-purple)] text-[var(--color-occult-purple)] py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                    View Syllabus
                  </button>
                  <button onClick={() => onNavigate('explore')} className="bg-[var(--color-occult-purple)] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--color-occult-purple-light)] transition-colors">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Upcoming Webinars */}
      <section className="max-w-7xl mx-auto px-6 py-10 text-center">
        <h4 className="text-[var(--color-occult-purple-light)] font-bold text-sm tracking-widest uppercase mb-2">LIVE & INTERACTIVE</h4>
        <h2 className="text-4xl font-bold text-[var(--color-occult-purple)] font-serif mb-12">Upcoming Webinars</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {webinars.map(webinar => (
            <div key={webinar.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64 w-full">
                <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover" />
                {webinar.tag && (
                  <div className="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {webinar.tag}
                  </div>
                )}
                {webinar.status && (
                  <div className="absolute bottom-0 left-0 w-full bg-amber-500 text-black text-center text-xs font-bold py-1.5">
                    {webinar.status}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[15px] text-gray-900 mb-3">{webinar.title}</h3>
                <div className="text-gray-500 text-xs mb-4 space-y-1">
                  <p>📅 {webinar.date} • {webinar.time}</p>
                </div>
                <div className="flex items-center mb-4">
                  <span className="font-bold text-lg text-gray-900 mr-2">{webinar.price}</span>
                  <span className="text-sm text-gray-400 line-through">{webinar.originalPrice}</span>
                </div>
                <button
                  onClick={() => handleRegisterWebinar(webinar.title)}
                  className="w-full border border-[var(--color-occult-purple)] text-[var(--color-occult-purple)] py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Free Tools (Calculators) */}
      <section className="w-full bg-[var(--color-occult-bg)] py-20 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-serif mb-4 text-gray-900">
            Try <span className="text-[var(--color-occult-purple-light)]">Free Tools</span> before you learn
          </h2>
          <p className="text-gray-500 mb-12">Explore powerful astrology tools for free</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Tool 1 */}
            <div className="bg-[#f3e8ff] border border-[#e9d5ff] rounded-2xl p-6 hover:shadow-lg transition-shadow flex">
              <div className="mr-4 mt-1">
                <div className="w-16 h-16 border-2 border-[var(--color-occult-purple-light)] rounded-lg flex items-center justify-center text-[var(--color-occult-purple-light)] rotate-45 bg-white">
                  <div className="-rotate-45 font-bold text-xl">12</div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Numerology Calculator</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">Unlock your personality, life purpose, and destiny in seconds</p>
                <button onClick={() => onNavigate('numerology')} className="border border-[var(--color-occult-purple-light)] text-[var(--color-occult-purple-light)] bg-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                  Try for free →
                </button>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="bg-[#f3e8ff] border border-[#e9d5ff] rounded-2xl p-6 hover:shadow-lg transition-shadow flex">
              <div className="mr-4 mt-1">
                <div className="w-16 h-16 border-2 border-[var(--color-occult-purple-light)] rounded-lg flex items-center justify-center text-[var(--color-occult-purple-light)] bg-white">
                  <Star className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Tarot Calculator</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">Guidance for Love, Career, Health and Life through Tarot Reading</p>
                <button onClick={() => onNavigate('tarot')} className="border border-[var(--color-occult-purple-light)] text-[var(--color-occult-purple-light)] bg-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                  Try for free →
                </button>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="bg-[#f3e8ff] border border-[#e9d5ff] rounded-2xl p-6 hover:shadow-lg transition-shadow flex">
              <div className="mr-4 mt-1">
                <div className="w-16 h-16 border-2 border-[var(--color-occult-purple-light)] rounded-lg flex items-center justify-center text-[var(--color-occult-purple-light)] rotate-45 bg-white">
                  <div className="-rotate-45 font-bold text-xl">9</div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Ram Shalaka Calculator</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">Find Answers and Clarity Through Shri Ram Shalaka</p>
                <button onClick={() => onNavigate('ram-shalaka')} className="border border-[var(--color-occult-purple-light)] text-[var(--color-occult-purple-light)] bg-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                  Try for free →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button onClick={() => onNavigate('astrology-kundli')} className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors inline-flex items-center">
              Explore more →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
