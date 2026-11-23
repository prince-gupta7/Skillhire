import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Edit3, 
  Save, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { getPriceGuide, updatePriceGuideEntry, getSession, subscribeToStore } from '@/lib/store';
import { PriceGuideEntry } from '@/types';
import { SampleBadge } from '@/components/common/SampleBadge';

export const PriceGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<PriceGuideEntry[]>(() => getPriceGuide());
  const [session, setSession] = useState(() => getSession());

  // Interactive Estimator state (Matches Image 4)
  const [estCategory, setEstCategory] = useState('Design');
  const [estScope, setEstScope] = useState('Standard Multi-Asset');
  const [estTimeline, setEstTimeline] = useState('Standard (3-7 days)');

  // Admin inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMin, setEditMin] = useState<number>(0);
  const [editMax, setEditMax] = useState<number>(0);

  useEffect(() => {
    return subscribeToStore(() => {
      setEntries(getPriceGuide());
      setSession(getSession());
    });
  }, []);

  // Compute dynamic estimated price based on selections
  let baseMin = 40;
  let baseMax = 65;
  if (estCategory === 'Design') {
    if (estScope === 'Single Asset') { baseMin = 40; baseMax = 65; }
    else if (estScope === 'Standard Multi-Asset') { baseMin = 72; baseMax = 98; }
    else { baseMin = 80; baseMax = 140; }
  } else if (estCategory === 'Coding') {
    if (estScope === 'Single Asset') { baseMin = 35; baseMax = 70; }
    else if (estScope === 'Standard Multi-Asset') { baseMin = 100; baseMax = 200; }
    else { baseMin = 180; baseMax = 350; }
  } else if (estCategory === 'Video Editing') {
    if (estScope === 'Single Asset') { baseMin = 45; baseMax = 80; }
    else if (estScope === 'Standard Multi-Asset') { baseMin = 90; baseMax = 160; }
    else { baseMin = 140; baseMax = 250; }
  } else {
    baseMin = 30; baseMax = 60;
  }

  // Multiplier for timeline
  let multiplier = 1;
  if (estTimeline.includes('Rush')) multiplier = 1.25;
  if (estTimeline.includes('Extended')) multiplier = 0.9;

  const finalMin = Math.round(baseMin * multiplier);
  const finalMax = Math.round(baseMax * multiplier);
  const benchmarkAvg = Math.round((finalMin + finalMax) / 2);

  const handlePostWithBudget = () => {
    navigate(`/gigs/new?category=${encodeURIComponent(estCategory)}&budgetMin=${finalMin}&budgetMax=${finalMax}`);
  };

  const handleSaveEdit = (entry: PriceGuideEntry) => {
    updatePriceGuideEntry({
      ...entry,
      min: editMin,
      max: editMax,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-10 py-2 max-w-5xl mx-auto">
      
      {/* Header (Matches Image 4) */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CAMPUS FAIR STANDARD</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Campus Fair Price Guide
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Transparent rates developed from real university student projects and club budgets. No exploitation, realistic turnaround expectations, and fair compensation for peer talent.
        </p>
      </div>

      {/* INTERACTIVE BLUE RATE ESTIMATOR BANNER (Matches Image 4 Exactly) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Left 2 Cols: Form Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>INTERACTIVE CAMPUS RATE ESTIMATOR</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Estimate Fair Pay for Your Campus Project
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-blue-200 block mb-1">Category</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white font-medium focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="Design" className="text-slate-900">Design</option>
                  <option value="Coding" className="text-slate-900">Coding</option>
                  <option value="Video Editing" className="text-slate-900">Video Editing</option>
                  <option value="Tutoring" className="text-slate-900">Tutoring</option>
                  <option value="Photography" className="text-slate-900">Photography</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-blue-200 block mb-1">Project Scope</label>
                <select
                  value={estScope}
                  onChange={(e) => setEstScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white font-medium focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="Single Asset" className="text-slate-900">Single Asset (Flyer/Poster)</option>
                  <option value="Standard Multi-Asset" className="text-slate-900">Standard Multi-Asset</option>
                  <option value="Comprehensive Package" className="text-slate-900">Comprehensive Package</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-blue-200 block mb-1">Timeline</label>
                <select
                  value={estTimeline}
                  onChange={(e) => setEstTimeline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white font-medium focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="Rush (24-48h)" className="text-slate-900">Rush (24-48h)</option>
                  <option value="Standard (3-7 days)" className="text-slate-900">Standard (3-7 days)</option>
                  <option value="Extended (2+ weeks)" className="text-slate-900">Extended (2+ weeks)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Col: Result & Terracotta Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center sm:text-left space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
              SUGGESTED FAIR BUDGET
            </span>
            <div className="text-3xl font-extrabold text-white">
              ${finalMin} – ${finalMax}
            </div>
            <p className="text-xs text-blue-100">
              Benchmark average: ~${benchmarkAvg} total
            </p>

            <button
              onClick={handlePostWithBudget}
              className="w-full mt-3 py-2.5 px-4 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs transition-colors active:scale-95"
            >
              Post with this Budget
            </button>
          </div>

        </div>
      </div>

      {/* BENCHMARK DATA TABLE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Campus Task Rate Benchmarks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Starter estimates, updated from real survey results and campus club budgets.
            </p>
          </div>

          {session?.roles.includes('admin') && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              Admin Edit Mode Enabled
            </span>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Task Type</th>
                  <th className="py-3.5 px-4">Fair Standard</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4">Scope Guidelines</th>
                  {session?.roles.includes('admin') && <th className="py-3.5 px-4 text-right">Edit</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {entry.category}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {entry.taskType}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === entry.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editMin}
                            onChange={(e) => setEditMin(Number(e.target.value))}
                            className="w-16 px-1.5 py-1 border rounded text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                          <span>–</span>
                          <input
                            type="number"
                            value={editMax}
                            onChange={(e) => setEditMax(Number(e.target.value))}
                            className="w-16 px-1.5 py-1 border rounded text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                          ${entry.min} – ${entry.max}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {entry.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                      {entry.notes}
                    </td>
                    {session?.roles.includes('admin') && (
                      <td className="py-3 px-4 text-right">
                        {editingId === entry.id ? (
                          <button
                            onClick={() => handleSaveEdit(entry)}
                            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(entry.id);
                              setEditMin(entry.min);
                              setEditMax(entry.max);
                            }}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
