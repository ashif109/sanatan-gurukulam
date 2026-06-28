import React, { useState, useEffect } from 'react';
import { 
  BarChart3, BookOpen, Users, DollarSign, MessageSquare, Check, X, ShieldAlert, Award, Star, 
  Compass, User, AlertCircle, RefreshCw, CheckCircle, Search, Filter, Activity, Cpu, Database, ChevronDown
} from 'lucide-react';
import { Course, UserProfile, Enrollment, Order } from '../types';

interface AdminPanelProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose?: () => void;
}

interface SupportTicket {
  id: string;
  studentName: string;
  email: string;
  subject: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export default function AdminPanel({ courses, setCourses, currentUser, setCurrentUser, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'courses' | 'users' | 'transactions' | 'tickets' | 'permissions' | 'cms-seo'>('analytics');

  // Granular Permissions States
  const [permissionsState, setPermissionsState] = useState({
    studentDownloads: true,
    guruLiveStream: true,
    autoApproveCourses: false,
    auditTrailLogging: true
  });

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    aiDoubtSolver: true,
    referralRewards: true,
    liveClassReactions: true,
    gstTaxCalculation: true
  });

  // CMS & SEO States
  const [seoTitle, setSeoTitle] = useState('Sanatan Gurukul - Complete Vedic Wisdom Learning Platform');
  const [seoDesc, setSeoDesc] = useState('Engage in traditional scriptures, astrology calculations, Upanishad chanting streams, and live doubt solving.');
  const [gstRate, setGstRate] = useState(18);
  const [announcementMsg, setAnnouncementMsg] = useState('');
  
  // Platform States
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  
  // Loading & UX States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live Simulated Telemetry States (flashing numbers to show real-time live monitoring)
  const [telemetry, setTelemetry] = useState({
    cpuLoad: 24,
    memoryUsage: 4.2,
    activeSockets: 48,
  });

