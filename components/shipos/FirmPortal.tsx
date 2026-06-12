import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';
import { ApplicationSummaryCard } from './ApplicationSummaryCard';

interface FirmPortalProps {
  onNavigate?: (v: ShiposView) => void;
}

export const FirmPortal: React.FC<FirmPortalProps> = ({ onNavigate }) => {
  const [thesis, setThesis] = useState({ stages: ['pre-seed', 'seed'], sectors: ['devtools', 'infra'], geographies: ['US'] });
  const [deliverySignals, setDeliverySignals] = useState<any[]>([]);

  // Use data from mock via global (for V1 demo)
  const packets = (window as any).__shipos_deliveryPackets || [];
  const currentPacket = packets[0] || null;

  const handleThesisUpdate = () => {
    // Simple local recalc - would trigger firmFit in real
    alert('Thesis updated. Local fit scores would recalculate (demo).');
  };

  const handleSignal = (targetId: string, signal: 'pass' | 'interested' | 'want_intro') => {
    const newSig = { id: `sig_${Date.now()}`, packetId: currentPacket?.id || 'demo', targetId, signal, at: new Date().toISOString() };
    setDeliverySignals([...deliverySignals, newSig]);
    // In real, would persist via repo and notify Ops
    alert(`Signal ${signal} recorded for ${targetId}. Would appear in Ops activity.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-20">
      <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-2">FIRM PORTAL PREVIEW</div>
      <h2 className="font-serif text-3xl mb-6">Founders VC</h2>

      {/* Firm Profile */}
      <div className="border border-white/10 bg-[#0A0A0A]/70 p-7 mb-6">
        <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">FIRM PROFILE (EDITABLE LOCALLY)</div>
        <div className="text-sm mb-4">Thesis: Early technical founders with distribution edge. Check size ~$1-3M.</div>
        <div className="flex gap-2 mb-4">
          <input value={thesis.stages.join(', ')} onChange={e => setThesis({...thesis, stages: e.target.value.split(',').map(s=>s.trim())})} className="bg-[#0F0F0F] border border-white/10 p-2 text-xs flex-1" />
          <button onClick={handleThesisUpdate} className="border border-[#FFB800] px-3 text-xs">UPDATE THESIS</button>
        </div>
      </div>

      {/* Current Delivery */}
      <div className="mb-6">
        <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">CURRENT DELIVERY PACKET</div>
        {currentPacket ? (
          <div className="border border-white/10 bg-[#0A0A0A]/70 p-6">
            <div>Month: {currentPacket.month} • Status: {currentPacket.status}</div>
            <div className="mt-4">
              {currentPacket.founders.map((fid: string) => (
                <div key={fid} className="mb-3 border border-white/10 p-3">
                  <ApplicationSummaryCard app={{ id: fid, email: 'demo@', routeType: 'founder', status: 'investor_ready' as any, payload: { companyName: 'Demo Founder from Packet' }, submittedAt: new Date().toISOString() } as any} compact />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleSignal(fid, 'pass')} className="text-xs border px-2 py-1">Pass</button>
                    <button onClick={() => handleSignal(fid, 'interested')} className="text-xs border px-2 py-1 border-[#FFB800]">Interested</button>
                    <button onClick={() => handleSignal(fid, 'want_intro')} className="text-xs border px-2 py-1">Want Intro</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-white/40 mt-4">Signals persist locally and would sync to Ops in full system.</div>
          </div>
        ) : (
          <div className="border border-white/10 bg-[#0A0A0A]/50 p-6 text-sm text-white/60">
            No delivery composed yet. Ops can create one from investor-ready leads in the Ops console.
          </div>
        )}
      </div>

      {/* Recent Signals */}
      {deliverySignals.length > 0 && (
        <div className="mb-6">
          <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">YOUR RECENT SIGNALS</div>
          {deliverySignals.map(s => <div key={s.id} className="text-xs mb-1">{s.signal} on {s.targetId} at {new Date(s.at).toLocaleTimeString()}</div>)}
        </div>
      )}

      <div className="text-xs text-white/40">This is a coherent preview of the firm experience. Thesis edits would affect future match scores.</div>
    </div>
  );
};
