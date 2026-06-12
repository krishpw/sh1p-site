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
export type ShiposView = 'portal' | 'founder' | 'campus' | 'scout' | 'ops';

const VIEW_MAP: Record<ShiposView, string> = {
  portal: '#shipos',
  founder: '#shipos/founder',
  campus: '#shipos/campus',
  scout: '#shipos/scout',
  ops: '#shipos/ops',
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
 * Picks the first matching profile from seed data (via storage helpers).
 */
export function ensureDemoSessionForView(view: ShiposView): { profileId: string; role: ShipRole; email: string } | null {
  if (typeof window === 'undefined') return null;

  // Map view to role and a representative email from Phase 1 mock data
  const roleMap: Record<ShiposView, { role: ShipRole; email: string }> = {
    portal: { role: 'ops', email: 'ops@ship.vc' },
    founder: { role: 'founder', email: 'alex.rivera@founder.dev' },
    campus: { role: 'campus_lead', email: 'jordan.hale@stanford.edu' },
    scout: { role: 'scout', email: 'sam.patel@mit.edu' },
    ops: { role: 'ops', email: 'ops@ship.vc' },
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
  };

  return { view, navigate, exit };
}
