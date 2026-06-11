/**
 * SHIPOS V1 — Founder Leads Repository (mock)
 * Scouts and Campus Leads submit signals here.
 */

import type { FounderLead, FounderLeadStatus } from '@/types/shipos';
import { founderLeads, persistMockDb } from '@/data/mockShipos';
import { createActivityEvent } from '@/lib/shipos/activity';

export function createFounderLead(
  data: Omit<FounderLead, "id" | "createdAt" | "updatedAt" | "notes"> & { notes?: FounderLead["notes"] }
): FounderLead {
  const now = new Date().toISOString();
  const lead: FounderLead = {
    id: `lead_${Date.now().toString(36)}`,
    createdAt: now,
    updatedAt: now,
    notes: data.notes ?? [],
    ...data,
  };

  founderLeads.push(lead);
  persistMockDb();

  const evt = createActivityEvent({
    actorProfileId: data.submittedByProfileId,
    actorRole: data.submittedByRole === "scout" ? "scout" : "campus_lead",
    type: "lead_submitted",
    targetType: "lead",
    targetId: lead.id,
    payload: { founderName: data.founderName },
    visibleTo: ["ops", data.submittedByRole],
  });

  return lead;
}

export function listFounderLeadsForScout(scoutProfileId: string): FounderLead[] {
  return founderLeads
    .filter((l) => l.submittedByProfileId === scoutProfileId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listFounderLeadsForCampus(campusLeadProfileId: string): FounderLead[] {
  // In V1 we don't have a strong cell-to-lead link yet; match by submitter.
  // Later phases will join via CampusCell.
  return founderLeads
    .filter((l) => l.submittedByProfileId === campusLeadProfileId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listFounderLeadsForOps(): FounderLead[] {
  return [...founderLeads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getFounderLeadById(id: string): FounderLead | undefined {
  return founderLeads.find((l) => l.id === id);
}

export function updateFounderLeadStatus(
  id: string,
  status: FounderLeadStatus,
  note?: string
): FounderLead | undefined {
  const lead = founderLeads.find((l) => l.id === id);
  if (!lead) return undefined;

  const prev = lead.status;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();

  if (note) {
    lead.notes.push({
      text: note,
      authorId: "prof_ops_001",
      at: lead.updatedAt,
    });
  }

  persistMockDb();

  const evt = createActivityEvent({
    actorProfileId: "prof_ops_001",
    actorRole: "ops",
    type: "lead_status_updated",
    targetType: "lead",
    targetId: id,
    payload: { from: prev, to: status },
    visibleTo: ["ops"],
  });

  return lead;
}
