import React, { useState, useEffect } from 'react';
import { 
  Award, Play, Flame, Trophy, Route, Compass, BookOpen, 
  MessageSquare, Sparkles, Send, Gift, Users, ClipboardList, 
  ChevronRight, BrainCircuit, Tv, RefreshCw, Star, Info, PlusCircle, 
  BadgeHelp, Heart, FileCode, CheckCircle, Radio, UserCheck, AlertTriangle
} from 'lucide-react';
import { Course, Enrollment, UserProfile, DiscussionThread, Notification } from '../types';
import ThreeCelestialCanvas from './ThreeCelestialCanvas';

interface GuruPortalProps {
  currentUser: UserProfile;
  courses: Course[];
  discussions: DiscussionThread[];
  enrollments: Enrollment[];
  onAddCourse: (course: Partial<Course>) => void;
  onUpdateCourseStatus: (courseId: string, status: 'approved' | 'pending' | 'rejected') => void;
  onAddDiscussionReply: (threadId: string, replyText: string) => void;
  onAddNotification: (notif: { title: string; text: string }) => void;
}

export default function GuruPortal({
  currentUser,
  courses,
  discussions,
  enrollments,
  onAddCourse,
  onUpdateCourseStatus,
  onAddDiscussionReply,
  onAddNotification,
}: GuruPortalProps) {
  // Navigation tabs within Guru Portal
  const [guruTab, setGuruTab] = useState<'dashboard' | 'creation-studio' | 'live-satsang' | 'retention' | 'community' | 'analytics-ai'>('dashboard');

  // Course Creator Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCat, setCourseCat] = useState('Astrology & Jyotish');
  const [coursePrice, setCoursePrice] = useState(1999);
  const [courseDifficulty, setCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [highlightsText, setHighlightsText] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [modulesText, setModulesText] = useState(''); // comma separated or lines
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Satsang Simulator State
  const [satsangActive, setSatsangActive] = useState(false);
  const [liveComments, setLiveComments] = useState<Array<{ id: string, sender: string, avatar: string, message: string }>>([
    { id: '1', sender: 'Maithili Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', message: 'Pranam Guruji! Ready for today’s Upanishad discourse.' },
    { id: '2', sender: 'Ashif Ansari', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', message: 'Ready Acharyaji.' }
  ]);
  const [newSatsangComment, setNewSatsangComment] = useState('');
  const [satsangPollQuestion, setSatsangPollQuestion] = useState('Which Rigveda Samhita has the Gayatri Mantra?');
  const [satsangPollVotes, setSatsangPollVotes] = useState({ opt1: 18, opt2: 4, total: 22 });
  const [pollTriggered, setPollTriggered] = useState(false);

  // State for event bus triggers
  const [guruEventBus, setGuruEventBus] = useState<Array<{ id: string, event: string, timestamp: string }>>([
    { id: '1', event: 'GURU_CONSOLE_STARTED: Authorized and loaded secure lineage channels.', timestamp: new Date().toLocaleTimeString() }
  ]);

  const dispatchGuruEvent = (message: string) => {
    setGuruEventBus(prev => [
      { id: Math.random().toString(), event: message, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 5));
  };

  // Filter courses owned by this instructor
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);

  // Student list simulation for retentionalerter
  const mockStudents = [
    { id: 's-10', name: 'Ashif Ansari', progress: 50, inactiveDays: 1, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', alert: 'green', course: 'Vedic Astrology Foundation' },
    { id: 's-11', name: 'Rohan Sharma', progress: 12, inactiveDays: 9, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', alert: 'low-engagement', course: 'Vedic Astrology Foundation' },
    { id: 's-12', name: 'Priya Iyer', progress: 85, inactiveDays: 4, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop', alert: 'green', course: 'Astrology Matchmaking Systems' },
    { id: 's-13', name: 'Kabir Das', progress: 5, inactiveDays: 14, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop', alert: 'high-risk', course: 'Upanishadic Sanskrit Acoustics' },
  ];

  // Forum threads on Guru's courses
  const myCourseQueries = discussions.filter(d => !d.courseId || d.courseId === 'course-1');

  // Submit Course Draft for admin approval
  const handleSubmitCourseDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) return;

    setIsSubmitting(true);
    
    // Parse highlighting, chapters, modules
    const parsedHighlights = highlightsText ? highlightsText.split('\n').filter(Boolean) : ['Foundational Sanskrit Vowels', 'Audio sandhi commentary'];
    const parsedModules = modulesText ? modulesText.split('\n').filter(Boolean).map((m, id) => ({
      id: `new-mod-${id}`,
      title: m.trim(),
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      durationSeconds: 900
    })) : [
      { id: 'm-1-1', title: 'Chapter Preface', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', durationSeconds: 600 }
    ];

    const newCourseDraft: Partial<Course> = {
      title: courseTitle,
      description: courseDesc,
      category: courseCat,
      price: coursePrice,
      originalPrice: coursePrice * 3,
      difficulty: courseDifficulty,
      thumbnail: 'https://images.unsplash.com/photo-1528319692490-a3e7db010360?w=600&auto=format&fit=crop&q=80',
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      highlights: parsedHighlights,
      status: 'pending', // Pending Admin Moderation
      chapters: [
        {
          id: 'new-ch-1',
          title: chapterTitle || 'Lineage Introduction',
          modules: parsedModules
        }
      ],
      studentsCount: 0,
      rating: 5,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };

    onAddCourse(newCourseDraft);
    dispatchGuruEvent(`COURSE_SUBMITTED: Draft titled "${courseTitle}" sent to central moderations pipeline.`);
    
    onAddNotification({
      title: '📁 Draft Course Submitted',
      text: `Draft course "${courseTitle}" created successfully. It has entered the Admin Moderation Queue.`
    });

    // Reset Form
    setCourseTitle('');
    setCourseDesc('');
    setHighlightsText('');
    setChapterTitle('');
    setModulesText('');
    setIsSubmitting(false);
  };

  const handlePostSatsangComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSatsangComment.trim()) return;

    const myComm = {
      id: Math.random().toString(),
      sender: currentUser.name,
      avatar: currentUser.avatarUrl,
      message: newSatsangComment
    };

    setLiveComments(prev => [...prev, myComm]);
    setNewSatsangComment('');
    dispatchGuruEvent('SATSANG_COMMENT_POSTED: Guruji sent a spiritual response.');
  };

  const startSatsangChannel = () => {
    setSatsangActive(true);
    dispatchGuruEvent('LIVE_SATSANG_ENABLED: Video sound streaming launched.');
    onAddNotification({
      title: '🎥 Virtual Satsang Room Open',
      text: 'You are now transmitting live stream audio and presentation boards to current shishyas.'
    });
  };

  const stopSatsangChannel = () => {
    setSatsangActive(false);
    setPollTriggered(false);
    dispatchGuruEvent('LIVE_SATSANG_CLOSED: Satsang finished and archived.');
  };

  const triggerPollSatsang = () => {
    setPollTriggered(true);
    setSatsangPollVotes({ opt1: 24, opt2: 6, total: 30 });
    dispatchGuruEvent('SATSANG_POLL_BROADCAST: Sent live evaluation queries to 30 scholars.');
  };

  return (
    <div className="space-y-6 text-white pb-12 animate-in fade-in duration-300">
      
      {/* Platform Header matching visual schemas */}
      <div className="relative border-b border-orange-500/25 pb-6">
        <ThreeCelestialCanvas color="#ca8a04" particleCount={40} className="absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[9px] font-bold text-[#eab308] uppercase tracking-widest font-mono">
              Venerable Guru Dashboard
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold font-serif tracking-tight mt-1 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Gurukul Educator Command
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-serif mt-1 max-w-2xl">
              Publish rich spiritual courses, track retention analytics, resolve student inquiries, and host live satsang video networks.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 font-mono text-[10px] uppercase font-bold rounded-lg leading-none animate-pulse">
              ● Server Gateway synchronized
            </span>
          </div>
        </div>

        {/* Navigation Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-6 border-t border-gray-850/65 pt-4">
          {[
            { id: 'dashboard', label: 'Guru Console', icon: Compass },
            { id: 'creation-studio', label: 'Course Creation Studio', icon: PlusCircle },
            { id: 'live-satsang', label: 'Live Satsang Center', icon: Radio },
            { id: 'retention', label: 'Student Retention', icon: AlertTriangle },
            { id: 'community', label: 'Community Solvers', icon: MessageSquare },
            { id: 'analytics-ai', label: 'AI Advisory Insight', icon: BrainCircuit }
          ].map((t) => {
            const IconComp = t.icon;
            const active = guruTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setGuruTab(t.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-serif tracking-wide transition-all cursor-pointer ${
                  active 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow-lg shadow-yellow-950/40' 
                    : 'bg-gray-900 border border-gray-800/80 text-gray-400 hover:text-white hover:border-yellow-500/10'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-amber-500'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER MASTER TABS */}
      {guruTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-98 duration-150">
          
          {/* Guru Analytics Counters - 2/3 Width */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
              <div className="bg-[#11131c] border border-gray-800 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">My Combined Scholar Pool</span>
                <p className="text-3xl font-black text-white mt-1.5">340 Seekers</p>
                <span className="text-[#22c55e] text-xs font-bold mt-1 block">↑ 12% Month Increase</span>
              </div>
              <div className="bg-[#11131c] border border-gray-800 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">My Dakshina Revenue</span>
                <p className="text-3xl font-black text-amber-500 mt-1.5 opacity-90 font-serif">₹12,400</p>
                <span className="text-gray-400 text-xs mt-1 block">Accumulated over active years</span>
              </div>
              <div className="bg-[#11131c] border border-gray-800 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Avg Scholar Satisfaction</span>
                <p className="text-3xl font-black text-[#ca8a04] mt-1.5 font-serif">4.9 ★</p>
                <span className="text-[#22c55e] text-xs font-bold mt-1 block">Traditional satisfactory index</span>
              </div>
            </div>

            {/* Platform Approved Courses table */}
            <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs uppercase text-orange-400 font-mono tracking-widest font-bold border-b border-gray-850 pb-2">
                My Published Spiritual Tracks
              </h4>

              <div className="space-y-4">
                {myCourses.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No custom draft tracks found. Visit the Creation Studio!</p>
                ) : (
                  myCourses.map(c => (
                    <div key={c.id} className="bg-gray-950/40 border border-gray-850 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                      <div className="flex items-center space-x-3.5">
                        <img src={c.thumbnail} className="w-16 h-12 object-cover rounded-md" />
                        <div>
                          <h5 className="font-serif font-bold text-xs sm:text-sm text-gray-200">{c.title}</h5>
                          <span className="text-[10px] text-gray-550 block mt-1 text-gray-300">{c.category} • {c.difficulty}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-mono tracking-wider font-bold px-3 py-1 rounded-full ${
                          c.status === 'approved' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30' : 
                          'bg-amber-950/40 text-amber-300 border border-amber-900/10'
                        }`}>
                          {c.status}
                        </span>
                        <span className="text-xs font-mono block mt-1.5 text-amber-500 font-bold">₹{c.price} Dakshina</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column context panels (1/3 Width) */}
          <div className="space-y-6 animate-in slide-in-from-right-3">

            {/* Guru events pipeline simulation tracker */}
            <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5 space-y-4 font-serif">
              <div className="flex items-center justify-between border-b border-gray-850 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-ping"></span>
                  <h4 className="text-[10px] uppercase text-[#eab308] font-mono tracking-wider font-extrabold">Guru Secure Action logs</h4>
                </div>
                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">Present Stream</span>
              </div>
              <p className="text-[10px] text-gray-400 font-serif leading-relaxed">
                Actions committed on the Guru Interface trigger event logs broadcasted into the central admin systems in real-time.
              </p>
              <div className="space-y-2 bg-gray-950/60 p-3 rounded-xl border border-yellow-500/5 max-h-48 overflow-y-auto font-mono text-[9.5px]">
                {guruEventBus.map((bus) => (
                  <div key={bus.id} className="border-b border-gray-850/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between text-yellow-500 font-bold text-[9px]">
                      <span>EVENT_DISPATCH</span>
                      <span>{bus.timestamp}</span>
                    </div>
                    <p className="text-gray-300 leading-snug mt-1 font-sans text-[9px]">{bus.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Stats Insight Card details */}
            <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-[#f97316] font-mono font-bold block">Educator Lineage Status</span>
              <p className="text-xs text-gray-300 font-serif leading-relaxed">
                Lineage scholars are authorized to submit courses to advanced astrology systems and linguistics chanting databases. Secure verification codes protect all submitted curricula.
              </p>
            </div>

          </div>

        </div>
      )}

      {guruTab === 'creation-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in border-box duration-250">
          
          {/* Main creation module formulary - 2/3 width */}
          <div className="lg:col-span-2 bg-[#11131c] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <h3 className="text-base sm:text-lg font-bold font-serif text-white">Vedic Course Drafting & Submission Pipeline</h3>
            <p className="text-xs text-gray-400 font-serif">Compose the layout structure of your study tracks and transmit them directly to the super admin team for catalog verification and approval.</p>

            <form onSubmit={handleSubmitCourseDraft} className="space-y-4 font-sans max-w-2xl text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-450 uppercase font-mono mb-1.5 text-gray-300">Course Stream Title</label>
                  <input 
                    type="text" 
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Traditional Parashari Jyotish Principles"
                    className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none focus:border-yellow-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-450 uppercase font-mono mb-1.5 text-gray-300">Target Category</label>
                  <select
                    value={courseCat}
                    onChange={(e) => setCourseCat(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none"
                  >
                    <option value="Astrology & Jyotish">Astrology & Jyotish</option>
                    <option value="Linguistics & Chanting">Linguistics & Chanting</option>
                    <option value="Advanced Shastras">Advanced Shastras</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-450 uppercase font-mono mb-1.5 text-gray-300">Detailed Vision Commentary</label>
                <textarea
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Outline syllabus structure, historical lineages, and preflight requirements."
                  rows={4}
                  className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-350 focus:outline-none font-sans"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-350 uppercase font-mono mb-1.5">Exchange Dakshina (INR)</label>
                  <input 
                    type="number" 
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-350 uppercase font-mono mb-1.5">Challenge Level</label>
                  <select
                    value={courseDifficulty}
                    onChange={(e) => setCourseDifficulty(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none"
                  >
                    <option value="Beginner">Beginner level</option>
                    <option value="Intermediate">Intermediate scholar</option>
                    <option value="Advanced">Advanced expert</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-850 pt-4 space-y-4">
                <span className="text-[10px] uppercase text-orange-400 font-mono font-bold block">Syllabus Outline Chapter - Lesson 1</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase font-mono mb-1.5">Chapter Title</label>
                    <input 
                      type="text" 
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      placeholder="e.g. Chapter 01: Elements and Planets"
                      className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase font-mono mb-1.5">Highlights Highlights (Line breaks)</label>
                    <textarea 
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      placeholder="Traditional Parashari elements&#10;Matchmaking formulas"
                      rows={2}
                      className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none font-sans"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-350 uppercase font-mono mb-1.5">Lecture Modules (one per line)</label>
                  <textarea 
                    value={modulesText}
                    onChange={(e) => setModulesText(e.target.value)}
                    placeholder="Module Introduction and Objectives&#10;Traditional Parashari history"
                    rows={3}
                    className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-300 focus:outline-none font-sans"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-serif font-black uppercase text-xs sm:text-sm tracking-wider rounded-xl transition duration-150 cursor-pointer text-center"
              >
                {isSubmitting ? 'TRANSMITTING DRAFT...' : 'BROADCAST DRAFT TO PLATFORM'}
              </button>

            </form>
          </div>

          {/* Right sidebar tracking logs - 1/3 width */}
          <div className="space-y-6">
            
            {/* Version control of drafts */}
            <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-[#f97316] font-mono font-bold block">Draft Version Control Logs</span>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-950/40 rounded-xl border border-gray-850">
                  <span className="text-[10px] font-mono text-amber-500 font-bold block">V1.0 Initial Draft</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed font-serif mt-1">Syllabus verified, basic video links linked properly inside modules.</p>
                </div>
                <div className="p-3 bg-gray-950/40 rounded-xl border border-gray-850">
                  <span className="text-[10px] font-mono text-gray-550 block">V1.1 Quiz Additions</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed font-serif mt-1">Integrated 5 interactive checkout quiz checkpoints to verify student learning.</p>
                </div>
              </div>
            </div>

            {/* Sandbox moderation guidelines */}
            <div className="bg-[#11131c] border border-gray-850/60 p-5 rounded-2xl space-y-3">
              <span className="text-[9px] uppercase tracking-wider text-orange-400 font-mono block font-bold">Draft approvals guidelines</span>
              <p className="text-xs text-gray-300 font-serif leading-relaxed">
                Ensure draft courses contain high-contrast markdown outline elements and complete traditional explanations. Super administrators evaluate drafts within 24 hours of submission.
              </p>
            </div>

          </div>

        </div>
      )}

      {guruTab === 'live-satsang' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-150">
          
          {/* Main Live Satsang Board Video simulator - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {satsangActive ? (
              <div className="bg-[#0b0c10] border border-yellow-500/30 rounded-2xl overflow-hidden shadow-2xl relative">
                
                {/* Simulated Webcam Board Stream */}
                <div className="aspect-video w-full bg-black/95 flex flex-col items-center justify-center relative p-6">
                  
                  <ThreeCelestialCanvas color="#ca8a04" particleCount={50} className="absolute inset-0 opacity-20 pointer-events-none" />
                  
                  <div className="text-center z-10 space-y-4 max-w-md">
                    <Radio className="w-12 h-12 text-[#eab308] mx-auto animate-bounce" />
                    <span className="px-3 py-1 bg-rose-600 border border-rose-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse select-none">
                      ● TRANSMITTING LIVE SATSANG STREAM
                    </span>
                    <h4 className="text-sm sm:text-base font-black font-serif text-white">Daily Discourse: Srimad Bhagavad Gita Chapter 2 Analysis</h4>
                    
                    <div className="font-mono text-[9.5px] text-gray-400">
                      AUDIO CHANNELS: ACTIVE STEREOS | ENROLLED ATTENDEES: 32 GATHERED
                    </div>
                  </div>

                  {/* Active Poll banner inside video stream */}
                  {pollTriggered && (
                    <div className="absolute top-4 left-4 right-4 bg-gray-950/90 border border-yellow-500/20 p-3 rounded-lg flex items-center justify-between text-xs animate-in zoom-in-95">
                      <div>
                        <p className="font-semibold text-[#f97316] font-serif text-[11px]">{satsangPollQuestion}</p>
                        <p className="text-[10px] text-gray-400 font-serif mt-0.5">Mandala 10, Hymn 62 ({satsangPollVotes.total} total shishya votes cast)</p>
                      </div>
                      <div className="text-right font-mono text-[10px] font-bold text-amber-500">
                        {Math.floor((satsangPollVotes.opt1 / satsangPollVotes.total) * 100)}% YES
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                    <button 
                      onClick={triggerPollSatsang}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-serif font-bold text-[10px] uppercase rounded-lg cursor-pointer"
                    >
                      Broadcast Interactive Poll
                    </button>
                    <button 
                      onClick={stopSatsangChannel}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-serif font-bold text-[10px] uppercase rounded-lg cursor-pointer"
                    >
                      Archive and Close satsang
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-[#11131c] border border-gray-800 p-12 rounded-2xl text-center space-y-4">
                <Radio className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="font-serif text-base text-gray-300">Live Spiritual Satsang is closed at present.</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">Open streaming audio channels to interact directly with current class shishyas, run query polls, and see comments live.</p>
                <button 
                  onClick={startSatsangChannel}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-serif font-black uppercase text-xs rounded-xl transition duration-150 cursor-pointer"
                >
                  TRANSMIT LIVE PATH CHANNELS
                </button>
              </div>
            )}

            {/* Live Stats summary if active */}
            {satsangActive && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Poll status details */}
                <div className="bg-[#11131c] border border-gray-800 p-5 rounded-2xl">
                  <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-bold mb-3 border-b border-gray-850 pb-2">Active Satsang Poll Status</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-serif text-[11px] mb-1 text-gray-300">
                        <span>Mandala 10 (Chanting source option)</span>
                        <span className="font-black font-mono text-amber-500">{satsangPollVotes.opt1} votes</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-850">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(satsangPollVotes.opt1 / satsangPollVotes.total) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Attendance */}
                <div className="bg-[#11131c] border border-gray-800 p-5 rounded-2xl">
                  <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-bold mb-3 border-b border-gray-850 pb-2">Gathered Shishyas (Lineage Scholars)</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Maithili S.', 'Ashif A.', 'Rohan S.', 'Devendra P.', 'Komal C.', 'Inder J.'].map((sh, id) => (
                      <span key={id} className="text-[10px] font-mono px-2.5 py-1 bg-gray-950 border border-gray-850 rounded-lg text-gray-300">
                        👤 {sh}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Satsang Live Scholar Comments Panel - 1/3 width */}
          <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between h-[450px]">
            <div className="border-b border-gray-850 pb-2.5">
              <h4 className="text-xs uppercase text-[#eab308] font-mono tracking-wider font-extrabold">Shishyas Satsang Dialogue</h4>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1 custom-scrollbar text-xs">
              {liveComments.map(c => (
                <div key={c.id} className="bg-gray-950/50 p-2.5 rounded-xl border border-gray-850">
                  <div className="flex items-center space-x-1.5 font-bold font-serif mb-1 text-amber-400 text-[10px]">
                    <img src={c.avatar} className="w-5 h-5 rounded-full object-cover" />
                    <span>{c.sender}</span>
                  </div>
                  <p className="text-gray-300 leading-snug font-sans text-[11px]">{c.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostSatsangComment} className="flex gap-2 border-t border-gray-850 pt-3">
              <input 
                type="text" 
                value={newSatsangComment}
                onChange={(e) => setNewSatsangComment(e.target.value)}
                placeholder="Send wisdom statement as Guru ..."
                className="flex-1 bg-gray-950 border border-gray-800 p-2.5 rounded-lg text-xs font-sans focus:outline-none focus:border-yellow-500/20"
                disabled={!satsangActive}
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#ca8a04] hover:bg-[#eab308] text-black font-semibold text-xs rounded-lg cursor-pointer transition flex items-center"
                disabled={!satsangActive}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

      {guruTab === 'retention' && (
        <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-gray-850/65 pb-4 max-w-xl space-y-1.5 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-bold font-serif text-white">Student Retention & Low-Engagement Alerter</h3>
            <p className="text-xs text-gray-400 font-serif leading-relaxed">
              Vedic discipline requires compassionate supervision. Track shishyas' course progress and immediately identify stagnating seekers to prompt counselor assistance.
            </p>
          </div>

          <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-850">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-gray-950/80 font-mono text-[9px] uppercase tracking-wider text-gray-500 border-b border-gray-850">
                <tr>
                  <th className="p-3.5">Seeker Name</th>
                  <th className="p-3.5">Course Understudy</th>
                  <th className="p-3.5">Progress Rate</th>
                  <th className="p-3.5">Inactive Days</th>
                  <th className="p-3.5">Lineage status</th>
                  <th className="p-3.5 text-right">Action support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850 bg-transparent text-gray-350">
                {mockStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="p-3.5 flex items-center space-x-2.5 font-semibold text-gray-200">
                      <img src={st.avatar} className="w-6 h-6 rounded-full object-cover" />
                      <span>{st.name}</span>
                    </td>
                    <td className="p-3.5 font-serif text-gray-400">{st.course}</td>
                    <td className="p-3.5 font-mono text-[#22c55e] font-bold">{st.progress}%</td>
                    <td className="p-3.5 font-mono text-gray-400">{st.inactiveDays} days</td>
                    <td className="p-3.5">
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        st.alert === 'green' ? 'bg-emerald-950/40 text-emerald-300' :
                        st.alert === 'low-engagement' ? 'bg-amber-950/40 text-amber-300 border border-amber-900/40 animate-pulse' :
                        'bg-rose-950/40 text-rose-300 border border-rose-900/40 animate-pulse'
                      }`}>
                        {st.alert === 'green' ? 'ACTIVE' : st.alert === 'low-engagement' ? 'STAGNATED' : 'DISENGAGED RISK'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={() => {
                          onAddNotification({
                            title: `💬 Remedial Message Sent`,
                            text: `Remedial spiritual counsel forwarded automatically to ${st.name}.`
                          });
                          dispatchGuruEvent(`REMEDIAL_SENT: Spiritual mentorship check-in message sent in user's profile mailbox.`);
                        }}
                        className="px-3 py-1.5 bg-yellow-600/10 hover:bg-yellow-600 hover:text-black border border-yellow-500/20 text-yellow-500 text-[10px] font-semibold rounded-lg cursor-pointer transition-all"
                      >
                        Remedial counsel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {guruTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in hover:border-box">
          
          {/* Main List of course inquiries - 2/3 width */}
          <div className="lg:col-span-2 bg-[#11131c] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <h3 className="text-base sm:text-lg font-bold font-serif text-white">Course Queries Moderator Panel</h3>
            <p className="text-xs text-gray-400 font-serif leading-relaxed">Seekers drop deep technical questions on your specific curriculum chapters. Resolve these queries clearly to elevate student satisfaction score lines.</p>

            <div className="space-y-4">
              {myCourseQueries.map(th => (
                <div key={th.id} className="bg-gray-950/50 p-4 rounded-xl border border-gray-850 space-y-3 text-xs text-left">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span className="font-bold text-[#eab308] font-serif">{th.authorName} (Scholars)</span>
                    <span>{new Date(th.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-gray-200 text-xs sm:text-sm font-serif">{th.title}</h5>
                    <p className="text-gray-400 mt-1 leading-relaxed font-sans">{th.body}</p>
                  </div>

                  {/* Reply list if any */}
                  {th.replies.length > 0 && (
                    <div className="space-y-2 mt-2 pl-3 border-l-2 border-[#ca8a04]">
                      {th.replies.map(rep => (
                        <div key={rep.id} className="bg-[#120703]/40 p-2.5 rounded-lg border border-orange-500/5 text-[11px]">
                          <span className="font-bold text-amber-500 font-serif">{rep.authorName} ({rep.authorRole})</span>
                          <p className="text-gray-400 mt-0.5 leading-relaxed font-sans">{rep.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-gray-850/60">
                    <input 
                      type="text" 
                      id={`query-reply-${th.id}`}
                      placeholder="Comment with Vedic wisdom comments or instructions..."
                      className="flex-1 bg-gray-950 border border-gray-850 p-2 rounded-lg text-xs text-gray-200 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        const inputEl = document.getElementById(`query-reply-${th.id}`) as HTMLInputElement;
                        if (!inputEl || !inputEl.value.trim()) return;
                        onAddDiscussionReply(th.id, inputEl.value);
                        dispatchGuruEvent(`QUERY_RESOLVED: Comment posted on "${th.title}".`);
                        inputEl.value = '';
                        onAddNotification({
                          title: '💬 Solver Response Created',
                          text: 'Your scholarly instructions has been synchronized inside this discussion thread.'
                        });
                      }}
                      className="px-4 py-2 bg-[#ca8a04] hover:bg-[#eab308] text-black text-xs font-bold rounded-lg cursor-pointer transition-all"
                    >
                      Answer scholar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel moderation policies - 1/3 width */}
          <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 h-fit space-y-4">
            <span className="text-[9px] uppercase tracking-widest text-[#f97316] font-mono font-bold block">Sanatana Lineage Guidelines</span>
            <p className="text-xs text-gray-400 leading-relaxed font-serif">
              Provide answers rooted directly in traditional scriptures commentaries (Advaita, Upanisadic, or Sidereal Parashari coordinates charts). Maintain professional traditional reverence. Avoid abbreviated shortcuts.
            </p>
          </div>

        </div>
      )}

      {guruTab === 'analytics-ai' && (
        <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-6 space-y-6 relative overflow-hidden">
          <ThreeCelestialCanvas color="#ca8a04" particleCount={50} className="absolute inset-0 opacity-15 pointer-events-none" />
          
          <div className="relative z-10 border-b border-gray-850/60 pb-4 max-w-xl">
            <span className="px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/15 rounded-full text-[9px] font-bold text-yellow-400 uppercase tracking-widest font-mono">
              AI Intelligent Advisory Engine
            </span>
            <h3 className="text-lg font-bold font-serif text-white mt-1.5">Intelligent Watch Curves and Sales recommendations</h3>
            <p className="text-xs text-gray-400 font-serif leading-relaxed mt-1">Our server-side AI analyzes student engagement intervals, quiz score rates, and forum comments to draft recommendations for course revisions.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recommendation Card */}
            <div className="bg-gray-950/80 border border-yellow-500/20 p-5 rounded-xl space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h4 className="font-serif text-sm font-bold text-[#f97316]">AI Recommendation: Lesson 4 splitting</h4>
              </div>
              <p className="text-xs leading-relaxed text-gray-400 font-serif">
                Seekers drop out at the 55% interval of <span className="text-gray-200">"Lesson 4: Chanting Resonance metrics"</span>. The 45-minute continuous length leads to attention drift. 
              </p>
              <p className="text-[11.5px] leading-relaxed text-amber-400/90 font-mono">
                → ADVICE: Split into two modules (Part A and Part B), inserting an interactive 3-question checklist block in between.
              </p>
            </div>

            {/* Recommendation Card 2 */}
            <div className="bg-gray-950/80 border border-yellow-500/20 p-5 rounded-xl space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h4 className="font-serif text-sm font-bold text-[#f97316]">AI Recommendation: Quiz revisions</h4>
              </div>
              <p className="text-xs leading-relaxed text-gray-400 font-serif">
                The <span className="text-gray-200">"Sanskrit Vowels Quiz"</span> shows a failure rate of 42%. Questions concerning wave acoustics sandhi have incorrect explanations triggers.
              </p>
              <p className="text-[11.5px] leading-relaxed text-amber-400/90 font-mono">
                → ADVICE: Review questions 3 and 4 parameters, lowering challenge level or simplifying the explanations.
              </p>
            </div>

          </div>

          <div className="relative z-10 bg-gray-950/40 p-4 rounded-lg border border-gray-850 max-w-lg mx-auto text-center font-serif text-xs text-gray-500">
            Intelligent recommendations recalculate automatically at Present Brahma Muhurta.
          </div>

        </div>
      )}

    </div>
  );
}
