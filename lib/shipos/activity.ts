/**
 * SHIPOS V1 — Activity Event model + pure helpers
 * Activity is the "living signal map" audit log.
 * Creation is pure here; persistence / mutation lives in the repository layer.
 */

import type { ActivityEvent, ShipRole } from '@/types/shipos';

/**
 * Pure factory for a new ActivityEvent.
 * Does not mutate any store. Callers (repositories) are responsible for pushing + persisting.
 */
export function createActivityEvent(
  input: Omit<ActivityEvent, "id" | "timestamp">
): ActivityEvent {
  return {
    id: `evt_${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    ...input,
  };
}

/**
 * Pure filter + sort for a profile's visible activity.
 * Used by UI later; works on any array.
 */
export function filterActivityForProfile(
  events: ActivityEvent[],
  profileId: string,
  role: ShipRole
): ActivityEvent[] {
  return events
    .filter((e) => {
      if (e.actorProfileId === profileId) return true;
      if (e.visibleTo === "all") return true;
      if (Array.isArray(e.visibleTo) && e.visibleTo.includes(role)) return true;
      return false;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Pure filter for ops / full view (most recent first).
 */
export function filterActivityForOps(events: ActivityEvent[]): ActivityEvent[] {
  return [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Small helper to summarize an event for timelines (pure, no side effects).
 */
export function describeActivityEvent(e: ActivityEvent): string {
  switch (e.type) {
    case "application_submitted":
      return `Application submitted for ${String(e.payload.routeType || "route")}`;
    case "application_status_changed":
      return `Application moved to ${String(e.payload.to || e.payload.status || "new status")}`;
    case "lead_submitted":
      return `Founder lead submitted: ${String(e.payload.founderName || "unknown")}`;
    case "lead_status_updated":
      return `Lead status → ${String(e.payload.to || "updated")}`;
    case "traction_added":
      return `Traction signal added`;
    default:
      return e.type.replace(/_/g, " ");
  }
}
