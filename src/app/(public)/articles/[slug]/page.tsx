import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import api from '@/lib/api-client';
import { ArticlePageClient } from '@/components/articles/ArticlePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: article } = await api.articles.getPublicOne(slug);
    return {
      title: `${article.title} — Blog`,
      description: article.excerpt ?? article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt ?? '',
        type: 'article',
        publishedTime: article.publishedAt ?? article.createdAt,
        authors: article.author?.displayName ? [article.author.displayName] : undefined,
        images: article.coverUrl ? [{ url: article.coverUrl }] : [],
        tags: article.tags ?? [],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt ?? '',
        images: article.coverUrl ? [article.coverUrl] : [],
      },
    };
  } catch {
    return { title: 'Article — Blog' };
  }
}

export default async function ArticleSlugPage({ params }: Props) {
  const { slug } = await params;
  let initialArticle;
  try {
    const response = await api.articles.getPublicOne(slug);
    initialArticle = response.data;
  } catch {
    notFound();
  }

  return (
    <Suspense fallback={<ArticlePageSkeleton />}>
      <ArticlePageClient slug={slug} initialArticle={initialArticle} />
    </Suspense>
  );
}

function ArticlePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="w-full aspect-[21/9] rounded-2xl bg-[var(--bg-hover)] mb-8" />
      <div className="h-10 bg-[var(--bg-hover)] rounded-lg w-3/4 mb-4" />
      <div className="h-6 bg-[var(--bg-hover)] rounded-lg w-1/2 mb-8" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 bg-[var(--bg-hover)] rounded mb-3 last:w-2/3" />
      ))}
    </div>
  );
}
