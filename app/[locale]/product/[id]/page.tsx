import { PACKAGES, type Package } from '@/lib/types/package';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { ProductPageWrapper } from '@/components/buyPackage/ProductPageWrapper';

export default async function ProductPage({
  params
}: {
  params: {
    locale: string;
    id: string;
  }
}) {
  const id = params?.id || '';
  const packageItem = PACKAGES.find((p) => p.slug === id);

  if (!packageItem) {
    notFound();
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="flex-1 px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
        <ProductPageWrapper 
          packageItem={packageItem} 
          locale={params.locale}
        />
      </div>
    </main>
  );
}