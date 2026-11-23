import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { TalentPage } from '@/pages/TalentPage';
import { TalentDetailPage } from '@/pages/TalentDetailPage';
import { GigsPage } from '@/pages/GigsPage';
import { GigDetailPage } from '@/pages/GigDetailPage';
import { PostGigPage } from '@/pages/PostGigPage';
import { AgreementPage } from '@/pages/AgreementPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ShowcasePage } from '@/pages/ShowcasePage';
import { PriceGuidePage } from '@/pages/PriceGuidePage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { MentorPage } from '@/pages/MentorPage';
import { AboutPage } from '@/pages/AboutPage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { NotFoundPlaceholder } from '@/pages/Placeholders';
import { UserSession } from '@/types';
import { 
  getSession, 
  setSession, 
  subscribeToSession, 
  getGigs, 
  getProfiles, 
  getAgreements,
  subscribeToStore 
} from '@/lib/store';

export const App: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<UserSession | null>(() => getSession());

  useEffect(() => {
    return subscribeToSession(() => {
      setCurrentSession(getSession());
    });
  }, []);

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              currentSession={currentSession}
              onLogout={handleLogout}
            />
          }
        >
          <Route index element={<Home />} />
          <Route path="talent" element={<TalentPage />} />
          <Route path="talent/:id" element={<TalentDetailPage />} />
          <Route path="gigs" element={<GigsPage />} />
          <Route path="gigs/:id" element={<GigDetailPage />} />
          <Route path="gigs/new" element={<PostGigPage />} />
          <Route path="agreements/:id" element={<AgreementPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="showcase" element={<ShowcasePage />} />
          <Route path="price-guide" element={<PriceGuidePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="mentor" element={<MentorPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
