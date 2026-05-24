'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, BarChart2, Eye, Globe, FileText, MoreHorizontal } from 'lucide-react';
import { ArticleSummary } from '@/types/api';
import { formatDate, formatCount } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

interface ArticlesTableProps {
  articles: ArticleSummary[];
  onDelete: (id: string) => Promise<void>;
  onPublish?: (id: string) => Promise<void>;
}

export function ArticlesTable({ articles, onDelete, onPublish }: ArticlesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article définitivement ?')) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (!articles.length) {
    return (
      <div className="card p-12 text-center">
        <FileText className="mx-auto mb-3 text-[var(--text-muted)]" size={36} />
        <p className="text-[var(--text-secondary)]">Aucun article pour l'instant.</p>
        <Link href={ROUTES.DASHBOARD_NEW_ARTICLE} className="btn-primary mt-4 inline-block px-4 py-2 text-sm">
          Écrire mon premier article
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="px-4 py-3 text-[var(--text-secondary)] font-medium">Titre</th>
              <th className="px-4 py-3 text-[var(--text-secondary)] font-medium hidden md:table-cell">Statut</th>
              <th className="px-4 py-3 text-[var(--text-secondary)] font-medium hidden lg:table-cell">Vues</th>
              <th className="px-4 py-3 text-[var(--text-secondary)] font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-[var(--text-secondary)] font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={ROUTES.DASHBOARD + `/articles/${article.id}`}
                    className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors line-clamp-1"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <StatusBadge status={article.status} />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Eye size={13} />
                    {formatCount(article.viewsCount ?? 0)}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-muted)]">
                  {formatDate(article.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={ROUTES.DASHBOARD + `/articles/${article.id}/stats`}
                      className="p-1.5 rounded hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                      title="Statistiques"
                    >
                      <BarChart2 size={15} />
                    </Link>
                    <Link
                      href={ROUTES.DASHBOARD + `/articles/${article.id}`}
                      className="p-1.5 rounded hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="p-1.5 rounded hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    published: { label: 'Publié', className: 'bg-green-500/10 text-[var(--success)]' },
    draft: { label: 'Brouillon', className: 'bg-[var(--accent-muted)] text-[var(--accent)]' },
    archived: { label: 'Archivé', className: 'bg-[var(--bg-hover)] text-[var(--text-muted)]' },
  };
  const { label, className } = map[status] ?? map.draft;
  return (
    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', className)}>
      {label}
    </span>
  );
}

export function DraftsList({ articles, onDelete }: Omit<ArticlesTableProps, 'onPublish'>) {
  const drafts = articles.filter((a) => a.status === 'draft');
  return <ArticlesTable articles={drafts} onDelete={onDelete} />;
}

export function PublishedList({ articles, onDelete }: Omit<ArticlesTableProps, 'onPublish'>) {
  const published = articles.filter((a) => a.status === 'published');
  return <ArticlesTable articles={published} onDelete={onDelete} />;
}