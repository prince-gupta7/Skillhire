import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Calendar, 
  ArrowUpRight, 
  Filter
} from 'lucide-react';
import { getGigs, subscribeToStore } from '@/lib/store';
import { Gig } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { formatDate } from '@/lib/utils';
import { SampleBadge } from '@/components/common/SampleBadge';

export const GigsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [gigs, setGigs] = useState<Gig[]>(() => getGigs());
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(5000);

  useEffect(() => {
    return subscribeToStore(() => {
      setGigs(getGigs());
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const categories = ['All', 'Design', 'Coding', 'Video Editing', 'Tutoring', 'Photography'];

  const filteredGigs = gigs.filter((g) => {
    if (selectedCategory !== 'All' && g.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchDesc = g.scope.description.toLowerCase().includes(q);
      const matchClient = g.clientName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchClient) return false;
    }
    if (g.budgetMin < minBudget || g.budgetMin > maxBudget) {
      return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinBudget(0);
    setMaxBudget(5000);
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* Header (Matches Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
            WORK OPPORTUNITIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campus Gig Board
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Live projects posted by recognized campus clubs, fellow students, and university departments.
          </p>
        </div>

        {/* Primary Post Button */}
        <Link
          to="/gigs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl shadow-xs transition-colors active:scale-95 text-xs min-h-[44px] self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Campus Gig</span>
        </Link>
      </div>

      {/* Main Layout: Left Filter Sidebar + Right 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-6 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Filter By</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-slate-400 hover:text-[#B84B30] transition-colors"
            >
              Reset all
            </button>
          </div>

          {/* Skill Category */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              SKILL CATEGORY
            </span>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat === 'All') {
                        searchParams.delete('category');
                        setSearchParams(searchParams);
                      } else {
                        setSearchParams({ category: cat });
                      }
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              BUDGET ($)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">$ Min</label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">$ Max</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Main Column */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by gig title, club name, or skill tags..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
          </div>

          {/* Result Count */}
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredGigs.length} gigs
          </div>

          {/* 2-Column Gig Card Grid (Matches Image 3) */}
          {filteredGigs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No campus gigs found matching these filters.</p>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredGigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gigs/${gig.id}`}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group block"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Club Avatar & Name + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs overflow-hidden">
                          {gig.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            {gig.clientName}
                          </h3>
                          <span className="text-[10px] text-slate-400 block">{gig.clientType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Open
                        </span>
                        {gig.sample && <SampleBadge />}
                      </div>
                    </div>

                    {/* Gig Title */}
                    <h2 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {gig.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {gig.scope.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {gig.scope.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {d.split(' ')[0]}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {gig.category}
                      </span>
                    </div>

                  </div>

                  {/* Card Footer: Budget, Deadline, Arrow */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-1">
                        BUDGET
                      </span>
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-base">
                        ${gig.budgetMin}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-1">
                        DEADLINE
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {gig.deadline}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
