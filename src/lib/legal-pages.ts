import type { LegalPageSlug } from '@/types/api';

/** Slugs alignés sur le backend (legal-slug.pipe.ts). */
export const LEGAL_PAGE_SLUGS: LegalPageSlug[] = [
  'privacy',
  'terms',
  'cookie-policy',
  'legal-notice',
];

export const LEGAL_PAGE_LABELS: Record<LegalPageSlug, string> = {
  privacy: 'Politique de confidentialité',
  terms: "Conditions d'utilisation",
  'cookie-policy': 'Politique des cookies',
  'legal-notice': 'Mentions légales',
};

export const LEGAL_PUBLIC_ROUTES: Record<LegalPageSlug, string> = {
  privacy: '/legal/privacy',
  terms: '/legal/terms',
  'cookie-policy': '/legal/cookie-policy',
  'legal-notice': '/legal/legal-notice',
};
