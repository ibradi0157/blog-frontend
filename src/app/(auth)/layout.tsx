export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12 bg-[var(--bg-base)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Blog<span className="text-[var(--accent)]">.</span>
            </span>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
