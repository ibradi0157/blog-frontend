'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';
import { categoriesApi } from '@/lib/api-client';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ArticleList } from '@/components/articles/ArticleList';
import { FeaturedArticle } from '@/components/articles/FeaturedArticle';
import { ArticleCardSkeleton } from '@/components/articles/ArticleCardSkeleton';
import { Pagination } from '@/components/ui/pagination';
import type { Category } from '@/types/api';

type ViewMode = 'grid' | 'list';
const LIMIT = 12;

export function ArticlesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const category = searchParams.get('category') ?? '';
  const tag = searchParams.get('tag') ?? '';
  const search = searchParams.get('q') ?? '';

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchInput, setSearchInput] = useState(search);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryId = category
    ? categories.find((c) => c.slug === category)?.id
    : undefined;

  const { articles, total, isLoading } = useArticles({
    page,
    limit: LIMIT,
    categoryId: categoryId || undefined,
    tag: tag || undefined,
    search: search || undefined,
  });

  // Fetch categories once
  useEffect(() => {
    categoriesApi
      .getAll()
      .then((res) => setCategories(res ?? []))
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil((total ?? 0) / LIMIT);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete('page'); // reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({ q: searchInput });
  };

  const handleCategoryClick = (slug: string) => {
    pushParams({ category: category === slug ? '' : slug });
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasFilters = !!(category || tag || search);
  const featuredArticle = !hasFilters && page === 1 && articles?.[0];
  const remainingArticles = featuredArticle ? articles?.slice(1) : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Articles</h1>
        <p className="text-[var(--text-secondary)]">
          {total != null ? `${total.toLocaleString('fr-FR')} article${total > 1 ? 's' : ''}` : ''}
          {hasFilters ? ' — résultats filtrés' : ''}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un article…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-all"
          />
        </form>

        {/* Toggle filtres mobile */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="sm:hidden btn-ghost flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Vue grid/list */}
        <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-hover)] rounded-xl p-1">
          {(['grid', 'list'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === mode
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {mode === 'grid' ? '⊞ Grille' : '☰ Liste'}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres catégories */}
      <div className={`${filtersOpen ? 'flex' : 'hidden sm:flex'} flex-wrap gap-2 mb-8`}>
        <button
          onClick={() => pushParams({ category: '' })}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            !category
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => cat.slug && handleCategoryClick(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === cat.slug
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* Tag actif */}
        {tag && (
          <button
            onClick={() => pushParams({ tag: '' })}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]"
          >
            #{tag}
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Article à la une (première page, sans filtre) */}
      {featuredArticle && !isLoading && (
        <div className="mb-10">
          <FeaturedArticle article={featuredArticle} />
        </div>
      )}

      {/* Grille / Liste */}
      {isLoading ? (
        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl'
          }`}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : remainingArticles && remainingArticles.length > 0 ? (
        viewMode === 'grid' ? (
          <ArticleGrid articles={remainingArticles} />
        ) : (
          <ArticleList articles={remainingArticles} />
        )
      ) : (
        <div className="text-center py-24 text-[var(--text-secondary)]">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">Aucun article trouvé</p>
          <p className="text-sm mt-1">Essayez d&apos;autres filtres ou termes de recherche</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
