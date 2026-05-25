'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { Users } from 'lucide-react';
import Link from 'next/link';

export function DashboardFollowersClient() {
  const { data } = useSWR('/subscriptions/my-followers', () =>
    (apiClient.subscriptions as any).getMyFollowers?.() ?? Promise.resolve({ data: [] })
  );
  const followers = (data as any)?.data ?? [];

  if (followers.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center gap-3 text-center">
        <Users size={40} className="text-[var(--text-muted)]" />
        <p className="text-[var(--text-muted)]">Aucun abonné pour l'instant</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {followers.map((f: any) => (
        <Link key={f.id} href={`/auteurs/${f.id}`} className="card p-4 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors">
          <UserAvatar user={f} size="md" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{f.displayName ?? f.username}</p>
            {f.username && <p className="text-xs text-[var(--text-muted)]">@{f.username}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
