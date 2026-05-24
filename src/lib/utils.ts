/**
 * src/lib/utils.ts
 *
 * Fonctions utilitaires pures (pas de dépendances React).
 * Formatage, slugification, lecture estimée, troncature, dates…
 */

// ─────────────────────────────────────────────
// DATES
// ─────────────────────────────────────────────

/** Options de formatage réutilisables */
const DATE_FORMAT_SHORT: Intl.DateTimeFormatOptions = {
  day:   '2-digit',
  month: 'short',
  year:  'numeric',
}

const DATE_FORMAT_FULL: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day:     '2-digit',
  month:   'long',
  year:    'numeric',
}

/**
 * Formate une date ISO en "12 janv. 2025".
 */
export function formatDate(
  iso: string | null | undefined,
  locale = 'fr-FR'
): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(locale, DATE_FORMAT_SHORT).format(
      new Date(iso)
    )
  } catch {
    return iso
  }
}

/**
 * Formate une date ISO en "lundi 12 janvier 2025".
 */
export function formatDateFull(
  iso: string | null | undefined,
  locale = 'fr-FR'
): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(locale, DATE_FORMAT_FULL).format(
      new Date(iso)
    )
  } catch {
    return iso
  }
}

/**
 * Retourne un libellé relatif lisible : "il y a 3 minutes", "il y a 2 jours"…
 * Utilise Intl.RelativeTimeFormat (pas de dépendance externe).
 */
export function timeAgo(iso: string | null | undefined, locale = 'fr-FR'): string {
  if (!iso) return '—'

  const rtf   = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diffMs = new Date(iso).getTime() - Date.now()
  const diffS  = Math.round(diffMs / 1_000)

  const thresholds: [number, Intl.RelativeTimeFormatUnit][] = [
    [60,          'second'],
    [3_600,       'minute'],
    [86_400,      'hour'],
    [7 * 86_400,  'day'],
    [30 * 86_400, 'week'],
    [365 * 86_400,'month'],
  ]

  for (const [limit, unit] of thresholds) {
    const divisor = limit / (unit === 'second' ? 1 : thresholds[thresholds.indexOf([limit, unit]) - 1]?.[0] ?? 1)
    if (Math.abs(diffS) < limit) {
      const val = Math.round(diffS / (limit / (unit === 'second' ? limit : 60)))
      return rtf.format(val, unit)
    }
  }

  const years = Math.round(diffS / (365 * 86_400))
  return rtf.format(years, 'year')
}

// ─────────────────────────────────────────────
// TEXTE
// ─────────────────────────────────────────────

/**
 * Tronque un texte à un nombre de caractères et ajoute "…".
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Transforme un texte en slug URL-safe.
 * "Mon Article ! En 2025" → "mon-article-en-2025"
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // supprime les accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')      // garde lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, '-')              // espaces → tirets
    .replace(/-+/g, '-')               // tirets multiples → un seul
}

/**
 * Capitalise la première lettre d'une chaîne.
 */
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Retourne les initiales d'un nom (max 2 lettres).
 * "Jean Dupont" → "JD" | "Alice" → "A"
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

/**
 * Supprime toutes les balises HTML d'une chaîne.
 * Utilisé pour calculer le temps de lecture depuis du HTML.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ─────────────────────────────────────────────
// LECTURE
// ─────────────────────────────────────────────

/** Vitesse de lecture moyenne (mots par minute) */
const WORDS_PER_MINUTE = 230

/**
 * Estime le temps de lecture d'un contenu HTML ou texte.
 * Retourne une chaîne lisible : "3 min de lecture".
 *
 * @param content  Contenu HTML ou texte brut
 */
export function estimateReadTime(content: string): string {
  const text  = content.includes('<') ? stripHtml(content) : content
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  return `${minutes} min de lecture`
}

/**
 * Estime le temps de lecture en minutes (nombre brut).
 */
export function estimateReadTimeMinutes(content: string): number {
  const text  = content.includes('<') ? stripHtml(content) : content
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

// ─────────────────────────────────────────────
// NOMBRES
// ─────────────────────────────────────────────

/**
 * Formate un grand nombre de façon compacte.
 * 1234 → "1,2k" | 1_500_000 → "1,5M"
 */
export function formatCount(n: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    notation:        'compact',
    compactDisplay:  'short',
    maximumFractionDigits: 1,
  }).format(n)
}

/**
 * Formate un nombre avec séparateurs de milliers.
 * 1234567 → "1 234 567"
 */
export function formatNumber(n: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(n)
}

// ─────────────────────────────────────────────
// URLs & FICHIERS
// ─────────────────────────────────────────────

/**
 * Construit l'URL complète d'une image backend.
 * Si l'URL est déjà absolue, la retourne telle quelle.
 * Si null/undefined, retourne undefined.
 */
export function resolveImageUrl(
  path: string | null | undefined,
  baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

/**
 * Retourne l'extension d'un nom de fichier.
 * "photo.jpg" → "jpg"
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

/**
 * Formate une taille de fichier en octets vers un libellé lisible.
 * 1_500_000 → "1,4 Mo"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1_024)          return `${bytes} o`
  if (bytes < 1_024 ** 2)     return `${(bytes / 1_024).toFixed(1)} Ko`
  if (bytes < 1_024 ** 3)     return `${(bytes / 1_024 ** 2).toFixed(1)} Mo`
  return `${(bytes / 1_024 ** 3).toFixed(1)} Go`
}

// ─────────────────────────────────────────────
// TABLEAUX / OBJETS
// ─────────────────────────────────────────────

/**
 * Supprime les clés dont la valeur est undefined/null d'un objet.
 * Utile pour construire des query params propres.
 */
export function omitNullish<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>
}

/**
 * Groupe un tableau d'objets par une clé.
 * @example groupBy(articles, 'categoryId')
 */
export function groupBy<T>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key])
    acc[k] = acc[k] ? [...acc[k], item] : [item]
    return acc
  }, {} as Record<string, T[]>)
}

// ─────────────────────────────────────────────
// CLIPBOARD
// ─────────────────────────────────────────────

/**
 * Copie un texte dans le presse-papier.
 * Retourne true si succès, false sinon.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback pour les navigateurs anciens
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'absolute'
      el.style.opacity  = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      return true
    } catch {
      return false
    }
  }
}
