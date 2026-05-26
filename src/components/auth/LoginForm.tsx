'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  global?: string;
}

export function LoginForm() {
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Validation ---
  function validate(data: LoginFormData): LoginFormErrors {
    const errs: LoginFormErrors = {};
    if (!data.email.trim()) {
      errs.email = 'L\'adresse e-mail est requise.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Adresse e-mail invalide.';
    }
    if (!data.password) {
      errs.password = 'Le mot de passe est requis.';
    }
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      await login(response);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Identifiants incorrects. Veuillez réessayer.';
      setErrors({ global: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Global error */}
      {errors.global && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)] animate-fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.global}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="vous@exemple.com"
          className={cn(
            'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
            'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
            errors.email
              ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
          )}
        />
        {errors.email && (
          <p className="text-xs text-[var(--error)]">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
            Mot de passe
          </label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="••••••••"
            className={cn(
              'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
              'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
              errors.password
                ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20'
                : 'border-[var(--border)] hover:border-[var(--border-hover)]',
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-[var(--error)]">{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Connexion…' : 'Se connecter'}
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-[var(--text-muted)]">
        Pas encore de compte ?{' '}
        <Link href={ROUTES.REGISTER} className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
