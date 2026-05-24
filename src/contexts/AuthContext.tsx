'use client'

/**
 * src/contexts/AuthContext.tsx
 *
 * Provider d'authentification global.
 *
 * Responsabilités :
 *  - Hydrater le store auth depuis localStorage au montage
 *  - Exposer login() / logout() avec effets de bord (redirect, toast…)
 *  - Surveiller l'expiration du token et déconnecter automatiquement
 *  - Fournir un hook useAuth() typé pour les composants enfants
 *
 * Doit encadrer toute l'application dans app/layout.tsx.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { tokenExpiresInSeconds } from '@/lib/auth'
import { ROUTES } from '@/lib/constants'
import type { AuthUser } from '@/lib/auth'
import type { AuthResponse, RoleName } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthContextValue {
  /** Utilisateur connecté, null si non authentifié */
  user:            AuthUser | null
  /** JWT courant */
  token:           string | null
  isAuthenticated: boolean
  /** false tant que le store n'a pas été hydraté (premier rendu) */
  isHydrated:      boolean
  /**
   * Authentifie l'utilisateur à partir d'une réponse backend.
   * @param response   Réponse /auth/login ou /auth/register
   * @param redirectTo Route de redirection après login (défaut : dashboard)
   */
  login:   (response: AuthResponse, redirectTo?: string) => void
  /**
   * Déconnecte l'utilisateur et redirige vers /connexion.
   */
  logout:  () => void
  /**
   * Vérifie si l'utilisateur courant a au moins le rôle spécifié.
   */
  hasRole: (role: RoleName) => boolean
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router   = useRouter()
  const store    = useAuthStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Hydratation initiale ──────────────────────────────────────────────────
  useEffect(() => {
    store.hydrate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-logout à expiration ──────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!store.token || !store.isAuthenticated) return

    const secondsLeft = tokenExpiresInSeconds(store.token)
    if (secondsLeft <= 0) {
      store.logout()
      router.push(ROUTES.LOGIN)
      return
    }

    // Planifie la déconnexion 10 secondes avant expiration
    const delay = Math.max(0, (secondsLeft - 10) * 1_000)
    timerRef.current = setTimeout(() => {
      store.logout()
      router.push(ROUTES.LOGIN + '?expired=1')
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [store.token, store.isAuthenticated, router, store])

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    (response: AuthResponse, redirectTo?: string) => {
      store.login(response)
      const dest = redirectTo ?? ROUTES.DASHBOARD
      router.push(dest)
    },
    [store, router]
  )

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    store.logout()
    router.push(ROUTES.LOGIN)
  }, [store, router])

  // ── hasRole ───────────────────────────────────────────────────────────────
  const hasRole = useCallback(
    (role: RoleName): boolean => {
      if (!store.user) return false
      const levels: Record<string, number> = {
        SIMPLE_USER:     1,
        MEMBER:          2,
        SECONDARY_ADMIN: 3,
        PRIMARY_ADMIN:   4,
      }
      return (levels[store.user.role] ?? 0) >= (levels[role] ?? 0)
    },
    [store.user]
  )

  const value: AuthContextValue = {
    user:            store.user,
    token:           store.token,
    isAuthenticated: store.isAuthenticated,
    isHydrated:      store.isHydrated,
    login,
    logout,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

/**
 * Hook principal d'authentification.
 * Lève une erreur si utilisé hors du AuthProvider.
 *
 * @example
 *   const { user, isAuthenticated, login, logout, hasRole } = useAuth()
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth() doit être utilisé dans un <AuthProvider>')
  }
  return ctx
}
