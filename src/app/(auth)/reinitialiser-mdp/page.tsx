import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe',
};

export default function ReinitialiserMdpPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Nouveau mot de passe</h1>
        <p className="text-sm text-[var(--text-muted)]">Choisissez un mot de passe sécurisé</p>
      </div>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
