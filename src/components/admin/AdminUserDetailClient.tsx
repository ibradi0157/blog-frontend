'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { UserRoleSelect } from './UserRoleSelect';
import { useToast } from '@/components/ui/toaster';
import { formatDate } from '@/lib/utils';
import { User, Mail, Calendar, Shield, FileText, Eye, Heart, Ban } from 'lucide-react';
import type { RoleName } from '@/types/api';

export interface AdminUserDetailClientProps {
  userId: string;
}

export function AdminUserDetailClient({ userId }: AdminUserDetailClientProps) {
  const { toast } = useToast();
  const { data, mutate, isLoading } = useSWR(
    `/users/${userId}`,
    () => (apiClient.users as any).getById?.(userId) ?? apiClient.users.getAll().then((r: any) => ({ data: r?.data?.find((u: any) => u.id === userId) }))
  );

  const user = (data as any)?.data ?? (data as any);

  const handleBan = async () => {
    if (!confirm(`Bannir ${user?.displayName ?? 'cet utilisateur'} ?`)) return;
    try {
      await apiClient.users.ban(userId);
      await mutate();
      toast('Utilisateur banni.', 'success');
    } catch {
      toast('Erreur lors du bannissement.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-[var(--bg-hover)] rounded-2xl" />
        <div className="h-48 bg-[var(--bg-hover)] rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-[var(--text-muted)]">Utilisateur introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {user.displayName ?? user.username ?? 'Utilisateur'}
        </h1>
        <button
          onClick={handleBan}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors"
        >
          <Ban size={14} />
          Bannir
        </button>
      </div>

      {/* Infos */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Informations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <User size={16} className="text-[var(--text-muted)]" />
            <span>ID : <code className="text-[var(--text-primary)] text-xs">{user.id}</code></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <Mail size={16} className="text-[var(--text-muted)]" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <Calendar size={16} className="text-[var(--text-muted)]" />
            <span>Inscrit le {user.createdAt ? formatDate(user.createdAt) : '—'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <Shield size={16} className="text-[var(--text-muted)]" />
            <div className="flex items-center gap-2">
              <span>Rôle :</span>
              <UserRoleSelect
                userId={userId}
                currentRole={(user.role ?? 'SIMPLE_USER') as RoleName}
                onChanged={() => { mutate(); toast('Rôle mis à jour.', 'success'); }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Articles', value: user.articlesCount ?? 0 },
          { icon: Eye,      label: 'Vues',     value: user.totalViews    ?? 0 },
          { icon: Heart,    label: 'Likes',    value: user.totalLikes    ?? 0 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5 text-center">
            <Icon size={20} className="mx-auto mb-2 text-[var(--accent)]" />
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value.toLocaleString('fr-FR')}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="card p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-3">Bio</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{user.bio}</p>
        </div>
      )}
    </div>
  );
}
