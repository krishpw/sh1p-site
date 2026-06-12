import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Loader2, AlertCircle } from 'lucide-react';
import { storeApplicationHandoff } from '@/lib/shipos/session';
import { createApplication, upsertProfileFromApplication } from '@/lib/repositories/applications';

export const Launchpad: React.FC = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    social: '',
    pitch: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phase 4: stash full submitted data for real application-aware SHIPOS (not just email)
  const [lastHandoffEmail, setLastHandoffEmail] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<any>(null);

  const inputClasses = (name: string) => `
    w-full bg-[#0F0F0F] border transition-all duration-300 outline-none p-4 md:p-6 text-white font-sans placeholder:text-white/20
    ${focusedField === name 
      ? 'border-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.15)] bg-[#151515]' 
      : 'border-white/10 hover:border-white/20'}
  `;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');
    setErrorMessage(null);

    // FormSubmit note:
    // If activation loops or "confirmation not found" occurs on preview domains,
    // deploy to the stable domain and activate the latest FormSubmit email.
    // If FormSubmit provides a tokenized endpoint, replace the naked email endpoint with:
    // https://formsubmit.co/ajax/YOUR_TOKEN_HERE

    try {
      const response = await fetch("https://formsubmit.co/ajax/krishna@punchwallet.ai", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            application_type: "Cohort",
            _subject: "SHIP Cohort Application",
            _template: "table",
            _captcha: "false",
            ...formData
        })
      });

      const result = await response.json().catch(() => null);

      if (response.ok) {
        const message = String(result?.message || "").toLowerCase();

        if (
          message.includes("activate") ||
          message.includes("confirmation") ||
          message.includes("confirm")
        ) {
          throw new Error("Form activation required. Deploy to the stable domain, activate the latest FormSubmit email, then try again.");
        }

        const email = formData.email;
        setLastHandoffEmail(email || null);
        setLastSubmittedData({ ...formData, application_type: 'Cohort' });
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', social: '', pitch: '' });
      } else {
        setStatus('ERROR');
      }
    } catch (error: any) {
      console.error(error);
      setStatus('ERROR');
      if (error.message && error.message.includes("Form activation required")) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    // Removed bg-background to reveal global map
    <section id="apply" className="relative w-full min-h-screen pt-32 pb-48 px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden border-t border-white/10 scroll-mt-24">
        
        {/* Removed noise and local grid to keep the new clean aesthetic */}
        
        <div className="max-w-[90vw] w-full relative z-10">
            
            {/* Header */}
            <div className="text-center mb-24 md:mb-32">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/5 backdrop-blur-sm"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                    <span className="font-mono text-[10px] text-[#FFB800] tracking-widest uppercase">Applications Open</span>
                </motion.div>
                
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-serif text-[15vw] md:text-[12vw] text-white tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl select-none"
                    style={{ textShadow: "0 0 80px rgba(0,0,0,0.8)" }}
                >
                    Ready to <br className="md:hidden" /> <span className="italic text-[#FFB800] relative inline-block">ship?</span>
                </motion.h2>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="font-sans text-secondary text-lg md:text-xl max-w-lg mx-auto leading-relaxed"
                >
                    Apply to Cohort 1. We review applications weekly. If we think there's a fit, you'll hear back within 48 hours.
                </motion.p>
            </div>

            {/* Form Engine */}
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                  {status === 'SUCCESS' ? (
                      <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center p-12 border border-[#FFB800]/20 bg-[#FFB800]/5 rounded-sm text-center mb-24 backdrop-blur-md"
                      >
                          <div className="w-16 h-16 rounded-full bg-[#FFB800]/15 border border-[#FBBF24]/40 flex items-center justify-center mb-6 text-[#FFB800] shadow-[0_0_35px_rgba(251,191,36,0.25)] relative">
                              <div className="absolute inset-0 rounded-full animate-ping bg-[#FFB800]/20 opacity-75"></div>
                              <div className="w-4 h-4 bg-[#FFB800] rounded-full"></div>
                          </div>
                          <h3 className="font-mono uppercase tracking-[0.25em] text-[#FBBF24] mb-4 text-xl md:text-2xl">SIGNAL RECEIVED</h3>
                          <p className="text-white/55 font-sans mb-4 max-w-md mx-auto">
                              Application logged. If there's a fit, we'll reach out with next steps.
                          </p>
                          <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest mt-2 mb-8">TRANSMISSION COMPLETE</span>
                          
                          <button 
                              onClick={() => setStatus('IDLE')}
                              className="font-mono text-xs text-[#FFB800] hover:text-white uppercase tracking-widest transition-colors duration-300"
                          >
                              Submit another
                          </button>

                          {/* Phase 3: SHIPOS handoff CTA — preserves the existing SIGNAL RECEIVED block exactly */}
                          <div className="mt-8 pt-6 border-t border-[#FFB800]/20 w-full max-w-sm mx-auto">
                            <p className="text-white/70 font-sans text-sm mb-3">
                              Your founder signal has entered the map.
                            </p>
                            <motion.button
                              whileHover={{ scale: 0.985 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const submitted = lastSubmittedData || { name: lastHandoffEmail ? lastHandoffEmail.split('@')[0] : 'Applicant', email: lastHandoffEmail || 'applicant@ship.vc' };
                                const payload = {
                                  ...submitted,
                                  application_type: 'Cohort',
                                  full_name: submitted.name,
                                  social: submitted.social,
                                  pitch: submitted.pitch,
                                };
                                // Create the real structured application (persisted via repo + localStorage)
                                const app = createApplication({
                                  email: submitted.email,
                                  routeType: 'founder',
                                  status: 'submitted',
                                  payload,
                                });
                                // Link a real profile from the submitted data
                                upsertProfileFromApplication(app);

                                const handoff = {
                                  selectedRole: 'founder' as const,
                                  submittedRoute: 'cohort' as const,
                                  applicantEmail: submitted.email,
                                  submittedAt: new Date().toISOString(),
                                  applicationStatus: 'submitted' as const,
                                  applicationId: app.id,
                                  fullName: submitted.name || submitted.full_name,
                                };
                                storeApplicationHandoff(handoff);
                                window.location.hash = '#shipos/founder';
                              }}
                              className="w-full bg-[#FFB800] hover:bg-[#FFC000] text-black font-bold uppercase tracking-[0.2em] text-sm py-4 flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)]"
                            >
                              ENTER FOUNDER ROUTE
                            </motion.button>
                          </div>
                      </motion.div>
                  ) : (
                      <motion.form 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24"
                          onSubmit={handleSubmit}
                      >
                          {/* Name */}
                          <div className="col-span-1 group">
                              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">Codename</label>
                              <input 
                                  required
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  type="text" 
                                  placeholder="Full Name"
                                  className={inputClasses('name')}
                                  onFocus={() => setFocusedField('name')}
                                  onBlur={() => setFocusedField(null)}
                                  disabled={status === 'SENDING'}
                              />
                          </div>

                          {/* Email */}
                          <div className="col-span-1 group">
                              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">Frequency</label>
                              <input 
                                  required
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  type="email" 
                                  placeholder="Email Address"
                                  className={inputClasses('email')}
                                  onFocus={() => setFocusedField('email')}
                                  onBlur={() => setFocusedField(null)}
                                  disabled={status === 'SENDING'}
                              />
                          </div>

                          {/* Project URL */}
                          <div className="col-span-1 md:col-span-2 group">
                              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">Coordinates</label>
                              <input 
                                  required
                                  name="social"
                                  value={formData.social}
                                  onChange={handleInputChange}
                                  type="text" 
                                  placeholder="Twitter / LinkedIn / Portfolio"
                                  className={inputClasses('social')}
                                  onFocus={() => setFocusedField('social')}
                                  onBlur={() => setFocusedField(null)}
                                  disabled={status === 'SENDING'}
                              />
                          </div>

                          {/* Manifesto */}
                          <div className="col-span-1 md:col-span-2 group">
                              <label className="block font-mono text-[10px] text-[#FFB800] tracking-widest uppercase mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">The Payload</label>
                              <textarea 
                                  required
                                  name="pitch"
                                  value={formData.pitch}
                                  onChange={handleInputChange}
                                  rows={4}
                                  placeholder="What are you building? Why now?"
                                  className={inputClasses('pitch')}
                                  onFocus={() => setFocusedField('pitch')}
                                  onBlur={() => setFocusedField(null)}
                                  disabled={status === 'SENDING'}
                              />
                          </div>

                          {/* Error Message */}
                          {status === 'ERROR' && (
                              <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-red-500 bg-red-500/10 p-4 border border-red-500/20 rounded-sm">
                                  <AlertCircle size={16} />
                                  <span className="text-sm font-sans">{errorMessage || "Transmission failed. Please check your connection and try again."}</span>
                              </div>
                          )}

                          {/* Submit Button */}
                          <div className="col-span-1 md:col-span-2 pt-6">
                              <motion.button
                                  whileHover={{ scale: 0.98 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={status === 'SENDING'}
                                  className={`w-full bg-[#FFB800] hover:bg-[#FFC000] text-black font-bold uppercase tracking-[0.2em] text-sm py-6 md:py-8 flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:shadow-[0_0_50px_rgba(255,184,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                  {status === 'SENDING' ? (
                                      <>
                                          <Loader2 className="animate-spin" size={18} />
                                          <span>Transmitting...</span>
                                      </>
                                  ) : (
                                      <>
                                          <span>Submit Cohort Application</span>
                                          <ArrowRight size={18} strokeWidth={2.5} />
                                      </>
                                  )}
                              </motion.button>
                          </div>
                      </motion.form>
                  )}
              </AnimatePresence>
            </div>

            {/* Footer Data Columns */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
                {[
                    { label: "REQUIRED", text: "Something live. Doesn't have to be pretty." },
                    { label: "EXPECTED", text: "5-10 hours per week. Non-negotiable." },
                    { label: "OPTIONAL", text: "Prior experience. We care about velocity." }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="group"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={12} className="text-[#FFB800] opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span className="block font-mono text-[10px] text-white/40 tracking-widest uppercase group-hover:text-[#FFB800] transition-colors">
                                {item.label}
                            </span>
                        </div>
                        <p className="font-serif text-xl md:text-2xl text-white leading-tight opacity-80 group-hover:opacity-100 group-hover:text-[#FFB800] transition-all duration-300">
                            {item.text}
                        </p>
                    </motion.div>
                ))}
            </div>

        </div>
    </section>
  );
};