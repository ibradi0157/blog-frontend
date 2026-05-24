'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

const PASSWORD_RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /\d/.test(p) },
];

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenId = searchParams.get('tokenId') ?? '';
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; global?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!password) {
      newErrors.password = 'Le mot de passe est requis.';
    } else if (password.length < 8) {
      newErrors.password = 'Minimum 8 caractères.';
    }
    if (!confirmPassword) {
      newErrors.confirm = 'Confirmez le mot de passe.';
    } else if (password !== confirmPassword) {
      newErrors.confirm = 'Les mots de passe ne correspondent pas.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Invalid link state
  if (!tokenId || !token) {
    return (
      <div className="space-y-4 text-center animate-fade-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--error)]/10">
          <AlertCircle className="h-7 w-7 text-[var(--error)]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-[var(--text-primary)]">Lien invalide</h3>
          <p className="text-sm text-[var(--text-muted)]">Ce lien de réinitialisation est invalide ou a expiré.</p>
        </div>
        <Link href={ROUTES.FORGOT_PASSWORD} className="btn-primary inline-block text-sm">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10">
          <ShieldCheck className="h-8 w-8 text-[var(--success)]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Mot de passe mis à jour</h3>
          <p className="text-sm text-[var(--text-muted)]">Votre mot de passe a été réinitialisé avec succès.</p>
        </div>
        <Link href={ROUTES.LOGIN} className="btn-primary inline-block text-sm">
          Se connecter
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await authApi.resetPassword({ tokenId, token, newPassword: password, confirmPassword: password });
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Impossible de réinitialiser le mot de passe.';
      setErrors({ global: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.global && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.global}</span>
        </div>
      )}

      {/* New password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
            }}
            disabled={isLoading}
            placeholder="••••••••"
            className={cn(
              'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
              'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
              errors.password
                ? 'border-[var(--error)]'
                : 'border-[var(--border)] hover:border-[var(--border-hover)]',
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-[var(--error)]">{errors.password}</p>}

        {/* Strength hints */}
        {password.length > 0 && (
          <ul className="mt-2 space-y-1">
            {PASSWORD_RULES.map(rule => {
              const ok = rule.test(password);
              return (
                <li key={rule.label} className={cn('flex items-center gap-1.5 text-xs transition-colors', ok ? 'text-[var(--success)]' : 'text-[var(--text-muted)]')}>
                  <Check className={cn('h-3 w-3', ok ? 'opacity-100' : 'opacity-30')} />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)]">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
            if (errors.confirm) setErrors(prev => ({ ...prev, confirm: undefined }));
          }}
          disabled={isLoading}
          placeholder="••••••••"
          className={cn(
            'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
            'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
            errors.confirm
              ? 'border-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
          )}
        />
        {errors.confirm && <p className="text-xs text-[var(--error)]">{errors.confirm}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
      </button>
    </form>
  );
}
