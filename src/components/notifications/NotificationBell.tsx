'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'
import { useNotificationStore } from "@/store/notificationStore"'
import { NotificationDropdown } from './NotificationDropdown'

export function NotificationBell() {
  const { unreadCount }        = useNotificationStore()
  const [open, setOpen]        = useState(false)
  const ref                    = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-[var(--radius)] transition-colors',
          'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
          open && 'text-[var(--text-primary)] bg-[var(--bg-hover)]',
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[var(--accent)] text-white text-[9px] font-bold leading-none animate-pulse-dot">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
