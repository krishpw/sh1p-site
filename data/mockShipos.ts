/**
 * SHIPOS V1 — Deterministic Mock Data
 * Seeded realistic applicants, applications, leads, cells, activity, scores.
 * Hydrates from localStorage 'shipos_mock_db_v1' when present (client only).
 * All IDs and timestamps are stable for demo reproducibility.
 */

import type {
  ShipProfile,
  ShipApplication,
  FounderProfile,
  CampusLeadProfile,
  ScoutProfile,
  Campus,
  CampusCell,
  FounderLead,
  FounderScore,
  VcFirm,
  FirmThesis,
  ActivityEvent,
  ApplicationStatus,
  FounderLeadStatus,
} from '@/types/shipos';

// ---------------------------
// Seed factories (pure, deterministic)
// ---------------------------

function seedProfiles(): ShipProfile[] {
  const now = "2026-05-20T09:00:00.000Z";
  return [
    // Founder applicant (from cohort route)
    {
      id: "prof_founder_001",
      email: "alex.rivera@founder.dev",
      name: "Alex Rivera",
      role: "founder",
      createdAt: now,
    } as FounderProfile,
    // Campus lead applicant
    {
      id: "prof_campus_001",
      email: "jordan.hale@stanford.edu",
      name: "Jordan Hale",
      role: "campus_lead",
      createdAt: now,
    } as CampusLeadProfile,
    // Scout applicant
    {
      id: "prof_scout_001",
      email: "sam.patel@mit.edu",
      name: "Sam Patel",
      role: "scout",
      createdAt: now,
    } as ScoutProfile,
    // Ops internal
    {
      id: "prof_ops_001",
      email: "ops@ship.vc",
      name: "SHIP Ops",
      role: "ops",
      createdAt: "2026-01-10T12:00:00.000Z",
    },
    // Future investor / firm contact (placeholder user)
    {
      id: "prof_investor_001",
      email: "partners@foundersvc.com",
      name: "Maya Chen",
      role: "investor",
      createdAt: "2026-04-01T08:30:00.000Z",
    },
  ];
}

function seedApplications(): ShipApplication[] {
  const base = "2026-06-05T14:22:00.000Z";
  return [
    // Cohort / Founder application
    {
      id: "app_cohort_001",
      email: "alex.rivera@founder.dev",
      routeType: "founder",
      status: "under_review",
      payload: {
        application_type: "Cohort",
        name: "Alex Rivera",
        email: "alex.rivera@founder.dev",
        social: "https://x.com/alexbuilds",
        pitch: "Building the fastest way for indie hackers to validate distribution channels. 3 pilots live, 420 waitlist, first paying customer this week.",
      },
      profileId: "prof_founder_001",
      submittedAt: base,
    },
    // Campus Lead application
    {
      id: "app_campus_001",
      email: "jordan.hale@stanford.edu",
      routeType: "campus_lead",
      status: "submitted",
      payload: {
        application_type: "Campus Lead",
        full_name: "Jordan Hale",
        email: "jordan.hale@stanford.edu",
        school: "Stanford University",
        graduation_year: "2027",
        profile: "https://linkedin.com/in/jordanhale",
        what_else_are_you_doing: "Run the product club (180 members), previously TA for CS147.",
        why_campus_lead: "I already know the 5 strongest technical founders on campus and can get them to apply in week 1.",
        founder_to_watch: "Lila Chen — building vertical AI for lab notebooks, just closed first pilot with Stanford Med.",
      },
      profileId: "prof_campus_001",
      submittedAt: "2026-06-06T11:05:00.000Z",
    },
    // Scout application
    {
      id: "app_scout_001",
      email: "sam.patel@mit.edu",
      routeType: "scout",
      status: "submitted",
      payload: {
        application_type: "Scout",
        full_name: "Sam Patel",
        email: "sam.patel@mit.edu",
        school: "MIT",
        profile: "https://x.com/sampatelfounders",
        what_else_are_you_doing: "Organize the 0→1 hackathon series, write the 'Underrated MIT' newsletter (1.8k subs).",
        why_scout: "I eat lunch with the people who ship on weekends. I can surface 3-4 serious builders per month before any VC hears the name.",
        founder_to_watch: "Tyler Ngo — dropped out last month, already has 12 enterprise pilots for his devtool.",
      },
      profileId: "prof_scout_001",
      submittedAt: "2026-06-07T16:40:00.000Z",
    },
  ];
}

