import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { ProgramTimeline } from './components/ProgramTimeline';
import { Mentors } from './components/Mentors';
import { Specs } from './components/Specs';
import { FAQ } from './components/FAQ';
import { Launchpad } from './components/Launchpad';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { CartographicBackground } from './components/CartographicBackground';
import { PathwaySelector } from './components/PathwaySelector';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function App() {
  const [loading, setLoading] = useState(true);

  // Scroll Lock Logic during loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  // MOUSE PHYSICS (Haptic Feel)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the tilt/pan effect (Heavy/Premium weight)
  const springConfig = { damping: 30, stiffness: 100, mass: 2 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Map mouse position to transforms
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["1deg", "-1deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-1deg", "1deg"]);
  const translateX = useTransform(xSpring, [-0.5, 0.5], ["-10px", "10px"]);
  const translateY = useTransform(ySpring, [-0.5, 0.5], ["-10px", "10px"]);

  // Spotlight Effect
  // Maps -0.5 (left) to 0% and 0.5 (right) to 100%
  const spotX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -0.5 to 0.5
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background antialiased selection:bg-[#FFB800]/20 selection:text-white overflow-hidden">
      
      {/* 0. THE GLOBAL BACKGROUND LAYER */}
      <CartographicBackground />

      {/* 1. THE SYSTEM BOOT (Preloader) */}
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <Navigation />
      
      {/* Dynamic Spotlight (Brighter Screen Feel) */}
      {/* Increased opacity from 0.08 to 0.15 for more brightness */}
      <motion.div 
        className="fixed inset-0 z-30 pointer-events-none mix-blend-screen"
        style={{
            background: useTransform(
                [spotX, spotY],
                ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(255,255,255,0.15), transparent 40%)`
            )
        }}
      />

      {/* Main Content Flow - Haptic Container */}
      {/* Wrapped in perspective div to allow fixed children outside to work properly while maintaining 3D effect on content */}
      <div className="perspective-[1000px] flex-grow w-full flex flex-col relative z-10">
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: !loading ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ 
              rotateX, 
              rotateY, 
              x: translateX, 
              y: translateY 
          }}
          className="w-full flex flex-col relative transform-style-3d origin-center"
        >
          <Hero />
          <PathwaySelector />
          <Manifesto />
          <ProgramTimeline />
          <Mentors />
          <Specs />
          <FAQ />
          <Launchpad />
        </motion.main>
      </div>

      <Footer />
      
      {/* Vignette effect - Reduced opacity from 0.3 to 0.15 */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)]" />
    </div>
  );
}