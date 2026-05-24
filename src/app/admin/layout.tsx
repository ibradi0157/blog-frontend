import { Sidebar }    from '@/components/layout/Sidebar'
import { RoleGuard }  from '@/components/auth/RoleGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="SECONDARY_ADMIN">
      <div className="flex min-h-dvh">
        <Sidebar variant="admin" />
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  )
}
