/**
 * SHIPOS Phase 2 — Session + internal route helper (hash + localStorage)
 * Additive. Reuses Phase 1 storage primitives where possible.
 * No side effects on public site.
 */

import type { ShipRole } from '@/types/shipos';
import {
  getShipSession,
  saveShipSession,
  createSessionForProfile,
  clearShipSession,
} from './storage';

// Preferred Phase 2 view types (map from hash)
export type ShiposView = 'portal' | 'founder' | 'campus' | 'scout' | 'ops' | 'firm';

const VIEW_MAP: Record<ShiposView, string> = {
  portal: '#shipos',
  founder: '#shipos/founder',
  campus: '#shipos/campus',
  scout: '#shipos/scout',
  ops: '#shipos/ops',
  firm: '#shipos/firm',
};

const REVERSE_MAP: Record<string, ShiposView> = {
  '': 'portal',
  'portal': 'portal',
  'founder': 'founder',
  'route': 'founder',
  'campus': 'campus',
  'campus_lead': 'campus',
  'scout': 'scout',
  'ops': 'ops',
  'ops-console': 'ops',
  'firm': 'firm',
};

export function parseShiposViewFromHash(): ShiposView | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  if (!hash.startsWith('#shipos')) return null;

  const rest = hash.replace('#shipos', '').replace(/^\//, '').trim();
  return REVERSE_MAP[rest] || 'portal';
}

export function setShiposHash(view: ShiposView): void {
  if (typeof window === 'undefined') return;
  window.location.hash = VIEW_MAP[view];
}

export function clearShiposHash(): void {
  if (typeof window === 'undefined') return;
  // Use replaceState to avoid adding extra history entry on exit
  const url = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', url);
}

/**
 * Demo helper: ensure a session exists for the given role using Phase 1 mocks.
 * Phase 3: prefers a real applicant handoff (email + role) if one was stored from public success.
 */
export function ensureDemoSessionForView(view: ShiposView): { profileId: string; role: ShipRole; email: string } | null {
  if (typeof window === 'undefined') return null;

  // Phase 3 handoff preference: if a matching handoff with real email exists, use it
  const handoff = getApplicationHandoff();
  if (handoff) {
    const handoffView: ShiposView =
      handoff.selectedRole === 'founder' ? 'founder' :
      handoff.selectedRole === 'campus' ? 'campus' : 'scout';

    if (handoffView === view && handoff.applicantEmail) {
      const role: ShipRole =
        handoff.selectedRole === 'founder' ? 'founder' :
        handoff.selectedRole === 'campus' ? 'campus_lead' : 'scout';

      const session = createSessionForProfile({
        id: `handoff_${handoff.selectedRole}`,
        role,
        email: handoff.applicantEmail,
      });
      saveShipSession(session);
      return session;
    }
  }

  // Map view to role and a representative email from Phase 1 mock data (fallback)
  const roleMap: Record<ShiposView, { role: ShipRole; email: string }> = {
    portal: { role: 'ops', email: 'ops@ship.vc' },
    founder: { role: 'founder', email: 'alex.rivera@founder.dev' },
    campus: { role: 'campus_lead', email: 'jordan.hale@stanford.edu' },
    scout: { role: 'scout', email: 'sam.patel@mit.edu' },
    ops: { role: 'ops', email: 'ops@ship.vc' },
    firm: { role: 'investor', email: 'partners@foundersvc.com' },
  };

  const info = roleMap[view];
  if (!info) return null;

  // Try existing session first
  const existing = getShipSession();
  if (existing && existing.role === info.role) {
    return existing;
  }

  // Create a lightweight session record for demo (the actual profile lives in mock data)
  const session = createSessionForProfile({
    id: `demo_${info.role}`,
    role: info.role,
    email: info.email,
  });

  saveShipSession(session);
  return session;
}

export function getCurrentDemoRole(): ShipRole | null {
  const sess = getShipSession();
  return sess ? sess.role : null;
}

export function clearDemoSession(): void {
  clearShipSession();
}

/**
 * Simple hook for components that want reactive view (optional; App owns the primary listener).
 * Components can also just read window on mount + listen if needed.
 */
import { useState, useEffect } from 'react';

export function useShiposView(): {
  view: ShiposView | null;
  navigate: (v: ShiposView) => void;
  exit: () => void;
} {
  const [view, setView] = useState<ShiposView | null>(() => parseShiposViewFromHash());

  useEffect(() => {
    const onHash = () => setView(parseShiposViewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (v: ShiposView) => {
    setView(v);
    setShiposHash(v);
    // Also ensure a demo session for the role (so later phases can read getCurrentProfile etc.)
    ensureDemoSessionForView(v);
  };

  const exit = () => {
    setView(null);
    clearShiposHash();
    clearDemoSession();
    clearApplicationHandoff();
  };

  return { view, navigate, exit };
}

// ============================================================
// Phase 3: Application Handoff to SHIPOS
// Stores route-aware payload from public success states.
// Also seeds a real session (with applicant email) for the role.
// SHIPOS code (shell / future) can read via getApplicationHandoff().
// The ensureDemoSessionForView above already prefers handoff when present.
// ============================================================

export interface ApplicationHandoff {
  selectedRole: 'founder' | 'campus' | 'scout';
  submittedRoute: 'cohort' | 'campus-lead' | 'scout';
  applicantEmail?: string;
  submittedAt: string;
  applicationStatus: 'submitted';
  // Phase 4: reference to the real structured application record
  applicationId?: string;
  fullName?: string;
  school?: string;
  // other fields can live in the ShipApplication payload
}

const HANDOFF_KEY = 'shipos_application_handoff';

export function storeApplicationHandoff(handoff: ApplicationHandoff): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));

  // Seed a proper session using the real submitted email (if provided).
  // This makes getShipSession() return the applicant details for the role.
  const role: ShipRole =
    handoff.selectedRole === 'founder'
      ? 'founder'
      : handoff.selectedRole === 'campus'
      ? 'campus_lead'
      : 'scout';

  const email = handoff.applicantEmail || `applicant-${handoff.selectedRole}@ship.vc`;

  const session = createSessionForProfile({
    id: `handoff_${handoff.selectedRole}`,
    role,
    email,
  });

  saveShipSession(session);
}

/**
 * Phase 4 helpers for application-aware resolution.
 * Prefer handoff's applicationId (set during real public submit).
 * Fall back to most recent matching application or null (caller can use mock).
 */
export function getCurrentHandoffApplicationId(): string | null {
  const h = getApplicationHandoff();
  return h?.applicationId || null;
}

export function getHandoffFullName(): string | null {
  const h = getApplicationHandoff();
  return h?.fullName || null;
}

export function getHandoffSchool(): string | null {
  const h = getApplicationHandoff();
  return h?.school || null;
}

// Phase 5: rich resolution for productized views. Uses handoff appId first, then lists, then mocks in caller.
export function getCurrentApplication(): any | null {
  const id = getCurrentHandoffApplicationId();
  if (id) {
    // caller will import getApplicationById from repos
    return { id }; // lightweight; full resolve in shell/repos
  }
  return null;
}

export function getCurrentProfileIdForView(view: string): string | null {
  const h = getApplicationHandoff();
  if (h && h.applicationId) {
    return `prof_${h.selectedRole}_${h.applicationId.slice(-6)}`;
  }
  return null;
}

export function getApplicationHandoff(): ApplicationHandoff | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(HANDOFF_KEY);
    return raw ? (JSON.parse(raw) as ApplicationHandoff) : null;
  } catch {
    return null;
  }
}

export function clearApplicationHandoff(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HANDOFF_KEY);
}
