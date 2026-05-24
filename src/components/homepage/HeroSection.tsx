'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Zap } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const STATS = [
  { icon: BookOpen, label: 'Articles publiés', value: '1 200+' },
  { icon: Users, label: 'Auteurs actifs', value: '340+' },
  { icon: Zap, label: 'Lectures ce mois', value: '48 000+' },
];

export function HeroSection({
  title = 'Les idées qui comptent,\nréunies en un lieu.',
  subtitle = "Découvrez des articles de fond, des analyses et des récits écrits par une communauté d'auteurs passionnés.",
  ctaLabel = 'Explorer les articles',
  ctaUrl,
}: HeroSectionProps) {
  const href = ctaUrl || ROUTES.ARTICLES;

  return (
    <section className="relative overflow-hidden pb-20 pt-28 md:pt-36">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[800px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-muted)] px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          Plateforme ouverte à tous
        </div>

        {/* Title */}
        <h1 className="text-gradient mb-6 whitespace-pre-line text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={href} className="btn-primary flex items-center gap-2 px-7 py-3 text-sm font-semibold">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={ROUTES.REGISTER} className="btn-ghost flex items-center gap-2 px-7 py-3 text-sm font-semibold">
            Créer un compte gratuit
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-10">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                <Icon className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">{value}</span>
              <span className="text-xs text-[var(--text-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}