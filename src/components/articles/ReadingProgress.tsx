'use client';

import { useEffect, useState, useCallback } from 'react';

interface ReadingProgressProps {
  /** Sélecteur CSS de l'élément à tracker (défaut : le contenu de l'article) */
  target?: string;
  /** Couleur de la barre (défaut : accent) */
  color?: string;
  /** Hauteur en px */
  height?: number;
}

export function ReadingProgress({
  target = '#article-content',
  color = 'var(--accent)',
  height = 3,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const updateProgress = useCallback(() => {
    const el = document.querySelector(target) ?? document.documentElement;
    const rect = el.getBoundingClientRect();
    const elTop = rect.top + window.scrollY;
    const elHeight = (el as HTMLElement).offsetHeight;

    const scrolled = window.scrollY - elTop;
    const total = elHeight - window.innerHeight;

    if (total <= 0) {
      setProgress(0);
      setVisible(false);
      return;
    }

    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    setProgress(pct);
    setVisible(window.scrollY > 80);
  }, [target]);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    const frame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  return (
    <div
      role="progressbar"
      aria-label="Progression de lecture"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 300ms ease',
      }}
    >
      {/* Track */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--border)',
        }}
      />
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, var(--accent-hover))`,
          transition: 'width 100ms linear',
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
  );
}