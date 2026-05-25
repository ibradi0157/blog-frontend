import Link from 'next/link';
import { Metadata } from 'next';
import { Grid3X3 } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Catégories — Blog',
  description: 'Parcourez les articles par catégorie.',
};

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof apiClient.categories.getAll>>['data'] = [];

  try {
    const response = await apiClient.categories.getAll();
    categories = response.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <PageWrapper>
      <div className="py-12">
        <div className="flex items-center gap-2 mb-8">
          <Grid3X3 className="h-6 w-6 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Catégories</h1>
        </div>

        {categories.length === 0 ? (
          <p className="text-[var(--text-muted)]">Aucune catégorie disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={ROUTES.CATEGORY(category.slug ?? category.id)}
                className="card card-hover p-5"
              >
                <h2 className="font-semibold text-[var(--text-primary)]">{category.name}</h2>
                {category.description && (
                  <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
