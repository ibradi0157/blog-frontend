'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { UserAvatar } from '@/components/profile/UserAvatar'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import {
  Menu, X, PenSquare, LayoutDashboard, LogOut, Settings, User, Shield,
} from 'lucide-react'

const NAV_LINKS = [
  { href: ROUTES.ARTICLES,   label: 'Articles'    },
  { href: ROUTES.CATEGORIES, label: 'Catégories'  },
  { href: ROUTES.AUTHORS,    label: 'Auteurs'     },
]

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isHydrated, hasRole } = useAuth()
  const canAccessAdmin = isAuthenticated && !!user && hasRole('SECONDARY_ADMIN')

  // Transparent → solid on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setProfileOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || menuOpen
          ? 'bg-[var(--bg-base)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-[var(--shadow-sm)]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
              Blog<span className="text-[var(--accent)]">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-[var(--radius)] transition-colors',
                  pathname.startsWith(href)
                    ? 'text-[var(--text-primary)] bg-[var(--bg-hover)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isHydrated && isAuthenticated && user ? (
              <>
                {/* Notification bell */}
                <NotificationBell />

                {/* Write button */}
                <Link
                  href={ROUTES.DASHBOARD_NEW_ARTICLE}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-[var(--radius)] transition-colors"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Écrire</span>
                </Link>

                {canAccessAdmin && (
                  <Link
                    href={ROUTES.ADMIN}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] hover:bg-[var(--accent)]/10 rounded-[var(--radius)] transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    className="flex items-center rounded-full ring-2 ring-transparent hover:ring-[var(--accent)] transition-all"
                    aria-label="Menu profil"
                  >
                    <UserAvatar user={{ email: user.email }} size="sm" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 z-20 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] overflow-hidden animate-fade-in-fast">
                        <div className="px-3 py-2.5 border-b border-[var(--border)]">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.displayName ?? user.username ?? user.email}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <DropdownItem href={ROUTES.DASHBOARD}       icon={<LayoutDashboard className="w-4 h-4"/>} label="Dashboard"   />
                          {canAccessAdmin && (
                            <DropdownItem href={ROUTES.ADMIN} icon={<Shield className="w-4 h-4"/>} label="Administration" />
                          )}
                          <DropdownItem href={ROUTES.PROFILE}         icon={<User            className="w-4 h-4"/>} label="Mon profil"  />
                          <DropdownItem href={ROUTES.DASHBOARD_SETTINGS}        icon={<Settings        className="w-4 h-4"/>} label="Paramètres" />
                        </div>
                        <div className="border-t border-[var(--border)] py-1">
                          <button
                            onClick={() => { logout(); setProfileOpen(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--error)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN} className="btn-ghost text-sm px-3 py-1.5">
                  Connexion
                </Link>
                <Link href={ROUTES.REGISTER} className="btn-primary text-sm px-3 py-1.5">
                  S&apos;inscrire
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden ml-1 flex items-center justify-center w-9 h-9 rounded-[var(--radius)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-base)]/98 backdrop-blur-md animate-fade-in">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2.5 text-sm font-medium rounded-[var(--radius)] transition-colors',
                  pathname.startsWith(href)
                    ? 'text-[var(--text-primary)] bg-[var(--bg-hover)]'
                    : 'text-[var(--text-secondary)]',
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[var(--border)]">
              <ThemeToggle showLabel className="w-full" />
            </div>
            {isAuthenticated && (
              <>
                <Link href={ROUTES.DASHBOARD_NEW_ARTICLE} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] rounded-[var(--radius)]">
                  <PenSquare className="w-4 h-4" /> Écrire un article
                </Link>
                {canAccessAdmin && (
                  <Link href={ROUTES.ADMIN} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[var(--accent)] rounded-[var(--radius)]">
                    <Shield className="w-4 h-4" /> Administration
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

function DropdownItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
