'use client';

import { PackageItem } from '@/components/ui/Package';
import { PACKAGES, type Package } from '@/lib/types/package';

export function PackagesList() {
  const handleClickPackage = (pack: Package) => {
    console.log('Selected package:', pack);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {PACKAGES.map((pkg, idx) => (
        <PackageItem 
          key={pkg.id}
          packageItem={pkg}
          index={idx}
          onClick={() => handleClickPackage(pkg)}
        />
      ))}
    </div>
  );
}