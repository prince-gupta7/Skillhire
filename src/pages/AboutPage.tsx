import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Target, 
  Users, 
  FileCheck, 
  Edit3, 
  Save, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { getDtDocs, updateDtDoc, getSession, subscribeToStore } from '@/lib/store';
import { DesignThinkingDoc } from '@/types';

export const AboutPage: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'empathize' | 'define' | 'ideate' | 'prototype' | 'test'>('empathize');
  const [docs, setDocs] = useState<DesignThinkingDoc[]>(() => getDtDocs());
  const [session, setSession] = useState(() => getSession());
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    return subscribeToStore(() => {
      setDocs(getDtDocs());
      setSession(getSession());
    });
  }, []);

  const currentDoc = docs.find((d) => d.stage === activeStage) || {
    id: `doc_${activeStage}`,
    stage: activeStage,
    title: `Stage: ${activeStage.toUpperCase()}`,
    content: `### ${activeStage.toUpperCase()}\n\n[Add real course research data and interview findings here]`,
    lastUpdated: '2026-11-20',
  };

  const stages = [
    { id: 'empathize', name: '1. Empathize' },
    { id: 'define', name: '2. Define' },
    { id: 'ideate', name: '3. Ideate' },
    { id: 'prototype', name: '4. Prototype' },
    { id: 'test', name: '5. Test' },
  ] as const;

  const handleStartEdit = () => {
    setEditingStage(activeStage);
    setEditContent(currentDoc.content);
  };

  const handleSaveEdit = () => {
    updateDtDoc({
      ...currentDoc,
      content: editContent,
    });
    setEditingStage(null);
  };

  return (
    <div className="py-4 sm:py-8 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
          DESIGN THINKING DOSSIER
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About CampusGigs
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Project P25: "Skills for Hire, Campus Edition". A human-centered approach to unlocking safe, fair student micro-gigs inside the university ecosystem.
        </p>
      </div>

      {/* Problem & HMW Summary Banner */}
      <div className="bg-slate-900 dark:bg-slate-900/90 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
          Point of View & How Might We
        </span>
        <blockquote className="text-lg sm:text-xl font-bold leading-snug border-l-4 border-[#B84B30] pl-4">
          "How might we help a student with a skill find campus work, and a campus client find reliable student talent, with fair expectations on both sides?"
        </blockquote>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-white/10 text-xs text-slate-300">
          <div>
            <strong className="text-white block">Student Freelancers</strong>
            <span>Need portfolio building & fair wages without getting exploited by scope creep.</span>
          </div>
          <div>
            <strong className="text-white block">Student Clubs</strong>
            <span>Need fast, dependable design, video, and code support within modest budgets.</span>
          </div>
          <div>
            <strong className="text-white block">Startup Mentors</strong>
            <span>Need a low-friction safe harbor for students to test real-world client service.</span>
          </div>
        </div>
      </div>

      {/* 5-Stage Interactive Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setActiveStage(st.id as any);
                setEditingStage(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeStage === st.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentDoc.title}</h2>
              <span className="text-[11px] text-slate-400">Last updated: {currentDoc.lastUpdated}</span>
            </div>

            {session?.roles.includes('admin') && (
              <div>
                {editingStage === activeStage ? (
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Edit Markdown</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {editingStage === activeStage ? (
            <textarea
              rows={12}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl"
            />
          ) : (
            <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
              {currentDoc.content}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
