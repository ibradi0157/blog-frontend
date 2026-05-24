'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth }   from '@/contexts/AuthContext'
import { ROUTES, ROLE_LEVEL } from '@/lib/constants'
import { PageLoader } from '@/components/ui/loading-spinner'
import type { RoleName } from '@/types/api'

interface RoleGuardProps {
  children:     React.ReactNode
  requiredRole: RoleName
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user, isHydrated } = useAuth()

  useEffect(() => {
    if (!isHydrated) return
    if (!isAuthenticated) { router.replace(ROUTES.LOGIN); return }
    if (user && (ROLE_LEVEL[user.role] ?? 0) < (ROLE_LEVEL[requiredRole] ?? 0)) {
      router.replace(ROUTES.HOME)
    }
  }, [isAuthenticated, isHydrated, user, requiredRole, router])

  if (!isHydrated || !isAuthenticated) return <PageLoader />
  if (user && (ROLE_LEVEL[user.role] ?? 0) < (ROLE_LEVEL[requiredRole] ?? 0)) return <PageLoader />

  return <>{children}</>
}
