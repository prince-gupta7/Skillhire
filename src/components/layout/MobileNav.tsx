import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, PlusCircle, Briefcase, LayoutDashboard } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Talent', path: '/talent', icon: Users },
    { name: 'Post', path: '/gigs/new', icon: PlusCircle, isPrimary: true },
    { name: 'Work', path: '/gigs', icon: Briefcase },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg safe-bottom">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isPrimary) {
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center justify-center -mt-5"
                aria-label="Post a new campus gig"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                  {tab.name}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 min-w-[56px] min-h-[44px] transition-colors ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
