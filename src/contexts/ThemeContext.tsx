'use client'

/**
 * src/contexts/ThemeContext.tsx
 *
 * Provider pour le thème dark/light de l'application.
 *
 * Comportement :
 *  1. ThemeScript applique le thème avant le premier paint (anti-FOUC)
 *  2. Au montage, lit le thème depuis localStorage
 *  3. Ajoute/retire la classe "dark" sur <html>
 *  4. Persiste le choix dans localStorage
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
  return 'dark'
}

function applyTheme(resolved: 'dark' | 'light'): void {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = resolved
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
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  // ── Hydratation depuis localStorage + sync DOM (ThemeScript) ───────────────
  useEffect(() => {
    const stored = readStoredTheme()
    const resolved = resolveTheme(stored)
    setThemeState(stored)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  // ── Écoute des changements de préférence système ──────────────────────────
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  // ── setTheme ──────────────────────────────────────────────────────────────
  const setTheme = useCallback((next: Theme) => {
    const resolved = resolveTheme(next)
    setThemeState(next)
    setResolvedTheme(resolved)
    localStorage.setItem(STORAGE_KEYS.THEME, next)
    applyTheme(resolved)
  }, [])

  // ── toggleTheme ───────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    const current = resolveTheme(theme)
    setTheme(current === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

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
