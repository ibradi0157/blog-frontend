import { NewsletterManager } from '@/components/admin/NewsletterManager';

export const metadata = { title: 'Newsletter — Admin' };

export default function AdminNewsletterPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Newsletter</h1>
      <NewsletterManager />
    </div>
  );
}
