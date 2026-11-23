import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileCheck2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  Star, 
  Send,
  ExternalLink
} from 'lucide-react';
import { 
  getAgreementById, 
  updateAgreement, 
  addReview, 
  subscribeToStore,
  getSession 
} from '@/lib/store';
import { Agreement, GigStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { SampleBadge } from '@/components/common/SampleBadge';

export const AgreementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agreement, setAgreement] = useState<Agreement | undefined>(() => (id ? getAgreementById(id) : undefined));
  
  // Prototype Testing Role Switcher: 'client' | 'freelancer'
  const [activeTesterView, setActiveTesterView] = useState<'client' | 'freelancer'>('client');
  
  // Deliverable submission state
  const [artifactUrl, setArtifactUrl] = useState('');
  const [deliveredNotes, setDeliveredNotes] = useState('');
  
  // Review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    return subscribeToStore(() => {
      if (id) setAgreement(getAgreementById(id));
    });
  }, [id]);

  if (!agreement) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agreement Not Found</h2>
        <Link to="/dashboard" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleSign = (party: 'client' | 'freelancer') => {
    const updated = { ...agreement };
    if (party === 'client') updated.clientAgreed = true;
    if (party === 'freelancer') updated.freelancerAgreed = true;

    if (updated.clientAgreed && updated.freelancerAgreed && updated.status === 'matched') {
      updated.status = 'in_progress';
    }
    updateAgreement(updated);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Agreement = {
      ...agreement,
      status: 'delivered',
      deliveredArtifactUrl: artifactUrl || 'https://drive.google.com/sample-assets',
      deliveredNotes: deliveredNotes || 'All deliverables finalized and submitted as per agreement.',
    };
    updateAgreement(updated);
  };

  const handleAcceptAndComplete = () => {
    setIsReviewOpen(true);
  };

  const handleFinishReview = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Agreement = {
      ...agreement,
      status: 'completed',
    };
    updateAgreement(updated);

    addReview({
      agreementId: agreement.id,
      reviewerId: activeTesterView === 'client' ? agreement.clientId : agreement.freelancerId,
      reviewerName: activeTesterView === 'client' ? 'Client' : 'Student Freelancer',
      reviewerRole: activeTesterView,
      revieweeId: activeTesterView === 'client' ? agreement.freelancerId : agreement.clientId,
      rating,
      comment: reviewComment || 'Excellent collaboration, prompt delivery, and fair expectations!',
      sample: false,
    });

    setIsReviewOpen(false);
  };

  return (
    <div className="py-4 sm:py-8 max-w-3xl mx-auto space-y-6">
      
      {/* Back button */}
      <Link to="/dashboard" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </Link>

      {/* PROTOTYPE TESTING ROLE SWITCHER TOOLBAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <RefreshCw className="w-4 h-4 text-orange-400" />
          <span>Switch Role (Prototype Only):</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTesterView('client')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTesterView === 'client'
                ? 'bg-[#B84B30] text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            View as Client
          </button>
          <button
            onClick={() => setActiveTesterView('freelancer')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTesterView === 'freelancer'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            View as Freelancer
          </button>
        </div>
      </div>

      {/* MAIN AGREEMENT CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30]">
                CAMPUS BILATERAL AGREEMENT
              </span>
              {agreement.sample && <SampleBadge />}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {agreement.gigTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contract ID: {agreement.id} • Created {formatDate(agreement.createdAt)}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase mt-0.5 ${
              agreement.status === 'completed'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                : agreement.status === 'in_progress'
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                : agreement.status === 'delivered'
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
            }`}>
              {agreement.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Agreed Terms Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Agreed Price</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 text-base">${agreement.agreedPrice}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Hard Deadline</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{agreement.deadline}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Max Revisions</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{agreement.revisionsAllowed} round(s)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Format</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{agreement.deliveryFormat}</span>
          </div>
        </div>

        {/* Terms Bullet Points */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Scope & Revision Safeguards
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {agreement.terms.map((term, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Guidance Note */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Non-Escrow Peer Payment Note:</strong> {agreement.paymentNote}
        </div>

        {/* Bilateral Sign-Off Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Client Sign-off */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Client Sign-Off</span>
            {agreement.clientAgreed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Terms Locked by Client</span>
              </div>
            ) : (
              <button
                onClick={() => handleSign('client')}
                className="w-full py-2 bg-[#B84B30] text-white font-bold rounded-xl text-xs hover:bg-[#9F3A22]"
              >
                Sign as Client
              </button>
            )}
          </div>

          {/* Freelancer Sign-off */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Freelancer Sign-Off</span>
            {agreement.freelancerAgreed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Terms Accepted by Freelancer</span>
              </div>
            ) : (
              <button
                onClick={() => handleSign('freelancer')}
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
              >
                Sign as Freelancer
              </button>
            )}
          </div>

        </div>

        {/* ACTIONS BASED ON STATUS */}
        {agreement.status === 'in_progress' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Work In Progress • Freelancer Submission Area
            </h3>
            {activeTesterView === 'freelancer' ? (
              <form onSubmit={handleSubmitDeliverable} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Deliverables Link (Google Drive / GitHub / Figma)</label>
                  <input
                    type="url"
                    required
                    value={artifactUrl}
                    onChange={(e) => setArtifactUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Delivery Notes</label>
                  <input
                    type="text"
                    value={deliveredNotes}
                    onChange={(e) => setDeliveredNotes(e.target.value)}
                    placeholder="e.g. Completed both print poster and banner vector assets."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Submit Deliverables & Mark Delivered
                </button>
              </form>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-500 dark:text-slate-400">
                Awaiting freelancer submission. Switch view to 'Freelancer' above to simulate submitting deliverables.
              </div>
            )}
          </div>
        )}

        {agreement.status === 'delivered' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-2">
              <span className="font-bold block">Deliverables Submitted for Review!</span>
              <p>Notes: {agreement.deliveredNotes}</p>
              {agreement.deliveredArtifactUrl && (
                <a
                  href={agreement.deliveredArtifactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 dark:text-purple-300 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Submitted Files</span>
                </a>
              )}
            </div>

            {activeTesterView === 'client' ? (
              <div className="flex gap-3">
                <button
                  onClick={handleAcceptAndComplete}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Accept Deliverables & Leave Review
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                Awaiting client sign-off. Switch view to 'Client' to complete.
              </div>
            )}
          </div>
        )}

        {agreement.status === 'completed' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm">Micro-Gig Successfully Completed!</h4>
            <p>Peer payment verified. Mutual campus reviews recorded in student profile.</p>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Leave Mutual Campus Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rate your peer experience to build authentic on-campus credibility.
            </p>

            <form onSubmit={handleFinishReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-2 rounded-xl border text-sm font-bold ${
                        rating >= s 
                          ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      ★ {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Comment</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="e.g. Prompt delivery, respected revision limits, and great communication!"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Submit Review & Close Gig
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
