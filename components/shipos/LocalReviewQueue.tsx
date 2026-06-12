import React from 'react';
import type { ShipApplication, ApplicationStatus } from '@/types/shipos';
import { ApplicationSummaryCard } from './ApplicationSummaryCard';
import { updateApplicationStatus } from '@/lib/repositories/applications';

interface LocalReviewQueueProps {
  applications: ShipApplication[];
  onRefresh: () => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = ['submitted', 'under_review', 'request_more_info', 'interview', 'accepted', 'waitlisted', 'rejected'];

export const LocalReviewQueue: React.FC<LocalReviewQueueProps> = ({ applications, onRefresh }) => {
  if (!applications.length) {
    return <div className="border border-white/10 bg-[#0A0A0A]/50 p-6 text-sm text-white/50">No applications yet. Submit from the public landing to see them here.</div>;
  }

  const handleStatus = (id: string, newStatus: ApplicationStatus) => {
    const updated = updateApplicationStatus(id, newStatus);
    if (updated) {
      onRefresh();
    }
  };

  return (
    <div className="space-y-3">
      {applications.slice(0, 8).map(app => {
        const name = (app.payload?.full_name as string) || (app.payload?.name as string) || app.email.split('@')[0];
        return (
          <div key={app.id} className="border border-white/10 bg-[#0A0A0A]/70 p-4">
            <ApplicationSummaryCard app={app} compact />

            <div className="mt-3 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatus(app.id, s)}
                  disabled={app.status === s}
                  className={`px-3 py-1 text-[10px] font-mono border tracking-widest uppercase transition ${app.status === s ? 'border-[#FFB800] text-[#FFB800] bg-[#FFB800]/10' : 'border-white/10 text-white/60 hover:border-white/30'}`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="mt-2 text-[10px] text-white/40 font-mono">
              {name} • {app.routeType} • {new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      })}
      {applications.length > 8 && (
        <div className="text-center text-[10px] text-white/30 font-mono">+{applications.length - 8} more in the graph</div>
      )}
    </div>
  );
};
