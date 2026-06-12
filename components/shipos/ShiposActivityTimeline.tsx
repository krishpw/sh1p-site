import React from 'react';
import { motion } from 'framer-motion';
import type { ActivityEvent } from '@/types/shipos';
import { describeActivityEvent } from '@/lib/shipos/activity';

interface ShiposActivityTimelineProps {
  events: ActivityEvent[];
  max?: number;
  title?: string;
}

export const ShiposActivityTimeline: React.FC<ShiposActivityTimelineProps> = ({
  events,
  max = 5,
  title = "SIGNAL LOG",
}) => {
  const sorted = [...events]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, max);

  if (sorted.length === 0) {
    return (
      <div className="border border-white/10 bg-[#0A0A0A]/50 p-6 text-xs font-mono text-white/40">
        No recent activity. Actions in this preview will appear here.
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-[#0A0A0A]/70 p-6 md:p-7">
      <div className="font-mono text-[10px] tracking-[0.2em] text-[#FFB800]/70 uppercase mb-4">{title}</div>

      <div className="space-y-3">
        {sorted.map((evt, idx) => {
          const time = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const summary = describeActivityEvent(evt);

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="flex gap-3 text-xs border-l border-white/10 pl-3 py-0.5"
            >
              <div className="font-mono text-[10px] text-white/30 w-12 shrink-0 tabular-nums">{time}</div>
              <div className="flex-1">
                <div className="text-white/80">{summary}</div>
                {evt.payload && Object.keys(evt.payload).length > 0 && (
                  <div className="text-white/40 mt-0.5 text-[10px] truncate">
                    {Object.entries(evt.payload).map(([k, v]) => `${k}:${String(v)}`).join(' ')}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono tracking-widest text-white/30">
        {events.length} TOTAL EVENTS IN FOUNDATION GRAPH
      </div>
    </div>
  );
};
