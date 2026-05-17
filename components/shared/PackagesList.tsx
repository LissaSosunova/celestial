'use client';

import { PackageItem } from '@/components/shared/Package';
import { PACKAGES, type Package } from '@/lib/types/package';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export function PackagesList() {
  const { profile } = useUserProfile();
  const router = useRouter();
  const locale = useLocale();
  const handleClickPackage = (pack: Package) => {
    const hasProfile = !!(profile);
    if (hasProfile) {
      router.push(`/${locale}/product/${pack.slag}`);
    } else {
      router.push(`/${locale}/onboarding`);
    }
    console.log('Selected package:', pack);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {PACKAGES.map((pkg, idx) => (
        <PackageItem 
          key={pkg.uuid}
          packageItem={pkg}
          index={idx}
          onClick={() => handleClickPackage(pkg)}
        />
      ))}
    </div>
  );
}