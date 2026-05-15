'use client';

import { PackageItem } from '@/components/ui/Package';
import { PACKAGES, type Package } from '@/lib/types/package';

export function PackagesList() {
  const handleClickPackage = (pack: Package) => {
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