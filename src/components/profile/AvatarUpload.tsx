'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

interface AvatarUploadProps {
  onSuccess?: (avatarUrl: string) => void;
  className?: string;
}

export function AvatarUpload({ onSuccess, className }: AvatarUploadProps) {
  const { user, login } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5 Mo.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      if (!user?.id) return;
      const result = await apiClient.users.uploadAvatar(user.id, file);
      onSuccess?.(result.data?.avatarUrl ?? '');
    } catch {
      setError('Échec de l\'upload. Réessayez.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className="relative group cursor-pointer"
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <UserAvatar user={user!} size="xl" />
        <div className={cn(
          'absolute inset-0 rounded-full flex items-center justify-center',
          'bg-black/50 transition-opacity',
          uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {uploading
            ? <Loader2 size={20} className="text-white animate-spin" />
            : <Camera size={20} className="text-white" />
          }
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-50"
      >
        {uploading ? 'Upload en cours…' : 'Changer l\'avatar'}
      </button>

      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}