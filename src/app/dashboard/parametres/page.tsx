'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';
import { Save, Key } from 'lucide-react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';

export default function DashboardSettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [website, setWebsite] = useState(user?.website ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.users.updateProfile({ displayName, bio: bio || null, website: website || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Paramètres du compte</h1>

      <div className="card p-6 space-y-6">
        <h2 className="font-semibold text-[var(--text-primary)]">Avatar</h2>
        <AvatarUpload />
      </div>

      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-[var(--text-primary)]">Profil</h2>
        {[
          { label: 'Nom affiché', id: 'displayName', value: displayName, onChange: setDisplayName },
          { label: 'Site web', id: 'website', value: website, onChange: setWebsite, type: 'url' },
        ].map((f) => (
          <div key={f.id} className="space-y-1.5">
            <label htmlFor={f.id} className="text-sm font-medium text-[var(--text-secondary)]">{f.label}</label>
            <input id={f.id} type={f.type ?? 'text'} value={f.value} onChange={(e) => f.onChange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
          </div>
        ))}
        <div className="space-y-1.5">
          <label htmlFor="bio" className="text-sm font-medium text-[var(--text-secondary)]">Bio</label>
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none" />
        </div>
        {error && <p className="text-sm text-[var(--error)]">{error}</p>}
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Save size={16} />
          {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}
