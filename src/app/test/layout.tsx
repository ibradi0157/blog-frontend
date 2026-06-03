import '@/app/globals.css';

/** Layout minimal pour les pages de test — pas d’auth, pas de sidebar. */
export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {children}
    </div>
  );
}
