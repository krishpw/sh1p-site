/**
 * SHIPOS V1 — Founder Signal Score (pure, deterministic)
 * No side effects, no network, no randomness.
 * Used for preview cards and "what SHIP knows about you".
 */

import type { ShipProfile, FounderProfile, FounderScore } from '@/types/shipos';

export interface FounderSignalInput {
  profile: ShipProfile | FounderProfile;
  // Optional overrides for demo / future richer data
  tractionCount?: number;
  descriptionLength?: number; // approximate "strength" of written signal
  hasSchoolSignal?: boolean;
}

export function calculateFounderSignalScore(input: FounderSignalInput): FounderScore {
  const { profile, tractionCount, descriptionLength, hasSchoolSignal } = input;

  const founder = profile as Partial<FounderProfile>;

  // Base floor — everyone starts with some signal just by applying seriously
  let base = 42;

  // Execution velocity (heavily weighted in SHIP world)
  const tCount = tractionCount ?? (founder.traction?.length ?? 0);
  const exec = Math.min(28, 12 + tCount * 5 + (tCount >= 2 ? 4 : 0));

  // Market clarity — derived from description length + presence of wedge language
  const descLen = descriptionLength ?? (founder.projectDescription?.length ?? 0);
  const market = Math.min(20, 8 + Math.floor(descLen / 18) + (descLen > 120 ? 4 : 0));

  // Founder-market fit
  let fit = 14;
  if (founder.projectDescription && founder.projectDescription.toLowerCase().includes("pilot")) fit += 3;
  if (founder.traction && founder.traction.some((t) => /customer|revenue|paying/i.test(t.value))) fit += 4;
  fit = Math.min(22, fit);

  // Communication (how cleanly they told the story in application)
  const comm = Math.min(15, 7 + Math.floor((descLen + (founder.signalNotes?.length ?? 0)) / 25));

  // Network / distribution signal (school drop or strong profile links + "indie" language)
  let net = 6;
  if (hasSchoolSignal || (founder.school && founder.school.length > 0)) net += 3;
  if (founder.links && founder.links.length >= 2) net += 3;
  if (founder.projectDescription && /indie|distribution|waitlist/i.test(founder.projectDescription)) net += 2;
  net = Math.min(13, net);

  const total = Math.min(100, Math.max(28, Math.round(base + exec + market + fit + comm + net)));

  const breakdown = {
    executionVelocity: Math.round(exec),
    marketClarity: Math.round(market),
    founderMarketFit: Math.round(fit),
    communication: Math.round(comm),
    networkSignal: Math.round(net),
  };

  return {
    profileId: profile.id,
    total,
    breakdown,
    computedAt: new Date().toISOString(),
    notes: total > 75 ? "High velocity founder. Strong recent traction." : undefined,
  };
}
