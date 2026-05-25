import { STORAGE_KEYS } from '@/lib/constants'

/**
 * Script bloquant exécuté avant le premier paint pour appliquer le thème
 * stocké et éviter un flash clair → sombre (ou l'inverse).
 */
export function ThemeScript() {
  const script = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEYS.THEME}');
    var resolved = 'dark';
    if (stored === 'light') {
      resolved = 'light';
    } else if (stored === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = resolved;
  } catch (_) {}
})();
`.trim()

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      // eslint-disable-next-line react/no-unknown-property
      suppressHydrationWarning
    />
  )
}
