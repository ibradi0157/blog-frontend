import Image from 'next/image';
import { UserAvatar } from './UserAvatar';
import { ProfileStats } from './ProfileStats';
import { FollowButton } from './FollowButton';
import { SocialLinks } from './SocialLinks';
import { PublicUserProfile } from '@/types/api';
import { resolveImageUrl } from '@/lib/utils';

interface ProfileHeaderProps {
  profile: PublicUserProfile;
  followersCount?: number;
  totalViews?: number;
}

export function ProfileHeader({ profile, followersCount = 0, totalViews = 0 }: ProfileHeaderProps) {
  const coverSrc = profile.coverUrl ? resolveImageUrl(profile.coverUrl) : undefined;

  return (
    <div className="card overflow-hidden">
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-br from-[var(--accent-muted)] to-[var(--bg-hover)]">
        {coverSrc && (
          <Image
            src={coverSrc}
            alt="Couverture profil"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Avatar overlapping cover */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="ring-4 ring-[var(--bg-card)] rounded-full">
            <UserAvatar user={{ ...profile, displayName: profile.displayName || undefined }} size="xl" />
          </div>
          <FollowButton authorId={profile.id} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            {profile.displayName || profile.username || 'Utilisateur'}
          </h1>
          {(profile.username) && (
            <p className="text-sm text-[var(--text-muted)]">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-prose">
              {profile.bio}
            </p>
          )}

          <ProfileStats
            articlesCount={profile.articlesCount ?? 0}
            totalViews={totalViews}
            followersCount={followersCount}
            className="mt-3"
          />

          {(profile.website || profile.twitter || profile.github || profile.linkedin) && (
            <SocialLinks
              website={profile.website ?? undefined}
              twitter={profile.twitter ?? undefined}
              github={profile.github ?? undefined}
              linkedin={profile.linkedin ?? undefined}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}