function seedFounderProfiles(): FounderProfile[] {
  return [
    {
      id: "prof_founder_001",
      email: "alex.rivera@founder.dev",
      name: "Alex Rivera",
      role: "founder",
      companyName: "ChannelZero",
      projectDescription: "Fastest way for indie hackers to validate distribution channels. 3 pilots live, 420 waitlist.",
      traction: [
        { type: "waitlist", value: "420 signups", date: "2026-06-01" },
        { type: "pilot", value: "3 active pilots", date: "2026-05-28" },
        { type: "customer", value: "1 paying customer ($49/mo)", date: "2026-06-04" },
      ],
      school: "UC Berkeley (dropped out)",
      links: ["https://x.com/alexbuilds", "https://channelzero.dev"],
      signalNotes: "High execution velocity. Clear wedge in indie distribution tooling.",
      createdAt: "2026-05-20T09:00:00.000Z",
    },
  ];
}

function seedCampusCells(): CampusCell[] {
  return [
    {
      id: "cell_stanford_001",
      campusId: "campus_stanford",
      leadProfileId: "prof_campus_001",
      scouts: [], // will grow when invites accepted in later phases
      status: "forming",
      checklist: {
        recruited_2_scouts: false,
        first_lead_submitted: false,
        weekly_checkin_setup: true,
      },
      createdAt: "2026-06-06T12:00:00.000Z",
    },
  ];
}

function seedCampuses(): Campus[] {
  return [
    {
      id: "campus_stanford",
      name: "Stanford University",
      location: "Stanford, CA",
    },
    {
      id: "campus_mit",
      name: "MIT",
      location: "Cambridge, MA",
    },
  ];
}

function seedFounderLeads(): FounderLead[] {
  const now = "2026-06-08T10:15:00.000Z";
  return [
    {
      id: "lead_001",
      submittedByProfileId: "prof_scout_001",
      submittedByRole: "scout",
      founderName: "Tyler Ngo",
      founderEmail: "tyler@ngo.dev",
      founderLinks: "https://x.com/tylerngo",
      signal: "Dropped out 3 weeks ago. Already 12 enterprise pilots for devtool that auto-documents internal APIs from runtime.",
      traction: "12 pilots, 2 LOIs, shipping every day.",
      status: "submitted",
      notes: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "lead_002",
      submittedByProfileId: "prof_campus_001",
      submittedByRole: "campus_lead",
      founderName: "Lila Chen",
      founderEmail: "lila@labnote.ai",
      founderLinks: "https://linkedin.com/in/lilachen",
      signal: "Vertical AI for wet lab notebooks. First pilot with Stanford Med just signed. Founder is PhD student who hates paper.",
      traction: "1 signed pilot (Stanford), 3 more in discussion, built in 6 weeks.",
      status: "needs_research",
      campusId: "campus_stanford",
      notes: [
        {
          text: "Strong founder-market fit. Need to verify pilot contract size.",
          authorId: "prof_ops_001",
          at: "2026-06-08T11:30:00.000Z",
        },
      ],
      createdAt: "2026-06-07T09:20:00.000Z",
      updatedAt: "2026-06-08T11:30:00.000Z",
    },
  ];
}

