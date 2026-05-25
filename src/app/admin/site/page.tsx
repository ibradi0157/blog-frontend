import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm';

export const metadata = { title: 'Paramètres site — Admin' };

export default function AdminSitePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Paramètres du site</h1>
      <SiteSettingsForm />
    </div>
  );
}
