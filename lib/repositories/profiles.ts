/**
 * SHIPOS V1 — Profiles Repository (mock)
 */

import type { ShipProfile, ShipRole } from '@/types/shipos';
import { profiles, persistMockDb } from '@/data/mockShipos';
import {
  getShipSession,
  createSessionForProfile,
  saveShipSession,
} from '@/lib/shipos/storage';
import { createActivityEvent } from '@/lib/shipos/activity';

export function getCurrentProfile(): ShipProfile | null {
  const session = getShipSession();
  if (!session) return null;
  return profiles.find((p) => p.id === session.profileId) ?? null;
}

export function getProfileByEmail(email: string): ShipProfile | undefined {
  const normalized = email.toLowerCase().trim();
  return profiles.find((p) => p.email.toLowerCase() === normalized);
}

export function getProfileById(id: string): ShipProfile | undefined {
  return profiles.find((p) => p.id === id);
}

/**
 * Create or update a profile (light upsert).
 * In V1 this is primarily driven by applications.
 */
export function upsertProfile(profile: Omit<ShipProfile, "id" | "createdAt"> & { id?: string }): ShipProfile {
  const existing = profile.id ? profiles.find((p) => p.id === profile.id) : undefined;

  if (existing) {
    Object.assign(existing, profile, { updatedAt: new Date().toISOString() });
    persistMockDb();
    return existing;
  }

  const newProfile: ShipProfile = {
    id: profile.id ?? `prof_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    ...profile,
  } as ShipProfile;

  profiles.push(newProfile);
  persistMockDb();

  const evt = createActivityEvent({
    actorProfileId: newProfile.id,
    actorRole: newProfile.role,
    type: "profile_created",
    targetType: "profile",
    targetId: newProfile.id,
    payload: { role: newProfile.role },
    visibleTo: ["ops"],
  });

  return newProfile;
}

/**
 * Convenience: given an application, ensure a profile exists and optionally
 * save a demo session for it. Returns the profile.
 */
export function ensureProfileFromApplicationAndSetSession(appEmail: string, role: ShipRole): ShipProfile | null {
  let profile = getProfileByEmail(appEmail);
  if (!profile) {
    // Fallback minimal creation (should normally come via upsertProfileFromApplication)
    profile = upsertProfile({
      email: appEmail,
      name: appEmail.split("@")[0],
      role,
    });
  }

  const session = createSessionForProfile(profile);
  // Persist demo session (side-effecting but required for "signed in" state in later phases)
  saveShipSession(session);

  return profile;
}

// Re-export for type consumers if needed
export type { ShipProfile, ShipRole };