function seedActivityEvents(): ActivityEvent[] {
  return [
    {
      id: "evt_001",
      actorProfileId: "prof_founder_001",
      actorRole: "founder",
      type: "application_submitted",
      targetType: "application",
      targetId: "app_cohort_001",
      payload: { routeType: "founder" },
      timestamp: "2026-06-05T14:22:00.000Z",
      visibleTo: "all",
    },
    {
      id: "evt_002",
      actorProfileId: "prof_ops_001",
      actorRole: "ops",
      type: "application_status_changed",
      targetType: "application",
      targetId: "app_cohort_001",
      payload: { from: "submitted", to: "under_review" },
      timestamp: "2026-06-06T09:15:00.000Z",
      visibleTo: ["ops", "founder"],
    },
    {
      id: "evt_003",
      actorProfileId: "prof_campus_001",
      actorRole: "campus_lead",
      type: "application_submitted",
      targetType: "application",
      targetId: "app_campus_001",
      payload: { routeType: "campus_lead", school: "Stanford University" },
      timestamp: "2026-06-06T11:05:00.000Z",
      visibleTo: "all",
    },
    {
      id: "evt_004",
      actorProfileId: "prof_scout_001",
      actorRole: "scout",
      type: "application_submitted",
      targetType: "application",
      targetId: "app_scout_001",
      payload: { routeType: "scout" },
      timestamp: "2026-06-07T16:40:00.000Z",
      visibleTo: "all",
    },
    {
      id: "evt_005",
      actorProfileId: "prof_scout_001",
      actorRole: "scout",
      type: "lead_submitted",
      targetType: "lead",
      targetId: "lead_001",
      payload: { founderName: "Tyler Ngo" },
      timestamp: "2026-06-08T10:15:00.000Z",
      visibleTo: ["ops", "scout"],
    },
    {
      id: "evt_006",
      actorProfileId: "prof_campus_001",
      actorRole: "campus_lead",
      type: "lead_submitted",
      targetType: "lead",
      targetId: "lead_002",
      payload: { founderName: "Lila Chen", campus: "Stanford" },
      timestamp: "2026-06-07T09:20:00.000Z",
      visibleTo: ["ops", "campus_lead"],
    },
    {
      id: "evt_007",
      actorProfileId: "prof_ops_001",
      actorRole: "ops",
      type: "lead_status_updated",
      targetType: "lead",
      targetId: "lead_002",
      payload: { from: "submitted", to: "needs_research" },
      timestamp: "2026-06-08T11:30:00.000Z",
      visibleTo: "all",
    },
    {
      id: "evt_008",
      actorProfileId: "prof_founder_001",
      actorRole: "founder",
      type: "traction_added",
      targetType: "profile",
      targetId: "prof_founder_001",
      payload: { type: "customer", value: "1 paying customer ($49/mo)" },
      timestamp: "2026-06-04T18:00:00.000Z",
      visibleTo: ["ops", "founder"],
    },
  ];
}

function seedFounderScores(): FounderScore[] {
  return [
    {
      profileId: "prof_founder_001",
      total: 78,
      breakdown: {
        executionVelocity: 22,
        marketClarity: 16,
        founderMarketFit: 18,
        communication: 12,
        networkSignal: 10,
      },
      computedAt: "2026-06-08T12:00:00.000Z",
      notes: "Strong recent traction signal. Clear distribution wedge.",
    },
  ];
}

function seedVcFirms(): VcFirm[] {
  return [
    {
      id: "firm_foundersvc",
      name: "Founders VC",
      contactEmail: "partners@foundersvc.com",
      thesisSummary: "Pre-seed / seed technical founders with unfair distribution or infra advantages. Heavy US + Europe.",
    },
  ];
}

function seedFirmTheses(): FirmThesis[] {
  return [
    {
      firmId: "firm_foundersvc",
      stages: ["pre-seed", "seed"],
      sectors: ["devtools", "infra", "vertical ai", "consumer tools"],
      geographies: ["US", "Europe"],
      signals: ["strong distribution", "technical founder", "indie hacker DNA"],
    },
  ];
}

// ---------------------------
// Mutable store (hydrated from localStorage on client)
// ---------------------------

export let profiles: ShipProfile[] = [];
export let applications: ShipApplication[] = [];
export let founderProfiles: FounderProfile[] = [];
export let campusCells: CampusCell[] = [];
export let campuses: Campus[] = [];
export let founderLeads: FounderLead[] = [];
export let activityEvents: ActivityEvent[] = [];
export let founderScores: FounderScore[] = [];
export let vcFirms: VcFirm[] = [];
export let firmTheses: FirmThesis[] = [];

const DB_KEY = "shipos_mock_db_v1";

