import React from 'react';
import { motion } from 'framer-motion';

interface ShiposStatusCardProps {
  title: string;
  status: string;
  description?: string;
  nextStep?: string;
  accent?: boolean;
}

export const ShiposStatusCard: React.FC<ShiposStatusCardProps> = ({
  title,
  status,
  description,
  nextStep,
  accent = true,
}) => {
  return (
    <div className="group relative border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-md p-6 md:p-8 overflow-hidden">
      {/* Corner brackets - matching public language */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${accent ? 'border-[#FFB800]' : 'border-white/20'}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${accent ? 'border-[#FFB800]' : 'border-white/20'}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${accent ? 'border-[#FFB800]' : 'border-white/20'}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${accent ? 'border-[#FFB800]' : 'border-white/20'}`} />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-[#FFB800]/70 uppercase mb-1">{title}</div>
          <div className="font-serif text-2xl text-white tracking-tighter">{status}</div>
        </div>
        {accent && (
          <div className="px-3 py-1 text-[10px] font-mono tracking-widest border border-[#FFB800]/40 text-[#FFB800] bg-[#FFB800]/5">
            LIVE
          </div>
        )}
      </div>

      {description && (
        <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">{description}</p>
      )}

      {nextStep && (
        <div className="pt-4 border-t border-white/10 text-xs font-mono tracking-widest text-white/50">
          NEXT → <span className="text-[#FFB800]/90">{nextStep}</span>
        </div>
      )}
    </div>
  );
};
