import { PACKAGES, type Package } from '@/lib/types/package';
import { useTranslations } from 'next-intl';
import { type PackageProps } from '@/lib/types/package';

export default function ProductPage({
  params
}: {
  params: {
    locale: string;
    id: string;
  }
}) {
  // Логируем весь params для отладки
  console.log('Full params:', params);
  console.log('Params keys:', Object.keys(params));
  console.log('ID value:', params?.id);
  console.log('Locale value:', params?.locale);

  const id = params?.id || '';

  const t = useTranslations('packages');

  const packageItem = PACKAGES.find((p) => { return p.slag === id })

  return (
    <div>
      <h1>Pack Info:</h1>
      <div className="flex flex-row items-center gap-4 mb-8">
        <h3 className="text-lg font-serif text-dark">
          {t(`${packageItem?.slag}.name`)}
        </h3>
      </div>

      <div className="flex flex-col flex-1">
        <p className="text-sm text-text-muted leading-relaxed mb-8">
          {t(`${packageItem?.slag}.description`)}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-auto">
          {(!!packageItem && packageItem.isFreePart) && (
            <>
              <div>
                {t(`short`)}
              </div><div className="text-lg font-bold text-dark font-sans">
                ₴0
              </div>
            </>
          )}
          <div>
            {t(`full`)}
          </div>
          <div className="text-lg font-bold text-dark font-sans">
            ₴{packageItem?.price}
          </div>
        </div>
      </div>
    </div>
  );
}