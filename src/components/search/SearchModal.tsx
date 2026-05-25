'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, TrendingUp } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { apiClient } from '@/lib/api-client';
import { PublicArticle } from '@/types/api';
import { ArticleMeta } from '@/components/articles/ArticleMeta';
import { cn } from '@/lib/cn';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!isOpen) { setQuery(''); setResults([]); return; }
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await apiClient.articles.getPublic({ search: query, limit: 5 });
        setResults(data.data ?? []);
      } catch { setResults([]); }
      finally { setIsLoading(false); }
    }, 300);
  }, [query]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    onClose();
    router.push(`/recherche?q=${encodeURIComponent(q)}`);
  };

  const handleArticleClick = (slug: string) => {
    onClose();
    router.push(`/articles/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-xl shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-[var(--border)]">
          <SearchBar
            defaultValue={query}
            onSearch={handleSearch}
            autoFocus
            placeholder="Rechercher…"
          />
        </div>

        {results.length > 0 && (
          <div className="py-2 max-h-80 overflow-y-auto">
            {results.map((article) => (
              <button
                key={article.id}
                onClick={() => handleArticleClick(article.slug ?? '')}
                className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors"
              >
                <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 mb-1">
                  {article.title}
                </p>
                <ArticleMeta article={article} compact />
              </button>
            ))}
            <div className="px-4 py-2 border-t border-[var(--border)]">
              <button
                onClick={() => handleSearch(query)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Voir tous les résultats pour « {query} » →
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-4 text-center text-xs text-[var(--text-muted)]">Recherche…</div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className="p-4 text-center text-sm text-[var(--text-muted)]">
            Aucun résultat pour « {query} »
          </div>
        )}
      </div>
    </div>
  );
}