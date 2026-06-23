import React, { useState, useEffect } from 'react';
import { 
  Award, Play, Flame, Trophy, Route, Compass, BookOpen, 
  MessageSquare, Sparkles, Send, Gift, Users, ClipboardList, 
  ChevronRight, BrainCircuit, Tv, RefreshCw, Star, Info
} from 'lucide-react';
import { Course, Enrollment, UserProfile, CourseNote, DiscussionThread } from '../types';
import ThreeCelestialCanvas from './ThreeCelestialCanvas';

interface StudentPortalProps {
  currentUser: UserProfile;
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
}

export default function StudentPortal({
  currentUser,
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
}: StudentPortalProps) {
  // Navigation tabs within Student Portal
  const [studentTab, setStudentTab] = useState<'snapshot' | 'path' | 'learning' | 'ai-mentor' | 'referrals'>('snapshot');
  
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
    <div className="space-y-6 text-white pb-12 animate-in fade-in duration-300">
      
      {/* Visual Header matching dark-satsang slate design */}
      <div className="relative border-b border-orange-500/25 pb-6">
        <ThreeCelestialCanvas color="#ea580c" particleCount={40} className="absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-[9px] font-bold text-orange-400 uppercase tracking-widest font-mono">
              Shishya Sadhana Devotion
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold font-serif tracking-tight mt-1 bg-gradient-to-r from-amber-200 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Seeker’s Portal & Sacred Path
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-serif mt-1 max-w-2xl">
              An immersive space combining traditional gurukul discipline with advanced personal AI tutoring, streak trackers, and dynamic certificate paths.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-[#1c0d0a] border border-orange-500/25 px-4 py-2.5 rounded-xl flex items-center space-x-3 shadow-lg shadow-orange-950/25">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <div>
                <p className="text-[10px] text-orange-400 font-mono tracking-widest uppercase font-bold">Guru Sadhana Streak</p>
                <p className="text-base font-extrabold font-serif text-white">12 Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1.5 mt-6 border-t border-gray-800/60 pt-4">
          {[
            { id: 'snapshot', label: 'Learning Snapshot', icon: Compass },
            { id: 'path', label: 'My Spiritual Path', icon: Route },
            { id: 'learning', label: 'My Sacred Learning', icon: BookOpen },
            { id: 'ai-mentor', label: 'Sankalp AI Guru', icon: BrainCircuit },
            { id: 'referrals', label: 'Refer & Earn', icon: Gift }
          ].map((t) => {
            const IconComp = t.icon;
            const active = studentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setStudentTab(t.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-serif tracking-wide transition-all cursor-pointer ${
                  active 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold shadow-lg shadow-orange-950/40' 
                    : 'bg-gray-900 border border-gray-800/80 text-gray-400 hover:text-white hover:border-orange-500/10'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-orange-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER DYNAMIC SUB-TABS */}
      {studentTab === 'snapshot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Immersive Welcome Banner */}
            <div className="bg-[#120703] border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
              <ThreeCelestialCanvas color="#f59e0b" particleCount={50} className="absolute inset-0 opacity-15 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white shadow-xl shadow-orange-950/40">
                  <Flame className="w-10 h-10 text-white animate-bounce" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-xl font-bold font-serif text-white">Hari Om, Seeker {currentUser.name}!</h3>
                  <p className="text-xs text-orange-400 font-serif leading-relaxed">
                    "तमसो मा ज्योतिर्गमय — Lead me from darkness to spiritual light." You have gathered <span className="font-bold text-amber-300 font-mono">{pathXP} Siddhi XP</span> on your Vedic learning lineage path.
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">Last activity checked at: Present Brahma Muhurta</p>
                </div>
              </div>
            </div>

            {/* Resume Current Course Player Quick Trigger */}
            {selectedCourse ? (
              <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-orange-400 font-mono font-bold">CONTINUE PURSUING</span>
                    <h4 className="text-base font-bold font-serif text-gray-100 mt-0.5">{selectedCourse.title}</h4>
                  </div>
                  <button 
                    onClick={() => setStudentTab('learning')}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-serif uppercase tracking-widest font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Launch Sacred Player
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800/40">
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-500">
                      <Play className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-serif">Current Lecture Module</p>
                      <p className="font-semibold text-gray-200 text-xs mt-0.5 font-mono">{activeModule?.title || 'Lecture'}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-gray-500 font-mono">Module Duration</p>
                    <p className="font-bold text-orange-400 text-xs font-mono">{activeModule ? Math.floor(activeModule.durationSeconds / 60) : 0} minutes</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-10 text-center space-y-4">
                <Compass className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="text-gray-300 font-serif text-base">You are not enrolled in any study tracks yet.</h4>
                <button 
                  onClick={() => onNavigate('explore')}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-serif uppercase tracking-widest font-bold rounded-xl cursor-pointer"
                >
                  Explore Sacred Courses
                </button>
              </div>
            )}

            {/* Beautiful Netflix-style Course Library Rows */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase text-orange-400 font-mono tracking-widest font-bold border-b border-gray-800/60 pb-1.5">
                Path Recommended Study Tracks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.slice(0, 2).map(c => (
                  <div key={c.id} className="bg-[#11131c] border border-gray-800 hover:border-orange-500/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group h-full">
                    <div className="relative h-28 overflow-hidden">
                      <img src={c.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-transparent"></div>
                      <span className="absolute top-2.5 right-2.5 bg-orange-950/80 border border-orange-500/30 text-orange-400 text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md font-semibold select-none">
                        {c.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h5 className="font-bold text-gray-200 text-xs sm:text-sm font-serif line-clamp-1">{c.title}</h5>
                        <p className="text-[11px] text-gray-400 font-serif leading-relaxed line-clamp-2 mt-1">{c.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-850/60">
                        <span className="text-[11px] text-amber-400 font-semibold font-mono">₹{c.price} Tuition</span>
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
                          className="px-3.5 py-1.5 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white text-[9px] font-serif uppercase tracking-wider font-bold rounded-lg border border-orange-500/20 transition-all cursor-pointer"
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
            <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-orange-400 font-mono font-bold">Path Rank</span>
                <span className="text-[9px] uppercase tracking-wider text-amber-500 font-mono font-extrabold">{pathXP} XP</span>
              </div>
              <div>
                <h4 className="text-sm font-black font-serif text-white hover:text-orange-400">{currentTitle}</h4>
                <p className="text-[11px] leading-relaxed text-gray-400 font-serif mt-1">{titleDescription}</p>
              </div>

              {/* Progress Slider bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>To Next Milestones:</span>
                  <span>{percentToNext}% ({nextTitle})</span>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-850">
                  <div 
                    className="bg-gradient-to-r from-orange-600 to-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentToNext}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-850/60 font-sans text-xs space-y-2">
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Completed Modules:</span>
                  <span className="font-semibold text-white font-mono">{totalCompletedModules}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Written Notes:</span>
                  <span className="font-semibold text-white font-mono">{totalNotesWritten}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Cryptographic Certs:</span>
                  <span className="font-semibold text-white font-mono">{currentUser.certificates.length}</span>
                </div>
              </div>
            </div>

            {/* Central Unified events channel simulator visualizer */}
            <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping"></span>
                  <h4 className="text-[10px] uppercase text-orange-400 font-mono tracking-wider font-extrabold">Unified Event Gateway Log</h4>
                </div>
                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">Live Central Server</span>
              </div>
              <p className="text-[10px] text-gray-400 font-serif leading-relaxed">
                Watch how taking actions dynamically pushes to central analytical models, informing teachers, updating admin counters, and correcting AI recommendations.
              </p>
              <div className="space-y-2 bg-gray-950/65 p-2.5 rounded-xl border border-orange-500/5 max-h-48 overflow-y-auto custom-scrollbar font-mono text-[9px]">
                {eventLogs.map((log) => (
                  <div key={log.id} className="border-b border-gray-850/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-[#ef4444]">
                      <span className="font-black text-amber-400">{log.name}</span>
                      <span className="text-gray-500 text-[8px]">{log.timestamp}</span>
                    </div>
                    <p className="text-gray-300 truncate font-sans text-[9px] leading-tight mt-0.5">{log.payload}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {studentTab === 'path' && (
        <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-6 space-y-8">
          <div className="border-b border-gray-850/60 pb-4 text-center max-w-xl mx-auto space-y-2">
            <Trophy className="w-10 h-10 text-orange-500 mx-auto animate-pulse" />
            <h3 className="text-xl font-bold font-serif text-white">Your Lineage Spiritual Path Progression</h3>
            <p className="text-xs text-gray-400 font-serif leading-relaxed">
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
                className={`p-5 rounded-2xl border transition-all ${
                  p.active 
                    ? 'bg-gradient-to-b from-[#1c0d0a]/60 to-[#11131c]/60 border-orange-500/40 shadow-lg shadow-orange-950/20' 
                    : 'bg-gray-950/40 border-gray-850 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-orange-400 font-black uppercase">STAGE 0{idx + 1}</span>
                  {p.active && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                </div>
                <h4 className="font-serif font-black text-xs sm:text-sm text-gray-100 mt-2">{p.title}</h4>
                <p className="font-mono text-[9px] text-[#22c55e] mt-1">{p.xp}</p>
                <p className="text-[11px] text-gray-450 leading-relaxed font-serif mt-3 text-gray-300">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-950/50 p-5 rounded-xl border border-gray-850/60 max-w-lg mx-auto text-center space-y-1 text-xs">
            <span className="font-serif text-orange-400 block font-bold">💎 Cryptographic Lineage Records Guarded Securely</span>
            <p className="text-gray-400 leading-relaxed font-serif">
              Our backends synchronize these milestones inside your registry account profile instantly. Earn and redeem siddhi credits for complete certifications.
            </p>
          </div>
        </div>
      )}

      {studentTab === 'learning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column Syllabus chapters list - 1/3 width */}
          <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 h-fit space-y-4">
            <h4 className="text-xs uppercase text-orange-400 font-mono tracking-widest font-extrabold border-b border-gray-850 pb-2.5">
              My Sacred Playlists
            </h4>

            {enrolledCourses.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center italic">Enlist in courses to display lists.</p>
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
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#1b0d09] border-orange-500/35 text-white' 
                          : 'bg-gray-950/60 border-transparent hover:border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <h5 className="font-bold text-xs truncate font-serif">{c.title}</h5>
                      <div className="flex items-center justify-between text-[9px] font-mono font-semibold text-gray-550 mt-1.5 text-gray-300">
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
              <div className="pt-4 border-t border-gray-800 text-left">
                <span className="text-[9px] uppercase tracking-wider text-orange-400 font-mono block font-extrabold mb-3">CONCURRENT SYLLABUS</span>
                <div className="space-y-3">
                  {selectedCourse.chapters.map((ch) => (
                    <div key={ch.id} className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-gray-400 font-serif leading-tight">{ch.title}</span>
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
                              className={`w-full text-left p-2.5 rounded-lg text-[11px] transition-all flex items-center justify-between font-serif ${
                                isPlayingThis 
                                  ? 'bg-orange-600/10 border border-orange-500/20 text-orange-300' 
                                  : 'bg-gray-900 hover:bg-gray-850 text-gray-300'
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
                <div className="bg-black/90 border border-orange-500/15 rounded-2xl overflow-hidden shadow-2xl relative">
                  <div className="aspect-video w-full flex flex-col items-center justify-center relative p-6">
                    
                    {/* Flow Particles */}
                    {isPlaying && <ThreeCelestialCanvas color="#ea580c" particleCount={30} className="absolute inset-0 opacity-10 pointer-events-none" />}
                    
                    <div className="z-10 text-center space-y-4 max-w-md">
                      <Tv className="w-12 h-12 text-orange-500 mx-auto animate-bounce" />
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#f97316] font-mono bg-orange-950/40 border border-orange-500/25 px-2.5 py-0.5 rounded-full">
                          {selectedCourse.category} Active Lecture
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-gray-100 font-serif leading-snug">{activeModule.title}</h4>
                      </div>
                      
                      <div className="pt-2 font-mono text-[9px] text-gray-400">
                        TIMECODE: {Math.floor(videoTime / 60)}:{(videoTime % 60).toString().padStart(2, '0')} / {Math.floor(activeModule.durationSeconds / 60)}:00
                      </div>

                      <div className="flex items-center justify-center space-x-3 pt-3">
                        <button
                          onClick={() => {
                            setIsPlaying(!isPlaying);
                            dispatchEvent(isPlaying ? 'VIDEO_PAUSED' : 'VIDEO_PLAYING', { moduleTitle: activeModule.title, timeSeconds: videoTime });
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition shadow shadow-orange-950/30 cursor-pointer"
                        >
                          {isPlaying ? 'PAUSE RECIPROCATION' : 'RESUME CHANTING'}
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-2 inset-x-4 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
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
                  <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-gray-850 pb-2">
                      ✏️ Study Reflections & Shastras Notes
                    </h4>
                    
                    <form onSubmit={handleWriteNotes} className="space-y-3">
                      <textarea
                        value={playerNoteText}
                        onChange={(e) => setPlayerNoteText(e.target.value)}
                        placeholder="Log insight resonance or technical parameters of this time frame..."
                        rows={3}
                        className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-offset-0 placeholder-gray-600 font-sans"
                      ></textarea>

                      <button
                        type="submit"
                        className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition cursor-pointer"
                      >
                        Commit Note in Registry
                      </button>
                    </form>
                  </div>

                  {/* Lecture Interactive Transcript and context */}
                  <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-gray-850 pb-2">
                      📖 Sankalp Transcripts translation
                    </h4>
                    
                    <div className="text-xs text-gray-400 leading-relaxed font-serif max-h-40 overflow-y-auto custom-scrollbar p-1.5 bg-gray-950/40 rounded-xl space-y-3 text-slate-300">
                      <p>
                        <span className="text-amber-400 font-mono font-bold mr-1">[00:05]</span>
                        Welcome back to Sanatan Gurukul. Today we explore the absolute physics of wave alignment in chanting traditional Vedic vowels.
                      </p>
                      <p>
                        <span className="text-amber-400 font-mono font-bold mr-1">[01:25]</span>
                        The vibration of the vocal cord aligns directly with sandhi rules, helping us form deep acoustic patterns that calm modern stress systems.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-[#11131c] border border-gray-800 p-12 rounded-2xl text-center">
                <p className="text-xs text-gray-500">Pick active module playlists to start viewing sessions.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {studentTab === 'ai-mentor' && (
        <div className="bg-[#11131c] border border-gray-800 rounded-2xl p-5 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative overflow-hidden">
          <ThreeCelestialCanvas color="#ea580c" particleCount={50} className="absolute inset-0 opacity-10 pointer-events-none" />
          
          {/* Left panel: Quick prompt ideas - 1/3 width */}
          <div className="space-y-4 lg:border-r lg:border-gray-850 lg:pr-5">
            <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-gray-850 pb-2 flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-orange-400" />
              <span>Sankalp Custom Prompt Topics</span>
            </h4>
            
            <p className="text-[11px] text-gray-400 font-serif leading-relaxed">
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
                  className="w-full text-left p-2.5 bg-gray-950/80 hover:bg-[#120703]/80 text-[#ca8a04] hover:text-[#f59e0b] text-[11px] font-serif rounded-lg border border-orange-500/10 transition-all cursor-pointer leading-snug"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="bg-orange-950/20 p-4 rounded-xl border border-orange-500/10">
              <span className="text-[9px] font-black tracking-widest text-orange-400 uppercase font-mono block">Lineage grounding enabled</span>
              <p className="text-[10px] text-gray-400 leading-relaxed font-serif mt-1">
                Sankalp AI Guru maps queries with your current user progress and written notes to answer personally!
              </p>
            </div>
          </div>

          {/* Right Panel: Active Chat Thread - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col justify-between h-[550px] bg-gray-950/80 border border-gray-850 rounded-2xl overflow-hidden p-4 relative z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-850 pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                <div>
                  <h5 className="font-serif text-xs font-bold text-gray-100">Sankalp AI Guru Dialogue</h5>
                  <p className="text-[9px] text-[#22c55e] font-mono leading-none">ACTIVE LINEAGE TRANS-SPECTRUM</p>
                </div>
              </div>
              <button 
                onClick={() => setAiResponses([{ sender: 'guru', text: 'Hari Om, shishya! I am Sankalp, your personal Vedic AI Mentor. How can I guide your spiritual and intellectual sadhana today?', timestamp: 'Just now' }])}
                className="text-[9px] text-gray-550 hover:text-orange-400 cursor-pointer flex items-center space-x-1"
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
                  <div className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                    msg.sender === 'seeker' 
                      ? 'bg-orange-600/15 border border-orange-500/25 text-gray-100' 
                      : 'bg-[#120703]/80 border border-orange-500/15 text-orange-50/90'
                  }`}>
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1.5 border-b border-gray-900/50 pb-1">
                      <span className="font-bold uppercase tracking-wider">{msg.sender === 'seeker' ? 'YOU (Sadhak)' : '🕉️ SANKALP GURU'}</span>
                      <span className="text-gray-500">{msg.timestamp}</span>
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
                  <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-2xl text-xs text-gray-400 font-mono">
                    🌌 Invoking celestial neural parameters ... Wait a brief turn.
                  </div>
                </div>
              )}
            </div>

            {/* Form inputs */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleQueryGuru(aiPrompt); }}
              className="flex gap-2 pt-3 border-t border-gray-850"
            >
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask coordinates rules, astrological elements, sandhi commentaries ..."
                className="flex-1 bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-150 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-offset-0 placeholder-gray-650"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition cursor-pointer flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>
      )}

      {studentTab === 'referrals' && (
        <div className="bg-[#120703]/85 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden space-y-6 shadow-xl">
          <ThreeCelestialCanvas color="#f59e0b" particleCount={60} className="absolute inset-0 opacity-15 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-orange-500/10 pb-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/15 rounded-full text-[9px] font-bold text-orange-400 uppercase tracking-widest font-mono">
                Lineage Propagation System
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-normal">
                Vedic Invitation & Siddhi Credits
              </h3>
              <p className="text-xs sm:text-sm text-gray-450 leading-relaxed font-serif max-w-xl text-gray-300">
                Share timeless wisdom with fellow scholars and spiritual searchers. Instantly claim cash rewards or celestial Siddhi energy credits to unlock high certification tests or personal chart matching.
              </p>
            </div>

            <div className="bg-gray-950/80 border border-orange-500/20 p-5 rounded-2xl text-center w-full md:w-56 shrink-0 shadow-lg font-mono">
              <span className="text-[9px] text-[#f97316] uppercase tracking-widest block font-bold">YOUR UNIQUE REF ID</span>
              <p className="text-base font-extrabold text-white font-mono uppercase tracking-widest mt-1.5 select-all hover:text-orange-400 p-1.5 bg-gray-900 rounded-lg">GURUKUL-{currentUser.id.substring(5).toUpperCase()}</p>
              <span className="text-[9.5px] text-gray-500 block mt-1.5">Click to copy invitation code</span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">INVITED DEFEATS</span>
              <p className="text-3xl font-black text-white mt-1 font-serif">4 Seekers</p>
              <p className="text-[11px] text-[#ca8a04] mt-1 font-serif">Successful registrations completed</p>
            </div>

            <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">CUMULATIVE EARNINGS</span>
              <p className="text-3xl font-black text-white mt-1 font-mono">₹4,800</p>
              <p className="text-[11px] text-emerald-400 mt-1 font-serif">Authorized cash payouts pending</p>
            </div>

            <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">SIDDHI ENERGY CREDITS</span>
              <p className="text-3xl font-black text-amber-500 mt-1 font-serif">300 Credits</p>
              <p className="text-[11px] text-amber-400 mt-1 font-serif">Redeemable towards elite certifications</p>
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
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-950/40 text-center cursor-pointer flex-1"
            >
              Copy Sacred invitation link
            </button>
            <button 
              onClick={() => {
                onAddNotification({ title: '🔮 Credits Redirection', text: 'Celestial credits redeemed toward next syllabus module successfully!' });
                dispatchEvent('CREDITS_REDEEMED', { amt: 150 });
              }}
              className="px-6 py-3 bg-gray-900 border border-gray-850 hover:border-orange-500/20 text-orange-400 font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer hover:bg-orange-950/10 flex-1"
            >
              Redeem Credits towards Certifications
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
