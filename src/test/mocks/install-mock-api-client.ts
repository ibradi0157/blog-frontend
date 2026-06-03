import { apiClient } from '@/lib/api-client';
import {
  mockArticlesCreate,
  mockArticlesDelete,
  mockArticlesGetOne,
  mockArticlesUpdate,
  mockCategoriesGetAll,
  mockGetVersions,
  mockUploadContentImage,
  mockUploadCover,
} from './mock-api-handlers';

export interface MockApiOptions {
  /** Simule un échec à la création d’article (tests d’erreur). */
  failCreate?: boolean;
}

/** Remplace les appels réseau du apiClient par des réponses locales. */
export function installMockApiClient(options: MockApiOptions = {}) {
  Object.assign(apiClient.articles, {
    create: options.failCreate
      ? async () => {
          throw new Error('Échec simulé');
        }
      : mockArticlesCreate,
    update: mockArticlesUpdate,
    getOne: mockArticlesGetOne,
    delete: mockArticlesDelete,
    getVersions: mockGetVersions,
    uploadCover: mockUploadCover,
    uploadContentImage: mockUploadContentImage,
  });

  Object.assign(apiClient.categories, {
    getAll: mockCategoriesGetAll,
  });
}
