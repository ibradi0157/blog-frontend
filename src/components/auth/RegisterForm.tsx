'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  global?: string;
}

const PASSWORD_RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /\d/.test(p) },
];

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  function validate(data: RegisterFormData): RegisterFormErrors {
    const errs: RegisterFormErrors = {};

    if (!data.username.trim()) {
      errs.username = 'Le nom d\'utilisateur est requis.';
    } else if (data.username.trim().length < 3) {
      errs.username = 'Minimum 3 caractères.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username.trim())) {
      errs.username = 'Lettres, chiffres, _ et - uniquement.';
    }

    if (!data.email.trim()) {
      errs.email = 'L\'adresse e-mail est requise.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Adresse e-mail invalide.';
    }

    if (!data.password) {
      errs.password = 'Le mot de passe est requis.';
    } else if (data.password.length < 8) {
      errs.password = 'Minimum 8 caractères.';
    }

    if (!data.confirmPassword) {
      errs.confirmPassword = 'Confirmez votre mot de passe.';
    } else if (data.password !== data.confirmPassword) {
      errs.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormErrors]) {
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
      const response = await authApi.register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        displayName: formData.username.trim(),
      });
      login(response);
      router.push(ROUTES.HOME);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Inscription impossible. Veuillez réessayer.';
      setErrors({ global: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.global && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)] animate-fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.global}</span>
        </div>
      )}

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)]">
          Nom d'utilisateur
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="jean_dupont"
          className={cn(
            'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
            'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
            errors.username
              ? 'border-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
          )}
        />
        {errors.username && <p className="text-xs text-[var(--error)]">{errors.username}</p>}
      </div>

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
              ? 'border-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
          )}
        />
        {errors.email && <p className="text-xs text-[var(--error)]">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setShowPasswordHints(true)}
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
            aria-label={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-[var(--error)]">{errors.password}</p>}

        {/* Password strength hints */}
        {showPasswordHints && formData.password.length > 0 && (
          <ul className="mt-2 space-y-1">
            {PASSWORD_RULES.map(rule => {
              const ok = rule.test(formData.password);
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
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="••••••••"
          className={cn(
            'w-full rounded-lg border bg-[var(--bg-hover)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors',
            'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
            errors.confirmPassword
              ? 'border-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
          )}
        />
        {errors.confirmPassword && <p className="text-xs text-[var(--error)]">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Création du compte…' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Déjà un compte ?{' '}
        <Link href={ROUTES.LOGIN} className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
