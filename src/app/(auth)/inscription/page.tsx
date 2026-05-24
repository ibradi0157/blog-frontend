import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Créer un compte',
  description: 'Rejoignez notre communauté de lecteurs et d\'auteurs.',
};

export default function InscriptionPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Créer un compte</h1>
        <p className="text-sm text-[var(--text-muted)]">Rejoignez notre communauté</p>
      </div>
      <RegisterForm />
    </div>
  );
}
