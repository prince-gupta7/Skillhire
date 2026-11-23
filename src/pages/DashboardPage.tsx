import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Send, 
  FileCheck2, 
  Image, 
  PlusCircle, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getGigs, 
  getApplications, 
  getAgreements, 
  getPortfolioItems, 
  getSession,
  subscribeToStore 
} from '@/lib/store';
import { Gig, Application, Agreement, PortfolioItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { SampleBadge } from '@/components/common/SampleBadge';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gigs' | 'applications' | 'agreements' | 'portfolio'>('gigs');
  const [session, setSession] = useState(() => getSession());
  const [gigs, setGigs] = useState<Gig[]>(() => getGigs());
  const [applications, setApplications] = useState<Application[]>(() => getApplications());
  const [agreements, setAgreements] = useState<Agreement[]>(() => getAgreements());
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => getPortfolioItems());

  useEffect(() => {
    return subscribeToStore(() => {
      setSession(getSession());
      setGigs(getGigs());
      setApplications(getApplications());
      setAgreements(getAgreements());
      setPortfolio(getPortfolioItems());
    });
  }, []);

  const tabs = [
    { id: 'gigs', name: 'My Gigs', count: gigs.length, icon: Briefcase },
    { id: 'applications', name: 'My Applications', count: applications.length, icon: Send },
    { id: 'agreements', name: 'My Agreements', count: agreements.length, icon: FileCheck2 },
    { id: 'portfolio', name: 'My Portfolio', count: portfolio.length, icon: Image },
  ] as const;

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
            CAMPUS WORKSPACE
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Logged in as <strong>{session?.displayName || 'Active Campus Member'}</strong> ({session?.currentRole || 'Member'})
          </p>
        </div>

        <Link
          to="/gigs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Gig</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY GIGS */}
      {activeTab === 'gigs' && (
        <div className="space-y-4">
          {gigs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p>No gigs posted yet.</p>
              <Link to="/gigs/new" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Post your first campus task
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gigs.map((g) => (
                <div key={g.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#B84B30]">{g.category}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{g.status}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{g.title}</h3>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">${g.budgetMin}</span>
                    <Link to={`/gigs/${g.id}`} className="text-[#B84B30] font-bold hover:underline flex items-center gap-0.5">
                      <span>View & Applicants</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p>No applications submitted yet.</p>
              <Link to="/gigs" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Browse open gigs and submit a quote
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">{app.freelancerName}</span>
                    <p className="text-slate-500 dark:text-slate-400 italic mt-0.5">"{app.pitch}"</p>
                    <span className="text-[10px] text-slate-400">Est. {app.estimatedDays} days turnaround</span>
                  </div>
                  <div className="sm:text-right flex items-center sm:flex-col gap-3 sm:gap-1">
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">${app.quote}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      app.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY AGREEMENTS */}
      {activeTab === 'agreements' && (
        <div className="space-y-4">
          {agreements.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p>No bilateral agreements generated yet.</p>
              <p className="text-slate-400">Agreements appear when a client accepts a freelancer's quote.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {agreements.map((agr) => (
                <div key={agr.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{agr.gigTitle}</span>
                      {agr.sample && <SampleBadge />}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Agreed: ${agr.agreedPrice} • Due {agr.deadline} • Max {agr.revisionsAllowed} revs</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold ${
                      agr.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                    }`}>
                      {agr.status.replace('_', ' ')}
                    </span>
                    <Link
                      to={`/agreements/${agr.id}`}
                      className="px-3 py-1.5 bg-[#B84B30] text-white font-bold rounded-xl hover:bg-[#9F3A22]"
                    >
                      Open Card
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portfolio.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
                <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
                <div className="p-3 text-xs space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
