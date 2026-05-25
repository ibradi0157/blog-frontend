'use client';

import { useState } from 'react';
import { Trash2, Flag } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { formatDate } from '@/lib/utils';
import type { Comment } from '@/types/api';

export function CommentsTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    `/comments?page=${page}&limit=20`,
    () => apiClient.comments.getAll?.({ page, limit: 20 }) ?? Promise.resolve({ data: [], total: 0 })
  );

  const comments: Comment[] = (data as any)?.data ?? [];
  const total: number = (data as any)?.total ?? 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    await apiClient.comments.delete(id);
    await mutate();
  };

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {['Auteur', 'Commentaire', 'Article', 'Date', 'Actions'].map((h) => (
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
                : comments.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <UserAvatar user={c.author as any} size="xs" />
                          <span className="text-xs text-[var(--text-primary)]">{c.author.displayName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-[var(--text-primary)] text-xs line-clamp-2">{c.content}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{c.articleId ?? '—'}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{total} commentaire{total > 1 ? 's' : ''}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Précédent</button>
          <button onClick={() => setPage((p) => p+1)} disabled={comments.length < 20} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Suivant</button>
        </div>
      </div>
    </div>
  );
}
