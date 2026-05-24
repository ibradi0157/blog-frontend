/**
 * src/lib/api-client.ts
 *
 * Client HTTP centralisé pour le backend NestJS.
 *
 * Fonctionnement :
 *  - fetch natif (pas de dépendance externe)
 *  - Injection automatique du JWT Bearer depuis localStorage
 *  - Gestion d'erreurs typée (ApiClientError)
 *  - Construction des query strings via buildQuery()
 *  - Upload multipart/form-data pour les fichiers
 *  - Toutes les routes du backend sont couvertes, groupées par domaine
 *
 * Usage :
 *   import { authApi, articlesApi } from '@/lib/api-client'
 *   const result = await authApi.login({ email, password })
 *   const articles = await articlesApi.getPublic({ page: 1, limit: 10 })
 */

import type {
  // Auth
  RegisterDto,
  LoginDto,
  RequestEmailCodeDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
  MeResponse,
  CheckEmailResponse,
  // Users
  User,
  PublicUserProfile,
  MembersResponse,
  UserArticlesResponse,
  ChangeRoleDto,
  // Authors
  AuthorsResponse,
  AuthorProfileResponse,
  // Follow
  FollowResponse,
  FollowingUser,
  FollowerUser,
  FollowStatus,
  // Categories
  Category,
  CategoriesResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
  // Articles
  Article,
  ArticleSummary,
  CreateArticleDto,
  UpdateArticleDto,
  ArticlesListResponse,
  PublicArticlesResponse,
  PublicArticleResponse,
  PublishResponse,
  UploadContentImageResponse,
  UploadCoverResponse,
  CheckTitleResponse,
  // Article Stats
  ArticleStats,
  ArticleStatsResponse,
  BulkArticleStatsResponse,
  // Article Scheduling
  ScheduleArticleDto,
  UpdateScheduleDto,
  ScheduledArticle,
  // Admin Articles
  AdminArticlesQuery,
  // Comments
  Comment,
  CreateCommentDto,
  CommentsListResponse,
  CommentReport,
  CommentReportsResponse,
  // Likes
  LikeResponse,
  // Notifications
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  // Subscriptions
  Subscription,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CheckFollowingResponse,
  CheckCategorySubscriptionResponse,
  FollowerCountResponse,
  // User Preferences
  LikedArticlesResponse,
  FollowedAuthorsResponse,
  ArticleLikedStatusResponse,
  AuthorFollowedStatusResponse,
  // Newsletter
  SubscribeNewsletterDto,
  UnsubscribeNewsletterDto,
  NewsletterCountResponse,
  SendNewsletterDto,
  SendNewsletterResponse,
  // Analytics
  TrackEventDto,
  AnalyticsOverviewResponse,
  TimeSeriesResponse,
  RealTimeStats,
  // Homepage
  PublicHomepageResponse,
  UpdateHomepageDto,
  // Site Settings
  SiteSettingsResponse,
  AdminSiteSettingsResponse,
  UpdateSiteSettingsDto,
  // Legal
  LegalPageSlug,
  LegalPage,
  PublicLegalPageResponse,
  UpdateLegalDto,
  // Misc
  ApiError,
  PaginationParams,
  ArticlesQueryParams,
  UsersQueryParams,
  CommentsQueryParams,
  HealthStatus,
  ApiResponse,
} from '@/types/api'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
).replace(/\/$/, '')

// ─────────────────────────────────────────────────────────────────────────────
// ERROR CLASS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Erreur typée levée par le client API.
 * Expose le statusCode HTTP, le message backend, et la réponse brute.
 */
export class ApiClientError extends Error {
  public readonly statusCode: number
  public readonly errors: string[]
  public readonly raw: ApiError

  constructor(raw: ApiError) {
    const msg = Array.isArray(raw.message)
      ? raw.message.join(', ')
      : raw.message
    super(msg)
    this.name = 'ApiClientError'
    this.statusCode = raw.statusCode
    this.errors = Array.isArray(raw.message) ? raw.message : [raw.message]
    this.raw = raw
  }

  /** Raccourci : vrai si l'utilisateur n'est pas authentifié */
  get isUnauthorized() {
    return this.statusCode === 401
  }

  /** Raccourci : vrai si l'utilisateur n'a pas les droits */
  get isForbidden() {
    return this.statusCode === 403
  }

  /** Raccourci : vrai si la ressource est introuvable */
  get isNotFound() {
    return this.statusCode === 404
  }

