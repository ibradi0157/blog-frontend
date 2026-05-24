'use client'

import { cn } from '@/lib/cn'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  page:       number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function getPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPages(page, totalPages)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-[var(--radius)] border border-[var(--border)] text-[var(--text-secondary)] transition-all',
          'hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
          'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:bg-transparent',
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="flex items-center justify-center w-9 h-9 text-[var(--text-muted)]">
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-[var(--radius)] text-sm font-medium transition-all border',
              p === page
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-[var(--radius)] border border-[var(--border)] text-[var(--text-secondary)] transition-all',
          'hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
          'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:bg-transparent',
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
