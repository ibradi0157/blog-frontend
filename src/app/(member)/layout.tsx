import { Navbar }    from '@/components/layout/Navbar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 flex flex-col min-h-dvh">
        {children}
      </div>
      <MobileNav />
    </>
  )
}
