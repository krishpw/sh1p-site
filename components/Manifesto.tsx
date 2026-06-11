import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { ShipIcon, TrainIcon, CompassIcon, BalloonIcon } from './WireframeIcons';

interface ManifestoItem {
  id: string;
  number: string;
  title: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
}

const items: ManifestoItem[] = [
  {
    id: '01',
    number: '01',
    title: 'Execution compounds. Optics don’t.',
    description: 'We ignore vanity metrics. We focus on shipping code, content, and product. If it doesn’t move the needle, we don’t do it.',
    Icon: ShipIcon,
  },
  {
    id: '02',
    number: '02',
    title: 'Distribution is a skill, not a budget line.',
    description: 'Paid ads are for scaling. Organic traction is for validation. We build channels that belong to us, not platforms that rent to us.',
    Icon: TrainIcon,
  },
  {
    id: '03',
    number: '03',
    title: 'Ship in public. Learn in public.',
    description: 'Secrecy protects bad ideas. Feedback refines good ones. We document the journey to build momentum before the launch.',
    Icon: CompassIcon,
  },
  {
    id: '04',
    number: '04',
    title: 'Honest feedback over polite applause.',
    description: "We don’t do 'great job' unless it is actually a great job. Radical candor saves time and builds better products.",
    Icon: BalloonIcon,
  },
];

// Atmospheric particle effect for depth
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gold-200/20 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * -40 - 20 + "%"], // distinct upward float
            x: [null, (Math.random() - 0.5) * 20 + "%"], // drift sideways
            opacity: [0, Math.random() * 0.3 + 0.1, 0], // fade in/out
            scale: [0, Math.random() * 0.5 + 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
          style={{
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 4 + 1 + "px",
          }}
        />
      ))}
    </div>
  );
};

// Text Block Component with Parallax
interface ParallaxTextProps {
  children: React.ReactNode;
  isLeft: boolean; // is the text on the left?
  scrollYProgress: MotionValue<number>;
  index: number;
}

