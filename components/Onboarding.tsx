'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useUserProfile, type UserProfile } from '@/lib/hooks/useUserProfile';

interface OnboardingProps {
  onComplete?: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveProfile } = useUserProfile();
  const router = useRouter();
  const locale = useLocale();
  
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

  const handleFinish = async () => {
    setIsSubmitting(true);

    try {
      // Создаем профиль пользователя
      const userProfile: UserProfile = {
        uid: `user-${Date.now()}`, // Уникальный ID
        name: formData.name || 'Seeker',
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthLocation: formData.birthLocation,
        gender: formData.gender,
        onboardingCompleted: true
      };

      // Сохраняем профиль через хук (в cookies)
      await saveProfile(userProfile);
      
      // Вызываем колбэк если передан
      if (onComplete) {
        onComplete(userProfile);
      }
      
      // Редирект на главную страницу
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      console.error('Error during onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen relative overflow-hidden bg-primary text-text font-sans antialiased"
    >
      <main className="flex-1 px-12 pb-12 flex flex-col relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-1 items-center">
          <div className="md:col-span-6 lg:col-span-12">
            <div className="space-y-6 text-left max-w-md">
              <div>
                <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Birth Time</label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
                    className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-ultra text-gold mb-3 block font-bold">Birth Location</label>
                <input
                  type="text"
                  value={formData.birthLocation}
                  onChange={e => setFormData({ ...formData, birthLocation: e.target.value })}
                  className="w-full bg-white border border-border-light p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-12">
              <button 
                className="px-8 py-4 bg-gold text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting}
                onClick={handleFinish}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}