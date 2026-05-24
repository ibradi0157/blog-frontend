import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-[var(--accent)] text-sm font-mono tracking-widest uppercase">404</p>
      <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
        Page introuvable
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="btn-primary mt-2"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
