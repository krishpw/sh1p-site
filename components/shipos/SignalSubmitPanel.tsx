import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createFounderLead } from '@/lib/repositories/leads';
import { createActivityEvent } from '@/lib/repositories/activity';

interface SignalSubmitPanelProps {
  isOpen: boolean;
  onClose: () => void;
  submittedByProfileId: string;
  submittedByRole: 'scout' | 'campus_lead';
  onSuccess?: () => void;
  title?: string;
}

export const SignalSubmitPanel: React.FC<SignalSubmitPanelProps> = ({
  isOpen,
  onClose,
  submittedByProfileId,
  submittedByRole,
  onSuccess,
  title = 'Submit Founder Signal',
}) => {
  const [founderName, setFounderName] = useState('');
  const [signal, setSignal] = useState('');
  const [traction, setTraction] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderName.trim() || !signal.trim()) return;

    setSubmitting(true);

    const lead = createFounderLead({
      submittedByProfileId,
      submittedByRole,
      founderName: founderName.trim(),
      founderEmail: undefined,
      founderLinks: undefined,
      signal: signal.trim(),
      traction: traction.trim() || undefined,
      status: 'submitted',
      notes: [],
    });

    createActivityEvent({
      actorProfileId: submittedByProfileId,
      actorRole: submittedByRole,
      type: 'lead_submitted',
      targetType: 'lead',
      targetId: lead.id,
      payload: { founderName: founderName.trim() },
      visibleTo: ['ops', submittedByRole],
    });

    setSubmitting(false);
    setFounderName('');
    setSignal('');
    setTraction('');
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md border border-white/10 bg-[#0A0A0A] p-6"
      >
        <div className="font-serif text-xl mb-1">{title}</div>
        <div className="text-white/50 text-xs font-mono tracking-widest mb-6">HIGH SIGNAL ONLY</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest mb-1">FOUNDER NAME / HANDLE</label>
            <input
              value={founderName}
              onChange={e => setFounderName(e.target.value)}
              required
              className="w-full bg-[#0F0F0F] border border-white/10 p-3 text-sm focus:border-[#FFB800] outline-none"
              placeholder="e.g. Alex Rivera"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest mb-1">WHY HIGH SIGNAL? (keep it tight)</label>
            <textarea
              value={signal}
              onChange={e => setSignal(e.target.value)}
              required
              rows={3}
              className="w-full bg-[#0F0F0F] border border-white/10 p-3 text-sm focus:border-[#FFB800] outline-none"
              placeholder="Dropped out, 3 pilots live, distribution engine already working..."
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest mb-1">TRACTION / PROOF (optional)</label>
            <input
              value={traction}
              onChange={e => setTraction(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/10 p-3 text-sm focus:border-[#FFB800] outline-none"
              placeholder="12 pilots, waitlist 420, first $49/mo customer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/20 py-3 text-xs font-mono tracking-widest text-white/70 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting || !founderName.trim() || !signal.trim()}
              className="flex-1 bg-[#FFB800] text-black font-bold uppercase tracking-[0.2em] text-sm py-3 disabled:opacity-50"
            >
              {submitting ? 'SENDING...' : 'SUBMIT SIGNAL'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-[10px] text-white/30 font-mono">This lead will appear in your log and the Ops review queue.</div>
      </motion.div>
    </div>
  );
};
