import React from 'react';
import { motion, Variants } from 'framer-motion';

// Common props
interface IconProps {
  className?: string;
}

// ------------------------------------------------------------------
// REUSABLE ASSETS (Gradients & Filters)
// ------------------------------------------------------------------
const IconDefs = ({ idPrefix }: { idPrefix: string }) => (
  <defs>
    {/* Metallic Gold Gradient for Strokes */}
    <linearGradient id={`${idPrefix}-gold-stroke`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />      {/* gold-50 (Highlight) */}
      <stop offset="40%" stopColor="#FBBF24" stopOpacity="1" />     {/* gold-400 (Mid) */}
      <stop offset="100%" stopColor="#92400E" stopOpacity="1" />    {/* gold-800 (Shadow) */}
    </linearGradient>

    {/* Soft Gold Gradient for Fills */}
    <linearGradient id={`${idPrefix}-gold-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.02" />
    </linearGradient>

    {/* Powerful Glow Filter */}
    <filter id={`${idPrefix}-glow`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 18 -7
      " result="goo" />
      <feComposite in="SourceGraphic" in2="goo" operator="over" />
      <feGaussianBlur stdDeviation="5" result="outerGlow" />
      <feMerge>
        <feMergeNode in="outerGlow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// ------------------------------------------------------------------
// ANIMATION VARIANTS
// ------------------------------------------------------------------
const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.1, type: "spring", duration: 2.5, bounce: 0 },
      opacity: { delay: i * 0.1, duration: 0.5 }
    }
  })
};

const rotateVariants: Variants = {
  hidden: { rotate: 0, opacity: 0 },
  visible: { 
    rotate: 360, 
    opacity: 0.3,
    transition: { 
      rotate: { duration: 60, repeat: Infinity, ease: "linear" },
      opacity: { duration: 1 }
    } 
  }
};

const pulseVariants: Variants = {
  visible: {
    opacity: [0.3, 0.6, 0.3],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

// ------------------------------------------------------------------
// ICONS
// ------------------------------------------------------------------

// 1. SHIP (Execution) - Art Deco Sailboat with Precision Rings
export const ShipIcon: React.FC<IconProps> = ({ className }) => {
  const id = "icon-ship";
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <IconDefs idPrefix={id} />
      
      {/* Background Mechanism */}
      <motion.g variants={rotateVariants} initial="hidden" whileInView="visible" style={{ originX: "60px", originY: "60px" }}>
        <circle cx="60" cy="60" r="50" stroke={`url(#${id}-gold-stroke)`} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        <circle cx="60" cy="60" r="40" stroke={`url(#${id}-gold-stroke)`} strokeWidth="0.2" />
      </motion.g>

      {/* Main Structure */}
      <g style={{ filter: `url(#${id}-glow)` }}>
        {/* Hull */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={1}
          d="M25 75 Q 60 95 95 75 L 95 65 L 25 65 Z" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          fill={`url(#${id}-gold-fill)`}
        />
        {/* Front Sail (Large) */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={2}
          d="M60 15 L 90 60 L 60 60 Z" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          fill={`url(#${id}-gold-fill)`}
        />
        {/* Back Sail (Smaller) */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={3}
          d="M55 25 L 30 60 L 55 60 Z" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          fill={`url(#${id}-gold-fill)`}
        />
        {/* Mast */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={4}
          d="M60 60 L 60 12" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinecap="round"
        />
        
        {/* Decorative Water Lines */}
        <motion.path variants={pathVariants} custom={5} d="M15 85 Q 30 90 45 85 T 75 85 T 105 85" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1" strokeOpacity="0.5" />
        <motion.path variants={pathVariants} custom={6} d="M25 92 Q 40 97 55 92 T 85 92" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1" strokeOpacity="0.3" />
      </g>
    </svg>
  );
};

// 2. TRAIN (Distribution) - Powerful Streamliner Locomotive
export const TrainIcon: React.FC<IconProps> = ({ className }) => {
  const id = "icon-train";
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <IconDefs idPrefix={id} />

      {/* Speed Lines Background */}
      <motion.g initial={{ x: -10, opacity: 0 }} whileInView={{ x: 0, opacity: 0.2 }} transition={{ duration: 1 }}>
        <line x1="10" y1="20" x2="110" y2="20" stroke={`url(#${id}-gold-stroke)`} strokeWidth="0.5" />
        <line x1="0" y1="100" x2="120" y2="100" stroke={`url(#${id}-gold-stroke)`} strokeWidth="0.5" />
      </motion.g>

      <g style={{ filter: `url(#${id}-glow)` }}>
        {/* Main Engine Body (Streamliner Shape) */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={1}
          d="M20 80 L 100 80 L 100 45 Q 100 35 90 35 L 40 35 Q 20 35 20 60 Z" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          fill={`url(#${id}-gold-fill)`}
        />
        
        {/* Window */}
        <motion.rect 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={2}
          x="75" y="42" width="20" height="15" rx="2" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="1.5" 
          fill="none"
        />
        
        {/* Detail Lines */}
        <motion.path variants={pathVariants} custom={3} d="M25 55 L 95 55" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1" opacity="0.6" />
        
        {/* Wheels (Heavy Industrial) */}
        <motion.g variants={pathVariants} custom={4}>
           <circle cx="35" cy="80" r="12" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
           <circle cx="35" cy="80" r="4" fill={`url(#${id}-gold-stroke)`} />
        </motion.g>
        <motion.g variants={pathVariants} custom={5}>
           <circle cx="65" cy="80" r="12" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
           <circle cx="65" cy="80" r="4" fill={`url(#${id}-gold-stroke)`} />
        </motion.g>
        <motion.g variants={pathVariants} custom={6}>
           <circle cx="95" cy="80" r="12" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
           <circle cx="95" cy="80" r="4" fill={`url(#${id}-gold-stroke)`} />
        </motion.g>

        {/* Cowcatcher / Front Grill */}
        <motion.path variants={pathVariants} custom={7} d="M20 60 L 10 80" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
        <motion.path variants={pathVariants} custom={8} d="M20 70 L 12 80" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1" />
      </g>
    </svg>
  );
};

// 3. COMPASS (Learning) - Intricate Star & Tech Rings
export const CompassIcon: React.FC<IconProps> = ({ className }) => {
  const id = "icon-compass";
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <IconDefs idPrefix={id} />

      {/* Rotating Outer Ring */}
      <motion.g variants={rotateVariants} initial="hidden" whileInView="visible" style={{ originX: "60px", originY: "60px" }}>
        <circle cx="60" cy="60" r="50" stroke={`url(#${id}-gold-stroke)`} strokeWidth="0.8" strokeDasharray="2 6" />
        <path d="M60 5 L 60 15 M 60 105 L 60 115 M 5 60 L 15 60 M 105 60 L 115 60" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1.5" />
      </motion.g>

      <g style={{ filter: `url(#${id}-glow)` }}>
        {/* Inner Static Ring */}
        <motion.circle 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={1}
          cx="60" cy="60" r="35" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1.5" 
        />
        
        {/* Compass Star */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={2}
          d="M60 25 L 70 50 L 95 60 L 70 70 L 60 95 L 50 70 L 25 60 L 50 50 Z" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinejoin="round"
          fill={`url(#${id}-gold-fill)`}
        />
        
        {/* Center Pivot */}
        <motion.circle variants={pathVariants} custom={3} cx="60" cy="60" r="3" fill="#FFFBEB" />
        
        {/* Decorative Cardinals */}
        <motion.path variants={pathVariants} custom={4} d="M60 25 L 60 20" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
        <motion.path variants={pathVariants} custom={5} d="M95 60 L 100 60" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
        <motion.path variants={pathVariants} custom={6} d="M60 95 L 60 100" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
        <motion.path variants={pathVariants} custom={7} d="M25 60 L 20 60" stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" />
      </g>
    </svg>
  );
};

// 4. BALLOON (Feedback) - Geometric Hot Air Balloon
export const BalloonIcon: React.FC<IconProps> = ({ className }) => {
  const id = "icon-balloon";
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <IconDefs idPrefix={id} />
      
      {/* Background Clouds */}
      <motion.path 
         variants={pulseVariants} initial="hidden" whileInView="visible"
         d="M10 80 Q 25 70 40 80 T 70 80 T 100 80" 
         stroke={`url(#${id}-gold-stroke)`} strokeWidth="0.5" fill="none" opacity="0.3" 
      />

      <g style={{ filter: `url(#${id}-glow)` }}>
        {/* Balloon Main Shape */}
        <motion.path 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={1}
          d="M30 45 Q 60 -10 90 45 Q 90 75 70 90 L 50 90 Q 30 75 30 45 Z" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          fill={`url(#${id}-gold-fill)`}
        />
        
        {/* Vertical Panel Lines */}
        <motion.path variants={pathVariants} custom={2} d="M60 5 L 60 90" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1.5" opacity="0.7" />
        <motion.path variants={pathVariants} custom={3} d="M30 45 Q 45 45 60 45 Q 75 45 90 45" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        
        {/* Ropes */}
        <motion.path variants={pathVariants} custom={4} d="M50 90 L 45 105" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1.5" />
        <motion.path variants={pathVariants} custom={5} d="M70 90 L 75 105" stroke={`url(#${id}-gold-stroke)`} strokeWidth="1.5" />
        
        {/* Basket */}
        <motion.rect 
          variants={pathVariants} initial="hidden" whileInView="visible" custom={6}
          x="45" y="105" width="30" height="10" rx="2" 
          stroke={`url(#${id}-gold-stroke)`} strokeWidth="2" 
          fill={`url(#${id}-gold-fill)`}
        />
      </g>
    </svg>
  );
};