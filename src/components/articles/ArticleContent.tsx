'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface ArticleContentProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized article HTML content.
 * DOMPurify sanitization is applied client-side.
 * Server-side rendering uses the raw HTML (trusted content from backend).
 */
export function ArticleContent({ html, className }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sanitize with DOMPurify on client
    (async () => {
      try {
        const DOMPurify = (await import('dompurify')).default;
        if (ref.current) {
          ref.current.innerHTML = DOMPurify.sanitize(html, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
          });
        }
      } catch {
        // DOMPurify not available (SSR), content already set via dangerouslySetInnerHTML
      }
    })();
  }, [html]);

  return (
    <div
      ref={ref}
      className={cn(
        // Prose-like styles using CSS variables
        'prose-article max-w-none',
        'text-[var(--text-secondary)] leading-relaxed',
        // Headings
        '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--text-primary)] [&_h1]:mt-10 [&_h1]:mb-4',
        '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:mt-8 [&_h2]:mb-3',
        '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--text-primary)] [&_h3]:mt-6 [&_h3]:mb-2',
        // Paragraphs
        '[&_p]:mb-5 [&_p]:leading-7',
        // Links
        '[&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[var(--accent-hover)]',
        // Lists
        '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-1.5',
        '[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol>li]:mb-1.5',
        // Blockquote
        '[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-5 [&_blockquote]:my-6 [&_blockquote]:text-[var(--text-muted)] [&_blockquote]:italic',
        // Code
        '[&_code]:rounded [&_code]:bg-[var(--bg-hover)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:text-[var(--accent)]',
        '[&_pre]:mb-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[var(--bg-hover)] [&_pre]:p-5',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[var(--text-secondary)]',
        // Images
        '[&_img]:my-6 [&_img]:rounded-xl [&_img]:w-full [&_img]:object-cover',
        // HR
        '[&_hr]:border-[var(--border)] [&_hr]:my-8',
        // Strong / em
        '[&_strong]:font-semibold [&_strong]:text-[var(--text-primary)]',
        '[&_em]:italic',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}