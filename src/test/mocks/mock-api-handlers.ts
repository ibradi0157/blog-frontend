/** Réponses API factices pour les tests (navigateur ou Vitest). */

export const MOCK_ARTICLE_ID = 'article-test-123';

export const MOCK_CATEGORIES = [
  { id: 'cat-tech', name: 'Technologie', slug: 'technologie' },
  { id: 'cat-culture', name: 'Culture', slug: 'culture' },
];

export async function mockArticlesCreate(payload: Record<string, unknown>) {
  return {
    data: {
      id: MOCK_ARTICLE_ID,
      title: payload.title ?? 'Sans titre',
      ...payload,
    },
  };
}

export async function mockArticlesUpdate(_id: string, payload: Record<string, unknown>) {
  return { data: { id: MOCK_ARTICLE_ID, ...payload } };
}

export async function mockArticlesGetOne() {
  return { data: null };
}

export async function mockArticlesDelete() {
  return undefined;
}

export async function mockCategoriesGetAll() {
  return { data: MOCK_CATEGORIES };
}

export async function mockGetVersions() {
  return [];
}

export async function mockUploadCover() {
  return { coverUrl: 'https://example.com/cover.jpg' };
}

export async function mockUploadContentImage() {
  return { url: 'https://example.com/image.jpg' };
}
