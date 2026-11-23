import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ChevronDown, 
  PlusCircle, 
  LayoutDashboard, 
  Shield, 
  LogOut, 
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';
import { UserSession } from '@/types';
import { switchSessionRole } from '@/lib/store';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface NavbarProps {
  currentSession?: UserSession | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentSession,
  onLogout
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Find Talent', path: '/talent' },
    { name: 'Gig Board', path: '/gigs' },
    { name: 'Price Guide', path: '/price-guide' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  const handleRoleToggle = () => {
    if (!currentSession) return;
    const nextRole = currentSession.currentRole === 'client' ? 'freelancer' : 'client';
    switchSessionRole(nextRole);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                {APP_CONFIG.appName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5">
                {APP_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 flex-1 justify-center max-w-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-100/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            {currentSession ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <img
                    src={currentSession.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentSession.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="max-w-[120px] sm:max-w-[140px] truncate">{currentSession.displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white">{currentSession.displayName}</p>
                      <p className="text-[11px] text-slate-400 capitalize">
                        Role: <strong className="text-orange-600 dark:text-orange-400">{currentSession.currentRole}</strong>
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>User Dashboard</span>
                    </Link>

                    <Link
                      to="/gigs/new"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <PlusCircle className="w-4 h-4 text-[#B84B30]" />
                      <span>Post a Campus Gig</span>
                    </Link>

                    <button
                      onClick={handleRoleToggle}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span>Switch to {currentSession.currentRole === 'client' ? 'Freelancer' : 'Client'} view</span>
                    </button>

                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Admin & Data Matrix</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors px-2 py-1"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-[#B84B30] hover:bg-[#9F3A22] px-4 py-2 rounded-xl shadow-xs transition-colors active:scale-95 min-h-[40px] flex items-center justify-center"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/gigs/new"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg"
          >
            + Post a Campus Gig
          </Link>
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Admin Console
          </Link>
        </div>
      )}
    </header>
  );
};
