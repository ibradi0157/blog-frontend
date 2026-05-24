'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { timeAgo, estimateReadTime, resolveImageUrl } from '@/lib/utils';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { BookOpen } from 'lucide-react';
import type { ArticleSummary } from '@/types/api';

interface RelatedArticlesProps {
  currentArticleId: string;
  categorySlug?: string;
  limit?: number;
}

export function RelatedArticles({
  currentArticleId,
  categorySlug,
  limit = 3,
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await api.articles.getPublic({ page: 1, limit: limit + 1 });
        const filtered = (res.data ?? [])
          .filter(a => a.id !== currentArticleId)
          .filter(a => !categorySlug || a.category?.slug === categorySlug)
          .slice(0, limit);

        if (!cancelled) {
          setArticles(filtered);
        }
      } catch {
        // silence
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentArticleId, categorySlug, limit]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          Articles similaires
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-[var(--accent)]" />
        Articles similaires
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {articles.map((article) => {
          const slug = article.slug ?? article.id;
          const author = article.author;

          return (
            <Link
              key={article.id}
              href={ROUTES.ARTICLE(slug)}
              className="card card-hover group flex flex-col gap-3 p-4 no-underline"
            >
              {article.coverUrl && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-[var(--bg-hover)]">
                  <Image
                    src={resolveImageUrl(article.coverUrl)!}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h3>

              <div className="flex items-center gap-2 mt-auto text-xs text-[var(--text-secondary)]">
                {author && (
                  <>
                    <UserAvatar user={author} size="xs" />
                    <span className="truncate">{author.displayName}</span>
                  </>
                )}
                {article.excerpt && (
                  <>
                    <span className="opacity-40">·</span>
                    <span>{estimateReadTime(article.excerpt)}</span>
                  </>
                )}
                <span className="opacity-40 ml-auto">{timeAgo(article.publishedAt ?? article.createdAt)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
