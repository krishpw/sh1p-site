/**
 * SHIPOS V1 — Core Domain Types
 * Additive foundation. All types are serializable for localStorage / future Supabase.
 * Do not import UI components here.
 */

export type ShipRole =
  | "founder"
  | "campus_lead"
  | "scout"
  | "investor"
  | "ops";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "request_more_info"
  | "interview"
  | "accepted"
  | "waitlisted"
  | "rejected";

export type FounderLeadStatus =
  | "submitted"
  | "needs_research"
  | "watch"
  | "contacted"
  | "founder_meeting"
  | "demo_review"
  | "investor_ready"
  | "delivered_to_firm"
  | "passed";

export interface ShipProfile {
  id: string;
  email: string;
  name: string;
  role: ShipRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ShipApplication {
  id: string;
  email: string;
  routeType: "founder" | "campus_lead" | "scout";
  status: ApplicationStatus;
  payload: Record<string, unknown>; // raw form fields from public application (name, email, school, why_*, pitch, profile, etc.)
  profileId?: string; // linked after auth / upsert
  submittedAt: string;
}

export interface FounderProfile extends ShipProfile {
  role: "founder";
  companyName?: string;
  projectDescription?: string;
  traction: Array<{
    type: string; // "users" | "revenue" | "partnership" | "mvp" | "press"
    value: string;
    date?: string;
  }>;
  school?: string;
  links: string[];
  signalNotes?: string;
}

export interface CampusLeadProfile extends ShipProfile {
  role: "campus_lead";
  school: string;
  graduationYear?: string;
  whyLead: string;
  founderToWatch?: string;
}

export interface ScoutProfile extends ShipProfile {
  role: "scout";
  whyScout: string;
  founderToWatch?: string;
  weeklyGoal?: number; // e.g. 3
}

export interface Campus {
  id: string;
  name: string; // school / university name
  location?: string;
  website?: string;
}

export interface CampusCell {
  id: string;
  campusId: string;
  leadProfileId: string;
  scouts: string[]; // profile ids of recruited scouts
  status: "forming" | "active" | "inactive";
  checklist: Record<string, boolean>; // e.g. { "recruited_2_scouts": true, "first_lead_submitted": false }
  createdAt: string;
}

export interface FounderLead {
  id: string;
  submittedByProfileId: string; // scout or campus_lead who surfaced it
  submittedByRole: "scout" | "campus_lead";
  founderName: string;
  founderEmail?: string;
  founderLinks?: string;
  signal: string; // short "why high signal" note
  traction?: string;
  status: FounderLeadStatus;
  campusId?: string; // if from a campus cell
  notes: Array<{
    text: string;
    authorId: string;
    at: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface FounderScore {
  profileId: string;
  total: number; // 0-100
  breakdown: {
    executionVelocity: number;
    marketClarity: number;
    founderMarketFit: number;
    communication: number;
    networkSignal: number;
  };
  computedAt: string;
  notes?: string;
}

export interface VcFirm {
  id: string;
  name: string;
  contactEmail: string;
  thesisSummary: string;
}

export interface FirmThesis {
  firmId: string;
  stages: string[]; // "pre-seed" | "seed" | ...
  sectors: string[];
  geographies: string[];
  signals: string[]; // e.g. "strong distribution", "technical founder"
}

export interface FirmFounderScore {
  firmId: string;
  founderProfileId: string;
  fitScore: number; // 0-100
  reasons: string[];
}

export interface MonthlyDelivery {
  id: string;
  firmId: string;
  month: string; // "2026-06"
  founders: string[]; // founder profileIds included
  status: "draft" | "composed" | "sent";
  createdAt: string;
}

export interface DeliverySignal {
  deliveryId: string;
  founderProfileId: string;
  signal: "pass" | "interested" | "want_intro";
  notes?: string;
  at: string;
}

export interface IntroRequest {
  id: string;
  firmId: string;
  founderProfileId: string;
  status: "requested" | "intro_made" | "declined";
  requestedAt: string;
}

export interface ActivityEvent {
  id: string;
  actorProfileId?: string;
  actorRole?: ShipRole;
  type: string; // "application_submitted" | "application_status_changed" | "lead_submitted" | "lead_status_updated" | "traction_added" | "scout_recruited" | "campus_cell_formed" | "profile_created"
  targetType: "application" | "profile" | "lead" | "cell" | "delivery" | "intro";
  targetId: string;
  payload: Record<string, unknown>;
  timestamp: string;
  visibleTo: ShipRole[] | "all";
}

export interface ShipSession {
  profileId: string;
  role: ShipRole;
  email: string;
  createdAt: string;
}

// V1 Productization additions
export interface PartnerOffer {
  id: string;
  title: string;
  category: string;
  eligibility: string; // e.g. "founder accepted" or "traction > 10"
  description: string;
  actionLabel: string;
  locked: boolean;
}

export interface NewsletterPost {
  id: string;
  title: string;
  summary: string;
  category: string; // founder, campus, scout, ops
  publishedAt: string;
  content: string; // simple text for V1
}

export interface DeliveryPacket {
  id: string;
  month: string;
  firmId?: string;
  founders: string[]; // profile or lead ids
  status: "draft" | "composed" | "sent";
  createdAt: string;
}

export interface DeliverySignal {
  id: string;
  packetId: string;
  targetId: string; // founder/lead
  signal: "pass" | "interested" | "want_intro";
  notes?: string;
  at: string;
}

export interface IntroRequest {
  id: string;
  firmId: string;
  targetId: string;
  status: "requested" | "intro_made" | "declined";
  requestedAt: string;
}

// Phase 5 productization: additional purposeful entities
export type CellStatus =
  | "application_submitted"
  | "cell_forming"
  | "scout_recruiting"
  | "active"
  | "high_signal";

export interface ScoutRecord {
  id: string;
  name: string;
  email: string;
  roleFocus?: string;
  campusCellId: string;
  createdAt: string;
}

export interface WeeklyCheckIn {
  id: string;
  campusLeadProfileId: string;
  weekOf: string;
  conversations: number;
  events: number;
  strongestSignal: string;
  blocker?: string;
  createdAt: string;
}

export interface OpsNote {
  id: string;
  targetType: "application" | "lead";
  targetId: string;
  note: string;
  decisionReason?: string;
  nextStep?: string;
  authorId: string;
  at: string;
}

export interface TractionUpdate {
  id: string;
  profileId: string;
  type: string;
  value: string;
  link?: string;
  note?: string;
  createdAt: string;
}

// Update CampusCell to use richer status
// (existing interface kept for compat; status can be CellStatus string)
