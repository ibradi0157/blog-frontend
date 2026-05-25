import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageLoader } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api-client';

interface AuthorPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  try {
    const data = await apiClient.users.getAuthorProfile(params.id);
    const profile = data.profile;
    return {
      title: `${profile.displayName ?? profile.username} — Auteur`,
      description: profile.bio ?? `Articles de ${profile.username}`,
    };
  } catch {
    return { title: 'Auteur introuvable' };
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  let profileData;
  try {
    profileData = await apiClient.users.getAuthorProfile(params.id);
  } catch {
    notFound();
  }

  const { profile, articles, followersCount } = profileData;

  return (
    <PageWrapper>
      <div className="py-8 space-y-8">
        <ProfileHeader
          profile={profile}
          followersCount={followersCount}
          totalViews={profile.totalViews}
        />

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            Articles publiés
          </h2>
          {articles?.length > 0 ? (
            <ArticleGrid articles={articles} />
          ) : (
            <p className="text-[var(--text-muted)] text-sm">Aucun article publié.</p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}