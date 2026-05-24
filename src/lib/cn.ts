/**
 * src/lib/cn.ts
 *
 * Fusionne des noms de classes Tailwind CSS en gérant les conflits.
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour
 * résoudre les conflits de classes (ex: "p-4 p-8" → "p-8").
 *
 * Installation requise :
 *   pnpm add clsx tailwind-merge
 *
 * @example
 *   cn('px-4 py-2', isActive && 'bg-accent', 'text-sm')
 *   cn({ 'opacity-50': disabled, 'cursor-pointer': !disabled })
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
