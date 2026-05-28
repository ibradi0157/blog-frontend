import { PageLoader } from '@/components/ui/loading-spinner'

export const metadata = { title: 'Pages légales' }

export default function AdminLegalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pages légales</h1>
        <p className="max-w-2xl text-sm text-[var(--text-muted)]">
          Gérez ici les pages légales du site : confidentialité, conditions générales et mentions légales.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Aucune interface de gestion n'est encore implémentée pour cette page. Elle est prête à être reliée aux endpoints backend.
        </p>
      </div>
    </div>
  )
}
