import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShiposView } from '@/lib/shipos/session';

interface ShiposRouteTransitionProps {
  view: ShiposView;
  onComplete?: () => void;
  durationMs?: number;
}

const COPY: Record<ShiposView, { line1: string; line2: string }> = {
  portal: { line1: 'SHIPOS LAYER', line2: 'ROUTE SELECTION ACTIVE' },
  founder: { line1: 'YOUR FOUNDER ROUTE', line2: 'IS NOW BEING MAPPED' },
  campus: { line1: 'YOUR CAMPUS CELL', line2: 'IS FORMING IN THE GRAPH' },
  scout: { line1: 'SCOUT SIGNAL HUB', line2: 'READY TO SURFACE BUILDERS' },
  ops: { line1: 'SHIP OPS CONSOLE', line2: 'REVIEW QUEUE LOADED' },
  firm: { line1: 'FIRM PORTAL', line2: 'THESIS & DELIVERY LIVE' },
};

export const ShiposRouteTransition: React.FC<ShiposRouteTransitionProps> = ({
  view,
  onComplete,
  durationMs = 650,
}) => {
  const copy = COPY[view] || COPY.portal;

  React.useEffect(() => {
    const t = setTimeout(() => onComplete?.(), durationMs);
    return () => clearTimeout(t);
  }, [view, durationMs, onComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-[0.3em] text-[#FFB800]/70 mb-3"
        >
          CROSSING INTO THE OPERATING LAYER
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-5xl tracking-[-0.03em] text-white"
        >
          {copy.line1}
        </motion.div>
        <div className="mt-1 text-lg text-[#FFB800] tracking-tight">{copy.line2}</div>

        <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#FFB800]/50 to-transparent" />
      </div>
    </div>
  );
};
