import { LegalPagesManager } from '@/components/admin/LegalPagesManager';

export const metadata = { title: 'Pages légales — Admin' };

export default function AdminLegalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pages légales</h1>
        <p className="max-w-2xl text-sm text-[var(--text-muted)]">
          Modifiez les pages accessibles publiquement sous /legal/[slug]. Publiez chaque page
          lorsqu’elle est prête.
        </p>
      </div>
      <LegalPagesManager />
    </div>
  );
}
