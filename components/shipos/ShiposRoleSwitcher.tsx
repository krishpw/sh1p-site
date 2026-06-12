import React from 'react';
import { motion } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';

interface ShiposRoleSwitcherProps {
  current: ShiposView;
  onNavigate: (view: ShiposView) => void;
}

const ROLES: Array<{ view: ShiposView; label: string; short: string }> = [
  { view: 'portal', label: 'PORTAL', short: 'HOME' },
  { view: 'founder', label: 'FOUNDER', short: 'ROUTE 01' },
  { view: 'campus', label: 'CAMPUS', short: 'ROUTE 02' },
  { view: 'scout', label: 'SCOUT', short: 'ROUTE 03' },
  { view: 'ops', label: 'OPS', short: 'INTERNAL' },
  { view: 'firm', label: 'FIRM', short: 'PREVIEW' },
];

export const ShiposRoleSwitcher: React.FC<ShiposRoleSwitcherProps> = ({ current, onNavigate }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
      {ROLES.map((r) => {
        const active = current === r.view;
        return (
          <button
            key={r.view}
            onClick={() => onNavigate(r.view)}
            className={`px-4 py-1.5 text-[10px] font-mono tracking-[0.2em] border transition-all ${
              active
                ? 'border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800]'
                : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white/90'
            }`}
          >
            <span className="hidden sm:inline">{r.short} — </span>
            {r.label}
          </button>
        );
      })}
      <div className="ml-auto text-[10px] font-mono text-white/30 self-center hidden md:block">
        DEMO — CHANGES ARE LOCAL TO THIS SESSION
      </div>
    </div>
  );
};
