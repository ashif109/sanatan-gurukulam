import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Sparkles, User, Award, Shield, LogOut, Play, Pause, Clock, ChevronDown, CheckCircle, Search, Filter, 
  DollarSign, TrendingUp, Users, Check, Trash2, MessageSquare, Heart, Share2, Camera, ArrowRight, Lock, Unlock, 
  Settings, HelpCircle, Briefcase, Calendar, Star, BookOpenCheck, Bookmark, FileText, ChevronRight, Video, 
  BadgeHelp, Compass, ListRestart, PlusCircle, AlertCircle, ShoppingBag, ShoppingCart, Eye, Trophy, MapPin, Brain, Flame, X,
  Globe, Activity, Cpu, Layers, Zap, Link2, TrendingDown, Send, RefreshCw, FileCode, Terminal, Sliders, Radio, 
  CheckSquare, Bell, Folder, Key, PieChart, BarChart3, Database, ShieldAlert, GitBranch, Download, Mail, FilterIcon, FileUp
} from 'lucide-react';
import { Course, UserProfile } from '../types';
import { microservicesData } from '../data/microservicesData';

interface AdminPanelProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose?: () => void;
}

// Custom mock interfaces for sub-sections
interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'affiliate' | 'moderator' | 'admin' | 'super_admin' | 'org_manager' | 'corp_manager';
  status: 'active' | 'suspended' | 'banned';
  created: string;
  purchases: number;
  progress: number;
}

interface ManagedInstructor {
  id: string;
  name: string;
  email: string;
  isKycVerified: boolean;
  score: number;
  totalEarnings: number;
  rating: number;
  contractSigned: boolean;
}

interface SupportTicket {
  id: string;
  user: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'pending' | 'resolved';
  created: string;
}

