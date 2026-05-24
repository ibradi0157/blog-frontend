'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard, FileText, MessageSquare, Users, Bell,
  Settings, BarChart2, Plus, Shield, Globe, Mail, Home,
  BookOpen, Star, Layers,
} from 'lucide-react'

interface NavItem {
  href:    string
  icon:    React.ElementType
  label:   string
  badge?:  number | string
}

interface NavSection {
  title?: string
  items:  NavItem[]
}

const DASHBOARD_NAV: NavSection[] = [
  {
    items: [
      { href: ROUTES.DASHBOARD,         icon: LayoutDashboard, label: 'Tableau de bord' },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { href: ROUTES.DASHBOARDArticles, icon: FileText,        label: 'Mes articles'   },
      { href: ROUTES.DASHBOARD_NEW_ARTICLE,        icon: Plus,            label: 'Nouvel article' },
      { href: ROUTES.DASHBOARDComments, icon: MessageSquare,   label: 'Commentaires'   },
    ],
  },
  {
    title: 'Communauté',
    items: [
      { href: ROUTES.DASHBOARDFollowers, icon: Users,          label: 'Abonnés'        },
      { href: ROUTES.NOTIFICATIONS,      icon: Bell,           label: 'Notifications'  },
    ],
  },
  {
    title: 'Compte',
    items: [
      { href: ROUTES.DASHBOARD_SETTINGS,           icon: Settings,       label: 'Paramètres'     },
    ],
  },
]

const ADMIN_NAV: NavSection[] = [
  {
    items: [
      { href: ROUTES.ADMIN,                   icon: BarChart2,       label: 'Vue d\'ensemble' },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { href: ROUTES.ADMIN_USERS,              icon: Users,           label: 'Utilisateurs'    },
      { href: ROUTES.ADMIN_ARTICLES,           icon: FileText,        label: 'Articles'        },
      { href: ROUTES.ADMIN_COMMENTS,           icon: MessageSquare,   label: 'Commentaires'    },
      { href: ROUTES.ADMIN_CATEGORIES,         icon: Layers,          label: 'Catégories'      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { href: ROUTES.ADMIN_ANALYTICS,          icon: BarChart2,       label: 'Statistiques'    },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { href: ROUTES.ADMIN_NEWSLETTER,         icon: Mail,            label: 'Newsletter'      },
      { href: ROUTES.ADMIN_HOMEPAGE,           icon: Home,            label: 'Homepage'        },
      { href: ROUTES.ADMIN_SITE,               icon: Globe,           label: 'Site'            },
      { href: ROUTES.ADMIN_SECURITY,           icon: Shield,          label: 'Sécurité'        },
    ],
  },
]

interface SidebarProps {
  variant?: 'dashboard' | 'admin'
}

export function Sidebar({ variant = 'dashboard' }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const sections = variant === 'admin' ? ADMIN_NAV : DASHBOARD_NAV

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] min-h-[calc(100vh-4rem)]">
      {/* Brand / context */}
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--accent-muted)] flex items-center justify-center">
            {variant === 'admin'
              ? <Star  className="w-4 h-4 text-[var(--accent)]" />
              : <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {variant === 'admin' ? 'Administration' : 'Dashboard'}
            </p>
            {user && (
              <p className="text-xs text-[var(--text-muted)] truncate">{user.username}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="px-2 mb-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label, badge }) => {
                const active = pathname === href || (href.length > 1 && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius)] text-sm transition-all',
                        active
                          ? 'bg-[var(--accent-muted)] text-[var(--accent)] font-medium'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{label}</span>
                      {badge != null && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white">
                          {badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
