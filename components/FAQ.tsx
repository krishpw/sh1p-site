import React, { useState, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { CompassIcon, TrainIcon } from './WireframeIcons';

interface QuestionItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

const questions: QuestionItem[] = [
  {
    id: '01',
    number: '01',
    question: 'How much time do I need to commit?',
    answer: "This is an immersion program, not a casual course. Expect to dedicate 15-20 hours per week. If you cannot clear your calendar, do not apply. We move fast.",
  },
  {
    id: '02',
    number: '02',
    question: 'Do I need a technical background?',
    answer: "No, but you need a builder's mindset. We have no-code founders shipping faster than engineers. The tool doesn't matter; the output does.",
  },
  {
    id: '03',
    number: '03',
    question: 'What stage should my startup be at?',
    answer: "Pre-seed to Seed. You should have a thesis and ideally an MVP. If you are still 'brainstorming ideas', this environment will be too intense for you.",
  },
  {
    id: '04',
    number: '04',
    question: 'Is there funding or investment involved?',
    answer: "We are not a VC fund, but we are a signal. Top graduates get direct intros to our network of angel investors and seed firms who watch our Demo Day closely.",
  },
  {
    id: '05',
    number: '05',
    question: 'What happens after the 5 weeks?',
    answer: "You graduate into the Alumni Network. You keep the momentum, the connections, and the operating system. The program ends, but the execution continues.",
  },
  {
    id: '06',
    number: '06',
    question: 'How selective is the program?',
    answer: "Extremely. We accept <2% of applicants. We look for slope, not intercept. Show us what you have shipped in the last 30 days.",
  },
];

// Reusable Corner Brackets for that "HUD" look
const CornerBrackets = ({ active }: { active: boolean }) => (
  <>
    <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 transition-colors duration-300 ${active ? 'border-gold-400' : 'border-gold-500/30'}`} />
    <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 transition-colors duration-300 ${active ? 'border-gold-400' : 'border-gold-500/30'}`} />
    <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 transition-colors duration-300 ${active ? 'border-gold-400' : 'border-gold-500/30'}`} />
    <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 transition-colors duration-300 ${active ? 'border-gold-400' : 'border-gold-500/30'}`} />
  </>
);

const DiagnosticCard = ({ item, isOpen, toggleOpen }: { item: QuestionItem, isOpen: boolean, toggleOpen: (id: string) => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      layout
      onClick={() => toggleOpen(item.id)}
      onMouseMove={handleMouseMove}
      className={`
        group relative overflow-hidden bg-deep-900/90 backdrop-blur-md cursor-pointer
        transition-all duration-300 ease-out
        ${isOpen ? 'z-20 scale-[1.02]' : 'z-10 hover:scale-[1.01]'}
      `}
    >
      {/* HUD Border Container */}
      <div className={`
        absolute inset-0 transition-all duration-300 border
        ${isOpen 
          ? 'border-gold-400 shadow-[0_0_60px_-5px_rgba(251,191,36,0.6)]' 
          : 'border-gold-500/20 group-hover:border-gold-500/60 group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]'
        }
      `} />

      {/* Corner Brackets */}
      <CornerBrackets active={isOpen || false} />

      {/* Mouse Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(251, 191, 36, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Content Container */}
      <div className="relative p-8 md:p-12 flex flex-col gap-6 z-10">
        
        {/* Top Row */}
        <div className="flex items-start justify-between gap-6">
           <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-3">
                <span className={`
                   font-mono text-xs tracking-widest uppercase transition-colors duration-300
                   ${isOpen ? 'text-gold-400' : 'text-gold-500/40 group-hover:text-gold-500/80'}
                `}>
                   Node {item.number}
                </span>
                <div className={`h-[1px] flex-1 transition-colors duration-300 ${isOpen ? 'bg-gold-500/50' : 'bg-white/10'}`} />
              </div>
              
              <h3 className={`
                 font-serif text-3xl md:text-4xl leading-[1.1] transition-colors duration-300
                 ${isOpen ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-white/70 group-hover:text-gold-100'}
              `}>
                 {item.question}
              </h3>
           </div>

           {/* Indicator Light */}
           <div className={`
              flex-shrink-0 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-300
              ${isOpen ? 'bg-gold-400 animate-pulse' : 'bg-gold-900 border border-gold-500/30'}
           `} />
        </div>

        {/* Answer Expansion */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="pt-6 relative">
                 {/* Decorative Data Line */}
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-gold-500/0 via-gold-500/50 to-gold-500/0" />
                 
                <p className="font-sans text-lg md:text-xl text-gold-50 leading-relaxed max-w-[95%]">
                  {item.answer}
                </p>
                
                <div className="mt-6 flex items-center justify-between font-mono text-[10px] text-gold-500/40 uppercase tracking-widest">
                  <span>Latency: 12ms</span>
                  <span>Encryption: ACTIVE</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative w-full overflow-hidden min-h-screen py-32 flex flex-col justify-center border-t border-b border-gold-500/20">
      
      {/* 1. CRT Scanline Overlay - Global interference */}
      <div className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-30 bg-[linear-gradient(rgba(18,16,10,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
      <motion.div 
         className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent via-gold-500/5 to-transparent h-[20vh]"
         animate={{ top: ['-20%', '120%'] }}
         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* 2. MASSIVE Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h2 className="font-serif text-[20vw] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.03] via-gold-500/[0.05] to-transparent tracking-tighter scale-150 md:scale-100 blur-sm">
          DIAGNOSTICS
        </h2>
      </div>

      {/* 3. Background Rotating Elements */}
      <div className="absolute right-[-10%] top-[-10%] w-[80vw] h-[80vw] opacity-[0.05] pointer-events-none mix-blend-screen">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
        >
          <CompassIcon className="w-full h-full text-gold-500" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Top Status Bar */}
        <div className="flex items-center justify-between border-b border-gold-500/30 pb-4 mb-16">
           <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gold-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]" />
              <span 
                className="font-mono text-sm text-gold-400 tracking-[0.2em] uppercase"
                style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}
              >
                System Status: Critical
              </span>
           </div>
           <div className="hidden md:flex font-mono text-[10px] text-gold-500/50 gap-8">
              <span>CPU: 98%</span>
              <span>MEM: 64TB</span>
              <span>NET: SECURE</span>
           </div>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-[1600px] mx-auto perspective-[1000px]">
          {questions.map((item) => (
            <DiagnosticCard 
              key={item.id} 
              item={item} 
              isOpen={openId === item.id} 
              toggleOpen={toggleOpen} 
            />
          ))}
        </div>

        {/* Bottom Decorative Footer for Section */}
        <div className="mt-20 flex justify-between items-end opacity-40">
           <div className="h-2 w-32 bg-gold-500/20" />
           <div className="font-mono text-[10px] text-gold-500 text-right">
              /// END OF LINE <br />
              AWAITING INPUT...
           </div>
        </div>

      </div>
    </section>
  );
};