import { APP_CONFIG } from '@/config/app.config';
import seedData from '@/data/seed.json';
import { 
  AppDatabase, 
  Profile, 
  Gig, 
  Application, 
  Agreement, 
  Review, 
  PortfolioItem, 
  PriceGuideEntry, 
  FeedbackSubmission, 
  AppLifecycleEvent, 
  DesignThinkingDoc,
  UserSession,
  UserRole
} from '@/types';
import { generateId } from './utils';

const STORE_EVENT = 'campusgig_store_updated';
const SESSION_EVENT = 'campusgig_session_updated';

// Safe parse helper
function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error parsing localStorage key ${key}:`, err);
    return fallback;
  }
}

// 1. Core Database operations
export function getDatabase(): AppDatabase {
  if (typeof window === 'undefined') return seedData as unknown as AppDatabase;
  const stored = localStorage.getItem(APP_CONFIG.storageKeys.data);
  if (!stored) {
    const initial = seedData as unknown as AppDatabase;
    localStorage.setItem(APP_CONFIG.storageKeys.data, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored) as AppDatabase;
  } catch {
    return seedData as unknown as AppDatabase;
  }
}

export function saveDatabase(db: AppDatabase): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APP_CONFIG.storageKeys.data, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

export function subscribeToStore(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(STORE_EVENT, handler);
  return () => window.removeEventListener(STORE_EVENT, handler);
}

// 2. Profiles
export function getProfiles(): Profile[] {
  return getDatabase().profiles || [];
}

export function getProfileById(id: string): Profile | undefined {
  return getProfiles().find((p) => p.id === id);
}

export function upsertProfile(profile: Profile): void {
  const db = getDatabase();
  const index = db.profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    db.profiles[index] = profile;
  } else {
    db.profiles.push(profile);
  }
  saveDatabase(db);
}

// 3. Gigs
export function getGigs(): Gig[] {
  return getDatabase().gigs || [];
}

export function getGigById(id: string): Gig | undefined {
  return getGigs().find((g) => g.id === id);
}

export function addGig(gigData: Omit<Gig, 'id' | 'createdAt'>): Gig {
  const db = getDatabase();
  const newGig: Gig = {
    ...gigData,
    id: generateId('gig'),
    createdAt: new Date().toISOString(),
  };
  db.gigs.unshift(newGig);
  saveDatabase(db);
  logEvent('gig_posted', newGig.id, 'client', { title: newGig.title, category: newGig.category });
  return newGig;
}

export function updateGig(gig: Gig): void {
  const db = getDatabase();
  const index = db.gigs.findIndex((g) => g.id === gig.id);
  if (index >= 0) {
    db.gigs[index] = gig;
    saveDatabase(db);
  }
}

// 4. Applications
export function getApplications(gigId?: string): Application[] {
  const apps = getDatabase().applications || [];
  if (gigId) {
    return apps.filter((a) => a.gigId === gigId);
  }
  return apps;
}

export function addApplication(appData: Omit<Application, 'id' | 'createdAt' | 'status'>): Application {
  const db = getDatabase();
  const newApp: Application = {
    ...appData,
    id: generateId('app'),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.applications.unshift(newApp);
  saveDatabase(db);
  logEvent('applied', newApp.id, 'freelancer', { gigId: newApp.gigId, quote: newApp.quote });
  return newApp;
}

export function updateApplication(app: Application): void {
  const db = getDatabase();
  const index = db.applications.findIndex((a) => a.id === app.id);
  if (index >= 0) {
    db.applications[index] = app;
    saveDatabase(db);
  }
}

// 5. Agreements & Lifecycle
export function getAgreements(): Agreement[] {
  return getDatabase().agreements || [];
}

export function getAgreementById(id: string): Agreement | undefined {
  return getAgreements().find((a) => a.id === id);
}

export function createAgreementFromApplication(app: Application, gig: Gig): Agreement {
  const db = getDatabase();
  const newAgr: Agreement = {
    id: generateId('agr'),
    gigId: gig.id,
    clientId: gig.clientId,
    freelancerId: app.freelancerId,
    gigTitle: gig.title,
    category: gig.category,
    agreedPrice: app.quote,
    deadline: gig.deadline,
    revisionsAllowed: gig.scope.revisionsAllowed || APP_CONFIG.defaultRevisions,
    deliveryFormat: gig.scope.format,
    paymentNote: `Agreed rate of $${app.quote}. Payable upon client verification of deliverables.`,
    terms: [
      `Deliverables: ${gig.scope.deliverables.join(', ')}`,
      `Maximum ${gig.scope.revisionsAllowed} round(s) of revisions included in agreed price.`,
      `Deliverable format: ${gig.scope.format}.`,
      `Payment is settled peer-to-peer upon confirmed delivery.`
    ],
    clientAgreed: true, // Auto-signed by client when accepting the application
    freelancerAgreed: false,
    status: 'matched',
    sample: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.agreements.unshift(newAgr);
  
  // Update gig status to matched
  const gigIndex = db.gigs.findIndex((g) => g.id === gig.id);
  if (gigIndex >= 0) {
    db.gigs[gigIndex].status = 'matched';
  }

  // Update application status
  const appIndex = db.applications.findIndex((a) => a.id === app.id);
  if (appIndex >= 0) {
    db.applications[appIndex].status = 'accepted';
  }

  saveDatabase(db);
  logEvent('matched', newAgr.id, 'client', { gigId: gig.id, freelancerId: app.freelancerId });
  return newAgr;
}

export function updateAgreement(agreement: Agreement): void {
  const db = getDatabase();
  const index = db.agreements.findIndex((a) => a.id === agreement.id);
  if (index >= 0) {
    db.agreements[index] = {
      ...agreement,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(db);
  }
}

// 6. Reviews
export function getReviews(agreementId?: string): Review[] {
  const reviews = getDatabase().reviews || [];
  if (agreementId) {
    return reviews.filter((r) => r.agreementId === agreementId);
  }
  return reviews;
}

export function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
  const db = getDatabase();
  const newRev: Review = {
    ...reviewData,
    id: generateId('rev'),
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(newRev);
  saveDatabase(db);
  return newRev;
}

// 7. Portfolio Items
export function getPortfolioItems(profileId?: string): PortfolioItem[] {
  const items = getDatabase().portfolioItems || [];
  if (profileId) {
    return items.filter((p) => p.profileId === profileId);
  }
  return items;
}

export function addPortfolioItem(itemData: Omit<PortfolioItem, 'id' | 'createdAt'>): PortfolioItem {
  const db = getDatabase();
  const newItem: PortfolioItem = {
    ...itemData,
    id: generateId('port'),
    createdAt: new Date().toISOString(),
  };
  db.portfolioItems.unshift(newItem);
  saveDatabase(db);
  return newItem;
}

// 8. Fair Price Guide
export function getPriceGuide(): PriceGuideEntry[] {
  return getDatabase().priceGuide || [];
}

export function updatePriceGuideEntry(entry: PriceGuideEntry): void {
  const db = getDatabase();
  const index = db.priceGuide.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    db.priceGuide[index] = entry;
    saveDatabase(db);
  }
}

// 9. Feedback & Event Log
export function getFeedback(): FeedbackSubmission[] {
  return getDatabase().feedback || [];
}

export function addFeedback(fbData: Omit<FeedbackSubmission, 'id' | 'timestamp' | 'status'>): FeedbackSubmission {
  const db = getDatabase();
  const newFb: FeedbackSubmission = {
    ...fbData,
    id: generateId('fb'),
    status: 'Open',
    timestamp: new Date().toISOString(),
  };
  if (!db.feedback) db.feedback = [];
  db.feedback.unshift(newFb);
  saveDatabase(db);
  return newFb;
}

export function updateFeedback(fb: FeedbackSubmission): void {
  const db = getDatabase();
  const index = db.feedback.findIndex((f) => f.id === fb.id);
  if (index >= 0) {
    db.feedback[index] = fb;
    saveDatabase(db);
  }
}

export function exportFeedbackCSV(): string {
  const items = getFeedback();
  if (items.length === 0) return 'No feedback submissions recorded yet.';
  
  const headers = ['ID', 'Timestamp', 'Tester Code', 'Page URL', 'Task Attempted', 'Severity', 'Issue Description', 'Change Made', 'Status'];
  const rows = items.map((item) => [
    `"${item.id}"`,
    `"${item.timestamp}"`,
    `"${item.testerCode}"`,
    `"${item.pageUrl}"`,
    `"${item.taskAttempted.replace(/"/g, '""')}"`,
    `"${item.severity}"`,
    `"${item.whatHappened.replace(/"/g, '""')}"`,
    `"${(item.changeMade || '').replace(/"/g, '""')}"`,
    `"${item.status}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function getEvents(): AppLifecycleEvent[] {
  return getDatabase().events || [];
}

export function logEvent(
  eventType: AppLifecycleEvent['eventType'],
  entityId: string,
  testerRole: string,
  metadata?: Record<string, any>
): void {
  const db = getDatabase();
  if (!db.events) db.events = [];
  const event: AppLifecycleEvent = {
    id: generateId('evt'),
    eventType,
    entityId,
    testerRole,
    timestamp: new Date().toISOString(),
    metadata,
  };
  db.events.unshift(event);
  saveDatabase(db);
}

// 10. Design Thinking Docs
export function getDtDocs(): DesignThinkingDoc[] {
  return getDatabase().dtDocs || [];
}

export function updateDtDoc(doc: DesignThinkingDoc): void {
  const db = getDatabase();
  const index = db.dtDocs.findIndex((d) => d.id === doc.id);
  if (index >= 0) {
    db.dtDocs[index] = {
      ...doc,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    saveDatabase(db);
  }
}

// 11. Admin & System Management
export function clearSampleData(): void {
  const db = getDatabase();
  db.profiles = db.profiles.filter((p) => !p.sample);
  db.portfolioItems = db.portfolioItems.filter((p) => !p.sample);
  db.gigs = db.gigs.filter((g) => !g.sample);
  db.applications = db.applications.filter((a) => !a.sample);
  db.agreements = db.agreements.filter((a) => !a.sample);
  db.reviews = db.reviews.filter((r) => !r.sample);
  // Keep price guide structure but remove sample flag if desired, or retain entries
  saveDatabase(db);
}

export function resetToFactorySeed(): void {
  const initial = seedData as unknown as AppDatabase;
  localStorage.setItem(APP_CONFIG.storageKeys.data, JSON.stringify(initial));
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

export function exportDataJSON(): string {
  return JSON.stringify(getDatabase(), null, 2);
}

export function importDataJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr) as AppDatabase;
    if (!parsed.profiles || !parsed.gigs) {
      throw new Error('Invalid CampusGig data structure: missing profiles or gigs.');
    }
    saveDatabase(parsed);
    return true;
  } catch (err) {
    console.error('Failed to import data:', err);
    return false;
  }
}

// 12. Simulated Auth Session
export function getSession(): UserSession | null {
  return safeJsonParse<UserSession | null>(APP_CONFIG.storageKeys.session, null);
}

export function setSession(session: UserSession | null): void {
  if (session) {
    localStorage.setItem(APP_CONFIG.storageKeys.session, JSON.stringify(session));
  } else {
    localStorage.removeItem(APP_CONFIG.storageKeys.session);
  }
  window.dispatchEvent(new CustomEvent(SESSION_EVENT));
}

export function subscribeToSession(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(SESSION_EVENT, handler);
  return () => window.removeEventListener(SESSION_EVENT, handler);
}

export function switchSessionRole(role: UserRole): void {
  const session = getSession();
  if (session) {
    session.currentRole = role;
    if (!session.roles.includes(role)) {
      session.roles.push(role);
    }
    setSession(session);
  }
}

export function checkAdminPasscode(code: string): boolean {
  return code.trim().toUpperCase() === APP_CONFIG.adminPasscode.toUpperCase();
}
