'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Trash2 } from 'lucide-react';
import type { Comment } from '@/types/api';

export function DashboardCommentsClient() {
  const { data, mutate } = useSWR('/comments/my', () =>
    (apiClient.comments as any).getMine?.() ?? Promise.resolve({ data: [], total: 0 })
  );
  const comments: Comment[] = (data as any)?.data ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    await apiClient.comments.delete(id);
    await mutate();
  };

  if (comments.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center gap-3 text-center">
        <MessageSquare size={40} className="text-[var(--text-muted)]" />
        <p className="text-[var(--text-muted)]">Aucun commentaire pour l'instant</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="card p-4 flex items-start gap-3">
          <MessageSquare size={16} className="text-[var(--text-muted)] mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--text-primary)] line-clamp-2">{c.content}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(c.createdAt)}</p>
          </div>
          <button
            onClick={() => handleDelete(c.id)}
            className="shrink-0 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
