import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, CheckCircle2 } from 'lucide-react';
import { addFeedback } from '@/lib/store';

export const FeedbackWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [testerCode, setTesterCode] = useState('TESTER-01');
  const [taskAttempted, setTaskAttempted] = useState('Browse Gigs');
  const [whatHappened, setWhatHappened] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [hasConsented, setHasConsented] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsented) return;

    addFeedback({
      pageUrl: location.pathname,
      testerCode: testerCode.trim() || 'ANON-TESTER',
      taskAttempted,
      whatHappened,
      severity,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setWhatHappened('');
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-6 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-lg transition-all active:scale-95"
        title="Give Tester Feedback"
      >
        <MessageSquare className="w-4 h-4 text-orange-400" />
        <span className="hidden sm:inline">Give Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-slate-900 dark:text-white">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B84B30] block">
                FIELD TEST FEEDBACK
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Log Usability Friction
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page: <code className="text-blue-600 dark:text-blue-400 font-mono">{location.pathname}</code>
              </p>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">Feedback Captured in Matrix!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Visible under the Admin Console for course evaluation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tester Code (Fake Name / ID, never real name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={testerCode}
                    onChange={(e) => setTesterCode(e.target.value)}
                    placeholder="e.g. TESTER-01"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Task Attempted *</label>
                  <select
                    value={taskAttempted}
                    onChange={(e) => setTaskAttempted(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs"
                  >
                    <option value="Browse Gigs">Browse Open Gigs</option>
                    <option value="Filter Talent">Filter Student Talent</option>
                    <option value="Post a Gig">Post a New Gig</option>
                    <option value="Apply to Gig">Apply to a Gig</option>
                    <option value="Sign Agreement">Sign Agreement Card</option>
                    <option value="Price Estimator">Use Price Guide Estimator</option>
                    <option value="Other">Other Navigation Flow</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    What Happened? (Friction or Bug) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={whatHappened}
                    onChange={(e) => setWhatHappened(e.target.value)}
                    placeholder="e.g. The revision limit was clear, but I wanted to see the estimated turnaround upfront..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Severity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-1.5 rounded-lg border font-bold capitalize text-center ${
                          severity === sev
                            ? 'bg-slate-900 dark:bg-slate-700 text-white border-transparent'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={hasConsented}
                      onChange={(e) => setHasConsented(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span className="text-[11px]">I consent to logging this anonymous evaluation feedback.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!hasConsented}
                  className="w-full py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs disabled:opacity-50"
                >
                  Save to Testing Matrix
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
