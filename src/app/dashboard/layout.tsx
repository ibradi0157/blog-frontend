import { Sidebar }    from '@/components/layout/Sidebar'
import { AuthGuard }  from '@/components/auth/AuthGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="MEMBER">
      <div className="flex min-h-dvh">
        <Sidebar variant="dashboard" />
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