  /** Raccourci : vrai si la validation a échoué */
  get isValidationError() {
    return this.statusCode === 400
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'blog_access_token'

/** Lit le JWT depuis localStorage (browser uniquement) */
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/** Persiste le JWT dans localStorage */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

/** Supprime le JWT de localStorage */
export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY STRING BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convertit un objet de paramètres en query string.
 * Ignore les valeurs undefined, null et les chaînes vides.
 *
 * @example buildQuery({ page: 1, search: 'hello', empty: undefined })
 * // → "?page=1&search=hello"
 */
function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return ''
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  )
  if (entries.length === 0) return ''
  const qs = new URLSearchParams(
    entries.map(([k, v]) => [k, String(v)])
  ).toString()
  return `?${qs}`
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE FETCH WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  /** Données JSON envoyées dans le body */
  body?: unknown
  /** FormData pour les uploads multipart */
  formData?: FormData
  /** Headers additionnels */
  headers?: Record<string, string>
  /** Désactive l'injection du JWT (pour les routes publiques) */
  noAuth?: boolean
  /** Options Next.js fetch (revalidation, cache) */
  next?: NextFetchRequestConfig
}

/**
 * Effectue une requête HTTP vers le backend NestJS.
 * - Injecte automatiquement le header Authorization: Bearer <token>
 * - Parse le JSON de la réponse
 * - Lève une ApiClientError si statusCode >= 400
 */
async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, formData, headers = {}, noAuth = false, next } = options

  // ── Headers ──────────────────────────────────────────────────────────────
  const requestHeaders: Record<string, string> = { ...headers }

  // JSON par défaut (sauf upload)
  if (body !== undefined && !formData) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  // JWT Bearer
  if (!noAuth) {
    const token = getToken()
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const url = `${BASE_URL}${path}`

  const init: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: requestHeaders,
    ...(next ? { next } : {}),
  }

  if (formData) {
    init.body = formData
  } else if (body !== undefined) {
    init.body = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(url, init)
  } catch (networkError) {
    throw new ApiClientError({
      statusCode: 0,
      message: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
      error: 'NetworkError',
    })
  }

  // ── Réponse vide (204 No Content) ────────────────────────────────────────
  if (response.status === 204) {
    return undefined as T
  }

  // ── Parse JSON ────────────────────────────────────────────────────────────
  let data: unknown
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    // Texte brut (ex: messages d'erreur non-JSON)
    data = await response.text()
  }

  // ── Gestion des erreurs HTTP ──────────────────────────────────────────────
  if (!response.ok) {
    // Le backend NestJS retourne { statusCode, message, error }
    if (typeof data === 'object' && data !== null && 'statusCode' in data) {
      throw new ApiClientError(data as ApiError)
    }
    throw new ApiClientError({
      statusCode: response.status,
      message:
        typeof data === 'string'
          ? data
          : `Erreur HTTP ${response.status}`,
      error: response.statusText,
    })
  }

  return data as T
}

