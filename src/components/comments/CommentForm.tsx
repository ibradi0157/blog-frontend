'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { cn } from '@/lib/cn';

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onSubmit: (content: string, parentId?: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  articleId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = 'Partagez votre avis…',
  autoFocus = false,
}: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('Le commentaire doit contenir au moins 2 caractères.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(trimmed, parentId);
      setContent('');
    } catch {
      setError('Impossible d\'envoyer le commentaire. Réessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card p-4 text-center text-[var(--text-secondary)] text-sm">
        <a href="/connexion" className="text-[var(--accent)] hover:underline">Connectez-vous</a>
        {' '}pour laisser un commentaire.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <UserAvatar user={user!} size="sm" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={parentId ? 2 : 3}
          disabled={isSubmitting}
          className={cn(
            'w-full rounded-lg border bg-[var(--bg-hover)] px-3 py-2 text-sm',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'border-[var(--border)] focus:border-[var(--accent)] focus:outline-none',
            'resize-none transition-colors disabled:opacity-50'
          )}
        />
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
        <div className="flex items-center gap-2 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="btn-primary text-xs px-4 py-1.5 disabled:opacity-50"
          >
            {isSubmitting ? 'Envoi…' : parentId ? 'Répondre' : 'Commenter'}
          </button>
        </div>
      </div>
    </form>
  );
}