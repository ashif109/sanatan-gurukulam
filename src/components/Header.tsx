import React, { useState } from 'react';
import { Bell, User, Award, Shield, LogOut, ChevronDown, CheckCircle, Globe, ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import { UserProfile, Notification } from '../types';
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
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({
  currentUser,
  notifications,
  onSwitchRole,
  onNavigate,
  activeTab,
  onClearNotifications,
  onCartClick,
  cartCount,
  theme = 'dark',
  onToggleTheme,
  language,
  onLanguageChange,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isCalculatorTab = ['jyotish', 'astrology-kundli', 'astrology-planetary', 'astrology-panchang', 'numerology', 'ram-shalaka', 'tarot'].includes(activeTab);

  const isLightTheme = theme === 'light';

  const dropdownClass = (widthClass = 'w-48') => `absolute left-0 mt-1 hidden group-hover:block ${widthClass} rounded-xl shadow-2xl p-1 z-50 animate-in fade-in duration-150 ${
    isLightTheme 
      ? 'bg-[#fcfbf9] border border-orange-500/15 text-gray-800' 
      : 'bg-[#0c0604] border border-orange-500/25 text-gray-300'
  }`;

  const navBtnClass = (active: boolean) => {
    return `px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-250 cursor-pointer whitespace-nowrap ${
      active 
        ? (isLightTheme ? 'text-orange-600 border-b-2 border-orange-600 rounded-none' : 'text-orange-400 border-b-2 border-orange-500 rounded-none') 
        : (isLightTheme ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-500/5' : 'text-gray-300 hover:text-orange-400')
    }`;
  };

  const dropBtnClass = `w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1.5 ${
    isLightTheme 
      ? 'hover:bg-orange-50/50 text-gray-700 hover:text-orange-600' 
      : 'hover:bg-orange-950/20 text-gray-300 hover:text-orange-400'
  }`;

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md px-4 py-3 sm:px-6 transition-all duration-200 ${
      isLightTheme 
        ? 'bg-[#fcfbf9]/95 text-gray-850 border-b border-orange-500/10 shadow-md' 
        : 'bg-[#080402]/95 text-white border-b border-orange-500/20 shadow-2xl'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Glowing Sacred Logo & Name matching screenshots */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3.5 cursor-pointer group select-none"
          id="brand-logo"
        >
          <div className="relative bg-gradient-to-tr from-orange-600 to-amber-500 p-2.5 rounded-full text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-all duration-300">
            <span className="text-xl font-bold font-serif leading-none block">ॐ</span>
          </div>
          <div className="flex flex-col justify-center whitespace-nowrap">
            <h1 className="text-lg sm:text-xl font-bold font-serif tracking-widest bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent select-none whitespace-nowrap">
              SANATAN GURUKUL
            </h1>
            <p className={`text-[9px] font-serif tracking-widest uppercase font-semibold whitespace-nowrap ${isLightTheme ? 'text-orange-600/80' : 'text-orange-400/80'}`}>
              तमसो मा ज्योतिर्गमय
            </p>
          </div>
        </div>

        {/* Global Navigation matching requested specs */}
        <nav className="hidden xl:flex items-center space-x-1.5 font-serif">
          <button
            onClick={() => onNavigate('home')}
            className={navBtnClass(activeTab === 'home')}
          >
            {t('nav.about', language)}
          </button>

          <div className="relative group">
            <button
              onClick={() => onNavigate('explore')}
              className={navBtnClass(activeTab === 'explore')}
            >
              <span>{t('nav.courses', language)}</span>
              <ChevronDown className="w-3 h-3 text-orange-500" />
            </button>
            <div className={dropdownClass('w-48')}>
              <button onClick={() => onNavigate('explore')} className={dropBtnClass}>{t('nav.allCourses', language)}</button>
              <button onClick={() => onNavigate('explore')} className={dropBtnClass}>{t('nav.astrologyDropdown', language)}</button>
              <button onClick={() => onNavigate('explore')} className={dropBtnClass}>{t('nav.linguisticsDropdown', language)}</button>
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={() => onNavigate('astrology-kundli')}
              className={navBtnClass(isCalculatorTab)}
            >
              <span>{t('nav.calculators', language)}</span>
              <ChevronDown className="w-3 h-3 text-orange-500" />
            </button>
            <div className={dropdownClass('w-56')}>
              <button onClick={() => onNavigate('astrology-kundli')} className={dropBtnClass}>🕉️ Kundli Chart Generator</button>
              <button onClick={() => onNavigate('astrology-planetary')} className={dropBtnClass}>🪐 Astrological Planetary Positions</button>
              <button onClick={() => onNavigate('astrology-panchang')} className={dropBtnClass}>🌞 Panchang & Muhurat</button>
              <button onClick={() => onNavigate('numerology')} className={dropBtnClass + " border-t border-orange-500/10 mt-1 pt-2"}>🔢 Numerology Calculator</button>
              <button onClick={() => onNavigate('ram-shalaka')} className={dropBtnClass + " border-t border-orange-500/10 mt-1 pt-2"}>🏹 Ram Shalaka Prashnavali</button>
              <button onClick={() => onNavigate('tarot')} className={dropBtnClass + " border-t border-orange-500/10 mt-1 pt-2"}>🔮 Tarot Guidance Oracle</button>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className={navBtnClass(activeTab === 'free-masterclass')}
          >
            {t('nav.masterclass', language)}
          </button>
        </nav>

        {/* Right Interactions Panel */}
        <div className="flex items-center space-x-3 text-white">
          
          {/* LOGIN Option from visual layout */}
          <button 
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="text-xs font-bold tracking-wider font-serif uppercase text-gray-200 hover:text-orange-400 cursor-pointer py-1.5 transition-colors whitespace-nowrap"
          >
            {t('nav.login', language)}
          </button>

          {/* EXPLORE WEBINARS Button matching screenshot */}
          <button 
            onClick={() => onNavigate('home')}
            className="hidden md:inline-block px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-all active:scale-98 shadow-[0_0_15px_rgba(249,115,22,0.15)] whitespace-nowrap font-medium"
          >
            {t('nav.webinars', language)}
          </button>

          {/* CART Icon matching screenshot */}
          <button 
            onClick={onCartClick || (() => onNavigate('explore'))}
            className="p-2 border border-orange-500/25 text-orange-400 hover:text-orange-300 hover:bg-orange-950/15 rounded-lg cursor-pointer transition-all whitespace-nowrap relative"
            title="Spiritual Basket"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {cartCount !== undefined && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-[8px] font-sans font-bold text-white px-1.5 py-0.5 rounded-full select-none leading-none border border-[#080402]">
                {cartCount}
              </span>
            )}
          </button>

          {/* THEME TOGGLE (Sun/Moon) */}
          <button 
            onClick={onToggleTheme}
            className="p-2 border border-orange-500/25 text-orange-400 hover:text-orange-300 hover:bg-orange-950/15 rounded-lg cursor-pointer transition-all whitespace-nowrap"
            title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Language Selector Dropdown supporting 3 languages */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-orange-950/20 border border-orange-500/10 hover:border-orange-500/30 rounded-lg text-xs text-orange-400/95 font-sans cursor-pointer transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span className="capitalize">{language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'संस्कृतम्'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-orange-500" />
            </button>
            {langDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-32 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in duration-200 ${
                isLightTheme ? 'bg-[#fcfbf9] border border-orange-500/15 text-gray-800' : 'bg-[#0c0604] border border-orange-500/20'
              }`}>
                <button
                  onClick={() => { onLanguageChange('en'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    language === 'en' 
                      ? 'bg-orange-950/30 text-orange-400 font-bold' 
                      : (isLightTheme ? 'text-gray-700 hover:bg-orange-500/5 hover:text-orange-600' : 'text-gray-300 hover:bg-orange-950/10 hover:text-orange-400')
                  }`}
                >
                  <span>🌐</span>
                  <span>English</span>
                </button>
                <button
                  onClick={() => { onLanguageChange('hi'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    language === 'hi' 
                      ? 'bg-orange-950/30 text-orange-400 font-bold' 
                      : (isLightTheme ? 'text-gray-700 hover:bg-orange-500/5 hover:text-orange-600' : 'text-gray-300 hover:bg-orange-950/10 hover:text-orange-400')
                  }`}
                >
                  <span>🕉️</span>
                  <span>हिन्दी</span>
                </button>
                <button
                  onClick={() => { onLanguageChange('sa'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    language === 'sa' 
                      ? 'bg-orange-950/30 text-orange-400 font-bold' 
                      : (isLightTheme ? 'text-gray-700 hover:bg-orange-500/5 hover:text-orange-600' : 'text-gray-300 hover:bg-orange-950/10 hover:text-orange-400')
                  }`}
                >
                  <span>📜</span>
                  <span>संस्कृतम्</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Desk */}
          <div className="relative">
            <button
              id="notif-bell-btn"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-950/25 rounded-lg transition-all cursor-pointer border border-transparent hover:border-orange-500/10"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className={`absolute right-0 mt-2.5 w-80 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                isLightTheme ? 'bg-[#fcfbf9] border border-orange-500/15 text-gray-800' : 'bg-[#0c0604] border border-orange-500/20'
              }`}>
                <div className="flex items-center justify-between px-3 py-2 border-b border-orange-500/10">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest font-serif">Aura Broadcasts</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={onClearNotifications}
                      className="text-[10px] text-orange-500 hover:text-amber-400 cursor-pointer"
                    >
                      Dismiss Messages
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto mt-1 space-y-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6 font-serif">The ethers are completely silent.</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-lg text-xs transition-colors ${n.read ? 'bg-transparent text-gray-400' : 'bg-orange-950/10 text-gray-200 border-l-2 border-orange-500'}`}
                      >
                        <div className="font-semibold flex items-center justify-between mb-0.5">
                          <span className="font-serif text-orange-300">{n.title}</span>
                          <span className="text-[9px] text-[#f97316]/50 font-mono">Present</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-[11px]">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              id="profile-dropdown-btn"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-orange-950/20 border border-transparent hover:border-orange-500/10 transition-all text-left cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" 
                alt="Sadhak Avatar" 
                className="w-8 h-8 rounded-full border border-orange-500/40 object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-[9px] text-orange-400 font-serif capitalize tracking-wide leading-none mt-1">{currentUser.role === 'instructor' ? 'Venerable Guru' : currentUser.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-orange-500" />
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-1 z-50 text-xs font-serif animate-in fade-in duration-200 ${
                isLightTheme ? 'bg-[#fcfbf9] border border-orange-500/15 text-gray-850' : 'bg-[#0c0604] border border-orange-500/20'
              }`}>
                <div className="p-3 border-b border-orange-500/10">
                  <p className={`font-bold font-serif ${isLightTheme ? 'text-orange-700' : 'text-orange-300'}`}>{currentUser.name}</p>
                  <p className={`text-[10px] font-mono overflow-hidden text-ellipsis ${isLightTheme ? 'text-gray-500' : 'text-orange-500/70'}`}>{currentUser.email}</p>
                </div>
                
                <div className="p-1 space-y-0.5">
                  <button 
                    onClick={() => { onNavigate('profile'); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer ${
                      isLightTheme ? 'hover:bg-orange-500/5 text-gray-700 hover:text-orange-600' : 'hover:bg-orange-950/20 text-gray-300 hover:text-orange-400'
                    }`}
                  >
                    <User className="w-4 h-4 text-orange-400" />
                    <span>My Spiritual Path</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('my-courses'); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer ${
                      isLightTheme ? 'hover:bg-orange-500/5 text-gray-700 hover:text-orange-600' : 'hover:bg-orange-950/20 text-gray-300 hover:text-orange-400'
                    }`}
                  >
                    <Award className="w-4 h-4 text-orange-400" />
                    <span>My Sacred Learning</span>
                  </button>
                </div>

                {/* PREMIUM REFER & EARN PORTAL BOX */}
                <div className="p-2 border-t border-orange-500/10 bg-gradient-to-b from-orange-950/5 to-transparent">
                  <div className={`border rounded-xl p-2.5 space-y-1.5 shadow-md ${
                    isLightTheme ? 'bg-[#fdfcfb] border-orange-500/15' : 'bg-[#120703] border-orange-500/25'
                  }`}>
                    <div className="flex items-center space-x-1 px-0.5">
                      <span className="text-amber-400 font-serif font-bold text-xs">✨</span>
                      <span className="text-[9px] font-black tracking-widest text-[#f97316] uppercase font-serif">Refer & Earn portal</span>
                    </div>
                    <p className={`text-[10px] leading-relaxed font-serif ${isLightTheme ? 'text-gray-600 font-sans' : 'text-gray-300'}`}>
                      Share the timeless Vedic wisdom. Earn <span className="text-orange-600 dark:text-orange-400 font-semibold">Siddhi credits</span> for every registered seeker!
                    </p>
                    <button
                      onClick={() => { onNavigate('certification-ladder'); setDropdownOpen(false); }}
                      className="w-full py-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-[9px] uppercase tracking-widest rounded-lg transition-all cursor-pointer text-center"
                    >
                      Invite New Seekers
                    </button>
                  </div>
                </div>

                <div className="p-1 border-t border-orange-500/10">
                  <p className="text-[9px] text-orange-400/80 font-serif px-3 py-1.5 uppercase font-bold tracking-widest">Switch Aspect</p>
                  {(['student', 'instructor', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => { onSwitchRole(r); setDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg capitalize flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        currentUser.role === r 
                          ? (isLightTheme ? 'bg-orange-100 text-orange-700 font-semibold' : 'bg-orange-950/30 text-orange-300 font-semibold') 
                          : (isLightTheme ? 'hover:bg-orange-500/5 text-gray-500 hover:text-orange-600' : 'hover:bg-orange-950/10 text-gray-400 hover:text-orange-400')
                      }`}
                    >
                      <span className="font-serif">{r === 'instructor' ? 'Guru' : r} portal</span>
                      {currentUser.role === r && <CheckCircle className="w-3.5 h-3.5 text-orange-400 animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Icon for Responsive Layout */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-gray-300 hover:text-orange-400 hover:bg-orange-950/25 rounded-lg border border-transparent hover:border-orange-500/10 cursor-pointer transition-all active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <Menu className="w-5 h-5 text-orange-500" />}
          </button>

        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Overlay (Highly Responsive) */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 bg-[#0c0604] border border-orange-500/15 rounded-2xl shadow-2xl p-4 flex flex-col space-y-3.5 animate-in slide-in-from-top-5 duration-300 font-serif z-50 relative">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              activeTab === 'home' ? 'bg-orange-950/30 text-orange-400 border border-orange-500/20' : 'text-gray-300 hover:bg-orange-950/10 hover:text-orange-400'
            }`}
          >
            About Us
          </button>

          <div className="border-t border-orange-500/5 my-1" />

          {/* Courses Menu Block */}
          <div>
            <div className="px-4 py-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              Courses
            </div>
            <div className="space-y-1 mt-1 pl-2">
              <button
                onClick={() => { onNavigate('explore'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'explore' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                All Available Courses
              </button>
            </div>
          </div>

          <div className="border-t border-orange-500/5 my-1" />

          {/* Calculators Block */}
          <div>
            <div className="px-4 py-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              Calculators
            </div>
            <div className="space-y-1 mt-1 pl-2">
              <button
                onClick={() => { onNavigate('astrology-kundli'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'astrology-kundli' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                🕉️ Kundli Chart Generator
              </button>
              <button
                onClick={() => { onNavigate('astrology-planetary'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'astrology-planetary' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                🪐 Astrological Planetary Positions
              </button>
              <button
                onClick={() => { onNavigate('astrology-panchang'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'astrology-panchang' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                🌞 Panchang & Muhurat
              </button>
              <button
                onClick={() => { onNavigate('numerology'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'numerology' ? 'text-orange-400 font-bold border-l-2 border-orange-500 pl-2 rounded-none' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                🔢 Chald-Vedic Numerology Calculator
              </button>
              <button
                onClick={() => { onNavigate('ram-shalaka'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ram-shalaka' ? 'text-orange-400 font-bold border-l-2 border-orange-500 pl-2 rounded-none' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                🏹 Ram Shalaka Prashnavali
              </button>
              <button
                onClick={() => { onNavigate('tarot'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'tarot' ? 'text-orange-400 font-bold border-l-2 border-orange-500 pl-2 rounded-none' : 'text-gray-300 hover:text-orange-400'
                }`}
              >
                🔮 Tarot Guidance Oracle
              </button>
            </div>
          </div>

          <div className="border-t border-orange-500/5 my-1" />

          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              activeTab === 'free-masterclass' ? 'bg-orange-950/30 text-orange-400 border border-orange-500/20' : 'text-gray-300 hover:bg-orange-950/10 hover:text-orange-400'
            }`}
          >
            Free Masterclass
          </button>

          <div className="border-t border-orange-500/10 my-2" />

          <div className="flex items-center justify-between gap-2 pt-2 px-2">
            <button 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-serif font-bold text-[10px] uppercase tracking-wider rounded-lg text-center transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)]"
            >
              Explore Webinars
            </button>
          </div>

          {/* Quick Mobile Aspect Switcher */}
          <div className="bg-[#0f0805] p-2 rounded-xl border border-orange-500/10 flex md:hidden items-center justify-between mt-2">
            <span className="text-[9px] font-bold text-orange-400/80 font-serif px-1 uppercase">Aspect:</span>
            <div className="flex items-center space-x-1">
              {(['student', 'instructor', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => { onSwitchRole(r); setMobileMenuOpen(false); }}
                  className={`text-[9px] px-2 py-1 rounded-lg font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    currentUser.role === r 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-orange-400 hover:bg-orange-950/20'
                  }`}
                >
                  {r === 'instructor' ? 'guru' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
