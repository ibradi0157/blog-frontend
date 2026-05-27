'use client'

/**
 * src/contexts/AuthContext.tsx
 *
 * Provider d'authentification global.
 *
 * Responsabilités :
 *  - Hydrater le store auth depuis localStorage au montage
 *  - Enrichir AuthUser avec le profil complet après login (GET /users/public/:id)
 *  - Exposer login() / logout() avec effets de bord (redirect, toast…)
 *  - Surveiller l'expiration du token et déconnecter automatiquement
 *  - Fournir un hook useAuth() typé pour les composants enfants
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
import api from '@/lib/api-client'
import type { AuthUser } from '@/lib/auth'
import type { AuthResponse, RoleName } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthContextValue {
  user:            AuthUser | null
  token:           string | null
  isAuthenticated: boolean
  isHydrated:      boolean
  login:   (response: AuthResponse, redirectTo?: string) => Promise<void>
  logout:  () => void
  hasRole: (role: RoleName) => boolean
  /** Rafraîchit le profil depuis GET /users/public/:id */
  refreshProfile: () => Promise<void>
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Enrichit le store avec les données du profil public */
async function enrichFromPublicProfile(
  userId: string,
  currentUser: AuthUser,
  updateProfile: (patch: Partial<AuthUser>) => void
) {
  try {
    const res = await api.users.getPublicProfile(userId)
    const profile = (res as any)?.data ?? (res as any)
    if (profile?.id) {
      updateProfile({
        displayName: profile.displayName ?? currentUser.displayName,
        username:    profile.username    ?? currentUser.username,
        avatarUrl:   profile.avatarUrl   ?? currentUser.avatarUrl,
        bio:         profile.bio         ?? currentUser.bio,
        website:     profile.website     ?? currentUser.website,
        twitter:     profile.twitter     ?? currentUser.twitter,
        github:      profile.github      ?? currentUser.github,
        linkedin:    profile.linkedin    ?? currentUser.linkedin,
        youtube:     profile.youtube     ?? currentUser.youtube,
        instagram:   profile.instagram   ?? currentUser.instagram,
      })
    }
  } catch { /* silencieux */ }
}

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

  // ── Enrichissement du profil au montage (si déjà authentifié) ────────────
  useEffect(() => {
    if (!store.isAuthenticated || !store.user?.id) return
    enrichFromPublicProfile(store.user.id, store.user, store.updateProfile)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.isAuthenticated])

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

    const delay = Math.max(0, (secondsLeft - 10) * 1_000)
    timerRef.current = setTimeout(() => {
      store.logout()
      router.push(ROUTES.LOGIN + '?expired=1')
    }, delay)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [store.token, store.isAuthenticated, router, store])

  // ── refreshProfile ────────────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!store.isAuthenticated || !store.user?.id) return
    await enrichFromPublicProfile(store.user.id, store.user, store.updateProfile)
  }, [store])

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (response: AuthResponse, redirectTo?: string) => {
      store.login(response)
      // Enrichir immédiatement après login (store.user est maintenant peuplé)
      // Le backend retourne response.data.userId (pas response.data.user.id)
      const userId =
        response?.data?.userId ??
        (response as any)?.data?.user?.id ??
        (response as any)?.user?.id
      if (userId) {
        const fakeUser: AuthUser = {
          id:    userId,
          email: response?.data?.email ?? '',
          role:  response?.data?.role  ?? 'SIMPLE_USER',
        }
        await enrichFromPublicProfile(userId, fakeUser, store.updateProfile)
      }
      router.push(redirectTo ?? ROUTES.DASHBOARD)
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
        SIMPLE_USER: 1, MEMBER: 2, SECONDARY_ADMIN: 3, PRIMARY_ADMIN: 4,
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
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth() doit être utilisé dans un <AuthProvider>')
  }
  return ctx
}
