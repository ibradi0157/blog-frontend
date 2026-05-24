'use client';

import { MessageSquare, Heart, Users, Eye } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { NotificationType } from '@/types/api';

interface ActivityItem {
  id: string;
  type: NotificationType;
  title: string;
  createdAt: string;
  link?: string;
}

const iconMap: Record<NotificationType, { icon: typeof Heart; color: string }> = {
  LIKE_ARTICLE: { icon: Heart, color: 'text-red-400' },
  LIKE_COMMENT: { icon: Heart, color: 'text-red-400' },
  COMMENT: { icon: MessageSquare, color: 'text-[var(--accent)]' },
  FOLLOW: { icon: Users, color: 'text-[var(--success)]' },
  NEW_ARTICLE: { icon: Eye, color: 'text-[var(--warning)]' },
  NEWSLETTER: { icon: Eye, color: 'text-[var(--warning)]' },
};

interface RecentActivityProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

export function RecentActivity({ items, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Activité récente
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-[var(--bg-hover)] shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-3/4 rounded bg-[var(--bg-hover)]" />
                <div className="h-3 w-1/4 rounded bg-[var(--bg-hover)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Activité récente
        </h2>
        <p className="text-[var(--text-muted)] text-sm text-center py-8">
          Aucune activité récente.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Activité récente</h2>
      <ul className="space-y-3">
        {items.map((item) => {
          const meta = iconMap[item.type];
          const Icon = meta?.icon ?? Eye;
          return (
            <li key={item.id} className="flex items-start gap-3 group">
              <span
                className={`mt-0.5 shrink-0 ${meta?.color ?? 'text-[var(--text-muted)]'}`}
              >
                <Icon size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">{item.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{timeAgo(item.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}