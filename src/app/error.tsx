'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-[var(--error)] text-sm font-mono tracking-widest uppercase">Erreur</p>
      <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
        Quelque chose s&apos;est mal passé
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md text-sm font-mono">
        {error.message ?? 'Une erreur inattendue est survenue.'}
      </p>
      <button onClick={reset} className="btn-primary mt-2">
        Réessayer
      </button>
    </div>
  )
}
