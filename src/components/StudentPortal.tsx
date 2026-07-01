import React, { useState, useEffect } from 'react';
import { 
  Award, Play, Flame, Trophy, Route, Compass, BookOpen, 
  MessageSquare, Sparkles, Send, Gift, Users, ClipboardList, 
  ChevronRight, BrainCircuit, Tv, RefreshCw, Star, Info,
  Radio, Settings, HelpCircle, HardDrive, ShieldCheck, Clock,
  FileCode, Terminal, FileText, ChevronDown, CheckCircle, Download, Key
} from 'lucide-react';
import { Course, Enrollment, UserProfile, CourseNote, DiscussionThread } from '../types';
import ThreeCelestialCanvas from './ThreeCelestialCanvas';
import { Language, t } from '../localization';

interface StudentPortalProps {
  currentUser: UserProfile;
  language: Language;
  courses: Course[];
  enrollments: Enrollment[];
  notes: CourseNote[];
  discussions: DiscussionThread[];
  onEnroll: (courseId: string) => void;
  onUpdateProgress: (courseId: string, moduleId: string, progress: number) => void;
  onAddDiscussion: (title: string, body: string) => void;
  onAddNote: (courseId: string, moduleId: string, seconds: number, text: string) => void;
  onAddNotification: (notif: { title: string; text: string }) => void;
  onNavigate: (tab: string) => void;
  onVerifyCertificate?: (certId: string) => void;
}

