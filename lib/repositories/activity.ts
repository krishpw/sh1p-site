/**
 * SHIPOS V1 — Activity Repository (mock)
 * The living log of everything that happens inside SHIPOS.
 */

import type { ActivityEvent, ShipRole } from '@/types/shipos';
import { activityEvents, persistMockDb } from '@/data/mockShipos';
import { createActivityEvent as makeActivity } from '@/lib/shipos/activity';

export function createActivityEvent(
  input: Omit<ActivityEvent, "id" | "timestamp">
): ActivityEvent {
  const evt = makeActivity(input);
  activityEvents.push(evt);
  persistMockDb();
  return evt;
}

export function listActivityEventsForProfile(
  profileId: string,
  role: ShipRole
): ActivityEvent[] {
  return activityEvents
    .filter((e) => {
      if (e.actorProfileId === profileId) return true;
      if (e.visibleTo === "all") return true;
      return Array.isArray(e.visibleTo) && e.visibleTo.includes(role);
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function listActivityEventsForOps(): ActivityEvent[] {
  return [...activityEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function getActivityEventById(id: string): ActivityEvent | undefined {
  return activityEvents.find((e) => e.id === id);
}

/**
 * Internal helper used by other repos that want to emit activity without
 * importing the activity module directly (keeps surface small).
 */
export { makeActivity as _createPureActivity };
