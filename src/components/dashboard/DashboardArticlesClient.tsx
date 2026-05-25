'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';
import { ArticlesTable } from '@/components/dashboard/ArticlesTable';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ROUTES } from '@/lib/constants';
import api from '@/lib/api-client';
import { cn } from '@/lib/cn';

type Tab = 'all' | 'published' | 'draft';

export function DashboardArticlesClient() {
  const [tab, setTab] = useState<Tab>('all');
  const { articles, isLoading, mutate } = useArticles();

  async function handleDelete(id: string) {
    await api.articles.delete(id);
    mutate();
  }

  const filtered = articles?.filter((a) => {
    if (tab === 'published') return a.status === 'published';
    if (tab === 'draft') return a.status === 'draft';
    return true;
  }) ?? [];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all',       label: 'Tous'        },
    { key: 'published', label: 'Publiés'     },
    { key: 'draft',     label: 'Brouillons'  },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Mes articles</h1>
        <Link href={ROUTES.DASHBOARD_NEW_ARTICLE} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} />
          Nouvel article
        </Link>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === t.key
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <ArticlesTable articles={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
}
