import { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ProfilPageClient } from '@/components/profile/ProfilPageClient';

export const metadata: Metadata = {
  title: 'Mon profil — Blog',
};

export default function ProfilPage() {
  return (
    <AuthGuard>
      <PageWrapper narrow>
        <div className="py-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Mon profil</h1>
          <ProfilPageClient />
        </div>
      </PageWrapper>
    </AuthGuard>
  );
}