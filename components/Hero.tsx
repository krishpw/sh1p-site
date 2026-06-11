import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // 1. THE PHYSICS ARCHITECTURE
  const { scrollY } = useScroll();

  // Map scrollY (pixels) to rotation (degrees)
  // Adjusted for shorter height: 0 -> 1000 covers the full range effectively
  const rotateRaw = useTransform(scrollY, [0, 800], [0, 360]);
  
  // Parallax fade-out effect for the content
  // Keep it visible slightly longer while the next section enters
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 600], [1, 0.85]);
  const contentBlur = useTransform(scrollY, [0, 600], ["0px", "8px"]);
  
  // The "Flywheel Effect"
  const smoothRotate = useSpring(rotateRaw, {
    stiffness: 40,
    damping: 20,
    mass: 1.5
  });

  const isActive = isPressed;

  return (
    // The Runway: Adjusted to reduce dead gap
    <div ref={containerRef} className="relative w-full h-[105vh]">
      
      {/* The Viewport: Sticky container keeps content centered while scrolling the runway */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Content Wrapper for Parallax Exit */}
        <motion.div 
            style={{ opacity: contentOpacity, scale: contentScale, filter: `blur(${contentBlur})` }}
            className="relative w-full h-full flex items-center justify-center pointer-events-none z-20"
        >
            {/* INTERACTION CLUSTER */}
            <div
              className="relative w-[140vw] h-[140vw] md:w-[90vh] md:h-[90vh] flex items-center justify-center pointer-events-auto cursor-pointer rounded-full"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => { setIsHovering(false); setIsPressed(false); }}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchCancel={() => setIsPressed(false)}
            >
              
              {/* CENTER BLOOM LAYER */}
              <motion.div
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,184,0,0.22)_0%,rgba(251,191,36,0.12)_28%,transparent_65%)] blur-2xl z-0 mix-blend-screen"
                initial={{ opacity: 0.2, scale: 1 }}
                animate={{
                  opacity: isActive ? 0.85 : isHovering ? 0.55 : 0.2,
                  scale: isActive ? 1.05 : isHovering ? 1.02 : 1
                }}
                transition={{ duration: isActive ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 1: The Rotating Compass (Encompassing Scale) */}
              <motion.div 
                style={{ rotate: smoothRotate }}
                className="absolute inset-0 z-10 mix-blend-screen flex items-center justify-center pointer-events-none"
              >
                <motion.div 
                  className="w-full h-full flex items-center justify-center"
                  initial={{ scale: 1, filter: "drop-shadow(0 0 0px transparent)" }}
                  animate={{ 
                    scale: isActive ? 0.995 : isHovering ? 1.01 : 1,
                    filter: isActive 
                      ? "drop-shadow(0 0 12px rgba(255, 251, 235, 0.65)) drop-shadow(0 0 32px rgba(255, 184, 0, 0.6)) drop-shadow(0 0 72px rgba(251, 191, 36, 0.35))"
                      : isHovering 
                      ? "drop-shadow(0 0 8px rgba(255, 184, 0, 0.55)) drop-shadow(0 0 22px rgba(251, 191, 36, 0.35)) drop-shadow(0 0 44px rgba(245, 158, 11, 0.18))"
                      : "drop-shadow(0 0 0px transparent)"
                  }}
                  transition={{ duration: isActive ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                   <GeometricDiagram />
                </motion.div>
              </motion.div>

              {/* Layer 2: The Monumental Typography */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
                {/* Main Title */}
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.8, y: 100 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: isActive ? 0.995 : isHovering ? 1.01 : 1,
                    textShadow: isActive
                      ? "0 0 16px rgba(255, 251, 235, 0.75), 0 0 40px rgba(255, 184, 0, 0.65), 0 0 90px rgba(251, 191, 36, 0.45), 0 0 140px rgba(245, 158, 11, 0.25)"
                      : isHovering
                      ? "0 0 12px rgba(255, 184, 0, 0.45), 0 0 32px rgba(251, 191, 36, 0.35), 0 0 72px rgba(245, 158, 11, 0.22)"
                      : "0 0 100px rgba(255,255,255,0.1)",
                    color: "#FFFFFF"
                  }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    y: { duration: 0.3 },
                    scale: { duration: isActive ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] },
                    textShadow: { duration: isActive ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className="font-serif leading-none tracking-tighter"
                  style={{ 
                    fontSize: '22vw', // Monumental scale
                    fontFamily: '"Instrument Serif", serif'
                  }}
                >
                  Ship
                </motion.h1>
              </div>

            </div>
        </motion.div>

      </div>
    </div>
  );
};

const GeometricDiagram = () => {
  const strokeColor = "rgba(255, 255, 255, 0.2)"; 
  const goldColor = "#FFB800";

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        viewBox="0 0 800 800" 
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
           <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="2" result="blur" />
             <feComposite in="SourceGraphic" in2="blur" operator="over" />
           </filter>
        </defs>
        
        {/* Outer Ring */}
        <motion.circle 
          cx="400" cy="400" r="380" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        
        {/* Inner Ring with Dashes */}
        <motion.circle 
          cx="400" cy="400" r="360" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Cardinal Directions */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}>
            <text x="400" y="55" textAnchor="middle" fill={goldColor} fontSize="32" fontFamily="serif" dy="10">N</text>
            <text x="760" y="410" textAnchor="middle" fill={goldColor} fontSize="32" fontFamily="serif" dy="10">E</text>
            <text x="400" y="785" textAnchor="middle" fill={goldColor} fontSize="32" fontFamily="serif">S</text>
            <text x="40" y="410" textAnchor="middle" fill={goldColor} fontSize="32" fontFamily="serif" dy="10">W</text>
            
            {/* Intercardinals */}
            <text x="630" y="180" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20" fontFamily="serif">NE</text>
            <text x="630" y="640" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20" fontFamily="serif">SE</text>
            <text x="170" y="640" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20" fontFamily="serif">SW</text>
            <text x="170" y="180" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20" fontFamily="serif">NW</text>
        </motion.g>

        {/* Main Compass Star (NSEW) */}
        <motion.path
            d="M400,70 L430,370 L730,400 L430,430 L400,730 L370,430 L70,400 L370,370 Z"
            fill="none"
            stroke={goldColor}
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        {/* Spine lines for Main Star */}
         <motion.path
            d="M400,70 L400,730 M70,400 L730,400"
            stroke={goldColor}
            strokeWidth="1"
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Secondary Star (Diagonals) - Rotated 45 degrees */}
        <motion.g transform="rotate(45 400 400)">
             <motion.path
                d="M400,160 L420,380 L640,400 L420,420 L400,640 L380,420 L160,400 L380,380 Z"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.8 }}
            />
            {/* Spine lines for Secondary Star */}
             <motion.path
                d="M400,160 L400,640 M160,400 L640,400"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
            />
        </motion.g>

         {/* Tertiary Star Elements - Small ticks for visual density */}
        <motion.g transform="rotate(22.5 400 400)">
            {[0, 90, 180, 270].map((rot) => (
                <motion.line 
                    key={rot}
                    x1="400" y1="280" x2="400" y2="340" 
                    stroke="rgba(255,255,255,0.15)" 
                    strokeWidth="1"
                    transform={`rotate(${rot} 400 400)`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                />
            ))}
        </motion.g>
        <motion.g transform="rotate(67.5 400 400)">
            {[0, 90, 180, 270].map((rot) => (
                <motion.line 
                    key={rot}
                    x1="400" y1="280" x2="400" y2="340" 
                    stroke="rgba(255,255,255,0.15)" 
                    strokeWidth="1"
                    transform={`rotate(${rot} 400 400)`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                />
            ))}
        </motion.g>

      </svg>
    </div>
  );
};