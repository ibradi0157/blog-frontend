import { Suspense } from 'react';
import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { PageLoader } from '@/components/ui/loading-spinner';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface Props { params: Promise<{ id: string }> }

export const metadata = { title: 'Modifier l\'article — Dashboard' };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  return (
    <AuthGuard>
      <Suspense fallback={<PageLoader />}>
        <ArticleEditor mode="edit" articleId={id} />
      </Suspense>
    </AuthGuard>
  );
}
