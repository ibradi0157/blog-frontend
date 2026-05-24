'use client'

/**
 * src/contexts/ThemeContext.tsx
 *
 * Provider pour le thème dark/light de l'application.
 *
 * Comportement :
 *  1. Au démarrage, lit le thème depuis localStorage
 *  2. Si absent, utilise la préférence système (prefers-color-scheme)
 *  3. Ajoute/retire la classe "dark" sur <html> (compatible Tailwind dark:)
 *  4. Persiste le choix dans localStorage
 *
 * Le thème par défaut vient idéalement de GET /site-settings
 * (géré dans le root layout avant le rendu client).
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { STORAGE_KEYS } from '@/lib/constants'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'system'

interface ThemeContextValue {
  /** Thème actif résolu ('dark' ou 'light') */
  resolvedTheme: 'dark' | 'light'
  /** Préférence stockée par l'utilisateur */
  theme: Theme
  /** Change le thème et le persiste */
  setTheme: (theme: Theme) => void
  /** Bascule entre dark et light */
  toggleTheme: () => void
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null)

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') return getSystemTheme()
  return theme
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEYS.THEME)
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored
  }
  return 'dark' // défaut du design system
}

function applyTheme(resolved: 'dark' | 'light'): void {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

interface ThemeProviderProps {
  children:     React.ReactNode
  /**
   * Thème par défaut (peut venir de GET /site-settings).
   * Écrasé par la préférence stockée en localStorage.
   */
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // ── Hydratation depuis localStorage ──────────────────────────────────────
  useEffect(() => {
    const stored = readStoredTheme()
    setThemeState(stored)
    applyTheme(resolveTheme(stored))
  }, [])

  // ── Écoute des changements de préférence système ──────────────────────────
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  // ── setTheme ──────────────────────────────────────────────────────────────
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEYS.THEME, next)
    applyTheme(resolveTheme(next))
  }, [])

  // ── toggleTheme ───────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme(resolveTheme(theme) === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const resolvedTheme = resolveTheme(theme)

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme() doit être utilisé dans un <ThemeProvider>')
  }
  return ctx
}
