/**
 * SHIPOS V1 — LocalStorage / Session helpers
 * Pure client-side persistence for demo mode.
 * Never used for secrets. Safe to call in any environment (graceful no-op on server).
 */

import type { ShipSession, ShipRole } from '@/types/shipos';

const SESSION_KEY = "shipos_session";
const MOCK_DB_KEY = "shipos_mock_db_v1"; // used by data/mockShipos.ts

export interface StoredSession extends ShipSession {}

/**
 * Retrieve current demo session (if any).
 */
export function getShipSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    // Basic shape validation
    if (parsed && parsed.profileId && parsed.role && parsed.email) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persist a demo session (used after handoff or explicit sign-in in later phases).
 */
export function saveShipSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // quota / private browsing — ignore
  }
}

/**
 * Clear the current demo session (sign out).
 */
export function clearShipSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

/**
 * Helper to quickly create a session object for a known profile.
 */
export function createSessionForProfile(profile: { id: string; role: ShipRole; email: string }): StoredSession {
  return {
    profileId: profile.id,
    role: profile.role,
    email: profile.email,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Low-level helpers for the mock DB (primarily called from data/mockShipos.ts and repositories).
 * These are intentionally thin wrappers so the shape of persisted state stays in one place.
 */
export function loadMockDbRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(MOCK_DB_KEY);
  } catch {
    return null;
  }
}

export function saveMockDbRaw(json: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_DB_KEY, json);
  } catch {
    // ignore
  }
}

/**
 * Completely wipe SHIPOS local demo data (session + mock db).
 * Useful for resetting the foundation during development.
 */
export function clearAllShiposLocalData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(MOCK_DB_KEY);
  } catch {
    // ignore
  }
}
