import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { setSession } from '@/lib/store';
import { UserRole, UserSession } from '@/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = (role: 'freelancer' | 'client') => {
    const session: UserSession = {
      id: role === 'freelancer' ? 'prof_rohan' : 'client_robotics',
      displayName: role === 'freelancer' ? 'Rohan Verma' : 'Robotics & AI Society',
      avatarUrl: role === 'freelancer' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      roles: [role as UserRole],
      currentRole: role as UserRole,
      department: role === 'freelancer' ? 'B.Tech Computer Science' : 'Student Activities',
      year: '3rd Year',
    };
    setSession(session);
    navigate(role === 'freelancer' ? '/gigs' : '/talent');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      id: `user_${Date.now()}`,
      displayName: email.split('@')[0] || 'Campus Student',
      roles: ['client' as UserRole, 'freelancer' as UserRole],
      currentRole: 'client',
      department: 'Campus Member',
      year: 'Active',
    };
    setSession(session);
    navigate('/gigs');
  };

  return (
    <div className="py-8 sm:py-16 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Top Sparkle Icon in Blue Rounded Square (Matches Image 2) */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6 text-orange-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Log In to CampusGigs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Access your campus gigs, applications, and student talent profile.
          </p>
        </div>

        {/* ONE-CLICK DEMO ACCESS (Matches Image 2) */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center block">
            ONE-CLICK DEMO ACCESS
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('freelancer')}
              className="py-2.5 px-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold transition-colors text-center"
            >
              Student Freelancer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('client')}
              className="py-2.5 px-3 rounded-xl border border-orange-200 dark:border-orange-900/60 bg-orange-50/50 dark:bg-orange-950/40 hover:bg-orange-100/60 dark:hover:bg-orange-900/60 text-[#B84B30] dark:text-orange-300 font-bold transition-colors text-center"
            >
              Campus Club Lead
            </button>
          </div>
        </div>

        {/* Form Separator */}
        <div className="relative text-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            OR WITH CAMPUS EMAIL
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              UNIVERSITY EMAIL *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@campus.edu"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Must be a valid .edu or campus email address.</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              PASSWORD *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-sm shadow-xs transition-colors active:scale-95"
          >
            Log In
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
};