export default function AdminPanel({ courses, setCourses, currentUser, setCurrentUser, onClose }: AdminPanelProps) {
  // Navigation State
  const [activeAdminTab, setActiveAdminTab] = useState<string>('executive-dashboard');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('auth');
  
  // Searching & Filter Controls
  const [globalSearchSearch, setGlobalSearchSearch] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  // Real-Time System Metrics Toggles
  const [globalKillSwitch, setGlobalKillSwitch] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  // Search state for users
  const [userQuery, setUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  
  // CRUD state for users
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([
    { id: 'usr-1', name: 'Ashif Ansari', email: 'ashifansari04704@gmail.com', role: 'student', status: 'active', created: '2026-01-15', purchases: 3, progress: 85 },
    { id: 'usr-2', name: 'Rohan Mishra', email: 'rohan.mishra@gurukul.edu', role: 'student', status: 'active', created: '2026-02-10', purchases: 1, progress: 42 },
    { id: 'usr-3', name: 'Sarasvati Devi', email: 'sarasvati@vanguard.com', role: 'instructor', status: 'active', created: '2025-11-01', purchases: 0, progress: 100 },
    { id: 'usr-4', name: 'Vikram Shekhawat', email: 'v.shekhawat@affiliate.net', role: 'affiliate', status: 'active', created: '2026-03-01', purchases: 0, progress: 0 },
    { id: 'usr-5', name: 'Aditya Swamy', email: 'aswamy@corporate.org', role: 'org_manager', status: 'active', created: '2026-04-12', purchases: 12, progress: 75 },
    { id: 'usr-6', name: 'Kunal Kapoor', email: 'kunal@spammail.com', role: 'student', status: 'suspended', created: '2026-05-18', purchases: 0, progress: 5 }
  ]);
  
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<ManagedUser['role']>('student');
  
  // Instructors states
  const [managedInstructors, setManagedInstructors] = useState<ManagedInstructor[]>([
    { id: 'inst-1', name: 'Acharya Shankaran', email: 'shankaran@gurukul.edu', isKycVerified: true, score: 98, totalEarnings: 145000, rating: 4.9, contractSigned: true },
    { id: 'inst-2', name: 'Shiva Kumar Swamy', email: 'shiva.swamy@vedas.org', isKycVerified: true, score: 92, totalEarnings: 82000, rating: 4.7, contractSigned: true },
    { id: 'inst-3', name: 'Dr. Vasudevan', email: 'vasu@sanskrituniv.edu', isKycVerified: false, score: 75, totalEarnings: 12000, rating: 4.2, contractSigned: false }
  ]);
  
  // Interactive Syllabus Build State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Vedic Astrology');
  const [newCoursePrice, setNewCoursePrice] = useState(4999);
  const [newCourseDiff, setNewCourseDiff] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  
  // Live classes system
  const [liveSessions, setLiveSessions] = useState([
    { id: 'live-1', topic: 'Rigveda Samhita Deep Sandhi Rules', host: 'Acharya Shankaran', time: 'Today, 06:00 PM', duration: '90 mins', attendees: 142, status: 'scheduled' },
    { id: 'live-2', topic: 'Advanced Ashtakavarga Chart Calculation', host: 'Swami Sadananda', time: 'Tomorrow, 10:00 AM', duration: '120 mins', attendees: 84, status: 'scheduled' }
  ]);
  const [showCreateLiveModal, setShowCreateLiveModal] = useState(false);
  const [liveTopic, setLiveTopic] = useState('');
  const [liveHost, setLiveHost] = useState('');
  const [liveTime, setLiveTime] = useState('');
  
  // Exam system
  const [exams, setExams] = useState([
    { id: 'ex-1', title: 'Kundli House Analysis Proficiency', totalQuestions: 30, window: '24 Hours', proctoring: true, completions: 423 },
    { id: 'ex-2', title: 'Sanskrit Grammar & Verb Sandbox', totalQuestions: 50, window: '48 Hours', proctoring: false, completions: 189 }
  ]);
  const [proctorDiagnostics, setProctorDiagnostics] = useState([
    { id: 'diag-1', student: 'Amit Sharma', exam: 'Kundli House Analysis', event: 'Tab Switch Detected (Chrome)', severity: 'medium', time: '3 mins ago' },
    { id: 'diag-2', student: 'Priva Patel', exam: 'Kundli House Analysis', event: 'Face Occlusion Detected (Webcam)', severity: 'high', time: '12 mins ago' }
  ]);
  
  // Certifications
  const [certTemplates, setCertTemplates] = useState([
    { id: 'temp-1', name: 'Classical Golden Lineage Border', size: 'A4', orientation: 'Landscape', verifiedOnChain: true },
    { id: 'temp-2', name: 'Sadhana Ashrama Classic Minimalist', size: 'US Letter', orientation: 'Landscape', verifiedOnChain: true }
  ]);
  const [issuedChainCount, setIssuedChainCount] = useState(148);
  
  // Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'tk-101', user: 'Maithili Sharma', subject: 'Stripe Payment Gateway failure on course purchase', priority: 'high', status: 'open', created: '2026-06-23T01:22:00Z' },
    { id: 'tk-102', user: 'Govind Rao', subject: 'Vedic Chant Lecture 3 has sound echo in left channel', priority: 'medium', status: 'pending', created: '2026-06-22T14:15:00Z' },
    { id: 'tk-103', user: 'Dr. Subramanian', subject: 'Corporate Manager portal unable to export team reports', priority: 'critical', status: 'open', created: '2026-06-23T02:50:00Z' }
  ]);
  const [ticketReplyText, setTicketReplyText] = useState<{ [id: string]: string }>({});
  
  // Marketing & Campaigns
  const [marketingCampaigns, setMarketingCampaigns] = useState([
    { id: 'm-1', name: 'Guru Purnima 2026 Early Access Pass', type: 'Email Campaign', sent: 14200, opens: '64.2%', conversion: '8.4%', status: 'sent' },
    { id: 'm-2', name: 'Ashtakavarga Masterclass Launch Alert', type: 'WhatsApp Broadcast', sent: 5020, opens: '92.1%', conversion: '12.8%', status: 'active' }
  ]);
  
  // Automation workflows
  const [workflows, setWorkflows] = useState([
    { id: 'wf-1', name: 'Guru Purnima Welcome Sequence', trigger: 'Student Enrolls', condition: 'Course Category = Vedic Astrology', action: 'Send 3-Day Email Drip & SMS' },
    { id: 'wf-2', name: 'Dropout Rescue Flow', trigger: 'Inactive 7 Days', condition: 'Progress < 60%', action: 'Issue 20% Discount Voucher via WhatsApp' }
  ]);
  const [showAddWorkflowModal, setShowAddWorkflowModal] = useState(false);
  const [wfName, setWfName] = useState('');
  const [wfTrigger, setWfTrigger] = useState('Student Enrolls');
  const [wfAction, setWfAction] = useState('Send Notification');
  
  // AI Controls
  const [aiPrompts, setAiPrompts] = useState([
    { id: 'pr-1', name: 'Vedic Exegesis Tutor Tone', model: 'gemini-2.5-pro', avgTokens: '1,420 t', active: true },
    { id: 'pr-2', name: 'Automated Code Sandbox Grading', model: 'gemini-1.5-flash', avgTokens: '450 t', active: true }
  ]);
  const [totalTokensSession, setTotalTokensSession] = useState(13429402);
  const [activeAIReviewer, setActiveAIReviewer] = useState(true);
  
  // Audit logs & System Feed
  const [systemLogs, setSystemLogs] = useState([
    { time: '03:10:02', user: 'Super Admin', action: 'Database schema synchronized verified successfully' },
    { time: '03:08:44', user: 'System Worker', action: 'Cron clean up verified 42 stalled streaming sockets' },
    { time: '02:58:12', user: 'Acharya Shankaran', action: 'Drafted module: "Sanskrit Sandhi Rules Level II"' },
    { time: '02:30:19', user: 'Gateway Agent', action: 'Disputed transaction resolved in Gurukul favor (₹4,999Ref)' }
  ]);
  
  // Command palette hotkeys trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Functions for CRUD
  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const added: ManagedUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      purchases: 0,
      progress: 0
    };
    setManagedUsers([added, ...managedUsers]);
    
    // Log action
    setSystemLogs([
      { time: new Date().toTimeString().split(' ')[0], user: currentUser.name, action: `Created custom user credentials for: ${newUserName} (${newUserRole})` },
      ...systemLogs
    ]);
    
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const handleToggleUserStatus = (userId: string, targetStatus: ManagedUser['status']) => {
    setManagedUsers(managedUsers.map(u => u.id === userId ? { ...u, status: targetStatus } : u));
    const uObj = managedUsers.find(u => u.id === userId);
    if (uObj) {
      setSystemLogs([
        { time: new Date().toTimeString().split(' ')[0], user: currentUser.name, action: `Changed profile status of ${uObj.name} to [${targetStatus.toUpperCase()}]` },
        ...systemLogs
      ]);
    }
  };

  const handleVerifyKyc = (instId: string) => {
    setManagedInstructors(managedInstructors.map(m => m.id === instId ? { ...m, isKycVerified: true } : m));
    setSystemLogs([
      { time: new Date().toTimeString().split(' ')[0], user: currentUser.name, action: `KYC Credentials verified and certified for Instructor node ${instId}` },
      ...systemLogs
    ]);
  };

  const handleAddWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName) return;
    setWorkflows([...workflows, {
      id: `wf-${Date.now()}`,
      name: wfName,
      trigger: wfTrigger,
      condition: 'Platform Global Trigger',
      action: wfAction
    }]);
    setWfName('');
    setShowAddWorkflowModal(false);
  };

  const handleAddNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;
    const addedCourse: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      description: newCourseDesc,
      category: newCourseCategory,
      difficulty: newCourseDiff,
      thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      price: newCoursePrice,
      originalPrice: newCoursePrice * 1.5,
      rating: 5.0,
      reviewsCount: 0,
      instructorId: 'inst-1',
      instructorName: 'Acharya Shankaran',
      chapters: [],
      highlights: ['Lineage direct transmission', 'Includes PDF handbook', 'Verified seal certificate'],
      studentsCount: 0,
      status: 'approved',
      createdAt: new Date().toISOString()
    };
    setCourses([addedCourse, ...courses]);
    setSystemLogs([
      { time: new Date().toTimeString().split(' ')[0], user: currentUser.name, action: `Created & verified enterprise syllabus: "${newCourseTitle}"` },
      ...systemLogs
    ]);
    setNewCourseTitle('');
    setNewCourseDesc('');
    setShowAddCourseModal(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
    setSystemLogs([
      { time: new Date().toTimeString().split(' ')[0], user: currentUser.name, action: `Pruned syllabus path ID: ${courseId}` },
      ...systemLogs
    ]);
  };

  const handleReplyTicket = (ticketId: string) => {
    const text = ticketReplyText[ticketId];
    if (!text) return;
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    setSystemLogs([
      { time: new Date().toTimeString().split(' ')[0], user: currentUser.name, action: `Resolved support ticket ID ${ticketId}. Alert trigger sent.` },
      ...systemLogs
    ]);
    setTicketReplyText({ ...ticketReplyText, [ticketId]: '' });
  };

  // Switch Active Tab and trigger logs
  const navigateToTab = (tabName: string) => {
    setActiveAdminTab(tabName);
    setCommandPaletteOpen(false);
  };

  // Quick navigation items helper
  const allNavigationTabs = [
    { id: 'executive-dashboard', category: 'Overview', label: 'Executive Cockpit', icon: BarChart3 },
    { id: 'platform-architecture', category: 'Overview', label: 'Ecosystem Architecture', icon: GitBranch },
    { id: 'user-management', category: 'Directory', label: 'User Directory', icon: Users },
    { id: 'instructor-management', category: 'Directory', label: 'Instructors Verification', icon: Award },
    { id: 'course-management', category: 'Directory', label: 'Syllabus Controller', icon: BookOpen },
    { id: 'moderation-center', category: 'Directory', label: 'Moderation Queue', icon: Shield },
    { id: 'student-progress', category: 'Classroom', label: 'Dropout & Analytics', icon: Brain },
    { id: 'live-classes', category: 'Classroom', label: 'Live Broadcasts', icon: Radio },
    { id: 'exams-system', category: 'Classroom', label: 'Adaptive Examinations', icon: BookOpenCheck },
    { id: 'certifications', category: 'Classroom', label: 'Lineage Certificates', icon: Trophy },
    { id: 'payments-management', category: 'Financial', label: 'Crypto & Gateways', icon: DollarSign },
    { id: 'subscriptions', category: 'Financial', label: 'Subscription Architect', icon: Layers },
    { id: 'community-forum', category: 'Community', label: 'Community Feed Moderation', icon: MessageSquare },
    { id: 'support-center', category: 'Community', label: 'SLA Support Desks', icon: HelpCircle },
    { id: 'ai-control', category: 'Intellect & AI', label: 'AI Prompt Engine', icon: Sparkles },
    { id: 'job-portal', category: 'Community', label: 'Corporate Job Portal', icon: Briefcase },
    { id: 'marketing-hub', category: 'Intellect & AI', label: 'Marketing Broadcasts', icon: Compass },
    { id: 'file-vault', category: 'Infrastructure', label: 'CDN CDN File Storage', icon: Folder },
    { id: 'automation-workflows', category: 'Infrastructure', label: 'Workflows & Triggers', icon: Zap },
    { id: 'system-settings', category: 'Infrastructure', label: 'Localization Controls', icon: Settings },
    { id: 'super-admin-room', category: 'Overview', label: 'Super Admin Control', icon: ShieldAlert },
  ];

  return (
    <div className="bg-[#03060d] text-gray-100 min-h-screen font-sans antialiased text-sm flex flex-col relative w-full overflow-x-hidden" id="super-admin-root-view">
      
      {/* 1. TOP HEADER STICKY BAR */}
      <header className="sticky top-0 bg-[#060b18]/80 backdrop-blur-md border-b border-orange-500/20 z-40 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse"></span>
            <span className="text-sm font-serif font-black tracking-widest text-[#D4AF37] uppercase">SANATAN OPERATING SYSTEM</span>
          </div>
          <span className="text-xs bg-amber-950/40 border border-[#D4AF37]/30 px-3 py-1 rounded text-amber-400 font-mono hidden md:inline">
            v5.4 Enterprise Ready
          </span>
        </div>

        {/* Search Input triggering command palette on click */}
        <div className="flex-1 max-w-md mx-6 relative hidden lg:block">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Command Everywhere... (Ctrl + K)" 
            readOnly
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full bg-[#0a0f21]/90 border border-gray-800 rounded-xl px-10 py-2 text-xs focus:outline-none cursor-pointer hover:border-amber-500/40 transition text-gray-400"
          />
          <span className="absolute right-3 top-2.5 font-mono text-[9px] bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-gray-400">
            Ctrl K
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* User simulation role and profile bar */}
          <div className="flex items-center space-x-3 pr-2 border-r border-gray-900">
            <div className="text-right">
              <span className="text-xs font-serif font-bold text-gray-100 block">{currentUser.name}</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-extrabold">SUPER ADMIN</span>
            </div>
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full border border-amber-500/40"
              referrerPolicy="no-referrer"
            />
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-900/60 text-gray-400 hover:text-white rounded-xl transition cursor-pointer"
            title="Leave Admin Terminal"
          >
            <X className="w-5 h-5 text-rose-400" />
          </button>
        </div>
      </header>

      {/* THREE SECTION WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SECTION A: LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-[#050914] border-r border-orange-500/10 shrink-0 hidden md:flex flex-col justify-between py-6 overflow-y-auto">
          <div className="space-y-6 px-4">
            
            {/* Category Groups */}
            {['Overview', 'Directory', 'Classroom', 'Financial', 'Community', 'Intellect & AI', 'Infrastructure'].map((catName) => (
              <div key={catName} className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-gray-600 block pl-3 mb-1.5">
                  {catName}
                </span>
                
                <div className="space-y-0.5">
                  {allNavigationTabs
                    .filter((item) => item.category === catName)
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = activeAdminTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveAdminTab(item.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left font-serif text-xs font-semibold tracking-wide transition ${
                            isActive 
                              ? 'bg-[#1b1c18] border border-[#D4AF37]/40 text-[#D4AF37]' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

          </div>

          {/* Quick Support / Version Footer */}
          <div className="px-6 pt-6 border-t border-gray-950 text-[10px] text-gray-500 font-mono">
            <div className="flex items-center space-x-2 text-rose-400 font-bold mb-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>All Microservices Active</span>
            </div>
            <p>Admin Portal Core. v5.4</p>
          </div>
        </aside>

        {/* SECTION B: CENTER MAIN WORKSPACE */}
        <main className="flex-1 bg-[#020409] p-6 lg:p-8 overflow-y-auto min-w-0" id="admin-workbench-body">
          
          {/* TAB: ECOSYSTEM ARCHITECTURE INTERACTIVE PLAYGROUND */}
          {activeAdminTab === 'platform-architecture' && (
            <div className="space-y-8 animate-fade-in" id="tab-platform-architecture">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-900 pb-5">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-extrabold">Enterprise Core Spec</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">Education Operating System Architect</h2>
                  <p className="text-xs text-gray-400">Interactive live blueprint of microservices mapping, Kafka event buses, and Postgres cluster divisions.</p>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-950 p-2 rounded-xl border border-gray-850 font-mono text-[10px]">
                  <span className="text-emerald-400 animate-pulse font-bold">● CLUSTER OK</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-400">Total Nodes: 28 Online</span>
                </div>
              </div>

              {/* INTERACTIVE HIGH-FI ENTERPRISE GRAPHICAL MAP */}
              <div className="bg-[#050b16] border border-gray-850 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-amber-500/30">System Blueprint Map</div>
                
                <div className="flex flex-col items-center space-y-4 max-w-4xl mx-auto font-mono text-xs text-center">
                  
                  {/* Super Admin Control Core */}
                  <div className="w-56 bg-gradient-to-b from-amber-600/20 to-amber-950/40 border-2 border-amber-500 rounded-xl p-3 shadow-amber-500/5 shadow-md">
                    <span className="text-[10px] text-amber-400 font-bold block">SUPER ADMIN PANEL</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Control Cockpit</span>
                  </div>

                  {/* Vertical Connection Line */}
                  <div className="h-6 w-0.5 bg-gradient-to-b from-amber-500 to-indigo-500"></div>

                  {/* API Gateway */}
                  <div className="w-72 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 border border-indigo-500 rounded-lg p-2.5 shadow-md">
                    <span className="text-indigo-400 font-black block text-[11px]">KONG API GATEWAY LAYER</span>
                    <span className="text-[8px] text-gray-500 block mt-0.5">Rate Limit, TLS Termination & SSO Auth Proxy</span>
                  </div>

                  <div className="h-6 w-0.5 bg-indigo-500"></div>

                  {/* Microservices Cluster Row 1 & Row 2 Combined */}
                  <div className="w-full space-y-3">
                    <span className="text-[9px] text-gray-600 uppercase tracking-widest block font-bold">Isolated Clusters (Click node to inspect API & DB)</span>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { id: 'user', label: 'Users Service', icon: '👤', desc: 'UID profiles' },
                        { id: 'course', label: 'Courses Service', icon: '📚', desc: 'Syllabus builder' },
                        { id: 'payment', label: 'Payments', icon: '💳', desc: 'Billing engines' },
                        { id: 'ai', label: 'AI Service', icon: '✨', desc: 'Gemini tutoring' },
                        { id: 'community', label: 'Community', icon: '💬', desc: 'Forum threads' }
                      ].map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => setSelectedServiceId(srv.id)}
                          className={`p-3 rounded-xl border text-left transition duration-200 cursor-pointer ${
                            selectedServiceId === srv.id
                              ? 'bg-amber-955/40 border-amber-400 shadow-lg shadow-amber-950/40'
                              : 'bg-[#03060d]/80 border-gray-850 hover:bg-gray-900/60 hover:border-indigo-400/30'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{srv.icon}</span>
                            <span className={`font-serif font-bold text-[11px] ${selectedServiceId === srv.id ? 'text-[#D4AF37]' : 'text-gray-200'}`}>
                              {srv.label}
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-500 block mt-1">{srv.desc}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { id: 'exam', label: 'Exam Service', icon: '📝', desc: 'Proctor testing' },
                        { id: 'certification', label: 'Certs Engine', icon: '🏆', desc: 'On-chain hashes' },
                        { id: 'liveClass', label: 'Live Broadcast', icon: '📡', desc: 'RTC streaming' },
                        { id: 'analytics', label: 'Analytics', icon: '📊', desc: 'Cohort retention' },
                        { id: 'support', label: 'Support SLA', icon: '🛎️', desc: 'SLA ticket pools' }
                      ].map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => setSelectedServiceId(srv.id)}
                          className={`p-3 rounded-xl border text-left transition duration-200 cursor-pointer ${
                            selectedServiceId === srv.id
                              ? 'bg-amber-955/40 border-amber-400 shadow-lg shadow-amber-950/40'
                              : 'bg-[#03060d]/80 border-gray-850 hover:bg-gray-900/60 hover:border-indigo-400/30'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{srv.icon}</span>
                            <span className={`font-serif font-bold text-[11px] ${selectedServiceId === srv.id ? 'text-[#D4AF37]' : 'text-gray-200'}`}>
                              {srv.label}
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-500 block mt-1">{srv.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-emerald-500"></div>

                  {/* Database / Storage Layer */}
                  <div className="w-full border border-emerald-900/30 bg-[#040d12]/70 rounded-2xl p-4">
                    <span className="text-emerald-400 font-extrabold text-[10px] block uppercase tracking-widest mb-2.5">
                      DYNAMIC MULTI-DATABASE PLATFORM STORAGE LAYER
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-[#020508] p-2.5 rounded-xl border border-emerald-950/50">
                        <span className="text-[#005f73] font-black text-[13px] block">PostgreSQL</span>
                        <span className="text-[8px] text-gray-500 block">Relational Ledger Records</span>
                      </div>
                      <div className="bg-[#020508] p-2.5 rounded-xl border border-emerald-950/50">
                        <span className="text-[#9b2226] font-black text-[13px] block">Redis Server</span>
                        <span className="text-[8px] text-gray-500 block">HMR session caches & rate lines</span>
                      </div>
                      <div className="bg-[#020508] p-2.5 rounded-xl border border-emerald-950/50">
                        <span className="text-[#e9d8a6] font-black text-[13px] block">Vector DB</span>
                        <span className="text-[8px] text-gray-500 block">AI embeddings & exegesis</span>
                      </div>
                      <div className="bg-[#020508] p-2.5 rounded-xl border border-emerald-950/50">
                        <span className="text-[#ee9b00] font-black text-[13px] block">Object S3</span>
                        <span className="text-[8px] text-gray-500 block">HLS Video & curriculum resources</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* CORE SERVICE SPECIFICATION INSPECTOR */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. All 28 Services Selector Panel */}
                <div className="bg-[#050b16] border border-gray-850 p-4 rounded-xl flex flex-col h-[700px]">
                  <span className="text-[10px] text-gray-500 font-mono block uppercase mb-3 font-extrabold">Ecosystem Service Directory (28 Total)</span>
                  
                  <div className="overflow-y-auto flex-1 pr-1 space-y-1 scrollbar-thin">
                    {Object.values(microservicesData).map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                          selectedServiceId === service.id
                            ? 'bg-[#181b11] border border-amber-600/30 text-amber-400'
                            : 'hover:bg-gray-900 text-gray-300'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{service.name}</span>
                          <span className="text-[9px] text-gray-500 block font-mono">ID: {service.id}</span>
                        </div>
                        <span className="text-[8px] font-mono font-bold bg-[#0f140d]/40 px-2 py-0.5 rounded text-emerald-400 uppercase">
                          Static Spec
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Detailed Specification Panel */}
                <div className="lg:col-span-2 bg-[#050b16] border border-gray-850 p-6 rounded-xl space-y-6">
                  {microservicesData[selectedServiceId] ? (
                    (() => {
                      const model = microservicesData[selectedServiceId];
                      return (
                        <div className="space-y-6">
                          
                          {/* Heading */}
                          <div className="flex justify-between items-start border-b border-gray-900 pb-4">
                            <div>
                              <h3 className="text-lg font-serif font-black text-[#faf8f5]">{model.name} Specification</h3>
                              <span className="text-xs text-[#D4AF37] font-mono mt-0.5 block font-bold">Node Identity: services_node_{model.id}_prod</span>
                            </div>
                            
                            <div className="space-x-2">
                              <button
                                onClick={() => {
                                  alert(`Triggered system event log loop for: ${model.name}`);
                                  setSystemLogs([
                                    { time: new Date().toTimeString().split(' ')[0], user: 'SYSTEM WORKER', action: `Re-verified integrity check on: ${model.name}. Complete.` },
                                    ...systemLogs
                                  ]);
                                }}
                                className="px-3 py-1.5 bg-amber-955 border border-amber-600/40 text-amber-400 font-serif font-black rounded-lg text-[9px] hover:bg-amber-950 transition"
                              >
                                Test Event Loop
                              </button>
                            </div>
                          </div>

                          {/* 1. Purpose */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 uppercase font-mono block">Service Operational Mandate</span>
                            <p className="text-xs text-gray-200 bg-[#0a0f20]/40 p-3 rounded-xl border border-gray-900 leading-relaxed">
                              {model.purpose}
                            </p>
                          </div>

                          {/* 2. Database Structure schema (PostgreSQL) */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-[#D4AF37] uppercase font-mono flex items-center space-x-1">
                              <Database className="w-3 h-3" />
                              <span>Relational PostgreSQL / Redis Database Schema</span>
                            </span>
                            <pre className="text-[10.5px] font-mono text-emerald-400 bg-gray-950 p-4 rounded-xl border border-gray-900 overflow-x-auto leading-relaxed">
                              {model.dbStructure}
                            </pre>
                          </div>

                          {/* Bottom parameters Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* APIs */}
                            <div className="space-y-2 bg-[#06111f]/30 p-4 rounded-xl border border-gray-900">
                              <span className="text-[10px] text-indigo-400 uppercase font-mono block">Direct API Endpoints</span>
                              <ul className="space-y-1.5 text-[10px] font-mono text-gray-300">
                                {model.apiContracts.map((api, idx) => (
                                  <li key={idx} className="border-b border-gray-900 pb-1.5 last:border-0">{api}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Event Bus matches */}
                            <div className="space-y-2 bg-[#0f140d]/30 p-4 rounded-xl border border-gray-900">
                              <span className="text-[10px] text-emerald-400 uppercase font-mono block font-black">Kafka Pub/Sub Event Triggers</span>
                              
                              <div className="space-y-2 text-[10px] font-mono">
                                <div>
                                  <span className="text-[9px] text-gray-500 block">PRODUCED EVENTS:</span>
                                  {model.eventsProduced.length > 0 ? (
                                    <ul className="list-disc pl-3 mt-1 text-gray-300 space-y-1">
                                      {model.eventsProduced.map((ev, i) => <li key={i}>{ev}</li>)}
                                    </ul>
                                  ) : <span className="text-gray-500">None defined</span>}
                                </div>
                                <div className="border-t border-gray-900 pt-2">
                                  <span className="text-[9px] text-gray-500 block">CONSUMED EVENTS:</span>
                                  {model.eventsConsumed.length > 0 ? (
                                    <ul className="list-disc pl-3 mt-1 text-gray-300 space-y-1">
                                      {model.eventsConsumed.map((ev, i) => <li key={i}>{ev}</li>)}
                                    </ul>
                                  ) : <span className="text-gray-500">None defined</span>}
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Policy mapping & recovery parameters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-900 pt-4">
                            <div className="text-xs space-y-1">
                              <span className="text-[10px] text-rose-400 uppercase font-mono block">Casbin Permission Policies</span>
                              <p className="text-gray-300">{model.permissionRules}</p>
                            </div>
                            <div className="text-xs space-y-1">
                              <span className="text-[10px] text-amber-400 uppercase font-mono block">Fault Tolerant Failover Policy</span>
                              <p className="text-gray-300">{model.failureRecovery}</p>
                            </div>
                          </div>

                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-20 text-gray-500 font-mono">
                      Querying target node specs... select a microservice sequence.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 1: EXECUTIVE COCKPIT DASHBOARD */}
          {activeAdminTab === 'executive-dashboard' && (
            <div className="space-y-8" id="tab-dashboard">
              
              {/* Telemetry and Dynamic Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-black">Executive Command Room</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">Veda Academy Operations Matrix</h2>
                  <p className="text-xs text-gray-400">Aggregating transactional billing, direct user flows, and cluster health analytics.</p>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-950 p-1 rounded-xl border border-gray-900 font-mono">
                  <button className="px-3 py-1.5 rounded-lg text-xs bg-amber-955 text-amber-400 border border-amber-600/30">Live Stream</button>
                  <button className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white transition">24H</button>
                  <button className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white transition">30D</button>
                </div>
              </div>

              {/* DYNAMIC METRIC CARDS GRID (16 Essential metrics) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-[#050a16] border border-gray-800 p-4 rounded-2xl relative shadow-xl hover:border-amber-400/20 transition">
                  <span className="text-gray-500 text-[10px] font-mono tracking-wider block">TOTAL SCHOLARS REGISTERED</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-2xl font-serif font-black text-white">412,940</span>
                    <span className="text-green-400 text-xs font-mono font-bold">+18.2%</span>
                  </div>
                  <span className="text-[9px] text-[#D4AF37] font-mono block mt-1">↑ 489 Joined today</span>
                </div>

                <div className="bg-[#050a16] border border-gray-800 p-4 rounded-2xl relative shadow-xl hover:border-amber-400/20 transition">
                  <span className="text-gray-500 text-[10px] font-mono tracking-wider block">ACTIVE SADHAKAS TODAY</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-2xl font-serif font-black text-white">24,312</span>
                    <span className="text-green-400 text-xs font-mono font-bold">+5.3%</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-1">● 142 Active classes now</span>
                </div>

                <div className="bg-[#050a16] border border-gray-800 p-4 rounded-2xl relative shadow-xl hover:border-amber-400/20 transition">
                  <span className="text-gray-500 text-[10px] font-mono tracking-wider block">REVENUE THIS MONTH</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-2xl font-serif font-black text-[#D4AF37]">₹4.23M</span>
                    <span className="text-green-400 text-xs font-mono font-bold">+28.5%</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono block mt-1">UPI, Stripe & Crypto Ready</span>
                </div>

                <div className="bg-[#050a16] border border-gray-800 p-4 rounded-2xl relative shadow-xl hover:border-amber-400/20 transition">
                  <span className="text-gray-500 text-[10px] font-mono tracking-wider block">RETENTION RETR RETRIEVAL RATE</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-2xl font-serif font-black text-white">96.3%</span>
                    <span className="text-emerald-400 text-xs font-mono font-bold">Excellent</span>
                  </div>
                  <span className="text-[9px] text-[#D4AF37] font-mono block mt-1">↓ 0.2% dropout warning list</span>
                </div>

              </div>

              {/* CHARTS CONTAINER: High Fidelity custom SVGs mimicking real-time database outputs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart 1: Revenue Timeline (2 cols width) */}
                <div className="lg:col-span-2 bg-[#050b16]/70 border border-amber-900/10 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-900 pb-3">
                    <h4 className="text-sm font-serif font-bold text-gray-100 flex items-center space-x-1.5">
                      <span>📈 Platform Monthly Intake (INR Millions)</span>
                    </h4>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-950/20 px-2 py-0.5 rounded">Real Time</span>
                  </div>

                  <div className="h-44 w-full relative flex items-end">
                    {/* SVG Chart projection */}
                    <svg className="absolute inset-0 w-full h-full text-[#D4AF37]" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="yellow-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#03060d" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 80 Q 80 40 160 50 T 320 20 T 480 5" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
                      <path d="M 0 80 Q 80 40 160 50 T 320 20 T 480 5 L 480 100 L 0 100 Z" fill="url(#yellow-grad)" />
                    </svg>

                    <div className="w-full h-full flex justify-between items-end relative z-10 px-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-[9px] text-gray-500 font-mono mt-3">{month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chart 2: Student Funnel Metrics */}
                <div className="bg-[#050b16]/70 border border-gray-800 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs uppercase text-orange-400 tracking-wider font-mono font-black border-b border-gray-900 pb-2">CONVERSION FUNNEL</h4>
                  
                  <div className="space-y-3 font-mono text-[11px]">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>1. Landing Page Hits</span>
                        <span className="text-white">100% (48K)</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-2" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>2. Course Preview Watchers</span>
                        <span className="text-white">64.3% (30.8K)</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2" style={{ width: '64.3%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>3. Checkouts Triggered</span>
                        <span className="text-white">18.2% (8.7K)</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-2" style={{ width: '18.2%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>4. Paid Enrollments</span>
                        <span className="text-[#D4AF37] font-bold">12.4% (5.9K)</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#D4AF37] h-2" style={{ width: '12.4%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* COHORT MATRIX RETENTION RETENTION RETRIEVAL */}
              <div className="bg-[#050a16] border border-gray-800 rounded-2xl p-5">
                <div className="flex justify-between mb-4 border-b border-gray-900 pb-3">
                  <span className="text-xs font-serif font-black uppercase text-amber-400">Class Cohort Weekly Student Retention Matrix (%)</span>
                  <span className="text-[10px] text-gray-500 font-mono">Based on Weekly Activity Checkpoints</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-900">
                        <th className="py-2">Cohort Group</th>
                        <th>Students</th>
                        <th>Wk 1</th>
                        <th>Wk 2</th>
                        <th>Wk 3</th>
                        <th>Wk 4</th>
                        <th>Wk 5</th>
                        <th>Wk 8</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      <tr>
                        <td className="py-2.5 font-bold text-white">Feb Vedic Course</td>
                        <td>1,420</td>
                        <td className="bg-emerald-950/40 text-emerald-400 p-1 text-center font-bold">98%</td>
                        <td className="bg-emerald-950/30 text-emerald-400 p-1 text-center font-bold">94%</td>
                        <td className="bg-emerald-950/20 text-emerald-400 p-1 text-center font-bold">90%</td>
                        <td className="bg-amber-950/30 text-amber-400 p-1 text-center">88%</td>
                        <td className="bg-amber-950/20 text-amber-500 p-1 text-center">85%</td>
                        <td className="bg-amber-950/10 text-amber-600 p-1 text-center">82%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Mar Sanskrit Lab</td>
                        <td>840</td>
                        <td className="bg-emerald-950/40 text-emerald-400 p-1 text-center font-bold">99%</td>
                        <td className="bg-emerald-950/30 text-emerald-400 p-1 text-center font-bold">95%</td>
                        <td className="bg-emerald-950/20 text-emerald-400 p-1 text-center font-bold">91%</td>
                        <td className="bg-amber-950/30 text-amber-400 p-1 text-center">89%</td>
                        <td className="bg-amber-950/10 text-amber-500 p-1 text-center">83%</td>
                        <td className="bg-rose-950/50 text-rose-400 p-1 text-center">64%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: USER DIRECTORY OPERATIONS */}
          {activeAdminTab === 'user-management' && (
            <div className="space-y-6" id="tab-users animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Vedic Academy Scholar Accounts</h2>
                  <p className="text-xs text-gray-500">Add role assignments, impersonate profiles, reset credentials, or enforce system suspensions.</p>
                </div>
                
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-500 text-black font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create User Credentials</span>
                </button>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-950 p-3 rounded-2xl border border-gray-900">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search name, UID or email..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full bg-[#050812] border border-gray-850 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 font-mono">Role:</span>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="flex-1 bg-[#050812] text-xs text-gray-300 font-mono border border-gray-850 p-2 rounded-xl focus:outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="org_manager">Organization Manager</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>

                <div className="text-right flex items-center justify-end font-mono text-[11px] text-[#D4AF37]">
                  Aggregating {managedUsers.length} total cluster users
                </div>
              </div>

              {/* USER ENTITY LIST */}
              <div className="bg-[#050b16] border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-gray-950 text-gray-500 border-b border-gray-900 font-mono text-[10px]">
                      <th className="p-4">SCHOLAR / UID</th>
                      <th>EMAIL</th>
                      <th>ROLE ASSIGNMENT</th>
                      <th>STATUS</th>
                      <th>COURSES ENROLLED</th>
                      <th className="text-right p-4">MANAGEMENT ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {managedUsers
                      .filter((u) => {
                        const mName = u.name.toLowerCase().includes(userQuery.toLowerCase());
                        const mEmail = u.email.toLowerCase().includes(userQuery.toLowerCase());
                        const mRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                        return (mName || mEmail) && mRole;
                      })
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-gray-900/20 text-[11px] transition">
                          <td className="p-4 font-bold text-gray-100">{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className="px-2.5 py-0.5 bg-indigo-950/40 text-orange-400 font-mono border border-indigo-900/30 rounded">
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                              u.status === 'active' 
                                ? 'bg-emerald-950/50 text-emerald-400' 
                                : 'bg-red-950/50 text-rose-400'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="font-mono">{u.purchases} Paths</td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                alert(`Impersonating ${u.name}. System token session created.`);
                                setCurrentUser({
                                  id: u.id,
                                  name: u.name,
                                  email: u.email,
                                  role: u.role as any,
                                  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop',
                                  wishlist: [],
                                  certificates: [],
                                  createdAt: '2026-01-01'
                                });
                              }}
                              className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-950 border border-amber-800/40 text-amber-400 rounded-lg text-[10px]"
                            >
                              Impersonate
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                              className="px-2.5 py-1 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-300 rounded-lg text-[10px]"
                            >
                              {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INSTRUCTOR DIRECTORY (KYC & PAYOUTS) */}
          {activeAdminTab === 'instructor-management' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Lineage Scholar Verification & Commissioning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {managedInstructors.map((inst) => (
                  <div key={inst.id} className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-extrabold text-[#faf8f5]">{inst.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{inst.email}</span>
                      </div>
                      
                      {inst.isKycVerified ? (
                        <span className="bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest font-bold">KYC Verified</span>
                      ) : (
                        <span className="bg-rose-950/60 border border-rose-900/30 text-rose-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest font-black animate-pulse">Pending KYC</span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-900/60 py-3 text-center">
                      <div>
                        <span className="text-[9px] text-gray-500 block">SCORE</span>
                        <span className="font-mono text-xs font-bold text-gray-100">{inst.score}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">RATING</span>
                        <span className="font-mono text-xs font-bold text-[#D4AF37]">★ {inst.rating}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">EARNINGS</span>
                        <span className="font-mono text-xs font-bold text-[#D4AF37]">₹{inst.totalEarnings.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-gray-400">Commission set to 20%</span>
                      
                      {!inst.isKycVerified && (
                        <button
                          onClick={() => handleVerifyKyc(inst.id)}
                          className="px-3 py-1 bg-[#D4AF37] hover:bg-amber-500 text-black font-serif font-black rounded-lg text-[10px] transition"
                        >
                          Approve KYC Profile
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYLLABUS BUILDER */}
          {activeAdminTab === 'course-management' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-900 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Sanatan Course Hub</h2>
                  <p className="text-xs text-gray-400">Draft, configure, and publish Vedic study tracks directly.</p>
                </div>

                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-500 text-black font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Syllabus Workspace</span>
                </button>
              </div>

              {/* COURSE CARD TILES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.id} className="bg-[#050b16] border border-gray-800 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] bg-indigo-950/40 text-[#D4AF37] px-2 py-0.5 rounded font-mono border border-indigo-900/30">
                          {c.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-gray-400">BY {c.instructorName}</span>
                      </div>

                      <h4 className="font-serif font-bold text-[#faf8f5] mt-2 text-sm">{c.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 mb-4 italic line-clamp-2">{c.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-900 pt-3">
                      <div>
                        <span className="font-mono text-xs text-amber-500 font-extrabold">Price: ₹{c.price}</span>
                        <span className="text-[9px] text-gray-500 block">Syllabus Status: {c.status}</span>
                      </div>

                      <div className="space-x-1.5">
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-1 px-3 bg-red-950/20 border border-red-900/30 text-rose-400 text-[10px] rounded hover:bg-red-950 transition"
                        >
                          Prune Path
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MODERATION CONTROL */}
          {activeAdminTab === 'moderation-center' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">AI & Human Peer Moderation Central Queue</h2>
              
              <div className="bg-orange-950/10 border border-orange-500/20 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Moderation Active (Gemini Content Filter Integration)</span>
                </div>
                <p className="text-gray-405">All comments, forum threads, and instructor syllabus uploads are scanned continuously for spam, copyright claims, and toxic behavior metrics automatically.</p>
              </div>

              {/* SIMULATED PENDING AUDITS */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">Vidhya Discussion Forum Post</span>
                    <p className="text-xs text-gray-200 mt-1 italic">"Please share the direct download link for premium textbooks."</p>
                    <span className="text-[10px] text-gray-500 block mt-1">Reported by AutoReviewer: Potential Link Spam Rule Trigger</span>
                  </div>

                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-rose-600 rounded text-xs">Purge Post</button>
                    <button className="px-3 py-1 bg-gray-900 rounded text-xs border border-gray-800">Dismiss Flag</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DROPOUT & ANALYTICS */}
          {activeAdminTab === 'student-progress' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Advanced Student Performance & Drop-Off Predictions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Dropout warnings list */}
                <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl space-y-4">
                  <span className="text-xs font-serif font-bold text-amber-500 block">⚠️ AI Predicted Potential Dropouts (No activity {'>'}7 Days)</span>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-[#0a0f20] border border-gray-850 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold block text-white text-xs">Kunal Kapoor</span>
                        <span className="text-[10px] text-gray-500 font-mono">Last access: 10 days ago • Vedic Grammar Course</span>
                      </div>
                      <span className="text-xs text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded font-mono">84% Risk</span>
                    </div>

                    <div className="p-3 bg-[#0a0f20] border border-gray-850 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold block text-white text-xs">Rohan Mishra</span>
                        <span className="text-[10px] text-gray-500 font-mono">Last access: 8 days ago • Panchang Calculations</span>
                      </div>
                      <span className="text-xs text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded font-mono">62% Risk</span>
                    </div>
                  </div>
                </div>

                {/* Performance forecasting */}
                <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl space-y-4">
                  <span className="text-xs font-serif font-bold text-emerald-400 block">⭐ AI Predicted High-Performers (Verifiable Certificate Candidates)</span>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-emerald-950/10 border border-emerald-900/20 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold block text-white">Amit Sharma</span>
                        <span className="text-[10px] text-gray-400">Exam score prediction: 96% based on micro-quizzes</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded">95% Confidence</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: LIVE BROADCASTS */}
          {activeAdminTab === 'live-classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-900 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Vedic Broadcast Suite</h2>
                  <p className="text-xs text-gray-400">Initialize and schedule high-definition stream linkages.</p>
                </div>

                <button
                  onClick={() => setShowCreateLiveModal(true)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-500 text-black font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Launch Live Channel</span>
                </button>
              </div>

              {/* LIST SCHEDULED BROADCASTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveSessions.map((ls) => (
                  <div key={ls.id} className="bg-[#050b16] border border-gray-800 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-rose-400 text-[10px] uppercase font-mono tracking-widest font-black animate-pulse flex items-center space-x-1.5 bg-rose-950/35 border border-rose-900/30 px-2 py-0.5 rounded">
                        <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping"></span>
                        <span> Gurukul Feed Live</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">{ls.attendees} Enrolled</span>
                    </div>

                    <h4 className="font-serif font-bold text-white text-xs sm:text-sm">{ls.topic}</h4>
                    
                    <div className="text-[11px] text-gray-400 font-mono space-y-1">
                      <p>● Broadcaster: {ls.host}</p>
                      <p>● Time Link: {ls.time} ({ls.duration})</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => alert(`Broadcasting initiated for: ${ls.topic}. Routing stream channels.`)}
                        className="flex-1 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-serif font-bold text-xs rounded-xl"
                      >
                        Transmit Channel Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: ADAPTIVE EXAMINATION SYSTEM */}
          {activeAdminTab === 'exams-system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Adaptive Veda Examinations (Proctor Watchdesk)</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active question pools */}
                <div className="lg:col-span-2 space-y-4">
                  <span className="text-xs font-serif font-bold text-amber-500 block">🛡️ Active Question Banks & Adaptive Paths</span>
                  
                  {exams.map((ex) => (
                    <div key={ex.id} className="bg-[#050b16] border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{ex.title}</h4>
                        <p className="text-[11px] text-gray-500 font-mono mt-1">
                          {ex.totalQuestions} Questions • Randomized Engine Enabled • {ex.proctoring ? 'AI Webcam proctor active' : 'Self-Assessment Window'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-mono text-emerald-400 text-xs font-bold block">{ex.completions} Passes</span>
                        <span className="text-[10px] text-gray-500">Seal Active</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Proctor diagnostics */}
                <div className="bg-[#120509] border border-red-900/20 p-4 rounded-xl space-y-3">
                  <span className="text-xs font-mono text-rose-400 font-bold block">🚨 LIVE PROCTOR SECURITY CHEATING ALERTS</span>
                  
                  <div className="space-y-2 text-[10px] font-mono leading-relaxed">
                    {proctorDiagnostics.map((diag) => (
                      <div key={diag.id} className="p-2.5 bg-gray-950/60 border border-red-950/40 rounded-lg">
                        <div className="flex justify-between items-center text-rose-400 font-bold mb-1">
                          <span>{diag.event}</span>
                          <span className="text-[9px] bg-red-950 px-1 rounded uppercase">{diag.severity}</span>
                        </div>
                        <p className="text-gray-400">Student: {diag.student} • {diag.exam}</p>
                        <span className="text-gray-600 block text-right mt-0.5">{diag.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 9: CERTIFICATION ENGINE */}
          {activeAdminTab === 'certifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Lineage Certification Authority</h2>
              
              <div className="bg-gradient-to-r from-amber-700/10 to-orange-700/10 p-5 rounded-2xl border border-amber-900/30 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-black">Authorized Blockchain Verifier Seal</span>
                  <h4 className="text-sm font-serif font-black mt-1">Multi-Chain Merkle Verifications Cryptographic System</h4>
                  <p className="text-gray-400 mt-1">Each certificate generated by the Sanatan Gurukul includes high resonance SHA-256 seals, preventing fraudulent declarations completely.</p>
                </div>

                <div className="bg-[#1a110a] p-4 text-center rounded-xl border border-amber-700/30 font-serif w-full sm:w-auto shrink-0">
                  <span className="text-2xl font-bold block text-amber-400 font-mono">{issuedChainCount}</span>
                  <span className="text-[10px] text-gray-500 block">On-Chain Secured</span>
                </div>
              </div>

              {/* TEMPLATES AVAILABLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certTemplates.map((temp) => (
                  <div key={temp.id} className="bg-[#050b16] border border-[#D4AF37]/10 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                      <h4 className="font-serif font-bold text-white text-xs sm:text-sm">{temp.name}</h4>
                      <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/30 font-mono px-2 py-0.5 rounded">Verified Template</span>
                    </div>

                    <div className="grid grid-cols-3 text-center text-xs font-mono py-2">
                      <div>
                        <span className="text-[9px] text-gray-500 block">PAGE</span>
                        <span>{temp.size}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">LAYOUT</span>
                        <span>{temp.orientation}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">MERKLE SEAL</span>
                        <span className="text-emerald-400">Ready</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Certificate template selected: ${temp.name}. Direct PDF rendering generated.`)}
                      className="w-full py-2 bg-amber-950/20 hover:bg-amber-950 border border-amber-800/40 text-amber-400 hover:text-amber-200 text-xs font-serif font-bold rounded-xl transition"
                    >
                      Export / View Vector Canvas Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PAYMENTS OPERATIONS */}
          {activeAdminTab === 'payments-management' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Billing System Ledgers & Crypto Pathways</h2>
              
              {/* Stripe, UPI & Cryptocurrencies aggregates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#050b16] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-500 block uppercase font-mono">STRIPE GATEWAY API SECURED</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">₹2,489,102</span>
                    <span className="text-emerald-500 text-[10.5px]">API Live</span>
                  </div>
                </div>

                <div className="bg-[#050b16] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-500 block uppercase font-mono">RAZORPAY & INSTANT UPI</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">₹1,740,940</span>
                    <span className="text-emerald-500 text-[10.5px]">Live</span>
                  </div>
                </div>

                <div className="bg-[#050b16] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-500 block uppercase font-mono">SOLANA / ETH MULTI-CHAIN PORT</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#D4AF37]">34.5 ETH</span>
                    <span className="text-[#D4AF37] text-[10.5px]">Crypto Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SUBSCRIPTIONS */}
          {activeAdminTab === 'subscriptions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Subscription Architect & Churn Forecasts</h2>
              
              <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-serif font-bold text-amber-500 uppercase">Interactive Tier Commission Configuration</span>
                  <button className="px-3 py-1 bg-amber-600 rounded text-xs text-black font-semibold">Save Framework</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-gray-900 rounded-xl">
                    <span className="block text-gray-400 text-[10px] mb-1 uppercase">Sadhana Essential Plan</span>
                    <span className="text-base text-white">₹999/mo</span>
                    <p className="text-[10px] text-gray-600 mt-2">Active Scholars: 12,492</p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-xl">
                    <span className="block text-gray-400 text-[10px] mb-1 uppercase">Vedas Scholar Academy Plan</span>
                    <span className="text-base text-[#D4AF37] font-bold">₹2,499/mo</span>
                    <p className="text-[10px] text-gray-600 mt-2">Active Scholars: 1,840</p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-xl">
                    <span className="block text-gray-400 text-[10px] mb-1 uppercase">Lineage Ashram Corporate Access</span>
                    <span className="text-base text-white">Custom SLA Invoice</span>
                    <p className="text-[10px] text-gray-600 mt-2">Enterprise client teams active: 22</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: COMMUNITY DISCUSSION FORUM */}
          {activeAdminTab === 'community-forum' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Community Swadhyaya Forum Monitor</h2>
              
              <div className="bg-[#050b16] border border-gray-800 p-4 rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between font-mono text-gray-500">
                  <span>Audit of all platform post queues</span>
                  <span className="text-emerald-400 font-bold">98.4% Clean toxicity rate</span>
                </div>

                <div className="text-[11px] font-mono p-3 bg-gray-900 rounded-lg">
                  <p className="text-gray-200">"May the spiritual guide kindly suggest if there's any fast rule to memorise Chapter II Sanskrit sutras?"</p>
                  <span className="text-amber-500 text-[9px] mt-1 block">Asked by Shishya Rohan • Auto-graded Safe</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: SLA SUPPORT CENTER */}
          {activeAdminTab === 'support-center' && (
            <div className="space-y-6" id="tab-support animate-fade-in">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">SLA Escalation Support Desks</h2>
              
              <div className="space-y-4">
                {tickets.map((tk) => (
                  <div key={tk.id} className="bg-[#050b16] border border-gray-800 p-4 rounded-2xl relative">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-amber-500 font-bold block bg-amber-950/40 border border-amber-900/40 px-2 py-0.5 rounded">
                            Ticket {tk.id}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider font-mono p-1 rounded ${
                            tk.priority === 'critical' ? 'bg-red-950 text-rose-400 font-black animate-pulse' : 'bg-gray-900 text-gray-400'
                          }`}>
                            {tk.priority} Priority
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs sm:text-sm mt-1">{tk.subject}</h4>
                        <p className="text-[10px] text-gray-500 block mt-1">Submitted by {tk.user}</p>
                      </div>

                      <span className={`text-[10px] uppercase font-mono px-2 py-1 rounded ${
                        tk.status === 'open' ? 'bg-amber-950 text-amber-400 font-black' : 'bg-emerald-950 text-emerald-400 font-medium'
                      }`}>
                        {tk.status.toUpperCase()}
                      </span>
                    </div>

                    {tk.status === 'open' && (
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Draft reply on behalf of platform..."
                          value={ticketReplyText[tk.id] || ''}
                          onChange={(e) => setTicketReplyText({ ...ticketReplyText, [tk.id]: e.target.value })}
                          className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none"
                        />
                        <button
                          onClick={() => handleReplyTicket(tk.id)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-xl text-xs transition flex items-center space-x-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Resolve Ticket</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 14: AI CONTROL CENTER */}
          {activeAdminTab === 'ai-control' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">AI Control Center (Gemini Prompts & Orchestrations)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl space-y-4">
                  <span className="text-xs font-serif font-bold text-amber-500 block">System Gemini Prompt Sandbox Templates</span>
                  
                  <div className="space-y-3">
                    {aiPrompts.map((pr) => (
                      <div key={pr.id} className="p-3 bg-gray-900 border border-gray-850 rounded-xl text-xs font-mono flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white block">{pr.name}</span>
                          <span className="text-[10px] text-gray-500">{pr.model} • Avg: {pr.avgTokens}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Active Seal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl text-xs space-y-4">
                  <span className="text-xs font-serif font-bold text-orange-400 block">Session Usage & Financial Metrics</span>
                  
                  <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-2 font-mono">
                    <p className="text-gray-400">Total Tokens Generated Today: <span className="text-white font-extrabold">{totalTokensSession.toLocaleString()} t</span></p>
                    <p className="text-gray-400">Aggregated AI Cost (Session): <span className="text-emerald-400 font-bold">$18.42 USD</span></p>
                    <p className="text-[#D4AF37] mt-3">↑ Live caching enabled securely, saving ~35% on prompt payload costs.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 15: CORPORATE JOB PORTAL */}
          {activeAdminTab === 'job-portal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Corporate Placement Job Board</h2>
              
              <div className="bg-[#050b16] border border-gray-800 p-4 rounded-xl text-xs">
                <span className="text-[#D4AF37] font-serif font-bold block mb-2">Campus Placements Pipeline</span>
                <p className="text-gray-400">Connect Sanskrit scholars with global academic programs, translation panels, research archives, and cultural preservation firms around the globe.</p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-center font-mono text-xs">
                  <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg">
                    <span className="text-2xl font-bold text-[#faf8f5] block">48</span>
                    <span className="text-[10px] text-gray-500 uppercase">Affiliated Corporations</span>
                  </div>
                  <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg">
                    <span className="text-2xl font-bold text-[#faf8f5] block">424</span>
                    <span className="text-[10px] text-gray-500 uppercase">Students Applied This Term</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 16: MARKETING CAMPAIGNS */}
          {activeAdminTab === 'marketing-hub' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Sanatan Campaign Broadcast Studio</h2>
              
              <div className="space-y-4">
                {marketingCampaigns.map((camp) => (
                  <div key={camp.id} className="bg-[#050b16] border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/30 font-mono px-2 py-0.5 rounded">{camp.type}</span>
                      <h4 className="font-serif font-bold text-[#faf8f5] text-xs sm:text-sm mt-1.5">{camp.name}</h4>
                    </div>

                    <div className="flex gap-4 text-center font-mono text-[11px] text-gray-400">
                      <div>
                        <span className="text-[9px] text-gray-500 block">SENT TO</span>
                        <span>{camp.sent.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">OPENS</span>
                        <span className="text-[#D4AF37] font-bold">{camp.opens}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">CONV</span>
                        <span className="text-emerald-400 font-bold">{camp.conversion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 17: FILE VAULT */}
          {activeAdminTab === 'file-vault' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Lineage CDN & Video Storage Vault</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl text-xs space-y-4">
                  <h4 className="font-serif font-bold text-[#faf8f5] border-b border-gray-900 pb-2 flex items-center space-x-1.5">
                    <span>☁️ Cloud Asset Storage Distribution</span>
                  </h4>
                  
                  <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                    <p className="text-gray-400">Total Video Bytes Stored: <span className="text-white font-extrabold">2.48 Terabytes</span></p>
                    <p className="text-gray-400">Global CDN Server Cache Rate: <span className="text-emerald-400 font-bold">99.2% Hit Rate</span></p>
                    <p className="text-[#D4AF37]">↑ Securely integrated to process exegesis lectures cleanly.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-950 to-[#0e1325] border border-gray-800 p-5 rounded-2xl flex flex-col justify-center items-center text-center">
                  <FileUp className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
                  <span className="text-xs text-white font-bold block mb-1">Direct Lineage Media Drag & Drop</span>
                  <p className="text-[10px] text-gray-500">Supports .mp4, .pdf handbooks and transcripts (Max 10GB per chunk)</p>
                  <label className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg text-[11px] cursor-pointer">
                    Upload Lesson Assets
                    <input type="file" className="hidden" onChange={() => alert('Integrated Secure CDN upload chunk success')} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 18: AUTOMATION WORKFLOWS */}
          {activeAdminTab === 'automation-workflows' && (
            <div className="space-y-6" id="tab-workflows-workbench animate-fade-in">
              <div className="flex justify-between items-center border-b border-gray-900 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Visual Workflow Builder</h2>
                  <p className="text-xs text-gray-400">Bind trigger events to automated triggers cleanly.</p>
                </div>

                <button
                  onClick={() => setShowAddWorkflowModal(true)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-500 text-black font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Build Rule Automation</span>
                </button>
              </div>

              {/* LIST WORKFLOWS */}
              <div className="space-y-4">
                {workflows.map((wf) => (
                  <div key={wf.id} className="bg-[#050b16] border border-gray-800 p-4 rounded-xl text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                    <div>
                      <h4 className="font-serif font-bold text-amber-400 text-sm">{wf.name}</h4>
                      <p className="text-gray-500 text-[10px] mt-1">Rule ID: {wf.id}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded">Trigger: {wf.trigger}</span>
                      <span className="text-amber-500">→</span>
                      <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded">Condition: {wf.condition}</span>
                      <span className="text-amber-500">→</span>
                      <span className="bg-emerald-950 border border-emerald-900/30 text-emerald-400 px-2.5 py-1 rounded font-bold">{wf.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 19: SYSTEM LOCALIZATION SETTINGS */}
          {activeAdminTab === 'system-settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3">Localization & Global Settings</h2>
              
              <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl space-y-4 text-xs">
                <span className="text-[#D4AF37] mb-2 block font-bold">Configure System Constants</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Academy Default Currency</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                    >
                      <option value="INR">₹ Indian Rupee (INR)</option>
                      <option value="USD">$ United States Dollar (USD)</option>
                      <option value="EUR">€ European Euro (EUR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Primary Display Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                    >
                      <option value="English">Sanskrit integrated English</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Sanskrit">संस्कृतम् (Sanskrit)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 20: SUPER ADMIN COMMAND CABIN */}
          {activeAdminTab === 'super-admin-room' && (
            <div className="space-y-6" id="super-admin-kill-suite">
              <h2 className="text-xl font-serif font-black text-white border-b border-gray-900 pb-3 text-rose-500">SUPER ADMIN WAR ROOM CONTROL</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Global Kill Switch */}
                <div className="bg-red-950/10 border border-rose-500/30 p-5 rounded-2xl relative space-y-4">
                  <div className="flex items-center space-x-2 text-rose-500 font-extrabold font-serif">
                    <ShieldAlert className="w-5 h-5 animate-bounce" />
                    <span>⚠️ EMERGENCY TERMINATION (KILL SWITCH)</span>
                  </div>
                  
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Activating the global kill switch locks down all database conduits, terminates active audio/video stream sessions, and redirects scholars to a secure emergency placeholder. Use with caution.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setGlobalKillSwitch(!globalKillSwitch);
                        alert(`GLOBAL KILL SWITCH STATUS: ${!globalKillSwitch ? 'ACTIVE' : 'DEACTIVATED'}`);
                      }}
                      className={`w-full py-3 rounded-xl text-xs font-serif font-black uppercase tracking-widest border transition ${
                        globalKillSwitch 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                          : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500'
                      }`}
                    >
                      {globalKillSwitch ? 'Deactivate Kill Switch (Live)' : '⚠️ TRIGGER GLOBAL PLATFORM HALT'}
                    </button>
                  </div>
                </div>

                {/* Maintenance Toggle */}
                <div className="bg-amber-950/10 border border-amber-500/20 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center space-x-2 text-amber-400 font-serif font-bold">
                    <Sliders className="w-5 h-5" />
                    <span>🚧 CLUSTER MAINTENANCE LOCKDOWN</span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Restricts login credentials exclusive to verified coordinators and engineers, while standard students receive a beautiful offline splash.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsMaintenanceMode(!isMaintenanceMode);
                        alert(`MAINTENANCE LOCKDOWN MODE: ${!isMaintenanceMode ? 'ENABLED' : 'DISABLED'}`);
                      }}
                      className={`w-full py-3 rounded-xl text-xs font-serif font-bold uppercase border transition ${
                        isMaintenanceMode 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                          : 'bg-amber-600 hover:bg-amber-500 text-black border-amber-600'
                      }`}
                    >
                      {isMaintenanceMode ? 'Deactivate Maintenance Mode' : 'Trigger Enterprise Maintenance'}
                    </button>
                  </div>
                </div>

                {/* Audit Logs */}
                <div className="bg-[#050b16] border border-gray-800 p-5 rounded-2xl space-y-4">
                  <span className="text-xs font-serif font-bold text-[#faf8f5] block">Database Sync Logs</span>
                  <div className="space-y-2 text-[10px] font-mono leading-relaxed text-gray-400">
                    <p>● Firestore state checks completed.</p>
                    <p>● SSL certificate validation refreshed.</p>
                    <p>● Port 3000 reverse proxy routing healthy.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* SECTION C: RIGHT SECTION CONTEXT LIVING DECK */}
        <aside className="w-80 bg-[#040813] border-l border-orange-500/10 shrink-0 hidden xl:flex flex-col justify-between p-6 overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Live cluster status */}
            <div className="bg-gray-950 p-4 border border-gray-900 rounded-xl space-y-3">
              <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 block">SYSTEM STATUS TELEMETRY</span>
              
              <div className="space-y-2 text-[11px] font-mono leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-gray-400">Firestore Cluster</span>
                  <span className="text-emerald-400 font-bold">Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Tokens Sandbox</span>
                  <span className="text-[#D4AF37]">Streaming</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reverse Ingress Port</span>
                  <span className="text-emerald-400">3000/OK</span>
                </div>
              </div>

              {/* Mini visual active users graph */}
              <div className="pt-2">
                <span className="text-[10px] text-gray-500 block mb-1 uppercase font-mono">CPU Core Load Index</span>
                <div className="flex items-end space-x-1 h-8 w-full bg-gray-900 rounded p-1">
                  {[24, 40, 60, 32, 14, 50, 42, 60, 24, 30, 18, 50].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }}
                      className="bg-emerald-500/70 w-full rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights and dropout checklist notifications */}
            <div className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-serif font-black text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI OPERATIONS INSIGHTS</span>
              </div>
              
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                "We detected a 14% drop in Sanskrit level II completions. We recommend launching an automated welcome discount token sequence."
              </p>

              <button 
                onClick={() => {
                  alert('Launching automated cohort email rescue campaign...');
                  setSystemLogs([
                    { time: new Date().toTimeString().split(' ')[0], user: 'AI Engine', action: 'Initiated Automated Rescue Sequence' },
                    ...systemLogs
                  ]);
                }}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-[10px] rounded-lg transition"
              >
                Execute Campaign Prompt
              </button>
            </div>

            {/* Live Audit Trail */}
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 block">COCKPIT LIVE AUDIT STREAM</span>
              
              <div className="space-y-3 font-mono text-[10px] leading-relaxed">
                {systemLogs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="border-l border-[#D4AF37]/30 pl-3.5 py-0.5">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>{log.user}</span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-gray-300 mt-0.5">{log.action}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-widest">
            © GURUKUL CONDUIT 2026. SECURE.
          </div>

        </aside>

      </div>

      {/* --- MODALS OVERLAYS --- */}

      {/* MODAL 1: ADD USER FORM */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddNewUser}
            className="bg-[#050b16] border border-[#D4AF37]/30 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gray-900 pb-3">
              <h3 className="text-sm sm:text-base font-serif font-black text-white">Create New Scholar Credentials</h3>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyawrat Sharma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Authenticated Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. swamy@lineage.net"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Role Matrix Assignment</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                >
                  <option value="student">Student (Sadhaka)</option>
                  <option value="instructor">Instructor (Acharya)</option>
                  <option value="org_manager">Organization Manager</option>
                  <option value="affiliate">Affiliate Partner</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-amber-500 text-black font-serif font-black text-xs rounded-xl"
            >
              Issue Authorized Credentials
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD SCRIPTURE COURSE */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddNewCourse}
            className="bg-[#050b16] border border-[#D4AF37]/30 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gray-900 pb-3">
              <h3 className="text-sm sm:text-base font-serif font-black text-white">Draft Lineage Syllabus</h3>
              <button type="button" onClick={() => setShowAddCourseModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Syllabus Path Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanskrit Sandhi Deciphering Level II"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Exegesis Handout Description</label>
                <textarea
                  placeholder="Provide precise theological outcomes..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200 h-20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Category Code</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                  >
                    <option value="Vedic Astrology">Vedic Astrology</option>
                    <option value="Sanskrit Language">Sanskrit Language</option>
                    <option value="Lineage Chants">Lineage Chants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Syllabus Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-xs text-gray-200"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 font-serif font-bold text-xs rounded-xl"
            >
              Verify & Launch Core Course Path
            </button>
          </form>
        </div>
      )}

      {/* MODAL 3: COMMAND PALETTE OVERLAY */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-24 p-4">
          <div className="bg-[#05070e] border border-gray-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative font-mono">
            <div className="p-4 border-b border-gray-900 flex items-center justify-between">
              <span className="text-xs text-amber-500 font-bold block">💡 OS QUICK DISPATCH MENU</span>
              <button onClick={() => setCommandPaletteOpen(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3">
              <input
                type="text"
                placeholder="Type command name..."
                value={globalSearchSearch}
                onChange={(e) => setGlobalSearchSearch(e.target.value)}
                autoFocus
                className="w-full bg-[#0a0c16] border border-gray-850 p-3 rounded-xl text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto p-2 divide-y divide-gray-950">
              {allNavigationTabs
                .filter((it) => it.label.toLowerCase().includes(globalSearchSearch.toLowerCase()))
                .map((it) => {
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.id}
                      onClick={() => navigateToTab(it.id)}
                      className="w-full p-2.5 hover:bg-gray-900/60 transition flex items-center justify-between text-left text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-200">{it.label}</span>
                      </div>
                      <span className="text-[9px] text-[#D4AF37] tracking-wider uppercase font-bold bg-[#14120f] border border-amber-900/40 px-2 rounded">
                        Go To
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: LAUNCH LIVE BROADCAST */}
      {showCreateLiveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#050b16] border border-gray-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-900 pb-3">
              <h3 className="text-sm font-serif font-black text-white">Configure Gurukul Broadcaster</h3>
              <button onClick={() => setShowCreateLiveModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">WebRTC Streaming Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanskrit Sandhi Phonetics"
                  value={liveTopic}
                  onChange={(e) => setLiveTopic(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Broadcaster Host</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swami Sadananda"
                  value={liveHost}
                  onChange={(e) => setLiveHost(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Scheduled Broadcast Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Today, 08:30 PM"
                  value={liveTime}
                  onChange={(e) => setLiveTime(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-gray-200"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!liveTopic) return;
                setLiveSessions([
                  { id: `live-${Date.now()}`, topic: liveTopic, host: liveHost || 'Acharya Swamy', time: liveTime || 'In 10 Mins', duration: '60 mins', attendees: 0, status: 'scheduled' },
                  ...liveSessions
                ]);
                setLiveTopic('');
                setLiveHost('');
                setLiveTime('');
                setShowCreateLiveModal(false);
              }}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-amber-500 text-black font-serif font-black text-xs rounded-xl"
            >
              Publish HD Streaming Link
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD AUTOMATION WORKFLOW */}
      {showAddWorkflowModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddWorkflow}
            className="bg-[#050b16] border border-[#D4AF37]/30 w-full max-w-md rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gray-900 pb-3">
              <h3 className="text-sm font-serif font-black text-white">Create Workflow Trigger Rule</h3>
              <button type="button" onClick={() => setShowAddWorkflowModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Rule/Workflow Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refund Guard Flow"
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Trigger Event</label>
                <select
                  value={wfTrigger}
                  onChange={(e) => setWfTrigger(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-gray-200 font-mono"
                >
                  <option value="Student Enrolls">Vidhya Student Enrolls</option>
                  <option value="Inactive 7 Days">Inactive Study Gap (7 Days)</option>
                  <option value="Exam Failed">Exam Failed Checkpoint</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Target Consequent Action</label>
                <select
                  value={wfAction}
                  onChange={(e) => setWfAction(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-xl text-gray-200 font-mono"
                >
                  <option value="Send Notification">Send WhatsApp & Push Alert</option>
                  <option value="Issue Coupon">Issue Dedicated Refund Code</option>
                  <option value="Suspend Access">Suspend Security Access</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-xl text-xs"
            >
              Verify & Build Rule Pipe
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
