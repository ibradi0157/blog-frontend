'use client';

import { UserPlus, UserCheck } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

interface FollowButtonProps {
  authorId: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function FollowButton({ authorId, className, size = 'md' }: FollowButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const { isFollowing, isToggling, toggle } = useFollow(authorId);

  // Don't show follow button for your own profile
  if (user?.id === authorId) return null;

  if (!isAuthenticated) {
    return (
      <a
        href="/connexion"
        className={cn(
          'btn-primary flex items-center gap-2',
          size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2',
          className
        )}
      >
        <UserPlus size={size === 'sm' ? 13 : 15} />
        Suivre
      </a>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={isToggling}
      className={cn(
        'flex items-center gap-2 rounded-lg font-medium transition-all duration-200',
        size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2',
        isFollowing
          ? 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--error)] hover:text-[var(--error)] bg-transparent'
          : 'btn-primary',
        isToggling && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {isFollowing ? (
        <>
          <UserCheck size={size === 'sm' ? 13 : 15} />
          <span className="group-hover:hidden">Abonné</span>
        </>
      ) : (
        <>
          <UserPlus size={size === 'sm' ? 13 : 15} />
          Suivre
        </>
      )}
    </button>
  );
}