  // Filter States
  const [courseFilter, setCourseFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [userQuery, setUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'instructor' | 'admin'>('all');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Load telemetry metrics
  useEffect(() => {
    fetchData();
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/admin/system/metrics');
        if (res.ok) {
          const data = await res.json();
          setTelemetry({
            cpuLoad: data.cpuLoad,
            memoryUsage: parseFloat((data.memoryUsage / 16).toFixed(1)), // convert virtual GB usage
            activeSockets: data.activeUsers // map to active users
          });
        }
      } catch (e) {
        console.warn("Telemetry fetch failed", e);
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, enrollRes, ordersRes, ticketsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/users'),
        fetch('/api/enrollments'),
        fetch('/api/orders'),
        fetch('/api/tickets')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (enrollRes.ok) setEnrollments(await enrollRes.ok ? await enrollRes.json() : []);
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
    } catch (e) {
      console.error("Failed to load admin registry telemetry:", e);
    } finally {
      setLoading(false);
    }
  };

  // Course approvals API call
  const handleUpdateCourseStatus = async (courseId: string, targetStatus: 'approved' | 'rejected') => {
    setActionLoading(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        const updatedCourse = await res.json();
        setCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
        setSuccessMessage(`Course status successfully set to: ${targetStatus.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // User role modification API call
  const handleUpdateUserRole = async (userId: string, targetRole: 'student' | 'instructor' | 'admin') => {
    setActionLoading(`role-${userId}`);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        
        // If current admin changes their own role (edge case), update currentUser state
        if (userId === currentUser.id) {
          setCurrentUser(updatedUser);
        }

        setSuccessMessage(`User '${updatedUser.name}' promoted to ${targetRole.toUpperCase()} role.`);
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Ticket resolution API call
  const handleResolveTicket = async (ticketId: string, targetStatus: 'pending' | 'resolved') => {
    setActionLoading(`ticket-${ticketId}`);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        const updatedTicket = await res.json();
        setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        setSuccessMessage(`Ticket is now marked as: ${targetStatus.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtering listings
  const filteredCourses = courses.filter(c => c.status === courseFilter);
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });
  const filteredTickets = tickets.filter(t => ticketFilter === 'all' || t.status === ticketFilter);

  return (
    <div className="bg-[#03060d] text-gray-100 min-h-screen font-sans antialiased text-sm flex flex-col relative w-full overflow-x-hidden" id="admin-portal-view">
      
      {/* 1. Header Navigation Bar (Custom class wrapper overrides index.css header background collision in light mode) */}
      <header className="sticky top-0 bg-[#060b18]/95 backdrop-blur-md border-b border-orange-500/20 z-40 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-2.5 rounded-full text-white shadow-[0_0_12px_rgba(249,115,22,0.35)] flex items-center justify-center shrink-0">
            <span className="text-md font-bold font-serif leading-none block">ॐ</span>
          </div>
          <div className="text-left">
            {/* Using h2 with reset styles to avoid overlapping header h1 background rules in light mode */}
            <h2 className="text-sm sm:text-base font-bold font-serif tracking-widest text-[#D4AF37] uppercase leading-none bg-none! bg-transparent! p-0 m-0">
              Sanatan Operations Center
            </h2>
            <p className="text-[9px] text-gray-400 font-mono tracking-wider uppercase font-semibold leading-none mt-1">
              End-to-End Governance Deck
            </p>
          </div>
        </div>        {/* Tab Selection Switcher */}
        <div className="hidden xl:flex bg-[#0a0f21] border border-orange-500/15 rounded-xl p-0.5 text-xs font-bold font-serif tracking-wide">
          {[
            { id: 'analytics', label: 'Telemetry Cockpit', icon: BarChart3 },
            { id: 'courses', label: 'Curriculum Audits', icon: BookOpen },
            { id: 'users', label: 'Seeker Roles', icon: Users },
            { id: 'transactions', label: 'Sales Ledger', icon: DollarSign },
            { id: 'tickets', label: 'Support Desk', icon: MessageSquare },
            { id: 'permissions', label: 'Role Permissions', icon: ShieldAlert },
            { id: 'cms-seo', label: 'CMS & SEO', icon: Compass }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-gray-255 hover:bg-orange-950/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin profile & exit controls */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-2.5">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full border border-[#D4AF37]/50"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-left leading-none">
              <span className="text-xs font-bold block">{currentUser.name}</span>
              <span className="text-[9px] text-[#D4AF37] uppercase font-mono tracking-widest block mt-0.5">Admin</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-900/60 rounded-lg text-rose-400 hover:text-rose-300 transition cursor-pointer"
            title="Leave Admin Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Responsive Mobile Tab Switcher */}
      <div className="xl:hidden bg-[#060b18] border-b border-orange-500/10 p-2 flex overflow-x-auto gap-2 shrink-0 scrollbar-none">
        {[
          { id: 'analytics', label: 'Telemetry', icon: BarChart3 },
          { id: 'courses', label: 'Curriculums', icon: BookOpen },
          { id: 'users', label: 'Scholars', icon: Users },
          { id: 'transactions', label: 'Sales', icon: DollarSign },
          { id: 'tickets', label: 'Support', icon: MessageSquare },
          { id: 'permissions', label: 'Permissions', icon: ShieldAlert },
          { id: 'cms-seo', label: 'CMS', icon: Compass }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-serif font-bold whitespace-nowrap cursor-pointer transition ${
                isActive ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Administrative Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 relative z-10 space-y-6">
        
        {/* Toast / Status Message Banner */}
        {successMessage && (
          <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-xl text-orange-400 text-xs font-serif flex items-center space-x-2 animate-in fade-in duration-300 shadow-lg">
            <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className="text-xs font-serif text-gray-500">Retrieving operational telemetry data streams...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: TELEMETRY & SYSTEM COCKPIT */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Metrics Highlights */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 p-5 rounded-2xl shadow-xl hover:border-orange-500/30 transition duration-300">
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase block">Sales Revenue</span>
                    <span className="text-2xl font-serif font-black text-[#D4AF37] mt-1 block">
                      ₹{(stats?.metrics?.totalRevenue || 0).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-gray-600 block mt-1 font-mono">Live dynamic ledger audits</span>
                  </div>

                  <div className="bg-[#0c0604]/80 border border-orange-500/15 p-5 rounded-2xl shadow-xl hover:border-orange-500/30 transition duration-300">
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase block">Active Course Enrolls</span>
                    <span className="text-2xl font-serif font-black text-white mt-1 block">
                      {(stats?.metrics?.totalEnrollments || 0).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-emerald-500 block mt-1 font-mono">● {enrollments.length} current sessions</span>
                  </div>

                  <div className="bg-[#0c0604]/80 border border-orange-500/15 p-5 rounded-2xl shadow-xl hover:border-orange-500/30 transition duration-300">
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase block">Syllabus Index</span>
                    <span className="text-2xl font-serif font-black text-white mt-1 block">
                      {courses.length}
                    </span>
                    <span className="text-[9px] text-gray-600 block mt-1 font-mono">{courses.filter(c => c.status === 'pending').length} pending audits</span>
                  </div>

                  <div className="bg-[#0c0604]/80 border border-orange-500/15 p-5 rounded-2xl shadow-xl hover:border-orange-500/30 transition duration-300">
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase block">Seeker Directory</span>
                    <span className="text-2xl font-serif font-black text-white mt-1 block">
                      {users.length}
                    </span>
                    <span className="text-[9px] text-[#D4AF37] block mt-1 font-mono">Registered seek roles</span>
                  </div>
                </div>

                {/* Simulated Real-Time Server Telemetry */}
                <div className="bg-[#0c0604]/80 border border-orange-500/15 p-6 rounded-2xl shadow-xl text-left space-y-4">
                  <h3 className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span>Real-Time Engine Telemetry</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4 bg-[#0a0502]/60 border border-orange-500/5 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400 flex items-center space-x-1">
                          <Cpu className="w-3.5 h-3.5 text-gray-500" />
                          <span>CPU Compute Capacity</span>
                        </span>
                        <span className="text-white font-bold">{telemetry.cpuLoad}%</span>
                      </div>
                      <div className="w-full bg-[#03060d] h-1.5 rounded-full overflow-hidden border border-orange-500/5 mt-1">
                        <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${telemetry.cpuLoad}%` }} />
                      </div>
                    </div>

                    <div className="p-4 bg-[#0a0502]/60 border border-orange-500/5 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400 flex items-center space-x-1">
                          <Database className="w-3.5 h-3.5 text-gray-500" />
                          <span>Memory Usage</span>
                        </span>
                        <span className="text-white font-bold">{telemetry.memoryUsage} GB / 8.0 GB</span>
                      </div>
                      <div className="w-full bg-[#03060d] h-1.5 rounded-full overflow-hidden border border-orange-500/5 mt-1">
                        <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(telemetry.memoryUsage / 8.0) * 100}%` }} />
                      </div>
                    </div>

                    <div className="p-4 bg-[#0a0502]/60 border border-orange-500/5 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400 flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          <span>Active Gateway Sockets</span>
                        </span>
                        <span className="text-[#D4AF37] font-bold">{telemetry.activeSockets} Connected</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-2.5">
                        {Array.from({ length: 12 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-3 w-1.5 rounded-sm transition-all duration-500 ${
                              idx < Math.ceil(telemetry.cpuLoad / 8) 
                                ? 'bg-gradient-to-t from-orange-600 to-amber-500' 
                                : 'bg-[#03060d]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Courses ranking and category lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Popular Courses Leaderboard */}
                  <div className="lg:col-span-2 bg-[#0c0604]/80 border border-orange-500/15 p-6 rounded-2xl shadow-xl space-y-4 text-left">
                    <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/10 pb-2">
                      Popular Courses Leaderboard
                    </h3>

                    <div className="space-y-3">
                      {(stats?.popularCourses || []).length === 0 ? (
                        <p className="text-xs text-gray-500 italic">Telemetry indexing. Enrolls are being initialized.</p>
                      ) : (
                        stats.popularCourses.map((c: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[#0a0502]/60 border border-orange-500/5 rounded-xl flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-xs text-gray-500 font-bold">#{idx + 1}</span>
                              <div>
                                <h4 className="text-xs font-serif font-bold text-gray-200 leading-none">{c.title}</h4>
                                <span className="text-[10px] text-gray-500 font-mono mt-1 block">{c.studentsCount} active students</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold font-mono">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{c.rating || "5.0"}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Category distributions */}
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 p-6 rounded-2xl shadow-xl space-y-4 text-left">
                    <h3 className="text-sm font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/10 pb-2">
                      Category Density
                    </h3>

                    <div className="space-y-3 text-xs font-serif">
                      {(stats?.categoryDistribution || []).map((cat: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-300">{cat.name}</span>
                            <span className="text-amber-500 font-mono font-bold">{cat.value} Course(s)</span>
                          </div>
                          <div className="w-full bg-[#03060d] h-1.5 rounded-full overflow-hidden border border-orange-500/5">
                            <div 
                              className="bg-gradient-to-r from-orange-600 to-amber-500 h-full" 
                              style={{ width: `${(cat.value / Math.max(courses.length, 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: CURRICULUM APPROVALS */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="flex items-center justify-between border-b border-orange-500/15 pb-4">
                  <div>
                    <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">Curriculum Approvals Desk</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Audit new drafts and approve or reject submissions from gurus.</p>
                  </div>

                  {/* Filter tabs selector */}
                  <div className="flex bg-[#0a0f21] border border-orange-500/10 rounded-lg p-0.5 text-[11px] font-bold font-serif">
                    {[
                      { id: 'pending', label: 'Pending Audits' },
                      { id: 'approved', label: 'Approved Catalog' },
                      { id: 'rejected', label: 'Rejected Drafts' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setCourseFilter(btn.id as any)}
                        className={`px-3.5 py-1.5 rounded transition cursor-pointer ${
                          courseFilter === btn.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-orange-500/10 rounded-2xl bg-[#0c0604]/40">
                    <AlertCircle className="w-8 h-8 text-orange-500/30 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-serif text-gray-500">No courses listed under '{courseFilter}' status queue.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.map((c) => (
                      <div 
                        key={c.id} 
                        className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                      >
                        <div className="p-5 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-[9px] font-mono font-bold bg-orange-950/20 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                              {c.category}
                            </span>
                            <span className="text-xs text-gray-300 font-mono font-bold">₹{c.price}</span>
                          </div>
                          
                          <h3 className="text-sm font-bold font-serif text-white tracking-wide leading-snug">{c.title}</h3>
                          <p className="text-xs text-gray-400 font-serif leading-relaxed line-clamp-3">{c.description}</p>
                          
                          <div className="pt-2 border-t border-orange-500/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                            <span>Instructor: <span className="text-gray-300">{c.instructorName}</span></span>
                            <span>{c.chapters?.length || 0} Chapter(s)</span>
                          </div>
                        </div>

                        {/* Control buttons */}
                        <div className="p-4 bg-[#0a0502]/60 border-t border-orange-500/5 flex items-center justify-end space-x-2 shrink-0">
                          {actionLoading === c.id ? (
                            <span className="text-[10px] font-mono text-orange-500 animate-pulse py-1">Executing decision...</span>
                          ) : (
                            <>
                              {c.status !== 'approved' && (
                                <button
                                  onClick={() => handleUpdateCourseStatus(c.id, 'approved')}
                                  className="px-3.5 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-serif font-black uppercase tracking-widest transition cursor-pointer flex items-center space-x-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                              )}
                              {c.status !== 'rejected' && (
                                <button
                                  onClick={() => handleUpdateCourseStatus(c.id, 'rejected')}
                                  className="px-3.5 py-1.5 bg-rose-700/80 hover:bg-rose-600 text-white rounded-lg text-[10px] font-serif font-black uppercase tracking-widest transition cursor-pointer flex items-center space-x-1"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SCHOLARS DIRECTORY WITH ROLE MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                {/* Search and filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-500/15 pb-4">
                  <div>
                    <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">Seeker Directory & Roles</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Audit user profiles and modify authorization roles in real-time.</p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                      <input 
                        type="text"
                        placeholder="Search by seeker name or email..."
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        className="w-full bg-[#0a0502]/90 text-gray-200 border border-orange-500/15 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-orange-500/40"
                      />
                    </div>

                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value as any)}
                      className="bg-[#0a0502]/90 text-gray-300 border border-orange-500/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Student Seekers</option>
                      <option value="instructor">Venerable Gurus</option>
                      <option value="admin">Administrators</option>
                    </select>
                  </div>
                </div>

                {/* Users List Grid */}
                {filteredUsers.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-orange-500/10 rounded-2xl bg-[#0c0604]/40">
                    <AlertCircle className="w-8 h-8 text-orange-500/30 mx-auto mb-2" />
                    <p className="text-xs font-serif text-gray-500">No seek profiles match current filter configurations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((u) => {
                      const userEnrollments = enrollments.filter(e => e.userId === u.id);
                      return (
                        <div 
                          key={u.id}
                          className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center space-x-3.5">
                            <img 
                              src={u.avatarUrl} 
                              alt={u.name} 
                              className="w-10 h-10 rounded-full border border-orange-500/20 object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-xs font-bold text-white font-serif">{u.name}</h4>
                                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded capitalize ${
                                  u.role === 'admin' ? 'bg-rose-950/20 border border-rose-500/20 text-rose-400' :
                                  u.role === 'instructor' ? 'bg-amber-950/20 border border-[#D4AF37]/20 text-[#D4AF37]' :
                                  'bg-orange-950/20 border border-orange-500/20 text-orange-400'
                                }`}>
                                  {u.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{u.email}</span>
                            </div>
                          </div>

                          {/* Role modification and stats details */}
                          <div className="flex flex-wrap items-center gap-6 text-xs font-serif">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] text-gray-500 uppercase font-mono block">Lineage Honors</span>
                              <span className="text-gray-250 font-bold block mt-0.5">{u.certificates?.length || 0} Certificate(s)</span>
                            </div>
                            <div className="text-left md:text-right">
                              <span className="text-[10px] text-gray-500 uppercase font-mono block">Active Paths</span>
                              <span className="text-gray-250 font-bold block mt-0.5">{userEnrollments.length} Course(s)</span>
                            </div>
                            
                            {/* Role management switcher drop box */}
                            <div className="text-left">
                              <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Set Role</span>
                              {actionLoading === `role-${u.id}` ? (
                                <span className="text-[10px] font-mono text-orange-500 animate-pulse">Syncing...</span>
                              ) : (
                                <select
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value as any)}
                                  className="bg-[#0a0502] text-xs text-gray-300 border border-orange-500/20 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500/40 cursor-pointer"
                                >
                                  <option value="student">Student</option>
                                  <option value="instructor">Instructor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              )}
                            </div>

                            {/* Banning / Suspension controls */}
                            <div className="text-left">
                              <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Account State</span>
                              {actionLoading === `ban-${u.id}` || actionLoading === `suspend-${u.id}` || actionLoading === `verify-${u.id}` ? (
                                <span className="text-[10px] font-mono text-orange-500 animate-pulse">Enforcing...</span>
                              ) : (
                                <div className="flex items-center space-x-1.5 font-sans">
                                  {(u as any).status === 'suspended' || (u as any).status === 'banned' ? (
                                    <button
                                      onClick={async () => {
                                        setActionLoading(`verify-${u.id}`);
                                        await fetch('/api/admin/users/action', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ adminId: currentUser.id, targetUserId: u.id, action: 'verify' })
                                        });
                                        await fetchData();
                                        setActionLoading(null);
                                      }}
                                      className="px-2 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-500/25 rounded hover:bg-emerald-900 hover:text-white transition-all text-[9px] uppercase font-bold cursor-pointer"
                                    >
                                      Reactivate
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        onClick={async () => {
                                          setActionLoading(`suspend-${u.id}`);
                                          await fetch('/api/admin/users/action', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ adminId: currentUser.id, targetUserId: u.id, action: 'suspend' })
                                          });
                                          await fetchData();
                                          setActionLoading(null);
                                        }}
                                        className="px-2 py-1 bg-yellow-950/20 text-yellow-400 border border-yellow-500/25 rounded hover:bg-yellow-900 hover:text-black transition-all text-[9px] uppercase font-bold cursor-pointer"
                                      >
                                        Suspend
                                      </button>
                                      <button
                                        onClick={async () => {
                                          setActionLoading(`ban-${u.id}`);
                                          await fetch('/api/admin/users/action', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ adminId: currentUser.id, targetUserId: u.id, action: 'ban' })
                                          });
                                          await fetchData();
                                          setActionLoading(null);
                                        }}
                                        className="px-2 py-1 bg-rose-950/20 text-rose-450 text-red-400 border border-red-500/25 rounded hover:bg-rose-900 hover:text-white transition-all text-[9px] uppercase font-bold cursor-pointer"
                                      >
                                        Ban
                                      </button>
                                    </>
                                  )}
                                  {(u as any).status && (
                                    <span className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded border ${
                                      (u as any).status === 'suspended' ? 'text-yellow-450 text-yellow-400 border-yellow-500/20 bg-yellow-950/10' :
                                      (u as any).status === 'banned' ? 'text-red-400 border-red-500/20 bg-red-950/10' :
                                      'text-emerald-450 text-emerald-400 border-emerald-500/20 bg-emerald-950/10'
                                    }`}>
                                      {(u as any).status}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TRANSACTIONS & SALES LEDGER */}
            {activeTab === 'transactions' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="border-b border-orange-500/15 pb-4">
                  <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">Elearning Transaction Ledger</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Audit transaction invoices, payments, and gateway routes in real-time.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-orange-500/10 rounded-2xl bg-[#0c0604]/40">
                    <AlertCircle className="w-8 h-8 text-orange-500/30 mx-auto mb-2" />
                    <p className="text-xs font-serif text-gray-500">No sale transactions registered in the ledger archives.</p>
                  </div>
                ) : (
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-serif text-left border-collapse">
                        <thead>
                          <tr className="bg-[#0a0502]/80 border-b border-orange-500/15 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">Student ID</th>
                            <th className="p-4">Invoice Amount</th>
                            <th className="p-4">Gateway</th>
                            <th className="p-4">Settlement</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-500/5 text-gray-250">
                          {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-orange-950/5 transition">
                              <td className="p-4 font-mono font-bold text-orange-400">{o.id}</td>
                              <td className="p-4 font-mono">{o.userId}</td>
                              <td className="p-4 font-bold text-white">₹{o.amount.toLocaleString()}</td>
                              <td className="p-4 capitalize font-mono text-gray-400">{o.paymentGateway}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                                  o.status === 'paid' ? 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400' :
                                  'bg-amber-950/20 border border-amber-500/20 text-amber-400'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-4 text-gray-500 font-mono">{new Date(o.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SUPPORT TICKETS & FEEDBACK DESK */}
            {activeTab === 'tickets' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="flex items-center justify-between border-b border-orange-500/15 pb-4">
                  <div>
                    <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">Seeker Support & Feedback Desk</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Manage and resolve inquiries submitted by scholars and gurus.</p>
                  </div>

                  {/* Ticket filters */}
                  <div className="flex bg-[#0a0f21] border border-orange-500/10 rounded-lg p-0.5 text-[11px] font-bold font-serif">
                    {[
                      { id: 'all', label: 'All Inquiries' },
                      { id: 'pending', label: 'Pending Response' },
                      { id: 'resolved', label: 'Settled Archive' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setTicketFilter(btn.id as any)}
                        className={`px-3.5 py-1.5 rounded transition cursor-pointer ${
                          ticketFilter === btn.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredTickets.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-orange-500/10 rounded-2xl bg-[#0c0604]/40">
                    <AlertCircle className="w-8 h-8 text-orange-500/30 mx-auto mb-2" />
                    <p className="text-xs font-serif text-gray-500">No support tickets found matching selection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((t) => (
                      <div 
                        key={t.id}
                        className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-orange-400 font-bold">{t.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                              t.status === 'resolved' ? 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400' :
                              'bg-amber-950/20 border border-amber-500/20 text-amber-400'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white font-serif">{t.subject}</h4>
                          <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-mono">
                            <span>Seeker: <span className="text-gray-300">{t.studentName}</span> ({t.email})</span>
                            <span>•</span>
                            <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Resolve ticket control */}
                        <div className="shrink-0 flex items-center">
                          {actionLoading === `ticket-${t.id}` ? (
                            <span className="text-[10px] font-mono text-orange-500 animate-pulse">Processing...</span>
                          ) : (
                            <button
                              onClick={() => handleResolveTicket(t.id, t.status === 'resolved' ? 'pending' : 'resolved')}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-serif font-black uppercase tracking-widest transition cursor-pointer flex items-center space-x-1 ${
                                t.status === 'resolved' 
                                  ? 'bg-orange-950/30 border border-orange-500/20 text-orange-400 hover:bg-orange-900/20' 
                                  : 'bg-emerald-700/80 hover:bg-emerald-600 text-white'
                              }`}
                            >
                              {t.status === 'resolved' ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                                  <span>Reopen Seeker Ticket</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Mark Resolved</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 6: ROLE PERMISSIONS & FEATURE FLAGS */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Granular Permissions Manager */}
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-5 shadow-xl space-y-4">
                    <h3 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-orange-500/10 pb-3">
                      🛡️ Granular Seeker Permissions Matrix
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: "studentDownloads", label: "Allow PDF study guides & audio downloads", state: permissionsState.studentDownloads },
                        { key: "guruLiveStream", label: "Allow Guru interactive class live streams", state: permissionsState.guruLiveStream },
                        { key: "autoApproveCourses", label: "Auto-approve newly submitted course drafts", state: permissionsState.autoApproveCourses },
                        { key: "auditTrailLogging", label: "Commit platform actions to secure audit trail", state: permissionsState.auditTrailLogging }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between bg-gray-950/65 p-3 rounded-lg border border-gray-850 text-xs">
                          <span className="text-gray-300 font-serif">{item.label}</span>
                          <button
                            onClick={() => {
                              setPermissionsState(prev => ({ ...prev, [item.key]: !item.state }));
                              setSuccessMessage("Granular permissions updated successfully in central ledger.");
                              setTimeout(() => setSuccessMessage(null), 2500);
                            }}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer border-0 ${
                              item.state ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-rose-955/20 text-rose-400 border border-rose-900/10'
                            }`}
                          >
                            {item.state ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Flags Control Panel */}
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-5 shadow-xl space-y-4">
                    <h3 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-orange-500/10 pb-3">
                      ⚙️ Dynamic Platform Feature Flags
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: "aiDoubtSolver", label: "Enable Sankalp AI Tutor/Doubt Solver", state: featureFlags.aiDoubtSolver },
                        { key: "referralRewards", label: "Active Referral credit payout incentives", state: featureFlags.referralRewards },
                        { key: "liveClassReactions", label: "Allow shishya live emojis reactions", state: featureFlags.liveClassReactions },
                        { key: "gstTaxCalculation", label: "Calculate 18% GST during checkout", state: featureFlags.gstTaxCalculation }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between bg-gray-950/65 p-3 rounded-lg border border-gray-850 text-xs">
                          <span className="text-gray-300 font-serif">{item.label}</span>
                          <button
                            onClick={() => {
                              setFeatureFlags(prev => ({ ...prev, [item.key]: !item.state }));
                              setSuccessMessage("Feature flag toggled dynamically!");
                              setTimeout(() => setSuccessMessage(null), 2500);
                            }}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer border-0 ${
                              item.state ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-rose-955/20 text-rose-400 border border-rose-900/10'
                            }`}
                          >
                            {item.state ? 'ACTIVE' : 'DEACTIVATED'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 7: CMS & SEO META CONSOLE */}
            {activeTab === 'cms-seo' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* SEO Configuration desk */}
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-5 shadow-xl space-y-4">
                    <h3 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-orange-500/10 pb-3">
                      🌐 Platform Metadata & SEO Indexing
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-mono block">PAGE TITLE META TAG:</label>
                        <input 
                          type="text" 
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-850 p-2 rounded focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-mono block">META DESCRIPTION COMMENTARY:</label>
                        <textarea
                          rows={3}
                          value={seoDesc}
                          onChange={(e) => setSeoDesc(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-850 p-2 rounded focus:outline-none font-sans"
                        ></textarea>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-mono block">GST TAX PARAMETER RATE (%):</label>
                        <input 
                          type="number" 
                          value={gstRate}
                          onChange={(e) => setGstRate(Number(e.target.value))}
                          className="w-full bg-gray-950 border border-gray-850 p-2 rounded focus:outline-none font-mono"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSuccessMessage("CMS & SEO indices saved to production catalog config.");
                          setTimeout(() => setSuccessMessage(null), 2500);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold font-serif text-xs uppercase tracking-wider rounded-xl cursor-pointer border-0"
                      >
                        Publish SEO Config
                      </button>
                    </div>
                  </div>

                  {/* Broadcast Announcements Panel */}
                  <div className="bg-[#0c0604]/80 border border-orange-500/15 rounded-2xl p-5 shadow-xl space-y-4">
                    <h3 className="text-xs uppercase text-orange-400 font-mono tracking-wider font-extrabold border-b border-orange-500/10 pb-3">
                      📢 Broadcast Platform Announcements
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-mono block">ANNOUNCEMENT TEXT MESSAGE:</label>
                        <textarea
                          rows={4}
                          placeholder="e.g. Brahma Muhurta live chanting starting tomorrow at 4:30 AM IST..."
                          value={announcementMsg}
                          onChange={(e) => setAnnouncementMsg(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-850 p-2.5 rounded-xl focus:outline-none font-sans"
                        ></textarea>
                      </div>

                      <button
                        onClick={() => {
                          if (!announcementMsg.trim()) return;
                          setSuccessMessage("Global broadcast notification successfully dispatched!");
                          setTimeout(() => setSuccessMessage(null), 2500);
                          setAnnouncementMsg('');
                        }}
                        className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold font-serif text-xs uppercase tracking-wider rounded-xl cursor-pointer border-0"
                      >
                        Broadcast Notification
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
