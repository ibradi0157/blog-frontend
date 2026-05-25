'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
  /** Libellé visible à côté de l'icône (menu mobile, sidebar) */
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-2 rounded-[var(--radius)] transition-colors',
        'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
        showLabel ? 'w-full px-3 py-2 text-sm' : 'justify-center w-9 h-9',
        className,
      )}
      aria-label={isDark ? 'Activer le thème clair' : 'Activer le thème sombre'}
      title={isDark ? 'Thème clair' : 'Thème sombre'}
    >
      {isDark ? (
        <Sun className="w-[1.125rem] h-[1.125rem] shrink-0" aria-hidden />
      ) : (
        <Moon className="w-[1.125rem] h-[1.125rem] shrink-0" aria-hidden />
      )}
      {showLabel && (
        <span>{isDark ? 'Thème clair' : 'Thème sombre'}</span>
      )}
    </button>
  )
}
