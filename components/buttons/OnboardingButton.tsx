'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function OnboardingButton() {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    router.push(`/${locale}/onboarding`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-8 py-4 bg-gold text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all"
    >
      Begin Your Journey
    </button>
  );
}