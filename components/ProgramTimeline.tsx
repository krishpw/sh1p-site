import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const programWeeks = [
  {
    id: "01",
    title: "Foundation",
    description: "Clarify your thesis. Kill your darlings.",
    output: "One-page brief that survives scrutiny"
  },
  {
    id: "02",
    title: "Distribution",
    description: "Build channels that don't require ad spend.",
    output: "First 100 users strategy"
  },
  {
    id: "03",
    title: "Momentum",
    description: "Ship publicly. Document the journey.",
    output: "Launch sequence executed"
  },
  {
    id: "04",
    title: "Feedback",
    description: "Brutal honesty from people who've done it.",
    output: "Actionable pivot or conviction"
  },
  {
    id: "05",
    title: "Demo Day",
    description: "Present to investors who write checks.",
    output: "Seed round readiness"
  }
];

const WeekRow = ({ item, index, scrollYProgress, totalItems }: { item: typeof programWeeks[0], index: number, scrollYProgress: any, totalItems: number, key?: React.Key }) => {
  const step = 1 / totalItems;
  const start = index * step;
  
  // Interaction Physics:
  const isActiveRaw = useTransform(scrollYProgress, [start, start + 0.15], [0, 1]);
  // Increased base opacity from 0.3 to 0.6 so it doesn't "fade away"
  const opacity = useTransform(scrollYProgress, [start, start + 0.15], [0.6, 1]);
  const xDisplacement = useTransform(scrollYProgress, [start, start + 0.15], [-50, 0]);
  
  return (
    <motion.div 
      className="relative grid grid-cols-1 md:grid-cols-12 gap-8 py-24 md:py-36 border-b border-white/10 last:border-b-0 items-start group"
      style={{ opacity }}
    >
        {/* Col 1: The Marker (Anchor for the Fuse) */}
        <div className="col-span-1 md:col-span-1 flex justify-center pt-4 relative">
            <motion.div 
                style={{ 
                    scale: useTransform(isActiveRaw, [0, 1], [1, 1.5]), // Larger marker
                    backgroundColor: useTransform(isActiveRaw, [0, 1], ["#333", "#FFB800"]),
                    boxShadow: useTransform(isActiveRaw, [0, 1], ["none", "0 0 25px #FFB800"])
                }}
                className="w-4 h-4 rounded-full z-10 transition-colors duration-300 ring-4 ring-[#121212]" // Added ring for contrast against fuse
            />
        </div>

        {/* Col 2: The Label */}
        <div className="col-span-1 md:col-span-1 pt-5">
             <motion.span 
                style={{ color: useTransform(isActiveRaw, [0, 1], ["#666", "#FFB800"]) }}
                className="font-mono text-xs md:text-sm font-bold tracking-[0.2em] block"
             >
                WEEK {item.id}
             </motion.span>
        </div>

        {/* Col 3-5: The Title (MASSIVE) */}
        <div className="col-span-1 md:col-span-5">
             <motion.h3 
                style={{ 
                    x: xDisplacement,
                    textShadow: useTransform(isActiveRaw, [0, 1], ["none", "0 0 40px rgba(255, 184, 0, 0.3)"]),
                    color: useTransform(isActiveRaw, [0, 1], ["rgba(255,255,255,0.5)", "#FFF"]) // Brighter inactive state
                }}
                className="font-serif text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tighter transition-colors duration-500 group-hover:!text-[#FFB800]"
             >
                {item.title}
             </motion.h3>
        </div>

        {/* Col 6-9: The Description (LARGER & SERIF ITALIC) */}
        <div className="col-span-1 md:col-span-3 pt-4 md:pt-6">
             <motion.p 
                className="font-serif italic text-xl md:text-3xl leading-tight max-w-sm transition-colors duration-300 group-hover:!text-[#FFB800]"
                style={{ color: useTransform(isActiveRaw, [0, 1], ["rgba(255,255,255,0.5)", "rgba(255,255,255,0.9)"]) }}
             >
                {item.description}
             </motion.p>
        </div>

        {/* Col 10-12: The Output */}
        <div className="col-span-1 md:col-span-2 pt-4 md:pt-6 flex flex-col gap-3">
             <span className="font-mono text-[10px] text-[#FFB800] tracking-widest uppercase opacity-80">Output</span>
             <motion.div 
                className="border-b-2 border-white/20 pb-2 inline-block"
                style={{ 
                    borderColor: useTransform(isActiveRaw, [0, 1], ["rgba(255,255,255,0.1)", "#FFB800"]),
                    width: "fit-content"
                }}
             >
                 <motion.span 
                    style={{ color: useTransform(isActiveRaw, [0, 1], ["rgba(255,255,255,0.6)", "#FFF"]) }}
                    className="font-sans text-base md:text-lg font-medium group-hover:!text-white"
                 >
                    {item.output}
                 </motion.span>
             </motion.div>
        </div>

    </motion.div>
  );
}

export const ProgramTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const fuseHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothFuse = useSpring(fuseHeight, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="program" className="relative w-full min-h-screen z-20 pb-32 scroll-mt-24">
        <div className="max-w-[2000px] mx-auto px-6 md:px-12"> {/* Increased max-width */}
            <div className="pt-32 pb-32 md:pt-48 md:pb-40 border-b border-white/10">
                <h2 className="font-serif font-bold text-[9vw] leading-[0.9] text-white tracking-tighter drop-shadow-2xl text-center md:text-left">
                    Five weeks. <span className="italic text-white/50 transition-colors duration-300 hover:text-[#FFB800]">One focus.</span>
                </h2>
            </div>

            <div ref={containerRef} className="relative mt-24">
                {/* Thicker Guide Line */}
                <div className="absolute left-[calc(8.33%/2)] top-0 bottom-0 w-[4px] bg-white/5 transform -translate-x-1/2 hidden md:block" />
                
                {/* Thicker Active Fuse */}
                <motion.div 
                    style={{ height: smoothFuse }}
                    className="absolute left-[calc(8.33%/2)] top-0 w-[4px] bg-[#FFB800] transform -translate-x-1/2 hidden md:block shadow-[0_0_20px_#FFB800] origin-top"
                />

                <div className="flex flex-col">
                    {programWeeks.map((week, index) => (
                        <WeekRow 
                            key={week.id} 
                            item={week} 
                            index={index} 
                            scrollYProgress={scrollYProgress}
                            totalItems={programWeeks.length}
                        />
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};