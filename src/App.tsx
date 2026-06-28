import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Sparkles, User, Award, Shield, LogOut, Play, Pause, Clock, ChevronDown, CheckCircle, Search, Filter, 
  DollarSign, TrendingUp, Users, Check, Trash2, MessageSquare, Heart, Share2, Camera, ArrowRight, Lock, Unlock, 
  Settings, HelpCircle, Briefcase, Calendar, Star, BookOpenCheck, Bookmark, FileText, ChevronRight, Video, 
  BadgeHelp, Compass, ListRestart, PlusCircle, AlertCircle, ShoppingBag, ShoppingCart, Eye, Trophy, MapPin, Brain, Flame, X
} from 'lucide-react';

import Header from './components/Header';
import ThreeCelestialCanvas from './components/ThreeCelestialCanvas';
import AITutorPanel from './components/AITutorPanel';
import QuizSystem from './components/QuizSystem';
import CertificateView from './components/CertificateView';
import HomeView from './components/HomeView';
import KundliChartView from './components/KundliChartView';
import PlanetaryPositionsView from './components/PlanetaryPositionsView';
import PanchangMuhuratView from './components/PanchangMuhuratView';
import GurusView from './components/GurusView';
import NumerologyView from './components/NumerologyView';
import RamShalakaView from './components/RamShalakaView';
import TarotCalculatorView from './components/TarotCalculatorView';
import AdminPanel from './components/AdminPanel';
import StudentPortal from './components/StudentPortal';
import GuruPortal from './components/GuruPortal';
import { Course, UserProfile, Enrollment, Quiz, QuizAttempt, CourseNote, DiscussionThread, Notification, Order, Certificate } from './types';
import { Language, t } from './localization';
import SystemOpsConsole from './components/SystemOpsConsole';