export default function StudentPortal({
  currentUser,
  language,
  courses,
  enrollments,
  notes,
  discussions,
  onEnroll,
  onUpdateProgress,
  onAddDiscussion,
  onAddNote,
  onAddNotification,
  onNavigate,
  onVerifyCertificate,
}: StudentPortalProps) {
  // Navigation tabs within Student Portal
  const [studentTab, setStudentTab] = useState<'snapshot' | 'path' | 'learning' | 'gates' | 'live-classes' | 'community' | 'ai-mentor' | 'referrals' | 'support' | 'settings'>('snapshot');
  
  // Selected course for player
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [playerNoteText, setPlayerNoteText] = useState('');
  
  // AI Chat state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponses, setAiResponses] = useState<Array<{ sender: 'seeker' | 'guru', text: string, timestamp: string }>>([
    { sender: 'guru', text: 'Hari Om, shishya! I am Sankalp, your personal Vedic AI Mentor. How can I guide your spiritual and intellectual sadhana today?', timestamp: 'Just now' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Events system logs (visualizing the centralized backend communication)
  const [eventLogs, setEventLogs] = useState<Array<{ id: string, name: string, payload: string, timestamp: string }>>([
    { id: '1', name: 'SYSTEM_BOOT', payload: 'Central events bus initialized for user ' + currentUser.name, timestamp: new Date().toLocaleTimeString() }
  ]);

  // Quiz Engine States
  const [quizActive, setQuizActive] = useState(false);
  const [quizTimer, setQuizTimer] = useState(120); // 2 minutes
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Assignments States
  const [assignmentFile, setAssignmentFile] = useState<string>('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Coding Labs Sandbox States
  const [codeSnippet, setCodeSnippet] = useState(`// Sanskrit Sandhi joiner simulation
function joinSandhi(word1, word2) {
  if (word1.endsWith("अ") && word2.startsWith("इ")) {
    return word1.slice(0, -1) + "ए" + word2.slice(1);
  }
  return word1 + word2;
}
console.log(joinSandhi("देव", "इन्द्र")); // Devendra`);
  const [codeOutput, setCodeOutput] = useState('');

  // Live Satsang States
  const [satsangReaction, setSatsangReaction] = useState<string | null>(null);
  const [handRaised, setHandRaised] = useState(false);
  const [joinedLiveClass, setJoinedLiveClass] = useState(false);
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{sender: string, text: string}>>([
    { sender: 'Aravind', text: 'Pranam Acharya, ready for Upanishad chanting!' }
  ]);
  const [newLiveMessage, setNewLiveMessage] = useState('');

  // Support Tickets States
  const [supportTickets, setSupportTickets] = useState<Array<{id: string, subject: string, status: string, date: string}>>([
    { id: 'TCK-2041', subject: 'Vedas video playback lag on Chrome', status: 'Pending', date: 'June 28, 2026' }
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState('');

  const dispatchEvent = (name: string, payload: any) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      payload: JSON.stringify(payload),
      timestamp: new Date().toLocaleTimeString()
    };
    setEventLogs(prev => [newLog, ...prev].slice(0, 5));
    // Trigger real system notification via platform
    if (name === 'COURSE_COMPLETED') {
      onAddNotification({
        title: `🏆 Path Milestone Achieved`,
        text: `Congratulations on finishing ${payload.courseTitle}! Your certificate is registered on the ledger.`
      });
    }
  };

  // Helper properties
  const studentEnrollments = enrollments.filter(e => e.userId === currentUser.id);
  const enrolledCourses = courses.filter(c => studentEnrollments.some(e => e.courseId === c.id));
  
  // Choose first enrolled course as default or default placeholder
  useEffect(() => {
    if (enrolledCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(enrolledCourses[0]);
      if (enrolledCourses[0].chapters?.length > 0 && enrolledCourses[0].chapters[0].modules?.length > 0) {
        setActiveModule(enrolledCourses[0].chapters[0].modules[0]);
      }
    }
  }, [enrolledCourses, selectedCourse]);

  // Handle fake course player simulation
  useEffect(() => {
    let timerID: any;
    if (isPlaying && selectedCourse && activeModule) {
      timerID = setInterval(() => {
        setVideoTime(prev => {
          const nextVal = prev + 1;
          if (nextVal >= activeModule.durationSeconds) {
            setIsPlaying(false);
            // Complete module process
            onUpdateProgress(selectedCourse.id, activeModule.id, 100);
            dispatchEvent('MODULE_COMPLETED', { courseTitle: selectedCourse.title, moduleTitle: activeModule.title });
            return 0;
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(timerID);
  }, [isPlaying, selectedCourse, activeModule]);

  // Path scoring calculation: Seeker, Sadhak, Acharya, Guru
  const totalCompletedModules = studentEnrollments.reduce((sum, e) => sum + e.completedModuleIds.length, 0);
  const totalNotesWritten = notes.filter(n => n.userId === currentUser.id).length;
  const pathXP = (totalCompletedModules * 40) + (totalNotesWritten * 20) + (currentUser.certificates.length * 300);
  
  let currentTitle = "Vedic Seeker";
  let titleDescription = "Engaged in preliminary study of Sacred Shastras, building the foundation of spiritual awareness.";
  let nextTitle = "Sadhana Initiate";
  let percentToNext = 0;

  if (pathXP < 100) {
    currentTitle = "Sadhana Seeker";
    titleDescription = "Initiating the study of Sacred Shastras, exploring spiritual values and core rules.";
    nextTitle = "Disciplined Sadhak";
    percentToNext = Math.min(100, Math.floor((pathXP / 100) * 100));
  } else if (pathXP < 400) {
    currentTitle = "Disciplined Sadhak";
    titleDescription = "Actively practicing Vedic lessons, writing notes, and engaging with the community regularly.";
    nextTitle = "Spiritual Acharya";
    percentToNext = Math.min(100, Math.floor(((pathXP - 100) / 300) * 100));
  } else if (pathXP < 1000) {
    currentTitle = "Spiritual Acharya";
    titleDescription = "Demonstrating masterly comprehension of complex scriptures, advising fellow seekers with clarity.";
    nextTitle = "Revered Gurudev";
    percentToNext = Math.min(100, Math.floor(((pathXP - 400) / 600) * 100));
  } else {
    currentTitle = "Revered Gurudev";
    titleDescription = "The ultimate stage of divine knowledge transference. Guiding thousands of souls on the timeless path.";
    nextTitle = "Ascended Siddha Master";
    percentToNext = 100;
  }

  // Handle AI Guidance ask
  const handleQueryGuru = async (text: string) => {
    if (!text.trim() || aiLoading) return;
    
    const userMsg = { sender: 'seeker' as const, text, timestamp: new Date().toLocaleTimeString() };
    setAiResponses(prev => [...prev, userMsg]);
    setAiPrompt('');
    setAiLoading(true);

    dispatchEvent('AI_MENTOR_QUERY', { query: text });

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          courseContext: selectedCourse ? { title: selectedCourse.title, category: selectedCourse.category } : null,
          messageHistory: aiResponses.map(m => ({ text: m.text }))
        })
      });
      const data = await response.json();
      setAiResponses(prev => [...prev, { sender: 'guru' as const, text: data.response, timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      console.error(err);
      setAiResponses(prev => [...prev, { sender: 'guru' as const, text: 'Pranam. Connection interrupted in the celestial networks. Please try re-invoking your request.', timestamp: 'Just now' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleWriteNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerNoteText.trim() || !selectedCourse || !activeModule) return;
    
    onAddNote(selectedCourse.id, activeModule.id, videoTime, playerNoteText);
    dispatchEvent('NOTE_CREATED', { courseTitle: selectedCourse.title, text: playerNoteText });
    setPlayerNoteText('');
    onAddNotification({
      title: '✏️ Lesson Note Saved',
      text: 'Your deep reflection has been synchronized with this lesson timestamp!'
    });
  };

  return (
    <div className="space-y-6 text-gray-900 pb-12 animate-in fade-in duration-300">
      
      {/* Visual Header matching dark-satsang slate design */}
      <div className="relative border-b border-gray-200 pb-6">
        <ThreeCelestialCanvas color="#ea580c" particleCount={40} className="absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 bg-[var(--color-occult-purple)]/10 border border-gray-200 rounded-full text-[9px] font-bold text-slate-gray uppercase tracking-widest font-mono">
              Shishya Sadhana Devotion
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight mt-1 bg-gradient-to-r from-amber-200 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Seeker’s Portal & Sacred Path
            </h2>
            <p className="text-slate-gray text-xs sm:text-sm font-sans mt-1 max-w-2xl">
              An immersive space combining traditional gurukul discipline with advanced personal AI tutoring, streak trackers, and dynamic certificate paths.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg flex items-center space-x-3 shadow-none shadow-orange-950/25">
              <Flame className="w-5 h-5 text-ink-black animate-pulse" />
              <div>
                <p className="text-[10px] text-slate-gray font-mono tracking-widest uppercase font-bold">Guru Sadhana Streak</p>
                <p className="text-base font-extrabold font-sans text-gray-900">12 Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1.5 mt-6 border-t border-gray-200/60 pt-4">
          {[
            { id: 'snapshot', label: 'Learning Snapshot', icon: Compass },
            { id: 'path', label: 'My Spiritual Path', icon: Route },
            { id: 'learning', label: 'My Sacred Learning', icon: BookOpen },
            { id: 'gates', label: 'Vedic Gates (Mock/Quiz)', icon: ClipboardList },
            { id: 'live-classes', label: 'Live Satsangs', icon: Radio },
            { id: 'ai-mentor', label: 'Sankalp AI Guru', icon: BrainCircuit },
            { id: 'referrals', label: 'Refer & Earn', icon: Gift },
            { id: 'support', label: 'Support & Tickets', icon: HelpCircle },
            { id: 'settings', label: 'Settings & Security', icon: Settings }
          ].map((t) => {
            const IconComp = t.icon;
            const active = studentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setStudentTab(t.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-sans tracking-wide transition-all cursor-pointer ${
                  active 
                    ? 'bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 font-bold shadow-none shadow-orange-950/40' 
                    : 'bg-gray-50 border border-gray-200/80 text-slate-gray hover:text-gray-900 hover:border-gray-200'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${active ? 'text-gray-900' : 'text-slate-gray'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('logout')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-sans tracking-wide transition-all cursor-pointer bg-dusty-rose border border-gray-200 text-burgundy hover:bg-red-600 hover:text-gray-900 sm:ml-auto"
          >
            <Key className="w-3.5 h-3.5 animate-pulse" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC SUB-TABS */}
      {studentTab === 'snapshot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Immersive Welcome Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 relative overflow-hidden shadow-none">
              <ThreeCelestialCanvas color="#f59e0b" particleCount={50} className="absolute inset-0 opacity-15 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-lg text-gray-900 shadow-none shadow-orange-950/40">
                  <Flame className="w-10 h-10 text-gray-900 animate-bounce" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-xl font-bold font-sans text-gray-900">Hari Om, Seeker {currentUser.name}!</h3>
                  <p className="text-xs text-slate-gray font-sans leading-relaxed">
                    "तमसो मा ज्योतिर्गमय — Lead me from darkness to spiritual light." You have gathered <span className="font-bold text-amber-300 font-mono">{pathXP} Siddhi XP</span> on your Vedic learning lineage path.
                  </p>
                  <p className="text-[10px] text-slate-gray font-mono">Last activity checked at: Present Brahma Muhurta</p>
                </div>
              </div>
            </div>

            {/* Resume Current Course Player Quick Trigger */}
            {selectedCourse ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-gray font-mono font-bold">CONTINUE PURSUING</span>
                    <h4 className="text-base font-bold font-sans text-ink-black mt-0.5">{selectedCourse.title}</h4>
                  </div>
                  <button 
                    onClick={() => setStudentTab('learning')}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-gray-900 text-[10px] font-sans uppercase tracking-widest font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Launch Sacred Player
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-lg border border-gray-200/40">
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-honey-gold">
                      <Play className="w-4 h-4 text-ink-black" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-gray font-sans">Current Lecture Module</p>
                      <p className="font-semibold text-ink-black text-xs mt-0.5 font-mono">{activeModule?.title || 'Lecture'}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-gray font-mono">Module Duration</p>
                    <p className="font-bold text-slate-gray text-xs font-mono">{activeModule ? Math.floor(activeModule.durationSeconds / 60) : 0} minutes</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-10 text-center space-y-4">
                <Compass className="w-12 h-12 text-slate-gray mx-auto" />
                <h4 className="text-ink-black font-sans text-base">You are not enrolled in any study tracks yet.</h4>
                <button 
                  onClick={() => onNavigate('explore')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] hover:from-orange-500 hover:to-amber-400 text-gray-900 text-xs font-sans uppercase tracking-widest font-bold rounded-lg cursor-pointer"
                >
                  Explore Sacred Courses
                </button>
              </div>
            )}

            {/* Beautiful Netflix-style Course Library Rows */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-widest font-bold border-b border-gray-200/60 pb-1.5">
                Path Recommended Study Tracks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.slice(0, 2).map(c => (
                  <div key={c.id} className="bg-white shadow-sm border border-gray-100 border border-gray-200 hover:border-gray-200 rounded-lg overflow-hidden transition-all duration-300 flex flex-col group h-full">
                    <div className="relative h-28 overflow-hidden">
                      <img src={c.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-transparent"></div>
                      <span className="absolute top-2.5 right-2.5 bg-orange-950/80 border border-gray-200 text-slate-gray text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md font-semibold select-none">
                        {c.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h5 className="font-bold text-ink-black text-xs sm:text-sm font-sans line-clamp-1">{c.title}</h5>
                        <p className="text-[11px] text-slate-gray font-sans leading-relaxed line-clamp-2 mt-1">{c.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                        <span className="text-[11px] text-[var(--color-occult-magenta)] font-semibold font-mono">₹{c.price} Tuition</span>
                        <button
                          onClick={() => {
                            onEnroll(c.id);
                            setSelectedCourse(c);
                            if (c.chapters?.length > 0 && c.chapters[0].modules?.length > 0) {
                              setActiveModule(c.chapters[0].modules[0]);
                            }
                            dispatchEvent('ENROLL_COURSE', { courseId: c.id, title: c.title });
                            onAddNotification({
                              title: '🕉️ Enrolled Successfully',
                              text: `You have successfully taken up the study stream of ${c.title}.`
                            });
                          }}
                          className="px-3.5 py-1.5 bg-orange-600/10 hover:bg-orange-600 text-slate-gray hover:text-gray-900 text-[9px] font-sans uppercase tracking-wider font-bold rounded-lg border border-gray-200 transition-all cursor-pointer"
                        >
                          Enroll instant
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column Context Panel (1/3 width) */}
          <div className="space-y-6">

            {/* Path Rank level meter widget */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-slate-gray font-mono font-bold">Path Rank</span>
                <span className="text-[9px] uppercase tracking-wider text-honey-gold font-mono font-extrabold">{pathXP} XP</span>
              </div>
              <div>
                <h4 className="text-sm font-black font-sans text-gray-900 hover:text-slate-gray">{currentTitle}</h4>
                <p className="text-[11px] leading-relaxed text-slate-gray font-sans mt-1">{titleDescription}</p>
              </div>

              {/* Progress Slider bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-gray">
                  <span>To Next Milestones:</span>
                  <span>{percentToNext}% ({nextTitle})</span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-200">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentToNext}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 font-sans text-xs space-y-2">
                <div className="flex justify-between text-slate-gray text-xs">
                  <span>Completed Modules:</span>
                  <span className="font-semibold text-gray-900 font-mono">{totalCompletedModules}</span>
                </div>
                <div className="flex justify-between text-slate-gray text-xs">
                  <span>Written Notes:</span>
                  <span className="font-semibold text-gray-900 font-mono">{totalNotesWritten}</span>
                </div>
                <div className="flex justify-between text-slate-gray text-xs">
                  <span>Cryptographic Certs:</span>
                  <span className="font-semibold text-gray-900 font-mono">{currentUser.certificates.length}</span>
                </div>
              </div>
            </div>

            {/* Central Unified events channel simulator visualizer */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping"></span>
                  <h4 className="text-[10px] uppercase text-slate-gray font-mono tracking-wider font-extrabold">Unified Event Gateway Log</h4>
                </div>
                <span className="text-[8px] uppercase tracking-wider text-slate-gray font-mono">Live Central Server</span>
              </div>
              <p className="text-[10px] text-slate-gray font-sans leading-relaxed">
                Watch how taking actions dynamically pushes to central analytical models, informing teachers, updating admin counters, and correcting AI recommendations.
              </p>
              <div className="space-y-2 bg-white/65 p-2.5 rounded-lg border border-gray-200 max-h-48 overflow-y-auto custom-scrollbar font-mono text-[9px]">
                {eventLogs.map((log) => (
                  <div key={log.id} className="border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-[#ef4444]">
                      <span className="font-black text-[var(--color-occult-magenta)]">{log.name}</span>
                      <span className="text-slate-gray text-[8px]">{log.timestamp}</span>
                    </div>
                    <p className="text-ink-black truncate font-sans text-[9px] leading-tight mt-0.5">{log.payload}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {studentTab === 'path' && (
        <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-6 space-y-8">
          <div className="border-b border-gray-200/60 pb-4 text-center max-w-xl mx-auto space-y-2">
            <Trophy className="w-10 h-10 text-ink-black mx-auto animate-pulse" />
            <h3 className="text-xl font-bold font-sans text-gray-900">Your Lineage Spiritual Path Progression</h3>
            <p className="text-xs text-slate-gray font-sans leading-relaxed">
              Every video, transcript reflection, custom summary, or quiz attempt pushes your status within the Sanatan Gurukul registry network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: '1', title: 'Sadhana Seeker', xp: '0 - 100 XP', active: pathXP < 100, desc: 'Exploring Sanskrit vowels, basic pranayamas, horoscope elements, and fundamental principles.' },
              { id: '2', title: 'Disciplined Sadhak', xp: '100 - 400 XP', active: pathXP >= 100 && pathXP < 400, desc: 'Engaged in deeper sandhi rules, chanting meters, secondary houses analysis, and writing notes.' },
              { id: '3', title: 'Spiritual Acharya', xp: '400 - 1000 XP', active: pathXP >= 400 && pathXP < 1000, desc: 'Advanced commentary, panchang forecasting, matchmaking algorithms logic, and helper evaluations.' },
              { id: '4', title: 'Revered Gurudev', xp: '1000+ XP', active: pathXP >= 1000, desc: 'Complete master of scriptures, offering live satsang sessions, evaluating candidates, and sharing grace.' }
            ].map((p, idx) => (
              <div 
                key={p.id} 
                className={`p-5 rounded-lg border transition-all ${
                  p.active 
                    ? 'bg-gradient-to-b from-[#1c0d0a]/60 to-[#11131c]/60 border-gray-300 shadow-none shadow-orange-950/20' 
                    : 'bg-gray-50/40 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-gray font-black uppercase">STAGE 0{idx + 1}</span>
                  {p.active && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                </div>
                <h4 className="font-sans font-black text-xs sm:text-sm text-ink-black mt-2">{p.title}</h4>
                <p className="font-mono text-[9px] text-[#22c55e] mt-1">{p.xp}</p>
                <p className="text-[11px] text-gray-450 leading-relaxed font-sans mt-3 text-ink-black">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white/50 p-5 rounded-lg border border-gray-200 max-w-lg mx-auto text-center space-y-1 text-xs">
            <span className="font-sans text-slate-gray block font-bold">💎 Cryptographic Lineage Records Guarded Securely</span>
            <p className="text-slate-gray leading-relaxed font-sans">
              Our backends synchronize these milestones inside your registry account profile instantly. Earn and redeem siddhi credits for complete certifications.
            </p>
          </div>

          {/* Siddhi Certifications & Lineage Honors */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-ink-black" />
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-widest font-bold">
                Siddhi Certifications & Lineage Honors
              </h4>
            </div>
            <p className="text-xs text-slate-gray font-sans leading-relaxed">
              Complete all lessons in a study track to unlock your secure, cryptographic lineage completion certificate.
            </p>

            {enrolledCourses.length === 0 ? (
              <p className="text-xs text-slate-gray italic py-3">Enroll in a course to start tracking your certificate progress.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrolledCourses.map((c) => {
                  const enroll = studentEnrollments.find(e => e.courseId === c.id);
                  const completedCount = enroll?.completedModuleIds.length || 0;
                  const totalCount = c.chapters.reduce((sum, ch) => sum + ch.modules.length, 0);
                  const isCompleted = totalCount > 0 && completedCount === totalCount;
                  const percent = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;
                  
                  // Check if this certificate is already in user profile
                  const cert = currentUser.certificates?.find(certItem => certItem.courseId === c.id);

                  return (
                    <div 
                      key={c.id} 
                      className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                        isCompleted 
                          ? 'bg-purple-50/40 border-yellow-500/30' 
                          : 'bg-white/50 border-gray-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">{c.category}</span>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                            isCompleted ? 'bg-emerald-950/60 text-ink-black border border-emerald-900/30' : 'bg-gray-50 text-slate-gray'
                          }`}>
                            {isCompleted ? '🏆 UNLOCKED' : '🔒 LOCKED'}
                          </span>
                        </div>
                        <h5 className="font-sans font-bold text-xs sm:text-sm text-ink-black line-clamp-1">{c.title}</h5>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-[9px] font-mono text-slate-gray">
                            <span>Lessons: {completedCount} / {totalCount}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden border border-gray-200">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-orange-500'}`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                        {isCompleted && cert ? (
                          <>
                            <span className="text-[9px] font-mono text-ink-black">Issued at present lineage</span>
                            <button
                              onClick={() => {
                                if (onVerifyCertificate) {
                                  onVerifyCertificate(cert.id);
                                } else {
                                  onNavigate('profile');
                                }
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-[var(--color-occult-purple-light)] hover:from-yellow-500 hover:to-amber-400 text-black text-[10px] font-sans uppercase tracking-wider font-bold rounded-lg cursor-pointer transition-all"
                            >
                              Claim Honors
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-[9px] font-mono text-slate-gray font-sans">Achieve 100% to claim certificate</span>
                            <button
                              disabled
                              className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-550 text-[10px] font-sans uppercase tracking-wider font-bold rounded-lg cursor-not-allowed"
                            >
                              Locked
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {studentTab === 'learning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column Syllabus chapters list - 1/3 width */}
          <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 h-fit space-y-4">
            <h4 className="text-xs uppercase text-slate-gray font-mono tracking-widest font-extrabold border-b border-gray-200 pb-2.5">
              My Sacred Playlists
            </h4>

            {enrolledCourses.length === 0 ? (
              <p className="text-xs text-slate-gray py-6 text-center italic">Enlist in courses to display lists.</p>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.map((c) => {
                  const enroll = studentEnrollments.find(e => e.courseId === c.id);
                  const isSelected = selectedCourse?.id === c.id;
                  return (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        setSelectedCourse(c);
                        if (c.chapters?.length > 0 && c.chapters[0].modules?.length > 0) {
                          setActiveModule(c.chapters[0].modules[0]);
                        }
                        setIsPlaying(false);
                      }}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-purple-50 border-gray-300 text-gray-900' 
                          : 'bg-gray-50/60 border-transparent hover:border-gray-200 text-slate-gray hover:text-gray-900'
                      }`}
                    >
                      <h5 className="font-bold text-xs truncate font-sans">{c.title}</h5>
                      <div className="flex items-center justify-between text-[9px] font-mono font-semibold text-gray-550 mt-1.5 text-ink-black">
                        <span>Modules: {c.chapters.reduce((sum, ch) => sum + ch.modules.length, 0)}</span>
                        <span className="text-[#22c55e]">Completed: {enroll?.completedModuleIds.length || 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SYLLABUS RAIL DETAIL inside selected course */}
            {selectedCourse && (
              <div className="pt-4 border-t border-gray-200 text-left">
                <span className="text-[9px] uppercase tracking-wider text-slate-gray font-mono block font-extrabold mb-3">CONCURRENT SYLLABUS</span>
                <div className="space-y-3">
                  {selectedCourse.chapters.map((ch) => (
                    <div key={ch.id} className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-gray font-sans leading-tight">{ch.title}</span>
                      <div className="space-y-1">
                        {ch.modules.map((mod) => {
                          const isCompleted = studentEnrollments.find(e => e.courseId === selectedCourse.id)?.completedModuleIds.includes(mod.id);
                          const isPlayingThis = activeModule?.id === mod.id;
                          return (
                            <button
                              key={mod.id}
                              onClick={() => {
                                setActiveModule(mod);
                                setVideoTime(0);
                                setIsPlaying(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-lg text-[11px] transition-all flex items-center justify-between font-sans ${
                                isPlayingThis 
                                  ? 'bg-orange-600/10 border border-gray-200 text-[var(--color-occult-purple)]' 
                                  : 'bg-gray-50 hover:bg-gray-50 text-ink-black'
                              }`}
                            >
                              <span className="truncate">{mod.title}</span>
                              <span className="text-[9px] text-gray-550 shrink-0 select-none ml-2">
                                {isCompleted ? '✅' : '⏳'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Immersive Video Player & interactive modules - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCourse && activeModule ? (
              <div className="space-y-6">
                
                {/* Visual Fake Video Player Canvas */}
                <div className="bg-paper-whitelack/90 border border-gray-200 rounded-lg overflow-hidden shadow-none relative">
                  <div className="aspect-video w-full flex flex-col items-center justify-center relative p-6">
                    
                    {/* Flow Particles */}
                    {isPlaying && <ThreeCelestialCanvas color="#ea580c" particleCount={30} className="absolute inset-0 opacity-10 pointer-events-none" />}
                    
                    <div className="z-10 text-center space-y-4 max-w-md">
                      <Tv className="w-12 h-12 text-ink-black mx-auto animate-bounce" />
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#f97316] font-mono bg-purple-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                          {selectedCourse.category} Active Lecture
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-ink-black font-sans leading-snug">{activeModule.title}</h4>
                      </div>
                      
                      <div className="pt-2 font-mono text-[9px] text-slate-gray">
                        TIMECODE: {Math.floor(videoTime / 60)}:{(videoTime % 60).toString().padStart(2, '0')} / {Math.floor(activeModule.durationSeconds / 60)}:00
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                        <button
                          onClick={() => {
                            setIsPlaying(!isPlaying);
                            dispatchEvent(isPlaying ? 'VIDEO_PAUSED' : 'VIDEO_PLAYING', { moduleTitle: activeModule.title, timeSeconds: videoTime });
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] hover:from-orange-500 hover:to-amber-400 text-gray-900 font-sans font-bold text-xs uppercase tracking-widest rounded-lg transition shadow shadow-orange-950/30 cursor-pointer"
                        >
                          {isPlaying ? 'PAUSE RECIPROCATION' : 'RESUME CHANTING'}
                        </button>
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            onUpdateProgress(selectedCourse.id, activeModule.id, 100);
                            dispatchEvent('MODULE_COMPLETED', { courseTitle: selectedCourse.title, moduleTitle: activeModule.title });
                            setVideoTime(0);
                            onAddNotification({
                              title: '🏆 Module Completed!',
                              text: `You have successfully completed "${activeModule.title}"!`
                            });
                          }}
                          className="px-4 py-2 bg-emerald-700/20 hover:bg-emerald-600 hover:text-black border border-emerald-500/30 text-emerald-300 font-sans font-bold text-xs uppercase tracking-widest rounded-lg transition cursor-pointer"
                        >
                          Complete Lesson
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-2 inset-x-4 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-200">
                      <div 
                        className="bg-orange-500 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${(videoTime / activeModule.durationSeconds) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Sub Lecture Interaction tabs: Reflection Notes & Script Transcript */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Notes Builder */}
                  <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
                    <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-2">
                      ✏️ Study Reflections & Shastras Notes
                    </h4>
                    
                    <form onSubmit={handleWriteNotes} className="space-y-3">
                      <textarea
                        value={playerNoteText}
                        onChange={(e) => setPlayerNoteText(e.target.value)}
                        placeholder="Log insight resonance or technical parameters of this time frame..."
                        rows={3}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs sm:text-sm text-ink-black focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-offset-0 placeholder-gray-600 font-sans"
                      ></textarea>

                      <button
                        type="submit"
                        className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-gray-900 rounded-lg text-xs font-sans font-bold tracking-widest uppercase transition cursor-pointer"
                      >
                        Commit Note in Registry
                      </button>
                    </form>
                  </div>

                  {/* Lecture Interactive Transcript and context */}
                  <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
                    <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-2">
                      📖 Sankalp Transcripts translation
                    </h4>
                    
                    <div className="text-xs text-slate-gray leading-relaxed font-sans max-h-40 overflow-y-auto custom-scrollbar p-1.5 bg-gray-50/40 rounded-lg space-y-3 text-slate-300">
                      <p>
                        <span className="text-[var(--color-occult-magenta)] font-mono font-bold mr-1">[00:05]</span>
                        Welcome back to Sanatan Gurukul. Today we explore the absolute physics of wave alignment in chanting traditional Vedic vowels.
                      </p>
                      <p>
                        <span className="text-[var(--color-occult-magenta)] font-mono font-bold mr-1">[01:25]</span>
                        The vibration of the vocal cord aligns directly with sandhi rules, helping us form deep acoustic patterns that calm modern stress systems.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 p-12 rounded-lg text-center">
                <p className="text-xs text-slate-gray">Pick active module playlists to start viewing sessions.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {studentTab === 'ai-mentor' && (
        <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative overflow-hidden">
          <ThreeCelestialCanvas color="#ea580c" particleCount={50} className="absolute inset-0 opacity-10 pointer-events-none" />
          
          {/* Left panel: Quick prompt ideas - 1/3 width */}
          <div className="space-y-4 lg:border-r lg:border-gray-200 lg:pr-5">
            <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-2 flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-slate-gray" />
              <span>Sankalp Custom Prompt Topics</span>
            </h4>
            
            <p className="text-[11px] text-slate-gray font-sans leading-relaxed">
              Ask topics relative to Astrological elements, Bhagavad Gita Chapters, or system software setups:
            </p>

            <div className="space-y-2">
              {[
                { label: "🧘 Explain Chapter 2 Verse 47 of Gita", query: "Can you explain the meaning and practical life application of Bhagavad Gita Chapter 2, Verse 47 about selfless work?" },
                { label: "🪐 What is Karma-Kanda lineage?", query: "What are the core stages and lineage history of traditional Karma-Kanda practices?" },
                { label: "🕉️ Explain Ashtakoot matchmaking rules", query: "Explain how the Ashta-Koota algorithm matches charts in traditional Vedic forecasting." },
              ].map((item, id) => (
                <button
                  key={id}
                  onClick={() => setAiPrompt(item.query)}
                  className="w-full text-left p-2.5 bg-white/80 hover:bg-gray-50 text-orange-600 hover:text-orange-700 text-[11px] font-sans rounded-lg border border-gray-200 transition-all cursor-pointer leading-snug"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="bg-bone/15 p-4 rounded-lg border border-gray-200">
              <span className="text-[9px] font-black tracking-widest text-slate-gray uppercase font-mono block">Lineage grounding enabled</span>
              <p className="text-[10px] text-slate-gray leading-relaxed font-sans mt-1">
                Sankalp AI Guru maps queries with your current user progress and written notes to answer personally!
              </p>
            </div>
          </div>

          {/* Right Panel: Active Chat Thread - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col justify-between h-[550px] bg-white/80 border border-gray-200 rounded-lg overflow-hidden p-4 relative z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-ink-black animate-pulse" />
                <div>
                  <h5 className="font-sans text-xs font-bold text-ink-black">Sankalp AI Guru Dialogue</h5>
                  <p className="text-[9px] text-[#22c55e] font-mono leading-none">ACTIVE LINEAGE TRANS-SPECTRUM</p>
                </div>
              </div>
              <button 
                onClick={() => setAiResponses([{ sender: 'guru', text: 'Hari Om, shishya! I am Sankalp, your personal Vedic AI Mentor. How can I guide your spiritual and intellectual sadhana today?', timestamp: 'Just now' }])}
                className="text-[9px] text-gray-550 hover:text-slate-gray cursor-pointer flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-2 custom-scrollbar">
              {aiResponses.map((msg, id) => (
                <div 
                  key={id} 
                  className={`flex ${msg.sender === 'seeker' ? 'justify-end animate-in slide-in-from-right-3' : 'justify-start animate-in slide-in-from-left-3'}`}
                >
                  <div className={`max-w-xl p-3.5 rounded-lg text-xs leading-relaxed font-sans ${
                    msg.sender === 'seeker' 
                      ? 'bg-orange-600/15 border border-gray-200 text-ink-black' 
                      : 'bg-gray-50 border border-gray-200 text-gray-800'
                  }`}>
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1.5 border-b border-gray-900/50 pb-1">
                      <span className="font-bold uppercase tracking-wider">{msg.sender === 'seeker' ? 'YOU (Sadhak)' : '🕉️ SANKALP GURU'}</span>
                      <span className="text-slate-gray">{msg.timestamp}</span>
                    </div>
                    
                    {/* Markdown rendering simulation to support formatted lists & JetBrains Mono highlights */}
                    <div className="space-y-2 whitespace-pre-line text-[11px] sm:text-xs">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg text-xs text-slate-gray font-mono">
                    🌌 Invoking celestial neural parameters ... Wait a brief turn.
                  </div>
                </div>
              )}
            </div>

            {/* Form inputs */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleQueryGuru(aiPrompt); }}
              className="flex gap-2 pt-3 border-t border-gray-200"
            >
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask coordinates rules, astrological elements, sandhi commentaries ..."
                className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs sm:text-sm text-ink-black focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-offset-0 placeholder-gray-650"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="px-5 py-3 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] hover:from-orange-500 hover:to-amber-400 text-gray-900 rounded-lg text-xs font-sans font-bold tracking-wider uppercase transition cursor-pointer flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>
      )}

      {studentTab === 'referrals' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 relative overflow-hidden space-y-6 shadow-none">
          <ThreeCelestialCanvas color="#f59e0b" particleCount={60} className="absolute inset-0 opacity-15 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-200 pb-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-[var(--color-occult-purple)]/10 border border-gray-200 rounded-full text-[9px] font-bold text-slate-gray uppercase tracking-widest font-mono">
                Lineage Propagation System
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-sans tracking-normal">
                Vedic Invitation & Siddhi Credits
              </h3>
              <p className="text-xs sm:text-sm text-gray-450 leading-relaxed font-sans max-w-xl text-ink-black">
                Share timeless wisdom with fellow scholars and spiritual searchers. Instantly claim cash rewards or celestial Siddhi energy credits to unlock high certification tests or personal chart matching.
              </p>
            </div>

            <div className="bg-white/80 border border-gray-200 p-5 rounded-lg text-center w-full md:w-56 shrink-0 shadow-none font-mono">
              <span className="text-[9px] text-[#f97316] uppercase tracking-widest block font-bold">YOUR UNIQUE REF ID</span>
              <p className="text-base font-extrabold text-gray-900 font-mono uppercase tracking-widest mt-1.5 select-all hover:text-slate-gray p-1.5 bg-gray-50 rounded-lg">GURUKUL-{currentUser.id.substring(5).toUpperCase()}</p>
              <span className="text-[9.5px] text-slate-gray block mt-1.5">Click to copy invitation code</span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white/50 p-4 rounded-lg border border-gray-200">
              <span className="text-[10px] text-slate-gray font-mono tracking-widest uppercase">INVITED DEFEATS</span>
              <p className="text-ink-blackxl font-black text-gray-900 mt-1 font-sans">4 Seekers</p>
              <p className="text-[11px] text-[#ca8a04] mt-1 font-sans">Successful registrations completed</p>
            </div>

            <div className="bg-white/50 p-4 rounded-lg border border-gray-200">
              <span className="text-[10px] text-slate-gray font-mono tracking-widest uppercase">CUMULATIVE EARNINGS</span>
              <p className="text-ink-blackxl font-black text-gray-900 mt-1 font-mono">₹4,800</p>
              <p className="text-[11px] text-ink-black mt-1 font-sans">Authorized cash payouts pending</p>
            </div>

            <div className="bg-white/50 p-4 rounded-lg border border-gray-200">
              <span className="text-[10px] text-slate-gray font-mono tracking-widest uppercase">SIDDHI ENERGY CREDITS</span>
              <p className="text-ink-blackxl font-black text-honey-gold mt-1 font-sans">300 Credits</p>
              <p className="text-[11px] text-[var(--color-occult-magenta)] mt-1 font-sans">Redeemable towards elite certifications</p>
            </div>

          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={() => {
                onAddNotification({
                  title: '📢 Lineage Referral Dispatched',
                  text: 'Gurukul invitation code successfully copied to your system clipboard!'
                });
                dispatchEvent('INVITATION_LINK_COPIED', { refCode: `GURUKUL-${currentUser.id.substring(5).toUpperCase()}` });
              }}
              className="px-6 py-3 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] hover:from-orange-500 hover:to-amber-400 text-gray-900 font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-none shadow-orange-950/40 text-center cursor-pointer flex-1"
            >
              Copy Sacred invitation link
            </button>
            <button 
              onClick={() => {
                onAddNotification({ title: '🔮 Credits Redirection', text: 'Celestial credits redeemed toward next syllabus module successfully!' });
                dispatchEvent('CREDITS_REDEEMED', { amt: 150 });
              }}
              className="px-6 py-3 bg-gray-50 border border-gray-200 hover:border-gray-200 text-slate-gray font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer hover:bg-bone/15 flex-1"
            >
              Redeem Credits towards Certifications
            </button>
          </div>

        </div>
      )}

      {/* VEDIC GATES TAB: QUIZ, MOCK TESTS, ASSIGNMENTS & CODING LABS */}
      {studentTab === 'gates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Quiz Engine */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold">
                  🕉️ Quiz Engine & Mock Exams
                </h4>
                {quizActive && !quizSubmitted && (
                  <span className="text-xs text-honey-gold font-mono bg-amber-950/20 px-2.5 py-1 rounded border border-amber-900/30 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Time Left: {quizTimer}s</span>
                  </span>
                )}
              </div>

              {!quizActive ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-xs text-slate-gray font-sans">Assess your knowledge in traditional Sanskrit Sandhi Rules and Matchmaking parameters.</p>
                  <div className="bg-gray-50/40 border border-gray-200 rounded-lg p-3.5 text-[10px] text-[var(--color-occult-purple)] text-left font-sans leading-relaxed">
                    <strong>Rule Registry:</strong> Correct answers yield +1 point. Incorrect answers apply a negative marking penalty of -0.25 points.
                  </div>
                  <button 
                    onClick={() => {
                      setQuizActive(true);
                      setQuizTimer(120);
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 rounded-lg text-xs font-sans font-bold uppercase tracking-wider cursor-pointer hover:from-orange-500 hover:to-amber-400"
                  >
                    Start Vedic Assessment
                  </button>
                </div>
              ) : quizSubmitted ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-bold text-ink-black font-sans">Assessment Finished!</h5>
                    <p className="text-[10px] text-slate-gray font-mono mt-1">Registry ledger updated successfully</p>
                    <div className="text-xl font-bold font-sans text-gray-900 mt-3">
                      Score: {
                        Object.entries(quizAnswers).reduce((score, [qId, ans]) => {
                          const correctAnswers: {[key: number]: number} = { 0: 2, 1: 0, 2: 1 };
                          return score + (correctAnswers[Number(qId)] === ans ? 1 : -0.25);
                        }, 0).toFixed(2)
                      } / 3.00
                    </div>
                  </div>
                  
                  {/* solutions exegesis */}
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 text-xs">
                    {[
                      { q: "What Sandhi rule is triggered when 'अ' meets 'इ'?", choices: ["Yas", "Dirgha", "Guna", "Vriddhi"], correct: 2, desc: "Guna Sandhi converts A + I to E (e.g. Deva + Indra = Devendra)." },
                      { q: "Which house governs Karma and Career in standard Kundli?", choices: ["10th House", "9th House", "1st House", "5th House"], correct: 0, desc: "The Karma Sthana is the 10th house from the Lagna." },
                      { q: "Rigveda is categorized into how many Mandalas?", choices: ["8 Mandalas", "10 Mandalas", "12 Mandalas", "108 Mandalas"], correct: 1, desc: "Rigveda has exactly 10 books or Mandalas containing Vedic hymns." }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-sans font-semibold text-ink-black">{idx+1}. {item.q}</p>
                        <p className="text-[10px] text-[#22c55e] mt-1 font-mono">Answer: {item.choices[item.correct]}</p>
                        <p className="text-[10px] text-gray-450 mt-1 font-sans">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setQuizActive(false)}
                    className="w-full py-2 bg-gray-50 border border-gray-200 text-slate-gray rounded-lg text-xs font-sans uppercase tracking-wider cursor-pointer hover:bg-bone/15"
                  >
                    Reset & Go Back
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current question */}
                  {(() => {
                    const questions = [
                      { q: "What Sandhi rule is triggered when 'अ' meets 'इ'?", choices: ["Yas Sandhi", "Dirgha Sandhi", "Guna Sandhi", "Vriddhi Sandhi"] },
                      { q: "Which house governs Karma and Career in standard Kundli?", choices: ["10th House (Karma Sthana)", "9th House (Dharma Sthana)", "1st House (Lagna Sthana)", "5th House (Putra Sthana)"] },
                      { q: "Rigveda is categorized into how many Mandalas?", choices: ["8 Mandalas", "10 Mandalas", "12 Mandalas", "108 Mandalas"] }
                    ];
                    const q = questions[quizCurrentQuestion];
                    return (
                      <div className="space-y-3">
                        <span className="text-[9px] text-slate-gray font-mono tracking-widest font-bold">QUESTION {quizCurrentQuestion+1} OF 3</span>
                        <h5 className="font-sans text-sm font-bold text-ink-black leading-snug">{q.q}</h5>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {q.choices.map((choice, cIdx) => {
                            const isSelected = quizAnswers[quizCurrentQuestion] === cIdx;
                            return (
                              <button
                                key={cIdx}
                                onClick={() => {
                                  setQuizAnswers(prev => ({ ...prev, [quizCurrentQuestion]: cIdx }));
                                }}
                                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between font-sans ${
                                  isSelected 
                                    ? 'bg-orange-600/10 border border-gray-200 text-[var(--color-occult-purple)] font-bold' 
                                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-ink-black'
                                }`}
                              >
                                <span>{choice}</span>
                                {isSelected && <CheckCircle className="w-3.5 h-3.5 text-slate-gray" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const nextQ = quizCurrentQuestion + 1;
                        if (nextQ < 3) {
                          setQuizCurrentQuestion(nextQ);
                        } else {
                          setQuizSubmitted(true);
                          dispatchEvent('QUIZ_SUBMITTED', { scorePercent: 100 });
                          onAddNotification({ title: '📝 Test Registry Sync', text: 'Vedic Quiz marks recorded on the analytics ledger!' });
                        }
                      }}
                      className="px-5 py-2 bg-orange-600 text-gray-900 text-xs font-sans font-bold tracking-widest uppercase rounded-lg cursor-pointer hover:bg-orange-500 ml-auto"
                    >
                      {quizCurrentQuestion === 2 ? 'Submit Assessment' : 'Save & Next'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Assignments Portal */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-3">
                📝 Assignments & Teacher Evaluations
              </h4>
              
              <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg space-y-2 text-xs font-sans">
                <div className="flex justify-between font-semibold">
                  <span className="text-ink-black">Assignment #3: Ashtakoot Matching Coding Logic</span>
                  <span className="text-honey-gold font-mono text-[10px]">Deadline: 4 Hours Left</span>
                </div>
                <p className="text-[10px] text-slate-gray leading-relaxed">
                  Upload a text file implementing the 36-guna matching algorithm coordinates parameters.
                </p>
                <div className="text-[10px] text-[#ca8a04] bg-bone/15 p-2 rounded border border-gray-200 mt-1">
                  <strong>Rubrics:</strong> Astrological logic coordinates: 50%. Accuracy: 30%. Clean coding layout: 20%.
                </div>
              </div>

              {!assignmentSubmitted ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 bg-white/50">
                    <div className="text-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-gray mx-auto" />
                      <input 
                        type="text" 
                        placeholder="e.g. ashtakoot_grader.js"
                        value={assignmentFile}
                        onChange={(e) => setAssignmentFile(e.target.value)}
                        className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-xs text-ink-black text-center w-56 focus:outline-none"
                      />
                      <p className="text-[9px] text-slate-gray font-mono block">Input file name to simulate secure upload</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!assignmentFile.trim()) return;
                      setAssignmentSubmitted(true);
                      dispatchEvent('ASSIGNMENT_SUBMITTED', { fileName: assignmentFile });
                      onAddNotification({ title: '📝 Assignment Uploaded', text: `Your code ${assignmentFile} has been successfully locked for teacher evaluation.` });
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 rounded-lg text-xs font-sans font-bold tracking-widest uppercase cursor-pointer"
                  >
                    Submit Assignment Draft
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg text-center space-y-3">
                  <CheckCircle className="w-8 h-8 text-ink-black mx-auto" />
                  <h5 className="text-xs font-bold text-ink-black font-sans">Assignment Locked & Verified!</h5>
                  <p className="text-[10px] text-slate-gray font-mono">File: {assignmentFile}</p>
                  <p className="text-[10px] text-slate-gray font-sans">Status: Pending Teacher Evaluation & Marks Registry.</p>
                  
                  <button
                    onClick={() => {
                      setAssignmentSubmitted(false);
                      setAssignmentFile('');
                    }}
                    className="px-4 py-1.5 bg-gray-50 hover:bg-bone/15 text-slate-gray text-[10px] font-sans uppercase tracking-widest rounded-lg border border-gray-200 cursor-pointer"
                  >
                    Replace Submission
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coding Labs Sandbox */}
          <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-slate-gray" />
                <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold">
                  💻 Coding Labs Sandbox (Sanskrit Compiler & Algorithm Evaluator)
                </h4>
              </div>
              <span className="text-[9px] font-mono text-slate-gray">Node Sandbox Virtualized</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[9px] text-slate-gray font-mono block">JavaScript Code Input Desk:</span>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full h-44 bg-white border border-gray-200 p-3 rounded-lg text-xs font-mono text-amber-100 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-offset-0 leading-normal"
                ></textarea>
                <button
                  onClick={() => {
                    try {
                      const logs: string[] = [];
                      const fakeConsole = {
                        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '))
                      };
                      const runner = new Function('console', codeSnippet);
                      runner(fakeConsole);
                      setCodeOutput(logs.join('\n') || "Script executed successfully with no console prints.");
                      dispatchEvent('CODE_LAB_EXECUTED', { charLength: codeSnippet.length });
                    } catch (err: any) {
                      setCodeOutput(`COMPILATION ERROR: ${err.message}`);
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 rounded-lg text-xs font-sans font-bold tracking-widest uppercase cursor-pointer"
                >
                  Run Sandbox Script Compiler
                </button>
              </div>

              <div className="flex flex-col justify-between space-y-2">
                <span className="text-[9px] text-slate-gray font-mono block">Output Logs Console:</span>
                <div className="flex-1 bg-paper-whitelack p-3.5 rounded-lg border border-gray-200 font-mono text-[10px] text-ink-black overflow-y-auto h-44 leading-relaxed whitespace-pre">
                  {codeOutput || "awaiting execution logs ..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE CLASSES TAB */}
      {studentTab === 'live-classes' && (
        <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-red-500/10 border border-gray-200 rounded-full text-[9px] font-bold text-burgundy uppercase tracking-widest font-mono flex items-center w-fit space-x-1 animate-pulse">
                <Radio className="w-3 h-3" />
                <span>Live Broadcast</span>
              </span>
              <h3 className="text-lg font-bold font-sans text-gray-900 mt-1">Upanishad Bhashya & Vedas Mantras Chanting</h3>
              <p className="text-xs text-slate-gray font-sans">Lineage broadcast channels monitored by Guru Devs</p>
            </div>
            
            <button
              onClick={() => {
                setJoinedLiveClass(!joinedLiveClass);
                dispatchEvent(joinedLiveClass ? 'LEAVE_LIVE_CLASS' : 'JOIN_LIVE_CLASS', { classId: 'live-satsang-rigveda' });
                onAddNotification({
                  title: joinedLiveClass ? '🚪 Left Satsang Channel' : '🪐 Connected to Satsang Broadcast',
                  text: joinedLiveClass ? 'Disconnection verified.' : 'Audio levels and latency checks initialized.'
                });
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition cursor-pointer ${
                joinedLiveClass 
                  ? 'bg-red-700/20 text-red-300 border border-gray-200 hover:bg-red-700 hover:text-gray-900'
                  : 'bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 hover:from-orange-500 hover:to-amber-400 shadow-none'
              }`}
            >
              {joinedLiveClass ? 'Disconnect Satsang Stream' : 'Join Live Satsang'}
            </button>
          </div>

          {joinedLiveClass ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Virtual Broadcast Video feeds */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-paper-whitelack aspect-video rounded-lg border border-gray-200 overflow-hidden relative flex flex-col items-center justify-center p-6">
                  <ThreeCelestialCanvas color="#f59e0b" particleCount={40} className="absolute inset-0 opacity-15 pointer-events-none" />
                  
                  {satsangReaction && (
                    <span className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-bounce drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                      {satsangReaction}
                    </span>
                  )}

                  <div className="z-10 text-center space-y-3">
                    <Radio className="w-12 h-12 text-ink-black mx-auto animate-ping" />
                    <h4 className="text-sm font-bold text-ink-black font-sans">Guru is demonstrating Rigveda Mandala 1 chanting...</h4>
                    <p className="text-[10px] text-slate-gray font-mono">Stream Quality: Adaptive 1080p | Latency: 42ms</p>
                  </div>

                  {/* Watermark overlay */}
                  <div className="absolute top-4 right-4 text-[9px] text-gray-900/10 font-mono tracking-widest uppercase select-none pointer-events-none font-bold">
                    {currentUser.name} - SECURED CHANNEL
                  </div>

                  {/* Left bottom: hand status */}
                  {handRaised && (
                    <div className="absolute bottom-4 left-4 bg-orange-950 border border-gray-300 px-3 py-1 rounded-lg text-[9px] text-[var(--color-occult-purple)] font-sans animate-pulse">
                      ✋ Hand raised to ask query
                    </div>
                  )}

                  {/* Controls bar */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-paper-whitelack/80 p-1.5 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => {
                        setHandRaised(!handRaised);
                        dispatchEvent('RAISE_HAND_TOGGLE', { state: !handRaised });
                      }}
                      className={`p-1.5 rounded text-[10px] font-sans cursor-pointer ${
                        handRaised ? 'bg-orange-600 text-gray-900' : 'text-slate-gray hover:text-gray-900'
                      }`}
                    >
                      ✋ Ask Doubt
                    </button>
                  </div>
                </div>

                {/* Handouts and Reactions */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/60 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-gray mr-2">SEND REACTIONS:</span>
                    {['🕉️', '🙏', '🔥', '👏', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setSatsangReaction(emoji);
                          dispatchEvent('LIVE_REACTION_SENT', { emoji });
                          setTimeout(() => setSatsangReaction(null), 1500);
                        }}
                        className="text-lg hover:scale-125 transition-transform duration-200 cursor-pointer animate-none bg-transparent border-0"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-slate-gray" />
                    <span className="text-[11px] font-sans text-[var(--color-occult-purple)]">Rigveda_Mandala1_Chanting.pdf (Handout)</span>
                    <button 
                      onClick={() => {
                        dispatchEvent('HANDOUT_DOWNLOADED', { file: 'Rigveda_Mandala1_Chanting.pdf' });
                        onAddNotification({ title: '📄 Handout Saved', text: 'Rigveda study PDF saved to local storage!' });
                      }}
                      className="px-2 py-1 bg-gray-50 border border-gray-200 text-ink-black text-[10px] font-sans rounded cursor-pointer hover:text-gray-900"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat thread column */}
              <div className="bg-white/80 border border-gray-200 rounded-lg p-4 flex flex-col justify-between h-[450px]">
                <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-gray font-extrabold uppercase">SATSANG SANGHA CHAT</span>
                  <span className="text-[8px] text-ink-black font-mono">18 seeker active</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 custom-scrollbar text-[11px]">
                  {liveChatMessages.map((msg, idx) => (
                    <div key={idx} className="bg-gray-50/60 p-2 rounded border border-gray-200/50">
                      <span className="text-slate-gray font-sans font-bold block">{msg.sender}</span>
                      <p className="text-ink-black mt-0.5 leading-relaxed font-sans">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newLiveMessage.trim()) return;
                    setLiveChatMessages(prev => [...prev, { sender: currentUser.name, text: newLiveMessage }]);
                    dispatchEvent('LIVE_CHAT_DISPATCH', { msg: newLiveMessage });
                    setNewLiveMessage('');
                  }}
                  className="flex gap-1.5 pt-2.5 border-t border-gray-200"
                >
                  <input
                    type="text"
                    value={newLiveMessage}
                    onChange={(e) => setNewLiveMessage(e.target.value)}
                    placeholder="Type message to the Sangha..."
                    className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs text-ink-black focus:outline-none placeholder-gray-650"
                  />
                  <button type="submit" className="px-3 bg-orange-600 hover:bg-orange-500 text-gray-900 rounded-lg text-xs font-sans font-bold uppercase cursor-pointer border-0">
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/60 border border-gray-200 p-12 rounded-lg text-center space-y-3">
              <Radio className="w-10 h-10 text-gray-650 mx-auto" />
              <h4 className="text-sm font-bold text-ink-black font-sans">Satsang stream offline/unconnected</h4>
              <p className="text-xs text-slate-gray font-sans">Click 'Join Live Satsang' above to initialize connection with live broadcasting networks.</p>
            </div>
          )}
        </div>
      )}

      {/* SUPPORT & TICKETS TAB */}
      {studentTab === 'support' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Ticket Panel */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-3">
                🎫 Launch Support & Complaints Registry
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-gray font-mono block">SUBJECT OR INQUIRY DESCRIPTION:</label>
                  <input 
                    type="text"
                    placeholder="e.g. Astro-chart generator computation error"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs text-ink-black focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-gray font-mono block">COMPLAINT / SUGGESTIONS DETAILS:</label>
                  <textarea
                    rows={4}
                    placeholder="Explain parameters coordinates or transaction IDs if applicable..."
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs text-ink-black focus:outline-none font-sans"
                  ></textarea>
                </div>

                <button
                  onClick={() => {
                    if (!newTicketSubject.trim()) return;
                    const newTck = {
                      id: `TCK-${Math.floor(1000 + Math.random()*9000)}`,
                      subject: newTicketSubject,
                      status: 'Pending',
                      date: 'Today'
                    };
                    setSupportTickets(prev => [newTck, ...prev]);
                    dispatchEvent('TICKET_CREATED', { ticketId: newTck.id, subject: newTicketSubject });
                    setNewTicketSubject('');
                    onAddNotification({
                      title: '🎫 Support Ticket Registered',
                      text: `Ticket ${newTck.id} created. Gurukul Admins will resolve it soon.`
                    });
                  }}
                  className="w-full py-2 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 rounded-lg text-xs font-sans font-bold tracking-widest uppercase cursor-pointer border-0"
                >
                  Register Help Ticket
                </button>
              </div>
            </div>

            {/* Existing Tickets Logs */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-3">
                📂 Active Tickets & Logs
              </h4>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {supportTickets.map((tck) => (
                  <div key={tck.id} className="bg-white border border-gray-200 p-3.5 rounded-lg flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] text-[var(--color-occult-purple-light)] font-mono block">{tck.id} | Registered on {tck.date}</span>
                      <h5 className="font-sans text-xs font-bold text-ink-black mt-1 line-clamp-1">{tck.subject}</h5>
                    </div>
                    <span className="bg-amber-950/60 border border-amber-900/30 text-[var(--color-occult-magenta)] text-[8px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded">
                      {tck.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs and Knowledge base */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-3">
            <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-2">
              📖 Knowledge Base FAQ & Shastras Desk
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {[
                { q: "How to redeem Siddhi Credits?", a: "Siddhi credits can be redeemed in the Refer & Earn ledger to unlock intermediate horoscopes modules directly." },
                { q: "Where can I view invoices?", a: "Go to 'Settings & Security' tab. Under 'Payment Logs & Invoices' section, click to download receipts." },
                { q: "Is the WebRTC Satsang encrypted?", a: "Yes. All live satsangs use encrypted secure lineage channels to protect direct gurudev communications." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white/65 p-3 rounded-lg border border-gray-200">
                  <span className="font-sans font-bold text-[var(--color-occult-purple)] block">{faq.q}</span>
                  <p className="text-[11px] text-slate-gray leading-relaxed font-sans mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS & SECURITY TAB */}
      {studentTab === 'settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Profile update */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4 lg:col-span-2">
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-3">
                👤 Seeker Registry Credentials Profile
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-gray font-mono block">SEEKER NAME:</label>
                  <input type="text" defaultValue={currentUser.name} className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-ink-black focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-gray font-mono block">SECURED EMAIL REGISTRY:</label>
                  <input type="text" defaultValue={currentUser.email} disabled className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-slate-gray cursor-not-allowed focus:outline-none font-mono" />
                </div>
              </div>

              <button 
                onClick={() => {
                  onAddNotification({ title: '👤 Profile registry sync', text: 'Your seeker profile changes were recorded in database ledger!' });
                  dispatchEvent('PROFILE_UPDATED', { name: currentUser.name });
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-occult-purple)] to-[var(--color-occult-purple-light)] text-gray-900 rounded-lg text-xs font-sans font-bold tracking-widest uppercase cursor-pointer hover:from-orange-500 border-0"
              >
                Sync Registry Data
              </button>
            </div>

            {/* Subscriptions & Invoices */}
            <div className="bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-5 space-y-4">
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold border-b border-gray-200 pb-3">
                💳 Payment Logs & Subscriptions
              </h4>

              <div className="space-y-2 text-xs">
                <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-ink-black block">Vedic Astrology Full Track</span>
                    <span className="text-[9px] text-[#f97316] font-mono">₹1,999 (Tuition Paid)</span>
                  </div>
                  <button 
                    onClick={() => {
                      dispatchEvent('INVOICE_DOWNLOADED', { billingId: 'INV-401' });
                      onAddNotification({ title: '📄 Invoice Downloaded', text: 'Invoice INV-401.pdf has been saved.' });
                    }}
                    className="p-1.5 bg-gray-50 border border-gray-200 hover:border-gray-200 text-slate-gray rounded cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-ink-black block">Sanskrit Chanting Sandhi Lessons</span>
                    <span className="text-[9px] text-slate-gray font-mono">Gratis (Lineage complimentary)</span>
                  </div>
                  <span className="text-[9px] font-mono text-ink-black uppercase">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Devices & Sessions Registry */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
              <ShieldCheck className="w-4 h-4 text-ink-black" />
              <h4 className="text-xs uppercase text-slate-gray font-mono tracking-wider font-extrabold">
                🛡️ Device Sessions Map & Audits Registry (Anti-Credential Sharing)
              </h4>
            </div>
            
            <p className="text-xs text-slate-gray font-sans leading-relaxed">
              We monitor active sockets and browser sessions maps coordinates to prevent account credentials lease/share agreements:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {[
                { dev: "Current Windows Desktop (Local)", ip: "192.168.1.42 (Active now)", loc: "Varanasi, IN", active: true },
                { dev: "Mobile Android Client App", ip: "103.220.44.18", loc: "New Delhi, IN", active: false },
                { dev: "Tablet Chrome browser", ip: "103.220.45.105", loc: "Varanasi, IN", active: false }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-lg border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="text-ink-black font-bold block">{item.dev}</span>
                    <span className="text-[10px] text-slate-gray block mt-1">IP: {item.ip}</span>
                    <span className="text-[10px] text-slate-gray block">Location: {item.loc}</span>
                  </div>
                  <span className={`text-[9px] font-bold mt-3 px-2 py-0.5 rounded w-fit ${
                    item.active ? 'bg-emerald-950/60 text-ink-black border border-emerald-900/30' : 'bg-gray-50 text-slate-gray'
                  }`}>
                    {item.active ? 'THIS DEVICE' : 'DISCONNECTED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
