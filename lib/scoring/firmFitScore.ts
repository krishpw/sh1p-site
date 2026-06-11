/**
 * SHIPOS V1 — Firm Thesis Fit Score (pure, deterministic)
 * Placeholder for future investor delivery matching.
 * Still valuable even in V1 for ops previews.
 */

import type { FirmThesis, FounderProfile, ShipProfile } from '@/types/shipos';

export interface FirmFitInput {
  thesis: FirmThesis;
  founder: ShipProfile | FounderProfile;
  // future: extra signals from founder profile / lead
}

export interface FirmFitResult {
  score: number; // 0-100
  reasons: string[];
  computedAt: string;
}

export function calculateFirmFitScore(input: FirmFitInput): FirmFitResult {
  const { thesis, founder } = input;
  const f = founder as Partial<FounderProfile>;

  let score = 35;
  const reasons: string[] = [];

  const desc = (f.projectDescription || "").toLowerCase();
  const company = (f.companyName || "").toLowerCase();
  const allText = desc + " " + company + " " + (f.signalNotes || "").toLowerCase();

  // Stage match (we don't have explicit stage yet — infer from traction language)
  if (thesis.stages.includes("pre-seed") || thesis.stages.includes("seed")) {
    if (!/series a|raised|funding/i.test(allText)) {
      score += 12;
      reasons.push("Early stage fits thesis");
    }
  }

  // Sector match
  const sectorHits = thesis.sectors.filter((s) =>
    allText.includes(s.toLowerCase().split(" ")[0])
  ).length;
  if (sectorHits > 0) {
    score += Math.min(18, sectorHits * 7);
    reasons.push("Sector overlap with thesis");
  }

  // Geography (very light for V1)
  if (thesis.geographies.some((g) => /us|america/i.test(g))) {
    score += 8;
    reasons.push("US geography alignment");
  }

  // Signal language match (distribution, technical, indie)
  const signalHits = thesis.signals.filter((sig) => allText.includes(sig.toLowerCase().split(" ")[0])).length;
  if (signalHits > 0) {
    score += Math.min(15, signalHits * 5);
    reasons.push("High-signal language match");
  }

  // Execution bonus from founder profile traction
  if (f.traction && f.traction.length >= 2) {
    score += 10;
    reasons.push("Proven execution velocity");
  }

  const final = Math.min(98, Math.max(18, Math.round(score)));

  if (reasons.length === 0) {
    reasons.push("Baseline thesis compatibility");
  }

  return {
    score: final,
    reasons,
    computedAt: new Date().toISOString(),
  };
}
