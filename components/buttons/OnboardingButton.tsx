'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

export default function OnboardingButton() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Home'); 

  const handleClick = () => {
    router.push(`/${locale}/onboarding`);
  };

  return (
    <button
      onClick={handleClick}
      className="p-4 md:p-6 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all"
    >
      {t('btnStart')}
    </button>
  );
}