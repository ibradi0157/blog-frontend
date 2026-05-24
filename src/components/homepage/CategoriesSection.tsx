'use client';

import Link from 'next/link';
import { Grid3X3 } from 'lucide-react';
import type { Category } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

interface CategoriesSectionProps {
  categories: Category[];
}

const PALETTE = [
  { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
];

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Parcourir par catégorie</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {categories.slice(0, 8).map((category, i) => {
            const color = PALETTE[i % PALETTE.length];
            return (
              <Link
                key={category.id}
                href={`${ROUTES.ARTICLES}?category=${category.slug ?? ''}`}
                className={cn(
                  'card card-hover group flex flex-col gap-3 p-5 border',
                  color.border,
                )}
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color.bg)}>
                  <span className={cn('text-lg font-bold', color.text)}>
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className={cn('font-semibold text-sm group-hover:transition-colors', color.text)}>
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
