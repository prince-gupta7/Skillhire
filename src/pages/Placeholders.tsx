import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Construction } from 'lucide-react';
import { SampleBadge } from '@/components/common/SampleBadge';

interface PlaceholderProps {
  title: string;
  description: string;
  phase: string;
}

export const PagePlaceholder: React.FC<PlaceholderProps> = ({ title, description, phase }) => {
  return (
    <div className="py-12 text-center max-w-lg mx-auto space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 mx-auto flex items-center justify-center">
        <Construction className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <SampleBadge />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Targeted for {phase}
        </span>
      </div>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export const TalentPlaceholder = () => (
  <PagePlaceholder
    title="Find Campus Talent"
    description="Directory of student freelancers with skills, rates, and portfolio showcases."
    phase="Phase 2"
  />
);

export const TalentDetailPlaceholder = () => {
  const { id } = useParams();
  return (
    <PagePlaceholder
      title={`Freelancer Profile (${id})`}
      description="Detailed student portfolio, verified student status, and direct request flow."
      phase="Phase 2"
    />
  );
};

export const GigsPlaceholder = () => (
  <PagePlaceholder
    title="Find Work (Gig Board)"
    description="Live campus micro-gigs, club tasks, and project requests with fair price ranges."
    phase="Phase 2"
  />
);

export const GigDetailPlaceholder = () => {
  const { id } = useParams();
  return (
    <PagePlaceholder
      title={`Gig Scope Details (${id})`}
      description="Scope checklist, deliverable specs, revision ceiling, and 1-click apply flow."
      phase="Phase 2"
    />
  );
};

export const PostGigPlaceholder = () => (
  <PagePlaceholder
    title="Post a Gig Wizard"
    description="4-step guided wizard utilizing category scope templates and fair price benchmarks."
    phase="Phase 3"
  />
);

export const AgreementPlaceholder = () => {
  const { id } = useParams();
  return (
    <PagePlaceholder
      title={`Agreement Card (${id})`}
      description="Bilateral contract terms, mutual sign-off, and prototype role switcher."
      phase="Phase 3"
    />
  );
};

export const DashboardPlaceholder = () => (
  <PagePlaceholder
    title="User Dashboard"
    description="Tabs for My Gigs, My Applications, My Agreements, and My Portfolio."
    phase="Phase 3"
  />
);

export const ShowcasePlaceholder = () => (
  <PagePlaceholder
    title="Portfolio Showcase"
    description="Public gallery of student work with category filters and base64 upload."
    phase="Phase 4"
  />
);

export const PriceGuidePlaceholder = () => (
  <PagePlaceholder
    title="Campus Fair Price Guide"
    description="Transparent rate benchmarks per task type with student survey estimates."
    phase="Phase 4"
  />
);

export const HowItWorksPlaceholder = () => (
  <PagePlaceholder
    title="How It Works"
    description="Illustrated steps for freelancers and clients, trust guidelines, and safety tips."
    phase="Phase 4"
  />
);

export const MentorPlaceholder = () => (
  <PagePlaceholder
    title="Mentor Hub"
    description="Startup-cell mentor view for tracking gig volume and endorsing student profiles."
    phase="Phase 4"
  />
);

export const AboutPlaceholder = () => (
  <PagePlaceholder
    title="About the Project (Design Thinking)"
    description="5 stages: Empathize, Define, Ideate, Prototype, Test with editable evidence blocks."
    phase="Phase 4"
  />
);

export const AdminPlaceholder = () => (
  <PagePlaceholder
    title="Admin & Research Console"
    description="Export/Import JSON, clear sample data, and feedback matrix with CSV download."
    phase="Phase 4"
  />
);

export const NotFoundPlaceholder = () => (
  <div className="py-16 text-center max-w-md mx-auto space-y-4">
    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
    <p className="text-sm text-slate-600 dark:text-slate-400">The page you requested was not found.</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to CampusGig Home</span>
    </Link>
  </div>
);
