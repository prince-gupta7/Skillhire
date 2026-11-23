import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Scale, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  User, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { 
  getGigById, 
  getApplications, 
  addApplication, 
  createAgreementFromApplication, 
  getPriceGuide,
  subscribeToStore,
  getSession
} from '@/lib/store';
import { Gig, Application, PriceGuideEntry } from '@/types';
import { SampleBadge } from '@/components/common/SampleBadge';
import { formatDate } from '@/lib/utils';

export const GigDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gig, setGig] = useState<Gig | undefined>(() => (id ? getGigById(id) : undefined));
  const [applications, setApplications] = useState<Application[]>(() => (id ? getApplications(id) : []));
  const [priceGuide, setPriceGuide] = useState<PriceGuideEntry[]>(() => getPriceGuide());
  
  // Apply drawer state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [pitch, setPitch] = useState('');
  const [quote, setQuote] = useState<number>(0);
  const [turnaroundDays, setTurnaroundDays] = useState<number>(3);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    return subscribeToStore(() => {
      if (id) {
        setGig(getGigById(id));
        setApplications(getApplications(id));
        setPriceGuide(getPriceGuide());
      }
    });
  }, [id]);

  useEffect(() => {
    if (gig) {
      setQuote(gig.budgetMin);
    }
  }, [gig]);

  if (!gig) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gig Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">The requested gig does not exist or was cleared.</p>
        <Link to="/gigs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gig Board</span>
        </Link>
      </div>
    );
  }

  // Fair price check against Campus Price Guide
  const matchingBenchmark = priceGuide.find((p) => p.category === gig.category);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();
    const freelancerName = session?.displayName || 'Aarav Sharma';
    const freelancerId = session?.id || `user_free_${Date.now()}`;

    addApplication({
      gigId: gig.id,
      freelancerId,
      freelancerName,
      freelancerSkills: [gig.category, 'Fast Turnaround'],
      pitch: pitch || 'I have experience with this type of campus deliverable and can deliver on schedule.',
      quote: quote || gig.budgetMin,
      estimatedDays: turnaroundDays,
      portfolioSampleUrl: portfolioLink || undefined,
      sample: false
    });

    setApplySuccess(true);
    setTimeout(() => {
      setIsApplyOpen(false);
      setApplySuccess(false);
    }, 1500);
  };

  const handleAcceptApplicant = (app: Application) => {
    const agreement = createAgreementFromApplication(app, gig);
    navigate(`/agreements/${agreement.id}`);
  };

  return (
    <div className="space-y-10 py-2 max-w-4xl mx-auto">
      
      {/* Back button */}
      <Link
        to="/gigs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Gig Board</span>
      </Link>

      {/* Main Gig Brief Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {gig.clientName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {gig.clientType}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-[#B84B30]">
                {gig.category}
              </span>
              {gig.sample && <SampleBadge />}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {gig.title}
            </h1>
          </div>

          <div className="sm:text-right w-full sm:w-auto p-4 sm:p-0 bg-slate-50 sm:bg-transparent rounded-2xl dark:bg-slate-800/40 sm:dark:bg-transparent">
            <span className="text-xs uppercase font-semibold text-slate-400 block">Offered Budget</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              ${gig.budgetMin}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Due by {formatDate(gig.deadline)}</span>
          </div>
        </div>

        {/* Scope Matrix */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Brief & Details</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {gig.scope.description}
          </p>
        </div>

        {/* Deliverables Checklist */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Deliverables</h3>
          <ul className="space-y-2">
            {gig.scope.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scope Safeguards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Delivery Format</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{gig.scope.format}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Revision Limit</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              Max {gig.scope.revisionsAllowed} round(s)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Deadline</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{formatDate(gig.deadline)}</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Zero fees charged. Bilateral agreement created upon quote acceptance.
          </div>

          <button
            onClick={() => setIsApplyOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 text-sm min-h-[44px]"
          >
            Apply to This Gig
          </button>
        </div>

      </div>

      {/* Submitted Applicants Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Submitted Applications ({applications.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            In this prototype, any client can review submitted quotes and accept an applicant to launch the Agreement Card.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            No applications submitted yet. Be the first to apply above!
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {app.freelancerName}
                      </span>
                      {app.sample && <SampleBadge />}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Proposed {app.estimatedDays} days turnaround • Applied {formatDate(app.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block">Proposed Quote</span>
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">${app.quote}</span>
                    </div>

                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptApplicant(app)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Accept & Sign Agreement
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{app.pitch}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Apply to {gig.title}
              </h3>
              <button onClick={() => setIsApplyOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {applySuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Application Submitted!</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Pitch / Why You're a Great Fit *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Mention relevant skills, past campus projects, or turnaround time..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Proposed Price Quote ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={50}
                      value={quote}
                      onChange={(e) => setQuote(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Turnaround (Days)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={turnaroundDays}
                      onChange={(e) => setTurnaroundDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
