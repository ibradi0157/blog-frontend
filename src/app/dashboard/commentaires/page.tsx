'use client';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Trash2 } from 'lucide-react';
import type { Comment } from '@/types/api';

export default function DashboardCommentsPage() {
  const { data, mutate } = useSWR('/comments/my', () =>
    (apiClient.comments as any).getMine?.() ?? Promise.resolve({ data: [], total: 0 })
  );
  const comments: Comment[] = (data as any)?.data ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    await apiClient.comments.delete(id);
    await mutate();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Commentaires reçus</h1>
      {comments.length === 0 ? (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <MessageSquare size={40} className="text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)]">Aucun commentaire pour l'instant</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="card p-4 flex items-start gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{c.author.displayName}</span>
                  <span className="text-xs text-[var(--text-muted)]">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{c.content}</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
