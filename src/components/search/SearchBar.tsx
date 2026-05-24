'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  defaultValue = '',
  onSearch,
  placeholder = 'Rechercher des articles, auteurs…',
  className,
  autoFocus,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setValue(defaultValue); }, [defaultValue]);
  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    if (onSearch) {
      onSearch(q);
    } else {
      router.push(`/recherche?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-hover)]',
          'pl-9 pr-9 py-2.5 text-sm text-[var(--text-primary)]',
          'placeholder:text-[var(--text-muted)]',
          'focus:border-[var(--accent)] focus:outline-none transition-colors'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => { setValue(''); inputRef.current?.focus(); onSearch?.(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}