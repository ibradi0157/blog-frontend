'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { CommentListSkeleton } from './CommentSkeleton';
import { ReportModal } from './ReportModal';

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { comments, total, isLoading, addComment, replyToComment, deleteComment, likeComment, reportComment } = useComments(articleId);
  const [reportingId, setReportingId] = useState<string | null>(null);

  const handleReport = async (reason: string) => {
    if (!reportingId) return;
    await reportComment(reportingId, reason);
    setReportingId(null);
  };

  return (
    <section className="mt-12 pt-8 border-t border-[var(--border)]">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)] mb-6">
        <MessageSquare size={20} className="text-[var(--accent)]" />
        {total > 0 ? `${total} commentaire${total > 1 ? 's' : ''}` : 'Commentaires'}
      </h2>

      <div className="mb-8">
        <CommentForm
          articleId={articleId}
          onSubmit={async (content) => { await addComment({ articleId, content }); }}
        />
      </div>

      {isLoading ? (
        <CommentListSkeleton />
      ) : comments.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-8 text-sm">
          Aucun commentaire pour l'instant. Soyez le premier !
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onLike={likeComment}
              onReply={async (content, parentId) => {
                await replyToComment({ articleId, content, parentId });
              }}
              onDelete={deleteComment}
              onReport={(id) => setReportingId(id)}
            />
          ))}
        </div>
      )}

      {reportingId && (
        <ReportModal
          onConfirm={handleReport}
          onClose={() => setReportingId(null)}
        />
      )}
    </section>
  );
}