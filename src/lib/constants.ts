/**
 * src/lib/constants.ts
 *
 * Constantes globales du projet : URL, rôles, clés de stockage, routes nommées.
 * À importer partout où une valeur "magique" serait tentante.
 */

// ─────────────────────────────────────────────
// API & WEBSOCKET
// ─────────────────────────────────────────────

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
).replace(/\/$/, '')

export const BASE_URL = API_ORIGIN.endsWith('/api/v1')
  ? API_ORIGIN
  : `${API_ORIGIN}/api/v1`

/** Socket.io est monté à la racine du backend, pas sous /api/v1 */
export const WS_URL = (
  process.env.NEXT_PUBLIC_WS_URL ??
  (API_ORIGIN.replace(/\/api\/v1$/, '') || 'http://localhost:3001')
).replace(/\/$/, '')

// ─────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────

export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'blog_access_token',
  VISITOR_ID:    'blog_visitor_id',
  SESSION_ID:    'blog_session_id',
  THEME:         'blog_theme',
} as const

// ─────────────────────────────────────────────
// RÔLES (miroir de RoleName dans api.ts)
// ─────────────────────────────────────────────

export const ROLES = {
  PRIMARY_ADMIN:   'PRIMARY_ADMIN',
  SECONDARY_ADMIN: 'SECONDARY_ADMIN',
  MEMBER:          'MEMBER',
  SIMPLE_USER:     'SIMPLE_USER',
} as const

/** Hiérarchie numérique pour les comparaisons de permission */
export const ROLE_LEVEL: Record<string, number> = {
  SIMPLE_USER:     1,
  MEMBER:          2,
  SECONDARY_ADMIN: 3,
  PRIMARY_ADMIN:   4,
}

/** Vérifie si un rôle a au moins le niveau requis */
export function hasMinRole(
  userRole: string,
  required: keyof typeof ROLE_LEVEL
): boolean {
  return (ROLE_LEVEL[userRole] ?? 0) >= ROLE_LEVEL[required]
}

// ─────────────────────────────────────────────
// ROUTES FRONTEND NOMMÉES
// ─────────────────────────────────────────────

export const ROUTES = {
  // Public
  HOME:            '/',
  ARTICLES:        '/articles',
  ARTICLE:         (slug: string) => `/articles/${slug}`,
  CATEGORIES:      '/categories',
  CATEGORY:        (slug: string) => `/categories/${slug}`,
  AUTHORS:         '/auteurs',
  AUTHOR:          (id: string)   => `/auteurs/${id}`,
  SEARCH:          '/recherche',
  LEGAL:           (slug: string) => `/legal/${slug}`,

  // Auth
  LOGIN:           '/connexion',
  REGISTER:        '/inscription',
  VERIFY_EMAIL:    '/verification-email',
  FORGOT_PASSWORD: '/mot-de-passe-oublie',
  RESET_PASSWORD:  '/reinitialiser-mdp',

  // Member
  NOTIFICATIONS:   '/notifications',
  PROFILE:         '/profil',

  // Dashboard (MEMBER+)
  DASHBOARD:              '/dashboard',
  DASHBOARD_ARTICLES:     '/dashboard/articles',
  DASHBOARD_NEW_ARTICLE:  '/dashboard/articles/nouveau',
  DASHBOARD_EDIT_ARTICLE: (id: string) => `/dashboard/articles/${id}`,
  DASHBOARD_STATS:        (id: string) => `/dashboard/articles/${id}/stats`,
  DASHBOARD_COMMENTS:     '/dashboard/commentaires',
  DASHBOARD_SUBSCRIBERS:  '/dashboard/abonnes',
  DASHBOARD_SETTINGS:     '/dashboard/parametres',

  // Admin
  ADMIN:                   '/admin',
  ADMIN_USERS:             '/admin/utilisateurs',
  ADMIN_USER:              (id: string) => `/admin/utilisateurs/${id}`,
  ADMIN_ARTICLES:          '/admin/articles',
  ADMIN_COMMENTS:          '/admin/commentaires',
  ADMIN_REPORTS:           '/admin/commentaires/signalements',
  ADMIN_CATEGORIES:        '/admin/categories',
  ADMIN_ANALYTICS:         '/admin/analytics',
  ADMIN_ANALYTICS_REALTIME:'/admin/analytics/temps-reel',
  ADMIN_NEWSLETTER:        '/admin/newsletter',
  ADMIN_HOMEPAGE:          '/admin/homepage',
  ADMIN_SITE:              '/admin/site',
  ADMIN_SECURITY:          '/admin/securite',
} as const

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 12,
  LIMITS:        [9, 12, 24, 48] as const,
} as const

// ─────────────────────────────────────────────
// ÉDITEUR
// ─────────────────────────────────────────────

export const EDITOR = {
  /** Délai en ms entre deux sauvegardes automatiques */
  AUTOSAVE_DELAY_MS: 3_000,
  /** Taille max d'une image uploadée (5 Mo) */
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,
  /** Formats acceptés pour les images */
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────

/** Délai de debounce avant d'envoyer un événement analytics (ms) */
export const ANALYTICS_DEBOUNCE_MS = 500

// ─────────────────────────────────────────────
// DESIGN SYSTEM (tokens JS, cohérents avec tailwind.config)
// ─────────────────────────────────────────────

export const DESIGN = {
  colors: {
    dark: {
      background: '#0B0D10',
      surface:    '#13161B',
      text:       '#F5F7FA',
      accent:     '#5B8CFF',
      muted:      '#8B95A3',
      border:     '#1E2228',
      error:      '#FF5B5B',
      success:    '#4ADE80',
    },
    light: {
      background: '#F4F6F9',
      surface:    '#FFFFFF',
      text:       '#0B0D10',
      accent:     '#4A7AE8',
      muted:      '#8B95A3',
      border:     '#DDE2EA',
      error:      '#E04545',
      success:    '#16A34A',
    },
  },
  animation: {
    fast:   '150ms ease',
    normal: '250ms ease',
    slow:   '400ms ease',
  },
} as const
