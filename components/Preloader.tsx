import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [text, setText] = useState("INITIALIZING CORE...");
  
  // The Timing Logic
  useEffect(() => {
    const texts = [
      "INITIALIZING CORE...",
      "CALIBRATING PHYSICS...", 
      "SYNCING ASSETS...",
      "READY."
    ];
    let i = 0;
    
    // Cycle text every 500ms
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) setText(texts[i]);
    }, 550);

    // The Exit Trigger (2200ms)
    // We give it slightly more than 2s to ensure the "READY" state hits
    const timer = setTimeout(() => {
       onComplete();
    }, 2400); 

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      exit={{ 
          opacity: 0, 
          transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 } 
      }}
    >
       {/* The Spinner Container */}
       <motion.div
         className="w-[120px] h-[120px] relative mix-blend-screen"
         exit={{ 
            scale: 30, // The "Warp" Effect
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
         }}
       >
          {/* The Violent Spinner (SVG) */}
          <motion.svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} // Violent speed
          >
            <defs>
                <filter id="glow-spin" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="48" stroke="#333" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" fill="none" opacity="0.5" />
            
            {/* The Turbine Blades */}
            <g filter="url(#glow-spin)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <line 
                        key={angle}
                        x1="50" y1="50" x2="50" y2="10" 
                        stroke="white" 
                        strokeWidth="2" 
                        transform={`rotate(${angle} 50 50)`}
                    />
                ))}
            </g>

            {/* Core */}
            <circle cx="50" cy="50" r="10" fill="#000" stroke="#FFB800" strokeWidth="2" />
            <circle cx="50" cy="50" r="4" fill="#FFB800" />
            
            {/* Crosshairs */}
            <path d="M50 0 L50 100 M0 50 L100 50" stroke="#FFB800" strokeWidth="0.5" opacity="0.5" />

          </motion.svg>
       </motion.div>

       {/* The Terminal Text */}
       <div className="absolute bottom-12 h-6 flex items-center justify-center overflow-hidden">
            <motion.p 
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-xs tracking-[0.3em] text-[#FFB800] uppercase"
            >
                {text}
            </motion.p>
       </div>
    </motion.div>
  )
}