import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { getProfiles, upsertProfile, getGigs, getAgreements, subscribeToStore } from '@/lib/store';
import { Profile } from '@/types';

export const MentorPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(() => getProfiles());
  const [gigs, setGigs] = useState(() => getGigs());
  const [agreements, setAgreements] = useState(() => getAgreements());
  const [search, setSearch] = useState('');
  const [endorseNote, setEndorseNote] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToStore(() => {
      setProfiles(getProfiles());
      setGigs(getGigs());
      setAgreements(getAgreements());
    });
  }, []);

  const handleEndorse = (student: Profile) => {
    const updated: Profile = {
      ...student,
      mentorEndorsed: true,
      mentorNotes: [endorseNote || 'Endorsed for reliable quality and fair peer communication by Startup Cell Mentors.'],
    };
    upsertProfile(updated);
    setSelectedStudentId(null);
    setEndorseNote('');
  };

  const handleRemoveEndorsement = (student: Profile) => {
    const updated: Profile = {
      ...student,
      mentorEndorsed: false,
      mentorNotes: [],
    };
    upsertProfile(updated);
  };

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
          CAMPUS STARTUP INCUBATOR
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Mentor & Entrepreneurship Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Oversee campus gig volume, track entrepreneurial milestone progress, and endorse verified student creators.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Campus Talent</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{profiles.length}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Verified active students</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Active Gig Pipeline</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{gigs.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">Open & in-progress tasks</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Settled Agreements</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {agreements.filter((a) => a.status === 'completed').length}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Zero disputes reported</span>
        </div>
      </div>

      {/* Endorsement Console */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Student Freelancer Endorsement Panel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mentors grant the "Mentor Endorsed" badge to standout student freelancers to signal quality to campus clubs.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name or skill..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-3">
          {profiles
            .filter((p) => p.displayName.toLowerCase().includes(search.toLowerCase()))
            .map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{p.displayName}</span>
                    <span className="text-slate-400">({p.department})</span>
                    {p.mentorEndorsed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        <Award className="w-3 h-3" />
                        Mentor Endorsed
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{p.bio}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {p.mentorEndorsed ? (
                    <button
                      onClick={() => handleRemoveEndorsement(p)}
                      className="px-3 py-1.5 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-semibold"
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedStudentId(p.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                    >
                      Add Endorsement
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Endorse Modal */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Mentor Endorsement Note</h3>
            <textarea
              rows={3}
              value={endorseNote}
              onChange={(e) => setEndorseNote(e.target.value)}
              placeholder="e.g. Endorsed for punctuality, attention to detail, and excellent design fundamentals."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStudentId(null)}
                className="py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const student = profiles.find((p) => p.id === selectedStudentId);
                  if (student) handleEndorse(student);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Endorsement
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