// Raccourcis par méthode
const http = {
  get:    <T>(path: string, opts?: RequestOptions) => request<T>('GET',    path, opts),
  post:   <T>(path: string, opts?: RequestOptions) => request<T>('POST',   path, opts),
  put:    <T>(path: string, opts?: RequestOptions) => request<T>('PUT',    path, opts),
  patch:  <T>(path: string, opts?: RequestOptions) => request<T>('PATCH',  path, opts),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AUTH ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * POST /auth/register
   * Crée un compte et retourne le JWT + informations utilisateur.
   */
  register: (dto: RegisterDto) =>
    http.post<AuthResponse>('/auth/register', { body: dto, noAuth: true }),

  /**
   * POST /auth/login
   * Authentifie l'utilisateur et retourne le JWT.
   */
  login: (dto: LoginDto) =>
    http.post<AuthResponse>('/auth/login', { body: dto, noAuth: true }),

  /**
   * POST /auth/request-email-code
   * Envoie un code de vérification par email.
   */
  requestEmailCode: (dto: RequestEmailCodeDto) =>
    http.post<ApiResponse<{ message: string }>>('/auth/request-email-code', {
      body: dto,
      noAuth: true,
    }),

  /**
   * POST /auth/verify-email
   * Vérifie le code à 6 chiffres reçu par email.
   */
  verifyEmail: (dto: VerifyEmailDto) =>
    http.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      body: dto,
      noAuth: true,
    }),

  /**
   * POST /auth/forgot-password
   * Déclenche l'envoi d'un email de réinitialisation.
   */
  forgotPassword: (dto: ForgotPasswordDto) =>
    http.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      body: dto,
      noAuth: true,
    }),

  /**
   * POST /auth/reset-password
   * Réinitialise le mot de passe via tokenId + token.
   */
  resetPassword: (dto: ResetPasswordDto) =>
    http.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      body: dto,
      noAuth: true,
    }),

  /**
   * POST /auth/check-email
   * Vérifie si un email est déjà utilisé.
   */
  checkEmail: (email: string) =>
    http.post<CheckEmailResponse>('/auth/check-email', {
      body: { email },
      noAuth: true,
    }),

  /**
   * GET /auth/me
   * Retourne l'userId et le rôle du token actuel.
   */
  getMe: () =>
    http.get<MeResponse>('/auth/me'),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── USERS ────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const usersApi = {
  /**
   * GET /users
   * Liste tous les utilisateurs. Réservé PRIMARY_ADMIN + SECONDARY_ADMIN.
   */
  getAll: (params?: UsersQueryParams) =>
    http.get<{ data: User[]; total: number; page: number; limit: number }>(
      `/users${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /users/members
   * Liste publique des membres (informations limitées).
   */
  getMembers: (params?: UsersQueryParams) =>
    http.get<MembersResponse>(
      `/users/members${buildQuery(params as Record<string, unknown>)}`,
      { noAuth: true }
    ),

  /**
   * GET /users/public/:id
   * Profil public d'un membre.
   */
  getPublicProfile: (id: string) =>
    http.get<PublicUserProfile>(`/users/public/${id}`, { noAuth: true }),

  /**
   * GET /users/public/:id/articles
   * Articles publiés d'un membre.
   */
  getUserArticles: (id: string, params?: PaginationParams) =>
    http.get<UserArticlesResponse>(
      `/users/public/${id}/articles${buildQuery(params as Record<string, unknown>)}`,
      { noAuth: true }
    ),

  /**
   * GET /users/authors
   * Liste des auteurs ayant au moins un article publié.
   */
  getAuthors: () =>
    http.get<AuthorsResponse>('/users/authors', { noAuth: true }),

  /**
   * GET /users/authors/:id
   * Profil complet d'un auteur avec ses articles.
   */
  getAuthorProfile: (id: string) =>
    http.get<AuthorProfileResponse>(`/users/authors/${id}`, { noAuth: true }),

  /**
   * POST /users/:id/avatar
   * Upload d'avatar (multipart/form-data). Réservé au propriétaire ou admin.
   */
  uploadAvatar: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.post<ApiResponse<{ avatarUrl: string }>>(
      `/users/${id}/avatar`,
      { formData: form }
    )
  },

  /**
   * PATCH /users/:id/role
   * Change le rôle d'un utilisateur. Réservé PRIMARY_ADMIN.
   */
  changeRole: (id: string, dto: ChangeRoleDto) =>
    http.patch<ApiResponse<User>>(`/users/${id}/role`, { body: dto }),

  /**
   * DELETE /users/:id
   * Supprime un utilisateur.
   */
  deleteUser: (id: string) =>
    http.delete<ApiResponse<{ message: string }>>(`/users/${id}`),

  /**
   * DELETE /users/purge/members
   * Supprime tous les SIMPLE_USER. Réservé PRIMARY_ADMIN.
   */
  purgeMembers: () =>
    http.delete<ApiResponse<{ message: string; deleted: number }>>(
      '/users/purge/members'
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── FOLLOW ───────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const followApi = {
  /**
   * POST /users/follow/:id
   * Suit un utilisateur.
   */
  follow: (targetUserId: string) =>
    http.post<FollowResponse>(`/users/follow/${targetUserId}`),

  /**
   * DELETE /users/follow/:id
   * Arrête de suivre un utilisateur.
   */
  unfollow: (targetUserId: string) =>
    http.delete<FollowResponse>(`/users/follow/${targetUserId}`),

  /**
   * GET /users/follow/following
   * Liste des utilisateurs que l'utilisateur courant suit.
   */
  getFollowing: () =>
    http.get<FollowingUser[]>('/users/follow/following'),

  /**
   * GET /users/follow/followers/:id
   * Liste des followers d'un utilisateur.
   */
  getFollowers: (userId: string) =>
    http.get<FollowerUser[]>(`/users/follow/followers/${userId}`, {
      noAuth: true,
    }),

  /**
   * GET /users/follow/status/:id
   * Statut follow entre l'utilisateur courant et une cible.
   */
  getStatus: (targetUserId: string) =>
    http.get<FollowStatus>(`/users/follow/status/${targetUserId}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── CATEGORIES ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const categoriesApi = {
  /**
   * GET /categories
   * Liste toutes les catégories. Route publique.
   */
  getAll: (params?: { skip?: number; take?: number }) =>
    http.get<CategoriesResponse>(
      `/categories${buildQuery(params as Record<string, unknown>)}`,
      { noAuth: true }
    ),

  /**
   * POST /categories
   * Crée une catégorie. Réservé PRIMARY_ADMIN + SECONDARY_ADMIN.
   */
  create: (dto: CreateCategoryDto) =>
    http.post<Category>('/categories', { body: dto }),

  /**
   * PUT /categories/:id
   * Met à jour une catégorie.
   */
  update: (id: string, dto: UpdateCategoryDto) =>
    http.put<Category>(`/categories/${id}`, { body: dto }),

  /**
   * DELETE /categories/:id
   * Supprime une catégorie.
   */
  delete: (id: string) =>
    http.delete<ApiResponse<{ message: string }>>(`/categories/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ARTICLES ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const articlesApi = {
  // ── Routes publiques ──────────────────────────────────────────────────────

  /**
   * GET /articles/public
   * Liste les articles publiés. Route publique, paginée.
   */
  getPublic: (params?: ArticlesQueryParams) =>
    http.get<PublicArticlesResponse>(
      `/articles/public${buildQuery(params as Record<string, unknown>)}`,
      { noAuth: true }
    ),

  /**
   * GET /articles/public/:id
   * Récupère un article publié par son id ou slug.
   */
  getPublicOne: (idOrSlug: string) =>
    http.get<PublicArticleResponse>(`/articles/public/${idOrSlug}`, {
      noAuth: true,
    }),

  // ── Routes auteur/admin (JWT requis) ──────────────────────────────────────

  /**
   * GET /articles
   * Liste les articles selon les permissions de l'utilisateur.
   * MEMBER voit ses articles, ADMIN voit tout.
   */
  getAll: (params?: ArticlesQueryParams) =>
    http.get<ArticlesListResponse>(
      `/articles${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /articles/:id
   * Récupère un article complet (brouillon inclus) selon permissions.
   */
  getOne: (id: string) =>
    http.get<{ success: boolean; data: Article }>(`/articles/${id}`),

  /**
   * POST /articles
   * Crée un nouvel article. Réservé MEMBER+.
   */
  create: (dto: CreateArticleDto) =>
    http.post<ApiResponse<Article>>('/articles', { body: dto }),

  /**
   * PUT /articles/:id
   * Met à jour un article. Propriétaire ou admin.
   */
  update: (id: string, dto: UpdateArticleDto) =>
    http.put<ApiResponse<Article>>(`/articles/${id}`, { body: dto }),

  /**
   * DELETE /articles/:id
   * Supprime un article.
   */
  delete: (id: string) =>
    http.delete<ApiResponse<{ message: string }>>(`/articles/${id}`),

  /**
   * POST /articles/:id/publish
   * Publie un article.
   */
  publish: (id: string) =>
    http.post<PublishResponse>(`/articles/${id}/publish`),

  /**
   * POST /articles/:id/unpublish
   * Dépublie un article.
   */
  unpublish: (id: string) =>
    http.post<PublishResponse>(`/articles/${id}/unpublish`),

  /**
   * POST /articles/check-title
   * Vérifie si un titre est disponible (unicité du slug).
   */
  checkTitle: (title: string) =>
    http.post<CheckTitleResponse>('/articles/check-title', {
      body: { title },
    }),

  // ── Uploads ───────────────────────────────────────────────────────────────

  /**
   * POST /articles/:id/cover
   * Upload l'image de couverture d'un article.
   */
  uploadCover: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.post<UploadCoverResponse>(`/articles/${id}/cover`, {
      formData: form,
    })
  },

  /**
   * DELETE /articles/:id/cover
   * Supprime l'image de couverture.
   */
  removeCover: (id: string) =>
    http.delete<ApiResponse<{ message: string }>>(`/articles/${id}/cover`),

  /**
   * POST /articles/:id/images
   * Upload une image dans le contenu d'un article.
   */
  uploadContentImage: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.post<UploadContentImageResponse>(`/articles/${id}/images`, {
      formData: form,
    })
  },

  /**
   * POST /articles/upload-content-image
   * Upload une image de contenu générique (sans article lié).
   */
  uploadGenericImage: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.post<UploadContentImageResponse>(
      '/articles/upload-content-image',
      { formData: form }
    )
  },

  // ── Like / Dislike ────────────────────────────────────────────────────────

  /**
   * POST /articles/:id/like
   * Like un article.
   */
  like: (id: string) =>
    http.post<LikeResponse>(`/articles/${id}/like`),

  /**
   * POST /articles/:id/dislike
   * Dislike un article.
   */
  dislike: (id: string) =>
    http.post<LikeResponse>(`/articles/${id}/dislike`),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ADMIN ARTICLES ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const adminArticlesApi = {
  /**
   * GET /admin/articles
   * Liste tous les articles avec filtres avancés. Réservé admins.
   */
  getAll: (params?: AdminArticlesQuery) =>
    http.get<ArticlesListResponse>(
      `/admin/articles${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /admin/articles/:id
   * Récupère un article complet en tant qu'admin.
   */
  getOne: (id: string) =>
    http.get<ApiResponse<Article>>(`/admin/articles/${id}`),

  /**
   * GET /admin/articles/stats?ids=...
   * Statistiques en masse pour une liste d'ids.
   */
  getStatsBulk: (ids: string[]) =>
    http.get<BulkArticleStatsResponse>(
      `/admin/articles/stats?ids=${ids.join(',')}`
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ARTICLE STATS ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const articleStatsApi = {
  /**
   * GET /articles/:articleId/stats
   * Statistiques d'un article (vues, likes, dislikes, commentaires).
   */
  get: (articleId: string) =>
    http.get<ArticleStatsResponse>(`/articles/${articleId}/stats`, {
      noAuth: true,
    }),

  /**
   * POST /articles/:articleId/stats/view
   * Incrémente le compteur de vues (auth optionnelle).
   */
  incrementView: (articleId: string) =>
    http.post<ApiResponse<ArticleStats>>(
      `/articles/${articleId}/stats/view`
    ),

  /**
   * POST /articles/:articleId/stats/like
   * Like via l'endpoint stats.
   */
  like: (articleId: string) =>
    http.post<ApiResponse<ArticleStats>>(`/articles/${articleId}/stats/like`),

  /**
   * POST /articles/:articleId/stats/dislike
   * Dislike via l'endpoint stats.
   */
  dislike: (articleId: string) =>
    http.post<ApiResponse<ArticleStats>>(
      `/articles/${articleId}/stats/dislike`
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ARTICLE SCHEDULING ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const schedulingApi = {
  /**
   * POST /articles/:id/schedule
   * Programme la publication d'un article.
   */
  schedule: (articleId: string, dto: ScheduleArticleDto) =>
    http.post<ApiResponse<ScheduledArticle>>(
      `/articles/${articleId}/schedule`,
      { body: dto }
    ),

  /**
   * PUT /articles/:id/schedule
   * Met à jour la programmation.
   */
  updateSchedule: (articleId: string, dto: UpdateScheduleDto) =>
    http.put<ApiResponse<ScheduledArticle>>(
      `/articles/${articleId}/schedule`,
      { body: dto }
    ),

  /**
   * DELETE /articles/:id/schedule
   * Annule la programmation.
   */
  cancelSchedule: (articleId: string) =>
    http.delete<ApiResponse<{ message: string }>>(
      `/articles/${articleId}/schedule`
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── COMMENTS ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const commentsApi = {
  /**
   * GET /comments/article/:articleId
   * Liste les commentaires d'un article. Route publique.
   */
  getForArticle: (articleId: string, params?: CommentsQueryParams) =>
    http.get<CommentsListResponse>(
      `/comments/article/${articleId}${buildQuery(
        params as Record<string, unknown>
      )}`,
      { noAuth: true }
    ),

  /**
   * GET /comments/:id/replies
   * Replies d'un commentaire. Route publique.
   */
  getReplies: (
    commentId: string,
    params?: Pick<PaginationParams, 'page' | 'limit'>
  ) =>
    http.get<CommentsListResponse>(
      `/comments/${commentId}/replies${buildQuery(
        params as Record<string, unknown>
      )}`,
      { noAuth: true }
    ),

  /**
   * GET /comments/mine
   * Commentaires reçus sur les articles de l'auteur connecté.
   */
  getMine: (params?: CommentsQueryParams) =>
    http.get<CommentsListResponse>(
      `/comments/mine${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /comments
   * Liste tous les commentaires (admin/modérateur).
   */
  getAll: (params?: CommentsQueryParams) =>
    http.get<CommentsListResponse>(
      `/comments${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * POST /comments
   * Crée un commentaire ou une réponse.
   */
  create: (dto: CreateCommentDto) =>
    http.post<ApiResponse<Comment>>('/comments', { body: dto }),

  /**
   * PATCH /comments/:id
   * Modifie le contenu d'un commentaire (propriétaire ou admin).
   */
  update: (id: string, content: string) =>
    http.patch<ApiResponse<Comment>>(`/comments/${id}`, {
      body: { content },
    }),

  /**
   * DELETE /comments/:id
   * Supprime un commentaire.
   */
  delete: (id: string) =>
    http.delete<ApiResponse<{ message: string }>>(`/comments/${id}`),

  /**
   * POST /comments/:id/report
   * Signale un commentaire.
   */
  report: (id: string, reason: string) =>
    http.post<ApiResponse<{ message: string }>>(`/comments/${id}/report`, {
      body: { reason },
    }),

  // ── Modération ────────────────────────────────────────────────────────────

  /**
   * GET /comments/reports
   * Liste les signalements. Réservé PRIMARY_ADMIN.
   */
  getReports: (params?: {
    status?: 'PENDING' | 'RESOLVED' | 'DISMISSED'
    page?: number
    limit?: number
  }) =>
    http.get<CommentReportsResponse>(
      `/comments/reports${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * PATCH /comments/reports/:reportId/resolve
   * Résout ou rejette un signalement.
   */
  resolveReport: (
    reportId: string,
    action: 'RESOLVED' | 'DISMISSED' = 'RESOLVED'
  ) =>
    http.patch<ApiResponse<CommentReport>>(
      `/comments/reports/${reportId}/resolve`,
      { body: { action } }
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LIKES ────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const likesApi = {
  /**
   * POST /articles/:articleId/like
   * Like (isLike: true) ou dislike (isLike: false) un article.
   */
  likeArticle: (articleId: string, isLike: boolean = true) =>
    http.post<LikeResponse>(`/articles/${articleId}/like`, {
      body: { isLike },
    }),

  /**
   * POST /comments/:commentId/like
   * Like (isLike: true) ou dislike (isLike: false) un commentaire.
   */
  likeComment: (commentId: string, isLike: boolean = true) =>
    http.post<LikeResponse>(`/comments/${commentId}/like`, {
      body: { isLike },
    }),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── NOTIFICATIONS ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const notificationsApi = {
  /**
   * GET /notifications
   * Liste les notifications de l'utilisateur courant.
   */
  getAll: (params?: { limit?: number; offset?: number }) =>
    http.get<NotificationsResponse>(
      `/notifications${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /notifications/unread/count
   * Nombre de notifications non lues.
   */
  getUnreadCount: () =>
    http.get<UnreadCountResponse>('/notifications/unread/count'),

  /**
   * PUT /notifications/:id/read
   * Marque une notification comme lue.
   */
  markAsRead: (id: string) =>
    http.put<ApiResponse<Notification>>(`/notifications/${id}/read`),

  /**
   * PUT /notifications/read/all
   * Marque toutes les notifications comme lues.
   */
  markAllAsRead: () =>
    http.put<{ message: string }>('/notifications/read/all'),

  /**
   * DELETE /notifications/:id
   * Supprime une notification.
   */
  delete: (id: string) =>
    http.delete<{ message: string }>(`/notifications/${id}`),

  /**
   * DELETE /notifications
   * Supprime toutes les notifications de l'utilisateur.
   */
  deleteAll: () =>
    http.delete<{ message: string }>('/notifications'),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const subscriptionsApi = {
  /**
   * GET /subscriptions
   * Liste les abonnements de l'utilisateur courant.
   */
  getAll: () =>
    http.get<Subscription[]>('/subscriptions'),

  /**
   * POST /subscriptions
   * Crée un abonnement (auteur, catégorie, global…).
   */
  create: (dto: CreateSubscriptionDto) =>
    http.post<Subscription>('/subscriptions', { body: dto }),

  /**
   * PUT /subscriptions/:id
   * Met à jour la fréquence ou l'état d'un abonnement.
   */
  update: (id: string, dto: UpdateSubscriptionDto) =>
    http.put<Subscription>(`/subscriptions/${id}`, { body: dto }),

  /**
   * DELETE /subscriptions/:id
   * Supprime un abonnement.
   */
  delete: (id: string) =>
    http.delete<{ message: string }>(`/subscriptions/${id}`),

  // ── Raccourcis follow/unfollow auteur ─────────────────────────────────────

  /** POST /subscriptions/follow/author/:authorId */
  followAuthor: (authorId: string) =>
    http.post<Subscription>(`/subscriptions/follow/author/${authorId}`),

  /** DELETE /subscriptions/follow/author/:authorId */
  unfollowAuthor: (authorId: string) =>
    http.delete<{ message: string }>(
      `/subscriptions/follow/author/${authorId}`
    ),

  /** GET /subscriptions/check/author/:authorId */
  checkFollowingAuthor: (authorId: string) =>
    http.get<CheckFollowingResponse>(
      `/subscriptions/check/author/${authorId}`
    ),

  /** GET /subscriptions/followers/author/:authorId */
  getFollowerCount: (authorId: string) =>
    http.get<FollowerCountResponse>(
      `/subscriptions/followers/author/${authorId}`,
      { noAuth: true }
    ),

  // ── Raccourcis subscribe/unsubscribe catégorie ────────────────────────────

  /** POST /subscriptions/follow/category/:categoryId */
  subscribeCategory: (categoryId: string) =>
    http.post<Subscription>(
      `/subscriptions/follow/category/${categoryId}`
    ),

  /** DELETE /subscriptions/follow/category/:categoryId */
  unsubscribeCategory: (categoryId: string) =>
    http.delete<{ message: string }>(
      `/subscriptions/follow/category/${categoryId}`
    ),

  /** GET /subscriptions/check/category/:categoryId */
  checkCategorySubscription: (categoryId: string) =>
    http.get<CheckCategorySubscriptionResponse>(
      `/subscriptions/check/category/${categoryId}`
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── USER PREFERENCES ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const userPreferencesApi = {
  /** POST /user-preferences/like/:articleId */
  likeArticle: (articleId: string) =>
    http.post<ApiResponse<unknown>>(
      `/user-preferences/like/${articleId}`
    ),

  /** DELETE /user-preferences/like/:articleId */
  unlikeArticle: (articleId: string) =>
    http.delete<ApiResponse<{ message: string }>>(
      `/user-preferences/like/${articleId}`
    ),

  /** POST /user-preferences/follow/:authorId */
  followAuthor: (authorId: string) =>
    http.post<ApiResponse<unknown>>(
      `/user-preferences/follow/${authorId}`
    ),

  /** DELETE /user-preferences/follow/:authorId */
  unfollowAuthor: (authorId: string) =>
    http.delete<ApiResponse<{ message: string }>>(
      `/user-preferences/follow/${authorId}`
    ),

  /** GET /user-preferences/liked-articles */
  getLikedArticles: () =>
    http.get<LikedArticlesResponse>('/user-preferences/liked-articles'),

  /** GET /user-preferences/followed-authors */
  getFollowedAuthors: () =>
    http.get<FollowedAuthorsResponse>('/user-preferences/followed-authors'),

  /** GET /user-preferences/article/:articleId/liked */
  isArticleLiked: (articleId: string) =>
    http.get<ArticleLikedStatusResponse>(
      `/user-preferences/article/${articleId}/liked`
    ),

  /** GET /user-preferences/author/:authorId/followed */
  isAuthorFollowed: (authorId: string) =>
    http.get<AuthorFollowedStatusResponse>(
      `/user-preferences/author/${authorId}/followed`
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── NEWSLETTER ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const newsletterApi = {
  /**
   * POST /newsletter/subscribe
   * Abonne une adresse email à la newsletter. Route publique.
   */
  subscribe: (dto: SubscribeNewsletterDto) =>
    http.post<ApiResponse<{ message: string }>>('/newsletter/subscribe', {
      body: dto,
      noAuth: true,
    }),

  /**
   * POST /newsletter/unsubscribe
   * Désabonne via token. Route publique.
   */
  unsubscribe: (dto: UnsubscribeNewsletterDto) =>
    http.post<ApiResponse<{ message: string }>>('/newsletter/unsubscribe', {
      body: dto,
      noAuth: true,
    }),

  /**
   * GET /newsletter/count
   * Nombre d'abonnés. Réservé PRIMARY_ADMIN.
   */
  getCount: () =>
    http.get<NewsletterCountResponse>('/newsletter/count'),

  /**
   * POST /newsletter/admin/send
   * Envoie la newsletter à tous les abonnés. Réservé PRIMARY_ADMIN.
   */
  send: (dto: SendNewsletterDto) =>
    http.post<SendNewsletterResponse>('/newsletter/admin/send', {
      body: dto,
    }),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ANALYTICS ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const analyticsApi = {
  /**
   * POST /analytics/track
   * Envoie un événement analytics. Route publique, throttlée.
   */
  track: (dto: TrackEventDto) =>
    http.post<void>('/analytics/track', { body: dto, noAuth: true }),

  /**
   * GET /analytics/overview
   * Vue d'ensemble analytics sur une période. Réservé admins.
   */
  getOverview: (params?: { startDate?: string; endDate?: string }) =>
    http.get<AnalyticsOverviewResponse>(
      `/analytics/overview${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /analytics/timeseries
   * Données de série temporelle. Réservé admins.
   */
  getTimeSeries: (params: {
    metric: string
    startDate?: string
    endDate?: string
    granularity?: 'hour' | 'day' | 'week' | 'month'
  }) =>
    http.get<TimeSeriesResponse>(
      `/analytics/timeseries${buildQuery(params as Record<string, unknown>)}`
    ),

  /**
   * GET /analytics/realtime
   * Statistiques temps réel. Réservé admins.
   */
  getRealTime: () =>
    http.get<RealTimeStats>('/analytics/realtime'),

  /**
   * GET /analytics/events
   * Liste des types d'événements disponibles.
   */
  getEventTypes: () =>
    http.get<{ eventTypes: string[]; descriptions: Record<string, string> }>(
      '/analytics/events'
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HOMEPAGE ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const homepageApi = {
  /**
   * GET /homepage
   * Configuration publique de la homepage.
   */
  getPublic: () =>
    http.get<PublicHomepageResponse>('/homepage', { noAuth: true }),

  /**
   * GET /admin/homepage
   * Configuration admin de la homepage. Réservé PRIMARY_ADMIN.
   */
  getAdmin: () =>
    http.get<PublicHomepageResponse>('/admin/homepage'),

  /**
   * PATCH /admin/homepage
   * Met à jour la configuration de la homepage.
   */
  update: (dto: UpdateHomepageDto) =>
    http.patch<PublicHomepageResponse>('/admin/homepage', { body: dto }),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SITE SETTINGS ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const siteSettingsApi = {
  /**
   * GET /site-settings
   * Paramètres publics du site (nom, logo, thème, SEO…).
   */
  getPublic: () =>
    http.get<SiteSettingsResponse>('/site-settings', { noAuth: true }),

  /**
   * GET /site-settings/admin
   * Paramètres complets. Réservé PRIMARY_ADMIN.
   */
  getAdmin: () =>
    http.get<AdminSiteSettingsResponse>('/site-settings/admin'),

  /**
   * PUT /site-settings/admin
   * Met à jour les paramètres du site.
   */
  update: (dto: UpdateSiteSettingsDto) =>
    http.put<AdminSiteSettingsResponse>('/site-settings/admin', { body: dto }),

  /**
   * PUT /site-settings/admin/logo
   * Upload du logo du site.
   */
  uploadLogo: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.put<ApiResponse<{ logoUrl: string }>>(
      '/site-settings/admin/logo',
      { formData: form }
    )
  },

  /**
   * PUT /site-settings/admin/favicon
   * Upload du favicon.
   */
  uploadFavicon: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.put<ApiResponse<{ faviconUrl: string }>>(
      '/site-settings/admin/favicon',
      { formData: form }
    )
  },

  /**
   * POST /site-settings/admin/reset
   * Réinitialise les paramètres aux valeurs par défaut.
   */
  reset: () =>
    http.post<AdminSiteSettingsResponse>('/site-settings/admin/reset'),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LEGAL PAGES ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const legalApi = {
  /**
   * GET /legal/:slug
   * Récupère une page légale publiée. Route publique.
   */
  getBySlug: (slug: LegalPageSlug | string) =>
    http.get<PublicLegalPageResponse>(`/legal/${slug}`, { noAuth: true }),

  /**
   * GET /admin/legal
   * Liste toutes les pages légales (publiées ou non). Réservé admins.
   */
  getAll: () =>
    http.get<ApiResponse<LegalPage[]>>('/admin/legal'),

  /**
   * PUT /admin/legal/:slug
   * Met à jour le contenu d'une page légale.
   */
  update: (slug: LegalPageSlug | string, dto: UpdateLegalDto) =>
    http.put<ApiResponse<LegalPage>>(`/admin/legal/${slug}`, { body: dto }),

  /**
   * PATCH /admin/legal/:slug/published
   * Publie ou dépublie une page légale.
   */
  setPublished: (slug: LegalPageSlug | string, isPublished: boolean) =>
    http.patch<ApiResponse<LegalPage>>(
      `/admin/legal/${slug}/published`,
      { body: { isPublished } }
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HEALTH ───────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export const healthApi = {
  /**
   * GET /health
   * État du serveur, de la base de données et de Redis.
   */
  check: () =>
    http.get<HealthStatus>('/health', { noAuth: true }),
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT PAR DÉFAUT — objet unique regroupant tous les namespaces
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Client API complet.
 *
 * @example
 * import api from '@/lib/api-client'
 * const { data } = await api.articles.getPublic({ page: 1 })
 * const user = await api.auth.login({ email, password })
 */
const api = {
  auth:             authApi,
  users:            usersApi,
  follow:           followApi,
  categories:       categoriesApi,
  articles:         articlesApi,
  adminArticles:    adminArticlesApi,
  articleStats:     articleStatsApi,
  scheduling:       schedulingApi,
  comments:         commentsApi,
  likes:            likesApi,
  notifications:    notificationsApi,
  subscriptions:    subscriptionsApi,
  userPreferences:  userPreferencesApi,
  newsletter:       newsletterApi,
  analytics:        analyticsApi,
  homepage:         homepageApi,
  siteSettings:     siteSettingsApi,
  legal:            legalApi,
  health:           healthApi,
} as const

export default api
