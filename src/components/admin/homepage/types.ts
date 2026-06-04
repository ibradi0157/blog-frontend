// Homepage Builder Types

export type SectionKind = 
  | 'hero'
  | 'featuredGrid'
  | 'featuredCarousel'
  | 'categoryGrid'
  | 'newsletter'
  | 'html'
  | 'spacer'
  | 'cta';

export interface BaseSection {
  id: string;
  kind: SectionKind;
}

export interface HeroSection extends BaseSection {
  kind: 'hero';
  title: string;
  subtitle: string;
  imageUrl: string | null;
  buttonLabel?: string;
  buttonHref?: string;
  overlay?: boolean;
}

export interface FeaturedGridSection extends BaseSection {
  kind: 'featuredGrid';
  title: string;
  articleIds: string[];
  columns: 2 | 3 | 4;
  showExcerpt: boolean;
}

export interface FeaturedCarouselSection extends BaseSection {
  kind: 'featuredCarousel';
  title: string;
  articleIds: string[];
  autoplay: boolean;
  interval: number; // ms
}

export interface CategoryGridSection extends BaseSection {
  kind: 'categoryGrid';
  title: string;
  categoryIds: string[]; // empty = all categories
  columns: 2 | 3 | 4;
}

export interface NewsletterSection extends BaseSection {
  kind: 'newsletter';
  title: string;
  subtitle: string;
  buttonLabel: string;
}

export interface HtmlSection extends BaseSection {
  kind: 'html';
  content: string;
}

export interface SpacerSection extends BaseSection {
  kind: 'spacer';
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CtaSection extends BaseSection {
  kind: 'cta';
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  variant: 'default' | 'highlight';
}

export type HomepageSection =
  | HeroSection
  | FeaturedGridSection
  | FeaturedCarouselSection
  | CategoryGridSection
  | NewsletterSection
  | HtmlSection
  | SpacerSection
  | CtaSection;

export interface HomepageConfig {
  sections: HomepageSection[];
}

// Default section factories
export const createDefaultSection = (kind: SectionKind): HomepageSection => {
  const id = `${kind}-${Date.now()}`;
  
  switch (kind) {
    case 'hero':
      return {
        id,
        kind: 'hero',
        title: 'Bienvenue sur notre blog',
        subtitle: 'Decouvrez nos derniers articles',
        imageUrl: null,
        buttonLabel: 'Explorer',
        buttonHref: '/articles',
        overlay: true,
      };
    case 'featuredGrid':
      return {
        id,
        kind: 'featuredGrid',
        title: 'Articles a la une',
        articleIds: [],
        columns: 3,
        showExcerpt: true,
      };
    case 'featuredCarousel':
      return {
        id,
        kind: 'featuredCarousel',
        title: 'A ne pas manquer',
        articleIds: [],
        autoplay: true,
        interval: 5000,
      };
    case 'categoryGrid':
      return {
        id,
        kind: 'categoryGrid',
        title: 'Explorez par categorie',
        categoryIds: [],
        columns: 4,
      };
    case 'newsletter':
      return {
        id,
        kind: 'newsletter',
        title: 'Restez informe',
        subtitle: 'Recevez nos derniers articles directement dans votre boite mail',
        buttonLabel: "S'inscrire",
      };
    case 'html':
      return {
        id,
        kind: 'html',
        content: '<div class="py-8 text-center">Contenu personnalise</div>',
      };
    case 'spacer':
      return {
        id,
        kind: 'spacer',
        size: 'md',
      };
    case 'cta':
      return {
        id,
        kind: 'cta',
        title: 'Pret a commencer ?',
        subtitle: 'Rejoignez notre communaute de lecteurs',
        buttonLabel: 'Commencer',
        buttonHref: '/register',
        variant: 'default',
      };
  }
};

export const SECTION_LABELS: Record<SectionKind, string> = {
  hero: 'Hero / Banniere',
  featuredGrid: 'Grille d\'articles',
  featuredCarousel: 'Carousel d\'articles',
  categoryGrid: 'Grille de categories',
  newsletter: 'Newsletter',
  html: 'HTML personnalise',
  spacer: 'Espacement',
  cta: 'Appel a l\'action',
};

export const SECTION_ICONS: Record<SectionKind, string> = {
  hero: 'Layout',
  featuredGrid: 'Grid3X3',
  featuredCarousel: 'GalleryHorizontal',
  categoryGrid: 'FolderOpen',
  newsletter: 'Mail',
  html: 'Code',
  spacer: 'Minus',
  cta: 'MousePointerClick',
};
