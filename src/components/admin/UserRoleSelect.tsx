'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import type { RoleName } from '@/types/api';

const ROLES: { value: RoleName; label: string }[] = [
  { value: 'SIMPLE_USER', label: 'Utilisateur' },
  { value: 'MEMBER', label: 'Membre' },
  { value: 'SECONDARY_ADMIN', label: 'Admin secondaire' },
  { value: 'PRIMARY_ADMIN', label: 'Admin principal' },
];

interface UserRoleSelectProps {
  userId: string;
  currentRole: RoleName;
  onChanged?: (role: RoleName) => void;
}

export function UserRoleSelect({ userId, currentRole, onChanged }: UserRoleSelectProps) {
  const [role, setRole] = useState<RoleName>(currentRole);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newRole: RoleName) => {
    if (newRole === role) return;
    setLoading(true);
    try {
      await apiClient.users.changeRole(userId, { role: newRole });
      setRole(newRole);
      onChanged?.(newRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value as RoleName)}
      disabled={loading}
      className="text-xs px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
    >
      {ROLES.map((r) => (
        <option key={r.value} value={r.value}>{r.label}</option>
      ))}
    </select>
  );
}
