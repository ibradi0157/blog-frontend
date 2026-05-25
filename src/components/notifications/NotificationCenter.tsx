'use client';

import { useState } from 'react';
import { CheckCheck, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const LIMIT = 20;

export function NotificationCenter() {
  const [page, setPage] = useState(1);
  const { notifications, total, unreadCount, isLoading, markRead, markAllRead, revalidate } =
    useNotifications(page, LIMIT);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[var(--accent)] text-white text-xs font-semibold px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => revalidate()}
            className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            Actualiser
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <CheckCheck size={13} />
              Tout marquer lu
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="card divide-y divide-[var(--border)]">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)]">
            <p className="text-lg">Aucune notification</p>
            <p className="text-sm mt-1">Vous serez notifié des nouvelles activités ici.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="px-4">
              <NotificationItem notification={notif} onRead={markRead} />
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}