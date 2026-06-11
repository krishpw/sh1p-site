import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'MANIFESTO', href: '#manifesto' },
  { label: 'PROGRAM', href: '#program' },
  { label: 'SCOUTS', href: '#pathways' },
  { label: 'MENTORS', href: '#mentors' },
  { label: 'APPLY', href: '#apply' },
];

export const Navigation: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-0 w-full z-50 transition-colors duration-500"
    >
      {/* Interactive Glow Background */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FFB800]/10 to-transparent blur-2xl h-[120px]"
          />
        )}
      </AnimatePresence>

      <div className="w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-center text-[10px] md:text-xs tracking-[0.2em] font-medium text-white/80 mix-blend-difference">
        <nav>
          <ul className="flex space-x-6 md:space-x-12">
            {navItems.map((item) => (
              <li key={item.label}>
                <a 
                  href={item.href} 
                  className="relative group hover:text-white transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FFB800] transition-all duration-300 group-hover:w-full box-shadow-[0_0_10px_#FFB800]" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <span className={`transition-colors duration-300 ${isHovered ? 'text-[#FFB800]' : 'text-white/80'}`}>
            S1 — 2026
          </span>
        </div>
      </div>
    </motion.header>
  );
};