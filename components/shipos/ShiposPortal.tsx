import React from 'react';
import { motion } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';
import { ShiposStatusCard } from './ShiposStatusCard';

interface ShiposPortalProps {
  onNavigate: (view: ShiposView) => void;
}

const PREVIEW_ROLES: Array<{
  view: ShiposView;
  title: string;
  status: string;
  blurb: string;
  cta: string;
}> = [
  {
    view: 'founder',
    title: 'ROUTE 01 — FOUNDER',
    status: 'UNDER REVIEW',
    blurb: 'Your application has entered the Founder Graph. Add traction to strengthen your profile.',
    cta: 'ENTER FOUNDER ROUTE',
  },
  {
    view: 'campus',
    title: 'ROUTE 02 — CAMPUS LEAD',
    status: 'CELL FORMING',
    blurb: 'Launch a SHIP scout cell at your school. Recruit 2–4 scouts to activate.',
    cta: 'ENTER CAMPUS COMMAND',
  },
  {
    view: 'scout',
    title: 'ROUTE 03 — SCOUT',
    status: 'SIGNAL HUB LIVE',
    blurb: 'Submit high-signal founders before the market does. Weekly rhythm active.',
    cta: 'ENTER SCOUT HUB',
  },
  {
    view: 'ops',
    title: 'SHIP OPS',
    status: 'REVIEW QUEUE',
    blurb: 'Unified inbox for applications, leads, and cells. Internal dispatch layer.',
    cta: 'OPEN OPS CONSOLE',
  },
];

export const ShiposPortal: React.FC<ShiposPortalProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-16 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-[10px] tracking-[0.25em] text-[#FFB800]/70 border border-[#FFB800]/20 px-4 py-1">
            YOU HAVE CROSSED THE THRESHOLD
          </div>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tighter text-white">SHIPOS</h1>
          <p className="mt-3 text-white/50 max-w-md mx-auto">The operating layer behind the map. Choose a route to preview the control surface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PREVIEW_ROLES.map((r, i) => (
            <motion.button
              key={r.view}
              onClick={() => onNavigate(r.view)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              whileHover={{ y: -2 }}
              className="text-left group relative border border-white/10 bg-[#0A0A0A]/70 hover:border-[#FFB800]/60 p-8 transition-all overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-[#FFB800]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-[#FFB800]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-[#FFB800]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-[#FFB800]" />

              <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-3">{r.title}</div>

              <div className="font-serif text-3xl text-white tracking-tight mb-4">{r.status}</div>

              <p className="text-sm text-white/60 leading-relaxed mb-8">{r.blurb}</p>

              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#FFB800] group-hover:gap-3 transition-all">
                {r.cta} <span>→</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 text-center text-[10px] font-mono text-white/30 tracking-widest">
          ALL DATA IS MOCK • ACTIONS CREATE LOCAL ACTIVITY EVENTS • EXIT ANYTIME
        </div>
      </div>
    </div>
  );
};
