import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CategoryPageClient } from './CategoryPageClient';
import { PageLoader } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api-client';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const data = await apiClient.categories.getAll();
    const cat = data.data?.find((c) => c.slug === params.slug);
    if (!cat) return { title: 'Catégorie — Blog' };
    return {
      title: `${cat.name} — Blog`,
      description: cat.description ?? `Articles dans la catégorie ${cat.name}`,
    };
  } catch {
    return { title: 'Catégorie — Blog' };
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <PageWrapper>
      <Suspense fallback={<PageLoader />}>
        <CategoryPageClient slug={params.slug} />
      </Suspense>
    </PageWrapper>
  );
}