import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AuthModal() {
  const { isAuthModalOpen, authView, closeAuthModal, setAuthView, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('student');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login based on selected role
    login({ name: name || 'Demo User', email, role });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header pattern */}
        <div className="h-32 bg-[var(--color-occult-purple)] relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
          <Sparkles className="w-8 h-8 text-amber-300 mb-2 z-10" />
          <h2 className="text-xl font-serif font-bold text-white z-10">
            {authView === 'login' ? 'Welcome Back' : 'Begin Your Journey'}
          </h2>
        </div>

        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {authView === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-occult-purple)]/50 focus:border-[var(--color-occult-purple)]"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-occult-purple)]/50 focus:border-[var(--color-occult-purple)]"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-occult-purple)]/50 focus:border-[var(--color-occult-purple)]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Role Selection (Simulation feature) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Simulate Role (Demo)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${role === 'student' ? 'bg-[var(--color-occult-purple)] text-white border-transparent shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${role === 'instructor' ? 'bg-[var(--color-occult-purple)] text-white border-transparent shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                Guru
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${role === 'admin' ? 'bg-red-600 text-white border-transparent shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-[var(--color-occult-purple)] hover:bg-[var(--color-occult-purple-light)] text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-[var(--color-occult-purple)]/30 transition-all active:scale-[0.98] mt-4">
            {authView === 'login' ? 'Enter Sanctuary' : 'Create Sacred Account'}
          </button>
        </form>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            {authView === 'login' ? "Don't have an account? " : "Already initiated? "}
            <button 
              onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')}
              className="text-[var(--color-occult-purple)] font-bold hover:underline"
            >
              {authView === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
