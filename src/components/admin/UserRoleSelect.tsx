'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import type { RoleName } from '@/types/api';

const ROLE_LABELS: Record<RoleName, string> = {
  SIMPLE_USER: 'Utilisateur',
  MEMBER: 'Membre',
  SECONDARY_ADMIN: 'Admin secondaire',
  PRIMARY_ADMIN: 'Admin principal',
};

/** Rôles modifiables via PATCH /users/:id/role (backend). */
const CHANGEABLE_ROLES: RoleName[] = ['MEMBER', 'SECONDARY_ADMIN'];

interface UserRoleSelectProps {
  userId: string;
  currentRole: RoleName;
  canChangeRole?: boolean;
  onChanged?: (role: RoleName) => void;
  onError?: (message: string) => void;
}

export function UserRoleSelect({
  userId,
  currentRole,
  canChangeRole = false,
  onChanged,
  onError,
}: UserRoleSelectProps) {
  const [role, setRole] = useState<RoleName>(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isChangeable =
    canChangeRole &&
    currentRole !== 'PRIMARY_ADMIN' &&
    CHANGEABLE_ROLES.includes(currentRole);

  const handleChange = async (newRole: RoleName) => {
    if (newRole === role || !isChangeable) return;
    setLoading(true);
    setError('');
    try {
      await apiClient.users.changeRole(userId, { role: newRole });
      setRole(newRole);
      onChanged?.(newRole);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Seul un membre peut être promu admin secondaire (PRIMARY_ADMIN requis).';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isChangeable) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]">
        {ROLE_LABELS[currentRole] ?? currentRole}
        {error && (
          <span className="text-[var(--error)]" title={error}>
            !
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={role}
        onChange={(e) => handleChange(e.target.value as RoleName)}
        disabled={loading}
        className="text-xs px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
      >
        {CHANGEABLE_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-[var(--error)] max-w-[140px]">{error}</span>}
    </div>
  );
}
