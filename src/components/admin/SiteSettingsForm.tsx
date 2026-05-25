'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Mon Blog',
  siteDescription: '',
  siteUrl: '',
  contactEmail: '',
  allowRegistration: true,
  requireEmailVerification: true,
  maintenanceMode: false,
};

export function SiteSettingsForm() {
  const { data, mutate } = useSWR('/site-settings/admin', () =>
    apiClient.siteSettings.getAdmin().catch(() => DEFAULT_SETTINGS)
  );

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) setSettings({ ...DEFAULT_SETTINGS, ...(data as any) });
  }, [data]);

  const set = (key: keyof SiteSettings, value: string | boolean) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.siteSettings.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await mutate();
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      <input
        id={id}
        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        {...props}
      />
    </div>
  );

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </label>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-[var(--text-primary)]">Informations générales</h3>
        <Field label="Nom du site" id="siteName" value={settings.siteName} onChange={(e) => set('siteName', e.target.value)} />
        <Field label="Description" id="siteDesc" value={settings.siteDescription} onChange={(e) => set('siteDescription', e.target.value)} />
        <Field label="URL du site" id="siteUrl" type="url" value={settings.siteUrl} onChange={(e) => set('siteUrl', e.target.value)} />
        <Field label="Email de contact" id="contactEmail" type="email" value={settings.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
      </div>

      <div className="card p-5 space-y-2">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">Paramètres d'accès</h3>
        <Toggle label="Autoriser les inscriptions" checked={settings.allowRegistration} onChange={(v) => set('allowRegistration', v)} />
        <div className="h-px bg-[var(--border)]" />
        <Toggle label="Vérification email obligatoire" checked={settings.requireEmailVerification} onChange={(v) => set('requireEmailVerification', v)} />
        <div className="h-px bg-[var(--border)]" />
        <Toggle label="Mode maintenance" checked={settings.maintenanceMode} onChange={(v) => set('maintenanceMode', v)} />
      </div>

      {error && <p className="text-sm text-[var(--error)]">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde…' : 'Sauvegarder les paramètres'}
      </button>
    </div>
  );
}
