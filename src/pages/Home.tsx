import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Palette, 
  Code, 
  Video, 
  BookOpen, 
  Camera, 
  Sparkles,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';
import { SampleBadge } from '@/components/common/SampleBadge';

interface HomeProps {
  stats?: {
    activeGigsCount: number;
    studentProfilesCount: number;
    completedAgreementsCount: number;
  };
}

export const Home: React.FC<HomeProps> = ({ stats }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      
      {/* HERO SECTION (Matches Image 5 Exactly) */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#B84B30]"></span>
          <span>Campus Edition • The Student Skills Marketplace for University Life</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
          Find campus talent.<br />
          Find campus work.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Connect skilled student freelancers with campus clubs, researchers, and peers. Verified .edu accounts, transparent student rate benchmarks, and zero platform cuts.
        </p>

        {/* Centered CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/talent"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl shadow-xs transition-colors active:scale-95 text-sm min-h-[44px]"
          >
            <Briefcase className="w-4 h-4" />
            <span>Hire a Student</span>
          </Link>

          <Link
            to="/gigs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl shadow-xs transition-colors active:scale-95 text-sm min-h-[44px]"
          >
            <GraduationCap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Offer a Skill</span>
          </Link>
        </div>

        {/* 3 Prominent Metric Stats */}
        <div className="pt-10 grid grid-cols-3 max-w-2xl mx-auto border-t border-slate-200/80 dark:border-slate-800 mt-10">
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">100%</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">Verified .edu Students</span>
          </div>

          <div className="text-center border-x border-slate-200 dark:border-slate-800">
            <span className="block text-3xl sm:text-4xl font-extrabold text-[#B84B30]">0%</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">Platform Fee Cut</span>
          </div>

          <div className="text-center">
            <span className="block text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">48h</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">Avg. Gig Match Time</span>
          </div>
        </div>

      </section>

      {/* EXPLORE CAMPUS SKILLS CATEGORIES */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Campus Skill Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pre-scoped templates and verified student rates ready for quick booking.
            </p>
          </div>
          <Link
            to="/talent"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Talent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {APP_CONFIG.categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/talent?category=${encodeURIComponent(cat.id)}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 block">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                  Verified campus creators
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW CAMPUS GIGS WORK BANNER */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
            Safe & Transparent Campus Freelancing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How It Works for Students & Clubs
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminating scope creep and vague verbal deals with clear bilateral contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h3 className="font-bold text-sm text-white">Post or Scope a Task</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use category templates to set exact deliverables, file formats, and max revisions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-[#B84B30] text-white text-xs font-bold flex items-center justify-center">2</span>
            <h3 className="font-bold text-sm text-white">Sign Agreement Card</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Both client and student lock terms and price. Revisions are capped so freelancers aren't exploited.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
            <h3 className="font-bold text-sm text-white">Deliver & Direct Settle</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify deliverables and pay directly peer-to-peer (UPI, Venmo, Cash). Mutual campus review builds portfolio.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10">
          <span>100% Student-Managed Micro-Market</span>
          <Link to="/price-guide" className="text-orange-400 hover:underline font-semibold flex items-center gap-1">
            <span>Explore Campus Price Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
