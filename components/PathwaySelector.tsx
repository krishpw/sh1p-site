import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { storeApplicationHandoff } from '@/lib/shipos/session';
import { createApplication, upsertProfileFromApplication } from '@/lib/repositories/applications';

type RouteType = "cohort" | "campus-lead" | "scout";

const routes = [
  {
    id: "cohort",
    label: "ROUTE 01",
    category: "FOUNDER",
    titleLines: ["join the", "cohort"],
    description: ["Bring the product.", "Bring the obsession.", "Leave with velocity."],
    cta: "Apply to Cohort 1",
  },
  {
    id: "campus-lead",
    label: "ROUTE 02",
    category: "CAMPUS LEAD",
    titleLines: ["become a", "campus lead"],
    description: ["Build the cell.", "Map the founders.", "Move signal weekly."],
    cta: "Apply as Campus Lead",
  },
  {
    id: "scout",
    label: "ROUTE 03",
    category: "Mentor",
    titleLines: ["join the mentorship", "network"],
    description: ["Find the builders.", "Surface the signal.", "Move before the market."],
    cta: "Apply as mentor",
  }
];

export const PathwaySelector: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<"campus-lead" | "scout" | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<RouteType | null>(null);

  const handleRouteClick = (id: RouteType | string) => {
    if (id === "cohort") {
      setActiveRoute(null);
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setActiveRoute(activeRoute === id ? null : id);
    }
  };

  return (
    <section id="pathways" className="relative w-full pt-8 md:pt-12 pb-24 md:pb-32 px-6 md:px-12 z-10 overflow-hidden flex flex-col items-center min-h-[90vh] justify-start scroll-mt-24">
      {/* Subtle background route line */}
      <div className="absolute inset-0 pointer-events-none opacity-5 md:opacity-10 z-0">
        <svg fill="none" className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <path d="M 0,200 C 300,200 700,800 1000,800" stroke="#FFB800" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="300" cy="360" r="2" fill="#FFB800" />
          <circle cx="700" cy="640" r="2" fill="#FFB800" />
        </svg>
      </div>

      <div className="max-w-[90vw] md:max-w-6xl w-full relative z-10 flex flex-col">
        {/* Header content */}
        <div className="text-center mb-16 md:mb-24 relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="inline-flex items-center gap-3 mb-6 md:mb-8"
          >
            <div className="w-6 md:w-12 h-[1px] bg-[#FFB800]/30" />
            <span className="font-mono text-[10px] text-[#FFB800] tracking-widest uppercase opacity-80">
              ROUTE SELECTION
            </span>
            <div className="w-6 md:w-12 h-[1px] bg-[#FFB800]/30" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#FFB800]/50 rounded-full blur-[1px] opacity-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center mb-8 md:mb-12 group"
          >
            {/* Subtle decorative background arc */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[80%] w-[80vw] max-w-[600px] aspect-[2/1] border-b border-[#FFB800]/10 rounded-[100%] pointer-events-none mix-blend-screen" />

            <motion.h2 
              className="font-serif flex flex-col items-center md:items-start relative z-10 cursor-default"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[12vw] md:text-[8vw] text-white tracking-tighter leading-[0.85] transition-colors duration-400 group-hover:text-[#FFFBEB]">
                Choose your
              </span>
              <motion.span 
                className="text-[14vw] md:text-[9.5vw] italic text-[#FFB800] tracking-tighter leading-[0.85] md:ml-[15%] transition-all duration-400"
                style={{
                  textShadow: "0 0 18px rgba(255, 184, 0, 0.35), 0 0 44px rgba(251, 191, 36, 0.22), 0 0 90px rgba(245, 158, 11, 0.12)"
                }}
              >
                route.
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.2 }}
            className="font-sans text-white/50 text-base md:text-xl max-w-2xl mx-auto leading-relaxed relative z-10 px-4"
          >
            SHIP is built for founders, campus operators, and scouts who find signal before the market does.
          </motion.p>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {routes.map((route, i) => {
            const isActive = activeRoute === route.id;
            const isHovered = hoveredRoute === route.id;
            const isRevealed = isActive || isHovered;
            
            return (
              <motion.button
                key={route.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                  delay: 0.4 + (i * 0.1), 
                  duration: 0.7, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleRouteClick(route.id)}
                onMouseEnter={() => setHoveredRoute(route.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                onFocus={() => setHoveredRoute(route.id)}
                onBlur={() => setHoveredRoute(null)}
                className={`group relative text-left p-8 md:p-10 border transition-all duration-400 overflow-hidden outline-none flex flex-col min-h-[440px] md:min-h-[480px] lg:min-h-[520px] ${
                    isActive 
                    ? 'border-[#FFB800] bg-white/[0.04] shadow-[0_0_60px_-16px_rgba(255,184,0,0.65)]' 
                    : 'border-white/10 bg-white/[0.02] hover:border-[#FFB800]/80 hover:shadow-[0_0_40px_-18px_rgba(251,191,36,0.55)] active:shadow-[0_0_60px_-16px_rgba(255,184,0,0.65)] active:border-[#FFB800]'
                }`}
              >
                {/* Subtle inner radial glow on hover/active */}
                <div 
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-400 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-active:opacity-100'
                  }`} 
                  style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,184,0,0.12), transparent 65%)' }} 
                />

                {/* Corner bracket styling */}
                <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-400 ${isActive ? 'border-[#FFB800]' : 'border-white/20 group-hover:border-[#FFB800]/80 group-active:border-[#FFB800]'}`} />
                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors duration-400 ${isActive ? 'border-[#FFB800]' : 'border-white/20 group-hover:border-[#FFB800]/80 group-active:border-[#FFB800]'}`} />
                <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors duration-400 ${isActive ? 'border-[#FFB800]' : 'border-white/20 group-hover:border-[#FFB800]/80 group-active:border-[#FFB800]'}`} />
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-400 ${isActive ? 'border-[#FFB800]' : 'border-white/20 group-hover:border-[#FFB800]/80 group-active:border-[#FFB800]'}`} />

                <div className="flex justify-between items-start mb-12 flex-shrink-0 relative z-10 w-full">
                  <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-400 ${isActive ? 'text-[#FFB800]' : 'text-[#FFB800]/50 group-hover:text-[#FFB800] group-active:text-[#FFB800]'}`}>
                    {route.label}
                  </span>
                  <span className={`font-mono text-[10px] tracking-widest transition-colors duration-400 ${isActive ? 'text-white/60' : 'text-white/30 group-hover:text-white/60 group-active:text-white/60'}`}>
                    {route.category}
                  </span>
                </div>
                
                <div className="flex-grow w-full relative z-10 py-6">
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center w-full"
                    initial={false}
                    animate={{
                      opacity: isRevealed ? 0 : 1,
                      y: isRevealed ? -22 : 0,
                      scale: isRevealed ? 0.96 : 1,
                      filter: isRevealed ? "blur(2px)" : "blur(0px)"
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="font-serif lowercase text-center text-[3.2rem] md:text-[3.8rem] lg:text-[4.2rem] leading-[0.9] tracking-[-0.04em] text-white w-full [text-shadow:0_0_2px_rgba(255,255,255,0.7),0_0_12px_rgba(255,255,255,0.35),0_0_28px_rgba(255,255,255,0.18)]">
                      {route.titleLines.map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </h3>
                  </motion.div>
                  
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none"
                    initial={false}
                    animate={{
                      opacity: isRevealed ? 1 : 0,
                      y: isRevealed ? 0 : 22,
                      scale: isRevealed ? 1 : 0.98
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: isRevealed ? 0.05 : 0 }}
                  >
                    <div className="font-sans text-center text-sm md:text-base leading-relaxed text-[#FBBF24]/90 max-w-[85%] mx-auto">
                      {route.description.map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="w-full mt-10 md:mt-12 flex-shrink-0">
                  <div className={`h-[1px] w-full mb-6 transition-all duration-400 ${isActive ? 'bg-[#FFB800]/50 shadow-[0_0_8px_rgba(255,184,0,0.5)]' : 'bg-white/10 group-hover:bg-[#FFB800]/50 group-hover:shadow-[0_0_8px_rgba(255,184,0,0.5)] group-active:bg-[#FFB800]/80 group-active:shadow-[0_0_12px_rgba(255,184,0,0.8)]'}`} />

                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-400 ${isActive ? 'bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.8)]' : 'bg-white/20 group-hover:bg-[#FFB800] group-hover:shadow-[0_0_8px_rgba(255,184,0,0.8)] group-active:bg-[#FFB800]'}`} />
                    <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-400 ${isActive ? 'text-[#FFB800]' : 'text-white/50 group-hover:text-[#FFB800] group-active:text-[#FFB800]'}`}>
                      {route.cta}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Application Panels */}
        <AnimatePresence mode="wait">
          {activeRoute === "campus-lead" && (
            <ApplicationPanel 
              key="campus-lead"
              type="Campus Lead" 
              title="Campus Lead Application" 
              subtitle="Launch a SHIP scout cell at your school."
            />
          )}
          {activeRoute === "scout" && (
             <ApplicationPanel 
              key="scout"
              type="Scout" 
              title="Scout Application" 
              subtitle="Find high-signal student founders before everyone else does."
            />
          )}
        </AnimatePresence>

        {/* Bottom Microcopy */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center font-sans text-white/30 text-xs md:text-sm mt-12 md:mt-24 max-w-lg mx-auto"
        >
          Not a club. Not a newsletter. A high-signal network for founders and the people closest to them.
        </motion.p>
      </div>
    </section>
  );
};

// --- Application Panel Component ---

interface ApplicationPanelProps {
  type: "Campus Lead" | "Scout";
  title: string;
  subtitle: string;
}

const ApplicationPanel: React.FC<ApplicationPanelProps> = ({ type, title, subtitle }) => {
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Phase 4: stash full submitted form data (all fields) for application-aware SHIPOS
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<any>(null);

  const inputClasses = (name: string) => `
    w-full bg-[#0F0F0F] border transition-all duration-300 outline-none p-4 text-white font-sans placeholder:text-white/20 text-sm
    ${focusedField === name 
      ? 'border-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.15)] bg-[#151515]' 
      : 'border-white/10 hover:border-white/20'}
  `;

  const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/krishna@punchwallet.ai";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('SENDING');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Clean FormSubmit endpoint.
    // First submission from a new domain triggers FormSubmit activation.
    // After activation, submissions are emailed as table-formatted results.

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json().catch(() => null);

      if (response.ok) {
        setLastSubmittedEmail((data.email as string) || null);
        setLastSubmittedData(data);  // full fields including why_*, school, profile, founder_to_watch etc.
        setStatus('SUCCESS');
      } else {
        throw new Error(result?.message || "Transmission failed");
      }
    } catch (error: any) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 16, height: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto overflow-hidden"
    >
      <div className="border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-md p-8 md:p-12 relative w-full mb-8">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFB800]/50 to-transparent" />
        
        <div className="mb-12">
          <h3 className="font-serif text-4xl text-white mb-2">{title}</h3>
          <p className="font-sans text-white/50">{subtitle}</p>
        </div>

        {status === 'SUCCESS' ? (
           <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
           >
              <div className="w-16 h-16 rounded-full bg-[#FFB800]/15 border border-[#FBBF24]/40 flex items-center justify-center mb-6 text-[#FFB800] shadow-[0_0_35px_rgba(251,191,36,0.25)] relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-[#FFB800]/20 opacity-75"></div>
                  <div className="w-3 h-3 bg-[#FFB800] rounded-full"></div>
              </div>
              <h4 className="font-mono uppercase tracking-[0.25em] text-[#FBBF24] mb-4 text-xl md:text-2xl">SIGNAL RECEIVED</h4>
              <p className="text-white/55 font-sans mb-4 max-w-md mx-auto">
                  Application logged. If there's a fit, we'll reach out with next steps.
              </p>
              <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest mt-2">TRANSMISSION COMPLETE</span>

              {/* Phase 3: SHIPOS handoff CTA — added without removing or restyling the existing SIGNAL RECEIVED block */}
              {(() => {
                const isCampus = type === "Campus Lead";
                const role = isCampus ? 'campus' as const : 'scout' as const;
                const submittedRoute = isCampus ? 'campus-lead' as const : 'scout' as const;
                const message = isCampus
                  ? "Your campus signal has entered the map."
                  : "Your scout signal has entered the map.";
                const cta = isCampus ? "ENTER CAMPUS COMMAND" : "ENTER SIGNAL HUB";
                const targetHash = isCampus ? '#shipos/campus' : '#shipos/scout';

                return (
                  <div className="mt-8 pt-6 border-t border-[#FFB800]/20 w-full max-w-sm mx-auto">
                    <p className="text-white/70 font-sans text-sm mb-3">{message}</p>
                    <motion.button
                      whileHover={{ scale: 0.985 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const submitted = lastSubmittedData || { email: lastSubmittedEmail || 'applicant@ship.vc', full_name: 'Applicant' };
                        const payload = { ...submitted };
                        const routeType = isCampus ? 'campus_lead' : 'scout';
                        // Create the real structured application record
                        const app = createApplication({
                          email: submitted.email || lastSubmittedEmail || 'applicant@ship.vc',
                          routeType,
                          status: 'submitted',
                          payload,
                        });
                        upsertProfileFromApplication(app);

                        const handoff = {
                          selectedRole: role,
                          submittedRoute,
                          applicantEmail: submitted.email || lastSubmittedEmail,
                          submittedAt: new Date().toISOString(),
                          applicationStatus: 'submitted' as const,
                          applicationId: app.id,
                          fullName: (submitted.full_name as string) || (submitted.name as string),
                          school: (submitted.school as string) || undefined,
                        };
                        storeApplicationHandoff(handoff);
                        window.location.hash = targetHash;
                      }}
                      className="w-full bg-[#FFB800] hover:bg-[#FFC000] text-black font-bold uppercase tracking-[0.2em] text-sm py-4 flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)]"
                    >
                      {cta}
                    </motion.button>
                  </div>
                );
              })()}
           </motion.div>
        ) : (
          <form action={FORMSUBMIT_ENDPOINT} method="POST" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_subject" value={`SHIP ${type} Application`} />
            <input type="hidden" name="application_type" value={type} />

            {/* Shared Fields */}
            <div className="col-span-1 group">
              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">FULL NAME</label>
              <input required name="full_name" type="text" className={`${inputClasses('full_name')} h-14`} onFocus={() => setFocusedField('full_name')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} />
            </div>

            <div className="col-span-1 group">
              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">EMAIL ADDRESS</label>
              <input required name="email" type="email" className={`${inputClasses('email')} h-14`} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} />
            </div>

            {type === "Campus Lead" ? (
              <>
                <div className="col-span-1 group">
                  <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">SCHOOL</label>
                  <input required name="school" type="text" className={`${inputClasses('school')} h-14`} onFocus={() => setFocusedField('school')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} />
                </div>
                <div className="col-span-1 group">
                  <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">GRADUATION YEAR</label>
                  <input name="graduation_year" type="text" className={`${inputClasses('graduation_year')} h-14`} onFocus={() => setFocusedField('graduation_year')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Optional" />
                </div>
              </>
            ) : (
              <div className="col-span-1 md:col-span-2 group">
                <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">SCHOOL, IF ANY</label>
                <input name="school" type="text" className={`${inputClasses('school')} h-14`} onFocus={() => setFocusedField('school')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Optional" />
              </div>
            )}

            <div className="col-span-1 md:col-span-2 group">
              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">LINKEDIN / X / PORTFOLIO</label>
              <input required name="profile" type="text" className={`${inputClasses('profile')} h-14`} onFocus={() => setFocusedField('profile')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} />
            </div>

            <div className="col-span-1 md:col-span-2 group">
              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">WHAT ELSE ARE YOU BUILDING, RUNNING, OR INVOLVED IN?</label>
              <textarea name="what_else_are_you_doing" rows={3} className={`${inputClasses('what_else_are_you_doing')} min-h-[96px]`} onFocus={() => setFocusedField('what_else_are_you_doing')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Optional — startups, clubs, communities, projects, funds, newsletters, hackathons, etc." />
            </div>

            {type === "Campus Lead" ? (
              <>
                <div className="col-span-1 md:col-span-2 group">
                  <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">WHY SHOULD YOU LEAD SHIP AT YOUR CAMPUS?</label>
                  <textarea required name="why_campus_lead" rows={3} className={`${inputClasses('why_campus_lead')} min-h-[96px]`} onFocus={() => setFocusedField('why_campus_lead')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Keep it direct. Tell us why you can find and move high-signal founders." />
                </div>
                <div className="col-span-1 md:col-span-2 group">
                  <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">NAME ONE STUDENT FOUNDER OR COMPANY AT YOUR SCHOOL WE SHOULD KNOW ABOUT.</label>
                  <textarea name="founder_to_watch" rows={3} className={`${inputClasses('founder_to_watch')} min-h-[96px]`} onFocus={() => setFocusedField('founder_to_watch')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Optional" />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-1 md:col-span-2 group">
                  <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">WHY WOULD YOU BE GOOD AT FINDING HIGH-SIGNAL FOUNDERS?</label>
                  <textarea required name="why_scout" rows={3} className={`${inputClasses('why_scout')} min-h-[96px]`} onFocus={() => setFocusedField('why_scout')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Keep it short. Tell us how you find builders before everyone else." />
                </div>
                <div className="col-span-1 md:col-span-2 group">
                  <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">NAME ONE UNDERRATED FOUNDER, BUILDER, OR COMPANY WE SHOULD KNOW ABOUT.</label>
                  <textarea name="founder_to_watch" rows={3} className={`${inputClasses('founder_to_watch')} min-h-[96px]`} onFocus={() => setFocusedField('founder_to_watch')} onBlur={() => setFocusedField(null)} disabled={status === 'SENDING'} placeholder="Optional" />
                </div>
              </>
            )}

            {/* Error state */}
            {status === 'ERROR' && (
                <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-red-500 bg-red-500/10 p-4 border border-red-500/20 rounded-sm mt-4">
                    <AlertCircle size={16} />
                    <span className="text-sm font-sans">Transmission failed. Try again after activating the latest FormSubmit email.</span>
                </div>
            )}

            {/* Submit */}
            <div className="col-span-1 md:col-span-2 pt-6">
                <motion.button
                    whileHover={{ scale: 0.99 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'SENDING'}
                    className={`w-full bg-[#FFB800] hover:bg-[#FFC000] text-black font-bold uppercase tracking-[0.2em] text-sm py-6 flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)] hover:shadow-[0_0_40px_rgba(255,184,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {status === 'SENDING' ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>TRANSMITTING...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit {type} Application</span>
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </>
                    )}
                </motion.button>
            </div>

          </form>
        )}
      </div>
    </motion.div>
  );
}