function persistMockDb(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DB_KEY,
      JSON.stringify({
        profiles,
        applications,
        founderProfiles,
        campusCells,
        campuses,
        founderLeads,
        activityEvents,
        founderScores,
        vcFirms,
        firmTheses,
      })
    );
  } catch {
    // ignore storage quota / private mode
  }
}

function loadOrSeed(): void {
  const seedProfilesData = seedProfiles();
  const seedApps = seedApplications();
  const seedFProfiles = seedFounderProfiles();
  const seedCells = seedCampusCells();
  const seedCamp = seedCampuses();
  const seedLeads = seedFounderLeads();
  const seedActivity = seedActivityEvents();
  const seedScores = seedFounderScores();
  const seedFirms = seedVcFirms();
  const seedTheses = seedFirmTheses();

  if (typeof window === "undefined") {
    // Build / SSR / test environment — always use clean seed
    profiles = [...seedProfilesData];
    applications = [...seedApps];
    founderProfiles = [...seedFProfiles];
    campusCells = [...seedCells];
    campuses = [...seedCamp];
    founderLeads = [...seedLeads];
    activityEvents = [...seedActivity];
    founderScores = [...seedScores];
    vcFirms = [...seedFirms];
    firmTheses = [...seedTheses];
    return;
  }

  try {
    const savedRaw = localStorage.getItem(DB_KEY);
    if (savedRaw) {
      const saved = JSON.parse(savedRaw);
      profiles = Array.isArray(saved.profiles) ? saved.profiles : [...seedProfilesData];
      applications = Array.isArray(saved.applications) ? saved.applications : [...seedApps];
      founderProfiles = Array.isArray(saved.founderProfiles) ? saved.founderProfiles : [...seedFProfiles];
      campusCells = Array.isArray(saved.campusCells) ? saved.campusCells : [...seedCells];
      campuses = Array.isArray(saved.campuses) ? saved.campuses : [...seedCamp];
      founderLeads = Array.isArray(saved.founderLeads) ? saved.founderLeads : [...seedLeads];
      activityEvents = Array.isArray(saved.activityEvents) ? saved.activityEvents : [...seedActivity];
      founderScores = Array.isArray(saved.founderScores) ? saved.founderScores : [...seedScores];
      vcFirms = Array.isArray(saved.vcFirms) ? saved.vcFirms : [...seedFirms];
      firmTheses = Array.isArray(saved.firmTheses) ? saved.firmTheses : [...seedTheses];
      return;
    }
  } catch {
    // corrupt storage — fall through to seed
  }

  // Fresh seed + persist
  profiles = [...seedProfilesData];
  applications = [...seedApps];
  founderProfiles = [...seedFProfiles];
  campusCells = [...seedCells];
  campuses = [...seedCamp];
  founderLeads = [...seedLeads];
  activityEvents = [...seedActivity];
  founderScores = [...seedScores];
  vcFirms = [...seedFirms];
  firmTheses = [...seedTheses];
  persistMockDb();
}

// Initialize immediately on module load
loadOrSeed();

// Expose for repos + future debug (non-enumerable in practice)
export { persistMockDb };

// Convenience reset for development (not used by production paths)
export function resetMockDbToSeed(): void {
  const seedProfilesData = seedProfiles();
  const seedApps = seedApplications();
  const seedFProfiles = seedFounderProfiles();
  const seedCells = seedCampusCells();
  const seedCamp = seedCampuses();
  const seedLeads = seedFounderLeads();
  const seedActivity = seedActivityEvents();
  const seedScores = seedFounderScores();
  const seedFirms = seedVcFirms();
  const seedTheses = seedFirmTheses();

  profiles = [...seedProfilesData];
  applications = [...seedApps];
  founderProfiles = [...seedFProfiles];
  campusCells = [...seedCells];
  campuses = [...seedCamp];
  founderLeads = [...seedLeads];
  activityEvents = [...seedActivity];
  founderScores = [...seedScores];
  vcFirms = [...seedFirms];
  firmTheses = [...seedTheses];

  if (typeof window !== "undefined") {
    localStorage.removeItem(DB_KEY);
  }
  persistMockDb();
}
