'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api-client';
import { cn } from '@/lib/cn';

export function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse e-mail invalide.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.newsletter.subscribe({ email: email.trim().toLowerCase() });
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Inscription impossible. Réessayez.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <div className="card relative overflow-hidden p-8 text-center md:p-12">
          {/* Background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl"
          />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-muted)]">
              <Mail className="h-7 w-7 text-[var(--accent)]" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
              Restez informé
            </h2>
            <p className="mb-8 text-sm text-[var(--text-secondary)]">
              Recevez les meilleurs articles directement dans votre boîte mail, chaque semaine.
            </p>

            {isSuccess ? (
              <div className="flex items-center justify-center gap-2 text-[var(--success)]">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Vous êtes inscrit ! Merci.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:max-w-md sm:mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                    placeholder="vous@exemple.com"
                    aria-label="Adresse e-mail newsletter"
                    className={cn(
                      'w-full rounded-lg border bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
                      'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
                      error ? 'border-[var(--error)]' : 'border-[var(--border)]',
                    )}
                  />
                  {error && <p className="mt-1 text-xs text-[var(--error)] text-left">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary shrink-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Inscription…' : "S'abonner"}
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Pas de spam. Désabonnement en un clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}