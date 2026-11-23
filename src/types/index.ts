export type UserRole = 'freelancer' | 'client' | 'mentor' | 'admin';

export type GigCategory = 'Design' | 'Code' | 'Video Editing' | 'Tutoring' | 'Photography' | 'Other';

export type GigStatus = 
  | 'open' 
  | 'matched' 
  | 'in_progress' 
  | 'delivered' 
  | 'completed' 
  | 'disputed' 
  | 'cancelled';

export interface UserSession {
  id: string;
  displayName: string;
  roles: UserRole[];
  currentRole: UserRole;
  avatarUrl?: string;
  department?: string;
  year?: string;
}

export interface Profile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio: string;
  roles: UserRole[];
  category: GigCategory;
  skills: string[];
  rateMin: number;
  rateMax: number;
  rateUnit: 'per hour' | 'per project';
  availability: 'Available now' | 'Part-time' | 'Busy this week';
  verifiedStudent: boolean;
  mentorEndorsed: boolean;
  mentorNotes?: string[];
  department?: string;
  year?: string;
  sample: boolean;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  profileId: string;
  title: string;
  description: string;
  imageUrl: string;
  category: GigCategory;
  gigId?: string;
  tags: string[];
  sample: boolean;
  createdAt: string;
}

export interface GigScope {
  description: string;
  deliverables: string[];
  format: string;
  revisionsAllowed: number;
}

export interface Gig {
  id: string;
  clientId: string;
  clientName: string;
  clientType: 'Student' | 'Club' | 'Department' | 'Startup';
  title: string;
  category: GigCategory;
  scope: GigScope;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: GigStatus;
  sample: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  gigId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerSkills: string[];
  pitch: string;
  quote: number;
  estimatedDays: number;
  portfolioSampleUrl?: string;
  status: 'pending' | 'accepted' | 'declined';
  sample: boolean;
  createdAt: string;
}

export interface Agreement {
  id: string;
  gigId: string;
  clientId: string;
  freelancerId: string;
  gigTitle: string;
  category: GigCategory;
  agreedPrice: number;
  deadline: string;
  revisionsAllowed: number;
  deliveryFormat: string;
  paymentNote: string;
  terms: string[];
  clientAgreed: boolean;
  freelancerAgreed: boolean;
  status: GigStatus;
  deliveredArtifactUrl?: string;
  deliveredNotes?: string;
  disputeReason?: string;
  sample: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  agreementId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'client' | 'freelancer';
  revieweeId: string;
  rating: number; // 1 to 5
  comment: string;
  sample: boolean;
  createdAt: string;
}

export interface PriceGuideEntry {
  id: string;
  category: GigCategory;
  taskType: string;
  min: number;
  max: number;
  unit: string;
  notes: string;
  isSurveyEstimate: boolean;
  sample: boolean;
}

export interface FeedbackSubmission {
  id: string;
  pageUrl: string;
  testerCode: string;
  taskAttempted: string;
  whatHappened: string;
  severity: 'low' | 'medium' | 'high';
  comment?: string;
  changeMade?: string;
  status: 'Open' | 'Reviewed' | 'Addressed';
  timestamp: string;
}

export interface AppLifecycleEvent {
  id: string;
  eventType: 
    | 'gig_posted' 
    | 'applied' 
    | 'matched' 
    | 'agreement_signed' 
    | 'delivered' 
    | 'completed' 
    | 'disputed';
  entityId: string;
  testerRole: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DesignThinkingDoc {
  id: string;
  stage: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
  title: string;
  content: string;
  lastUpdated: string;
}

export interface AppDatabase {
  profiles: Profile[];
  portfolioItems: PortfolioItem[];
  gigs: Gig[];
  applications: Application[];
  agreements: Agreement[];
  reviews: Review[];
  priceGuide: PriceGuideEntry[];
  feedback: FeedbackSubmission[];
  events: AppLifecycleEvent[];
  dtDocs: DesignThinkingDoc[];
}
