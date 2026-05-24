/**
 * src/lib/analytics.ts
 *
 * Helper de tracking analytics côté client.
 * Envoie des événements à POST /analytics/track avec debounce et batching.
 *
 * Design :
 *  - Fire-and-forget (pas d'await obligatoire, erreurs silencieuses)
 *  - Debounce configurable pour les événements fréquents (scroll, time_on_page)
 *  - visitorId + sessionId générés/récupérés automatiquement
 *  - userId injecté si l'utilisateur est connecté
 *  - Désactivé en environnement de test (NODE_ENV === 'test')
 */

import { ANALYTICS_DEBOUNCE_MS, BASE_URL } from '@/lib/constants'
import {
  getOrCreateVisitorId,
  getOrCreateSessionId,
  getStoredToken,
  getUserFromToken,
} from '@/lib/auth'
import type { EventType, TrackEventDto } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

/** Paramètres simplifiés pour tracker() — le reste est injecté automatiquement */
export interface TrackParams {
  eventType:  EventType
  articleId?: string
  categoryId?: string
  url?:        string
  referrer?:   string
  value?:      number
  metadata?:   Record<string, unknown>
}

// ─────────────────────────────────────────────
// ENVOI HTTP (interne)
// ─────────────────────────────────────────────

async function sendEvent(payload: TrackEventDto): Promise<void> {
  // Désactivé en test
  if (process.env.NODE_ENV === 'test') return

  try {
    const token = getStoredToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    await fetch(`${BASE_URL}/analytics/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      // keepalive permet l'envoi même si la page se ferme (ex: bounce)
      keepalive: true,
    })
  } catch {
    // Analytics ne doit jamais bloquer l'expérience utilisateur
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Analytics] Échec envoi événement', payload.eventType)
    }
  }
}

// ─────────────────────────────────────────────
// DEBOUNCE INTERNE
// ─────────────────────────────────────────────

const debounceMap = new Map<string, ReturnType<typeof setTimeout>>()

function debounce(key: string, fn: () => void, delay: number): void {
  const existing = debounceMap.get(key)
  if (existing) clearTimeout(existing)
  debounceMap.set(key, setTimeout(() => {
    fn()
    debounceMap.delete(key)
  }, delay))
}

// ─────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────

/**
 * Envoie un événement analytics.
 * Injecte automatiquement visitorId, sessionId, userId, url et referrer.
 *
 * @example
 *   track({ eventType: 'article_view', articleId: '123' })
 *   track({ eventType: 'search', metadata: { query: 'react hooks' } })
 */
export function track(params: TrackParams): void {
  if (typeof window === 'undefined') return

  const token    = getStoredToken()
  const authUser = token ? getUserFromToken(token) : null

  const payload: TrackEventDto = {
    eventType:  params.eventType,
    visitorId:  getOrCreateVisitorId(),
    sessionId:  getOrCreateSessionId(),
    userId:     authUser?.id,
    articleId:  params.articleId,
    categoryId: params.categoryId,
    url:        params.url  ?? window.location.href,
    referrer:   params.referrer ?? document.referrer || undefined,
    value:      params.value,
    metadata:   params.metadata,
  }

  // Fire and forget
  void sendEvent(payload)
}

/**
 * Variante debounce de track().
 * Utile pour les événements répétitifs (scroll_depth, time_on_page).
 *
 * @param key    Clé unique de debounce (ex: `scroll-${articleId}`)
 * @param params Paramètres de l'événement
 * @param delay  Délai en ms (défaut : ANALYTICS_DEBOUNCE_MS)
 */
export function trackDebounced(
  key: string,
  params: TrackParams,
  delay = ANALYTICS_DEBOUNCE_MS
): void {
  debounce(key, () => track(params), delay)
}

// ─────────────────────────────────────────────
// RACCOURCIS SÉMANTIQUES
// ─────────────────────────────────────────────

/** Incrémente la vue d'une page */
export const trackPageView = (url?: string) =>
  track({ eventType: 'page_view', url })

/** Incrémente la vue d'un article */
export const trackArticleView = (articleId: string) =>
  track({ eventType: 'article_view', articleId })

/** Like d'un article */
export const trackArticleLike = (articleId: string) =>
  track({ eventType: 'article_like', articleId })

/** Dislike d'un article */
export const trackArticleDislike = (articleId: string) =>
  track({ eventType: 'article_dislike', articleId })

/** Partage d'un article */
export const trackArticleShare = (articleId: string, platform?: string) =>
  track({ eventType: 'article_share', articleId, metadata: { platform } })

/** Recherche */
export const trackSearch = (query: string) =>
  track({ eventType: 'search', metadata: { query } })

/** Création d'un commentaire */
export const trackCommentCreate = (articleId: string) =>
  track({ eventType: 'comment_create', articleId })

/** Inscription newsletter */
export const trackNewsletterSignup = () =>
  track({ eventType: 'newsletter_signup' })

/** Connexion utilisateur */
export const trackLogin = () =>
  track({ eventType: 'user_login' })

/** Inscription utilisateur */
export const trackSignup = () =>
  track({ eventType: 'user_signup' })

/**
 * Profondeur de scroll (debounce automatique).
 * @param percent  Pourcentage atteint (0–100)
 * @param articleId  ID de l'article si applicable
 */
export const trackScrollDepth = (percent: number, articleId?: string) =>
  trackDebounced(
    `scroll-${articleId ?? 'page'}-${percent}`,
    { eventType: 'scroll_depth', articleId, value: percent },
    1_000
  )

/**
 * Temps passé sur la page (debounce automatique).
 * @param seconds  Nombre de secondes passées
 * @param articleId  ID de l'article si applicable
 */
export const trackTimeOnPage = (seconds: number, articleId?: string) =>
  trackDebounced(
    `time-${articleId ?? 'page'}`,
    { eventType: 'time_on_page', articleId, value: seconds },
    2_000
  )
