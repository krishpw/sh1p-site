import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2 }}
      className="fixed bottom-0 w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-end z-30 pointer-events-none"
    >
      
      {/* Left Block: Description */}
      <div className="max-w-[280px] md:max-w-md pointer-events-auto">
        <h3 className="text-[10px] md:text-[11px] leading-relaxed tracking-wider font-medium text-white/70 uppercase">
          A five-week cohort for founders <br className="hidden md:block"/>
          who believe in execution over optics.
        </h3>
      </div>

      {/* Right Block: Status indicator */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        
        {/* Decorative Line */}
        <div className="w-24 h-[1px] bg-white/30 mb-2" />

        <div className="flex items-center gap-3">
          <div className="text-right">
             <span className="block text-[9px] md:text-[10px] tracking-widest text-white/60 uppercase">High Signal</span>
             <span className="block text-[9px] md:text-[10px] tracking-widest text-white/40 uppercase">Low Noise</span>
          </div>
          
          <button className="group relative w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <HelpCircle size={14} className="text-white/80" />
            
            {/* Tooltip hint */}
            <span className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-white/10">
              Learn more
            </span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
};