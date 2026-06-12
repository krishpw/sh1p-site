import React from 'react';

interface MissingInfoPanelProps {
  message: string;
  cta?: string;
  onCta?: () => void;
}

export const MissingInfoPanel: React.FC<MissingInfoPanelProps> = ({ message, cta = 'ADD INFO', onCta }) => {
  return (
    <div className="border border-[#FFB800]/30 bg-[#FFB800]/5 p-4 text-sm">
      <div className="font-mono text-[10px] text-[#FFB800] tracking-widest mb-1">MISSING SIGNAL</div>
      <div className="text-white/80">{message}</div>
      {onCta && (
        <button onClick={onCta} className="mt-3 text-xs font-mono tracking-[0.2em] text-[#FFB800] hover:underline">
          {cta} →
        </button>
      )}
    </div>
  );
};
