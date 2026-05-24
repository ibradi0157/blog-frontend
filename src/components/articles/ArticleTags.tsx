// ─── ArticleTags ──────────────────────────────────────────────────────────────
'use client';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface ArticleTagsProps { tags: string[]; }

export function ArticleTags({ tags }: ArticleTagsProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-[var(--text-muted)]" />
      {tags.map(tag => (
        <Link
          key={tag}
          href={`${ROUTES.SEARCH}?tag=${encodeURIComponent(tag)}`}
          className="rounded-full border border-[var(--border)] bg-[var(--bg-hover)] px-3 py-1 text-xs text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}