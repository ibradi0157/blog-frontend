'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { Eye, Heart, MessageSquare } from 'lucide-react';

export interface ArticleStatsClientProps {
  articleId: string;
}

export function ArticleStatsClient({ articleId }: ArticleStatsClientProps) {
  const { data, isLoading } = useSWR(
    `/articles/${articleId}/stats`,
    () => apiClient.articleStats.getArticleStats(articleId)
  );
  const stats = (data as any) ?? {};

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-[var(--bg-hover)] rounded-2xl" />)}
        </div>
        <div className="h-64 bg-[var(--bg-hover)] rounded-2xl" />
      </div>
    );
  }

  const statItems = [
    { label: 'Vues',         value: stats.viewsCount    ?? 0, icon: <Eye           size={18} /> },
    { label: 'Likes',        value: stats.likesCount    ?? 0, icon: <Heart         size={18} /> },
    { label: 'Commentaires', value: stats.commentsCount ?? 0, icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {statItems.map((s) => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{s.value.toLocaleString('fr-FR')}</p>
              <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Évolution des vues</h3>
        <AnalyticsChart period="30d" height={240} />
      </div>
    </div>
  );
}
