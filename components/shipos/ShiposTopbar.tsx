import React from 'react';
import { motion } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';

interface ShiposTopbarProps {
  view: ShiposView;
  roleLabel: string;
  status: string;
  profileLabel?: string;
  onExit: () => void;
}

const ROLE_LABELS: Record<ShiposView, string> = {
  portal: 'SHIPOS',
  founder: 'FOUNDER ROUTE',
  campus: 'CAMPUS CELL',
  scout: 'SCOUT SIGNAL',
  ops: 'SHIP OPS',
  firm: 'FIRM PORTAL',
};

export const ShiposTopbar: React.FC<ShiposTopbarProps> = ({
  view,
  roleLabel,
  status,
  profileLabel = 'DEMO SESSION',
  onExit,
}) => {
  const displayRole = ROLE_LABELS[view] || roleLabel;

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-xs font-mono tracking-[0.15em]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
            <span className="text-[#FFB800] font-medium">SHIPOS</span>
            <span className="text-white/40">V1</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          <div className="px-3 py-0.5 border border-[#FFB800]/40 text-[#FFB800] bg-[#FFB800]/5 text-[10px]">
            {displayRole}
          </div>

          <div className="text-white/50 text-[10px]">{status}</div>
        </div>

        <div className="flex items-center gap-4 text-white/60">
          <div className="hidden sm:block text-[10px]">{profileLabel}</div>

          <button
            onClick={onExit}
            className="group flex items-center gap-2 px-4 py-1.5 border border-white/20 hover:border-[#FFB800]/60 hover:text-[#FFB800] transition-colors text-[10px] tracking-widest"
          >
            EXIT TO PUBLIC SITE
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
          </button>
        </div>
      </div>

      {/* Thin gold rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFB800]/40 to-transparent" />
    </div>
  );
};
