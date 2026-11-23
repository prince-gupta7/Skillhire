import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCcw, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock,
  Key
} from 'lucide-react';
import { 
  getDatabase, 
  clearSampleData, 
  resetToFactorySeed, 
  exportDataJSON, 
  importDataJSON, 
  getFeedback, 
  updateFeedback, 
  exportFeedbackCSV, 
  getEvents, 
  getSession, 
  setSession, 
  checkAdminPasscode, 
  subscribeToStore 
} from '@/lib/store';
import { FeedbackSubmission, AppLifecycleEvent, UserSession } from '@/types';
import { APP_CONFIG } from '@/config/app.config';

export const AdminPage: React.FC = () => {
  const [session, setSessionState] = useState(() => getSession());
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>(() => getFeedback());
  const [events, setEvents] = useState<AppLifecycleEvent[]>(() => getEvents());
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToStore(() => {
      setFeedback(getFeedback());
      setEvents(getEvents());
      setSessionState(getSession());
    });
  }, []);

  const isAdmin = session?.roles.includes('admin') || isUnlocked;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPasscode(passcode)) {
      setIsUnlocked(true);
      if (session) {
        const updated: UserSession = {
          ...session,
          roles: [...session.roles, 'admin'],
        };
        setSession(updated);
      }
      setMessage('Admin access unlocked successfully.');
    } else {
      setMessage(`Incorrect passcode. (Hint: ${APP_CONFIG.adminPasscode})`);
    }
  };

  const handleClearSampleData = () => {
    if (window.confirm('Are you sure? This will remove all items marked with the "Sample" badge, leaving tester records intact.')) {
      clearSampleData();
      setMessage('Sample data cleared. Real tester records preserved.');
    }
  };

  const handleResetFactory = () => {
    if (window.confirm('Reset the entire local prototype to factory seed data?')) {
      resetToFactorySeed();
      setMessage('Prototype database restored to factory seed.');
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campusgigs_evidence_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importDataJSON(content)) {
          setMessage('Test evidence successfully imported!');
        } else {
          setMessage('Failed to import JSON: file format invalid.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportCSV = () => {
    const csvStr = exportFeedbackCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campusgigs_feedback_matrix_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (item: FeedbackSubmission, newStatus: any) => {
    updateFeedback({
      ...item,
      status: newStatus,
    });
  };

  if (!isAdmin) {
    return (
      <div className="py-16 max-w-md mx-auto space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
          <Key className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Control Room</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter course admin passcode to access test matrix, data export, and sample data controls.
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {message}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            required
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder={`Enter passcode (e.g. ${APP_CONFIG.adminPasscode})`}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-center font-mono text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Unlock Admin Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto space-y-10">
      
      {/* Top Banner */}
      <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
          EVALUATOR & RESEARCH CONTROL ROOM
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Admin & Testing Matrix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tools for managing field testing evidence, exporting research records, and purging sample demo content.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 dark:text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* System Integrity & Storage Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Prototype Evidence & Data Tools</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <button
            onClick={handleClearSampleData}
            className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-bold flex flex-col items-center justify-center gap-1.5 transition-colors text-center"
          >
            <Trash2 className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <span>Clear Sample Data</span>
            <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-normal">Purges demo items only</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-blue-900 dark:text-blue-300 font-bold flex flex-col items-center justify-center gap-1.5 transition-colors text-center"
          >
            <Download className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <span>Export Evidence (JSON)</span>
            <span className="text-[10px] text-blue-700/80 dark:text-blue-400/80 font-normal">For course submission</span>
          </button>

          <label className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 text-purple-900 dark:text-purple-300 font-bold flex flex-col items-center justify-center gap-1.5 transition-colors text-center cursor-pointer">
            <Upload className="w-5 h-5 text-purple-700 dark:text-purple-400" />
            <span>Import Evidence (JSON)</span>
            <span className="text-[10px] text-purple-700/80 dark:text-purple-400/80 font-normal">Restore on other devices</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleResetFactory}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex flex-col items-center justify-center gap-1.5 transition-colors text-center"
          >
            <RefreshCcw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span>Reset to Factory Seed</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Full reset</span>
          </button>
        </div>
      </div>

      {/* Feedback Capture Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              User Testing & Feedback Matrix ({feedback.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Captured tester friction points, severity levels, and tracked iteration changes.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Matrix to CSV</span>
          </button>
        </div>

        {feedback.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            No feedback entries logged yet. Testers can click "Log Tester Feedback" in the footer or floating button.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="py-3 px-3">Tester</th>
                  <th className="py-3 px-3">Task Attempted</th>
                  <th className="py-3 px-3">Issue Encountered</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {feedback.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{item.testerCode}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{item.taskAttempted}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs">{item.whatHappened}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.severity === 'high' ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300' : item.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Open">Open</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Addressed">Addressed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Anonymous Lifecycle Event Log */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Anonymous Lifecycle Event Log ({events.length})
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Chronological timestamp evidence of complete gig matching life cycles.
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {events.map((evt) => (
            <div key={evt.id} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-blue-600 dark:text-blue-400">{evt.eventType}</span>
              <span className="text-slate-500 dark:text-slate-400">{evt.entityId}</span>
              <span className="text-slate-400 dark:text-slate-500">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
