import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';
import { ApplicationSummaryCard } from './ApplicationSummaryCard';
import { createActivityEvent } from '@/lib/repositories/activity';
import { deliveryPackets as mockPackets, deliverySignals as mockDeliverySignals, persistMockDb } from '@/data/mockShipos';
import { listFounderLeadsForOps } from '@/lib/repositories/leads';

interface FirmPortalProps {
  onNavigate?: (v: ShiposView) => void;
}

export const FirmPortal: React.FC<FirmPortalProps> = ({ onNavigate }) => {
  const [thesis, setThesis] = useState({ stages: ['pre-seed', 'seed'], sectors: ['AI', 'SaaS', 'fintech'], geographies: ['US'] });
  const [deliverySignals, setDeliverySignals] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  // Pull live packets + leads for preview (real data prioritized)
  const packets = mockPackets && mockPackets.length ? mockPackets : [];
  const currentPacket = packets[0] || null;
  const allLeads = listFounderLeadsForOps();
  const readyLeads = allLeads.filter((l: any) => l.status === 'investor_ready' || l.status === 'demo_review');

  // Load any previously saved signals from mock on mount (persist across refresh)
  useEffect(() => {
    if (Array.isArray(mockDeliverySignals) && mockDeliverySignals.length) {
      setDeliverySignals(mockDeliverySignals.slice(0, 12));
    }
  }, []);

  const persistThesis = () => {
    // Persist locally via mock for V1 (thesis affects future but here just saves state)
    try {
      const raw = localStorage.getItem('shipos_mock_db_v1');
      if (raw) {
        const db = JSON.parse(raw);
        db.firmTheses = db.firmTheses || [];
        db.firmTheses[0] = { ...(db.firmTheses[0] || {}), stages: thesis.stages, sectors: thesis.sectors, geographies: thesis.geographies };
        localStorage.setItem('shipos_mock_db_v1', JSON.stringify(db));
      }
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handleThesisUpdate = () => {
    persistThesis();
  };

  const handleSignal = (targetId: string, signal: 'pass' | 'interested' | 'want_intro') => {
    const newSig = { id: `sig_${Date.now()}`, packetId: currentPacket?.id || 'live', targetId, signal, at: new Date().toISOString() };
    const next = [...deliverySignals, newSig];
    setDeliverySignals(next);

    // Persist to shared mock array + LS
    if (Array.isArray(mockDeliverySignals)) {
      mockDeliverySignals.push(newSig);
      persistMockDb();
    }

    // Emit to Ops activity so visible in timeline/queues
    createActivityEvent({
      actorProfileId: 'prof_investor_001',
      actorRole: 'investor',
      type: 'firm_signal',
      targetType: 'lead',
      targetId,
      payload: { signal, target: targetId },
      visibleTo: ['ops', 'investor'],
    });

    // no alert to keep clean; signals now in state + activity
  };

  // Build preview founders: packet first, else ready leads
  const previewFounders: string[] = currentPacket?.founders?.length
    ? currentPacket.founders
    : readyLeads.slice(0, 3).map((l: any) => l.id);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-20">
      <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-2">FIRM PORTAL PREVIEW</div>
      <h2 className="font-serif text-3xl mb-6">Northstar Ventures</h2>

      {/* Firm Profile - editable + persists */}
      <div className="border border-white/10 bg-[#0A0A0A]/70 p-7 mb-6">
        <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">FIRM PROFILE (EDITABLE LOCALLY)</div>
        <div className="text-sm mb-2 text-white/80">Thesis, stage & sector focus. Changes save to local graph.</div>
        <div className="flex flex-col md:flex-row gap-2 mb-3">
          <input value={thesis.stages.join(', ')} onChange={e => setThesis({...thesis, stages: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="bg-[#0F0F0F] border border-white/10 p-2 text-xs flex-1" placeholder="stages" />
          <input value={thesis.sectors.join(', ')} onChange={e => setThesis({...thesis, sectors: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="bg-[#0F0F0F] border border-white/10 p-2 text-xs flex-1" placeholder="sectors" />
          <button onClick={handleThesisUpdate} className="border border-[#FFB800] px-3 text-xs whitespace-nowrap">{saved ? 'SAVED' : 'UPDATE THESIS'}</button>
        </div>
        <div className="text-[10px] text-white/40">Saved locally. Affects future fit previews (V1).</div>
      </div>

      {/* Current Delivery / Preview from real investor-ready if present */}
      <div className="mb-6">
        <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">CURRENT DELIVERY PACKET</div>
        {previewFounders.length > 0 ? (
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div>Month: {currentPacket?.month || new Date().toISOString().slice(0,7)} • Status: {currentPacket?.status || 'preview'} {readyLeads.length ? '• live from investor-ready leads' : ''}</div>
            <div className="mt-4 space-y-3">
              {previewFounders.map((fid: string) => (
                <div key={fid} className="border border-white/10 p-3">
                  <ApplicationSummaryCard app={{ id: fid, email: 'lead@', routeType: 'founder', status: 'investor_ready' as any, payload: { companyName: 'Lead from graph' }, submittedAt: new Date().toISOString() } as any} compact />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleSignal(fid, 'pass')} className="text-xs border px-2 py-1">Pass</button>
                    <button onClick={() => handleSignal(fid, 'interested')} className="text-xs border px-2 py-1 border-[#FFB800]">Interested</button>
                    <button onClick={() => handleSignal(fid, 'want_intro')} className="text-xs border px-2 py-1">Want Intro</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-white/40 mt-4">Firm signals are persisted and emitted to Ops activity.</div>
          </div>
        ) : (
          <div className="border border-white/10 bg-[#0A0A0A]/50 p-6 text-sm text-white/60">
            No delivery composed yet. When Ops marks leads investor_ready they appear here for signals. Empty state shows useful guidance.
          </div>
        )}
      </div>

      {/* Recent Signals (persisted) */}
      {deliverySignals.length > 0 && (
        <div className="mb-6">
          <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">YOUR RECENT SIGNALS</div>
          {deliverySignals.slice(-5).map(s => <div key={s.id} className="text-xs mb-1 text-white/70">{s.signal} • {s.targetId} • {new Date(s.at).toLocaleTimeString()}</div>)}
        </div>
      )}

      <div className="text-xs text-white/40">Thesis & signals are local-only in V1. Ops sees firm signals via activity.</div>
    </div>
  );
};
