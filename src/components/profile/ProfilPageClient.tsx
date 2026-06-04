'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { SocialLinks } from '@/components/profile/SocialLinks';
import { apiClient } from '@/lib/api-client';
import { UpdateProfileDto } from '@/types/api';
import { cn } from '@/lib/cn';

export function ProfilPageClient() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<UpdateProfileDto>({
    displayName: user?.displayName ?? '',
    bio: user?.bio ?? '',
  });

  const update = (key: keyof UpdateProfileDto) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await apiClient.users.updateProfile({
        displayName: form.displayName,
        bio: form.bio,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Échec de la sauvegarde. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = cn(
    'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-hover)]',
    'px-3 py-2.5 text-sm text-[var(--text-primary)]',
    'placeholder:text-[var(--text-muted)]',
    'focus:border-[var(--accent)] focus:outline-none transition-colors'
  );

  return (
    <div className="space-y-8">
      <AvatarUpload className="items-start" />

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Nom affiché</label>
            <input value={form.displayName ?? ''} onChange={update('displayName')} placeholder="Votre nom" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Nom d'utilisateur</label>
            <input value={user?.username ?? ''} disabled className={cn(inputCls, 'opacity-50 cursor-not-allowed')} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Bio</label>
          <textarea
            value={form.bio ?? ''}
            onChange={update('bio')}
            placeholder="Parlez de vous en quelques mots…"
            rows={4}
            className={cn(inputCls, 'resize-none')}
          />
        </div>

        {error && <p className="text-sm text-[var(--error)]">{error}</p>}
        {success && <p className="text-sm text-[var(--success)]">Profil mis à jour !</p>}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary px-6 py-2 text-sm disabled:opacity-50">
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  );
}