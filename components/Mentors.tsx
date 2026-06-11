import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const rosterItems = [
  {
    role: "OPERATOR",
    desc: "Scaled restaurants to 2,000+ locations",
    metric: "$2B+ Rev"
  },
  {
    role: "FOUNDER",
    desc: "Grew B2C products to 10M+ users",
    metric: "10M Users"
  },
  {
    role: "GROWTH",
    desc: "Led growth at viral consumer apps",
    metric: "Ex-Uber"
  },
  {
    role: "COMMUNITY",
    desc: "Built communities of 500K+ members",
    metric: "500K+ DAO"
  }
];

const DriveBeltMarquee = ({ speedFactor }: { speedFactor: any }) => {
  const baseX = useMotionValue(0);
  
  useAnimationFrame((t, delta) => {
    let moveBy = -0.1 * delta; 
    moveBy *= speedFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${parseFloat((v % 50).toString()).toFixed(3)}%`);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0 select-none">
      <motion.div 
        className="flex whitespace-nowrap"
        style={{ x }}
      >
        <span className="text-[25vh] font-sans font-bold text-white opacity-[0.03] mix-blend-overlay leading-none tracking-tighter mr-12">
          OPERATORS • FOUNDERS • BUILDERS • SHIPPERS • OPERATORS • FOUNDERS • BUILDERS • SHIPPERS •
        </span>
        <span className="text-[25vh] font-sans font-bold text-white opacity-[0.03] mix-blend-overlay leading-none tracking-tighter mr-12">
          OPERATORS • FOUNDERS • BUILDERS • SHIPPERS • OPERATORS • FOUNDERS • BUILDERS • SHIPPERS •
        </span>
      </motion.div>
    </div>
  );
};

const GridCell = ({ item }: { item: typeof rosterItems[0] }) => {
  return (
    <motion.div 
      className="group relative p-8 md:p-12 border border-white/10 flex flex-col justify-between h-[300px] transition-colors duration-500 hover:border-[#FFB800]/50 hover:bg-[#FFB800]/5"
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20 group-hover:border-[#FFB800] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20 group-hover:border-[#FFB800] transition-colors" />

      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-[#FFB800] tracking-widest uppercase opacity-70 group-hover:opacity-100">
          {item.role}
        </span>
        <ArrowUpRight className="text-white/20 group-hover:text-[#FFB800] transition-colors" size={20} />
      </div>

      <div className="relative z-10">
         <h4 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-500 group-hover:text-[#FFB800]">
           {item.desc}
         </h4>
         <div className="w-full h-[1px] bg-white/10 mb-4 group-hover:bg-[#FFB800]/30 transition-colors" />
         <span className="font-mono text-xs text-white/40 group-hover:text-[#FFB800] transition-colors">
            TRACK RECORD: <span className="text-white group-hover:text-[#FFB800]">{item.metric}</span>
         </span>
      </div>
    </motion.div>
  )
}

export const Mentors: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const targetSpeed = isHovered ? 0.05 : 1;
  const speedSpring = useSpring(targetSpeed, { stiffness: 100, damping: 30 });

  React.useEffect(() => {
    speedSpring.set(targetSpeed);
  }, [isHovered, speedSpring, targetSpeed]);

  return (
    // Removed bg-background
    <section id="mentors" className="relative w-full py-32 md:py-48 overflow-hidden border-t border-white/5 scroll-mt-24">
        <DriveBeltMarquee speedFactor={speedSpring} />
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
                <div className="lg:col-span-4 flex flex-col justify-center pr-12">
                    <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-white tracking-tighter mb-8">
                        People who've <br />
                        <span className="italic text-white/40 font-serif transition-colors duration-300 hover:text-[#FFB800]">actually</span> <br />
                        done it.
                    </h2>
                    <p className="font-sans text-secondary text-lg leading-relaxed max-w-sm hover:text-[#FFB800] transition-colors duration-300">
                        No theorists. No gurus. Just operators who have built, scaled, and exited. They don't just advise; they critique.
                    </p>
                </div>

                <div 
                    className="lg:col-span-8"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {rosterItems.map((item, index) => (
                            <GridCell key={index} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};