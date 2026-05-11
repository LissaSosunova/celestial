import { PackagesList } from '@/components/PackagesList';
import { Topics } from '@/components/TopicsRight';

export function AuthenticatedContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-5">
      <div className="lg:col-span-8 space-y-12">
        <PackagesList />
      </div>
      <Topics />
    </div>
  );
}