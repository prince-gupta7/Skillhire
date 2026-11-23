import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Scale, 
  FileText, 
  HelpCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeRoleTab, setActiveRoleTab] = useState<'freelancers' | 'clients'>('clients');

  return (
    <div className="py-4 sm:py-8 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
          TRANSPARENT CAMPUS GIGS
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How CampusGigs Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The verified marketplace bridging student skills with student clubs and campus ventures. Built on scope clarity, fair pricing, and mutual respect.
        </p>
      </div>

      {/* Role Picker Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveRoleTab('clients')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeRoleTab === 'clients'
                ? 'bg-[#B84B30] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>For Clubs & Clients</span>
          </button>
          <button
            onClick={() => setActiveRoleTab('freelancers')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeRoleTab === 'freelancers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>For Student Freelancers</span>
          </button>
        </div>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeRoleTab === 'clients' ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <span className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Define Scope with Templates</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose a category (Design, Coding, Video, etc.) and specify required deliverables, format, and revision limits.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <span className="w-8 h-8 rounded-xl bg-[#B84B30] text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Review Quotes & Sign</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Inspect applicant pitches and quotes. Accept one to generate a locked Agreement Card before any work commences.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Verify & Settle Directly</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review submitted files. Pay directly via UPI or student cash. Leave a mutual campus review to build reputation.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Browse Campus Gigs</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Search open opportunities from verified clubs and departments. Every gig shows clear budget, deliverables, and deadlines.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <span className="w-8 h-8 rounded-xl bg-blue-700 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Pitch & Quote Fairly</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit a realistic quote backed by the Campus Fair Price Guide. Lock revision limits to prevent unpaid scope creep.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Deliver & Get Reviewed</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your files. Receive direct peer payment and earn verified reviews to showcase to future campus startup mentors.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Trust & Safety Highlights */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 text-white rounded-3xl space-y-4">
        <h3 className="font-extrabold text-xl text-white">Trust & Fair Expectations Guarantee</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-1">
            <strong className="text-white block">Fixed Revision Ceilings</strong>
            <p>Every gig defaults to 2 included revision rounds. Clients cannot demand endless free re-edits.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">Transparent Rate Benchmark</strong>
            <p>No race to the bottom. Rates are guided by campus surveys and student cost of living.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">Zero Middleman Fee</strong>
            <p>100% of the agreed amount goes directly into the student creator's pocket upon delivery.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
