'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, GripVertical } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

interface Section {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'hero', label: 'Hero / Bannière', enabled: true },
  { id: 'featured', label: 'Articles mis en avant', enabled: true },
  { id: 'trending', label: 'Tendances', enabled: true },
  { id: 'categories', label: 'Catégories', enabled: true },
  { id: 'authors', label: 'Auteurs', enabled: true },
  { id: 'newsletter', label: 'Newsletter', enabled: true },
];

export function HomepageBuilder() {
  const { data, mutate } = useSWR('/admin/homepage', () =>
    (apiClient as any).admin?.getHomepageConfig?.() ?? Promise.resolve({ sections: DEFAULT_SECTIONS })
  );

  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if ((data as any)?.sections) setSections((data as any).sections);
  }, [data]);

  const toggle = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await (apiClient as any).admin?.updateHomepageConfig?.({ sections });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await mutate();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)]">Sections de la homepage</h3>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Save size={15} />
            {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>

        <div className="space-y-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <GripVertical size={16} className="text-[var(--text-muted)] cursor-grab" />
              <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{section.label}</span>
              <button
                onClick={() => toggle(section.id)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  section.enabled
                    ? 'bg-[var(--success)]/10 text-[var(--success)]'
                    : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                }`}
              >
                {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                {section.enabled ? 'Visible' : 'Masqué'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
