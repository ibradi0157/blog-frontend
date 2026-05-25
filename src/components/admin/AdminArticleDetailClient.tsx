'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toaster';
import { formatDate } from '@/lib/utils';
import { Eye, Heart, MessageSquare, Calendar, Tag, CheckCircle, XCircle, Archive, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface AdminArticleDetailClientProps {
  articleId: string;
}

export function AdminArticleDetailClient({ articleId }: AdminArticleDetailClientProps) {
  const { toast } = useToast();
  const [acting, setActing] = useState(false);

  const { data, mutate, isLoading } = useSWR(
    `/articles/${articleId}`,
    () => apiClient.articles.getById(articleId)
  );

  const article = (data as any)?.data ?? (data as any);

  const handlePublish = async () => {
    setActing(true);
    try {
      await apiClient.articles.update(articleId, { isPublished: true } as any);
      await mutate();
      toast('Article publié.', 'success');
    } catch { toast('Erreur.', 'error'); }
    finally { setActing(false); }
  };

  const handleUnpublish = async () => {
    setActing(true);
    try {
      await apiClient.articles.update(articleId, { isPublished: false } as any);
      await mutate();
      toast('Article dépublié.', 'success');
    } catch { toast('Erreur.', 'error'); }
    finally { setActing(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer définitivement cet article ?')) return;
    setActing(true);
    try {
      await apiClient.articles.delete(articleId);
      toast('Article supprimé.', 'success');
      window.history.back();
    } catch { toast('Erreur.', 'error'); }
    finally { setActing(false); }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-16 bg-[var(--bg-hover)] rounded-2xl" />
        <div className="h-48 bg-[var(--bg-hover)] rounded-2xl" />
      </div>
    );
  }

  if (!article) {
    return <p className="text-[var(--text-muted)]">Article introuvable.</p>;
  }

  const isPublished = article.status === 'published' || article.isPublished;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] truncate">{article.title}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Par {article.author?.displayName ?? '—'} · {formatDate(article.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isPublished
              ? 'bg-[var(--success)]/10 text-[var(--success)]'
              : 'bg-[var(--warning)]/10 text-[var(--warning)]'
          }`}>
            {isPublished ? 'Publié' : 'Brouillon'}
          </span>
          {article.slug && (
            <Link
              href={`/articles/${article.slug}`}
              target="_blank"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Actions modération */}
      <div className="card p-4 flex flex-wrap gap-3">
        <h2 className="w-full text-sm font-semibold text-[var(--text-primary)] mb-1">Actions de modération</h2>
        {!isPublished ? (
          <button
            onClick={handlePublish}
            disabled={acting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={14} />
            Publier
          </button>
        ) : (
          <button
            onClick={handleUnpublish}
            disabled={acting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20 transition-colors disabled:opacity-50"
          >
            <XCircle size={14} />
            Dépublier
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={acting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors disabled:opacity-50"
        >
          <Archive size={14} />
          Supprimer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Eye,           label: 'Vues',        value: article.viewsCount    ?? 0 },
          { icon: Heart,         label: 'Likes',       value: article.likesCount    ?? 0 },
          { icon: MessageSquare, label: 'Commentaires', value: article.commentsCount ?? 0 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5 text-center">
            <Icon size={20} className="mx-auto mb-2 text-[var(--accent)]" />
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value.toLocaleString('fr-FR')}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Métadonnées */}
      <div className="card p-6 space-y-3">
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Métadonnées</h2>
        {article.excerpt && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {article.category && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
              <Tag size={10} />
              {article.category.name}
            </span>
          )}
          {article.tags?.map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)]">
              #{tag}
            </span>
          ))}
        </div>
        {article.publishedAt && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2">
            <Calendar size={12} />
            Publié le {formatDate(article.publishedAt)}
          </div>
        )}
      </div>
    </div>
  );
}
