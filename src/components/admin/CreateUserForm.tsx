'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';

const PASSWORD_RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Une minuscule', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /\d/.test(p) },
  { label: 'Un caractère spécial', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function CreateUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordOk = PASSWORD_RULES.every((r) => r.test(password));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !displayName.trim()) {
      setError('Email et nom affiché sont requis.');
      return;
    }
    if (!passwordOk) {
      setError('Le mot de passe ne respecte pas les critères de sécurité.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.users.create({
        email: email.trim(),
        displayName: displayName.trim(),
        password,
        confirmPassword,
      });
      const created = (res as { data?: { id?: string } })?.data ?? res;
      const id = (created as { id?: string })?.id;
      router.push(id ? ROUTES.ADMIN_USER(id) : ROUTES.ADMIN_USERS);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossible de créer le membre.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-hover)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        Crée un compte <strong>Membre</strong> avec mot de passe défini par l&apos;admin. Pour
        promouvoir en admin secondaire, utilisez la fiche utilisateur (PRIMARY_ADMIN).
      </p>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Nom affiché</label>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputCls} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Mot de passe</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
        <ul className="mt-2 space-y-1">
          {PASSWORD_RULES.map((r) => (
            <li key={r.label} className={`text-xs ${r.test(password) ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
              {r.label}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirmer</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} required />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-[var(--error)]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer le membre
        </button>
        <Link href={ROUTES.ADMIN_USERS} className="btn-secondary">
          Annuler
        </Link>
      </div>
    </form>
  );
}
