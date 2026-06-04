/**
 * src/types/api.ts
 *
 * Interfaces TypeScript correspondant exactement aux réponses du backend NestJS.
 * Générées à partir de l'analyse des entités, contrôleurs et DTOs.
 *
 * Rôles disponibles : PRIMARY_ADMIN | SECONDARY_ADMIN | MEMBER | SIMPLE_USER
 */

// ─────────────────────────────────────────────
// GENERIC WRAPPERS
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: PaginationMeta;
  /** @deprecated Préférer pagination.total */
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────

export type RoleName =
  | 'PRIMARY_ADMIN'
  | 'SECONDARY_ADMIN'
  | 'MEMBER'
  | 'SIMPLE_USER';

export interface Role {
  id: string;
  name: RoleName;
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

/** POST /auth/register */
export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  recaptchaToken?: string;
}

/** POST /auth/login */
export interface LoginDto {
  email: string;
  password: string;
  recaptchaToken?: string;
}

/** POST /auth/request-email-code */
export interface RequestEmailCodeDto {
  email: string;
  recaptchaToken?: string;
}

/** POST /auth/verify-email */
export interface VerifyEmailDto {
  email: string;
  /** Code à 6 chiffres */
  code: string;
}

/** POST /auth/forgot-password */
export interface ForgotPasswordDto {
  email: string;
  recaptchaToken?: string;
}

/** POST /auth/reset-password */
export interface ResetPasswordDto {
  tokenId: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/** POST /auth/check-email */
export interface CheckEmailResponse {
  available: boolean;
  message: string;
}

/** Response de /auth/register et /auth/login */
export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    userId: string;
    email: string;
    displayName: string;
    role: RoleName;
    avatarUrl?: string | null;
    isEmailVerified: boolean;
  };
  message?: string;
}

/** GET /auth/me */
export interface MeResponse {
  success: boolean;
  data: {
    userId: string;
    role: Role;
  };
}

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  isEmailVerified: boolean;
  bio?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

/** Profil public retourné par GET /users/public/:id */
export interface PublicUserProfile {
  id: string;
  displayName: string;
  username?: string | null;
  email: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  twitter?: string | null;
  github?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  instagram?: string | null;
  articlesCount?: number;
  totalViews?: number;
  role: Role;
  createdAt: string;
}

/** GET /users/members */
export interface MembersResponse {
  data: PublicUserProfile[];
  total: number;
  page: number;
  limit: number;
}

/** GET /users/public/:id/articles */
export interface UserArticlesResponse {
  data: ArticleSummary[];
  total: number;
  page: number;
  limit: number;
}

/** PATCH /users/:id/role */
export interface ChangeRoleDto {
  role: 'MEMBER' | 'SECONDARY_ADMIN';
}

// ─────────────────────────────────────────────
// AUTHORS (public-users.controller)
// ─────────────────────────────────────────────

/** Item de GET /users/authors */
export interface AuthorListItem {
  id: string;
  displayName: string;
  username?: string | null;
  email: string;
  avatarUrl?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  followersCount?: number;
  createdAt: string;
  articlesCount: number;
  totalViews: number;
  totalLikes: number;
}

/** GET /users/authors */
export interface AuthorsResponse {
  success: boolean;
  data: AuthorListItem[];
}

/** Article summary dans le profil auteur */
export interface AuthorArticleSummary {
  id: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt: string;
  viewCount: number;
  commentCount: number;
  tags: string[];
}

/** GET /users/authors/:id */
export interface AuthorProfileResponse {
  success: boolean;
  data: {
    id: string;
    displayName: string;
    email: string;
    profilePicture?: string | null;
    createdAt: string;
    articlesCount: number;
    totalViews: number;
    totalLikes: number;
    articles: AuthorArticleSummary[];
  };
}

// ─────────────────────────────────────────────
// FOLLOW (follow.controller)
// ─────────────────────────────────────────────

