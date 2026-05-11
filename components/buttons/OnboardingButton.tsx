'use client';

import { useState } from 'react';
import Onboarding from '@/components/Onboarding';
import { type UserProfile } from '@/lib/types/types';

export default function OnboardingButton() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartOnboarding = () => setShowOnboarding(true);
  const handleOnboardingComplete = (profile: UserProfile) => {
    console.log('Onboarding completed:', profile);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex items-center gap-4 mt-12">
      <button
        onClick={handleStartOnboarding}
        className="px-10 py-4 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-black transition-colors"
      >
        Начать путь
      </button>
    </div>
  );
}