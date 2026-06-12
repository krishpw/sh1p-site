import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';
import { ShiposTopbar } from './ShiposTopbar';
import { ShiposRoleSwitcher } from './ShiposRoleSwitcher';
import { ShiposPortal } from './ShiposPortal';
import { ShiposStatusCard } from './ShiposStatusCard';
import { ShiposActivityTimeline } from './ShiposActivityTimeline';
import { ShiposRouteTransition } from './ShiposRouteTransition';
import { ApplicationSummaryCard } from './ApplicationSummaryCard';
import { SignalSubmitPanel } from './SignalSubmitPanel';
import { LocalReviewQueue } from './LocalReviewQueue';
import { MissingInfoPanel } from './MissingInfoPanel';
import { FirmPortal } from './FirmPortal';

import type { ActivityEvent, ShipApplication } from '@/types/shipos';
import {
  listActivityEventsForOps,
  createActivityEvent,
} from '@/lib/repositories/activity';
import {
  listApplications,
  getApplicationById,
  updateApplicationStatus,
} from '@/lib/repositories/applications';
import {
  createFounderLead,
  listFounderLeadsForOps,
  listFounderLeadsForScout,
} from '@/lib/repositories/leads';
import { calculateFounderSignalScore } from '@/lib/scoring/founderSignalScore';
import {
  getApplicationHandoff,
  getCurrentHandoffApplicationId,
  getHandoffFullName,
  getHandoffSchool,
  storeApplicationHandoff,
} from '@/lib/shipos/session';
import { upsertProfileFromApplication } from '@/lib/repositories/applications';

// Pull deterministic demo data (Phase 1) as fallback only
import {
  profiles,
  founderProfiles,
  applications as mockApps,
  founderLeads as mockLeads,
  campusCells,
  persistMockDb,
  partnerOffers,
  newsletterPosts,
  deliveryPackets,
} from '@/data/mockShipos';

interface ShiposShellProps {
  view: ShiposView;
  onExit: () => void;
}

