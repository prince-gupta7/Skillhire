export const APP_CONFIG = {
  appName: "CampusGigs",
  tagline: "Skills for Hire",
  description: "Connect skilled student freelancers with campus clubs, researchers, and peers. Verified .edu accounts, transparent student rate benchmarks, and zero platform cuts.",
  courseProject: 'P25 "Skills for Hire, Campus Edition"',
  adminPasscode: "CAMPUS25",
  currencySymbol: "$",
  colors: {
    primaryBrand: "#B84B30", // Terracotta / Brick-red primary CTA color
    primaryBrandHover: "#9F3A22",
    accentBlue: "#2563EB",
    activePillBg: "#DBEAFE",
    activePillText: "#1D4ED8",
  },
  storageKeys: {
    data: "campusgigs_data_v1",
    session: "campusgigs_session_v1",
    theme: "campusgigs_theme_v1",
    events: "campusgigs_events_v1",
    feedback: "campusgigs_feedback_v1",
    tourDismissed: "campusgigs_tour_dismissed_v1",
  },
  categories: [
    { id: "Design", name: "Design" },
    { id: "Coding", name: "Coding" },
    { id: "Video Editing", name: "Video Editing" },
    { id: "Tutoring", name: "Tutoring" },
    { id: "Photography", name: "Photography" },
  ] as const,
  defaultRevisions: 2,
};

export type CategoryId = typeof APP_CONFIG.categories[number]['id'];
