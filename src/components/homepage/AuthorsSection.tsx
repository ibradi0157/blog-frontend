'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import type { PublicUserProfile } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { UserAvatar } from '@/components/profile/UserAvatar';

interface AuthorsSectionProps {
  authors: PublicUserProfile[];
}

export function AuthorsSection({ authors }: AuthorsSectionProps) {
  if (!authors || authors.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Auteurs à suivre</h2>
          </div>
          <Link
            href={ROUTES.AUTHORS}
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Voir tous →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {authors.slice(0, 8).map(author => (
            <Link
              key={author.id}
              href={ROUTES.AUTHOR(author.id)}
              className="card card-hover group flex items-start gap-4 p-5"
            >
              <UserAvatar user={author} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {author.displayName}
                </p>
                {author.bio && (
                  <p className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-2">{author.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
