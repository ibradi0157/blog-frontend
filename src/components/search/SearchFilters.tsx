'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { CategoriesResponse } from '@/types/api';
import { cn } from '@/lib/cn';

interface SearchFiltersProps {
  selectedCategory?: string;
  selectedSort?: string;
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'recent', label: 'Plus récent' },
  { value: 'popular', label: 'Plus populaire' },
  { value: 'views', label: 'Plus de vues' },
];

export function SearchFilters({
  selectedCategory,
  selectedSort = 'relevance',
  onCategoryChange,
  onSortChange,
}: SearchFiltersProps) {
  const { data } = useSWR<CategoriesResponse>('/categories', () => apiClient.categories.getAll());
  const categories = data?.data ?? [];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">Trier par :</span>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className={cn(
            'rounded-lg border border-[var(--border)] bg-[var(--bg-hover)]',
            'text-sm text-[var(--text-secondary)] px-2 py-1.5',
            'focus:border-[var(--accent)] focus:outline-none'
          )}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              !selectedCategory
                ? 'bg-[var(--accent)] text-white'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
            )}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(selectedCategory === cat.slug ? '' : (cat.slug || ''))}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                selectedCategory === cat.slug
                  ? 'bg-[var(--accent)] text-white'
                  : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}