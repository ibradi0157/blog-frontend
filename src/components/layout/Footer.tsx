'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { X, Rss } from 'lucide-react'

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
      { href: ROUTES.LEGAL_INDEX,         label: 'Informations légales' },
      { href: '/legal/privacy',           label: 'Confidentialité'      },
      { href: '/legal/terms',             label: 'Conditions d\'usage'  },
      { href: '/legal/cookie-policy',     label: 'Cookies'              },
      { href: '/legal/legal-notice',      label: 'Mentions légales'     },
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
              <SocialLink href="https://X.com" icon={<X className="w-4 h-4"/>} label="Twitter" />
              <SocialLink href="https://github.com" icon={<GitHubIcon className="w-4 h-4" />} label="GitHub" />
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
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
