import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { getProfiles, subscribeToStore } from '@/lib/store';
import { Profile } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { SampleBadge } from '@/components/common/SampleBadge';

export const TalentPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [profiles, setProfiles] = useState<Profile[]>(() => getProfiles());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [minRate, setMinRate] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(1000);

  useEffect(() => {
    return subscribeToStore(() => {
      setProfiles(getProfiles());
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = ['All', 'Design', 'Coding', 'Video Editing', 'Tutoring', 'Photography'];

  const filteredProfiles = profiles.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.displayName.toLowerCase().includes(q);
      const matchSkill = p.skills.some((s) => s.toLowerCase().includes(q));
      const matchBio = p.bio.toLowerCase().includes(q);
      const matchDept = (p.department || '').toLowerCase().includes(q);
      if (!matchName && !matchSkill && !matchBio && !matchDept) return false;
    }
    if (p.rateMin < minRate || p.rateMin > maxRate) {
      return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinRate(0);
    setMaxRate(1000);
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* Page Header (Matches Image 6) */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
          CAMPUS DIRECTORY
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Campus Talent
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Browse vetted university freelancers with peer reviews, past club work, and verified campus email credentials.
        </p>
      </div>

      {/* Main Layout: Left Sidebar + Right Content */}
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

          {/* Hourly Rate Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              HOURLY RATE ($/HR)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">$ Min</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={minRate}
                  onChange={(e) => setMinRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">$ Max</label>
                <input
                  type="number"
                  min="0"
                  max="1500"
                  value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))}
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
              placeholder="Search by student name, major, skill (e.g. Figma, Python)..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
          </div>

          {/* Result Count */}
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredProfiles.length} student freelancers
          </div>

          {/* Freelancer 3-Column Card Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No freelancers found matching these filters.</p>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    
                    {/* Avatar & Name & Year */}
                    <div className="flex items-start gap-3">
                      <img
                        src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={profile.displayName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {profile.displayName}
                          </h2>
                          {profile.verifiedStudent && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {profile.department}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>{profile.year}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Gigs row */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center text-amber-500 font-bold gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>5.00</span>
                      </div>
                      <span>•</span>
                      <span>0 campus gigs completed</span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {profile.bio}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          +{profile.skills.length - 3}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-1">
                        RATE
                      </span>
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                        ${profile.rateMin} <span className="text-slate-400 text-[11px] font-normal">/ hr</span>
                      </span>
                    </div>

                    <Link
                      to={`/talent/${profile.id}`}
                      className="font-bold text-[#B84B30] hover:underline flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