/** POST /users/follow/:id */
export interface FollowResponse {
  success: boolean;
  message: string;
}

/** Item de GET /users/follow/following */
export interface FollowingUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  followedAt: string;
}

/** Item de GET /users/follow/followers/:id */
export interface FollowerUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  followedAt: string;
}

/** GET /users/follow/status/:id */
export interface FollowStatus {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

// ─────────────────────────────────────────────
// CATEGORY
// ─────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /categories */
export interface CategoriesResponse {
  success?: boolean;
  data: Category[];
  total?: number;
}

/** POST /categories */
export interface CreateCategoryDto {
  name: string;
}

/** PUT /categories/:id */
export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

// ─────────────────────────────────────────────
// ARTICLE
// ─────────────────────────────────────────────

export interface ArticleAuthor {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string | null;
  content: string;
  excerpt?: string | null;
  tags?: string[] | null;
  isPublished: boolean;
  publishedAt?: string | null;
  isFeatured: boolean;
  coverUrl?: string | null;
  authorId?: string | null;
  authorRole: string;
  author?: ArticleAuthor | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

/** Version allégée pour les listes */
export interface ArticleSummary {
  id: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  coverUrl?: string | null;
  tags?: string[] | null;
  status?: 'draft' | 'published' | 'archived' | 'scheduled';
  isPublished: boolean;
  publishedAt?: string | null;
  isFeatured: boolean;
  viewsCount?: number;
  authorId?: string | null;
  author?: ArticleAuthor | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

/** Alias public — même shape qu'ArticleSummary */
export type PublicArticle = ArticleSummary;

/** POST /articles */
export interface CreateArticleDto {
  title: string;
  content: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
  excerpt?: string;
  tags?: string[];
}

/** PUT /articles/:id */
export type UpdateArticleDto = Partial<CreateArticleDto>;

/** GET /articles — liste auteur/admin (avec permissions) */
export interface ArticlesListResponse {
  success: boolean;
  data: Article[];
  pagination?: PaginationMeta;
}

/** GET /articles/public */
export interface PublicArticlesResponse {
  success: boolean;
  data: ArticleSummary[];
  pagination: PaginationMeta;
}

/** GET /articles/public/:id */
export interface PublicArticleResponse {
  success: boolean;
  data: Article;
}

/** POST /articles/:id/publish | /articles/:id/unpublish */
export interface PublishResponse {
  success: boolean;
  message: string;
  data?: Article;
}

/** POST /articles/upload-content-image */
export interface UploadContentImageResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    thumbnails: string[];
  };
}

/** POST /articles/:id/cover */
export interface UploadCoverResponse {
  success: boolean;
  message: string;
  data?: { coverUrl: string };
}

/** POST /articles/check-title */
export interface CheckTitleResponse {
  available: boolean;
  message: string;
}

// ─────────────────────────────────────────────
// ARTICLE STATS
// ─────────────────────────────────────────────

export interface ArticleStats {
  id: string;
  views: number;
  likes: number;
  dislikes: number;
  commentsCount: number;
}

/** GET /articles/:articleId/stats */
export interface ArticleStatsResponse {
  success?: boolean;
  data?: ArticleStats;
  views?: number;
  likes?: number;
  dislikes?: number;
  commentsCount?: number;
}

/** GET /admin/articles/stats?ids=... */
export type BulkArticleStatsResponse = Record<string, ArticleStats>;

// ─────────────────────────────────────────────
// ARTICLE SCHEDULE
// ─────────────────────────────────────────────

export interface ScheduleArticleDto {
  scheduledAt: string; // ISO date string
  autoSocialShare?: boolean;
  sendNotification?: boolean;
  timezone?: string;
}

export interface UpdateScheduleDto {
  scheduledAt?: string;
  autoSocialShare?: boolean;
  sendNotification?: boolean;
}

export interface ScheduledArticle {
  id: string;
  articleId: string;
  scheduledAt: string;
  autoSocialShare: boolean;
  sendNotification: boolean;
  timezone?: string;
  status: 'PENDING' | 'PUBLISHED' | 'CANCELLED';
  createdAt: string;
}

// ─────────────────────────────────────────────
// ADMIN ARTICLES
// ─────────────────────────────────────────────

export interface AdminArticlesQuery {
  search?: string;
  status?: 'published' | 'draft' | 'unpublished';
  authorId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// ─────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────

export interface CommentAuthor {
  id: string;
  displayName: string;
  username?: string | null;
  avatarUrl?: string | null;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  isEdited: boolean;
  likes: number;
  dislikes: number;
  likesCount?: number;
  isLiked?: boolean;
  authorId?: string;
  authorTag: string;
  author: CommentAuthor;
  articleId?: string;
  parentId?: string | null;
  replies?: Comment[];
  children?: Comment[];
  createdAt: string;
  updatedAt: string;
}

/** POST /comments */
export interface CreateCommentDto {
  content: string;
  articleId: string;
  parentId?: string;
}

/** GET /comments/article/:articleId */
export interface CommentsListResponse {
  success?: boolean;
  data: Comment[];
  pagination?: PaginationMeta;
}

/** GET /comments/reports */
export interface CommentReport {
  id: string;
  comment: Comment;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  reportedBy: CommentAuthor;
  createdAt: string;
}

export interface CommentReportsResponse {
  data: CommentReport[];
  total: number;
  page: number;
  limit: number;
}

// ─────────────────────────────────────────────
// LIKES
// ─────────────────────────────────────────────

/** POST /articles/:articleId/like */
export interface LikeArticleDto {
  isLike: boolean;
}

/** POST /comments/:commentId/like */
export interface LikeCommentDto {
  isLike: boolean;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  likes?: number;
  dislikes?: number;
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

export type NotificationType =
  | 'article_published'
  | 'comment_added'
  | 'comment_reply'
  | 'like_received'
  | 'follow'
  | 'mention'
  // Legacy / composants existants
  | 'LIKE_ARTICLE'
  | 'LIKE_COMMENT'
  | 'COMMENT'
  | 'FOLLOW'
  | 'NEW_ARTICLE'
  | 'NEWSLETTER';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  payload?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

/** GET /notifications */
export interface NotificationsResponse {
  success?: boolean;
  data: Notification[];
  total: number;
  unreadCount: number;
}

/** GET /notifications/unread/count */
export interface UnreadCountResponse {
  count: number;
}

// ─────────────────────────────────────────────
// SUBSCRIPTIONS
// ─────────────────────────────────────────────

export type SubscriptionType = 'author' | 'category' | 'tag' | 'global';
export type SubscriptionFrequency = 'instant' | 'daily' | 'weekly';

export interface Subscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  targetId: string;
  frequency: SubscriptionFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** POST /subscriptions */
export interface CreateSubscriptionDto {
  type: SubscriptionType;
  targetId: string;
  frequency?: SubscriptionFrequency;
}

/** PUT /subscriptions/:id */
export interface UpdateSubscriptionDto {
  frequency?: SubscriptionFrequency;
  isActive?: boolean;
}

/** GET /subscriptions/check/author/:authorId */
export interface CheckFollowingResponse {
  isFollowing: boolean;
}

/** GET /subscriptions/check/category/:categoryId */
export interface CheckCategorySubscriptionResponse {
  isSubscribed: boolean;
}

/** GET /subscriptions/followers/author/:authorId */
export interface FollowerCountResponse {
  count: number;
}

// ─────────────────────────────────────────────
// USER PREFERENCES
// ─────────────────────────────────────────────

/** GET /user-preferences/liked-articles */
export interface LikedArticle {
  id: string;
  title: string;
  coverUrl?: string | null;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
}

export interface LikedArticlesResponse {
  success: boolean;
  data: LikedArticle[];
}

/** GET /user-preferences/followed-authors */
export interface FollowedAuthor {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  articlesCount: number;
  followersCount: number;
}

export interface FollowedAuthorsResponse {
  success: boolean;
  data: FollowedAuthor[];
}

/** GET /user-preferences/article/:articleId/liked */
export interface ArticleLikedStatusResponse {
  success: boolean;
  isLiked?: boolean;
  likeType?: string;
  data?: { isLiked: boolean; likeType?: string };
}

/** GET /user-preferences/author/:authorId/followed */
export interface AuthorFollowedStatusResponse {
  success: boolean;
  data: { isFollowed: boolean };
}

// ─────────────────────────────────────────────
// USER PROFILE UPDATE
// ─────────────────────────────────────────────

/** PATCH /users/me/profile */
export interface UpdateProfileDto {
  displayName?: string;
  bio?: string | null;
  website?: string | null;
  twitter?: string | null;
  github?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  instagram?: string | null;
}

// ─────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────

/** POST /newsletter/subscribe */
export interface SubscribeNewsletterDto {
  email: string;
}

/** POST /newsletter/unsubscribe */
export interface UnsubscribeNewsletterDto {
  email: string;
  token: string;
}

/** GET /newsletter/count (admin) */
export interface NewsletterCountResponse {
  count: number;
}

/** POST /newsletter/admin/send */
export interface SendNewsletterDto {
  subject: string;
  html: string;
}

export interface SendNewsletterResponse {
  success: boolean;
  message: string;
  sent: number;
}

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────

export type EventType =
  | 'page_view'
  | 'article_view'
  | 'article_like'
  | 'article_dislike'
  | 'article_share'
  | 'search'
  | 'comment_create'
  | 'user_signup'
  | 'user_login'
  | 'newsletter_signup'
  | 'download'
  | 'click'
  | 'scroll_depth'
  | 'time_on_page'
  | 'bounce'
  | 'conversion';

/** POST /analytics/track */
export interface TrackEventDto {
  eventType: EventType;
  sessionId: string;
  visitorId: string;
  userId?: string;
  articleId?: string;
  categoryId?: string;
  url?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
  value?: number;
}

/** GET /analytics/overview */
export interface AnalyticsOverview {
  totalPageViews: number;
  uniqueVisitors: number;
  totalArticleViews: number;
  totalSignups: number;
  totalLogins: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  topArticles: Array<{
    articleId: string;
    title?: string;
    views: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    count: number;
  }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
}

/** GET /analytics/author-overview */
export interface AuthorAnalyticsOverview {
  totalPageViews: number;
  totalArticleViews: number;
  totalLikes: number;
  totalComments: number;
  articleCount: number;
  publishedCount: number;
}

export interface AnalyticsOverviewResponse {
  success?: boolean;
  data?: AnalyticsOverview;
  [key: string]: unknown;
}

export interface AuthorAnalyticsOverviewResponse {
  success?: boolean;
  data?: AuthorAnalyticsOverview;
  [key: string]: unknown;
}

/** GET /analytics/timeseries */
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface TimeSeriesResponse {
  metric: string;
  granularity: 'hour' | 'day' | 'week' | 'month';
  data: TimeSeriesDataPoint[];
}

/** GET /analytics/realtime */
export interface RealTimeStats {
  activeUsers: number;
  pageViewsLast5Min: number;
  activePages: Array<{
    url: string;
    activeUsers: number;
  }>;
}

// ─────────────────────────────────────────────
// HOMEPAGE
// ─────────────────────────────────────────────

export type HomepageSectionType =
  | 'featured'
  | 'trending'
  | 'recent'
  | 'recommended'
  | 'category'
  | 'authors';

export interface HomepageSection {
  type: HomepageSectionType;
  title: string;
  enabled: boolean;
  articleIds?: string[];
  categoryId?: string;
  limit?: number;
  order: number;
}

/** GET /homepage (public) */
export interface HomepageConfig {
  sections: HomepageSection[];
  featuredArticles?: ArticleSummary[];
  trendingArticles?: ArticleSummary[];
  recentArticles?: ArticleSummary[];
}

export interface PublicHomepageResponse {
  success?: boolean;
  data?: HomepageConfig;
  [key: string]: unknown;
}

/** PATCH /admin/homepage */
export interface UpdateHomepageDto {
  sections?: HomepageSection[];
}

// ─────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  defaultTheme: 'light' | 'dark' | 'auto';
  primaryColor?: string | null;
  secondaryColor?: string | null;
  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
  twitterHandle?: string | null;
  googleAnalyticsId?: string | null;
  facebookPixelId?: string | null;
  // Contact & Social
  contactEmail?: string | null;
  socialFacebook?: string | null;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
  socialLinkedIn?: string | null;
  socialYoutube?: string | null;
  // Footer
  footerText?: string | null;
  showPoweredBy: boolean;
  homepageConfig?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /site-settings (public) */
export interface PublicSiteSettings {
  siteName: string;
  siteDescription?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  defaultTheme: 'light' | 'dark' | 'auto';
  primaryColor?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  twitterHandle?: string | null;
  contactEmail?: string | null;
  socialFacebook?: string | null;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
  socialLinkedIn?: string | null;
  socialYoutube?: string | null;
  footerText?: string | null;
  showPoweredBy: boolean;
}

/** GET /site-settings */
export interface SiteSettingsResponse {
  success: boolean;
  data: PublicSiteSettings;
}

/** GET /site-settings/admin */
export interface AdminSiteSettingsResponse {
  success: boolean;
  data: SiteSettings;
}

/** PUT /site-settings/admin */
export interface UpdateSiteSettingsDto {
  siteName?: string;
  siteDescription?: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultTheme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  contactEmail?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedIn?: string;
  socialYoutube?: string;
  footerText?: string;
  showPoweredBy?: boolean;
}

// ─────────────────────────────────────────────
// LEGAL PAGES
// ─────────────────────────────────────────────

export type LegalPageSlug =
  | 'privacy'
  | 'terms'
  | 'cookie-policy'
  | 'legal-notice';

export interface LegalPage {
  id: string;
  slug: LegalPageSlug | string;
  title: string;
  content: string;
  published: boolean;
  updatedAt: string;
  createdAt?: string;
}

/** POST /auth/register — réponse avec ou sans token */
export interface RegisterResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken?: string;
    userId?: string;
    email: string;
    displayName?: string;
    role?: RoleName;
    isEmailVerified?: boolean;
    avatarUrl?: string | null;
    requiresEmailVerification?: boolean;
    expiresAt?: string;
  };
}

/** GET /legal/:slug (public) */
export interface PublicLegalPageResponse {
  success?: boolean;
  data?: LegalPage;
}

/** PUT /admin/legal/:slug */
export interface UpdateLegalDto {
  title?: string;
  content?: string;
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterConfig {
  id: string;
  sections?: FooterSection[] | null;
  copyrightText?: string | null;
  showSocialLinks: boolean;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────

export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'up' | 'down';
  redis: 'up' | 'down';
  timestamp: string;
}

// ─────────────────────────────────────────────
// PAGINATION QUERY PARAMS (helpers frontend)
// ─────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}

export interface ArticlesQueryParams extends PaginationParams {
  isPublished?: boolean;
  categoryId?: string;
  tag?: string;
}

export interface UsersQueryParams extends PaginationParams {
  role?: RoleName;
}

export interface CommentsQueryParams extends PaginationParams {
  articleId?: string;
  authorId?: string;
  authorRole?: RoleName;
}

// ─────────────────────────────────────────────
// WEBSOCKET EVENTS (notifications gateway)
// ─────────────────────────────────────────────

export interface WsNotificationPayload {
  event: 'notification';
  data: Notification;
}

export interface WsJoinRoomPayload {
  userId: string;
}
