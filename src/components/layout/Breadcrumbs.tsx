import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  talent: 'Find Talent',
  gigs: 'Find Work',
  new: 'Post a Gig',
  agreements: 'Agreements',
  dashboard: 'Dashboard',
  showcase: 'Portfolio Showcase',
  'price-guide': 'Price Guide',
  'how-it-works': 'How It Works',
  mentor: 'Mentor Hub',
  about: 'About Project',
  admin: 'Admin Console',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <ol className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeNames[name] || decodeURIComponent(name);

          return (
            <React.Fragment key={routeTo}>
              <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <li>
                {isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] inline-block">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate max-w-[150px] inline-block"
                  >
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
