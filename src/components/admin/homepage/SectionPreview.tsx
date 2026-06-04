'use client';

import {
  HomepageSection,
  HeroSection,
  FeaturedGridSection,
  NewsletterSection,
  SpacerSection,
  CtaSection,
  HtmlSection,
  CategoryGridSection,
  FeaturedCarouselSection,
} from './types';

// Preview components for the admin builder
// These are simplified versions for the preview

function HeroPreview({ section }: { section: HeroSection }) {
  return (
    <div
      className="relative h-64 flex items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: section.imageUrl ? `url(${section.imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: section.imageUrl ? undefined : 'var(--bg-secondary)',
      }}
    >
      {section.overlay && section.imageUrl && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="relative z-10 px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
          {section.title || 'Titre du hero'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {section.subtitle || 'Sous-titre du hero'}
        </p>
        {section.buttonLabel && (
          <button className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-lg">
            {section.buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function FeaturedGridPreview({ section }: { section: FeaturedGridSection }) {
  const cols = section.columns || 3;
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {section.title || 'Articles'}
      </h2>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]"
          >
            <div className="h-24 bg-[var(--bg-hover)]" />
            <div className="p-3">
              <div className="h-3 w-3/4 bg-[var(--bg-hover)] rounded mb-2" />
              {section.showExcerpt && (
                <div className="h-2 w-full bg-[var(--bg-hover)] rounded" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedCarouselPreview({ section }: { section: FeaturedCarouselSection }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {section.title || 'Carousel'}
      </h2>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]"
          >
            <div className="h-32 bg-[var(--bg-hover)]" />
            <div className="p-3">
              <div className="h-3 w-3/4 bg-[var(--bg-hover)] rounded" />
            </div>
          </div>
        ))}
      </div>
      {section.autoplay && (
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Autoplay: {section.interval / 1000}s
        </p>
      )}
    </div>
  );
}

function CategoryGridPreview({ section }: { section: CategoryGridSection }) {
  const cols = section.columns || 4;
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {section.title || 'Categories'}
      </h2>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-center"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] mx-auto mb-2" />
            <div className="h-2 w-16 bg-[var(--bg-hover)] rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterPreview({ section }: { section: NewsletterSection }) {
  return (
    <div className="p-6 bg-[var(--bg-secondary)]">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          {section.title || 'Newsletter'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {section.subtitle || 'Inscrivez-vous'}
        </p>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]" />
          <button className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-lg">
            {section.buttonLabel || "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HtmlPreview({ section }: { section: HtmlSection }) {
  return (
    <div className="p-6">
      <div
        className="prose prose-sm max-w-none text-[var(--text-primary)]"
        dangerouslySetInnerHTML={{ __html: section.content || '<p>Contenu HTML</p>' }}
      />
    </div>
  );
}

function SpacerPreview({ section }: { section: SpacerSection }) {
  const heights: Record<string, number> = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  };
  return (
    <div
      className="flex items-center justify-center text-xs text-[var(--text-muted)] border-y border-dashed border-[var(--border)]"
      style={{ height: heights[section.size] }}
    >
      Espacement {section.size}
    </div>
  );
}

function CtaPreview({ section }: { section: CtaSection }) {
  return (
    <div
      className={`p-6 text-center ${
        section.variant === 'highlight' ? 'bg-[var(--accent)]/10' : 'bg-[var(--bg-secondary)]'
      }`}
    >
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
        {section.title || 'Appel a l\'action'}
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {section.subtitle || 'Sous-titre'}
      </p>
      <button
        className={`px-4 py-2 text-sm font-medium rounded-lg ${
          section.variant === 'highlight'
            ? 'bg-[var(--accent)] text-white'
            : 'border border-[var(--border)] text-[var(--text-primary)]'
        }`}
      >
        {section.buttonLabel || 'Action'}
      </button>
    </div>
  );
}

// Main preview renderer
export function SectionPreview({ section }: { section: HomepageSection }) {
  switch (section.kind) {
    case 'hero':
      return <HeroPreview section={section} />;
    case 'featuredGrid':
      return <FeaturedGridPreview section={section} />;
    case 'featuredCarousel':
      return <FeaturedCarouselPreview section={section} />;
    case 'categoryGrid':
      return <CategoryGridPreview section={section} />;
    case 'newsletter':
      return <NewsletterPreview section={section} />;
    case 'html':
      return <HtmlPreview section={section} />;
    case 'spacer':
      return <SpacerPreview section={section} />;
    case 'cta':
      return <CtaPreview section={section} />;
    default:
      return <div className="p-4 text-sm text-[var(--text-muted)]">Section inconnue</div>;
  }
}
