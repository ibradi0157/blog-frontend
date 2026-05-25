/**
 * Extrait les métadonnées de pagination depuis les réponses API backend.
 * Le backend renvoie `{ pagination: { total, page, limit, pages } }` ;
 * certains endpoints legacy exposent encore total/page/limit à la racine.
 */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

export function extractPagination(
  response: unknown,
  defaults: Partial<PaginationMeta> = {},
): PaginationMeta {
  const r = response as Record<string, unknown> | null | undefined;
  const nested = r?.pagination as Partial<PaginationMeta> | undefined;

  const total = nested?.total ?? (r?.total as number | undefined) ?? defaults.total ?? 0;
  const page = nested?.page ?? (r?.page as number | undefined) ?? defaults.page ?? 1;
  const limit = nested?.limit ?? (r?.limit as number | undefined) ?? defaults.limit ?? 12;
  const pages =
    nested?.pages ??
    (r?.pages as number | undefined) ??
    (limit > 0 ? Math.ceil(total / limit) : 0);

  return { total, page, limit, pages };
}
