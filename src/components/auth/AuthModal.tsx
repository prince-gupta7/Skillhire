import React, { useState } from 'react';
import { X, User, ShieldCheck, Sparkles, Check, Key } from 'lucide-react';
import { UserRole, UserSession } from '@/types';
import { checkAdminPasscode, setSession } from '@/lib/store';
import { APP_CONFIG } from '@/config/app.config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('School of Design');
  const [year, setYear] = useState('Junior (3rd Year)');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['freelancer']);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleQuickLogin = (name: string, dept: string, roles: UserRole[], yr: string) => {
    const session: UserSession = {
      id: `user_${name.toLowerCase().replace(/\s+/g, '_')}`,
      displayName: name,
      department: dept,
      year: yr,
      roles,
      currentRole: roles[0],
    };
    setSession(session);
    onSuccess?.(session);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Please enter your name or club name.');
      return;
    }

    const finalRoles = [...selectedRoles];
    if (showAdminInput && adminCode.trim()) {
      if (checkAdminPasscode(adminCode)) {
        if (!finalRoles.includes('admin')) finalRoles.push('admin');
      } else {
        setError(`Invalid Admin code. (Hint: check config or use '${APP_CONFIG.adminPasscode}')`);
        return;
      }
    }

    const session: UserSession = {
      id: `user_${Date.now()}`,
      displayName: displayName.trim(),
      department: department.trim(),
      year: year,
      roles: finalRoles,
      currentRole: finalRoles[0],
    };

    setSession(session);
    onSuccess?.(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulated Campus Auth</span>
          </div>
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Log in to CampusGig
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No password required. Set up your campus profile in under 30 seconds to post gigs or apply.
          </p>
        </div>

        {/* Quick-Pick 1-Click Tester Profiles */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            1-Click Demo Profiles (For Testing)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('Maya Sharma', 'School of Design', ['freelancer'], 'Junior (3rd Year)')}
              className="p-2 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-orange-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-orange-50/30 transition-all font-medium text-slate-800 dark:text-slate-200"
            >
              <span className="block font-bold text-orange-600 dark:text-orange-400">Maya (Freelancer)</span>
              <span className="text-[10px] text-slate-500">Design & Posters</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Robotics Club', 'Student Activity Center', ['client'], 'Campus Club')}
              className="p-2 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/30 transition-all font-medium text-slate-800 dark:text-slate-200"
            >
              <span className="block font-bold text-blue-600 dark:text-blue-400">Robotics Club (Client)</span>
              <span className="text-[10px] text-slate-500">Event Organizers</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Dr. Mehta', 'Campus Startup Incubator', ['mentor'], 'Faculty / Mentor')}
              className="p-2 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/30 transition-all font-medium text-slate-800 dark:text-slate-200"
            >
              <span className="block font-bold text-emerald-600 dark:text-emerald-400">Dr. Mehta (Mentor)</span>
              <span className="text-[10px] text-slate-500">Startup Cell</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Course Admin', 'Design Thinking Evaluator', ['admin', 'client', 'freelancer'], 'Faculty')}
              className="p-2 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-purple-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50/30 transition-all font-medium text-slate-800 dark:text-slate-200"
            >
              <span className="block font-bold text-purple-600 dark:text-purple-400">Course Admin</span>
              <span className="text-[10px] text-slate-500">Full System Control</span>
            </button>
          </div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Or Create Custom Session
          </span>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name or Student Club *
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Maya Sharma or Dance Society"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Program
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Design, CS"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Year / Role
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Freshman (1st Year)">1st Year (Freshman)</option>
                <option value="Sophomore (2nd Year)">2nd Year (Sophomore)</option>
                <option value="Junior (3rd Year)">3rd Year (Junior)</option>
                <option value="Senior (4th Year)">4th Year (Senior)</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Club Organizer">Club Organizer</option>
                <option value="Faculty / Staff">Faculty / Staff</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Role(s) for this session:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => toggleRole('freelancer')}
                className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                  selectedRoles.includes('freelancer')
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => toggleRole('client')}
                className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                  selectedRoles.includes('client')
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Client / Club
              </button>
              <button
                type="button"
                onClick={() => toggleRole('mentor')}
                className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                  selectedRoles.includes('mentor')
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Mentor
              </button>
            </div>
          </div>

          {/* Admin Code expander */}
          <div className="pt-1">
            {!showAdminInput ? (
              <button
                type="button"
                onClick={() => setShowAdminInput(true)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 flex items-center gap-1"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Have an Admin passcode?</span>
              </button>
            ) : (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm min-h-[44px]"
          >
            Start Campus Session
          </button>
        </form>
      </div>
    </div>
  );
};
