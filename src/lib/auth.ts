/**
 * src/lib/auth.ts
 *
 * Utilitaires JWT côté client :
 *  - Décodage du payload sans vérification de signature (lecture seule)
 *  - Vérification d'expiration
 *  - Persistance / lecture / suppression du token dans localStorage
 *  - Extraction de l'utilisateur courant depuis le token
 *
 * ⚠️  Ne jamais utiliser ces fonctions pour des décisions de sécurité côté
 *     serveur. La vérification réelle se fait côté backend (NestJS JwtGuard).
 *     Ici on lit le token uniquement pour enrichir l'UI (nom, rôle affiché…).
 */

import { STORAGE_KEYS } from '@/lib/constants'
import type { RoleName } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface JwtPayload {
  /** ID utilisateur (sub) */
  sub: string
  /** Email */
  email: string
  /** Rôle */
  role: RoleName
  /** Date d'émission (Unix timestamp secondes) */
  iat: number
  /** Date d'expiration (Unix timestamp secondes) */
  exp: number
}

export interface AuthUser {
  id:           string
  email:        string
  role:         RoleName
  displayName?: string
  username?:    string | null
  avatarUrl?:   string | null
  bio?:         string | null
  website?:     string | null
  twitter?:     string | null
  github?:      string | null
  linkedin?:    string | null
}

// ─────────────────────────────────────────────
// DÉCODAGE JWT
// ─────────────────────────────────────────────

/**
 * Décode la partie payload d'un JWT (base64url) sans vérifier la signature.
 * Retourne null si le token est malformé.
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Le payload est la 2e partie, encodée en base64url
    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    // Padding
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    )

    const json = atob(padded)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Vérifie si un token JWT est expiré.
 * Ajoute une tolérance de 30 secondes pour compenser la latence réseau.
 */
export function isTokenExpired(token: string, toleranceSeconds = 30): boolean {
  const payload = decodeToken(token)
  if (!payload) return true
  const nowSeconds = Math.floor(Date.now() / 1000)
  return payload.exp < nowSeconds + toleranceSeconds
}

/**
 * Vérifie si un token est valide (bien formé et non expiré).
 */
export function isTokenValid(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload) return false
  return !isTokenExpired(token)
}

/**
 * Retourne le nombre de secondes restantes avant expiration.
 * Retourne 0 si le token est déjà expiré.
 */
export function tokenExpiresInSeconds(token: string): number {
  const payload = decodeToken(token)
  if (!payload) return 0
  const remaining = payload.exp - Math.floor(Date.now() / 1000)
  return Math.max(0, remaining)
}

// ─────────────────────────────────────────────
// EXTRACTION UTILISATEUR
// ─────────────────────────────────────────────

/**
 * Extrait les informations utilisateur d'un token JWT.
 * Retourne null si le token est invalide ou expiré.
 */
export function getUserFromToken(token: string): AuthUser | null {
  if (!isTokenValid(token)) return null
  const payload = decodeToken(token)
  if (!payload) return null
  return {
    id:    payload.sub,
    email: payload.email,
    role:  payload.role,
  }
}

// ─────────────────────────────────────────────
// PERSISTANCE LOCALSTORAGE
// ─────────────────────────────────────────────

/** Indique si on est dans un environnement browser */
const isBrowser = typeof window !== 'undefined'

/** Lit le token JWT depuis localStorage */
export function getStoredToken(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/** Persiste le token JWT dans localStorage */
export function storeToken(token: string): void {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

/** Supprime le token JWT de localStorage */
export function clearToken(): void {
  if (!isBrowser) return
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Lit le token stocké et retourne l'utilisateur associé.
 * Retourne null si absent, invalide ou expiré.
 * Nettoie automatiquement un token expiré.
 */
export function getStoredUser(): AuthUser | null {
  const token = getStoredToken()
  if (!token) return null

  if (isTokenExpired(token)) {
    clearToken()
    return null
  }

  return getUserFromToken(token)
}

// ─────────────────────────────────────────────
// VISITOR / SESSION IDs (analytics)
// ─────────────────────────────────────────────

/** Génère un UUID v4 simple (pas de dépendance externe) */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Retourne ou crée un visitorId persistant (localStorage).
 * Permet d'identifier un visiteur non connecté entre sessions.
 */
export function getOrCreateVisitorId(): string {
  if (!isBrowser) return 'server'
  const existing = localStorage.getItem(STORAGE_KEYS.VISITOR_ID)
  if (existing) return existing
  const id = generateUUID()
  localStorage.setItem(STORAGE_KEYS.VISITOR_ID, id)
  return id
}

/**
 * Retourne ou crée un sessionId (sessionStorage).
 * Réinitialisé à chaque fermeture d'onglet.
 */
export function getOrCreateSessionId(): string {
  if (!isBrowser) return 'server'
  const existing = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID)
  if (existing) return existing
  const id = generateUUID()
  sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, id)
  return id
}
