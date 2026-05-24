import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte.',
};

export default function ConnexionPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Bienvenue</h1>
        <p className="text-sm text-[var(--text-muted)]">Connectez-vous pour accéder à votre espace</p>
      </div>
      <LoginForm />
    </div>
  );
}
