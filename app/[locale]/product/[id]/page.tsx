import { PACKAGES, type Package } from '@/lib/types/package';
import { useTranslations } from 'next-intl';
import { type PackageProps } from '@/lib/types/package';
import { notFound } from 'next/navigation';
import { PackageFormContainer } from '@/components/buyPackage/PackageFormContainer';
import { Topics } from '@/components/shared/TopicsRight';
import { PackagesList } from '@/components/shared/PackagesList';

export default function ProductPage({
  params
}: {
  params: {
    locale: string;
    id: string;
  }
}) {

  const id = params?.id || '';

  const t = useTranslations('packages');

  const packageItem = PACKAGES.find((p) => { return p.slug === id })

  if (!packageItem) {
    notFound();
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="flex-1 px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl font-bold mb-6">{packageItem.name}</h1>
            <PackageFormContainer packageItem={packageItem} />
          </div>
          <div className="lg:col-span-4 space-y-4">
            
            <Topics />
          </div>

        </div>
      </div>
      {/* <PackagesList /> */}
    </main>
  );
}