import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import type { Article } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { formatDate, estimateReadTime, resolveImageUrl } from '@/lib/utils';
import { UserAvatar } from '@/components/profile/UserAvatar';

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const author = article.author;

  return (
    <header className="mb-10">
      {article.category && (
        <Link
          href={`${ROUTES.ARTICLES}?category=${article.category.slug ?? ''}`}
          className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          {article.category.name}
        </Link>
      )}

      <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mb-8 text-lg text-[var(--text-secondary)] leading-relaxed">{article.excerpt}</p>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-t border-[var(--border)] py-4 text-sm text-[var(--text-muted)]">
        {author && (
          <Link
            href={ROUTES.AUTHOR(author.id)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <UserAvatar user={author} size="sm" />
            <span className="block font-medium text-[var(--text-secondary)]">{author.displayName}</span>
          </Link>
        )}

        <span className="h-4 w-px bg-[var(--border)]" aria-hidden />

        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(article.publishedAt ?? article.createdAt)}
        </span>

        {article.content && (
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {estimateReadTime(article.content)}
          </span>
        )}
      </div>

      {article.coverUrl && (
        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-2xl sm:h-80 md:h-[420px]">
          <Image
            src={resolveImageUrl(article.coverUrl)!}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}
    </header>
  );
}
