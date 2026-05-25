'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import { timeAgo } from '@/lib/utils'
import { useNotificationStore } from '@/store/notificationStore'
import { Heart, MessageSquare, UserPlus, Bell, BookOpen, Mail } from 'lucide-react'
import type { Notification, NotificationType } from '@/types/api'

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; label: string }> = {
  LIKE_ARTICLE:    { icon: Heart,         color: 'text-[var(--error)]',   label: 'a liké votre article'    },
  LIKE_COMMENT:    { icon: Heart,         color: 'text-[var(--error)]',   label: 'a liké votre commentaire'},
  COMMENT:         { icon: MessageSquare, color: 'text-[var(--accent)]',  label: 'a commenté'              },
  FOLLOW:          { icon: UserPlus,      color: 'text-[var(--success)]', label: 'vous suit maintenant'    },
  NEW_ARTICLE:     { icon: BookOpen,      color: 'text-[var(--warning)]', label: 'a publié un article'     },
  NEWSLETTER:      { icon: Mail,          color: 'text-[var(--accent)]',  label: 'newsletter'              },
}

interface NotificationItemProps {
  notification: Notification
  onClose?:     () => void
  onRead?:      (id: string) => void
}

export function NotificationItem({ notification, onClose, onRead }: NotificationItemProps) {
  const { markRead } = useNotificationStore()
  const cfg = TYPE_CONFIG[notification.type] ?? { icon: Bell, color: 'text-[var(--text-secondary)]', label: '' }
  const Icon = cfg.icon

  const handleClick = () => {
    if (!notification.isRead) markRead(notification.id)
      onRead?.(notification.id)
    onClose?.()
  }

  const inner = (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 transition-colors',
        !notification.isRead && 'bg-[var(--accent-muted)]/30',
        'hover:bg-[var(--bg-hover)]',
      )}
    >
      <span className={cn('mt-0.5 shrink-0', cfg.color)}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-primary)] leading-snug line-clamp-2">
          {notification.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 mt-1" />
      )}
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleClick} className="block">
        {inner}
      </Link>
    )
  }

  return (
    <button onClick={handleClick} className="w-full text-left">
      {inner}
    </button>
  )
}
