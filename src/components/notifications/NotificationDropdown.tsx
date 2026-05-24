'use client'

import Link from 'next/link'
import { useNotificationStore } from '@/store/notificationStore'
import { useNotificationContext } from '@/contexts/NotificationContext'
import { NotificationItem } from './NotificationItem'
import { ROUTES } from '@/lib/constants'
import { CheckCheck, RefreshCw } from 'lucide-react'

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAllRead } = useNotificationStore()
  const { refresh } = useNotificationContext()

  const preview = notifications.slice(0, 6)

  return (
    <div className="absolute right-0 mt-2 w-80 z-30 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] overflow-hidden animate-fade-in-fast">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => refresh()}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Actualiser"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors"
              aria-label="Tout marquer comme lu"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--border)]">
        {preview.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">Aucune notification</p>
          </div>
        ) : (
          preview.map(notif => (
            <NotificationItem key={notif.id} notification={notif} onClose={onClose} />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-2.5">
          <Link
            href={ROUTES.NOTIFICATIONS}
            onClick={onClose}
            className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Voir toutes les notifications →
          </Link>
        </div>
      )}
    </div>
  )
}
