'use client';

import { PackageItem } from '@/components/shared/Package';
import { PACKAGES, type Package } from '@/lib/types/package';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface PackagesListCuttedProps {
    pkgSlug: string;
}

export function PackagesListCutted({pkgSlug}: PackagesListCuttedProps) {
  const { profile } = useUserProfile();
  const packs = PACKAGES.filter(p => p.slug !== pkgSlug)
  const router = useRouter();
  const locale = useLocale();
  const handleClickPackage = (pack: Package) => {
    const hasProfile = !!(profile);
    if (hasProfile) {
      router.push(`/${locale}/product/${pack.slug}`);
    } else {
      router.push(`/${locale}/onboarding`);
    }
    console.log('Selected package:', pack);
  };

  return (
    <div className="flex flex-col gap-4">
      {packs.map((pkg, idx) => (
        <PackageItem 
          key={pkg.uuid}
          packageItem={pkg}
          index={idx}
          isCutted={true}
          onClick={() => handleClickPackage(pkg)}
        />
      ))}
    </div>
  );
}