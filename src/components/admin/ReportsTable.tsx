'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { extractPagination } from '@/lib/pagination';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { CommentReport } from '@/types/api';

export function ReportsTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    `/comments/reports?page=${page}&limit=20`,
    () => apiClient.comments.getReports({ page, limit: 20 })
  );

  const reports: CommentReport[] = (data as any)?.data ?? [];
  const { total } = extractPagination(data);

  const handleResolve = async (id: string, action: 'resolve' | 'dismiss') => {
    await (apiClient.comments as any).resolveReport?.(id, action);
    await mutate();
  };

  const statusVariant = (s: string) => s === 'RESOLVED' ? 'success' : s === 'DISMISSED' ? 'outline' : 'warning';

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {['Commentaire signalé', 'Raison', 'Signalé par', 'Statut', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{[1,2,3,4,5,6].map((j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-24" /></td>
                    ))}</tr>
                  ))
                : reports.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-xs text-[var(--text-primary)] line-clamp-2">{r.comment.content}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{r.reason}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{r.reportedBy.displayName}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(r.status)} size="sm">{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        {r.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleResolve(r.id, 'resolve')} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success)]/10 transition-colors" title="Résoudre">
                              <CheckCircle size={15} />
                            </button>
                            <button onClick={() => handleResolve(r.id, 'dismiss')} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors" title="Rejeter">
                              <XCircle size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{total} signalement{total > 1 ? 's' : ''}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Précédent</button>
          <button onClick={() => setPage((p) => p+1)} disabled={reports.length < 20} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Suivant</button>
        </div>
      </div>
    </div>
  );
}
