/**
 * useAuth — hook principal d'authentification
 *
 * Combine AuthContext (actions : login, logout) et authStore Zustand (state réactif).
 * À utiliser dans tous les composants qui ont besoin des infos d'auth.
 *
 * Exemples :
 *   const { user, isAuthenticated, isHydrated } = useAuth();
 *   const { login, logout } = useAuth();
 */

export { useAuth } from '@/contexts/AuthContext';

// Re-export store selectors for convenience
export {
  useAuthStore,
  selectIsAdmin,
  selectIsMember,
  selectIsAtLeastRole,
} from '@/store/authStore';
