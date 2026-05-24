'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, MailCheck, RefreshCw } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

const CODE_LENGTH = 6;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const email = searchParams.get('email') ?? '';

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleDigitChange(index: number, value: string) {
    // Handle paste of full code
    if (value.length === CODE_LENGTH && /^\d+$/.test(value)) {
      const newDigits = value.split('');
      setDigits(newDigits);
      inputRefs.current[CODE_LENGTH - 1]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError('');

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < CODE_LENGTH) {
      setError('Veuillez saisir les 6 chiffres du code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authApi.verifyEmail({ email, code });
      router.push(ROUTES.HOME);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Code invalide ou expiré.';
      setError(message);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setResendSuccess(false);
    setError('');

    try {
      await authApi.requestEmailCode({ email });
      setResendSuccess(true);
      setResendCooldown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Impossible de renvoyer le code.';
      setError(message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Icon + description */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-muted)]">
          <MailCheck className="h-7 w-7 text-[var(--accent)]" />
        </div>
        {email && (
          <p className="text-sm text-[var(--text-muted)]">
            Code envoyé à <span className="font-medium text-[var(--text-secondary)]">{email}</span>
          </p>
        )}
      </div>

      {/* 6-digit inputs */}
      <div className="flex justify-center gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={CODE_LENGTH}
            value={digit}
            onChange={e => handleDigitChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={isLoading}
            aria-label={`Chiffre ${i + 1}`}
            className={cn(
              'h-12 w-12 rounded-lg border bg-[var(--bg-hover)] text-center text-lg font-semibold text-[var(--text-primary)] outline-none transition-all',
              'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30',
              error
                ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20'
                : 'border-[var(--border)] hover:border-[var(--border-hover)]',
              digit ? 'border-[var(--accent)]/50 bg-[var(--accent-muted)]' : '',
            )}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)] animate-fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resend success */}
      {resendSuccess && (
        <p className="text-center text-sm text-[var(--success)]">Code renvoyé avec succès.</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || digits.join('').length < CODE_LENGTH}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Vérification…' : 'Vérifier mon e-mail'}
      </button>

      {/* Resend */}
      <p className="text-center text-sm text-[var(--text-muted)]">
        Code non reçu ?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className={cn(
            'inline-flex items-center gap-1 font-medium transition-colors',
            resendCooldown > 0 || isResending
              ? 'cursor-not-allowed text-[var(--text-muted)]'
              : 'text-[var(--accent)] hover:text-[var(--accent-hover)]',
          )}
        >
          {isResending && <RefreshCw className="h-3 w-3 animate-spin" />}
          {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
        </button>
      </p>
    </form>
  );
}
