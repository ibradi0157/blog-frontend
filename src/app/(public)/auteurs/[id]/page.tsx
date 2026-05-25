import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageLoader } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api-client';
import { PublicUserProfile } from '@/types/api';

interface AuthorPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  try {
    const data = await apiClient.users.getAuthorProfile(params.id);
    const profile = data.data;
    return {
      title: `${profile.displayName} — Auteur`,
      description: `Articles de ${profile.displayName}`,
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

  const authorData = profileData.data;
  
  // Adapt AuthorProfileResponse data to PublicUserProfile shape for ProfileHeader
  const profileForHeader: PublicUserProfile = {
    id: authorData.id,
    displayName: authorData.displayName,
    username: authorData.displayName, // Fallback since not in response
    email: authorData.email,
    avatarUrl: authorData.profilePicture,
    bio: undefined,
    website: undefined,
    twitter: undefined,
    github: undefined,
    linkedin: undefined,
    youtube: undefined,
    instagram: undefined,
    articlesCount: authorData.articlesCount,
    totalViews: authorData.totalViews,
    role: {} as any, // Type adaptation
    createdAt: authorData.createdAt,
  };

  return (
    <PageWrapper>
      <div className="py-8 space-y-8">
        <ProfileHeader
          profile={profileForHeader}
          followersCount={undefined}
          totalViews={authorData.totalViews}
        />

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            Articles publiés
          </h2>
          {authorData.articles?.length > 0 ? (
            <ArticleGrid articles={authorData.articles as any} />
          ) : (
            <p className="text-[var(--text-muted)] text-sm">Aucun article publié.</p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}