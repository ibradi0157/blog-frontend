import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';

export const metadata: Metadata = {
  title: 'Vérification e-mail',
  description: 'Vérifiez votre adresse e-mail pour activer votre compte.',
};

export default function VerificationEmailPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Vérifiez votre e-mail</h1>
        <p className="text-sm text-[var(--text-muted)]">Saisissez le code à 6 chiffres reçu</p>
      </div>
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
