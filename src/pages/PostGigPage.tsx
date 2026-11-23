import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  Clock, 
  FileText 
} from 'lucide-react';
import { addGig, getPriceGuide, getSession } from '@/lib/store';
import { GigCategory } from '@/types';
import { APP_CONFIG } from '@/config/app.config';

export const PostGigPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const prefillCat = (searchParams.get('category') as GigCategory) || 'Design';
  const prefillMin = Number(searchParams.get('budgetMin')) || 1000;
  const prefillMax = Number(searchParams.get('budgetMax')) || 1500;

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GigCategory>(prefillCat);
  const [clientType, setClientType] = useState<'Club' | 'Student' | 'Department' | 'Startup'>('Club');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Main Vector Poster (Print & Web)',
    'Social Media Banner Assets'
  ]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [format, setFormat] = useState('.ai / .fig and .pdf');
  const [revisions, setRevisions] = useState<number>(2);
  const [budgetMin, setBudgetMin] = useState<number>(prefillMin);
  const [budgetMax, setBudgetMax] = useState<number>(prefillMax);
  const [deadline, setDeadline] = useState('2026-12-15');

  const priceGuide = getPriceGuide();
  const matchingGuide = priceGuide.find((p) => p.category === category);

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handlePublish = () => {
    const session = getSession();
    const clientName = session?.displayName || 'Robotics & AI Society';
    const clientId = session?.id || 'client_user';

    const newGig = addGig({
      clientId,
      clientName,
      clientType,
      title: title || `New ${category} Project`,
      category,
      scope: {
        description: description || 'Required campus deliverables as specified.',
        deliverables: deliverables.length > 0 ? deliverables : ['Standard Deliverable Asset'],
        format,
        revisionsAllowed: revisions,
      },
      budgetMin,
      budgetMax,
      deadline,
      status: 'open',
      sample: false,
    });

    navigate(`/gigs/${newGig.id}`);
  };

  return (
    <div className="py-4 sm:py-8 max-w-2xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <Link to="/gigs" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gig Board</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
          POST A CAMPUS OPPORTUNITY
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create a Micro-Gig
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Step-by-step scope definition to protect both you and student freelancers.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold">
        <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>1. Category & Title</span>
        <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>2. Scope & Specs</span>
        <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>3. Budget & Deadline</span>
        <span className={step >= 4 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>4. Review & Publish</span>
      </div>

      {/* Step 1: Category & Title */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Gig Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Poster and banner set for RoboWars 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Skill Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {APP_CONFIG.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as GigCategory)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    category === c.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Who is posting this?</label>
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="Club">Recognized Student Club / Society</option>
              <option value="Student">Individual Fellow Student</option>
              <option value="Department">University Department</option>
              <option value="Startup">Student Startup Venture</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (!title.trim()) setTitle(`New ${category} Project`);
              setStep(2);
            }}
            className="w-full py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Continue to Scope</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Deliverables & Specifications */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Brief Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what needs to be created or solved, theme, and key requirements..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Required Deliverables List</label>
            <div className="space-y-1.5">
              {deliverables.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{d}</span>
                  </span>
                  <button onClick={() => handleRemoveDeliverable(i)} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                placeholder="Add another deliverable item..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-xl text-xs hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Delivery File Format</label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="e.g. .fig, .ai, .mp4, GitHub PR"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Max Revisions Included</label>
              <select
                value={revisions}
                onChange={(e) => setRevisions(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value={1}>1 round of revisions</option>
                <option value={2}>2 rounds (Campus standard)</option>
                <option value={3}>3 rounds max</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Continue to Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Budget & Timeline with Fair Price Check */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Budget ($) *</label>
              <input
                type="number"
                min="10"
                value={budgetMin}
                onChange={(e) => {
                  setBudgetMin(Number(e.target.value));
                  setBudgetMax(Number(e.target.value));
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Deadline Date *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Fair Price Hint Box */}
          {matchingGuide && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Campus Fair Benchmark Check</span>
                <p className="text-blue-700 dark:text-blue-300 mt-0.5">
                  Typical campus range for {category} is <strong>${matchingGuide.min} – ${matchingGuide.max}</strong> ({matchingGuide.unit}).
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Review Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Publish */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[#B84B30] font-bold uppercase">{category}</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{title}</h3>
              </div>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">${budgetMin}</span>
            </div>

            <p className="text-slate-600 dark:text-slate-300">{description}</p>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Deliverables:</span>
              <ul className="space-y-1">
                {deliverables.map((d, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <div>Format: <strong>{format}</strong></div>
              <div>Deadline: <strong>{deadline}</strong></div>
              <div>Max revisions: <strong>{revisions}</strong></div>
              <div>Zero platform fee cut</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm"
            >
              Back
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 py-3 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Gig to Board</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
