import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const specsData = [
  {
    label: "FORMAT",
    value: "Virtual",
    description: "Work from anywhere. Show up when it matters."
  },
  {
    label: "DURATION",
    value: "5 Weeks",
    description: "Long enough to build. Short enough to stay focused."
  },
  {
    label: "COHORT",
    value: "12 Founders",
    description: "Small by design. Every voice heard."
  },
  {
    label: "INVESTMENT",
    value: "$0",
    description: "We don't take equity. We take your commitment."
  }
];

export const Specs: React.FC = () => {
  return (
    // Removed bg-background
    <section className="relative w-full border-t border-white/10">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Headline Section */}
        <div className="px-6 py-24 md:px-12 md:py-32 border-b border-white/10 relative">
           <div className="max-w-5xl">
               <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-mono text-xs md:text-sm text-[#FFB800] tracking-widest uppercase mb-6 block"
               >
                  The Environment
               </motion.span>
               <h2 className="font-serif text-5xl md:text-7xl lg:text-9xl leading-[0.9] text-white tracking-tighter">
                  Not an accelerator. <br />
                  <span className="italic text-white/40 font-serif transition-colors duration-300 hover:text-[#FFB800]">A working room.</span>
               </h2>
           </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 relative">
          {specsData.map((item, index) => (
            <motion.div 
              key={index}
              className="group relative p-8 md:p-12 border-b md:border-b-0 border-white/10 md:border-r last:border-b-0 md:last:border-r-0 flex flex-col justify-between min-h-[350px] md:min-h-[450px]"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* Technical Crosshair (Desktop Only) */}
              <div className="absolute -top-1.5 -left-1.5 text-white/20 hidden md:block z-20">
                <Plus size={12} strokeWidth={1} />
              </div>

              {/* Hover Overlay Background */}
              <motion.div 
                className="absolute inset-0 bg-[#FFB800]/[0.02] pointer-events-none origin-top"
                variants={{
                  rest: { scaleY: 0, opacity: 0 },
                  hover: { scaleY: 1, opacity: 1 }
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Top Content */}
              <div className="relative z-10">
                {/* HUD Label */}
                <motion.div 
                  className="flex items-center gap-3 mb-6 md:mb-10"
                  variants={{
                    rest: { x: 0 },
                    hover: { x: 5 }
                  }}
                  transition={{ duration: 0.2 }}
                >
                    {/* Status Dot */}
                    <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"
                        variants={{
                            rest: { opacity: 0.5, scale: 0.8 },
                            hover: { opacity: 1, scale: 1.2, boxShadow: "0 0 8px #FFB800" }
                        }}
                    />
                    <motion.span 
                        className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium"
                        variants={{
                            rest: { color: "#666666" },
                            hover: { color: "#FFB800" }
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {item.label}
                    </motion.span>
                </motion.div>

                {/* Big Value - Updated to Serif for brand consistency */}
                <motion.h3 
                  className="font-serif text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-none"
                  variants={{
                    rest: { y: 0, color: "#FFFFFF" },
                    hover: { y: -4, color: "#FFB800" }
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  {item.value}
                </motion.h3>
              </div>

              {/* Bottom Description with expanding line */}
              <div className="relative z-10 pt-12 md:pt-0">
                 <motion.div 
                    className="h-[1px] bg-white/10 mb-6 origin-left"
                    variants={{
                        rest: { width: "20%", backgroundColor: "rgba(255,255,255,0.1)" },
                        hover: { width: "100%", backgroundColor: "#FFB800" }
                    }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                 />
                 <motion.p 
                    className="font-sans text-secondary text-sm md:text-base leading-relaxed max-w-[240px]"
                    variants={{
                        rest: { opacity: 0.6, x: 0, color: "#999999" },
                        hover: { opacity: 1, x: 2, color: "#FFB800" }
                    }}
                    transition={{ duration: 0.3 }}
                 >
                   {item.description}
                 </motion.p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};