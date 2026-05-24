export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
          style={{ animation: 'spin .7s linear infinite' }}
        />
        <span className="text-sm text-[var(--text-muted)] tracking-wide">Chargement…</span>
      </div>
    </div>
  )
}
