import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, ShieldCheck, FileText, Database, Heart } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';

interface FooterProps {
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFeedback }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Context */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                {APP_CONFIG.appName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Design Thinking Course Project P25: "Skills for Hire, Campus Edition". A mobile-first peer marketplace for verified student talent and clubs.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-amber-400 text-xs rounded-md border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Backend Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Explore Campus
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/talent" className="hover:text-orange-400 transition-colors">Find Student Talent</Link></li>
              <li><Link to="/gigs" className="hover:text-orange-400 transition-colors">Browse Open Gigs</Link></li>
              <li><Link to="/gigs/new" className="hover:text-orange-400 transition-colors">Post a Micro-Gig</Link></li>
              <li><Link to="/showcase" className="hover:text-orange-400 transition-colors">Student Work Showcase</Link></li>
              <li><Link to="/price-guide" className="hover:text-orange-400 transition-colors">Campus Fair Price Guide</Link></li>
            </ul>
          </div>

          {/* Trust & Design Thinking */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Design Thinking
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/how-it-works" className="hover:text-orange-400 transition-colors">How Bilateral Gigs Work</Link></li>
              <li><Link to="/about" className="hover:text-orange-400 transition-colors">Our 5-Stage Process</Link></li>
              <li><Link to="/about#personas" className="hover:text-orange-400 transition-colors">Target Personas</Link></li>
              <li><Link to="/mentor" className="hover:text-orange-400 transition-colors">Startup Cell & Mentors</Link></li>
              <li><Link to="/admin" className="hover:text-orange-400 transition-colors">Admin & Evidence Log</Link></li>
            </ul>
          </div>

          {/* Testing & Feedback */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Testing & Marks
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Are you testing this prototype? Please log any friction or bug directly into our testing matrix.
            </p>
            <button
              onClick={onOpenFeedback}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
              <span>Log Tester Feedback</span>
            </button>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <Link to="/admin" className="flex items-center gap-1 hover:text-slate-300">
                <Database className="w-3 h-3" />
                <span>Export / Import Data</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Academic project prototype. No real university logo or trademark used. All demo records flagged as sample data.
          </p>
          <p className="flex items-center gap-1">
            Built for P25 Skills for Hire with <Heart className="w-3 h-3 text-red-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
