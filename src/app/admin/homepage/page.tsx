import { HomepageBuilder } from '@/components/admin/HomepageBuilder';

export const metadata = { title: 'Homepage — Admin' };

export default function AdminHomepagePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configuration homepage</h1>
      <HomepageBuilder />
    </div>
  );
}
