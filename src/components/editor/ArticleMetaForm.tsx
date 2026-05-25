'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useCategories } from '@/hooks/useCategories';
import { EditorCoverUpload } from './EditorCoverUpload';

export interface ArticleMeta {
  title: string;
  excerpt: string;
  categoryId: string;
  tags: string[];
  coverUrl: string | null;
}

interface ArticleMetaFormProps {
  articleId: string;
  meta: ArticleMeta;
  onChange: (meta: Partial<ArticleMeta>) => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onArchive?: () => void;
  isPublished?: boolean;
  isSubmitting?: boolean;
}

export function ArticleMetaForm({
  articleId,
  meta,
  onChange,
  onPublish,
  onUnpublish,
  onArchive,
  isPublished,
  isSubmitting,
}: ArticleMetaFormProps) {
  const { categories } = useCategories();
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !meta.tags.includes(tag) && meta.tags.length < 10) {
      onChange({ tags: [...meta.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => onChange({ tags: meta.tags.filter((t) => t !== tag) });

  return (
    <div className="space-y-5">
      <EditorCoverUpload
        articleId={articleId}
        currentCoverUrl={meta.coverUrl}
        onCoverChange={(url) => onChange({ coverUrl: url })}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Excerpt</label>
        <textarea
          value={meta.excerpt}
          onChange={(e) => onChange({ excerpt: e.target.value })}
          rows={3}
          placeholder="Courte description de l'article…"
          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Catégorie</label>
        <select
          value={meta.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag…"
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
          <button onClick={addTag} type="button" className="btn-ghost px-3 py-2 text-sm">
            <Tag size={14} />
          </button>
        </div>
        {meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {meta.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                #{tag}
                <button onClick={() => removeTag(tag)} className="text-[var(--accent)] hover:text-[var(--error)] transition-colors"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[var(--border)] space-y-2">
        {!isPublished ? (
          <button
            onClick={onPublish}
            disabled={isSubmitting}
            className="w-full btn-primary py-2.5 text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Publication…' : 'Publier l\'article'}
          </button>
        ) : (
          <button
            onClick={onUnpublish}
            disabled={isSubmitting}
            className="w-full py-2.5 text-sm border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
          >
            Dépublier
          </button>
        )}
        <button
          onClick={onArchive}
          disabled={isSubmitting}
          className="w-full py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--error)] transition-colors text-xs"
        >
          Archiver l'article
        </button>
      </div>
    </div>
  );
}
