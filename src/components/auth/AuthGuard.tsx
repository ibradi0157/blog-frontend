'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth }   from '@/contexts/AuthContext'
import { ROUTES, ROLE_LEVEL } from '@/lib/constants'
import { PageLoader } from '@/components/ui/loading-spinner'
import type { RoleName } from '@/types/api'

interface AuthGuardProps {
  children:      React.ReactNode
  requiredRole?: RoleName
  redirectTo?:   string
}

export function AuthGuard({ children, requiredRole, redirectTo = ROUTES.LOGIN }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user, isHydrated } = useAuth()

  useEffect(() => {
    if (!isHydrated) return
    if (!isAuthenticated) { router.replace(redirectTo); return }
    if (requiredRole && user) {
      if ((ROLE_LEVEL[user.role] ?? 0) < (ROLE_LEVEL[requiredRole] ?? 0)) {
        router.replace(ROUTES.HOME)
      }
    }
  }, [isAuthenticated, isHydrated, user, requiredRole, router, redirectTo])

  if (!isHydrated || !isAuthenticated) return <PageLoader />
  if (requiredRole && user && (ROLE_LEVEL[user.role] ?? 0) < (ROLE_LEVEL[requiredRole] ?? 0)) return <PageLoader />

  return <>{children}</>
}
