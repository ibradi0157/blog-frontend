import { Navbar }    from '@/components/layout/Navbar'
import { Footer }    from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { ROUTES }    from '@/lib/constants'
import Link from 'next/link'
import { ArrowRight, BookOpen, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 flex flex-col min-h-dvh">
        <main className="flex-1">

          {/* Hero */}
          <section className="relative overflow-hidden py-24 sm:py-32 px-4">
            {/* Background glow */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% -10%, var(--hero-glow) 0%, transparent 70%)`,
              }}
            />

            <div className="mx-auto max-w-4xl text-center">
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-muted)] bg-[var(--accent-muted)]/40 text-xs font-medium text-[var(--accent)] mb-6">
                <Zap className="w-3 h-3" /> Plateforme de blog communautaire
              </p>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.05] mb-6">
                Des idées qui{' '}
                <span className="text-gradient">méritent</span>
                {' '}d&apos;être lues
              </h1>

              <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10">
                Lisez, écrivez et partagez des articles de qualité.
                Rejoignez une communauté d&apos;auteurs et de lecteurs passionnés.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={ROUTES.REGISTER} className="btn-primary px-6 py-3 text-base">
                  Commencer à écrire
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={ROUTES.ARTICLES} className="btn-ghost px-6 py-3 text-base">
                  Explorer les articles
                </Link>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 px-4 border-t border-[var(--border)]">
            <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: 'Contenu de qualité',
                  desc: 'Des articles rédigés par des experts et des passionnés, dans des dizaines de catégories.',
                },
                {
                  icon: Users,
                  title: 'Communauté active',
                  desc: 'Interagissez avec des auteurs, suivez vos créateurs favoris et engagez la conversation.',
                },
                {
                  icon: Zap,
                  title: 'Éditeur puissant',
                  desc: 'Créez et publiez vos articles avec un éditeur riche, autosave et gestion des médias.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card card-hover p-6">
                  <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-muted)] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
        <Footer />
      </div>
      <MobileNav />
    </>
  )
}
