import { PACKAGES, type Package } from '@/lib/types/package';
import { useTranslations } from 'next-intl';
import { type PackageProps } from '@/lib/types/package';
import { notFound } from 'next/navigation';
import { PackageFormContainer } from '@/components/buyPackage/PackageFormContainer';

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

  const packageItem = PACKAGES.find((p) => { return p.slag === id })

  if (!packageItem) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">{packageItem.name}</h1>
      <PackageFormContainer packageItem={packageItem} />
    </div>
  );
}