import React from 'react';
import type { ShipApplication } from '@/types/shipos';

interface ApplicationSummaryCardProps {
  app: ShipApplication;
  compact?: boolean;
  onClick?: () => void;
}

export const ApplicationSummaryCard: React.FC<ApplicationSummaryCardProps> = ({ app, compact = false, onClick }) => {
  const name = (app.payload?.full_name as string) || (app.payload?.name as string) || app.email.split('@')[0];
  const school = app.payload?.school as string | undefined;
  const when = new Date(app.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className={`group border border-white/10 bg-[#0A0A0A]/70 p-4 ${onClick ? 'cursor-pointer hover:border-[#FFB800]/50' : ''} ${compact ? 'text-xs' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-white">{name}</div>
          <div className="text-white/50 text-[10px] font-mono">{app.email}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] text-[#FFB800] uppercase tracking-widest">{app.routeType}</div>
          <div className="text-white/40 text-[10px]">{when}</div>
        </div>
      </div>

      {school && (
        <div className="mt-2 text-[10px] font-mono text-white/60">School: {school}</div>
      )}

      {!compact && (
        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/50">
          Status: <span className="text-[#FFB800]">{app.status}</span>
          {app.payload?.pitch && <div className="truncate mt-1">Pitch: {(app.payload.pitch as string).slice(0, 80)}...</div>}
        </div>
      )}
    </div>
  );
};
