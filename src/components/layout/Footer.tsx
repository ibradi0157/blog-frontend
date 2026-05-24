'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { Github, Twitter, Rss } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Plateforme',
    links: [
      { href: ROUTES.ARTICLES,   label: 'Articles'    },
      { href: ROUTES.CATEGORIES, label: 'Catégories'  },
      { href: ROUTES.AUTHORS,    label: 'Auteurs'     },
      { href: ROUTES.SEARCH,     label: 'Recherche'   },
    ],
  },
  {
    title: 'Compte',
    links: [
      { href: ROUTES.LOGIN,    label: 'Connexion'    },
      { href: ROUTES.REGISTER, label: 'Inscription'  },
      { href: ROUTES.PROFILE,  label: 'Mon profil'   },
      { href: ROUTES.DASHBOARD_SETTINGS, label: 'Paramètres'   },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: '/legal/privacy-policy',    label: 'Confidentialité'      },
      { href: '/legal/terms-of-service',  label: 'Conditions d\'usage'  },
      { href: '/legal/cookie-policy',     label: 'Cookies'              },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-card)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={ROUTES.HOME} className="inline-block">
              <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Blog<span className="text-[var(--accent)]">.</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Une plateforme de blog communautaire moderne. Lisez, écrivez, partagez.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <SocialLink href="https://twitter.com" icon={<Twitter className="w-4 h-4"/>} label="Twitter" />
              <SocialLink href="https://github.com"  icon={<Github  className="w-4 h-4"/>} label="GitHub"  />
              <SocialLink href="/rss.xml"            icon={<Rss     className="w-4 h-4"/>} label="RSS"     />
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map(section => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Blog Platform. Tous droits réservés.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Construit avec Next.js &amp; NestJS
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)] transition-all"
    >
      {icon}
    </a>
  )
}
