'use client';

import { useEffect } from 'react';
import { useArticle } from '@/hooks/useArticle';
import { trackDebounced } from '@/lib/analytics';
import { ArticleHeader } from '@/components/articles/ArticleHeader';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { ArticleActions } from '@/components/articles/ArticleActions';
import { ArticleMeta } from '@/components/articles/ArticleMeta';
import { ArticleTags } from '@/components/articles/ArticleTags';
import { ArticleStats } from '@/components/articles/ArticleStats';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { ReadingProgress } from '@/components/articles/ReadingProgress';
import type { Article } from '@/types/api';

interface ArticlePageClientProps {
  slug: string;
  initialArticle?: Article;
}

export function ArticlePageClient({ slug, initialArticle }: ArticlePageClientProps) {
  const { article, isLoading } = useArticle(slug, initialArticle);

  useEffect(() => {
    if (!article?.id) return;
    trackDebounced(`article-view-${article.id}`, {
      eventType: 'article_view',
      articleId: article.id,
    });
  }, [article?.id]);

  if (isLoading || !article) return null;

  return (
    <>
      <ReadingProgress target="#article-content" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <ArticleHeader article={article} />

        <div className="mt-8 mb-6 pb-6 border-b border-[var(--border)]">
          <ArticleMeta article={article} />
        </div>

        <div className="mb-8">
          <ArticleStats content={article.content ?? ''} />
        </div>

        <div className="mb-10">
          <ArticleActions articleId={article.id} />
        </div>

        <ArticleContent html={article.content ?? ''} />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            <ArticleTags tags={article.tags} />
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <ArticleActions articleId={article.id} />
        </div>

        <RelatedArticles
          currentArticleId={article.id}
          categorySlug={article.category?.slug ?? undefined}
        />
      </article>
    </>
  );
}
