import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { FeedbackWidget } from '@/components/common/FeedbackWidget';
import { WelcomeTour } from '@/components/common/WelcomeTour';
import { UserSession } from '@/types';
import { APP_CONFIG } from '@/config/app.config';

interface LayoutProps {
  currentSession?: UserSession | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  currentSession,
  onLogout,
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Check if tour was already dismissed
    const dismissed = localStorage.getItem(APP_CONFIG.storageKeys.tourDismissed);
    if (!dismissed) {
      setIsTourOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFC] dark:bg-[#0A0F1D] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        currentSession={currentSession}
        onLogout={onLogout}
      />
      <Breadcrumbs />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Outlet />
      </main>
      <Footer onOpenFeedback={() => {}} />
      <MobileNav />

      {/* Persistent Floating Feedback Widget */}
      <FeedbackWidget />

      {/* 3-Step Interactive Welcome Tour */}
      <WelcomeTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};
