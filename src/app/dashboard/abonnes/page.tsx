'use client';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardFollowersPage() {
  const { data } = useSWR('/subscriptions/my-followers', () =>
    (apiClient.subscriptions as any).getMyFollowers?.() ?? Promise.resolve({ data: [] })
  );
  const followers = (data as any)?.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Abonnés</h1>
        <span className="text-sm text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-full border border-[var(--border)]">{followers.length}</span>
      </div>
      {followers.length === 0 ? (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <Users size={40} className="text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)]">Aucun abonné pour l'instant</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {followers.map((f: any) => (
            <Link key={f.id} href={`/auteurs/${f.id}`} className="card p-4 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors">
              <UserAvatar user={f} size="md" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">{f.displayName}</p>
                <p className="text-xs text-[var(--text-muted)]">{f.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
