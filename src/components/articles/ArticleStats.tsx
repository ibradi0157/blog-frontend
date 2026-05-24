import { Eye, Heart, Clock, MessageSquare } from 'lucide-react';
import { formatCount, estimateReadTime } from '@/lib/utils';

interface ArticleStatsProps {
  viewCount?: number;
  likesCount?: number;
  commentsCount?: number;
  content?: string;
}

export function ArticleStats({ viewCount = 0, likesCount = 0, commentsCount = 0, content = '' }: ArticleStatsProps) {
  const readTime = estimateReadTime(content);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
      {viewCount > 0 && (
        <span className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {formatCount(viewCount)} vue{viewCount !== 1 ? 's' : ''}
        </span>
      )}
      {likesCount > 0 && (
        <span className="flex items-center gap-1.5">
          <Heart className="h-4 w-4" />
          {formatCount(likesCount)} j&apos;aime
        </span>
      )}
      {commentsCount > 0 && (
        <span className="flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4" />
          {formatCount(commentsCount)} commentaire{commentsCount !== 1 ? 's' : ''}
        </span>
      )}
      {content && (
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {readTime}
        </span>
      )}
    </div>
  );
}
