'use client';

import { CommentForm } from './CommentForm';

interface CommentReplyFormProps {
  articleId: string;
  parentId: string;
  replyingToUsername?: string;
  onSubmit: (content: string, parentId?: string) => Promise<void>;
  onCancel: () => void;
}

export function CommentReplyForm({
  articleId,
  parentId,
  replyingToUsername,
  onSubmit,
  onCancel,
}: CommentReplyFormProps) {
  return (
    <div className="ml-10 mt-3 animate-fade-in">
      <CommentForm
        articleId={articleId}
        parentId={parentId}
        onSubmit={onSubmit}
        onCancel={onCancel}
        placeholder={replyingToUsername ? `Répondre à @${replyingToUsername}…` : 'Votre réponse…'}
        autoFocus
      />
    </div>
  );
}