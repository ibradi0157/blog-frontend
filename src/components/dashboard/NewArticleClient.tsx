'use client';

import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { ROUTES } from '@/lib/constants';

export function NewArticleClient() {
  const router = useRouter();

  function handleCreated(id: string) {
    router.push(`${ROUTES.DASHBOARD}/articles/${id}`);
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Nouvel article</h1>
      <ArticleEditor mode="create" onCreated={handleCreated} />
    </div>
  );
}