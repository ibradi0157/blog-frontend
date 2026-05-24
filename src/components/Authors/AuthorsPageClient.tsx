'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { FollowButton } from '@/components/profile/FollowButton';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuthorsResponse } from '@/types/api';

export function AuthorsPageClient() {
  const { data, isLoading, error } = useSWR<AuthorsResponse>(
    '/users/authors',
    () => apiClient.users.getAuthors(),
    { revalidateOnFocus: false }
  );

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  if (error) return <p className="text-center text-[var(--error)] py-8">Erreur lors du chargement des auteurs.</p>;

  const authors = data?.data ?? [];

  if (authors.length === 0) {
    return <p className="text-center text-[var(--text-muted)] py-12">Aucun auteur pour l'instant.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {authors.map((author) => (
        <div key={author.id} className="card card-hover p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Link href={`/auteurs/${author.id}`}>
              <UserAvatar user={author} size="md" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/auteurs/${author.id}`} className="block">
                <p className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate">
                  {author.displayName ?? author.username}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">@{author.username}</p>
              </Link>
            </div>
            <FollowButton authorId={author.id} size="sm" />
          </div>

          {author.bio && (
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
              {author.bio}
            </p>
          )}

          <ProfileStats
            articlesCount={author.articlesCount ?? 0}
            totalViews={author.totalViews ?? 0}
            followersCount={author.followersCount ?? 0}
            className="text-xs"
          />
        </div>
      ))}
    </div>
  );
}