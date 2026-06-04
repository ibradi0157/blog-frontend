'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import type { LegalPage, LegalPageSlug } from '@/types/api';
import { LEGAL_PAGE_LABELS, LEGAL_PAGE_SLUGS } from '@/lib/legal-pages';

function normalizePages(raw: unknown): LegalPage[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: LegalPage[] }).data)) {
    return (raw as { data: LegalPage[] }).data;
  }
  return [];
}

export function LegalPagesManager() {
  const { data, mutate, isLoading } = useSWR('admin-legal-pages', () =>
    apiClient.legal.getAll().then((res) => normalizePages(res)),
  );

  const [activeSlug, setActiveSlug] = useState<LegalPageSlug>('privacy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const pages = data ?? [];
  const current = pages.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (current) {
      setTitle(current.title ?? LEGAL_PAGE_LABELS[activeSlug]);
      setContent(current.content ?? '');
      setPublished(Boolean(current.published));
    } else {
      setTitle(LEGAL_PAGE_LABELS[activeSlug]);
      setContent('');
      setPublished(false);
    }
    setError('');
    setSaved(false);
  }, [activeSlug, current?.id, current?.updatedAt]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await apiClient.legal.update(activeSlug, {
        title: title.trim(),
        content,
      });
      if (current && published !== current.published) {
        await apiClient.legal.setPublished(activeSlug, published);
      } else if (!current && published) {
        await apiClient.legal.setPublished(activeSlug, true);
      }
      await mutate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Erreur lors de la sauvegarde. Vérifiez que vous êtes connecté en tant qu’admin.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async () => {
    const next = !published;
    setSaving(true);
    setError('');
    try {
      if (!current) {
        await apiClient.legal.update(activeSlug, {
          title: title.trim() || LEGAL_PAGE_LABELS[activeSlug],
          content: content || '<p></p>',
        });
      }
      await apiClient.legal.setPublished(activeSlug, next);
      setPublished(next);
      await mutate();
    } catch {
      setError('Impossible de modifier la publication. Enregistrez d’abord le contenu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {LEGAL_PAGE_SLUGS.map((slug) => {
          const page = pages.find((p) => p.slug === slug);
          const isActive = slug === activeSlug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => setActiveSlug(slug)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {LEGAL_PAGE_LABELS[slug]}
              {page?.published && (
                <span className="ml-1.5 text-xs opacity-80">• publié</span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement…
        </div>
      ) : (
        <div className="card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {LEGAL_PAGE_LABELS[activeSlug]}
            </h3>
            <button
              type="button"
              onClick={togglePublished}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50"
            >
              {published ? <Eye size={16} /> : <EyeOff size={16} />}
              {published ? 'Publiée' : 'Brouillon'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Contenu (HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder="<p>Contenu de la page…</p>"
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)]">{error}</p>
          )}
          {saved && (
            <p className="text-sm text-[var(--success)]">Page enregistrée.</p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      )}
    </div>
  );
}
