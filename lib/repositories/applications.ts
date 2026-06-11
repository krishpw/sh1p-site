/**
 * SHIPOS V1 — Applications Repository (mock)
 * All functions are additive and mutate the shared mock store when appropriate.
 * Persistence is handled via data/mockShipos.ts helpers.
 */

import type {
  ShipApplication,
  ApplicationStatus,
  ShipProfile,
  ShipRole,
} from '@/types/shipos';
import {
  applications,
  profiles,
  persistMockDb,
} from '@/data/mockShipos';
import { createActivityEvent } from '@/lib/shipos/activity';

/**
 * Create a new application (used during public → SHIPOS handoff).
 */
export function createApplication(
  data: Omit<ShipApplication, "id" | "submittedAt"> & { submittedAt?: string }
): ShipApplication {
  const app: ShipApplication = {
    id: `app_${Date.now().toString(36)}`,
    submittedAt: data.submittedAt ?? new Date().toISOString(),
    ...data,
  };
  applications.push(app);
  persistMockDb();

  // Record as activity (visible to ops + the applicant role)
  const routeRole = data.routeType === "founder" ? "founder" : data.routeType === "campus_lead" ? "campus_lead" : "scout";
  const evt = createActivityEvent({
    actorProfileId: undefined,
    actorRole: routeRole,
    type: "application_submitted",
    targetType: "application",
    targetId: app.id,
    payload: { routeType: data.routeType, email: data.email },
    visibleTo: "all",
  });
  // Note: activity repo will also persist its list; we push here for simplicity in V1
  // (activityEvents is also exported from mock data)
  // To keep single source, we push directly via the same module pattern.
  // The activity repository will surface it.
  (applications as any)._lastCreatedActivityForTest = evt; // harmless marker

  return app;
}

export function listApplications(filter?: {
  status?: ApplicationStatus;
  routeType?: "founder" | "campus_lead" | "scout";
}): ShipApplication[] {
  let result = [...applications];
  if (filter?.status) {
    result = result.filter((a) => a.status === filter.status);
  }
  if (filter?.routeType) {
    result = result.filter((a) => a.routeType === filter.routeType);
  }
  return result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function getApplicationById(id: string): ShipApplication | undefined {
  return applications.find((a) => a.id === id);
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): ShipApplication | undefined {
  const app = applications.find((a) => a.id === id);
  if (!app) return undefined;

  const previous = app.status;
  app.status = status;
  persistMockDb();

  // Side-effect activity for ops visibility
  const evt = createActivityEvent({
    actorProfileId: "prof_ops_001",
    actorRole: "ops",
    type: "application_status_changed",
    targetType: "application",
    targetId: id,
    payload: { from: previous, to: status },
    visibleTo: ["ops"],
  });
  // The activity list will pick it up on next read because we share the module state.
  return app;
}

/**
 * Link an existing application to a profile (after sign-in / account creation).
 */
export function linkApplicationToProfile(
  applicationId: string,
  profileId: string
): ShipApplication | undefined {
  const app = applications.find((a) => a.id === applicationId);
  if (!app) return undefined;

  app.profileId = profileId;
  persistMockDb();
  return app;
}

/**
 * Upsert a minimal profile derived from a public application.
 * Used in the post-apply transition flow.
 */
export function upsertProfileFromApplication(app: ShipApplication): ShipProfile {
  const existing = profiles.find(
    (p) => p.email.toLowerCase() === app.email.toLowerCase()
  );
  if (existing) {
    return existing;
  }

  const role: ShipRole =
    app.routeType === "founder"
      ? "founder"
      : app.routeType === "campus_lead"
      ? "campus_lead"
      : "scout";

  const name =
    (app.payload.full_name as string) ||
    (app.payload.name as string) ||
    (app.payload.email as string)?.split("@")[0] ||
    "Applicant";

  const newProfile: ShipProfile = {
    id: `prof_${Date.now().toString(36)}`,
    email: app.email,
    name,
    role,
    createdAt: app.submittedAt,
  };

  profiles.push(newProfile);
  persistMockDb();

  // Also create a profile_created activity
  const evt = createActivityEvent({
    actorProfileId: newProfile.id,
    actorRole: role,
    type: "profile_created",
    targetType: "profile",
    targetId: newProfile.id,
    payload: { fromApplication: app.id, routeType: app.routeType },
    visibleTo: ["ops"],
  });

  return newProfile;
}

// (types already imported at top)
