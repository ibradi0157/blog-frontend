/**
 * src/store/authStore.ts
 *
 * Store Zustand pour l'état d'authentification global.
 *
 * Responsabilités :
 *  - Stocker l'utilisateur connecté + son token JWT
 *  - Exposer login(), logout(), refreshUser()
 *  - Persister le token dans localStorage via les helpers auth.ts
 *  - Hydrater l'état depuis localStorage au démarrage
 *
 * Installation requise :
 *   pnpm add zustand
 *
 * Usage :
 *   const { user, isAuthenticated, login, logout } = useAuthStore()
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  storeToken,
  clearToken,
  getStoredToken,
  getUserFromToken,
  isTokenExpired,
} from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'
import type { AuthResponse, RoleName } from '@/types/api'
import { ROLE_LEVEL } from '@/lib/constants'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthState {
  /** Utilisateur connecté (null si non authentifié) */
  user:            AuthUser | null
  /** JWT en clair */
  token:           string | null
  /** true si l'utilisateur est authentifié et le token valide */
  isAuthenticated: boolean
  /** true pendant l'hydratation initiale (SSR → CSR) */
  isHydrated:      boolean
}

interface AuthActions {
  /**
   * Appelé après un login ou register réussi.
   * Persiste le token et met à jour le store.
   */
  login:        (response: AuthResponse) => void
  /**
   * Déconnecte l'utilisateur : efface le token et reset l'état.
   */
  logout:       () => void
  /**
   * Tente de restaurer la session depuis localStorage.
   * À appeler dans le root layout (une seule fois).
   */
  hydrate:      () => void
  /**
   * Met à jour le displayName et l'avatarUrl dans le store
   * (après modification du profil sans re-login).
   */
  updateProfile: (patch: Partial<Pick<AuthUser, 'email'>>) => void
}

// ─────────────────────────────────────────────
// ÉTAT INITIAL
// ─────────────────────────────────────────────

const INITIAL_STATE: AuthState = {
  user:            null,
  token:           null,
  isAuthenticated: false,
  isHydrated:      false,
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    // ── login ──────────────────────────────────────────────────────────────
    login: (response: AuthResponse) => {
      const { accessToken, userId, email, role } = response.data
      // Persiste dans localStorage
      storeToken(accessToken)
      set({
        token: accessToken,
        user:  { id: userId, email, role },
        isAuthenticated: true,
      })
    },

    // ── logout ─────────────────────────────────────────────────────────────
    logout: () => {
      clearToken()
      set(INITIAL_STATE)
      // isHydrated reste true après le premier logout
      set({ isHydrated: true })
    },

    // ── hydrate ────────────────────────────────────────────────────────────
    hydrate: () => {
      const token = getStoredToken()

      if (!token || isTokenExpired(token)) {
        // Token absent ou expiré : on nettoie
        clearToken()
        set({ ...INITIAL_STATE, isHydrated: true })
        return
      }

      const user = getUserFromToken(token)
      if (!user) {
        clearToken()
        set({ ...INITIAL_STATE, isHydrated: true })
        return
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isHydrated:      true,
      })
    },

    // ── updateProfile ──────────────────────────────────────────────────────
    updateProfile: (patch) => {
      const { user } = get()
      if (!user) return
      set({ user: { ...user, ...patch } })
    },
  }))
)

// ─────────────────────────────────────────────
// SÉLECTEURS (mémoïsés par zustand)
// ─────────────────────────────────────────────

/** Retourne vrai si l'utilisateur a au moins le rôle requis */
export function selectHasRole(state: AuthState, required: RoleName): boolean {
  if (!state.user) return false
  return (ROLE_LEVEL[state.user.role] ?? 0) >= (ROLE_LEVEL[required] ?? 0)
}

/** true si MEMBER ou plus */
export const selectIsMember = (s: AuthState) =>
  selectHasRole(s, 'MEMBER')

/** true si SECONDARY_ADMIN ou plus */
export const selectIsModerator = (s: AuthState) =>
  selectHasRole(s, 'SECONDARY_ADMIN')

/** true si PRIMARY_ADMIN */
export const selectIsAdmin = (s: AuthState) =>
  selectHasRole(s, 'PRIMARY_ADMIN')

/** Alias pour selectHasRole (avec signature compatible) */
export const selectIsAtLeastRole = selectHasRole