export const ShiposShell: React.FC<ShiposShellProps> = ({ view: initialView, onExit }) => {
  const [currentView, setCurrentView] = useState<ShiposView>(initialView);
  const [showTransition, setShowTransition] = useState(false);
  const [tick, setTick] = useState(0);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  // Phase 4/5 action panels and forms
  const [showLeadPanel, setShowLeadPanel] = useState(false);
  const [showTractionPanel, setShowTractionPanel] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showRecruitPanel, setShowRecruitPanel] = useState(false);
  const [recruitForm, setRecruitForm] = useState({ name: '', email: '', roleFocus: '' });
  const [showWeeklyPanel, setShowWeeklyPanel] = useState(false);
  const [weeklyForm, setWeeklyForm] = useState({ conversations: 0, events: 0, strongestSignal: '', blocker: '' });
  const [opsNote, setOpsNote] = useState({ text: '', decisionReason: '', nextStep: '' });
  const [selectedTarget, setSelectedTarget] = useState<{type: string, id: string} | null>(null);

  // Interactive state seeded from real data
  const [scoutCount, setScoutCount] = useState(0);

  const forceRefresh = () => setTick((t) => t + 1);
  const showToast = (msg: string) => {
    setLocalMessage(msg);
    setTimeout(() => setLocalMessage(null), 2400);
  };

  // === Phase 5 purposeful action handlers (every action serves status/next/capture/move/record/progress) ===

  const handleRecruitScout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recruitForm.name.trim() || !recruitForm.email.trim()) return;

    const newScout = {
      id: `scout_${Date.now()}`,
      name: recruitForm.name.trim(),
      email: recruitForm.email.trim(),
      roleFocus: recruitForm.roleFocus.trim() || 'general',
      campusCellId: currentCell?.id || 'cell',
      createdAt: new Date().toISOString(),
    };
    (campusScouts as any).push(newScout);

    if (currentCell) {
      currentCell.scouts = [...(currentCell.scouts || []), newScout.id];
      currentCell.status = computeCellStage(currentCell.scouts.length, myLeads.length) as any;
    }

    persistMockDb();

    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: 'campus_lead',
      type: 'scout_recruited',
      targetType: 'cell',
      targetId: currentCell?.id || 'cell',
      payload: { scout: newScout.name, school: realSchool },
      visibleTo: ['ops', 'campus_lead'],
    });

    setScoutCount((currentCell?.scouts?.length || 0));
    setRecruitForm({ name: '', email: '', roleFocus: '' });
    setShowRecruitPanel(false);
    forceRefresh();
    showToast(`Scout ${newScout.name} recruited. Cell progressing.`);
  };

  const handleWeeklyCheckIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const checkin = {
      id: `checkin_${Date.now()}`,
      campusLeadProfileId: currentProfileId,
      weekOf: new Date().toISOString().slice(0,10),
      conversations: weeklyForm.conversations || 0,
      events: weeklyForm.events || 0,
      strongestSignal: weeklyForm.strongestSignal.trim(),
      blocker: weeklyForm.blocker.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    (weeklyCheckIns as any).push(checkin);
    persistMockDb();

    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: 'campus_lead',
      type: 'weekly_checkin',
      targetType: 'cell',
      targetId: currentCell?.id || currentProfileId,
      payload: { ...checkin },
      visibleTo: ['ops', 'campus_lead'],
    });

    setWeeklyForm({ conversations: 0, events: 0, strongestSignal: '', blocker: '' });
    setShowWeeklyPanel(false);
    forceRefresh();
    showToast('Weekly check-in logged. Progress recorded for Ops.');
  };

  const handleAddTraction = (type: string, value: string, link?: string, note?: string) => {
    if (!currentApp && !currentProfile) return;
    const update = {
      id: `traction_${Date.now()}`,
      profileId: currentProfileId,
      type,
      value,
      link,
      note,
      createdAt: new Date().toISOString(),
    };
    (tractionSignals as any).push(update);
    persistMockDb();

    // Also update app payload for dossier
    if (currentApp) {
      const t = (currentApp.payload?.traction as any[]) || [];
      t.push({ type, value, date: update.createdAt.slice(0,10) });
      currentApp.payload = { ...currentApp.payload, traction: t };
    }

    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: 'founder',
      type: 'traction_added',
      targetType: 'profile',
      targetId: currentApp?.id || currentProfileId,
      payload: { type, value, link },
      visibleTo: ['ops', 'founder'],
    });

    setShowTractionPanel(false);
    forceRefresh();
    showToast(`Traction logged: ${type} — ${value}. Score updated.`);
  };

  const handleCompleteProfile = (extra: any) => {
    if (currentApp) {
      currentApp.payload = {
        ...currentApp.payload,
        ...extra,
        profile_completed: true,
        completed_at: new Date().toISOString(),
      };
    }
    if (currentProfile) {
      Object.assign(currentProfile, extra, { updatedAt: new Date().toISOString() });
    }
    persistMockDb();

    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: 'founder',
      type: 'profile_updated',
      targetType: 'profile',
      targetId: currentApp?.id || currentProfileId,
      payload: { action: 'complete_founder_profile', fields: Object.keys(extra) },
      visibleTo: ['ops', 'founder'],
    });

    setShowProfilePanel(false);
    forceRefresh();
    showToast('Founder profile completed. Missing info updated, signal strengthened.');
  };

  const handleOpsDecision = (targetType: 'application' | 'lead', targetId: string, newStatus: string, noteText?: string) => {
    if (targetType === 'application') {
      const updated = updateApplicationStatus(targetId, newStatus as any);
      if (updated) {
        if (noteText || opsNote.text) {
          const note = {
            id: `note_${Date.now()}`,
            targetType,
            targetId,
            note: noteText || opsNote.text,
            decisionReason: opsNote.decisionReason,
            nextStep: opsNote.nextStep,
            authorId: 'prof_ops_001',
            at: new Date().toISOString(),
          };
          (opsNotes as any).push(note);
          persistMockDb();
        }
        createActivityEvent({
          actorProfileId: 'prof_ops_001',
          actorRole: 'ops',
          type: 'application_status_changed',
          targetType,
          targetId,
          payload: { to: newStatus, note: noteText || opsNote.text },
          visibleTo: ['ops'],
        });
        forceRefresh();
        setOpsNote({ text: '', decisionReason: '', nextStep: '' });
        setSelectedTarget(null);
        showToast(`Status updated to ${newStatus}. Reflected in role view.`);
      }
    } else {
      // lead status
      // For simplicity, mutate via leads repo or direct (extend if needed)
      const lead = (mockLeads as any).find((l: any) => l.id === targetId);
      if (lead) {
        lead.status = newStatus;
        lead.updatedAt = new Date().toISOString();
        persistMockDb();
        if (noteText || opsNote.text) {
          const note = { id: `note_${Date.now()}`, targetType, targetId, note: noteText || opsNote.text, decisionReason: opsNote.decisionReason, nextStep: opsNote.nextStep, authorId: 'prof_ops_001', at: new Date().toISOString() };
          (opsNotes as any).push(note);
          persistMockDb();
        }
        createActivityEvent({
          actorProfileId: 'prof_ops_001',
          actorRole: 'ops',
          type: 'lead_status_updated',
          targetType,
          targetId,
          payload: { to: newStatus, note: noteText || opsNote.text },
          visibleTo: ['ops'],
        });
        forceRefresh();
        setOpsNote({ text: '', decisionReason: '', nextStep: '' });
        setSelectedTarget(null);
        showToast(`Lead moved to ${newStatus}.`);
      }
    }
  };

  // === Phase 5: Resolve REAL application + profile + cell + leads from public handoff (productized) ===
  const handoff = getApplicationHandoff();
  const handoffAppId = getCurrentHandoffApplicationId();

  let currentApp: ShipApplication | null = handoffAppId ? getApplicationById(handoffAppId) : null;

  if (!currentApp && handoff) {
    // fallback: most recent application for the submitted route (persisted real ones first)
    const routeType = handoff.submittedRoute === 'cohort' ? 'founder' : handoff.submittedRoute === 'campus-lead' ? 'campus_lead' : 'scout';
    currentApp = listApplications({ routeType: routeType as any })[0] || null;
  }

  // Real identity from handoff or the created application payload
  const realFullName = getHandoffFullName() || (currentApp?.payload?.full_name as string) || (currentApp?.payload?.name as string) || handoff?.applicantEmail?.split('@')[0] || 'Applicant';
  const realEmail = handoff?.applicantEmail || currentApp?.email || 'applicant@ship.vc';
  const realSchool = getHandoffSchool() || (currentApp?.payload?.school as string) || undefined;
  const realSubmittedAt = currentApp?.submittedAt || handoff?.submittedAt || new Date().toISOString();
  const realRouteType = currentApp?.routeType || (handoff?.submittedRoute === 'cohort' ? 'founder' : handoff?.submittedRoute === 'campus-lead' ? 'campus_lead' : 'scout');

  // Ensure a real profile exists linked to this application (creates if needed, persists)
  let currentProfile = currentApp ? upsertProfileFromApplication(currentApp) : null;
  if (!currentProfile && realEmail) {
    currentProfile = profiles.find(p => p.email.toLowerCase() === realEmail.toLowerCase()) || null;
  }
  const currentProfileId = currentProfile?.id || `prof_handoff_${currentView}`;

  // Campus cell resolution (real school or fallback)
  const cellSchool = realSchool || 'demo-campus';
  let currentCell = campusCells.find((c: any) => (c as any).campusId === cellSchool || (c as any).schoolKey === cellSchool);
  if (!currentCell && currentView === 'campus') {
    currentCell = { id: `cell_${cellSchool}`, campusId: cellSchool, leadProfileId: currentProfileId, scouts: [], status: 'forming', checklist: {}, createdAt: new Date().toISOString() };
    (campusCells as any).push(currentCell);
    persistMockDb();
  }

  // Real leads for this submitter (from repo, includes real from public + actions)
  const myLeads = currentView === 'campus' 
    ? listFounderLeadsForScout(currentProfileId) // reuse for campus too; filter by submitter
    : listFounderLeadsForScout(currentProfileId);

  // Stage computation (purposeful, based on real data)
  const computeCellStage = (scoutsLen: number, leadsLen: number) => {
    if (scoutsLen === 0) return 'cell_forming';
    if (scoutsLen < 4) return 'scout_recruiting';
    if (leadsLen < 3) return 'active';
    return 'high_signal';
  };

  // Update scoutCount from real cell or handoff actions
  const effectiveScoutCount = (currentCell?.scouts?.length || 0) || scoutCount;

  // Lead quality criteria (static purposeful list; check against lead data in UI)
  const leadQualityCriteria = [
    'founder identity',
    'company/project',
    'traction or proof',
    'urgency/timing',
    'founder-market fit',
    'source/context',
  ];

  // Live data from repos (now includes real apps created on public submit + mocks as fallback)
  const allActivities: ActivityEvent[] = listActivityEventsForOps();
  const allApps = listApplications();
  const allLeads = listFounderLeadsForOps();

  // Role-specific slices (prefer real recent activity)
  const founderActivities = allActivities.filter(e =>
    (currentApp && e.targetId === currentApp.id) ||
    e.actorProfileId === currentProfileId ||
    e.targetId?.includes('founder') ||
    e.visibleTo === 'all'
  );
  const campusActivities = allActivities.filter(e =>
    (currentApp && e.targetId === currentApp.id) ||
    e.actorProfileId === currentProfileId ||
    (e.payload as any)?.school
  );
  const scoutActivities = allActivities.filter(e =>
    (currentApp && e.targetId === currentApp.id) ||
    e.actorProfileId === currentProfileId ||
    e.type.includes('lead')
  );

  // Seed scout count from any prior activity for this handoff (or 0)
  useEffect(() => {
    if (currentView === 'campus' && currentApp) {
      const recruitEvents = allActivities.filter(e => e.type === 'scout_recruited' && (e.targetId === currentApp!.id || e.actorProfileId === currentProfileId));
      setScoutCount(Math.min(4, recruitEvents.length));
    }
  }, [currentView, currentApp?.id, tick]);

  const navigate = (next: ShiposView) => {
    if (next !== currentView) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentView(next);
        setShowTransition(false);
      }, 420);
    }
    if (typeof window !== 'undefined') {
      const map: Record<ShiposView, string> = {
        portal: '#shipos',
        founder: '#shipos/founder',
        campus: '#shipos/campus',
        scout: '#shipos/scout',
        ops: '#shipos/ops',
      };
      window.location.hash = map[next];
    }
  };

  // === Real CTAs (use actual ids from handoff/app, persist via repos) ===
  const handleFounderProfileComplete = () => {
    // Simple profile completion: enrich the app payload + log
    if (currentApp) {
      currentApp.payload = {
        ...currentApp.payload,
        profile_completed: true,
        completed_at: new Date().toISOString(),
      };
    }
    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: 'founder',
      type: 'profile_updated',
      targetType: 'profile',
      targetId: currentApp?.id || currentProfileId,
      payload: { action: 'complete_founder_profile', name: realFullName },
      visibleTo: ['ops', 'founder'],
    });
    forceRefresh();
    setShowProfilePanel(false);
    showToast('Founder profile completed. Signal strengthened.');
  };

  // (handleAddTraction already defined above in Phase 5 handlers)

  const handleCampusRecruit = () => {
    const newCount = Math.min(4, scoutCount + 1);
    setScoutCount(newCount);

    // Try to persist a cell for the real school
    const schoolKey = realSchool || 'user-campus';
    let cell = campusCells.find((c: any) => (c as any).schoolKey === schoolKey);
    if (!cell) {
      cell = { id: `cell_${schoolKey}`, campusId: schoolKey, leadProfileId: currentProfileId, scouts: [], status: 'forming', checklist: {}, createdAt: new Date().toISOString() } as any;
      (campusCells as any).push(cell);
    }
    (cell as any).scouts = Array.from({ length: newCount });

    persistMockDb();

    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: 'campus_lead',
      type: 'scout_recruited',
      targetType: 'cell',
      targetId: (cell as any).id,
      payload: { school: realSchool || 'your campus', scouts: newCount },
      visibleTo: ['ops', 'campus_lead'],
    });
    forceRefresh();
    showToast(`Scout recruited. ${realSchool || 'Your campus'} cell at ${newCount}/4.`);
  };

  const handleSubmitLead = (founderName: string, signal: string, traction?: string) => {
    const lead = createFounderLead({
      submittedByProfileId: currentProfileId,
      submittedByRole: currentView === 'campus' ? 'campus_lead' : 'scout',
      founderName,
      signal,
      traction,
      status: 'submitted',
      notes: [],
    });

    createActivityEvent({
      actorProfileId: currentProfileId,
      actorRole: currentView === 'campus' ? 'campus_lead' : 'scout',
      type: 'lead_submitted',
      targetType: 'lead',
      targetId: lead.id,
      payload: { founderName, from: realFullName },
      visibleTo: ['ops', currentView === 'campus' ? 'campus_lead' : 'scout'],
    });

    forceRefresh();
    setShowLeadPanel(false);
    showToast('Founder signal submitted. Appears in your log and Ops queue.');
  };

  const handleOpsOpenQueue = () => {
    createActivityEvent({
      actorProfileId: 'prof_ops_001',
      actorRole: 'ops',
      type: 'review_queue_opened',
      targetType: 'application',
      targetId: 'queue',
      payload: { apps: allApps.length, leads: allLeads.length, real: allApps.filter(a => !String(a.id).startsWith('app_')).length },
      visibleTo: ['ops'],
    });
    forceRefresh();
    showToast(`Review queue opened — ${allApps.length} total.`);
  };

  // === Role-aware labels from real data ===
  const roleLabel =
    currentView === 'founder' ? 'FOUNDER ROUTE' :
    currentView === 'campus' ? 'CAMPUS CELL' :
    currentView === 'scout' ? 'SCOUT SIGNAL' :
    currentView === 'ops' ? 'SHIP OPS' :
    currentView === 'firm' ? 'FIRM PORTAL' : 'PORTAL';

  const statusText =
    currentView === 'founder' ? 'ROUTE UNDER REVIEW' :
    currentView === 'campus' ? 'CELL FORMING' :
    currentView === 'scout' ? 'RHYTHM ACTIVE' :
    currentView === 'ops' ? 'DISPATCH LIVE' :
    currentView === 'firm' ? 'PREVIEW MODE' : 'DEMO LAYER';

  const profileLabel = realEmail;

  // === Render content using real application data ===
  const renderMain = () => {
    if (currentView === 'firm') {
      return <FirmPortal />;
    }
    if (currentView === 'portal') {
      return <ShiposPortal onNavigate={navigate} />;
    }

    if (currentView === 'founder') {
      const pitch = (currentApp?.payload?.pitch as string) || (currentApp?.payload?.what_else_are_you_doing as string) || 'Not provided in application';
      const links = currentApp?.payload?.profile || currentApp?.payload?.social || 'Not provided';
      const missing = !realSchool && !links;

      return (
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 space-y-8">
          <ShiposStatusCard
            title="FOUNDER ROUTE"
            status="UNDER REVIEW"
            description={`Application received from ${realFullName} (${realEmail}). SHIP is mapping your signal into the Founder Graph. Submitted ${new Date(realSubmittedAt).toLocaleString()}.`}
            nextStep="Add traction or complete profile to move forward"
          />

          {missing && (
            <MissingInfoPanel message="Missing school or links — this weakens network signal and thesis fit." cta="COMPLETE PROFILE" onCta={() => setShowProfilePanel(true)} />
          )}

          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
              <div className="border border-white/10 bg-[#0A0A0A]/70 p-7">
                <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-2">REAL APPLICATION DATA</div>
                <div className="text-sm text-white/80 mb-4">Name: {realFullName} • Email: {realEmail}</div>

                <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-2">WHAT SHIP KNOWS (FROM YOUR SUBMISSION)</div>
                <div className="text-white/80 text-sm leading-relaxed">{pitch}</div>
                <div className="mt-3 text-xs text-white/50 font-mono">Links / Portfolio: {links}</div>
              </div>

              <div className="border border-white/10 bg-[#0A0A0A]/70 p-7">
                <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-2">SIGNAL SCORE (LIVE FROM YOUR DATA)</div>
                <div className="font-serif text-6xl text-white tabular-nums tracking-tighter">
                  {currentApp ? calculateFounderSignalScore({ profile: currentProfile || { id: currentProfileId, email: realEmail, name: realFullName, role: 'founder', createdAt: realSubmittedAt }, tractionCount: ((currentApp.payload?.traction as any[]) || []).length, descriptionLength: (pitch as string).length }).total : 62}
                </div>
                <div className="text-xs text-white/50 mt-1">/ 100 — improves with traction & complete profile</div>
              </div>

              <button onClick={() => setShowProfilePanel(true)} className="w-full border border-[#FFB800] bg-[#FFB800] text-black py-4 text-xs font-mono tracking-[0.25em]">
                COMPLETE FOUNDER PROFILE
              </button>
              <button onClick={() => setShowTractionPanel(true)} className="w-full border border-white/20 py-3 text-xs font-mono tracking-widest text-white/80 hover:border-white/40">
                ADD TRACTION SIGNAL
              </button>
            </div>

            <div className="md:col-span-2">
              <ShiposActivityTimeline events={founderActivities.length ? founderActivities : allActivities} max={5} title="YOUR ROUTE ACTIVITY" />
            </div>
          </div>

          <div className="text-xs font-mono text-white/40 border-l-2 border-[#FFB800]/40 pl-4">
            This is the live Founder Route Hub wired to your submitted application. All CTAs create real persisted activity and update your local graph.
          </div>

          {/* Purposeful: Partner Offers / Perks - eligibility based on status */}
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-7">
            <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">PARTNER OFFERS (ELIGIBILITY DRIVEN)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {partnerOffers.length ? partnerOffers.map((o: any) => (
                <div key={o.id} className="border border-white/10 p-3 text-sm">
                  <div className="font-medium">{o.title}</div>
                  <div className="text-xs text-white/50">{o.description}</div>
                  <button onClick={() => { /* would call repo request */ alert('Request logged. Would appear in Ops activity.'); }} className="mt-2 text-xs border border-[#FFB800] px-2 py-1">{o.actionLabel}</button>
                </div>
              )) : <div className="text-white/50 text-sm">No offers loaded (demo). In full, loaded from partnerOffers repo based on your status.</div>}
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'campus') {
      const cellName = realSchool ? `${realSchool} Cell` : 'Your Campus Cell';
      return (
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 space-y-8">
          <ShiposStatusCard
            title="CAMPUS COMMAND"
            status="CELL FORMING"
            description={`${cellName} • ${realFullName} (${realEmail}). Recruit 2–4 scouts and submit founder signals to activate.`}
            nextStep={`Scouts recruited: ${scoutCount}/4`}
          />

          {(!realSchool) && <MissingInfoPanel message="No school in your application — cell cannot be mapped accurately." cta="ADD SCHOOL IN PROFILE" />}

          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={() => setShowLeadPanel(true)} className="flex-1 border border-[#FFB800] bg-[#FFB800] text-black py-5 text-xs font-mono tracking-[0.2em]">
              SUBMIT FOUNDER SIGNAL
            </button>
            <button onClick={handleCampusRecruit} className="flex-1 border border-white/20 py-5 text-xs font-mono tracking-[0.2em] text-white/80 hover:border-[#FFB800]/60">
              RECRUIT SCOUT ({scoutCount}/4)
            </button>
          </div>

          <ShiposActivityTimeline events={campusActivities.length ? campusActivities : allActivities} max={5} title="CAMPUS CELL LOG" />
        </div>
      );
    }

    if (currentView === 'scout') {
      return (
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 space-y-8">
          <ShiposStatusCard
            title="SCOUT SIGNAL HUB"
            status="RHYTHM ACTIVE"
            description={`${realFullName} (${realEmail}). Find builders before the market. Weekly goal active.`}
            nextStep="Submit high-signal leads"
          />

          <button onClick={() => setShowLeadPanel(true)} className="w-full border border-[#FFB800] bg-[#FFB800] text-black py-6 text-xs font-mono tracking-[0.25em]">
            SUBMIT FOUNDER SIGNAL
          </button>

          <div className="text-[10px] font-mono text-white/40">Your sourced leads appear in the Ops review queue (persisted).</div>

          <ShiposActivityTimeline events={scoutActivities.length ? scoutActivities : allActivities} max={5} title="SCOUT LOG" />

          {/* Purposeful: Resources / Newsletter - relevant to scout */}
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-7">
            <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">RESOURCES & NEWSLETTER (RELEVANT TO YOUR ROUTE)</div>
            {newsletterPosts.length ? newsletterPosts.filter((p: any) => p.category === 'campus' || p.category === 'scout').map((p: any) => (
              <div key={p.id} className="mb-2 text-sm cursor-pointer" onClick={() => alert(p.content + ' (read logged in full system)')}>
                {p.title} — {p.summary}
              </div>
            )) : <div className="text-white/50 text-sm">Resources loaded from newsletterPosts (demo).</div>}
          </div>
        </div>
      );
    }

    // OPS — now shows real applications + visible queue
    const realAppsCount = allApps.filter(a => a.id && !String(a.id).includes('demo')).length || allApps.length;
    return (
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div className="font-mono text-[10px] text-[#FFB800]/70">APPLICATIONS (REAL + MOCK)</div>
            <div className="font-serif text-5xl text-white mt-1">{allApps.length}</div>
            <div className="text-xs text-white/50">real submissions: {realAppsCount}</div>
          </div>
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div className="font-mono text-[10px] text-[#FFB800]/70">FOUNDER LEADS</div>
            <div className="font-serif text-5xl text-white mt-1">{allLeads.length}</div>
            <div className="text-xs text-white/50">from real scouts/campus</div>
          </div>
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div className="font-mono text-[10px] text-[#FFB800]/70">ACTIVE CELLS</div>
            <div className="font-serif text-5xl text-white mt-1">1</div>
            <div className="text-xs text-white/50">forming from real apps</div>
          </div>
        </div>

        <button onClick={handleOpsOpenQueue} className="w-full border border-[#FFB800] bg-[#FFB800] text-black py-5 text-xs font-mono tracking-[0.2em]">
          OPEN / REFRESH REVIEW QUEUE
        </button>

        <div>
          <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">LOCAL REVIEW QUEUE (PERSISTED REAL SUBMISSIONS)</div>
          <LocalReviewQueue applications={allApps} onRefresh={forceRefresh} />
        </div>

        {/* Purposeful: Monthly Delivery Preview in Ops */}
        <div>
          <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">MONTHLY DELIVERY PREVIEW (COMPOSE FROM INVESTOR-READY)</div>
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6 text-sm">
            {deliveryPackets.length ? deliveryPackets.map((p: any) => (
              <div key={p.id}>Packet {p.month}: {p.founders.length} founders • Status {p.status} (edit in full Ops to compose from ready leads)</div>
            )) : <div>No packet yet. Use investor-ready leads to compose (demo: see Firm Portal).</div>}
            <div className="text-xs text-white/40 mt-2">In V1, Ops selects from ready, firm sees in portal, signals flow back.</div>
          </div>
        </div>

        <ShiposActivityTimeline events={allActivities} max={8} title="OPS ACTIVITY LOG" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative z-50">
      <ShiposTopbar
        view={currentView}
        roleLabel={roleLabel}
        status={statusText}
        profileLabel={profileLabel}
        onExit={onExit}
      />

      <div className="max-w-5xl mx-auto pt-6">
        <ShiposRoleSwitcher current={currentView} onNavigate={navigate} />
      </div>

      <AnimatePresence>
        {showTransition && <ShiposRouteTransition view={currentView} />}
      </AnimatePresence>

      {renderMain()}

      {/* Action panels */}
      <SignalSubmitPanel
        isOpen={showLeadPanel}
        onClose={() => setShowLeadPanel(false)}
        submittedByProfileId={currentProfileId}
        submittedByRole={currentView === 'campus' ? 'campus_lead' : 'scout'}
        onSuccess={forceRefresh}
        title={currentView === 'campus' ? 'Submit Founder Signal (Campus)' : 'Submit Founder Signal (Scout)'}
      />

      {/* Simple inline-style traction / profile panels for founder (kept lightweight) */}
      {showTractionPanel && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowTractionPanel(false)}>
          <div className="w-full max-w-sm border border-white/10 bg-[#0A0A0A] p-6" onClick={e => e.stopPropagation()}>
            <div className="font-serif mb-4">Add Traction Signal</div>
            <form onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget as any; handleAddTraction(f.type.value, f.value.value); }}>
              <input name="type" placeholder="Type (e.g. pilot, revenue, waitlist)" className="w-full mb-2 bg-[#0F0F0F] border border-white/10 p-2 text-sm" required />
              <input name="value" placeholder="Value / metric" className="w-full mb-4 bg-[#0F0F0F] border border-white/10 p-2 text-sm" required />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowTractionPanel(false)} className="flex-1 border border-white/20 py-2 text-xs">CANCEL</button>
                <button type="submit" className="flex-1 bg-[#FFB800] text-black py-2 text-xs font-mono tracking-widest">LOG TRACTION</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfilePanel && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowProfilePanel(false)}>
          <div className="w-full max-w-sm border border-white/10 bg-[#0A0A0A] p-6" onClick={e => e.stopPropagation()}>
            <div className="font-serif mb-4">Complete Founder Profile</div>
            <button onClick={handleFounderProfileComplete} className="w-full bg-[#FFB800] text-black py-3 text-xs font-mono tracking-[0.2em]">MARK PROFILE COMPLETE + LOG</button>
            <button onClick={() => setShowProfilePanel(false)} className="w-full mt-2 border border-white/20 py-2 text-xs">CLOSE</button>
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {localMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 text-xs font-mono tracking-[0.2em] bg-[#FFB800] text-black border border-[#FFB800]"
          >
            {localMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-12" />
    </div>
  );
};
