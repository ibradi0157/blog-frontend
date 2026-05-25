'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { apiClient } from '@/lib/api-client';

interface EditorCoverUploadProps {
  articleId: string;
  currentCoverUrl?: string | null;
  onCoverChange: (url: string | null) => void;
}

export function EditorCoverUpload({ articleId, currentCoverUrl, onCoverChange }: EditorCoverUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const res = await (apiClient.articles as any).uploadCover?.(articleId, file);
      if (res?.coverUrl || res?.data?.coverUrl) {
        onCoverChange(res?.coverUrl ?? res?.data?.coverUrl);
      }
    } catch {
      setError('Échec de l\'upload de la couverture');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Image de couverture</label>
      {currentCoverUrl ? (
        <div className="relative group rounded-xl overflow-hidden aspect-video">
          <img src={currentCoverUrl} alt="Couverture" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              title="Changer"
            >
              <ImagePlus size={18} />
            </button>
            <button
              onClick={() => onCoverChange(null)}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-red-500/50 transition-colors"
              title="Supprimer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className={cn(
            'flex flex-col items-center gap-3 p-8 border-2 border-dashed border-[var(--border)]',
            'rounded-xl cursor-pointer hover:border-[var(--accent)] transition-colors'
          )}
        >
          {uploading
            ? <Loader2 size={28} className="text-[var(--accent)] animate-spin" />
            : <ImagePlus size={28} className="text-[var(--text-muted)]" />
          }
          <p className="text-xs text-[var(--text-muted)] text-center">
            {uploading ? 'Upload en cours…' : 'Cliquer pour ajouter une image de couverture'}
          </p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
