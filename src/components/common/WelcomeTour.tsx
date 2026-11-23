import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, Scale, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleFinish = () => {
    localStorage.setItem(APP_CONFIG.storageKeys.tourDismissed, 'true');
    onClose();
  };

  const steps = [
    {
      step: 1,
      badge: 'WELCOME TO CAMPUSGIGS',
      title: 'Peer Student Skills, Built for Campus',
      desc: 'Campus clubs and student ventures frequently need quick design, coding, or video help. CampusGigs provides a verified .edu space to hire fellow students with zero middleman cuts.',
      icon: Sparkles,
      iconBg: 'bg-orange-100 text-[#B84B30]',
    },
    {
      step: 2,
      badge: 'FAIRNESS BY DESIGN',
      title: 'Scope Templates & Fair Price Guide',
      desc: 'No vague requests or 10 unpaid revision rounds. Every task uses a structured Scope Template with capped revisions (default 2), benchmarked against campus student survey rates.',
      icon: Scale,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      step: 3,
      badge: 'LOCK IT IN WRITING',
      title: 'The Bilateral Agreement Card',
      desc: 'Once an applicant is accepted, both client and freelancer lock terms and price. Final payment is settled peer-to-peer upon verified delivery, building verified portfolio credit.',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ];

  const active = steps[currentStep - 1];
  const Icon = active.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-slate-900 dark:text-white">
        
        {/* Close Button */}
        <button
          onClick={handleFinish}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                s <= currentStep ? 'bg-[#B84B30]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className={`w-12 h-12 rounded-2xl ${active.iconBg} flex items-center justify-center shadow-xs`}>
            <Icon className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
            {active.badge} • STEP {currentStep} OF 3
          </span>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {active.title}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {active.desc}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleFinish}
            className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Skip Tour
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Get Started
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
