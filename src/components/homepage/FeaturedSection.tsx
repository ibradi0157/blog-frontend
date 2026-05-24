'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { ArticleSummary } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { estimateReadTime, resolveImageUrl } from '@/lib/utils';
import { UserAvatar } from '@/components/profile/UserAvatar';

interface FeaturedSectionProps {
  articles: ArticleSummary[];
}

export function FeaturedSection({ articles }: FeaturedSectionProps) {
  if (!articles || articles.length === 0) return null;

  const [hero, ...rest] = articles.slice(0, 4);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title="À la une" href={ROUTES.ARTICLES} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {hero && (
            <Link
              href={ROUTES.ARTICLE(hero.slug ?? hero.id)}
              className="card card-hover group relative col-span-1 flex flex-col overflow-hidden lg:col-span-2"
            >
              {hero.coverUrl && (
                <div className="relative h-56 w-full overflow-hidden sm:h-72">
                  <Image
                    src={resolveImageUrl(hero.coverUrl)!}
                    alt={hero.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                {hero.category && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {hero.category.name}
                  </span>
                )}
                <h2 className="text-xl font-bold leading-snug text-[var(--text-primary)] line-clamp-3 group-hover:text-[var(--accent)] transition-colors">
                  {hero.title}
                </h2>
                {hero.excerpt && (
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{hero.excerpt}</p>
                )}
                <ArticleFooter article={hero} />
              </div>
            </Link>
          )}

          <div className="flex flex-col gap-4">
            {rest.map(article => (
              <Link
                key={article.id}
                href={ROUTES.ARTICLE(article.slug ?? article.id)}
                className="card card-hover group flex gap-4 overflow-hidden p-4"
              >
                {article.coverUrl && (
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={resolveImageUrl(article.coverUrl)!}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5 overflow-hidden">
                  {article.category && (
                    <span className="text-xs font-medium text-[var(--accent)]">{article.category.name}</span>
                  )}
                  <h3 className="text-sm font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                    {article.title}
                  </h3>
                  <ArticleFooter article={article} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleFooter({ article }: { article: ArticleSummary }) {
  const author = article.author;

  return (
    <div className="mt-auto flex items-center gap-3 text-xs text-[var(--text-muted)]">
      {author && <UserAvatar user={author} size="xs" />}
      {author && (
        <span className="font-medium text-[var(--text-secondary)]">{author.displayName}</span>
      )}
      {article.excerpt && (
        <>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {estimateReadTime(article.excerpt)}
          </span>
        </>
      )}
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
      <Link href={href} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
        Voir tout →
      </Link>
    </div>
  );
}
