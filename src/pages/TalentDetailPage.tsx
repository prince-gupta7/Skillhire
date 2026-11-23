import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  ArrowLeft, 
  Clock, 
  Star, 
  MessageSquare, 
  Briefcase, 
  ExternalLink,
  CheckCircle,
  PlusCircle,
  Tag
} from 'lucide-react';
import { 
  getProfileById, 
  getPortfolioItems, 
  getAgreements, 
  getReviews, 
  subscribeToStore,
  getSession,
  addGig
} from '@/lib/store';
import { Profile, PortfolioItem, Agreement, Review } from '@/types';
import { SampleBadge } from '@/components/common/SampleBadge';
import { formatDate } from '@/lib/utils';

export const TalentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | undefined>(() => (id ? getProfileById(id) : undefined));
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => (id ? getPortfolioItems(id) : []));
  const [agreements, setAgreements] = useState<Agreement[]>(() => getAgreements());
  const [reviews, setReviews] = useState<Review[]>(() => getReviews());
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestBudget, setRequestBudget] = useState(400);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    return subscribeToStore(() => {
      if (id) {
        setProfile(getProfileById(id));
        setPortfolio(getPortfolioItems(id));
        setAgreements(getAgreements());
        setReviews(getReviews());
      }
    });
  }, [id]);

  if (!profile) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile not found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">The requested freelancer profile does not exist or was cleared.</p>
        <Link to="/talent" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to talent directory</span>
        </Link>
      </div>
    );
  }

  // Calculate live stats for this profile
  const completedGigs = agreements.filter(
    (a) => a.freelancerId === profile.id && a.status === 'completed'
  );
  const profileReviews = reviews.filter((r) => r.revieweeId === profile.id);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();
    const clientName = session?.displayName || 'Campus Client';
    const clientId = session?.id || 'client_anon';

    addGig({
      clientId,
      clientName,
      clientType: 'Club',
      title: requestTitle || `Direct Request for ${profile.displayName}`,
      category: profile.category,
      scope: {
        description: requestDesc,
        deliverables: ['Custom Deliverables as discussed'],
        format: 'Digital file',
        revisionsAllowed: 2
      },
      budgetMin: requestBudget,
      budgetMax: requestBudget + 100,
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'open',
      sample: false
    });

    setRequestSuccess(true);
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-10 py-2 max-w-5xl mx-auto">
      
      {/* Back button */}
      <Link
        to="/talent"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Find Talent</span>
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={profile.displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-xs"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile.displayName}
                </h1>
                {profile.verifiedStudent && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Verified Student
                  </span>
                )}
                {profile.sample && <SampleBadge />}
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {profile.department} • {profile.year}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {profile.availability}
                </span>
                <span>•</span>
                <span>Category: <strong className="text-slate-800 dark:text-slate-200">{profile.category}</strong></span>
              </div>
            </div>
          </div>

          {/* Action and Rate summary */}
          <div className="sm:text-right w-full sm:w-auto p-4 sm:p-0 bg-slate-50 sm:bg-transparent rounded-2xl dark:bg-slate-800/40 sm:dark:bg-transparent">
            <span className="text-xs uppercase font-semibold text-slate-400 block">Typical Rates</span>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              ${profile.rateMin} <span className="text-sm font-normal text-slate-500">/ hr</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-3">{profile.rateUnit}</span>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 text-xs min-h-[44px]"
            >
              Request This Person
            </button>
          </div>

        </div>

        {/* Mentor Endorsement Callout */}
        {profile.mentorEndorsed && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 uppercase tracking-wider block">
                Startup Cell Mentor Endorsement
              </span>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {profile.mentorNotes && profile.mentorNotes.length > 0
                  ? profile.mentorNotes[0]
                  : "Endorsed by campus startup-cell mentors for reliable quality, punctuality, and fair peer communication."}
              </p>
            </div>
          </div>
        )}

        {/* Bio */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Me</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Portfolio Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Portfolio Work ({portfolio.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Samples of previous campus projects and deliverables.</p>
          </div>
          <Link to="/showcase" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View Campus Showcase
          </Link>
        </div>

        {portfolio.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            No portfolio items uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImageModal(item.imageUrl)}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    {item.sample && <SampleBadge />}
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Direct Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Request {profile.displayName}
              </h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {requestSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Request Published to Campus Gig Board!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Visible under open gigs.</p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project / Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    placeholder={`e.g. Club Poster for ${profile.displayName}`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Describe What You Need *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={requestDesc}
                    onChange={(e) => setRequestDesc(e.target.value)}
                    placeholder="List the deliverables, deadline, and event details..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Proposed Budget: ${requestBudget}
                  </label>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    step={50}
                    value={requestBudget}
                    onChange={(e) => setRequestBudget(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Post Direct Gig Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
