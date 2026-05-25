'use client';

import { useState } from 'react';
import { Search, Eye, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { ArticleSummary } from '@/types/api';

export function AdminArticlesTable() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const key = `/articles?page=${page}&limit=20${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`;
  const { data, isLoading, mutate } = useSWR(key, () =>
    apiClient.articles.getAll({ page, limit: 20, search: search || undefined })
  );

  const articles: ArticleSummary[] = (data as any)?.data ?? [];
  const total: number = (data as any)?.total ?? 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await apiClient.articles.delete(id);
    await mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un article…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none">
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {['Titre', 'Auteur', 'Statut', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{[1,2,3,4,5].map((j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-24" /></td>
                    ))}</tr>
                  ))
                : articles.map((a) => (
                    <tr key={a.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-[var(--text-primary)] truncate">{a.title}</p>
                        {a.category && <p className="text-xs text-[var(--text-muted)]">{a.category.name}</p>}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{a.author?.displayName ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={a.isPublished ? 'success' : 'warning'} size="sm">
                          {a.isPublished ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDate(a.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {a.slug && (
                            <Link href={`/articles/${a.slug}`} target="_blank" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors">
                              <Eye size={15} />
                            </Link>
                          )}
                          <Link href={`/dashboard/articles/${a.id}`} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors">
                            <Edit size={15} />
                          </Link>
                          <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{total} article{total > 1 ? 's' : ''}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Précédent</button>
          <button onClick={() => setPage((p) => p+1)} disabled={articles.length < 20} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Suivant</button>
        </div>
      </div>
    </div>
  );
}
