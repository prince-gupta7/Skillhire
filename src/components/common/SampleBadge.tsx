import React from 'react';
import { Tag } from 'lucide-react';

interface SampleBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const SampleBadge: React.FC<SampleBadgeProps> = ({ className = '', size = 'sm' }) => {
  return (
    <span
      title="Sample demo data for testing. Can be cleared in Admin."
      className={`inline-flex items-center gap-1 font-medium tracking-wide uppercase rounded border border-dashed ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      } bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${className}`}
    >
      <Tag className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      Sample
    </span>
  );
};
