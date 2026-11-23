import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Filter, Upload, ExternalLink, Tag } from 'lucide-react';
import { getPortfolioItems, addPortfolioItem, subscribeToStore, getSession } from '@/lib/store';
import { PortfolioItem, GigCategory } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { SampleBadge } from '@/components/common/SampleBadge';

export const ShowcasePage: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>(() => getPortfolioItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GigCategory>('Design');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    return subscribeToStore(() => {
      setItems(getPortfolioItems());
    });
  }, []);

  const categories = ['All', 'Design', 'Coding', 'Video Editing', 'Tutoring', 'Photography'];

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();
    addPortfolioItem({
      profileId: session?.id || 'user_demo',
      title,
      description: desc,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1572945753563-80495678363d?w=600',
      category,
      tags: [category, 'CampusWork'],
      sample: false,
    });
    setIsUploadOpen(false);
    setTitle('');
    setDesc('');
    setImageUrl('');
  };

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B84B30] block">
            CREATOR SHOWCASE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campus Portfolio Gallery
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Real student work created for campus fests, student clubs, and university research teams.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#B84B30] hover:bg-[#9F3A22] text-white font-bold rounded-xl text-xs shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Work</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                {item.sample && <SampleBadge />}
              </div>
            </div>
            <div className="p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-[#B84B30] uppercase">{item.category}</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-2">
                {item.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Portfolio Item</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleSubmitItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. RoboWars 2026 Stage Banner"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Design">Design</option>
                  <option value="Coding">Coding</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Tutoring">Tutoring</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Upload Image (Local File or URL)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Summary of the deliverables created..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#B84B30] text-white font-bold rounded-xl hover:bg-[#9F3A22]"
              >
                Save to Showcase
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
