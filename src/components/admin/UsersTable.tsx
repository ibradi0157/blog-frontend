'use client';

import { useState } from 'react';
import { Search, Ban } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { UserRoleSelect } from './UserRoleSelect';
import { ROLES } from '@/lib/constants';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { RoleName } from '@/types/api';

export function UsersTable() {
  const { user: currentUser } = useAuth();
  const canChangeRole = currentUser?.role === ROLES.PRIMARY_ADMIN;
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<RoleName | ''>('');
  const [page, setPage] = useState(1);

  const { users, total, isLoading, banUser } = useUsers({ page, limit: 20, search: search || undefined, role: role || undefined });

  const handleBan = async (userId: string, displayName?: string) => {
    if (!confirm(`Bannir ${displayName ?? 'cet utilisateur'} ?`)) return;
    await banUser(userId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un utilisateur…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value as RoleName | ''); setPage(1); }}
          className="px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none"
        >
          <option value="">Tous les rôles</option>
          <option value="SIMPLE_USER">Utilisateur</option>
          <option value="MEMBER">Membre</option>
          <option value="SECONDARY_ADMIN">Admin secondaire</option>
          <option value="PRIMARY_ADMIN">Admin principal</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {['Utilisateur', 'Rôle', 'Inscrit le', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {[1,2,3,4].map((j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-24" /></td>
                      ))}
                    </tr>
                  ))
                : users.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user as any} size="sm" />
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{(user as any).displayName}</p>
                            <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <UserRoleSelect
                          userId={user.id}
                          currentRole={(user as any).role?.name ?? (user as any).role}
                          canChangeRole={canChangeRole}
                        />
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleBan(user.id, (user as any).displayName)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors" title="Bannir">
                            <Ban size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{total} utilisateur{total > 1 ? 's' : ''}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Précédent</button>
          <button onClick={() => setPage((p) => p+1)} disabled={users.length < 20} className="px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-hover)] transition-colors">Suivant</button>
        </div>
      </div>
    </div>
  );
}
