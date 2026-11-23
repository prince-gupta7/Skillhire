import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';
import { setSession } from '@/lib/store';
import { UserRole, UserSession } from '@/types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'client'>('freelancer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [campus, setCampus] = useState('State University');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      id: `user_${Date.now()}`,
      displayName: fullName || (selectedRole === 'client' ? 'Robotics & AI Society' : 'Rohan Verma'),
      roles: [selectedRole as UserRole],
      currentRole: selectedRole as UserRole,
      department: major || 'Computer Science',
      year: '3rd Year',
    };
    setSession(session);
    navigate('/talent');
  };

  return (
    <div className="py-8 sm:py-12 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Top Icon & Heading (Matches Image 1) */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-[#B84B30] flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Join CampusGigs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Verified campus community for student creators, coders, and clubs.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          
          {/* CHOOSE YOUR PRIMARY ROLE */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              CHOOSE YOUR PRIMARY ROLE
            </span>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Freelancer Box */}
              <div
                onClick={() => setSelectedRole('freelancer')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedRole === 'freelancer'
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Freelancer</span>
                  {selectedRole === 'freelancer' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Offer design, coding, photo, video, or tutoring.
                </p>
              </div>

              {/* Club / Client Box */}
              <div
                onClick={() => setSelectedRole('client')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedRole === 'client'
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Club / Client</span>
                  {selectedRole === 'client' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Hire student talent for club fests & ventures.
                </p>
              </div>

            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              FULL NAME OR CLUB REPRESENTATIVE *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              UNIVERSITY (.EDU) EMAIL *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">Required for student verification.</span>
          </div>

          {/* Major & Campus */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                MAJOR OR DEGREE
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. CS, Design, Biology"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                CAMPUS
              </label>
              <input
                type="text"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                placeholder="State University"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              CREATE PASSWORD *
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-sm shadow-xs transition-colors active:scale-95"
          >
            Create Campus Account
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Log in
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};
