import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CategoryPageClient } from '@/components/category/CategoryPageClient';
import { PageLoader } from '@/components/ui/loading-spinner';
import api from '@/lib/api-client';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.categories.getAll();
    const cat = res.data?.find((c) => c.slug === slug);
    return cat
      ? { title: `${cat.name} — Blog`, description: cat.description ?? undefined }
      : { title: 'Catégorie — Blog' };
  } catch {
    return { title: 'Catégorie — Blog' };
  }
}

export default async function CategorySlugPage({ params }: Props) {
  const { slug } = await params;
  return (
    <PageWrapper>
      <Suspense fallback={<PageLoader />}>
        <CategoryPageClient slug={slug} />
      </Suspense>
    </PageWrapper>
  );
}
