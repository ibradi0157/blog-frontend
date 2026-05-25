'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, RotateCcw } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

interface Version {
  id: string;
  createdAt: string;
  contentLength?: number;
}

interface ArticleVersionHistoryProps {
  articleId: string;
  onRestore?: (versionId: string) => void;
}

export function ArticleVersionHistory({ articleId, onRestore }: ArticleVersionHistoryProps) {
  const { data, isLoading } = useSWR<Version[]>(
    articleId ? `/articles/${articleId}/versions` : null,
    () => (apiClient.articles as any).getVersions?.(articleId) ?? Promise.resolve([]),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-[var(--bg-hover)] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const versions = data ?? [];

  if (versions.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] text-center py-4">Aucun historique disponible</p>
    );
  }

  return (
    <div className="space-y-2">
      {versions.map((v, i) => (
        <div key={v.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group">
          <div className="flex items-center gap-2.5 text-sm">
            <Clock size={14} className="text-[var(--text-muted)]" />
            <div>
              <p className="text-[var(--text-primary)] text-xs font-medium">
                {i === 0 ? 'Version actuelle' : `Version ${versions.length - i}`}
              </p>
              <p className="text-[var(--text-muted)] text-[11px]">
                {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true, locale: fr })}
              </p>
            </div>
          </div>
          {i > 0 && onRestore && (
            <button
              onClick={() => onRestore(v.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
              title="Restaurer"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
