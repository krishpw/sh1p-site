import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';
import { ShiposTopbar } from './ShiposTopbar';
import { ShiposRoleSwitcher } from './ShiposRoleSwitcher';
import { ShiposPortal } from './ShiposPortal';
import { ShiposStatusCard } from './ShiposStatusCard';
import { ShiposActivityTimeline } from './ShiposActivityTimeline';
import { ShiposRouteTransition } from './ShiposRouteTransition';

import type { ActivityEvent } from '@/types/shipos';
import {
  listActivityEventsForOps,
  createActivityEvent,
} from '@/lib/repositories/activity';
import { listApplications } from '@/lib/repositories/applications';
import {
  createFounderLead,
  listFounderLeadsForOps,
  listFounderLeadsForScout,
} from '@/lib/repositories/leads';
import { calculateFounderSignalScore } from '@/lib/scoring/founderSignalScore';

// Pull deterministic demo data (Phase 1)
import {
  profiles,
  founderProfiles,
  applications as mockApps,
  founderLeads as mockLeads,
} from '@/data/mockShipos';

interface ShiposShellProps {
  view: ShiposView;
  onExit: () => void;
}

export const ShiposShell: React.FC<ShiposShellProps> = ({ view: initialView, onExit }) => {
  const [currentView, setCurrentView] = useState<ShiposView>(initialView);
  const [showTransition, setShowTransition] = useState(false);
  const [tick, setTick] = useState(0); // force re-render after repo mutations
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  // Demo "current" profiles from Phase 1 seeds
  const founderProfile = founderProfiles[0] || profiles.find((p) => p.role === 'founder');
  const campusProfile = profiles.find((p) => p.role === 'campus_lead');
  const scoutProfile = profiles.find((p) => p.role === 'scout');
  const opsProfile = profiles.find((p) => p.role === 'ops');

  const navigate = (next: ShiposView) => {
    if (next !== currentView) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentView(next);
        setShowTransition(false);
      }, 420);
    }
    // ensure hash for shareability (parent also handles but we keep in sync)
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

  const forceRefresh = () => setTick((t) => t + 1);

  const showToast = (msg: string) => {
    setLocalMessage(msg);
    setTimeout(() => setLocalMessage(null), 2400);
  };

  // Read live data (mutations from Phase 1 repos are visible)
  const allActivities: ActivityEvent[] = listActivityEventsForOps();
  const allApps = listApplications();
  const allLeads = listFounderLeadsForOps();

  // Role-specific activity slices (simple filter for preview)
  const founderActivities = allActivities.filter(
    (e) => e.actorProfileId === 'prof_founder_001' || e.targetId?.includes('founder') || e.visibleTo === 'all'
  );
  const campusActivities = allActivities.filter(
    (e) => e.actorProfileId === 'prof_campus_001' || (e.payload as any)?.school
  );
  const scoutActivities = allActivities.filter(
    (e) => e.actorProfileId === 'prof_scout_001' || e.type.includes('lead')
  );

  // --- CTA implementations (every primary action does something real) ---
  const handleFounderProfileComplete = () => {
    createActivityEvent({
      actorProfileId: 'prof_founder_001',
      actorRole: 'founder',
      type: 'profile_updated',
      targetType: 'profile',
      targetId: 'prof_founder_001',
      payload: { action: 'complete_founder_profile', added: 'traction + project details' },
      visibleTo: ['ops', 'founder'],
    });
    forceRefresh();
    showToast('Profile updated. Signal strengthened (+7 execution).');
  };

  const handleCampusRecruit = () => {
    createActivityEvent({
      actorProfileId: 'prof_campus_001',
      actorRole: 'campus_lead',
      type: 'scout_recruited',
      targetType: 'cell',
      targetId: 'cell_stanford_001',
      payload: { scoutsNow: '1/4' },
      visibleTo: ['ops', 'campus_lead'],
    });
    forceRefresh();
    showToast('Scout invited. Cell formation +1. (Demo)');
  };

  const handleSubmitSignal = (by: 'scout' | 'campus') => {
    const submitterId = by === 'scout' ? 'prof_scout_001' : 'prof_campus_001';
    const founderName = by === 'scout' ? 'Tyler Ngo (demo)' : 'Lila Chen (demo)';

    createFounderLead({
      submittedByProfileId: submitterId,
      submittedByRole: by,
      founderName,
      founderEmail: by === 'scout' ? 'tyler@ngo.dev' : 'lila@labnote.ai',
      signal: 'High signal surfaced via ' + (by === 'scout' ? 'MIT network' : 'Stanford cell'),
      traction: 'Pilot + early waitlist',
      status: 'submitted',
      notes: [],
    });

    createActivityEvent({
      actorProfileId: submitterId,
      actorRole: by === 'scout' ? 'scout' : 'campus_lead',
      type: 'lead_submitted',
      targetType: 'lead',
      targetId: 'new_demo_lead',
      payload: { founderName },
      visibleTo: ['ops'],
    });

    forceRefresh();
    showToast('Founder signal submitted. Now in review queue.');
  };

  const handleOpsOpenQueue = () => {
    createActivityEvent({
      actorProfileId: 'prof_ops_001',
      actorRole: 'ops',
      type: 'review_queue_opened',
      targetType: 'application',
      targetId: 'queue',
      payload: { apps: allApps.length, leads: allLeads.length },
      visibleTo: ['ops'],
    });
    forceRefresh();
    showToast(`Review queue opened — ${allApps.length} apps, ${allLeads.length} leads visible.`);
  };

  const handleAddTractionDemo = () => {
    createActivityEvent({
      actorProfileId: 'prof_founder_001',
      actorRole: 'founder',
      type: 'traction_added',
      targetType: 'profile',
      targetId: 'prof_founder_001',
      payload: { type: 'pilot', value: 'New pilot signed (demo)' },
      visibleTo: ['ops', 'founder'],
    });
    forceRefresh();
    showToast('Traction logged. Founder signal recalculated.');
  };

  // Compute a live-ish score for founder preview using Phase 1 pure function
  const founderScore = founderProfile
    ? calculateFounderSignalScore({
        profile: founderProfile,
        tractionCount: 3,
        descriptionLength: 140,
      })
    : { total: 68, breakdown: { executionVelocity: 18, marketClarity: 14, founderMarketFit: 15, communication: 11, networkSignal: 10 } };

  // Render content per view (preview only — not full pages)
  const renderMain = () => {
    if (currentView === 'portal') {
      return <ShiposPortal onNavigate={navigate} />;
    }

    if (currentView === 'founder') {
      return (
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 space-y-8">
          <ShiposStatusCard
            title="FOUNDER ROUTE"
            status="UNDER REVIEW"
            description="Application received. SHIP is mapping your signal into the Founder Graph."
            nextStep="Add traction or complete profile to move forward"
          />

          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <div className="border border-white/10 bg-[#0A0A0A]/70 p-7">
                <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-2">SIGNAL SCORE (PREVIEW)</div>
                <div className="font-serif text-6xl text-white tabular-nums tracking-tighter">{founderScore.total}</div>
                <div className="text-xs text-white/50 mt-1">/ 100 — recalculates on traction</div>

                <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-white/70">
                  {Object.entries(founderScore.breakdown || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/50">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-[#FFB800]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFounderProfileComplete}
                className="mt-4 w-full border border-[#FFB800] bg-[#FFB800] text-black py-4 text-xs font-mono tracking-[0.25em] hover:bg-white active:scale-[0.985] transition"
              >
                COMPLETE FOUNDER PROFILE
              </button>
              <button
                onClick={handleAddTractionDemo}
                className="mt-2 w-full border border-white/20 py-3 text-xs font-mono tracking-widest text-white/80 hover:border-white/40"
              >
                ADD TRACTION SIGNAL (DEMO)
              </button>
            </div>

            <div className="md:col-span-2">
              <ShiposActivityTimeline events={founderActivities.length ? founderActivities : allActivities} max={4} title="YOUR ROUTE ACTIVITY" />
            </div>
          </div>

          <div className="text-xs font-mono text-white/40 border-l-2 border-[#FFB800]/40 pl-4">
            This is a live preview of the Founder Route Hub. All CTAs mutate the shared mock foundation and append to the activity log.
          </div>
        </div>
      );
    }

    if (currentView === 'campus') {
      return (
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 space-y-8">
          <ShiposStatusCard
            title="CAMPUS COMMAND"
            status="CELL FORMING"
            description="Stanford cell is live in the map. Recruit scouts and submit your first founder signal to activate."
            nextStep="2–4 scouts required to unlock full pipeline"
          />

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => handleSubmitSignal('campus')}
              className="flex-1 border border-[#FFB800] bg-[#FFB800] text-black py-5 text-xs font-mono tracking-[0.2em]"
            >
              SUBMIT FOUNDER SIGNAL
            </button>
            <button
              onClick={handleCampusRecruit}
              className="flex-1 border border-white/20 py-5 text-xs font-mono tracking-[0.2em] text-white/80 hover:border-[#FFB800]/60"
            >
              RECRUIT SCOUT (1/4)
            </button>
          </div>

          <ShiposActivityTimeline events={campusActivities.length ? campusActivities : allActivities} max={4} title="CAMPUS CELL LOG" />
        </div>
      );
    }

    if (currentView === 'scout') {
      return (
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 space-y-8">
          <ShiposStatusCard
            title="SCOUT SIGNAL HUB"
            status="WEEKLY RHYTHM ON TRACK"
            description="2 of 3 leads submitted this period. Stronger leads include traction + urgency + founder-market fit."
            nextStep="Submit one more high-signal founder before Friday"
          />

          <button
            onClick={() => handleSubmitSignal('scout')}
            className="w-full border border-[#FFB800] bg-[#FFB800] text-black py-6 text-xs font-mono tracking-[0.25em]"
          >
            SUBMIT FOUNDER SIGNAL
          </button>

          <div className="text-[10px] font-mono text-white/40">Your sourced leads appear in the Ops review queue instantly (demo).</div>

          <ShiposActivityTimeline events={scoutActivities.length ? scoutActivities : allActivities} max={4} title="SCOUT LOG" />
        </div>
      );
    }

    // OPS
    return (
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div className="font-mono text-[10px] text-[#FFB800]/70">APPLICATIONS</div>
            <div className="font-serif text-5xl text-white mt-1">{allApps.length}</div>
            <div className="text-xs text-white/50">in review queue</div>
          </div>
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div className="font-mono text-[10px] text-[#FFB800]/70">FOUNDER LEADS</div>
            <div className="font-serif text-5xl text-white mt-1">{allLeads.length}</div>
            <div className="text-xs text-white/50">sourced this cycle</div>
          </div>
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div className="font-mono text-[10px] text-[#FFB800]/70">ACTIVE CELLS</div>
            <div className="font-serif text-5xl text-white mt-1">1</div>
            <div className="text-xs text-white/50">forming</div>
          </div>
        </div>

        <button
          onClick={handleOpsOpenQueue}
          className="w-full border border-[#FFB800] bg-[#FFB800] text-black py-5 text-xs font-mono tracking-[0.2em]"
        >
          OPEN REVIEW QUEUE
        </button>

        <ShiposActivityTimeline events={allActivities} max={6} title="OPS ACTIVITY LOG" />
      </div>
    );
  };

  const roleLabel =
    currentView === 'founder' ? 'FOUNDER ROUTE' :
    currentView === 'campus' ? 'CAMPUS CELL' :
    currentView === 'scout' ? 'SCOUT SIGNAL' :
    currentView === 'ops' ? 'SHIP OPS' : 'PORTAL';

  const statusText =
    currentView === 'founder' ? 'ROUTE UNDER REVIEW' :
    currentView === 'campus' ? 'CELL FORMING' :
    currentView === 'scout' ? 'RHYTHM ACTIVE' :
    currentView === 'ops' ? 'DISPATCH LIVE' : 'DEMO LAYER';

  const profileLabel =
    currentView === 'founder' ? 'alex.rivera@founder.dev' :
    currentView === 'campus' ? 'jordan.hale@stanford.edu' :
    currentView === 'scout' ? 'sam.patel@mit.edu' :
    currentView === 'ops' ? 'ops@ship.vc' : 'DEMO SESSION';

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

      {/* Toast / command feedback */}
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
