'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { Home, BookOpen, Search, Bell, User } from 'lucide-react'
import { useNotificationStore } from "@/store/notificationStore"'

const NAV_ITEMS = [
  { href: ROUTES.HOME,    icon: Home,      label: 'Accueil'    },
  { href: ROUTES.ARTICLES, icon: BookOpen, label: 'Articles'   },
  { href: ROUTES.SEARCH,   icon: Search,   label: 'Recherche'  },
]

export function MobileNav() {
  const pathname             = usePathname()
  const { isAuthenticated }  = useAuth()
  const { unreadCount }      = useNotificationStore()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-md safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius)] transition-colors',
                active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}

        {isAuthenticated ? (
          <Link
            href={ROUTES.NOTIFICATIONS}
            className={cn(
              'relative flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius)] transition-colors',
              pathname.startsWith(ROUTES.NOTIFICATIONS) ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]',
            )}
          >
            <span className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[var(--accent)] text-white text-[9px] font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">Notifs</span>
          </Link>
        ) : null}

        <Link
          href={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
          className={cn(
            'flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius)] transition-colors',
            pathname.startsWith(ROUTES.PROFILE) ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]',
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">{isAuthenticated ? 'Profil' : 'Connexion'}</span>
        </Link>
      </div>
    </nav>
  )
}