const ParallaxText: React.FC<ParallaxTextProps> = ({ 
  children, 
  isLeft, 
  scrollYProgress, 
  index 
}) => {
  const start = index * 0.25;
  const end = start + 0.25;
  // Subtle parallax to feel "heavy"
  const y = useTransform(scrollYProgress, [start, end], [60, -60]);
  
  return (
    <motion.div 
      style={{ y }} 
      className={`relative z-20 flex flex-col justify-center h-full ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}
    >
      {children}
    </motion.div>
  );
};

const DoubleStrokeText = ({ text }: { text: string }) => {
    return (
        <motion.div 
            className="relative w-full cursor-default group"
            whileHover="hover"
            initial="rest"
        >
             {/* Layer 1: Thick Outer Ghost Stroke */}
             <motion.h2
                className="font-serif italic text-[14vw] leading-[0.8] tracking-tighter w-full absolute top-0 left-0 select-none z-0"
                style={{ 
                    WebkitTextStroke: '10px rgba(255,255,255,0.1)',
                    color: 'transparent'
                 }}
                variants={{
                    rest: { WebkitTextStrokeColor: 'rgba(255,255,255,0.1)', opacity: 0.5 } as any,
                    hover: { WebkitTextStrokeColor: 'rgba(255, 184, 0, 0.2)', opacity: 0.8 } as any
                }}
             >
                {text}
             </motion.h2>
             
             {/* Layer 2: Main Sharp Stroke */}
             <motion.h2
                className="font-serif italic text-[14vw] leading-[0.8] tracking-tighter w-full relative z-10"
                style={{ 
                    WebkitTextStroke: '2px rgba(255,255,255,0.9)',
                    color: 'transparent'
                 }}
                variants={{
                    rest: { 
                        WebkitTextStrokeColor: 'rgba(255,255,255,0.9)', 
                        color: 'transparent' 
                    } as any,
                    hover: { 
                        WebkitTextStrokeColor: '#FFB800', 
                        color: 'rgba(255, 184, 0, 0.05)',
                        filter: 'drop-shadow(0 0 25px rgba(255,184,0,0.4))'
                    } as any
                }}
             >
                {text}
             </motion.h2>
        </motion.div>
    )
}

export const Manifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    restDelta: 0.001
  });

  // Coordinates optimized for "Cross-Quadrant" layout
  const coordinates = [
    { x: 12, y: 12.5 },  // 01 Left Node
    { x: 88, y: 37.5 },  // 02 Right Node
    { x: 12, y: 62.5 },  // 03 Left Node
    { x: 88, y: 87.5 }   // 04 Right Node
  ];

  const pathD = `M ${coordinates[0].x} ${coordinates[0].y} L ${coordinates[1].x} ${coordinates[1].y} L ${coordinates[2].x} ${coordinates[2].y} L ${coordinates[3].x} ${coordinates[3].y}`;

  return (
    <section id="manifesto" className="relative w-full z-30 pt-0 pb-32 scroll-mt-24">
       {/* Container */}
       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          
          {/* 1. THE MONUMENTAL HEADER (Preserved) */}
          <div className="mb-32 flex flex-col select-none cursor-default">
             
             {/* Row 1: "We believe" + "in" */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="flex items-baseline flex-wrap -ml-[0.5vw]"
             >
                <motion.h2 
                    className="font-serif text-[12vw] leading-[0.8] text-white tracking-tighter"
                    whileHover={{ 
                        color: '#FFB800', 
                        textShadow: '0 0 40px rgba(255,184,0,0.3)',
                        scale: 1.01
                    }}
                    transition={{ duration: 0.3 }}
                >
                   We believe
                </motion.h2>
                <motion.span 
                    className="font-serif italic text-[6vw] text-[#FFB800] ml-[3vw] transform -translate-y-[2vw]"
                    whileHover={{ scale: 1.1, rotate: 5, filter: 'brightness(1.2)' }}
                >
                   in
                </motion.span>
             </motion.div>

             {/* Row 2: "Founders" */}
             <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="w-full text-right pr-[2vw] -mt-[2vw]"
             >
                <motion.h2 
                    className="font-serif italic text-[13vw] leading-[0.8] text-white/90 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    whileHover={{ 
                        color: '#FFB800', 
                        textShadow: '0 0 60px rgba(255,184,0,0.5)',
                        scale: 1.02,
                        rotate: -1
                    }}
                    transition={{ duration: 0.3 }}
                >
                   founders
                </motion.h2>
             </motion.div>

             {/* Row 3: "Who Work" (Double Trim) */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="w-full -mt-[3vw]"
             >
                <DoubleStrokeText text="who work" />
             </motion.div>
          </div>

          {/* 2. THE NEW CROSS-QUADRANT LIST (Visual Whole) */}
          <div ref={containerRef} className="relative w-full max-w-[2400px] mx-auto py-24 overflow-hidden">
            
            <FloatingParticles />

            {/* BACKGROUND SVG LAYER */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-visible hidden md:block z-0">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                    <stop offset="10%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="90%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Guide Path */}
                <path d={pathD} fill="none" stroke="rgba(251, 191, 36, 0.05)" strokeWidth="0.08" />

                {/* Active Line */}
                <motion.path 
                  d={pathD}
                  fill="none"
                  stroke="url(#line-gradient)"
                  strokeWidth="0.25"
                  filter="url(#gold-glow)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: smoothProgress }}
                />

                {/* Energy Pulse */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#fffbeb"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 400" 
                  initial={{ strokeDashoffset: 404 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{ opacity: 0.8, filter: "blur(1px)" }}
                />

                {/* Nodes */}
                {coordinates.map((coord, i) => {
                  const scale = useTransform(smoothProgress, [i * 0.25, i * 0.25 + 0.1], [0, 1]);
                  return (
                    <motion.g key={i} style={{ scale, transformBox: "fill-box", transformOrigin: "center" }}>
                      <circle cx={coord.x} cy={coord.y} r="0.8" stroke="#fbbf24" strokeWidth="0.05" fill="#050505" opacity="0.8" />
                      <line x1={coord.x-1.5} y1={coord.y} x2={coord.x+1.5} y2={coord.y} stroke="#fbbf24" strokeWidth="0.05" opacity="0.4" />
                      <line x1={coord.x} y1={coord.y-1.5} x2={coord.x} y2={coord.y+1.5} stroke="#fbbf24" strokeWidth="0.05" opacity="0.4" />
                    </motion.g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-col relative z-10 w-full">
              {items.map((item, index) => {
                const isNodeLeft = index % 2 === 0;
                const isTextLeft = !isNodeLeft; 
                
                return (
                  <div 
                    key={item.id}
                    className={`
                      w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-between
                      ${isNodeLeft ? 'flex-row' : 'flex-row-reverse'}
                    `}
                  >
                    
                    {/* --- ICON SIDE (Anchor with GRAVITY) --- */}
                    <div className={`w-[25%] md:w-[25%] flex ${isNodeLeft ? 'justify-start md:pl-[4%]' : 'justify-end md:pr-[4%]'}`}>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative shrink-0 z-10 flex items-center justify-center"
                      >
                        {/* GRAVITY CORE: The Dark Void */}
                        <div className="absolute -inset-16 md:-inset-24 bg-deep-900 rounded-full blur-xl z-0 opacity-90 scale-110" />

                        {/* GRAVITY FIELD: The Warp */}
                        <motion.div 
                          className="absolute -inset-8 md:-inset-16 rounded-full border border-gold-500/20 z-0"
                          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.4, 0.1] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* GRAVITY RINGS: Event Horizon */}
                        <motion.div 
                          className="absolute -inset-2 md:-inset-6 rounded-full border border-gold-400/30 z-0 border-dashed"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div 
                          className="absolute -inset-5 md:-inset-12 rounded-full border border-gold-400/10 z-0"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                        />

                        {/* ATMOSPHERE: Golden Haze */}
                        <div className="absolute inset-0 bg-gold-500/10 blur-[40px] md:blur-[80px] rounded-full z-0 mix-blend-screen" />

                        {/* THE MASSIVE ICON */}
                        <div className="relative w-32 h-32 md:w-64 md:h-64 z-20">
                          <item.Icon className="w-full h-full text-gold-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]" />
                        </div>
                      </motion.div>
                    </div>

                    {/* --- BLANK SPACE --- */}
                    <div className="flex-grow" />

                    {/* --- TEXT SIDE (Opposite Quadrant) --- */}
                    <div className="w-[65%] md:w-[55%]">
                      <ParallaxText isLeft={isTextLeft} scrollYProgress={scrollYProgress} index={index}>
                        
                        {/* Container for text content with HOVER GROUP */}
                        <div className={`relative max-w-6xl group cursor-default ${isTextLeft ? 'mr-auto' : 'ml-auto'}`}>
                          
                          {/* Watermark Number behind text */}
                          <div className={`
                            absolute -top-32 z-0 pointer-events-none select-none
                            font-serif font-bold text-[12rem] md:text-[20rem] text-white/[0.02] leading-none
                            transition-colors duration-700 group-hover:text-gold-500/[0.04]
                            ${isTextLeft ? '-left-24' : '-right-24'}
                          `}>
                            {item.number}
                          </div>

                          <motion.h3 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative z-10 font-serif text-5xl md:text-8xl lg:text-[7rem] text-white/60 group-hover:text-gold-400 transition-colors duration-700 ease-[0.22,1,0.36,1] leading-[0.9] tracking-tighter mb-10 drop-shadow-xl"
                          >
                            {item.title.replace(/\n/g, ' ')}
                          </motion.h3>

                          <div className={`relative z-10 flex ${isTextLeft ? 'justify-start' : 'justify-end'}`}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "120px" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                              className="h-[1px] bg-white/20 group-hover:bg-gold-400 transition-colors duration-700 mb-10"
                            />
                          </div>

                          <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="relative z-10 font-serif italic text-2xl md:text-4xl text-white/30 group-hover:text-gold-200 transition-colors duration-700 delay-75 leading-tight tracking-wide"
                          >
                            {item.description}
                          </motion.p>
                        </div>

                      </ParallaxText>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

       </div>
    </section>
  );
};