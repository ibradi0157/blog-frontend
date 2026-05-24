import { Navbar }    from '@/components/layout/Navbar'
import { Footer }    from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 flex flex-col min-h-dvh">
        {children}
        <Footer />
      </div>
      <MobileNav />
    </>
  )
}
