import type { ArticleSummary } from '@/types/api';
import { ArticleCard } from './ArticleCard';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';
import { cn } from '@/lib/cn';

interface ArticleGridProps {
  articles?: ArticleSummary[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function ArticleGrid({
  articles = [],
  isLoading = false,
  skeletonCount = 6,
  className,
}: ArticleGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))
        : articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
    </div>
  );
}