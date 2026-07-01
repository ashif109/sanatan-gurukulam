import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Globe, ChevronDown, User } from 'lucide-react';
import { UserProfile, Notification } from '../types';
import { useAuthStore } from '../store/authStore';
import { Language, t } from '../localization';

interface HeaderProps {
  currentUser: UserProfile;
  notifications: Notification[];
  onSwitchRole: (role: 'student' | 'instructor' | 'admin') => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  onClearNotifications: () => void;
  onCartClick?: () => void;
  cartCount?: number;
  language: Language;
  theme?: string;
  onToggleTheme?: () => void;
  onLanguageChange: (lang: Language) => void;
  
}

export default function Header({
  currentUser,
  onNavigate,
  activeTab,
  onCartClick,
  cartCount,
  language,
  onLanguageChange,
  
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAuthModal } = useAuthStore();
  
  const isCalculatorTab = ['jyotish', 'astrology-kundli', 'astrology-planetary', 'astrology-panchang', 'numerology', 'ram-shalaka', 'tarot'].includes(activeTab);

  const navBtnClass = (active: boolean) => {
    return `text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
      active ? 'text-[var(--color-occult-purple)] border-b-2 border-[var(--color-occult-purple)] pb-[22px] pt-[24px]' : 'text-gray-700 hover:text-[var(--color-occult-purple)] py-[23px]'
    }`;
  };

  const subNavBtnClass = (active: boolean) => {
    return `text-sm transition-colors cursor-pointer whitespace-nowrap ${
      active ? 'text-[var(--color-occult-purple)] font-semibold' : 'text-gray-700 hover:text-[var(--color-occult-purple)]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm flex flex-col select-none">
      {/* Main Navbar */}
      <div className="w-full mx-auto px-6 max-w-7xl h-[80px] flex items-center justify-between border-b border-gray-100">

        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 border border-[var(--color-occult-purple)] rounded flex items-center justify-center text-[var(--color-occult-purple)] bg-white font-serif font-bold text-xl">
            OG
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-serif font-bold text-[var(--color-occult-purple)] leading-tight">Sanatan Gurukulam</span>
             <span className="text-[9px] uppercase tracking-wider text-gray-500 mt-0.5">Rise To The Elite 1%</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 h-full">
          <button onClick={() => onNavigate('home')} className={navBtnClass(activeTab === 'home')}>
            About Us
          </button>
          <button onClick={() => onNavigate('explore')} className={navBtnClass(activeTab === 'explore') + " flex items-center gap-1"}>
            Courses <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => onNavigate('astrology-kundli')} className={navBtnClass(isCalculatorTab)}>
            Calculators
          </button>
          <button onClick={() => onNavigate('home')} className={navBtnClass(activeTab === 'free-masterclass')}>
            Free Masterclass
          </button>
          <button onClick={() => onNavigate('home')} className={navBtnClass(activeTab === 'partner') + " flex items-center gap-2"}>
            Partner With Us <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          {currentUser && currentUser.id !== 'guest' ? (
             <div className="flex items-center gap-3">
               <button onClick={() => {
                  if (currentUser.role === 'admin' || currentUser.role === 'super_admin') onNavigate('admin-panel');
                  else if (currentUser.role === 'instructor') onNavigate('instructor-panel');
                  else onNavigate('student-portal');
               }} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                 {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-[var(--color-occult-purple)]" />}
               </button>
               <button onClick={() => onNavigate('explore')} className="hidden sm:block aw-btn-primary bg-[var(--color-occult-purple)] hover:bg-[var(--color-occult-purple-light)]">
                 Explore Courses
               </button>
             </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => openAuthModal('login')} className="hidden sm:block text-sm font-bold text-gray-700 hover:text-[var(--color-occult-purple)] transition-colors">
                Login
              </button>
              <button onClick={() => openAuthModal('signup')} className="hidden sm:block aw-btn-primary bg-[var(--color-occult-purple)] hover:bg-[var(--color-occult-purple-light)]">
                Sign Up
              </button>
            </div>
          )}

          <button onClick={onCartClick} className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-occult-purple-very-light)] text-[var(--color-occult-purple-light)] hover:bg-[#e9d5ff] transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            ) : null}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-[var(--color-occult-purple)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub Navbar */}
      <div className="w-full bg-[var(--color-occult-purple-very-light)] hidden md:block">
         <div className="w-full max-w-7xl mx-auto px-6 h-12 flex items-center justify-center space-x-8">
            <button className={subNavBtnClass(false)}>Blogs</button>
            <button className={subNavBtnClass(false)}>News</button>
            <button className={subNavBtnClass(false)}>Events</button>
            <button onClick={() => onNavigate('astrology-kundli')} className={subNavBtnClass(activeTab === 'astrology-kundli')}>Astrology</button>
            <button onClick={() => onNavigate('numerology')} className={subNavBtnClass(activeTab === 'numerology')}>Numerology</button>
            <button onClick={() => onNavigate('astrology-panchang')} className={subNavBtnClass(activeTab === 'astrology-panchang')}>Panchang</button>
            <button className={subNavBtnClass(false)}>Blank Chart</button>
            <button className={subNavBtnClass(false)}>Swar Vigyan</button>
            <button className={subNavBtnClass(false)}>Vastu</button>
            <button onClick={() => onNavigate('tarot')} className={subNavBtnClass(activeTab === 'tarot')}>Tarot</button>
         </div>
      </div>
    </header>
  );
}
