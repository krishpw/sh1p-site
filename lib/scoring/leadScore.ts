/**
 * SHIPOS V1 — Lead Score (pure, deterministic)
 * Scores incoming founder leads from scouts / campus leads.
 * Higher = more likely to be moved into the Founder Graph quickly.
 */

import type { FounderLead } from '@/types/shipos';

export interface LeadScoreInput {
  lead: FounderLead;
  sourceCredibility?: number; // 0-100, scout reputation or campus cell strength
}

export interface LeadScoreResult {
  total: number; // 0-100
  breakdown: {
    sourceCredibility: number;
    founderSignal: number;
    marketSignal: number;
    tractionSignal: number;
    urgency: number;
  };
  computedAt: string;
}

export function calculateLeadScore(input: LeadScoreInput): LeadScoreResult {
  const { lead, sourceCredibility = 68 } = input;

  const src = Math.min(30, Math.max(8, Math.round(sourceCredibility * 0.3)));

  // Founder signal (how well the note describes the person)
  let founderSig = 12;
  const signalText = (lead.signal || "").toLowerCase();
  if (signalText.length > 60) founderSig += 6;
  if (/dropped|phd|ex-|previously|built/i.test(signalText)) founderSig += 5;
  founderSig = Math.min(25, founderSig);

  // Market signal
  let market = 10;
  if (/ai|devtool|infra|vertical|distribution/i.test(signalText + " " + (lead.traction || ""))) market += 7;
  market = Math.min(18, market);

  // Traction signal
  let traction = 6;
  const t = (lead.traction || "").toLowerCase();
  if (/pilot|customer|loi|revenue|waitlist|users/i.test(t)) traction += 8;
  if (/12|enterprise|signed/i.test(t)) traction += 4;
  traction = Math.min(20, traction);

  // Urgency / momentum (recency + language of speed)
  let urgency = 5;
  if (/week|month|already|just|live/i.test(signalText + " " + t)) urgency += 6;
  urgency = Math.min(12, urgency);

  const total = Math.min(100, Math.max(22, Math.round(src + founderSig + market + traction + urgency)));

  return {
    total,
    breakdown: {
      sourceCredibility: Math.round(src),
      founderSignal: Math.round(founderSig),
      marketSignal: Math.round(market),
      tractionSignal: Math.round(traction),
      urgency: Math.round(urgency),
    },
    computedAt: new Date().toISOString(),
  };
}
