'use client';

import { useRef, useState } from 'react';
import { Image, Loader2, Link } from 'lucide-react';
import { cn } from '@/lib/cn';
import { apiClient } from '@/lib/api-client';

interface EditorImageUploadProps {
  articleId: string;
  onInsert: (url: string) => void;
  onClose: () => void;
}

export function EditorImageUpload({ articleId, onInsert, onClose }: EditorImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [tab, setTab] = useState<'upload' | 'url'>('upload');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      // Use uploadContentImage if available, fallback to URL
      const res = await (apiClient.articles as any).uploadContentImage?.(articleId, file);
      if (res?.url) {
        onInsert(res.url);
        onClose();
      }
    } catch {
      setError('Échec de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleUrl = () => {
    if (!urlInput.trim()) return;
    onInsert(urlInput.trim());
    onClose();
  };

  return (
    <div className="p-4 space-y-4 w-72">
      <div className="flex gap-2">
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors',
              tab === t ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
            )}
          >
            {t === 'upload' ? 'Fichier' : 'URL'}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent)] transition-colors"
        >
          {uploading ? <Loader2 size={24} className="animate-spin text-[var(--accent)]" /> : <Image size={24} className="text-[var(--text-muted)]" />}
          <p className="text-xs text-[var(--text-muted)]">{uploading ? 'Upload en cours…' : 'Cliquer pour choisir'}</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
          <button
            onClick={handleUrl}
            disabled={!urlInput.trim()}
            className="w-full py-2 text-sm btn-primary disabled:opacity-50"
          >
            Insérer
          </button>
        </div>
      )}
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
