'use client';
import { use } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { Eye, Heart, MessageSquare } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }

export default function ArticleStatsPage({ params }: Props) {
  const { id } = use(params);
  const { data } = useSWR(`/articles/${id}/stats`, () => apiClient.articleStats.getArticleStats(id));
  const stats = (data as any) ?? {};

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Statistiques de l'article</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vues', value: stats.viewsCount ?? 0, icon: <Eye size={18} /> },
          { label: 'Likes', value: stats.likesCount ?? 0, icon: <Heart size={18} /> },
          { label: 'Commentaires', value: stats.commentsCount ?? 0, icon: <MessageSquare size={18} /> },
        ].map((s) => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">{s.icon}</div>
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
