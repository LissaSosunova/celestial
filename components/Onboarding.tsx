'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Loader2 } from 'lucide-react';
import { type UserProfile } from '@/lib/types/types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    gender: 'Woman'
  });

  const steps = [
    {
      title: "Harmonizing Sky & Soul",
      description: "Welcome to SoulChart. A psychological approach to astrology designed for the modern woman.",
      icon: <Sparkles className="w-12 h-12 text-gold" />
    },
    {
      title: "Your Celestial Blueprint",
      description: "Discover the unique position of the planets at the moment of your birth and how they shape your personality.",
      icon: <Moon className="w-12 h-12 text-gold" />
    },
    {
      type: 'form',
      title: "Tell us about your soul",
      description: "Your birth details allow us to map the stars exactly as they were for you."
    }
  ];

  const currentStep = steps[step];

  const handleFinish = async () => {
    setIsSubmitting(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onComplete({
        uid: 'demo-user',
        name: formData.name || 'Seeker',
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthLocation: formData.birthLocation,
        gender: formData.gender,
        onboardingCompleted: true
      });
    } catch (error) {
      console.error('Error during onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col min-h-screen relative overflow-hidden bg-primary text-text font-sans antialiased"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

        <nav className="px-12 py-8 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center">
              <div className="w-1 h-1 bg-gold rounded-full"></div>
            </div>
            <span className="tracking-ultra text-[10px] uppercase font-bold text-text-muted">SoulChart</span>
          </div>
        </nav>

        <main className="flex-1 px-12 pb-12 flex flex-col relative z-10">
          {/* Progress Stepper */}
          <div className="flex gap-4 mb-20 max-w-4xl">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col gap-2 flex-1">
                <span className="text-[10px] uppercase tracking-tighter opacity-50">0{i + 1}</span>
                <div className={`h-[1px] ${i <= step ? 'bg-gold' : 'bg-border'}`}></div>
                <span className={`text-[9px] uppercase tracking-ultra font-bold ${i === step ? 'text-text' : 'text-text-light'}`}>
                  {i === 0 ? 'Welcome' : i === 1 ? 'Discovery' : 'Registration'}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-1 items-center">
            <div className="md:col-span-6 lg:col-span-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-5xl lg:text-7xl font-light italic mb-8 leading-[1.1] tracking-tight text-dark font-serif">
                    {step === 0 ? (<>Align your <br/><span className="pl-12">Celestial</span> path.</>) : currentStep.title}
                  </h1>
                  <p className="text-lg text-text-muted leading-relaxed max-w-lg mb-12">
                    {currentStep.description}
                  </p>

                  {currentStep.type === 'form' ? (
                    <div className="space-y-6 text-left max-w-md">
                      <div>
                        <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Birth Date</label>
                          <input 
                            type="date" 
                            value={formData.birthDate}
                            onChange={e => setFormData({...formData, birthDate: e.target.value})}
                            className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Birth Time</label>
                          <input 
                            type="time" 
                            value={formData.birthTime}
                            onChange={e => setFormData({...formData, birthTime: e.target.value})}
                            className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Birth Location</label>
                        <input 
                          type="text" 
                          value={formData.birthLocation}
                          onChange={e => setFormData({...formData, birthLocation: e.target.value})}
                          className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-4 mt-12">
                    <button 
                      onClick={() => step === steps.length - 1 ? handleFinish() : setStep(step + 1)}
                      disabled={isSubmitting}
                      className="px-10 py-4 bg-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {step === steps.length - 1 ? "Enter Sacred Space" : "Begin Registration"}
                    </button>
                    {step === 0 && (
                      <button className="px-8 py-4 border border-border text-dark text-[10px] uppercase tracking-ultra rounded-full hover:bg-white">
                        Gift a Chart
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
}