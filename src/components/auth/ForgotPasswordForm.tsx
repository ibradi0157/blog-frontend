'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, Send, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function validate(value: string): boolean {
    if (!value.trim()) {
      setEmailError('L\'adresse e-mail est requise.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Adresse e-mail invalide.');
      return false;
    }
    setEmailError('');
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(email)) return;

    setIsLoading(true);
    setGlobalError('');

    try {
      await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      setIsSent(true);
    } catch (err: unknown) {
      // Show generic message to avoid user enumeration
      setIsSent(true); // silently succeed even on error
    } finally {
      setIsLoading(false);
    }
  }

  if (isSent) {
    return (
      <div className="space-y-5 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10">
          <Send className="h-8 w-8 text-[var(--success)]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">E-mail envoyé</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Si un compte existe pour <span className="font-medium text-[var(--text-secondary)]">{email}</span>, vous recevrez un lien de réinitialisation dans quelques minutes.
          </p>
          <p className="text-xs text-[var(--text-muted)]">Pensez à vérifier vos spams.</p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {globalError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      <p className="text-sm text-[var(--text-muted)]">
        Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          disabled={isLoading}
          placeholder="vous@exemple.com"
          className={cn(
            'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
            'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
            emailError
              ? 'border-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
          )}
        />
        {emailError && <p className="text-xs text-[var(--error)]">{emailError}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Envoi…' : 'Envoyer le lien'}
      </button>

      <Link
        href={ROUTES.LOGIN}
        className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la connexion
      </Link>
    </form>
  );
}