export default function App() {
  // LANGUAGE LOCALIZATION STATE
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('sanatan-language') as Language) || 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('sanatan-language', lang);
  };

  // DARK / LIGHT THEME STATE WITH LOCALSTORAGE SYNCHRONIZATION
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('sanatan-theme') as 'light' | 'dark') || 'dark';
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('sanatan-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // USER PROFILE & ROLE MANAGEMENT
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "user-student",
    name: "Ashif Ansari",
    email: "ashifansari04704@gmail.com",
    role: "student",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    wishlist: ["course-2"],
    certificates: [
      {
        id: "cert-999",
        courseId: "course-1",
        courseTitle: "Vedic Astrology Foundation (Parashari Method)",
        studentName: "Ashif Ansari",
        issuedAt: "2026-06-18T10:00:00Z",
        verificationUrl: "/verify/cert-999"
      }
    ],
    createdAt: "2026-01-01T00:00:00Z"
  });

  // CORE DATA STATE
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [platformStats, setPlatformStats] = useState<any>(null);

  // VIEW NAVIGATION
  const [activeTab, setActiveTab] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/astrology/kundli-chart-generator') return 'astrology-kundli';
    if (path === '/astrology/planetary-positions') return 'astrology-planetary';
    if (path === '/astrology/panchang-muhurat') return 'astrology-panchang';
    if (path.length > 1) {
      return path.slice(1);
    }
    return 'home';
  });

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'astrology-kundli') {
      window.history.pushState(null, '', '/astrology/kundli-chart-generator');
    } else if (tab === 'astrology-planetary') {
      window.history.pushState(null, '', '/astrology/planetary-positions');
    } else if (tab === 'astrology-panchang') {
      window.history.pushState(null, '', '/astrology/panchang-muhurat');
    } else if (tab === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${tab}`);
    }
    
    if (tab === 'explore') {
      setSelectedCourse(null);
      setLocalAIQuiz(null);
      setGeneratedNotes('');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/astrology/kundli-chart-generator') {
        setActiveTab('astrology-kundli');
      } else if (path === '/astrology/planetary-positions') {
        setActiveTab('astrology-planetary');
      } else if (path === '/astrology/panchang-muhurat') {
        setActiveTab('astrology-panchang');
      } else if (path === '/') {
        setActiveTab('home');
      } else {
        const parsed = path.slice(1);
        if (parsed) setActiveTab(parsed);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // LMS LEARNING STATE
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<{ id: string; title: string; videoUrl: string; durationSeconds: number } | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [studyNoteText, setStudyNoteText] = useState('');
  const [localAIQuiz, setLocalAIQuiz] = useState<Quiz | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState<string>('');
  
  // MODALS & INPUT CONTROL
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'razorpay'>('razorpay');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Course[]>([]);
  const [activeLmsTab, setActiveLmsTab] = useState<'lectures' | 'community' | 'doubt' | 'schedule'>('lectures');
  const [doubtHistory, setDoubtHistory] = useState<{ [courseId: string]: { id: string; question: string; answer: string; sender: string; timestamp: string; teacher: string; loading?: boolean }[] }>({});
  const [currentDoubtText, setCurrentDoubtText] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('Acharya Prasad');
  const [checkoutMode, setCheckoutMode] = useState<'card' | 'upi'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [activeVerificationCert, setActiveVerificationCert] = useState<Certificate | null>(null);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionBody, setNewDiscussionBody] = useState('');
  const [newReplyText, setNewReplyText] = useState<{ [thId: string]: string }>({});

  // SATshANG STREAM, NOTES COMPILER, AND AUTO-RESOLVER STATES
  const [classSatsangOpen, setClassSatsangOpen] = useState(false);
  const [satsangComments, setSatsangComments] = useState<{ id: string; sender: string; avatar: string; role: string; message: string; timestamp: string }[]>([]);
  const [newSatsangComment, setNewSatsangComment] = useState('');
  const [isWisdomCompendiumOpen, setIsWisdomCompendiumOpen] = useState(false);
  const [compiledWisdomScroll, setCompiledWisdomScroll] = useState('');
  const [aiAutoResolverLoading, setAiAutoResolverLoading] = useState(false);
  const [aiAutoResolverOutput, setAiAutoResolverOutput] = useState<{ [qId: string]: string }>({});

  // Virtual Classroom Live Stream classmate replies simulation loop
  useEffect(() => {
    if (classSatsangOpen) {
      const responses = [
        { sender: 'Rohan Mishra', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', role: 'Student', message: 'Om! The direct word-by-word syntax breakdown by the Guruji is clarifying my pronounciation hurdles.' },
        { sender: 'Swami Sadananda', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop', role: 'Sadhaka', message: 'The high resonance of these chant structures seems to naturally bring deep dhyana focus.' },
        { sender: 'Dr. Subramanian', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop', role: 'Academic', message: 'Indeed. Paninian grammar dictates highly logical structures. The sandhi transitions here match perfectly.' },
        { sender: 'Maithili Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', role: 'Scholar', message: 'Can you please review the third verse again? Is the pitch considered Svarita on the second syllable?' }
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < responses.length) {
          const item = responses[currentIndex];
          setSatsangComments(prev => [
            ...prev,
            {
              id: `sc-gen-${Date.now()}-${currentIndex}`,
              sender: item.sender,
              avatar: item.avatar,
              role: item.role,
              message: item.message,
              timestamp: 'Just now'
            }
          ]);
          currentIndex++;
        }
      }, 7500);

      return () => clearInterval(interval);
    }
  }, [classSatsangOpen]);

  // INSTRUCTOR NEW COURSE STATE
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(2999);
  const [newCourseCategory, setNewCourseCategory] = useState('Software Development');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newCourseHighlights, setNewCourseHighlights] = useState('');

  // AI CAREER GENERATOR
  const [aiCareerSkills, setAiCareerSkills] = useState('');
  const [aiCareerGoals, setAiCareerGoals] = useState('');
  const [aiCareerResult, setAiCareerResult] = useState<any>(null);
  const [aiCareerLoading, setAiCareerLoading] = useState(false);

  // VIDEO TIMEFRAME INTERVAL simulation for interactive notes logging
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (videoPlaying && activeModule) {
      interval = setInterval(() => {
        setVideoTime(prev => {
          if (prev >= activeModule.durationSeconds) {
            setVideoPlaying(false);
            // Auto trigger module completion
            handleCompleteModule(activeModule.id);
            return activeModule.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [videoPlaying, activeModule, playbackSpeed]);

  // Send video telemetry pings every 5 seconds while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (videoPlaying && activeModule && selectedCourse) {
      const sendTelemetry = async () => {
        try {
          const completedPercentage = Math.round((videoTime / (activeModule.durationSeconds || 1)) * 100);
          await fetch('/api/video/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser.id,
              courseId: selectedCourse.id,
              moduleId: activeModule.id,
              watchTime: 5,
              currentPos: videoTime,
              playbackSpeed,
              completedPercentage,
              networkSpeed: 45 + Math.round(Math.random() * 10),
              bufferingRate: Math.random() > 0.95 ? Math.round(Math.random() * 5) : 0
            })
          });
        } catch (e) {
          console.warn("Telemetry ping failed", e);
        }
      };
      interval = setInterval(sendTelemetry, 5000);
    }
    return () => clearInterval(interval);
  }, [videoPlaying, videoTime, activeModule, selectedCourse, currentUser.id, playbackSpeed]);

  // Auto-select first lesson when a course is chosen
  useEffect(() => {
    if (selectedCourse) {
      if (selectedCourse.chapters && selectedCourse.chapters.length > 0) {
        const firstChapter = selectedCourse.chapters[0];
        if (firstChapter.modules && firstChapter.modules.length > 0) {
          setActiveModule(firstChapter.modules[0]);
          setVideoTime(1);
          setVideoPlaying(false);
        }
      }
    } else {
      setActiveModule(null);
    }
  }, [selectedCourse]);

  // BOOT INITIALIZATION & FETCHES
  useEffect(() => {
    fetchInitialData();
  }, [currentUser.role]);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch courses
      const cRes = await fetch('/api/courses');
      const cData = await cRes.json();
      setCourses(cData);

      // 2. Fetch enrollments
      const eRes = await fetch('/api/enrollments');
      const eData = await eRes.json();
      setEnrollments(eData);

      // 3. Fetch notifications
      const nRes = await fetch(`/api/notifications?userId=${currentUser.id}`);
      const nData = await nRes.json();
      setNotifications(nData);

      // 4. Fetch discussions
      const dRes = await fetch('/api/discussions');
      const dData = await dRes.json();
      setDiscussions(dData);

      // 5. Fetch Notes
      const notesRes = await fetch(`/api/notes?userId=${currentUser.id}`);
      const notesData = await notesRes.json();
      setNotes(notesData);

      // 6. Fetch stats
      const statsRes = await fetch('/api/analytics');
      const statsData = await statsRes.json();
      setPlatformStats(statsData);

    } catch (err) {
      console.error("Failed to query Express Fullstack API handles. Ensure tsx node server is successfully running on Port 3000.");
    }
  };

  // ROLE TOGGLE (Instant switch workspace view)
  const handleSwitchUserRole = (newRole: 'student' | 'instructor' | 'admin') => {
    const updatedUser = { ...currentUser, role: newRole as any };
    if (newRole === 'instructor') {
      updatedUser.id = "user-instructor";
      updatedUser.name = "Dr. Sarah Jenkins";
    } else if (newRole === 'admin') {
      updatedUser.id = "user-admin";
      updatedUser.name = "Platform Administrator";
    } else {
      updatedUser.id = "user-student";
      updatedUser.name = "Ashif Ansari";
    }
    setCurrentUser(updatedUser);
    
    // Jump tabs logically based on selected workspace role
    if (newRole === 'student') {
      setActiveTab('student-portal');
    } else if (newRole === 'instructor') {
      setActiveTab('instructor-panel');
    } else if (newRole === 'admin') {
      setActiveTab('admin-panel');
    }
  };

  // COMPLETE MULTIPLE CHANNELS
  const handleCompleteModule = async (moduleId: string) => {
    if (!selectedCourse) return;
    try {
      const res = await fetch(`/api/enrollments/${selectedCourse.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, moduleId })
      });
      const updatedEnroll = await res.json();
      
      // Update local state lists
      setEnrollments(prev => prev.map(e => e.id === updatedEnroll.id ? updatedEnroll : e));
      await fetchInitialData(); // Refresh user profile and certificates if progress reached 100%
    } catch (err) {
      console.error(err);
    }
  };

  // LOG STUDENT TIMESTAMP NOTES
  const handleSaveStudyNote = async () => {
    if (!selectedCourse || !activeModule || !studyNoteText.trim()) return;
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: selectedCourse.id,
          moduleId: activeModule.id,
          videoTimeSeconds: videoTime,
          text: studyNoteText
        })
      });
      const newNote = await response.json();
      setNotes(prev => [...prev, newNote]);
      setStudyNoteText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudyNote = async (noteId: string) => {
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  // VERIFICATION FOR EARNED CERTIFICATES
  const handleVerifyCertificateLink = (certId: string) => {
    const foundCert = currentUser.certificates.find(c => c.id === certId);
    if (foundCert) {
      setActiveVerificationCert(foundCert);
      setActiveTab('verification');
    }
  };

  // CHECKOUT PAYMENT WORKFLOW SIMULATION STAGES
  const handleTriggerCheckout = (course: Course) => {
    setCheckoutCourse(course);
  };

  const handleProcessSimulatedPayment = async () => {
    if (!checkoutCourse) return;
    setPaymentProcessing(true);
    
    try {
      const response = await fetch('/api/payment/checkout-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: checkoutCourse.id,
          couponCode: appliedCoupon,
          paymentGateway
        })
      });
      const result = await response.json();
      if (result.success) {
        // Enrolled successfully, upgrade dashboards and close modal
        setCheckoutCourse(null);
        setAppliedCoupon('');
        setCheckoutDiscount(0);
        setCouponCodeInput('');
        setActiveTab('my-courses');
        await fetchInitialData();
      }
    } catch (err) {
      console.warn("Express payment node is offline.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleStartFreeTrial = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          isTrial: true
        })
      });
      if (response.ok) {
        setSelectedCourseDetail(null);
        setSelectedCourse(course);
        setActiveTab('active-learning');
        setActiveLmsTab('lectures');
        await fetchInitialData();
      }
    } catch (err) {
      console.error("Free trial subscription failed", err);
    }
  };

  // COURSE CREATION EDITOR (INSTRUCTORS)
  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDesc,
          price: newCoursePrice,
          category: newCourseCategory,
          difficulty: newCourseDifficulty,
          highlights: newCourseHighlights ? newCourseHighlights.split('\n') : ["Dynamic LMS chapter lessons", "Structured evaluation quizzes"],
          instructorId: currentUser.id,
          instructorName: currentUser.name
        })
      });
      const created = await response.json();
      setCourses(prev => [...prev, created]);
      
      // Reset inputs & push success broadcast alert
      setNewCourseTitle('');
      setNewCourseDesc('');
      setNewCoursePrice(2999);
      setNewCourseHighlights('');

      // Add success notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          title: "Course Uploaded for Admin Review! 📡",
          text: `"${created.title}" was submitted. Standard quality moderation approvals take up to 10 minutes inside AI Studio.`,
          type: "info",
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);

    } catch (err) {
      console.warn(err);
    }
  };

  // WORKSPACE MODERATION TRIGGERS (ADMINS)
  const handleModifyCourseStatus = async (courseId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/courses/${courseId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      setCourses(prev => prev.map(c => c.id === courseId ? updated : c));
      await fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendGuruLiveDoubt = async () => {
    if (!currentDoubtText.trim() || !selectedCourse) return;
    const doubtText = currentDoubtText;
    const teacherName = selectedTeacher;
    setCurrentDoubtText('');

    const newDoubtId = `doubt-${Date.now()}`;
    const newChatRecord = {
      id: newDoubtId,
      question: doubtText,
      answer: '',
      sender: currentUser.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      teacher: teacherName,
      loading: true
    };

    // Append loading record
    setDoubtHistory(prev => {
      const existing = prev[selectedCourse.id] || [];
      return {
        ...prev,
        [selectedCourse.id]: [...existing, newChatRecord]
      };
    });

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Sudarshana query: I have a vital inquiry under teacher ${teacherName}. Question: "${doubtText}"`,
          courseContext: {
            title: selectedCourse.title,
            instructor: selectedCourse.instructorName,
            category: selectedCourse.category,
            difficulty: selectedCourse.difficulty
          },
          messageHistory: []
        })
      });
      const data = await response.json();
      
      // Update record with actual AI output
      setDoubtHistory(prev => {
        const existing = prev[selectedCourse.id] || [];
        return {
          ...prev,
          [selectedCourse.id]: existing.map(db => db.id === newDoubtId ? { ...db, answer: data.response || 'Om! Guru was unable to retrieve scriptures, explore text guides.', loading: false } : db)
        };
      });
    } catch (err) {
      console.error(err);
      setDoubtHistory(prev => {
        const existing = prev[selectedCourse.id] || [];
        return {
          ...prev,
          [selectedCourse.id]: existing.map(db => db.id === newDoubtId ? { ...db, answer: 'Om! Sanga communication dropped due to network issues.', loading: false } : db)
        };
      });
    }
  };

  // SOCRATIC AUTO-RESOLVER & WISDOM NOTES COMPILER HELPERS
  const handleCompileWisdomCompendium = async () => {
    if (!selectedCourse) return;
    setIsWisdomCompendiumOpen(true);
    setCompiledWisdomScroll('GATHERS SCRIPTURAL COMPENDIUM IN THE HERMITAGE... SEEKING DIRECT LINEAGE INTERPRETATIONS...');
    
    // Get all user annotations for this course
    const courseNotes = notes.filter(n => n.courseId === selectedCourse.id);
    const notesText = courseNotes.map(n => `[Timestamp: ${Math.floor(n.videoTimeSeconds/60)}m ${n.videoTimeSeconds%60}s] "${n.text}"`).join('\n');
    
    try {
      const promptText = `Compile a beautiful and scholarly spiritual student guide companion scroll for "${selectedCourse.title}". 
      ${courseNotes.length > 0 ? `The student Ashif Ansari generated the following live lecture annotations:\n${notesText}\n\nPlease expand each annotation with traditional commentary, referencing Upanishadic roots and Sanskrit meanings if relevant.` : 'Please generate an in-depth curriculum summary of the major scriptures studied in this track, with specific commentary on Sanskrit mantras, their pronunciation guidelines, and traditional metrics.'}`;
      
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          courseContext: {
            title: selectedCourse.title,
            instructor: selectedCourse.instructorName,
            category: selectedCourse.category,
            difficulty: selectedCourse.difficulty
          },
          messageHistory: []
        })
      });
      const data = await response.json();
      setCompiledWisdomScroll(data.response || 'Unable to retrieve compilation from Gurukul network.');
    } catch (err) {
      console.error(err);
      setCompiledWisdomScroll('Veda-Sanga communication interrupted. Please check network logs.');
    }
  };

  const handleSolveQuizOption = async (qId: string, questionText: string, correctAnswerText: string) => {
    if (!selectedCourse) return;
    setAiAutoResolverLoading(true);
    setAiAutoResolverOutput(prev => ({ ...prev, [qId]: 'Guru is interpreting the Shastric principles for this inquiry... 🕉️' }));
    
    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Socratic Explanation request: For the question: "${questionText}", explain clearly why the correct option is "${correctAnswerText}". Rely on orthodox analytical philosophy and cite source Sanskrit frameworks where applicable. Do not just output the answer, teach the logic behind it in a gentle scholarly tone.`,
          courseContext: {
            title: selectedCourse.title,
            instructor: selectedCourse.instructorName,
            category: selectedCourse.category
          },
          messageHistory: []
        })
      });
      const data = await response.json();
      setAiAutoResolverOutput(prev => ({ ...prev, [qId]: data.response || 'Scriptures resolved but transmission dropped. Try again.' }));
    } catch (err) {
      console.error(err);
      setAiAutoResolverOutput(prev => ({ ...prev, [qId]: 'Unable to establish contact with the Guru pool. Try again.' }));
    } finally {
      setAiAutoResolverLoading(false);
    }
  };

  // ADD COMMUNITY THREAD
  const handleAddForumThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionTitle.trim() || !newDiscussionBody.trim()) return;

    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse ? selectedCourse.id : null,
          title: newDiscussionTitle,
          body: newDiscussionBody,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role
        })
      });
      const created = await res.json();
      setDiscussions(prev => [created, ...prev]);
      
      setNewDiscussionTitle('');
      setNewDiscussionBody('');
    } catch (err) {
      console.error(err);
    }
  };

  // ADD THREAD REPLY
  const handleAddThreadReply = async (threadId: string) => {
    const text = newReplyText[threadId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`/api/discussions/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          body: text
        })
      });
      const updatedThread = await res.json();
      setDiscussions(prev => prev.map(d => d.id === threadId ? updatedThread : d));
      setNewReplyText(prev => ({ ...prev, [threadId]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  // AI CAREER GENERATOR SUBMISSION PIPELINE
  const handleRequestCareerPath = async () => {
    if (!aiCareerSkills.trim() || !aiCareerGoals.trim()) return;
    setAiCareerLoading(true);
    setAiCareerResult(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: aiCareerSkills, goals: aiCareerGoals })
      });
      const pathways = await res.json();
      setAiCareerResult(pathways);
    } catch (err) {
      console.warn(err);
    } finally {
      setAiCareerLoading(false);
    }
  };

  // CLEAR INBOX ALERTS
  const handleClearNotifications = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  // FILTERED COURSES
  const filteredCoursesList = courses.filter(c => {
    if (currentUser.role === 'student' && c.status !== 'approved') return false;
    
    // search matching
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // filter categories
    const matchesCat = categoryFilter ? c.category === categoryFilter : true;
    
    // filter difficulties
    const matchesDiff = difficultyFilter ? c.difficulty === difficultyFilter : true;

    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f8f6f2] text-stone-850' : 'bg-[#060302] text-gray-150'} flex flex-col font-sans antialiased selection:bg-orange-600/30 selection:text-white`} id="main-root-workspace">
      
      {/* Top Professional Header */}
      <Header
        currentUser={currentUser}
        notifications={notifications}
        onSwitchRole={handleSwitchUserRole}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        onClearNotifications={handleClearNotifications}
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cart.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Hero Header Space on Explore tab with beautiful sacred theme */}
      {activeTab === 'explore' && !selectedCourse && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#140703] via-[#090503] to-[#060302] border-b border-orange-500/10 py-16 sm:py-20 px-4 sm:px-6 text-center" id="branding-hero select-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-orange-600/5 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-orange-950/20 hover:bg-orange-950/30 border border-orange-500/20 rounded-full text-xs font-serif font-bold text-orange-400 mb-6 shadow-md shadow-orange-950/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>
                {language === 'hi' ? 'संकल्प एआई-संचालित पवित्र शिक्षा डेस्क' : 
                 language === 'sa' ? 'सङ्कल्प-कृत्रिमबुद्धि-पवित्र-शिक्षण-पीठम्' : 
                 'Sankalp AI-Powered Sacred Learning Desk'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white leading-[1.15] mb-5 uppercase">
              {language === 'hi' ? <>वैदिक शिक्षा पाठ्यक्रम। <br /><span className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent underline decoration-orange-500 decoration-wavy underline-offset-8">पारंपरिक शास्त्रों का अन्वेषण करें।</span></> : 
               language === 'sa' ? <>वैदिक-शिक्षा-पाठ्यक्रमः। <br /><span className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent underline decoration-orange-500 decoration-wavy underline-offset-8">पारम्परिकशास्त्राणाम् अन्वेषणम्।</span></> : 
               <>Vedic Education Curriculum. <br /><span className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent underline decoration-orange-500 decoration-wavy underline-offset-8">Explore Traditional Shastras.</span></>}
            </h2>

            <p className="text-gray-450 max-w-2xl mx-auto text-xs sm:text-sm font-serif leading-relaxed mb-10 text-gray-300">
              {language === 'hi' ? 'पारंपरिक गुरुकुल बोर्डों द्वारा सत्यापित प्रमाणपत्र अर्जित करें। संकल्प गुरु स्वचालित शंका समाधान, श्लोक व्याख्या और डिजिटल मूल्यांकन के साथ ज्ञान यात्रा को गति दें।' : 
               language === 'sa' ? 'पारम्परिक-गुरुकुल-बोर्ड-द्वारा सत्यापितप्रमाणपत्राणि प्राप्नुत। सङ्कल्प-गुरु-स्वचालित-शङ्कानिवारण-श्लोकव्याख्या-मूल्याङ्कनैः सह ज्ञानयात्रां वर्धयन्तु।' : 
               'Earn certified lineage credentials verified by traditional gurukul boards. Accelerate your knowledge journey with Sankalp Guru automated doubts resolution, shloka breakdown and digital assessments.'}
            </p>

            {/* Quick dashboard shortcuts info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono uppercase font-bold tracking-widest text-[#f97316]/65">
              <div className="bg-[#0c0604]/80 border border-orange-500/10 px-4 py-2 rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'hi' ? 'सिम्युलेटेड सूक्ष्म-लेनदेन' : language === 'sa' ? 'सिम्युलेटेड-सूक्ष्म-लेनदेनः' : 'Simulated Microtransactions'}</span>
              </div>
              <div className="bg-[#0c0604]/80 border border-orange-500/10 px-4 py-2 rounded-xl flex items-center space-x-2">
                <Brain className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'hi' ? 'एआई संकल्प मेंटर' : language === 'sa' ? 'एआई-सङ्कल्प-मार्गदर्शकः' : 'AI Sankalp Mentor'}</span>
              </div>
              <div className="bg-[#0c0604]/80 border border-orange-500/10 px-4 py-2 rounded-xl flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'hi' ? 'सत्यापित डिजिटल डिग्री' : language === 'sa' ? 'सत्यापित-डिजिटल-उपाधिः' : 'Verified Digital Degree'}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6">

        {/* VIEW 0: SACRED HOME LANDING EXPERIENCE */}
        {activeTab === 'home' && (
          <HomeView onNavigate={handleNavigate} language={language} theme={theme} />
        )}

        {/* VIEW JYOTISH 1: KUNDLI CHART GENERATOR */}
        {activeTab === 'astrology-kundli' && (
          <KundliChartView currentUser={currentUser} />
        )}

        {/* VIEW JYOTISH 2: CELESTIAL PLANETARY POSITIONS */}
        {activeTab === 'astrology-planetary' && (
          <PlanetaryPositionsView currentUser={currentUser} />
        )}

        {/* VIEW JYOTISH 3: SACRED PANCHANG MUHURAT */}
        {activeTab === 'astrology-panchang' && (
          <PanchangMuhuratView currentUser={currentUser} language={language} />
        )}

        {/* VIEW NUMEROLOGY: CHALD-VEDIC CALCULATOR SUITE */}
        {activeTab === 'numerology' && (
          <NumerologyView currentUser={currentUser} />
        )}

        {/* VIEW RAM SHALAKA PRASHNAVALI: SACRED REFLECTIVE DEVOTINAL RADAR */}
        {activeTab === 'ram-shalaka' && (
          <RamShalakaView currentUser={currentUser} language={language} />
        )}

        {/* VIEW TAROT ORACLE: GUIDED REFLECTIVE ARCANA */}
        {activeTab === 'tarot' && (
          <TarotCalculatorView currentUser={currentUser} />
        )}

        {/* VIEW GURUS: BOOKINGS MARKETPLACE */}
        {activeTab === 'gurus' && (
          <GurusView 
            currentUser={currentUser} 
            onAddNotification={(notif) => {
              const newNotif: Notification = {
                id: `notif-${Date.now()}`,
                userId: currentUser.id,
                title: notif.title,
                text: notif.text,
                type: "info",
                read: false,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [newNotif, ...prev]);
            }} 
          />
        )}

        {/* VIEW CERTIFICATION LADDER: CREDENTIAL REGISTRY */}
        {activeTab === 'certification-ladder' && (
          <div className="space-y-8 animate-in fade-in" id="certification-registry-deck">
            <div className="border-b border-orange-500/10 pb-4 text-center max-w-xl mx-auto">
              <span className="text-[10px] text-orange-400 font-serif font-bold uppercase tracking-widest block">Decentralized Academic Registry</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-500 uppercase mt-1">Vedic Credentials Registry</h2>
              <p className="text-xs text-gray-400 mt-2 font-serif">A cryptographically secure database that preserves lineages and credentials verifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {currentUser.certificates.map(cert => (
                <div 
                  key={cert.id} 
                  className="bg-[#0c0604] border border-orange-500/15 hover:border-orange-500/30 rounded-2xl p-5 flex items-center justify-between gap-4 font-serif hover:scale-[1.01] transition-all cursor-pointer shadow-xl"
                  onClick={() => {
                    setActiveVerificationCert(cert);
                    setActiveTab('verification');
                  }}
                >
                  <div className="flex items-center space-x-3.5 shrink overflow-hidden">
                    <div className="bg-orange-950/20 p-2.5 rounded-xl border border-orange-500/20 text-orange-400 shrink-0">
                      <Award className="w-5 h-5 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.3)]" />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-bold text-gray-200 text-xs truncate uppercase tracking-wide">{cert.courseTitle}</h5>
                      <span className="text-[9px] text-[#f97316]/50 font-mono block mt-1">ID: SG-{cert.id.slice(5, 11) || "1208"} • Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 bg-[#120703] border border-orange-500/25 hover:bg-orange-950/10 text-orange-400 rounded-lg text-[10px] font-bold font-serif shrink-0 cursor-pointer flex items-center space-x-1.5 uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* VIEW 1: EXPLORE / SEARCH CATALOGUE */}
        {activeTab === 'explore' && !selectedCourse && (
          <div className="space-y-10 animate-in fade-in duration-300 select-none" id="explore-catalogue-view">
            
            {selectedCourseDetail ? (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Navigation Breadcrumb & Back action */}
                <div className="flex items-center justify-between border-b border-orange-500/10 pb-4 text-left">
                  <button
                    onClick={() => setSelectedCourseDetail(null)}
                    className="group flex items-center space-x-2 text-xs text-orange-400 hover:text-orange-300 font-serif font-bold uppercase cursor-pointer"
                  >
                    <span>← Back to Curriculum Catalog</span>
                  </button>
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest leading-none">CURRICULUM IMMERSION • ID: SG-{selectedCourseDetail.id.slice(0, 8).toUpperCase()}</span>
                </div>

                {/* Main detail layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column - Detailed profile */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2 text-left">
                      <span className="inline-block px-2.5 py-1 bg-orange-950/20 border border-orange-500/20 text-orange-400 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold">
                        {selectedCourseDetail.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-100 uppercase leading-tight">
                        {selectedCourseDetail.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-450 font-serif">
                        <span>Difficulty: <strong className="text-orange-400">{selectedCourseDetail.difficulty}</strong></span>
                        <span>•</span>
                        <span>Instructor: <strong className="text-orange-400">{selectedCourseDetail.instructorName}</strong></span>
                        <span>•</span>
                        <span>Lessons: <strong className="text-orange-400">{selectedCourseDetail.chapters.reduce((sum, ch) => sum + ch.modules.length, 0)} modules</strong></span>
                      </div>
                    </div>

                    <img 
                      src={selectedCourseDetail.thumbnail} 
                      alt={selectedCourseDetail.title} 
                      className="w-full h-80 object-cover rounded-2xl border border-orange-500/15 shadow-2xl"
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-4 text-left">
                      <h3 className="text-lg font-serif font-bold text-gray-200 uppercase tracking-widest border-b border-orange-500/10 pb-2">Sacred Insights & Objectives</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                        {selectedCourseDetail.description || "Deepen your scriptural insights and build authenticated Sanatan knowledge channels under the strict offline guidance of verified gurus and pandits."}
                      </p>
                    </div>

                    {/* Highlights */}
                    {selectedCourseDetail.highlights && selectedCourseDetail.highlights.length > 0 && (
                      <div className="space-y-3 text-left">
                        <h4 className="text-xs uppercase text-orange-400 font-serif font-bold tracking-widest">Immersion Highlights</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans">
                          {selectedCourseDetail.highlights.map((h, i) => (
                            <div key={i} className="flex items-center space-x-2 bg-[#120703]/40 border border-orange-500/5 p-2.5 rounded-xl">
                              <CheckCircle className="w-4 h-4 text-[#f97316] shrink-0" />
                              <span className="text-xs text-gray-300">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Demo Warning Segment */}
                    <div className="bg-gradient-to-r from-orange-950/20 to-amber-950/10 border border-orange-500/25 rounded-2xl p-4 text-left space-y-2">
                      <h4 className="flex items-center space-x-2 text-xs font-serif font-bold text-orange-400 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>7-Day Spiritual Access Trial (Free Demo Available)</span>
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed font-sans">
                        Sample the curriculum immediately with our integrated 7-day trials. During trial active phase, you gain full, unfettered access to all recorded study modules and peer discussion reviews. Direct messaging, expert gurus doubt solvers, and certificate verification are reserved for fully tuition-secured students.
                      </p>
                    </div>

                  </div>

                  {/* Right Column - Chapter Lists and Purchase Deck */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Action Hub */}
                    <div className="bg-[#0c0604] border border-orange-500/15 rounded-2xl p-5 shadow-xl text-left space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-[#f97316]/50 uppercase font-mono font-bold tracking-widest block">Complete Immersion License</span>
                        <div className="flex items-baseline space-x-2 font-serif">
                          <span className="text-2xl font-bold text-[#f97316]">₹{selectedCourseDetail.price}</span>
                          <span className="text-xs text-gray-500 line-through">₹{selectedCourseDetail.originalPrice}</span>
                          <span className="text-[9px] text-emerald-400 font-sans font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10 shrink-0">66% DAKSHINA WAIVER</span>
                        </div>
                      </div>

                      <div className="space-y-2 font-sans text-xs">
                        {cart.some(item => item.id === selectedCourseDetail.id) ? (
                          <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-full py-3 bg-[#120703] border border-emerald-500/35 hover:bg-emerald-950/20 text-emerald-400 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>In Basket - View Cart</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCart(prev => [...prev, selectedCourseDetail]);
                              setIsCartOpen(true);
                            }}
                            className="w-full py-3 bg-[#120703] border border-orange-500/35 hover:bg-orange-950/10 text-orange-400 rounded-xl font-medium uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Spiritual Basket</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleTriggerCheckout(selectedCourseDetail)}
                          className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl font-serif font-bold uppercase tracking-widest transition-all shadow-lg shadow-orange-600/15 cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          <span>Secure Full Access (Buy Now)</span>
                        </button>

                        <button
                          onClick={() => handleStartFreeTrial(selectedCourseDetail)}
                          className="w-full py-2.5 bg-gray-950 hover:bg-gray-900 text-gray-300 font-medium rounded-xl uppercase tracking-wider border border-orange-500/10 hover:border-orange-500/25 transition-all text-[11px] cursor-pointer"
                        >
                          Begin 7 Days Free Trial
                        </button>
                      </div>

                      <div className="border-t border-orange-500/10 pt-3 flex items-center justify-between text-[10px] text-gray-500 font-serif">
                        <span>🔒 Secured dakshina</span>
                        <span>⭐ Lineage Certified tracks</span>
                      </div>
                    </div>

                    {/* Chapters Syllabus Preview */}
                    <div className="bg-[#0c0604] border border-orange-500/15 rounded-2xl p-5 shadow-xl text-left space-y-4 font-serif">
                      <div className="border-b border-orange-500/10 pb-3">
                        <h4 className="text-xs uppercase text-orange-400 font-serif font-bold tracking-widest">Modules Syllabus Curriculum</h4>
                        <span className="text-[10px] text-gray-500 font-sans">{selectedCourseDetail.chapters.length} Chapters • {selectedCourseDetail.chapters.reduce((sum, ch) => sum + ch.modules.length, 0)} Lessons</span>
                      </div>

                      <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                        {selectedCourseDetail.chapters.map((ch, idx) => (
                          <div key={ch.id} className="space-y-2 bg-[#120703]/50 border border-orange-500/5 p-3 rounded-xl text-left">
                            <span className="text-[9px] font-mono text-[#f97316]/60 uppercase font-bold tracking-wider">Chapter {idx+1} • MODULE</span>
                            <h5 className="text-xs font-serif font-bold text-gray-200 mt-0.5 uppercase">{ch.title}</h5>
                            <div className="space-y-1.5 pt-1 border-t border-orange-500/5 mt-1 font-sans">
                              {ch.modules.map((mod) => (
                                <div key={mod.id} className="flex items-center justify-between gap-2.5 text-[10px] py-1 text-gray-400 font-sans">
                                  <div className="flex items-center space-x-1.5 min-w-0">
                                    <Play className="w-3 h-3 text-orange-500 shrink-0" />
                                    <span className="truncate">{mod.title}</span>
                                  </div>
                                  <span className="font-mono text-gray-500 shrink-0">{(mod.durationSeconds / 60) | 0}m</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            ) : (
              <>
            
            {/* Title Header */}
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[10px] text-orange-400 font-serif font-bold uppercase tracking-widest block">Sacred Academy Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-100 uppercase mt-1">Sacred Courses & Deep Dives</h2>
              <p className="text-xs text-gray-400 mt-2 font-serif">Curated learning paths blending textual accuracy with practical lineage application. Study our rich shastras today.</p>
            </div>

            {/* Search Filters Bar */}
            <div className="bg-[#0c0604] border border-orange-500/15 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              
              {/* Search bar input */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-orange-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Vedas, Upanishads, Jyotish, Sanskrit grammar..."
                  className="w-full bg-[#0a0502]/80 border border-orange-500/15 focus:border-orange-500/40 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none transition-all placeholder:text-gray-600"
                  id="course-search-field"
                />
              </div>

              {/* Dynamic Tag Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-sans text-xs">
                
                {/* Category select */}
                <div className="flex items-center space-x-1.5 bg-[#0a0502]/80 border border-orange-500/15 px-3 py-2 rounded-xl text-orange-400">
                  <Filter className="w-3.5 h-3.5" />
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-transparent focus:outline-none focus:ring-0 text-xs text-gray-300 cursor-pointer"
                  >
                    <option value="" className="bg-[#0c0604] text-gray-300">All Categories</option>
                    <option value="Astrology & Allied Sciences" className="bg-[#0c0604] text-gray-300">Astrology & Jyotish</option>
                    <option value="Linguistics & Chanting" className="bg-[#0c0604] text-gray-300">Linguistics & Chanting</option>
                  </select>
                </div>

                {/* Difficulty select */}
                <div className="flex items-center space-x-1.5 bg-[#0a0502]/80 border border-orange-500/15 px-3 py-2 rounded-xl text-orange-400">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <select 
                    value={difficultyFilter} 
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-transparent focus:outline-none focus:ring-0 text-xs text-gray-300 cursor-pointer"
                  >
                    <option value="" className="bg-[#0c0604] text-gray-300">Any Difficulty</option>
                    <option value="Beginner" className="bg-[#0c0604] text-gray-300">Beginner</option>
                    <option value="Intermediate" className="bg-[#0c0604] text-gray-300">Intermediate</option>
                    <option value="Advanced" className="bg-[#0c0604] text-gray-300">Advanced</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Courses grid container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoursesList.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-[#0c0604] rounded-3xl border border-orange-500/15">
                  <AlertCircle className="w-12 h-12 text-orange-500/60 mx-auto mb-4" />
                  <p className="text-gray-400 italic font-serif">No courses matched your query. Try clearing filters or revising keywords.</p>
                </div>
              ) : (
                filteredCoursesList.map((course) => {
                  const isEnrolled = enrollments.some(e => e.userId === currentUser.id && e.courseId === course.id);
                  return (
                    <div 
                      key={course.id}
                      className="bg-[#0c0604] border border-orange-500/10 hover:border-orange-500/30 rounded-2xl overflow-hidden transition-all flex flex-col justify-between group h-full shadow-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.06)]"
                      id={`course-card-${course.id}`}
                    >
                      {/* Thumbnail frame */}
                      <div className="relative h-44 overflow-hidden shrink-0">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[#0c0604]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase text-orange-400 border border-orange-500/20">
                          {course.category}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-[#0a0502]/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-gray-300 border border-orange-500/10">
                          {course.difficulty}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 text-xs text-orange-400/80 mb-2 font-serif">
                            <span className="font-bold">{course.instructorName}</span>
                            <span className="text-orange-500/35">•</span>
                            <span className="font-sans text-[11px] text-gray-500">{course.studentsCount} Initiates Enrolled</span>
                          </div>

                          <h3 className="font-bold font-serif text-gray-100 text-sm sm:text-base leading-snug group-hover:text-orange-400 transition-colors mb-3 uppercase tracking-wide">
                            {course.title}
                          </h3>

                          <p className="text-xs text-gray-400 leading-relaxed font-serif line-clamp-3 mb-4">
                            {course.description}
                          </p>
                        </div>

                        {/* Interactive highlights & trigger action */}
                        <div>
                          <div className="space-y-1.5 mb-5 border-t border-orange-500/10 pt-4">
                            {course.highlights.slice(0, 2).map((hl, kIdx) => (
                              <div key={kIdx} className="flex items-start space-x-2 text-[11px] text-gray-400 font-serif">
                                <span className="text-orange-500 shrink-0 mt-0.5 text-xs">🍃</span>
                                <span className="truncate">{hl}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div>
                              <span className="text-[9px] text-[#f97316]/50 uppercase font-mono font-bold tracking-widest block">Tuition Dakshina</span>
                              <div className="flex items-baseline space-x-1.5 mt-0.5">
                                <span className="text-base font-bold text-[#f97316]">₹{course.price}</span>
                                <span className="text-xs text-gray-500 line-through">₹{course.originalPrice}</span>
                              </div>
                            </div>

                            {isEnrolled ? (
                              <button
                                onClick={() => { setSelectedCourse(course); setActiveTab('active-learning'); }}
                                className="px-4 py-2 border border-orange-500/35 bg-[#120703] hover:bg-orange-950/10 rounded-xl text-xs font-serif font-bold text-orange-400 tracking-wider transition-all cursor-pointer flex items-center space-x-1 uppercase"
                              >
                                <span>Open Portal</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <div className="flex items-center space-x-1.5 shrink-0">
                                <button
                                  onClick={() => setSelectedCourseDetail(course)}
                                  className="px-3 py-2 border border-orange-500/30 bg-[#120703] hover:bg-orange-905 text-orange-400 hover:text-orange-300 rounded-xl text-[10px] font-serif font-bold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Syllabus
                                </button>
                                <button
                                  onClick={() => handleTriggerCheckout(course)}
                                  className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl text-[10px] font-serif font-bold uppercase tracking-wider transition-all shadow shadow-orange-600/20 cursor-pointer"
                                >
                                  Buy Track
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

              </>
            )}
          </div>
        )}

        {/* VIEW 2: STUDY JOURNEY / ENROLLED COURSES */}
        {activeTab === 'my-courses' && (
          <div className="space-y-8 select-none animate-in fade-in duration-300" id="learning-journey-view">
            <div className="border-b border-orange-500/10 pb-5">
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-100 uppercase">Your Sacred Learning Journey</h3>
              <p className="text-xs text-gray-500 font-mono tracking-widest mt-1 uppercase">Track Vedic chanting & computations milestones</p>
            </div>

            {/* List block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-[#0c0604] rounded-3xl border border-orange-500/15">
                  <Award className="w-12 h-12 text-orange-500/60 mx-auto mb-4" />
                  <p className="text-gray-400 mb-6 font-serif">You are not enrolled in any sacred lineage courses yet.</p>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow shadow-orange-600/20 cursor-pointer"
                  >
                    Browse Certified Curriculum Catalog
                  </button>
                </div>
              ) : (
                enrollments.map((en) => {
                  const course = courses.find(c => c.id === en.courseId);
                  if (!course) return null;

                  return (
                    <div 
                      key={en.id}
                      className="bg-[#0c0604] border border-orange-500/15 rounded-2xl overflow-hidden p-5 flex flex-col sm:flex-row gap-5 items-stretch shadow-md hover:border-orange-500/30 transition-all font-serif"
                    >
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full sm:w-32 h-24 object-cover rounded-xl border border-orange-500/10"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono tracking-wider uppercase text-orange-400 font-bold bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-500/25">{course.category}</span>
                          <h4 className="font-bold text-gray-100 text-sm sm:text-base mt-2 line-clamp-1 uppercase tracking-warn">{course.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-1">Instructor: {course.instructorName}</p>
                        </div>

                        {/* Progress Bar bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                            <span>Vedic Memorization Standards</span>
                            <span className="font-bold text-orange-400">{en.progressPercentage}%</span>
                          </div>
                          
                          <div className="w-full h-1.5 bg-[#0a0502] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
                              style={{ width: `${en.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 self-end">
                          <button
                            onClick={() => { setSelectedCourse(course); setActiveTab('active-learning'); }}
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer font-serif"
                          >
                            Open Portal
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
                 {/* VIEW 3: ACTIVE LMS VIDEO & STUDY LAB */}
        {activeTab === 'active-learning' && selectedCourse && (() => {
          const currentEnrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === selectedCourse.id);
          const isTrialActive = currentEnrollment?.isTrial === true;

          // Resolve course chats for doubt resolution
          const courseDoubts = doubtHistory[selectedCourse.id] || [];

          // Class schedule tailored by category
          const isAstro = selectedCourse.category?.toLowerCase().includes('astro') || selectedCourse.category?.toLowerCase().includes('jyotish');
          const isYoga = selectedCourse.category?.toLowerCase().includes('yoga') || selectedCourse.category?.toLowerCase().includes('meditat');
          
          const scheduleSlots = [
            {
              dayLabel: 'Today (Live Now)',
              topic: isAstro ? 'Panchang Drik-Siddhanta Calculative Rules' : isYoga ? 'Pranayama Kundalini Flow Practice & Bandhas' : 'Rigveda Samhita Chanting & Accent Intonations',
              time: '08:00 AM IST - 09:30 AM IST',
              teacher: selectedCourse.instructorName,
              room: 'Ganga Satsang Hall B',
              status: 'live'
            },
            {
              dayLabel: 'Tomorrow',
              topic: isAstro ? 'Graha Bala - Calculating Planetary Strength metrics' : isYoga ? 'Dhyana Yoga: Patanjali Dharana Direct Mind Bindings' : 'Ashtadhyayi Sandhi Rules & Phonology Drills',
              time: '07:30 AM IST - 09:00 AM IST',
              teacher: 'Acharya Prasad',
              room: 'Yajna Mandala Cave 1',
              status: 'upcoming'
            },
            {
              dayLabel: 'Day 2',
              topic: isAstro ? 'Dasha Periods Interpretation & Remedial Gems science' : isYoga ? 'Anatomy of Subtle Channels: Nadis, Chakras & Kundalin' : 'Katha Upanishad Chapter 1 Recitations & Philosophy',
              time: '06:00 PM IST - 07:30 PM IST',
              teacher: 'Ma Chinmayi Devi',
              room: 'Ananda Shala',
              status: 'upcoming'
            },
            {
              dayLabel: 'Day 3',
              topic: isAstro ? 'Modern Chart Synthesis for Horary Muhurata' : isYoga ? 'Traditional Hatha Yoga Pradipika textual reviews' : 'Sankhya Karika Direct Dialectics on Manifest Nature',
              time: '11:00 AM IST - 12:30 PM IST',
              teacher: 'Pandit Gautham Shastri',
              room: 'Jyotish Dome 4',
              status: 'upcoming'
            }
          ];

          // Separate course discussions
          const courseThreads = discussions.filter(d => d.courseId === selectedCourse.id);
          const fallbackCourseThreads = [
            {
              id: `fallback-th-1-${selectedCourse.id}`,
              courseId: selectedCourse.id,
              title: `Swadhyaya Daily Sadhanas for ${selectedCourse.title}`,
              body: `Hari Om, fellow seeker! I found that meditating or chanting the module verses at exactly sunrise (Brahma Muhurta - 04:30 AM) significantly speeds up my pronunciation retention and centers my focus for the entire work day. What specific preparation habits do you recommend before testing ourselves on the lineage quizzes?`,
              authorId: `instructor-acharya`,
              authorName: selectedCourse.instructorName,
              authorRole: `instructor`,
              authorAvatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80`,
              likesCount: 16,
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              replies: [
                {
                  id: `fallback-rep-1`,
                  authorId: `student-gopal`,
                  authorName: `Gopal Sharma`,
                  authorRole: `student`,
                  authorAvatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80`,
                  body: `Yes, indeed! Performing 5 minutes of Nadi Shodhana (channel-purifying alternate breathing) before chanting allows the speech organs (Kanthas) to properly reach high notes without straining. Highly recommend it!`,
                  createdAt: new Date(Date.now() - 86400000).toISOString()
                }
              ]
            },
            {
              id: `fallback-th-2-${selectedCourse.id}`,
              courseId: selectedCourse.id,
              title: `Accessing critical commentary references`,
              body: `Has anyone located the authentic translations of these referenced commentaries in the digital archives? Are there specific Sanskrit-English editions you recommend to consult during our 7-day trials of this course tracking?`,
              authorId: `student-murthy`,
              authorName: `Prof. M. K. Murthy`,
              authorRole: `student`,
              authorAvatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80`,
              likesCount: 7,
              createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
              replies: []
            }
          ];

          const activeCourseThreads = courseThreads.length > 0 ? courseThreads : fallbackCourseThreads;

          return (
            <div className="space-y-8" id="lms-active-desk">
              
              {/* Breadcrumb row */}
              <div className="flex items-center space-x-2 text-xs text-gray-400 border-b border-gray-800/60 pb-4">
                <span className="cursor-pointer hover:text-white" onClick={() => setActiveTab('explore')}>My Gurukul</span>
                <span>/</span>
                <span className="text-gray-200">{selectedCourse.title}</span>
                {isTrialActive && (
                  <>
                    <span>/</span>
                    <span className="text-amber-500 font-mono font-bold uppercase tracking-wider bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">7-Day Free Trial</span>
                  </>
                )}
              </div>

              {/* Title & Trial Status header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0c0e17] p-6 rounded-2xl border border-gray-805">
                <div>
                  <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest">{selectedCourse.category} SACRED PATH</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 font-serif">{selectedCourse.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">Sadhana guided by lineage expert <span className="text-orange-400 font-semibold">{selectedCourse.instructorName}</span></p>
                </div>

                {isTrialActive ? (
                  <div className="bg-amber-950/20 border-2 border-dashed border-amber-500/40 p-4 rounded-xl flex items-center space-x-4 max-w-sm shrink-0">
                    <span className="text-3xl">🔓</span>
                    <div>
                      <p className="text-xs font-bold text-amber-400 font-serif">Simulated 7-Day Demo Trial</p>
                      <p className="text-[10px] text-gray-300 mt-1">Recorded lectures are 100% active. Buy tuition to unlock community postings, guru live doubt tickets, and verified certificates.</p>
                      <button 
                        onClick={() => handleTriggerCheckout(selectedCourse)} 
                        className="mt-2.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase rounded-lg transition"
                      >
                        Enroll Full Access (Secure Dakshina)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#05130b] border border-emerald-900/50 p-4 rounded-xl flex items-center space-x-3 max-w-sm shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 leading-none">Full Traditional Tuition Active</p>
                      <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">All Student portal features are 100% unlocked. Receive lineage credentials upon curriculum mastery.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* STUDENT SECTION TAB BAR NAVIGATION */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-800 pb-2">
                <button
                  onClick={() => setActiveLmsTab('lectures')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase sm:tracking-wider transition flex items-center space-x-2 ${
                    activeLmsTab === 'lectures'
                      ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/50'
                      : 'bg-gray-900/40 text-gray-400 hover:text-white border border-transparent hover:bg-gray-900/80'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'रिकॉर्डेड पाठ्यक्रम' : 
                     language === 'sa' ? 'ध्वनि-मुद्रित-पाठ्यक्रमः' : 
                     'Recorded Syllabus'}
                  </span>
                </button>
                <button
                  onClick={() => setActiveLmsTab('community')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase sm:tracking-wider transition flex items-center space-x-2 ${
                    activeLmsTab === 'community'
                      ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/50'
                      : 'bg-gray-900/40 text-gray-400 hover:text-white border border-transparent hover:bg-gray-900/80'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'पाठ्यक्रम समुदाय' : 
                     language === 'sa' ? 'पाठ्यक्रम-सङ्घः' : 
                     'Course Community'}
                  </span>
                </button>
                <button
                  onClick={() => setActiveLmsTab('doubt')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase sm:tracking-wider transition flex items-center space-x-2 ${
                    activeLmsTab === 'doubt'
                      ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/50'
                      : 'bg-gray-900/40 text-gray-400 hover:text-white border border-transparent hover:bg-gray-900/80'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'गुरु शंका निवारक' : 
                     language === 'sa' ? 'गुरु-शङ्का-निवारकः' : 
                     'Guru Doubt Solver'}
                  </span>
                </button>
                <button
                  onClick={() => setActiveLmsTab('schedule')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase sm:tracking-wider transition flex items-center space-x-2 ${
                    activeLmsTab === 'schedule'
                      ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/50'
                      : 'bg-gray-900/40 text-gray-400 hover:text-white border border-transparent hover:bg-gray-900/80'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'कक्षा सारणी' : 
                     language === 'sa' ? 'वर्ग-काल-कोषः' : 
                     'Class Schedule'}
                  </span>
                </button>
              </div>

              {/* SPLIT SCREEN LAYOUT PORTAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Tabbed Content Container (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* TAB 1: RECORDED LECTURES SCREEN */}
                  {activeLmsTab === 'lectures' && (
                    <div className="space-y-6">
                      
                      {/* Video Player */}
                      <div className="bg-black rounded-2xl border border-gray-900 overflow-hidden relative shadow-2xl" id="custom-video-player">
                        {activeModule ? (
                          <div className="aspect-video w-full bg-[#04060C] flex flex-col justify-between p-6">
                            {/* Player Header */}
                            <div className="flex items-center justify-between z-10">
                              <span className="text-[10px] bg-indigo-950/80 border border-indigo-900/50 text-indigo-300 px-3 py-1 rounded-lg font-mono font-bold uppercase tracking-wider">{activeModule.title}</span>
                              <div className="flex items-center space-x-1.5 shrink-0">
                                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                                <span className="text-[9px] text-rose-300 font-mono uppercase bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-900/30 font-bold">Lineage Transmission</span>
                              </div>
                            </div>

                            {/* Player Monitor Visualizer */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                              <div className="bg-amber-500/10 p-5 rounded-full border border-amber-500/20 mb-3 text-amber-500 animate-pulse">
                                <Play className="w-8 h-8 fill-amber-500" />
                              </div>
                              <p className="text-xs font-mono text-gray-400 max-w-xs">{activeModule.title}</p>
                              
                              {/* Video Timing indicator */}
                              <div className="text-2xl font-black font-mono text-amber-400 mt-2">
                                {Math.floor(videoTime / 60)}:{(videoTime % 60).toString().padStart(2, '0')} 
                                <span className="text-gray-600"> / </span> 
                                {Math.floor(activeModule.durationSeconds / 60)}:{(activeModule.durationSeconds % 60).toString().padStart(2, '0')}
                              </div>
                            </div>

                            {/* Velocity control toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-950/90 p-3 rounded-xl border border-gray-900 z-10 text-xs text-gray-300">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => {
                                    if (videoTime === 0) setVideoTime(1);
                                    setVideoPlaying(!videoPlaying);
                                  }}
                                  className="bg-orange-600 hover:bg-orange-500 p-2.5 rounded-lg text-white transition cursor-pointer"
                                >
                                  {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <div className="font-mono text-gray-400">
                                  {playbackSpeed}x Speech Velocity
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 mr-2">
                                  {([1.0, 1.25, 1.5, 2.0] as const).map((spd) => (
                                    <button
                                      key={spd}
                                      onClick={() => setPlaybackSpeed(spd)}
                                      className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold ${playbackSpeed === spd ? 'bg-orange-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                                    >
                                      {spd}x
                                    </button>
                                  ))}
                                </div>

                                <button
                                  onClick={async () => {
                                    setVideoPlaying(false);
                                    await handleCompleteModule(activeModule.id);
                                    setVideoTime(0);
                                  }}
                                  className="px-3 py-2 bg-emerald-700/20 hover:bg-emerald-600 hover:text-black border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold rounded-lg transition cursor-pointer"
                                >
                                  Complete Lesson
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video w-full bg-[#04060C] flex flex-col items-center justify-center text-center p-6 text-gray-500">
                            <Lock className="w-10 h-10 text-gray-700 mb-3" />
                            <p className="text-sm font-serif text-gray-400">Select a course module from the syllabus rail on the right to start video playback stream.</p>
                          </div>
                        )}
                      </div>

                      {/* Study Notes & Annotation workspace */}
                      <div className="bg-[#111625] border border-gray-800 rounded-2xl p-5 sm:p-6" id="notes-annotations-section">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-4">
                          <div>
                            <h3 className="font-bold text-gray-200 font-serif">Sutra & Lecture Annotations</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Maintain personalized study notes linked to timestamps.</p>
                          </div>
                          
                          {/* Wisdom Compiler Action Trigger */}
                          <button
                            onClick={handleCompileWisdomCompendium}
                            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-orange-950/40 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Compile Wisdom Compendium</span>
                          </button>
                        </div>

                        {/* Input comment field */}
                        <div className="flex gap-3 mb-6">
                          <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 flex items-center justify-center text-xs text-amber-500 font-mono h-11">
                            <Clock className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                            <span>{Math.floor(videoTime / 60)}:{(videoTime % 60).toString().padStart(2, '0')}</span>
                          </div>
                          <input 
                            type="text" 
                            value={studyNoteText}
                            onChange={(e) => setStudyNoteText(e.target.value)}
                            placeholder="Type translation, chants meanings, or guru insights here..."
                            className="flex-1 bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-gray-250 focus:outline-none focus:ring-1 focus:ring-orange-500 h-11"
                          />
                          <button 
                            onClick={handleSaveStudyNote}
                            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold cursor-pointer h-11 transition"
                          >
                            Keep Note
                          </button>
                        </div>

                        {/* Stored annotations list */}
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                          {notes.filter(n => n.courseId === selectedCourse.id).length === 0 ? (
                            <p className="text-xs text-gray-500 italic py-2">No custom annotation markers saved for this lecture yet. Annotate lines during key segment transfers to speed up your learning loop.</p>
                          ) : (
                            notes.filter(n => n.courseId === selectedCourse.id).map(n => (
                              <div key={n.id} className="bg-gray-900/60 p-3.5 border border-gray-800 rounded-xl flex items-start justify-between text-xs transition hover:border-gray-700">
                                <div className="flex items-start space-x-3">
                                  <button 
                                    onClick={() => setVideoTime(n.videoTimeSeconds)}
                                    className="bg-[#151D2F] text-amber-400 border border-indigo-900/50 hover:bg-indigo-950 font-mono text-[10px] px-2 py-1 rounded-lg flex items-center shrink-0 cursor-pointer transition"
                                  >
                                    <Play className="w-2.5 h-2.5 text-amber-500 mr-1 fill-amber-500" />
                                    <span>{Math.floor(n.videoTimeSeconds / 60)}:{(n.videoTimeSeconds % 60).toString().padStart(2, '0')}</span>
                                  </button>
                                  <p className="text-gray-300 leading-relaxed font-sans mt-0.5">{n.text}</p>
                                </div>
                                <button 
                                  onClick={() => handleDeleteStudyNote(n.id)}
                                  className="text-gray-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Dynamic Assessment Quiz with Socratic Auto-Solver Helper */}
                      {localAIQuiz ? (
                        <div className="bg-[#121826]/95 border border-gray-800 rounded-2xl p-6 shadow-2xl" id="local-ai-quiz-solver">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                            <div>
                              <h3 className="font-bold text-gray-200 flex items-center space-x-2 font-serif text-sm sm:text-base">
                                <Brain className="w-5 h-5 text-orange-500" />
                                <span>Authentic Lineage Quiz Assessment</span>
                              </h3>
                              <p className="text-xs text-gray-400 mt-1">Authorized test board to verify your scriptural understanding.</p>
                            </div>
                            <button 
                              onClick={() => setLocalAIQuiz(null)}
                              className="text-xs text-gray-500 hover:text-gray-300 font-mono"
                            >
                              Exit Test
                            </button>
                          </div>

                          <div className="space-y-6">
                            <QuizSystem
                              quiz={localAIQuiz}
                              currentUser={currentUser}
                              onQuizSubmit={async (ans) => {
                                try {
                                  await fetch(`/api/quizzes/${localAIQuiz.id}/submit`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: currentUser.id, answers: ans })
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              onSubmitCompleted={async () => {
                                await fetchInitialData();
                              }}
                              isLoading={false}
                            />

                            {/* Inline Socratic Auto-Solver helper box */}
                            <div className="mt-8 pt-6 border-t border-gray-805 bg-gray-950/40 p-5 rounded-2xl border border-orange-500/10">
                              <h4 className="text-xs font-serif text-orange-400 font-bold uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Hermitage Socratic Auto-Solver AI Helper</span>
                              </h4>
                              <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                                Stumped on an option? Click below to request our Socratic Guru to reveal and annotate correct scriptural principles for this quiz.
                              </p>
                              
                              <div className="space-y-4">
                                {localAIQuiz.questions.map((q, idx) => (
                                  <div key={q.id} className="border-b border-gray-900 pb-3 last:border-0 last:pb-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <p className="text-xs font-medium text-gray-300">Q{idx+1}: {q.question}</p>
                                      
                                      <button
                                        onClick={() => handleSolveQuizOption(q.id, q.question, q.options[q.correctAnswerIndex])}
                                        className="text-[10px] text-amber-500 hover:text-amber-400 border border-amber-900/50 hover:bg-amber-950/50 px-2.5 py-1 rounded bg-[#1c130c]/40 font-mono self-start cursor-pointer transition shrink-0"
                                      >
                                        Auto-Solve & Explain
                                      </button>
                                    </div>

                                    {aiAutoResolverOutput[q.id] && (
                                      <div className="mt-2.5 bg-gray-950/90 text-gray-300 p-4 rounded-xl text-xs leading-relaxed border border-gray-850/80 whitespace-pre-line font-sans animate-in fade-in">
                                        <div className="text-[9px] text-amber-500 uppercase tracking-widest font-mono font-bold mb-1">Gurukul Commentary Exegesis:</div>
                                        {aiAutoResolverOutput[q.id]}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#111625] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <h4 className="text-sm font-serif font-bold text-gray-200">Active Module Self-Assessment</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-md">Verify your comprehension of the current syllabus lessons with official multiple-choice evaluations.</p>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                const quizRes = await fetch(`/api/quizzes/${selectedCourse.id}`);
                                if (quizRes.ok) {
                                  const qData = await quizRes.json();
                                  setLocalAIQuiz(qData);
                                } else {
                                  // Generate beautiful fallback assessment questions dynamically
                                  setLocalAIQuiz({
                                    id: `active-assessment-${selectedCourse.id}`,
                                    courseId: selectedCourse.id,
                                    title: `${selectedCourse.title} - Mid-Term Checkpoint`,
                                    description: `An official assess checklist prepared by Gurukul councils to review oral rules and philosophy of ${selectedCourse.title}.`,
                                    durationMinutes: 10,
                                    questions: [
                                      {
                                        id: `q-gen-1`,
                                        question: `What fundamental principle is prioritized inside the first chapter of this syllabus context?`,
                                        options: ["Reread-only syntax review", "Lineage-based guru-shishya parampara audio resonance", "Ignoring auxiliary commentaries", "Self-authored unvetted mantras"],
                                        correctAnswerIndex: 1,
                                        explanation: "Direct oral transmission under lineage-centered gurus guarantees exact phonetic fidelity of traditional Shastras."
                                      },
                                      {
                                        id: `q-gen-2`,
                                        question: `In traditional Vedic studies, why are exact pitch (Svara) rules strictly maintained?`,
                                        options: ["Just for academic decoration", "Because pitch shifts can entirely alter spiritual and grammatical meaning of mantra streams", "To speed up video streaming", "For modern instrumentation alignment"],
                                        correctAnswerIndex: 1,
                                        explanation: "Svara rules (Udatta, Anudatta, Svarita) dictate semantic patterns. A shift in syllable tone entirely alters scriptural alignment."
                                      }
                                    ]
                                  });
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="px-5 py-2.5 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-200 hover:text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition text-center"
                          >
                            Launch Verse Quiz Checkpoint
                          </button>
                        </div>
                      )}

                      {/* Wisdom Metrics tracking widgets */}
                      <div className="bg-[#111625] border border-gray-800 rounded-2xl p-6 space-y-4" id="wisdom-learning-metrics">
                        <div className="border-b border-gray-805 pb-3">
                          <h4 className="text-xs font-mono font-bold uppercase text-amber-500 tracking-wider">Swadhyaya (Learning Metrics) Dashboard</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">Real-time indicators tracking your wisdom retention indices.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="bg-[#0b0e17] p-4 rounded-xl border border-gray-850">
                            <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-bold block">Focus (Dhyana)</span>
                            <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">98.4%</span>
                            <span className="text-[9px] text-gray-500 block mt-0.5">High Retention</span>
                          </div>
                          
                          <div className="bg-[#0b0e17] p-4 rounded-xl border border-gray-850">
                            <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-bold block">Study Track (Swadhyaya)</span>
                            <span className="text-xl font-bold font-mono text-amber-400 block mt-1">12.5 hrs</span>
                            <span className="text-[9px] text-emerald-400 block mt-0.5">7-Day active streak</span>
                          </div>

                          <div className="bg-[#0b0e17] p-4 rounded-xl border border-gray-850">
                            <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-bold block">Self Evaluations (Sadhana)</span>
                            <span className="text-xl font-bold font-mono text-indigo-400 block mt-1">90.5%</span>
                            <span className="text-[9px] text-gray-500 block mt-0.5">Average accuracy</span>
                          </div>

                          <div className="bg-[#0b0e17] p-4 rounded-xl border border-gray-850">
                            <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-bold block">Chapters Met</span>
                            <span className="text-xl font-bold font-mono text-purple-400 block mt-1">
                              {currentEnrollment ? `${currentEnrollment.completedModuleIds.length} / ${selectedCourse.chapters.reduce((sum, ch) => sum + ch.modules.length, 0)}` : '0'}
                            </span>
                            <span className="text-[9px] text-gray-500 block mt-0.5">Progress milestone</span>
                          </div>
                        </div>

                        {/* Beautiful custom inline SVG Progress gauge representing Kundalini/wisdom path */}
                        <div className="bg-[#07090f] p-4 rounded-xl border border-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 shrink-0">
                              <svg viewBox="0 0 36 36" className="w-12 h-12">
                                <path className="text-gray-900" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-orange-500 animate-pulse" strokeDasharray="75, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-xs font-serif text-gray-200 font-bold block">Sadhaka Mindful Path Mastery</span>
                              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Your study metrics show deep alignment with the oral rhythm. You are currently outpacing 85% of cohort scholars.</p>
                            </div>
                          </div>
                        </div>

                        {/* Certificate Locked/Unlocked Status Card */}
                        {(() => {
                          const totalCount = selectedCourse.chapters.reduce((sum, ch) => sum + ch.modules.length, 0);
                          const completedCount = currentEnrollment?.completedModuleIds.length || 0;
                          const isCompleted = totalCount > 0 && completedCount === totalCount;
                          const percent = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;
                          const cert = currentUser.certificates?.find(c => c.courseId === selectedCourse.id);

                          return (
                            <div className={`p-4 rounded-xl border transition-all ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-amber-950/20 to-yellow-950/20 border-yellow-500/30' 
                                : 'bg-[#0b0e17] border-gray-850'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg border ${
                                    isCompleted 
                                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                                      : 'bg-gray-900 border-gray-800 text-gray-500'
                                  }`}>
                                    <Award className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-bold block">Lineage Completion Certificate</span>
                                    <h5 className="font-serif font-bold text-xs text-gray-200 mt-0.5">
                                      {isCompleted ? '🏆 Lineage Certificate Unlocked!' : '🔒 Certificate Locked'}
                                    </h5>
                                    <p className="text-[10px] text-gray-450 mt-1 leading-relaxed font-serif">
                                      {isCompleted 
                                        ? 'Siddha congratulations! Your mastery has been verified by the lineage. Claim your credentials below.'
                                        : `Achieve 100% video progress to unlock this certificate. Complete ${totalCount - completedCount} more lessons.`}
                                    </p>
                                  </div>
                                </div>

                                {isCompleted && cert ? (
                                  <button
                                    onClick={() => handleVerifyCertificateLink(cert.id)}
                                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black text-xs font-serif uppercase tracking-wider font-black rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-yellow-950/20 shrink-0"
                                  >
                                    View Certificate
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-550 text-xs font-serif uppercase tracking-wider font-bold rounded-xl cursor-not-allowed shrink-0"
                                  >
                                    Locked ({percent}%)
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      </div>

                    </div>
                  )}

                  {/* TAB 2: SEPARATE COURSE DISCUSSION COMMUNITY */}
                  {activeLmsTab === 'community' && (
                    <div className="space-y-6">
                      
                      {/* Course specific community header */}
                      <div className="bg-gradient-to-br from-[#120703] to-[#0b0c13] border border-gray-800 p-6 rounded-2xl">
                        <h4 className="text-base font-serif font-bold text-orange-400 flex items-center space-x-1.5">
                          <span>👥</span>
                          <span>{selectedCourse.title} - Dedicated Classroom Forum</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          A local, lineage-secured chamber for scholars registered in this course to discuss exegesis rules, pose chapter clarifications, and connect on Sanskrit recitations.
                        </p>
                      </div>

                      {/* FREE TRIAL VIEW-ONLY ACCESS LEVEL RESTRICTION BAR */}
                      {isTrialActive ? (
                        <div className="bg-[#1c130c]/80 border-2 border-dashed border-amber-500/30 p-5 rounded-2xl flex items-start space-x-4">
                          <span className="text-2xl mt-0.5 shrink-0">🔒</span>
                          <div>
                            <h5 className="text-xs font-bold font-serif text-amber-500 uppercase tracking-widest">Secured Trial Access: View-Only Mode</h5>
                            <p className="text-[11px] text-gray-300 leading-relaxed mt-1">
                              You are currently sampling this curriculum via the 7-Day Spiritual Access Trial. Live lecture viewing is fully unlocked, but broadcasting queries, writing posts, and responding inside the peer Sangha forum requires an active tuition dakshina.
                            </p>
                            <button
                              onClick={() => handleTriggerCheckout(selectedCourse)}
                              className="mt-3 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                            >
                              Upgrade to Full Access (Secure Dakshina)
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Open Thread builder for full paid accounts */
                        <div className="bg-[#111625] border border-gray-800 rounded-2xl p-5 sm:p-6" id="course-thread-builder">
                          <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-bold mb-3.5">Engage in traditional Sangha (Add post)</h4>
                          <form 
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await handleAddForumThread(e);
                              await fetchInitialData();
                            }} 
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">Topic Headline</label>
                              <input 
                                type="text" 
                                value={newDiscussionTitle}
                                onChange={(e) => setNewDiscussionTitle(e.target.value)}
                                placeholder="e.g. Seeking translation help on chapter 2, sutra 14..."
                                className="w-full bg-gray-900 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">Detailed Content</label>
                              <textarea 
                                value={newDiscussionBody}
                                onChange={(e) => setNewDiscussionBody(e.target.value)}
                                placeholder="Write clear parameters, list pronunciation struggles, or share comparative philosophies."
                                rows={4}
                                className="w-full bg-gray-900 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
                              ></textarea>
                            </div>

                            <button 
                              type="submit"
                              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition ml-auto block"
                            >
                              Broadcast Thread
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Course forum feed */}
                      <div className="space-y-4">
                        {activeCourseThreads.map((th) => (
                          <div key={th.id} className="bg-[#111625] border border-gray-800 p-5 rounded-2xl space-y-4 hover:border-gray-700 transition">
                            {/* Author row */}
                            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800/50 pb-3">
                              <div className="flex items-center space-x-2.5">
                                <img src={th.authorAvatar} alt={th.authorName} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="font-bold text-gray-200">{th.authorName}</span>
                                  <span className="text-[9px] uppercase tracking-wider font-semibold font-mono text-orange-400 ml-2 bg-[#211612] border border-orange-500/10 px-1.5 py-0.5 rounded">{th.authorRole}</span>
                                </div>
                              </div>
                              <span className="font-mono text-[9px] text-gray-500">{new Date(th.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Title & Body */}
                            <div>
                              <h5 className="text-sm font-serif font-black text-white">{th.title}</h5>
                              <p className="text-xs text-gray-300 mt-2 leading-relaxed bg-gray-950/40 p-3.5 rounded-xl border border-gray-900 whitespace-pre-wrap font-sans">{th.body}</p>
                            </div>

                            {/* Replies chain */}
                            <div className="space-y-3 pt-2">
                              {th.replies && th.replies.length > 0 && (
                                <div className="space-y-3 pl-4 border-l border-orange-500/10">
                                  {th.replies.map((rep) => (
                                    <div key={rep.id} className="bg-[#0b0e17] p-3 rounded-xl border border-gray-900 text-xs">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center space-x-1.5">
                                          <img src={rep.authorAvatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                                          <span className="font-bold text-gray-300">{rep.authorName}</span>
                                          <span className="text-[8px] bg-gray-905 border border-gray-800 font-mono px-1 rounded-md text-gray-450">{rep.authorRole}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-gray-600">{new Date(rep.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-gray-300 leading-relaxed font-sans">{rep.body}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Reply Input Form (Disabled on trial accounts) */}
                              <div className="flex gap-2.5 pt-2 border-t border-gray-850/80">
                                <input 
                                  type="text" 
                                  disabled={isTrialActive}
                                  value={newReplyText[th.id] || ''}
                                  onChange={(e) => setNewReplyText(prev => ({ ...prev, [th.id]: e.target.value }))}
                                  placeholder={isTrialActive ? "🔒 Replies are locked during demo trials..." : "Type clear response or advice..."}
                                  className="flex-1 bg-gray-900 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-40"
                                />
                                <button 
                                  disabled={isTrialActive}
                                  onClick={async () => {
                                    if (isTrialActive) return;
                                    await handleAddThreadReply(th.id);
                                    await fetchInitialData();
                                  }}
                                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* TAB 3: DYNAMIC GURU DOUBT RESOLVER */}
                  {activeLmsTab === 'doubt' && (
                    <div className="space-y-6">
                      
                      {/* Teacher pool segment header */}
                      <div className="bg-gradient-to-br from-[#120703] to-[#0c0d16] border border-gray-800 p-6 rounded-2xl">
                        <h4 className="text-base font-serif font-bold text-orange-400">🕉️ Direct Lineage Live Guru Doubt Resolution</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          Submit your specific exegesis queries directly to the Guru overseeing that course segment. Our models retrieve historical lineage context and generate comprehensive scriptural answers.
                        </p>
                      </div>

                      {/* GURU / TEACHER SELECTED CARD LIST */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: "Acharya Prasad", specialty: "Vyakarana (Grammar) & Svara Accentology", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
                          { name: "Pandit Gautham Shastri", specialty: "Vedangas, Jyotisha (Ritual Astronomy)", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80" },
                          { name: "Ma Chinmayi Devi", specialty: "Upanishadic Metaphysics & Vedanta", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" }
                        ].map((t) => (
                          <div
                            key={t.name}
                            onClick={() => setSelectedTeacher(t.name)}
                            className={`p-4 rounded-xl border cursor-pointer transition text-center flex flex-col items-center ${
                              selectedTeacher === t.name
                                ? 'bg-orange-600/15 border-orange-500/70 text-orange-300 ring-1 ring-orange-500/20'
                                : 'bg-gray-900/60 border-gray-850 hover:border-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <img src={t.avatar} className="w-12 h-12 rounded-full mb-2 object-cover border border-gray-800" referrerPolicy="no-referrer" />
                            <span className="text-xs font-serif font-black block leading-tight">{t.name}</span>
                            <span className="text-[9px] mt-1 font-mono text-gray-500 block leading-normal">{t.specialty}</span>
                          </div>
                        ))}
                      </div>

                      {/* FREE TRIAL GURU RESTRICTION BLOCK */}
                      {isTrialActive ? (
                        <div className="bg-[#1c130c]/80 border-2 border-dashed border-amber-500/30 p-5 rounded-2xl flex items-start space-x-4">
                          <span className="text-2xl mt-0.5 shrink-0">🔒</span>
                          <div>
                            <h5 className="text-xs font-bold font-serif text-amber-500 uppercase tracking-widest">Guru Direct Dialogue Locked</h5>
                            <p className="text-[11px] text-gray-300 leading-relaxed mt-1">
                              One-on-one direct doubt resolution tickets with lineage Acharyas are certified services reserved strictly for fully tuition-secured scholars. Sample our dynamic syllabus lectures immediately, or secure full dakshina to submit personal questions!
                            </p>
                            <button
                              onClick={() => handleTriggerCheckout(selectedCourse)}
                              className="mt-3 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                            >
                              Unlock All Portals & Gurus (₹{selectedCourse.price})
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Inquiry submit box for paid users */
                        <div className="bg-[#111625] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4 font-sans">
                          <h4 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-bold">Offer Direct Inquiry to {selectedTeacher}</h4>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={currentDoubtText}
                              onChange={(e) => setCurrentDoubtText(e.target.value)}
                              placeholder={`Submit query to ${selectedTeacher}... (e.g. Please clarify verse 1.4 pronunciation...)`}
                              className="flex-1 bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendGuruLiveDoubt();
                              }}
                            />
                            <button
                              onClick={handleSendGuruLiveDoubt}
                              className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition uppercase tracking-wider shrink-0"
                            >
                              Submit Ticket
                            </button>
                          </div>

                          {/* Historical chats for this course */}
                          <div className="space-y-4 mt-6">
                            {courseDoubts.length === 0 ? (
                              <p className="text-xs text-gray-500 italic py-4 text-center">No scriptural inquiries posed yet. Posing clear doubts initiates traditional debates (Shastrartha) instantly.</p>
                            ) : (
                              [...courseDoubts].reverse().map((db) => (
                                <div key={db.id} className="bg-gray-950/40 border border-gray-900 p-5 rounded-2xl space-y-3">
                                  {/* Student question */}
                                  <div className="flex items-start space-x-2.5">
                                    <span className="text-xs shrink-0 mt-0.5 bg-gray-900 border border-gray-800 px-2.5 py-0.5 rounded text-amber-500 font-mono">My Query</span>
                                    <p className="text-xs text-gray-200 font-sans">{db.question}</p>
                                  </div>
                                  
                                  {/* Guru respond */}
                                  <div className="bg-[#131724]/70 p-4 rounded-xl border border-indigo-950/50 space-y-2 animate-in fade-in">
                                    <div className="flex items-center space-x-2 border-b border-gray-900/50 pb-2 mb-2">
                                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                      <span className="text-xs font-serif font-black text-orange-400">{db.teacher} responding:</span>
                                      <span className="text-[8px] font-mono text-gray-500 ml-auto">{db.timestamp}</span>
                                    </div>
                                    
                                    {db.loading ? (
                                      <div className="flex items-center space-x-2 text-xs text-amber-500 font-mono py-1">
                                        <span className="animate-spin text-sm">🕉️</span>
                                        <span className="animate-pulse">Guru is analyzing lineage repositories for scriptural resolution...</span>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                                        {db.answer}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 4: CLASS SCHEDULE TIMELINE & LIVE STREAM SIMULATION */}
                  {activeLmsTab === 'schedule' && (
                    <div className="space-y-6">
                      
                      {/* Schedule header card */}
                      <div className="bg-gradient-to-br from-[#120703] to-[#0a0b12] border border-gray-800 p-6 rounded-2xl">
                        <h4 className="text-base font-serif font-bold text-orange-400">📅 Class Schedule Timeline</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          Interactive timeline of scheduled virtual interactive workshops and oral recitation drills. Fully purchased users join rooms to participate synchronously.
                        </p>
                      </div>

                      {/* Display 4 days schedule panels */}
                      <div className="space-y-4">
                        {scheduleSlots.map((sl, index) => (
                          <div key={index} className="bg-[#111625] border border-gray-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-gray-700">
                            <div className="space-y-1.5">
                              {/* Labels */}
                              <div className="flex items-center space-x-2">
                                <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded border ${
                                  sl.status === 'live'
                                    ? 'bg-rose-950/50 border-rose-900 text-rose-400 animate-pulse'
                                    : 'bg-[#151D2F] border-indigo-900/50 text-indigo-300'
                                }`}>
                                  {sl.dayLabel}
                                </span>
                                <span className="text-[9px] font-mono text-gray-400">{sl.room}</span>
                              </div>

                              {/* Topic info */}
                              <h5 className="text-sm sm:text-base font-serif font-black text-gray-100">{sl.topic}</h5>

                              {/* Timing metadata */}
                              <p className="text-xs text-gray-400 font-sans flex items-center space-x-1">
                                <span>with </span>
                                <span className="text-orange-400 font-semibold">{sl.teacher}</span>
                                <span className="text-gray-600"> | </span>
                                <span>{sl.time}</span>
                              </p>
                            </div>

                            {/* Action Button */}
                            {sl.status === 'live' ? (
                              <button
                                onClick={() => {
                                  // Preseed Satsang comments and open modal
                                  setSatsangComments([
                                    { id: 'sc-1', sender: 'Maithili Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', role: 'Scholar', message: 'Pranam Acharyaji, the direct audio transmission of the verse syntax sounds pristine today!', timestamp: 'Just now' },
                                    { id: 'sc-2', sender: 'Dr. Subramanian', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop', role: 'Academic', message: 'How does this rule of sandhi map into traditional Rigveda Samhita structures?', timestamp: '1m ago' }
                                  ]);
                                  setClassSatsangOpen(true);
                                }}
                                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 self-start sm:self-center cursor-pointer transition shadow-lg shadow-rose-950/50 animate-pulse"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                                <span>Join Live Satsang Room</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-650 rounded-xl text-xs font-sans self-start sm:self-center cursor-not-allowed opacity-50"
                              >
                                Room Closed
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>

                {/* Right Column: Syllabus Chapters Rail & Fast Quiz triggers (1/3 width) */}
                <div className="space-y-6">
                  
                  {/* Syllabus Chapters Rail Container */}
                  <div className="bg-[#111625] border border-gray-800 rounded-2xl p-5" id="syllabus-chapters-rail">
                    <h3 className="text-xs uppercase text-orange-400 font-mono tracking-widest font-bold mb-4 border-b border-gray-800 pb-2">Course syllabus & outline</h3>
                    
                    <div className="space-y-4">
                      {selectedCourse.chapters.map((ch) => (
                        <div key={ch.id} className="border-b border-gray-800/60 pb-3 last:border-0 last:pb-0">
                          <h4 className="text-xs font-bold text-gray-300 font-serif">{ch.title}</h4>
                          <div className="mt-2 space-y-1.5">
                            {ch.modules.map((mod) => {
                              const isCompleted = enrollments.find(e => e.userId === currentUser.id && e.courseId === selectedCourse.id)?.completedModuleIds.includes(mod.id);
                              const isPlaying = activeModule?.id === mod.id;

                              return (
                                <button
                                  key={mod.id}
                                  onClick={() => {
                                    setActiveModule(mod);
                                    setVideoTime(1);
                                    setVideoPlaying(false);
                                    setActiveLmsTab('lectures'); // auto jump back to lectures
                                  }}
                                  className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                                    isPlaying 
                                      ? 'bg-orange-600/10 border border-orange-500/40 text-orange-300 shadow-md' 
                                      : 'bg-gray-900/50 hover:bg-gray-800/80 text-gray-400 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 shrink overflow-hidden">
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Video className="w-4 h-4 text-orange-400 shrink-0" />
                                    )}
                                    <span className="truncate">{mod.title}</span>
                                  </div>
                                  <span className="text-[10px] text-gray-500 shrink-0 ml-3 font-mono">
                                    {Math.floor(mod.durationSeconds / 60)}m
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fast certification summary info */}
                    <div className="mt-6 border-t border-gray-800 pt-4 text-center">
                      <span className="text-[9px] uppercase font-mono text-gray-500 tracking-wider block">Gurukul Assessment Council</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          );
        })()}     </div>

          </div>
        )}

        {/* VIEW 4: COMMUNITY DISCUSSION FORUMS */}
        {activeTab === 'forum' && (
          <div className="space-y-8" id="community-feed-desk">
            
            <div className="border-b border-gray-800/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Discussion Forum & Community Feed</h3>
                <p className="text-xs text-gray-500 font-mono tracking-widest mt-1 uppercase">Share lessons, resolve bugs, connect globally</p>
              </div>

              {/* Active Statistics */}
              <div className="flex items-center space-x-4 text-xs font-mono">
                <div className="bg-gray-900 border border-gray-800 px-3.5 py-1.5 rounded-xl text-gray-300">
                  <span className="font-bold text-indigo-400">140</span> Active Posts
                </div>
                <div className="bg-gray-900 border border-gray-800 px-3.5 py-1.5 rounded-xl text-gray-300">
                  <span className="font-bold text-emerald-400">14</span> Online Mentors
                </div>
              </div>
            </div>

            {/* Split Screen Forum block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Create discussion Thread */}
              <div className="bg-[#111625] border border-gray-800 rounded-2xl p-5 sm:p-6 h-fit">
                <h4 className="text-xs uppercase text-indigo-400 font-mono tracking-wider font-bold mb-4">Start New Topic Thread</h4>
                
                <form onSubmit={handleAddForumThread} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase font-mono mb-1.5">Topic Headline</label>
                    <input 
                      type="text" 
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                      placeholder="e.g. CORS issues on Express container entrypoints"
                      className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-0 placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase font-mono mb-1.5">Detailed Body Content</label>
                    <textarea 
                      value={newDiscussionBody}
                      onChange={(e) => setNewDiscussionBody(e.target.value)}
                      placeholder="Be specific. Share logs, file paths, or exact code blocks."
                      rows={5}
                      className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-0 placeholder-gray-600 font-sans"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wider transition cursor-pointer"
                  >
                    Broadcast Post to Feed
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Feed List */}
              <div className="lg:col-span-2 space-y-6">
                
                {discussions.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-12">No discussions posted. Clear filters or initiate a topic!</p>
                ) : (
                  discussions.map((th) => (
                    <div key={th.id} className="bg-[#111625] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4">
                      
                      {/* Author row */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={th.authorAvatar} 
                            alt={th.authorName} 
                            className="w-7 h-7 rounded-full border border-gray-700" 
                          />
                          <div>
                            <span className="font-bold text-gray-200">{th.authorName}</span>
                            <span className="text-[10px] text-indigo-400 font-mono ml-2 capitalize bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-900/30 font-semibold">{th.authorRole}</span>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-500 font-mono">
                          {new Date(th.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Headline body */}
                      <div>
                        {th.courseId && (
                          <span className="text-[8px] uppercase tracking-wider text-rose-300 font-mono font-bold bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-900/20 mr-2">Course Thread</span>
                        )}
                        <h4 className="text-sm sm:text-base font-bold text-gray-100 inline">{th.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed bg-[#0E121F] p-4 rounded-xl border border-gray-850/80 pr-6 font-sans">
                          {th.body}
                        </p>
                      </div>

                      {/* replies feed list */}
                      {th.replies.length > 0 && (
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-950 mt-4">
                          <p className="text-[10px] text-gray-500 font-mono uppercase font-black">Curriculum responses ({th.replies.length}):</p>
                          {th.replies.map((rep) => (
                            <div key={rep.id} className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-850/50 text-xs">
                              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                                <div className="flex items-center space-x-1.5">
                                  <img src={rep.authorAvatar} className="w-5 h-5 rounded-full" />
                                  <span className="font-semibold text-gray-300">{rep.authorName}</span>
                                  <span className="text-[9px] text-purple-300 capitalize font-mono bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-900/20">{rep.authorRole}</span>
                                </div>
                                <span className="font-mono text-[9px] text-gray-500">{new Date(rep.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-300 leading-relaxed font-sans">{rep.body}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply field form */}
                      <div className="flex gap-2 pt-2 border-t border-gray-850">
                        <input 
                          type="text" 
                          value={newReplyText[th.id] || ''}
                          onChange={(e) => setNewReplyText(prev => ({ ...prev, [th.id]: e.target.value }))}
                          placeholder="Type response code or tips..."
                          className="flex-1 bg-gray-900 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        />
                        <button 
                          onClick={() => handleAddThreadReply(th.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                        >
                          Send reply
                        </button>
                      </div>

                    </div>
                  ))
                )}

              </div>

            </div>

          </div>
        )}

        {/* VIEW: ENHANCED STUDENT PORTAL (Netflix + Duolingo + Coursera) */}
        {activeTab === 'student-portal' && (
          <StudentPortal
            currentUser={currentUser}
            language={language}
            courses={courses}
            enrollments={enrollments}
            notes={notes}
            discussions={discussions}
            onEnroll={(courseId) => {
              const crs = courses.find(c => c.id === courseId);
              if (crs) handleStartFreeTrial(crs);
            }}
            onUpdateProgress={async (courseId, moduleId, progress) => {
              await handleCompleteModule(moduleId);
            }}
            onVerifyCertificate={handleVerifyCertificateLink}
            onAddDiscussion={async (title, body) => {
              try {
                const res = await fetch('/api/discussions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    courseId: selectedCourse ? selectedCourse.id : null,
                    title,
                    body,
                    authorId: currentUser.id,
                    authorName: currentUser.name,
                    authorRole: currentUser.role
                  })
                });
                const created = await res.json();
                setDiscussions(prev => [created, ...prev]);
              } catch (err) {
                console.error(err);
              }
            }}
            onAddNote={async (courseId, moduleId, seconds, text) => {
              try {
                const response = await fetch('/api/notes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: currentUser.id,
                    courseId,
                    moduleId,
                    videoTimeSeconds: seconds,
                    text
                  })
                });
                const newNote = await response.json();
                setNotes(prev => [...prev, newNote]);
              } catch (err) {
                console.error(err);
              }
            }}
            onAddNotification={(notif) => {
              const newNotif: Notification = {
                id: `notif-${Date.now()}`,
                userId: currentUser.id,
                title: notif.title,
                text: notif.text,
                type: "info",
                read: false,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [newNotif, ...prev]);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 5: GURU PORTAL (INSTRUCTOR) */}
        {activeTab === 'instructor-panel' && currentUser.role === 'instructor' && (
          <GuruPortal
            currentUser={currentUser}
            language={language}
            courses={courses}
            discussions={discussions}
            enrollments={enrollments}
            onAddCourse={async (courseData) => {
              try {
                const response = await fetch('/api/courses', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(courseData)
                });
                if (response.ok) {
                  await fetchInitialData();
                }
              } catch (err) {
                console.error(err);
              }
            }}
            onUpdateCourseStatus={async (courseId, status) => {
              try {
                const response = await fetch(`/api/courses/${courseId}/status`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status })
                });
                if (response.ok) {
                  await fetchInitialData();
                }
              } catch (err) {
                console.error(err);
              }
            }}
            onAddDiscussionReply={async (threadId, replyText) => {
              try {
                const res = await fetch(`/api/discussions/${threadId}/replies`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    authorId: currentUser.id,
                    authorName: currentUser.name,
                    authorRole: currentUser.role,
                    body: replyText
                  })
                });
                const updatedThread = await res.json();
                setDiscussions(prev => prev.map(d => d.id === threadId ? updatedThread : d));
              } catch (err) {
                console.error(err);
              }
            }}
            onAddNotification={(notif) => {
              const newNotif: Notification = {
                id: `notif-${Date.now()}`,
                userId: currentUser.id,
                title: notif.title,
                text: notif.text,
                type: "info",
                read: false,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [newNotif, ...prev]);
            }}
          />
        )}

        {/* VIEW 6: ADMIN PLATFORM PANEL */}
        {activeTab === 'admin-panel' && (currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
          <div className="w-full" id="admin-moderation-hud">
            <AdminPanel 
              courses={courses} 
              setCourses={setCourses} 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser} 
              onClose={() => setActiveTab('home')}
            />
          </div>
        )}

        {/* VIEW 7: MY PROFILE & DEREGISTER SPEC */}
        {activeTab === 'profile' && (
          <div className="space-y-8" id="profile-registry">
            
            <div className="border-b border-gray-800/60 pb-5">
              <h3 className="text-xl sm:text-2xl font-black text-white">Registry Credentials & Profile</h3>
              <p className="text-xs text-gray-500 font-mono tracking-widest mt-1 uppercase font-bold">Secure certificate verifications desk</p>
            </div>

            <div className="bg-[#111625] border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-20 h-20 rounded-full border-2 border-indigo-500"
              />
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-lg font-bold text-gray-200">{currentUser.name}</h4>
                <p className="text-xs text-gray-500 font-mono">{currentUser.email}</p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-900/40 uppercase font-extrabold">{currentUser.role} Account</span>
                  <span className="text-[10px] text-gray-400 font-mono bg-gray-900 px-2.5 py-1 rounded-full border border-gray-800">Joined 2026</span>
                </div>
              </div>
            </div>

            {/* Refer & Earn section in Profile Registry */}
            <div className="bg-[#120703]/80 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
              <ThreeCelestialCanvas color="#f59e0b" particleCount={60} className="absolute inset-0 opacity-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-400 uppercase tracking-widest font-mono">REFERRAL PORTAL LIVE</span>
                  </div>
                  <h4 className="text-lg font-black text-white font-serif uppercase tracking-wide">Vedic Refer & Siddhi Credits</h4>
                  <p className="text-xs leading-relaxed max-w-xl text-gray-400 font-serif">
                    Invite other scholars and seekers into Sanatan Gurukul. Earn <span className="text-amber-400 font-semibold font-serif">10% Cash rewards</span> or <span className="text-orange-400 font-semibold font-serif">15% in celestial Siddhi credits</span> towards your courses & certification path!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('certification-ladder')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/15 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shrink-0"
                >
                  Invite Seekers
                </button>
              </div>
            </div>

            {/* List Certificates */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">Earned Credentials & Certifications</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentUser.certificates.length === 0 ? (
                  <p className="text-xs text-gray-500 italic col-span-full py-6 text-center">No certificates earned yet. Achieve 100% video progress in any active syllabus course.</p>
                ) : (
                  currentUser.certificates.map(cert => (
                    <div 
                      key={cert.id} 
                      className="bg-[#111625] border border-gray-800 rounded-2xl p-5 flex items-center justify-between gap-4 font-sans hover:border-gray-700 cursor-pointer"
                      onClick={() => handleVerifyCertificateLink(cert.id)}
                    >
                      <div className="flex items-center space-x-3 shrink overflow-hidden">
                        <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-500">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="font-bold text-gray-200 text-xs truncate">{cert.courseTitle}</h5>
                          <span className="text-[9px] text-gray-500 font-mono block mt-1">ID: {cert.id} • Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 rounded-lg text-[10px] font-mono shrink-0 cursor-pointer flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-indigo-400 mr-0.5" />
                        <span>View</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 8: CERTIFICATE DETAILED VERIFICATION HUB */}
        {activeTab === 'verification' && activeVerificationCert && (
          <div className="space-y-8" id="verification-hub">
            <div className="border-b border-gray-800/60 pb-5">
              <h3 className="text-xl sm:text-2xl font-black text-white">Registry Verification Ledger</h3>
              <p className="text-xs text-gray-500 font-mono tracking-widest mt-1 uppercase font-bold">Public secure cryptographic verification audits</p>
            </div>

            <CertificateView certificate={activeVerificationCert} />
          </div>
        )}


        {/* VIEW 9: SPECIAL Socrates-AI CAREER CONCIERGE HUB */}
        {activeTab === 'ai-concierge' && (
          currentUser.role === 'student' && enrollments.length === 0 ? (
            <div className="text-center py-20 bg-[#0c0604] rounded-3xl border border-orange-500/15 max-w-2xl mx-auto my-12 p-8 shadow-xl animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-gradient-to-tr from-orange-600/20 to-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)] text-2xl font-serif">
                🔒
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-100 uppercase tracking-wider mb-2">Sankalp AI Guru Portal Locked</h3>
              <p className="text-sm text-gray-400 font-serif leading-relaxed max-w-md mx-auto mb-8">
                Embark on your sacred learning path to unlock our conversational AI Guru. Please register or purchase at least one course from our curriculum catalog to gain access to personalized guidance, chanting feedback, and deep astrological query simulations.
              </p>
              <button 
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow shadow-orange-600/20 cursor-pointer"
              >
                Browse Our Sacred Courses
              </button>
            </div>
          ) : (
            <div className="space-y-8" id="ai-concierge-hub">
            
            <div className="border-b border-gray-800/60 pb-5">
              <h3 className="text-xl sm:text-2xl font-black text-white">Socrates AI Career Concierge Hub</h3>
              <p className="text-xs text-gray-500 font-mono tracking-widest mt-1 uppercase font-bold">Structured learning blueprints & milestone triggers</p>
            </div>

            {/* Structured recommend pathways form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form elements left */}
              <div className="bg-[#111625] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4 h-fit font-sans">
                <div className="flex items-center space-x-2.5 mb-2">
                  <Compass className="w-5 h-5 text-indigo-400 shrink-0" />
                  <h4 className="font-bold text-gray-200 text-sm">Target Skill & Goals Planner</h4>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono mb-1">Your Present Skills Set</label>
                  <input 
                    type="text" 
                    value={aiCareerSkills}
                    onChange={(e) => setAiCareerSkills(e.target.value)}
                    placeholder="e.g. HTML, CSS, Basic JavaScript, Python"
                    className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono mb-1">Desired Job Role or Goal</label>
                  <input 
                    type="text" 
                    value={aiCareerGoals}
                    onChange={(e) => setAiCareerGoals(e.target.value)}
                    placeholder="e.g. Lead Generative AI Developer"
                    className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <button 
                  onClick={handleRequestCareerPath}
                  disabled={aiCareerLoading || !aiCareerSkills.trim() || !aiCareerGoals.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wider transition-all disabled:opacity-40 cursor-pointer text-center"
                >
                  {aiCareerLoading ? 'Consulting occupational models...' : 'Synthesize Custom Career Blueprint'}
                </button>
              </div>

              {/* Response pathway right */}
              <div className="lg:col-span-2 space-y-6">
                {aiCareerLoading ? (
                  <div className="p-12 text-center bg-[#111625]/60 border border-gray-800 rounded-2xl">
                    <Brain className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
                    <p className="text-xs text-gray-400 italic">Formulating logical career milestones based on available study tracks...</p>
                  </div>
                ) : aiCareerResult ? (
                  <div className="bg-[#111625] border-2 border-indigo-900/30 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in" id="ai-pathway-result">
                    <div>
                      <span className="text-[9px] text-indigo-400 bg-indigo-950/60 border border-indigo-900/50 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">Dynamic Career Pathway</span>
                      <h4 className="text-lg sm:text-2xl font-black text-gray-100 mt-2">{aiCareerResult.careerPathTitle}</h4>
                      <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed bg-gray-950/40 p-4 rounded-xl border border-gray-850 font-sans">{aiCareerResult.rationalExplanation}</p>
                    </div>

                    <div className="space-y-3 font-sans">
                      <h5 className="text-xs uppercase text-indigo-400 font-mono tracking-wider font-bold">Suggested Education Milestones</h5>
                      {aiCareerResult.milestones.map((ms: string, idx: number) => (
                        <div key={idx} className="bg-gray-900/60 p-3 rounded-xl border border-gray-850 text-xs flex items-center space-x-3 text-gray-300">
                          <span className="w-5 h-5 bg-indigo-600/10 text-indigo-300 border border-indigo-900/40 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shrink-0">{idx + 1}</span>
                          <span>{ms}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick navigation to suggested courses */}
                    <div className="pt-4 border-t border-gray-850">
                      <h5 className="text-xs uppercase text-indigo-400 font-mono tracking-wider font-bold mb-3">Enrolling Suggested tracks:</h5>
                      <div className="flex flex-wrap gap-2">
                        {aiCareerResult.recommendedCourseIds.map((cId: string) => {
                          const matchingCourse = courses.find(c => c.id === cId);
                          if (!matchingCourse) return null;
                          return (
                            <button
                              key={cId}
                              onClick={() => { setSelectedCourse(matchingCourse); setActiveTab('active-learning'); }}
                              className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white transition cursor-pointer flex items-center space-x-1"
                            >
                              <span>{matchingCourse.title.slice(0, 32)}...</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-12 text-center bg-gray-905 border border-gray-805 rounded-2xl font-sans">
                    <Compass className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                    <p className="text-xs text-gray-500 italic uppercase">Describe your present skills and primary targets to output logical learning blueprinted paths.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
          )
        )}

      </main>

      {/* VIEW MODAL: SLIDING CART / SPIRITUAL BASKET */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end" id="cart-overlay">
          <div className="bg-[#0b0604] border-l border-orange-500/20 max-w-md w-full h-full flex flex-col justify-between shadow-2xl p-6 relative animate-in slide-in-from-right duration-350 select-none">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base sm:text-lg font-bold font-serif text-gray-200 uppercase tracking-widest">Spiritual Basket</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-orange-950/20 text-orange-400 hover:text-orange-300 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items list */}
              {cart.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <ShoppingBag className="w-12 h-12 text-orange-500/30 mx-auto mb-4" />
                  <p className="text-xs text-gray-500 font-serif italic">Your spiritual basket is currently empty.</p>
                  <button
                    onClick={() => { setIsCartOpen(false); setActiveTab('explore'); }}
                    className="mt-4 px-4 py-2 bg-[#120703] border border-orange-500/30 text-orange-400 hover:bg-orange-950/10 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Start Browsing Courses
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#120703] border border-orange-500/10 rounded-xl p-3 flex items-center justify-between gap-3 relative group">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-orange-500/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-serif font-bold text-gray-200 truncate uppercase mt-0.5">{item.title}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">₹{item.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCart(prev => prev.filter(c => c.id !== item.id))}
                        className="p-1.5 bg-[#0a0502] hover:bg-red-950/30 text-gray-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom calculation & checkout */}
            {cart.length > 0 && (
              <div className="border-t border-orange-500/10 pt-4 space-y-4 font-sans text-xs">
                <div className="space-y-2 bg-gray-950/60 p-4 rounded-xl border border-orange-500/5">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Courses Subtotal</span>
                    <span className="font-semibold text-gray-200">₹{cart.reduce((sum, i) => sum + i.price, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>GST & Processing Fee</span>
                    <span className="text-emerald-400 font-semibold">₹0 (Sandbox waiver)</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-200 border-t border-orange-500/10 pt-2 font-bold text-sm">
                    <span>Total Exchange Dakshina</span>
                    <span className="text-[#f97316]">₹{cart.reduce((sum, i) => sum + i.price, 0)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCart([])}
                    className="py-2.5 bg-gray-900 border border-transparent hover:border-orange-500/20 text-gray-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer text-center"
                  >
                    Clear Basket
                  </button>
                  <button
                    onClick={() => {
                      const totalC = cart.reduce((sum, i) => sum + i.price, 0);
                      handleTriggerCheckout({
                        id: 'basket-aggregate',
                        title: `Spiritual Basket (${cart.length} Courses)`,
                        price: totalC,
                        originalPrice: totalC * 3,
                        description: `Bundle order for courses: ${cart.map(c => c.title).join(', ')}`,
                        thumbnail: cart[0]?.thumbnail || '',
                        category: 'Bundle Package',
                        difficulty: 'Beginner',
                        rating: 5,
                        reviewsCount: 1,
                        instructorId: 'inst-multiple',
                        instructorName: 'Gurukul Faculty',
                        chapters: [],
                        highlights: [],
                        studentsCount: 1,
                        status: 'approved',
                        createdAt: ''
                      });
                      setIsCartOpen(false);
                    }}
                    className="py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl text-xs font-serif font-bold tracking-wider uppercase shadow shadow-orange-600/15 cursor-pointer text-center"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* VIEW MODAL: CHANNELS CHECKOUT MODAL SIMULATOR */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" id="checkout-drawer">
          <div className="bg-[#0b0604] border border-orange-500/25 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-5 relative font-serif select-none">
            
            <h3 className="text-base sm:text-lg font-bold text-[#f97316] mb-0.5 uppercase tracking-wider">Gurukul Checkout Simulator</h3>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-sans">
              Complete securing tuition for <span className="text-gray-200 font-semibold font-serif">"{checkoutCourse.title}"</span>. Sandbox gateway integrates simulated Razorpay / Stripe instantly.
            </p>

            {/* Coupon Code Input */}
            <div className="mb-4 font-sans text-xs text-left">
              <label className="block text-[10px] uppercase text-gray-400 mb-1 font-semibold">Have a coupon code?</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  placeholder="e.g. SANATAN10"
                  className="flex-1 bg-gray-950 border border-orange-500/15 p-2 rounded-lg text-xs text-gray-250 focus:outline-none focus:border-orange-500/35 uppercase placeholder-gray-700 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (couponCodeInput.trim().toUpperCase() === 'SANATAN10') {
                      setAppliedCoupon('SANATAN10');
                      setCheckoutDiscount(Math.round(checkoutCourse.price * 0.10));
                    } else {
                      alert('Invalid Coupon Code');
                    }
                  }}
                  className="px-3 py-2 bg-orange-950/40 text-orange-400 hover:text-orange-300 rounded-lg border border-orange-500/20 font-bold transition-all text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center space-x-1">
                  <span>✓ Coupon "{appliedCoupon}" successfully applied!</span>
                </div>
              )}
            </div>

            {/* Calculations Box */}
            <div className="space-y-2.5 font-sans text-xs bg-gray-950/80 p-3 rounded-lg border border-orange-500/5 mb-4 text-left">
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>Tuition Base Dakshina</span>
                <span className="font-semibold text-gray-200">₹{checkoutCourse.price}</span>
              </div>
              {checkoutDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 text-[11px]">
                  <span>Discount Coupon (10%)</span>
                  <span className="font-semibold">-₹{checkoutDiscount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>GST (18% Goods & Services Tax)</span>
                <span className="font-semibold text-gray-200">₹{Math.round((checkoutCourse.price - checkoutDiscount) * 0.18)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-200 border-t border-orange-500/10 pt-2 font-semibold text-xs font-serif">
                <span className="uppercase text-orange-400">Total Exchange Amount</span>
                <span className="text-[#f97316]">
                  ₹{Math.round(checkoutCourse.price - checkoutDiscount + (checkoutCourse.price - checkoutDiscount) * 0.18)}
                </span>
              </div>
            </div>

            {/* Simulated Payment Modes Tab Bar */}
            <div className="grid grid-cols-2 gap-1.5 mb-4 font-sans text-xs">
              <button
                type="button"
                onClick={() => { setCheckoutMode('upi'); setQrGenerated(false); }}
                className={`py-2 rounded-lg border font-semibold transition-all ${
                  checkoutMode === 'upi' 
                    ? 'bg-orange-950/30 border-orange-500/35 text-orange-400' 
                    : 'bg-gray-950 border-transparent text-gray-400 hover:text-white'
                } cursor-pointer`}
              >
                📱 UPI Apps / GPay QD
              </button>
              <button
                type="button"
                onClick={() => setCheckoutMode('card')}
                className={`py-2 rounded-lg border font-semibold transition-all ${
                  checkoutMode === 'card' 
                    ? 'bg-orange-950/30 border-orange-500/35 text-orange-400' 
                    : 'bg-gray-950 border-transparent text-gray-400 hover:text-white'
                } cursor-pointer`}
              >
                💳 Credit / Debit Card
              </button>
            </div>

            {/* Dynamic Checkout Form Inputs */}
            {checkoutMode === 'upi' ? (
              <div className="space-y-3 font-sans mb-5 bg-[#0e0705] border border-orange-500/10 p-3 rounded-xl">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1 font-semibold">Enter your UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. ashif@okhdfcbank"
                    className="w-full bg-gray-950 border border-orange-500/10 p-2.5 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-orange-500/30 placeholder-gray-700"
                  />
                </div>
                
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-x-0 h-px bg-orange-500/10 top-1/2"></div>
                  <span className="relative bg-[#0e0705] px-3 text-[9px] uppercase text-gray-500 font-mono">OR SCAN INSTANT QR</span>
                </div>

                {qrGenerated ? (
                  <div className="flex flex-col items-center bg-[#180d0a] border border-orange-500/15 p-3 rounded-lg text-center space-y-2 animate-in zoom-in-95">
                    <div className="w-32 h-32 bg-white p-2.5 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 bg-white">
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-black rounded-sm"></div>
                        <div className="bg-black rounded-sm"></div>
                      </div>
                      <div className="absolute w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-[9px] text-white font-serif font-bold">
                        ॐ
                      </div>
                    </div>
                    <span className="text-[10px] text-orange-400 font-serif">Interactive Live Paytm / GPay QR</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQrGenerated(true);
                      // Trigger dynamic sandboxed tone
                    }}
                    className="w-full py-2 bg-[#120703] border border-orange-500/25 hover:border-orange-500/45 text-orange-400 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Generate Dynamic Paytm / PhonePe QR
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 font-sans mb-5 bg-[#0e0705] border border-orange-500/10 p-3 rounded-xl text-xs text-left">
                <div>
                  <label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Ashif Ansari"
                    className="w-full bg-gray-950 border border-orange-500/10 p-2.5 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-orange-500/30 placeholder-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-gray-950 border border-orange-500/10 p-2.5 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-orange-500/30 placeholder-gray-700 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Expiry Date</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-gray-950 border border-orange-505/10 p-2.5 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-orange-500/35 placeholder-gray-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 mb-1 font-semibold">Security CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="***"
                      className="w-full bg-gray-950 border border-orange-505/10 p-2.5 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-orange-500/35 placeholder-gray-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2.5 font-sans">
              <button
                onClick={() => { setCheckoutCourse(null); setAppliedCoupon(''); setCheckoutDiscount(0); setCouponCodeInput(''); }}
                disabled={paymentProcessing}
                className="flex-1 py-3 bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white rounded-xl border border-transparent hover:border-orange-500/10 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (checkoutCourse.id === 'basket-aggregate') {
                    // Aggregate multiple cart buys
                    setPaymentProcessing(true);
                    try {
                      for (const item of cart) {
                        await fetch('/api/payment/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userId: currentUser.id,
                            courseId: item.id,
                            paymentGateway: paymentGateway
                          })
                        });
                      }
                      setCart([]);
                      setCheckoutCourse(null);
                      setActiveTab('my-courses');
                      await fetchInitialData();
                    } catch (err) {
                      console.warn("Aggregate purchase failed", err);
                    } finally {
                      setPaymentProcessing(false);
                    }
                  } else {
                    // Standard single purchase
                    await handleProcessSimulatedPayment();
                  }
                }}
                disabled={paymentProcessing}
                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider shadow-lg shadow-orange-600/10 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {paymentProcessing ? 'Initiating Recital Transfer...' : 'Complete Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY MODULE 1: INTERACTIVE VIRTUAL SATSANG STREAM CLASSROOM */}
      {classSatsangOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#07090e] border border-orange-550/20 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-[80vh] md:h-[75vh]" id="live-satsang-modal">
            
            {/* Header bar representing connection telemetry */}
            <div className="bg-[#0c0e17] border-b border-gray-805/80 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 font-black">🔴 Gurukul Live Broadcasting Room</span>
                </div>
                <h3 className="text-sm sm:text-base font-serif font-black text-white mt-1">
                  Satsang: {selectedCourse.title} 
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Guru-Shishya direct transmission: {selectedTeacher}</p>
              </div>

              <button 
                onClick={() => setClassSatsangOpen(false)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white rounded-xl text-xs font-mono border border-gray-800 transition cursor-pointer"
              >
                Leave Room (x)
              </button>
            </div>

            {/* Split Screen live stream */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
              
              {/* Left Column: Traditional Streaming feed with Audio Frequency graph (2/3 width) */}
              <div className="md:col-span-2 bg-black p-6 flex flex-col justify-between overflow-y-auto border-r border-gray-900">
                
                {/* Streaming view details */}
                <div className="flex items-center justify-between text-xs text-gray-450 border-b border-gray-900 pb-3 mb-4">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-emerald-400">● 1080p stream</span>
                    <span className="text-gray-600">|</span>
                    <span>128kbps Vedic audio</span>
                  </div>
                  <span className="bg-[#120703] border border-orange-500/20 px-2.5 py-0.5 rounded text-orange-400 font-serif font-bold">Acharyavidya Session</span>
                </div>

                {/* Animated video frame */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-orange-600/10 border-2 border-orange-500/40 flex items-center justify-center animate-pulse text-orange-400">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 fill-orange-500" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 013.364 1.706" />
                      </svg>
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full border border-orange-400/20 scale-125 animate-ping"></div>
                  </div>

                  <h4 className="text-base font-serif font-black text-[#faf8f5]">{selectedTeacher} Chants Active</h4>
                  <p className="text-xs text-gray-400 max-w-sm mt-1 mb-8 leading-relaxed font-sans">
                    Traditional exegesis recitals are flowing live. Close your eyes, sit straight, and follow pronunciation parameters.
                  </p>

                  {/* SCRIPTURAL TRANSCRIPT DISPLAY BLOCK */}
                  <div className="w-full max-w-md bg-[#100702] border border-orange-500/10 rounded-2xl p-4 text-center">
                    <span className="text-[8px] uppercase tracking-widest font-mono text-orange-500 font-bold block mb-1">Active Lineage Verse Display</span>
                    <p className="text-sm font-serif italic text-orange-200 mt-1">"ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ।"</p>
                    <p className="text-[10px] text-gray-500 font-sans mt-1.5 leading-normal">"From untruth lead me to truth. From darkness lead me to light."</p>
                  </div>

                  {/* Dynamic wave visualizer simulator */}
                  <div className="flex justify-center items-end space-x-1 mt-8 h-10 w-full max-w-xs px-4" id="audio-visualizer-wave">
                    {[16, 28, 38, 20, 32, 14, 40, 24, 34, 18, 30, 10, 26, 36, 12, 22].map((h, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${h}%` }}
                        className="bg-orange-600/70 w-1 rounded-sm animate-pulse"
                      ></div>
                    ))}
                  </div>

                </div>

                <div className="text-[9px] text-gray-500 text-center font-mono uppercase tracking-widest pt-3 border-t border-gray-950">
                  © SANATAN GURUKUL SECURITY ENCRYPTED SANGHA CONDUIT. NO RECORDINGS PERMITTED.
                </div>

              </div>

              {/* Right Column: Live Classmate chat board (1/3 width) */}
              <div className="md:col-span-1 bg-[#090b11] flex flex-col justify-between overflow-hidden">
                
                {/* Chat title bar */}
                <div className="bg-[#0f111a] border-b border-gray-905 p-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200 font-serif">Sangha Active Chat</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                    {satsangComments.length + 4} Scholars Online
                  </span>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5" id="satsang-scroll-container">
                  {satsangComments.map((sc) => (
                    <div key={sc.id} className="bg-gray-950/40 p-3 rounded-xl border border-gray-900 text-[11px] space-y-1 hover:border-gray-800 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <img src={sc.avatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                          <span className="font-semibold text-gray-200">{sc.sender}</span>
                          <span className="text-[8px] bg-indigo-950/50 border border-indigo-900/30 px-1 rounded text-orange-400 font-mono scale-90">{sc.role}</span>
                        </div>
                        <span className="text-[8px] text-gray-600 font-mono">{sc.timestamp}</span>
                      </div>
                      <p className="text-gray-300 font-sans leading-relaxed">{sc.message}</p>
                    </div>
                  ))}
                </div>

                {/* Submission Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newSatsangComment.trim()) return;
                    const userMsg = {
                      id: `sc-user-${Date.now()}`,
                      sender: currentUser.name || 'Ashif Ansari',
                      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
                      role: 'Sadhaka',
                      message: newSatsangComment,
                      timestamp: 'Just now'
                    };
                    setSatsangComments(prev => [...prev, userMsg]);
                    setNewSatsangComment('');

                    // Simulate immediate feedback from Guru
                    setTimeout(() => {
                      setSatsangComments(prev => [
                        ...prev,
                        {
                          id: `sc-resp-${Date.now()}`,
                          sender: selectedTeacher,
                          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
                          role: 'Spiritual Guide',
                          message: `Hari Om, Ashif and Sangha scholars. Your attention to these vowel durations is highly outstanding. Let us recite the fourth stanza together, noting the deep pronunciation rules.`,
                          timestamp: 'Just now'
                        }
                      ]);
                    }, 4000);
                  }}
                  className="bg-[#0f111a] border-t border-gray-905 p-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={newSatsangComment}
                    onChange={(e) => setNewSatsangComment(e.target.value)}
                    placeholder="Ask classmates or pose insights..."
                    className="flex-1 bg-gray-950 border border-gray-850 p-2.5 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-serif font-black px-4 cursor-pointer transition"
                  >
                    Send
                  </button>
                </form>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* OVERLAY MODULE 2: MILLED WOOD-PARCHMENT ANCIENT SCRIPTURES SCROLL COMPILER */}
      {isWisdomCompendiumOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18110b] border-2 border-amber-700/60 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]" id="wisdom-scroll-cabinet">
            
            {/* Scroll golden roller handles header */}
            <div className="bg-[#0f0a07] border-b border-amber-800/40 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📜</span>
                <div>
                  <span className="text-[9px] tracking-widest font-mono text-amber-500 font-bold uppercase block">Sanatan Sastra Scroll Archives</span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-amber-100">{selectedCourse.title} Wisdom Compendium</h3>
                </div>
              </div>
              
              <button
                onClick={() => setIsWisdomCompendiumOpen(false)}
                className="px-4 py-2 bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 hover:text-amber-200 rounded-xl text-xs font-serif font-bold border border-amber-800/30 transition cursor-pointer"
              >
                Close Scroll (x)
              </button>
            </div>

            {/* Scroll Parchment Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#1e150e] relative text-[#f2e7dc] leading-relaxed font-serif" id="parchment-sheet">
              {/* Subtle gold watermark pattern background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] fill-amber-500">
                  <path d="M50 0 C60 10, 80 15, 90 30 C100 45, 95 65, 80 80 C65 95, 45 100, 30 90 C15 80, 0 65, 10 45 C20 25, 40 10, 50 0 Z" />
                </svg>
              </div>

              {/* Actual Scroll text */}
              <div className="relative font-serif text-sm sm:text-base space-y-6 max-w-2xl mx-auto break-words whitespace-pre-line leading-relaxed z-10 select-text">
                <div className="text-center border-b border-amber-900/40 pb-6 mb-8 mt-4">
                  <span className="text-lg sm:text-xl font-bold uppercase tracking-wider text-amber-400 block font-serif">विद्या परं दैवतम्</span>
                  <p className="text-[11px] text-amber-500/70 font-sans tracking-widest mt-1.5 uppercase font-medium">Wisdom is the Supreme Deity of the Soul</p>
                </div>

                {compiledWisdomScroll}

                <div className="text-center pt-8 border-t border-amber-900/30 mt-8 text-xs text-amber-600 font-sans">
                  Compiled for Student Ashif Ansari | Sanatan Academy Swadhyaya Initiative
                </div>
              </div>

            </div>

            {/* Print or Close scroll control bar */}
            <div className="bg-[#0f0a07] border-t border-amber-800/40 p-4 flex gap-3 font-serif">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-950/40 cursor-pointer text-center"
              >
                🖨️ Export / Print Sacred Scroll
              </button>
              <button
                onClick={() => setIsWisdomCompendiumOpen(false)}
                className="flex-1 py-3 bg-[#130f0c] hover:bg-[#1a1511] text-amber-400/80 hover:text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider border border-amber-800/20 cursor-pointer text-center"
              >
                Return to Gurukul Shala
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-[#040201] border-t border-orange-500/10 py-8 px-4 text-center text-xs text-orange-400/60 tracking-widest font-serif uppercase mt-12 shrink-0">
        <p>© 2026 Sanatan Gurukul Academy. All lineage paths respected.</p>
        <p className="mt-1.5 text-[9px] text-[#f97316]/50 font-serif lowercase tracking-wider">ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ।</p>
      </footer>

      {/* Floating System Operations Console (Only visible in Admin Panel) */}
      {activeTab === 'admin-panel' && (currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
        <SystemOpsConsole />
      )}

    </div>
  );
}
