# CONTEXT.md — Blog Platform Frontend
> Fichier de suivi du projet. À mettre à jour à chaque session de travail.
> Dernière mise à jour : 2026-05-24

---

## 🗂 Vue d'ensemble du projet

| Élément | Détail |
|---|---|
| **Projet** | Plateforme de blog/communauté (Medium × Notion × Substack) |
| **Backend** | NestJS — Railway — PostgreSQL + Redis |
| **Frontend** | Next.js 15 App Router — TypeScript — TailwindCSS — shadcn/ui |
| **Auth** | JWT (Bearer token) + reCAPTCHA v2 en production |
| **Temps réel** | WebSocket via Socket.IO (notifications) |
| **Repo backend** | `blog-backend-main` |
| **Repo frontend** | `blog-frontend` |

---

## ✅ Ce qui est fait

### Fix critique
- [x] **`tsconfig.json`** — alias `@/*` corrigé : `"./*"` → `"./src/*"` (résout les 9 erreurs TypeScript)

### Phase 0 — Analyse & Architecture
- [x] Analyse complète du backend NestJS (246 fichiers)
- [x] Cartographie de tous les modules : auth, users, articles, categories, comments, likes, notifications, subscriptions, newsletter, analytics, homepage, site-settings, legal, footer, health
- [x] Génération de l'arborescence complète Next.js App Router (`ARBORESCENCE.md`)
- [x] Génération du fichier `src/types/api.ts` (80+ interfaces TypeScript)
- [x] Définition du design system (couleurs, typo, spacing, animations)
- [x] Mapping routes API → pages frontend (tableau complet)

### Phase 1 — Setup projet (COMPLÈTE)
- [x] `.env.local.example` — variables d'environnement documentées
- [x] `src/types/api.ts` — 80+ interfaces TypeScript prêtes
- [x] `tsconfig.json` — alias `@/*` → `./src/*` corrigé
- [x] `next.config.ts` — remotePatterns images (http/https), rewrites API `/api/:path*`
- [x] `src/app/globals.css` — design tokens CSS custom properties, Tailwind v4 bridge, animations, utilitaires `.card`, `.btn-primary`, `.btn-ghost`, `.text-gradient`

### Phase 2 — Fondations (COMPLÈTE)
- [x] `src/lib/api-client.ts` — client fetch centralisé, intercepteur JWT, gestion erreurs typée, tous les namespaces API
- [x] `src/lib/constants.ts` — BASE_URL, WS_URL, ROLES, ROLE_LEVEL, ROUTES (UPPER_CASE), PAGINATION, EDITOR, DESIGN tokens
- [x] `src/lib/cn.ts` — merge classNames (clsx + tailwind-merge)
- [x] `src/lib/auth.ts` — decode JWT, isTokenExpired, getUserFromToken, persistance localStorage, visitorId/sessionId
- [x] `src/lib/socket.ts` — client Socket.IO singleton, auth JWT, reconnexion, helpers onNotification/joinUserRoom
- [x] `src/lib/analytics.ts` — track(), trackDebounced(), raccourcis sémantiques
- [x] `src/lib/utils.ts` — formatDate, timeAgo, truncate, slugify, estimateReadTime, formatCount, resolveImageUrl, copyToClipboard…
- [x] `src/store/authStore.ts` — Zustand : user, token, isAuthenticated, login/logout/hydrate, sélecteurs de rôle
- [x] `src/store/notificationStore.ts` — Zustand : notifications[], unreadCount, addNotification, markRead, markAllRead
- [x] `src/store/editorStore.ts` — Zustand : contenu, meta, isDirty, saveStatus, toCreateDto/toUpdateDto
- [x] `src/contexts/AuthContext.tsx` — Provider JWT global, auto-logout à expiration, useAuth(), isHydrated
- [x] `src/contexts/NotificationContext.tsx` — Provider WebSocket + chargement HTTP initial, useNotificationContext(), refresh()
- [x] `src/contexts/ThemeContext.tsx` — Provider dark/light/system, préférence localStorage, useTheme()

### Phase 3 — Composants UI de base (COMPLÈTE)
- [x] `src/app/layout.tsx` — root layout : AuthProvider + NotificationProvider + ThemeProvider + Geist fonts, lang="fr", dark class, viewport metadata
- [x] `src/app/loading.tsx` — spinner global Next.js
- [x] `src/app/not-found.tsx` — page 404 stylée
- [x] `src/app/error.tsx` — page erreur avec reset()
- [x] `src/app/page.tsx` — homepage avec Hero + Features sections (CTA vers /articles et /inscription)
- [x] `src/app/(auth)/layout.tsx` — layout centré, fond sombre, logo, pas de navbar
- [x] `src/app/(public)/layout.tsx` — Navbar + Footer + MobileNav
- [x] `src/app/(member)/layout.tsx` — Navbar + MobileNav
- [x] `src/app/dashboard/layout.tsx` — Sidebar dashboard + AuthGuard MEMBER+
- [x] `src/app/admin/layout.tsx` — Sidebar admin + RoleGuard SECONDARY_ADMIN+
- [x] `src/components/ui/loading-spinner.tsx` — LoadingSpinner (xs/sm/md/lg) + PageLoader
- [x] `src/components/ui/pagination.tsx` — pagination avec ellipsis, prev/next, ARIA
- [x] `src/components/layout/PageWrapper.tsx` — max-width + padding, prop `narrow` et `noPadding`
- [x] `src/components/layout/Navbar.tsx` — transparent → solid au scroll, login/notif/profil, menu mobile hamburger
- [x] `src/components/layout/Footer.tsx` — 3 sections de liens + social icons + copyright
- [x] `src/components/layout/MobileNav.tsx` — navigation mobile bottom bar, badge unread, active state
- [x] `src/components/layout/Sidebar.tsx` — dashboard + admin, sections, active highlighting, variant prop
- [x] `src/components/auth/AuthGuard.tsx` — HOC redirect si non connecté ou rôle insuffisant (isHydrated)
- [x] `src/components/auth/RoleGuard.tsx` — HOC redirect si rôle insuffisant
- [x] `src/components/profile/UserAvatar.tsx` — avatar image ou initiales colorées (palette 10 couleurs, hash sur username/email)
- [x] `src/components/notifications/NotificationBell.tsx` — cloche + badge, dropdown toggle, click outside
- [x] `src/components/notifications/NotificationDropdown.tsx` — 6 dernières notifs, markAllRead, refresh, lien vers centre
- [x] `src/components/notifications/NotificationItem.tsx` — icône par type, timeAgo, markRead au click, lien optionnel

### Phase 4 — Authentification (COMPLÈTE)
- [x] `src/app/(auth)/connexion/page.tsx`
- [x] `src/app/(auth)/inscription/page.tsx`
- [x] `src/app/(auth)/verification-email/page.tsx` — Suspense pour useSearchParams
- [x] `src/app/(auth)/mot-de-passe-oublie/page.tsx`
- [x] `src/app/(auth)/reinitialiser-mdp/page.tsx` — Suspense
- [x] `src/components/auth/LoginForm.tsx`
- [x] `src/components/auth/RegisterForm.tsx`
- [x] `src/components/auth/VerifyEmailForm.tsx` — OTP 6 chiffres + paste + cooldown 60s
- [x] `src/components/auth/ForgotPasswordForm.tsx` — anti-user-enumeration
- [x] `src/components/auth/ResetPasswordForm.tsx`
- [x] `src/hooks/useAuth.ts`

### Phase 5 — Homepage dynamique (COMPLÈTE)
- [x] `src/components/homepage/HeroSection.tsx`
- [x] `src/components/homepage/FeaturedSection.tsx`
- [x] `src/components/homepage/TrendingSection.tsx`
- [x] `src/components/homepage/CategoriesSection.tsx`
- [x] `src/components/homepage/AuthorsSection.tsx`
- [x] `src/components/homepage/NewsletterBanner.tsx`
- [x] `src/hooks/useHomepage.ts`

### Phase 6 — Articles publics (COMPLÈTE)
- [x] `src/hooks/useArticles.ts`
- [x] `src/hooks/useArticle.ts`
- [x] `src/components/articles/ArticleCard.tsx`
- [x] `src/components/articles/ArticleCardSkeleton.tsx`
- [x] `src/components/articles/ArticleGrid.tsx`
- [x] `src/components/articles/ArticleList.tsx`
- [x] `src/components/articles/ArticleHeader.tsx`
- [x] `src/components/articles/ArticleContent.tsx` — DOMPurify
- [x] `src/components/articles/ArticleActions.tsx` — like, dislike, bookmark, share
- [x] `src/components/articles/ArticleTags.tsx`
- [x] `src/components/articles/ArticleStats.tsx`
- [x] `src/components/articles/ArticleMeta.tsx`
- [x] `src/components/articles/ReadingProgress.tsx`
- [x] `src/components/articles/RelatedArticles.tsx`
- [x] `src/components/articles/FeaturedArticle.tsx`
- [x] `src/app/(public)/articles/page.tsx` + `ArticlesPageClient.tsx`
- [x] `src/app/(public)/articles/[slug]/page.tsx` + `ArticlePageClient.tsx`

### Phase 7 — Commentaires (COMPLÈTE) ✅ NEW
- [x] `src/hooks/useComments.ts` — SWR, addComment, replyToComment, deleteComment, likeComment, reportComment
- [x] `src/components/comments/CommentSkeleton.tsx` — CommentSkeleton + CommentListSkeleton
- [x] `src/components/comments/CommentForm.tsx` — formulaire (auth check, validation, states)
- [x] `src/components/comments/CommentReplyForm.tsx` — wrapper reply avec @username
- [x] `src/components/comments/CommentActions.tsx` — like, répondre, supprimer (owner), signaler, menu MoreHorizontal
- [x] `src/components/comments/CommentItem.tsx` — avatar, username, timeAgo, replies collapsibles
- [x] `src/components/comments/CommentSection.tsx` — section complète avec ReportModal intégré
- [x] `src/components/comments/ReportModal.tsx` — modal signalement avec 5 raisons

### Phase 8 — Profils & Auteurs (COMPLÈTE) ✅ NEW
- [x] `src/hooks/useFollow.ts` — follow/unfollow, isFollowing, followerCount, SWR
- [x] `src/components/profile/ProfileHeader.tsx` — cover, avatar overlapping, bio, stats, follow, social links
- [x] `src/components/profile/ProfileStats.tsx` — articles, vues, abonnés, likes (icônes + formatCount)
- [x] `src/components/profile/FollowButton.tsx` — follow/unfollow avec états (logged out → login, following → hover unfollow)
- [x] `src/components/profile/AvatarUpload.tsx` — upload avatar avec preview hover, validation type/taille
- [x] `src/components/profile/SocialLinks.tsx` — website, twitter, github, linkedin, youtube, instagram
- [x] `src/app/(public)/auteurs/page.tsx` + `AuthorsPageClient.tsx` — grille auteurs avec follow inline
- [x] `src/app/(public)/auteurs/[id]/page.tsx` — SSR metadata + articles de l'auteur

### Phase 9 — Recherche (COMPLÈTE) ✅ NEW
- [x] `src/components/search/SearchBar.tsx` — input avec clear button, submit → /recherche?q=
- [x] `src/components/search/SearchFilters.tsx` — tri (pertinence/récent/populaire/vues) + filtres catégories pills
- [x] `src/components/search/SearchResults.tsx` — grille résultats + empty state + pagination
- [x] `src/components/search/SearchModal.tsx` — modal avec debounce 300ms, aperçu 5 résultats, lien "voir tout"
- [x] `src/app/(public)/recherche/page.tsx` + `SearchPageClient.tsx` — page complète, searchParams synchro URL

### Phase 10 — Notifications centre (COMPLÈTE) ✅ NEW
- [x] `src/hooks/useNotifications.ts` — SWR paginé, markRead, markAllRead, sync avec notificationStore
- [x] `src/components/notifications/NotificationCenter.tsx` — liste paginée, refresh, markAllRead, unread badge
- [x] `src/app/(member)/notifications/page.tsx` — AuthGuard + NotificationCenter

### Hooks complémentaires (COMPLETS) ✅ NEW
- [x] `src/hooks/useCategories.ts` — SWR GET /categories avec dedupingInterval 60s
- [x] `src/hooks/useBookmarks.ts` — liked articles + isBookmarked(id) + useArticleLikedStatus
- [x] `src/hooks/useAnalytics.ts` — useAnalyticsOverview, useAnalyticsTimeSeries, useRealTimeStats
- [x] `src/hooks/useUsers.ts` — admin : liste users, changeRole, banUser

### Pages complémentaires (COMPLÈTES) ✅ NEW
- [x] `src/app/(public)/categories/[slug]/page.tsx` + `CategoryPageClient.tsx` — articles par catégorie
- [x] `src/app/(public)/legal/[slug]/page.tsx` — pages légales dynamiques (SSR)
- [x] `src/app/(member)/profil/page.tsx` + `ProfilPageClient.tsx` — édition profil (bio, social, avatar)

---

## 🔲 Ce qui reste à faire

### Phase 11 — Dashboard auteur
- [ ] `app/dashboard/page.tsx` — stats résumé (StatCards + RecentActivity)
- [ ] `app/dashboard/articles/page.tsx` — liste mes articles (brouillons + publiés)
- [ ] `app/dashboard/articles/nouveau/page.tsx` — créer article
- [ ] `app/dashboard/articles/[id]/page.tsx` — éditer article
- [ ] `app/dashboard/articles/[id]/stats/page.tsx` — stats article
- [ ] `app/dashboard/commentaires/page.tsx` — commentaires reçus
- [ ] `app/dashboard/abonnes/page.tsx` — abonnés + following
- [ ] `app/dashboard/parametres/page.tsx` — paramètres compte
- [ ] `components/dashboard/StatCard.tsx` + `StatCardSkeleton.tsx`
- [ ] `components/dashboard/RecentActivity.tsx`
- [ ] `components/dashboard/ArticlesTable.tsx` — tableau avec actions (publier, supprimer, éditer)
- [ ] `components/dashboard/DraftsList.tsx`
- [ ] `components/dashboard/PublishedList.tsx`

### Phase 12 — Éditeur d'articles
- [ ] `components/editor/ArticleEditor.tsx` — Tiptap (extensions : bold, italic, headings, lists, link, image)
- [ ] `components/editor/EditorToolbar.tsx`
- [ ] `components/editor/EditorBubbleMenu.tsx`
- [ ] `components/editor/EditorSlashCommands.tsx`
- [ ] `components/editor/EditorImageUpload.tsx`
- [ ] `components/editor/EditorCoverUpload.tsx`
- [ ] `components/editor/ArticleMetaForm.tsx` — titre, excerpt, SEO, catégorie, tags, slug
- [ ] `components/editor/ArticleScheduler.tsx`
- [ ] `components/editor/ArticleVersionHistory.tsx`
- [ ] `components/editor/AutosaveIndicator.tsx`

### Phase 13 — Panel Admin
- [ ] `app/admin/page.tsx` — dashboard analytics overview
- [ ] `app/admin/utilisateurs/page.tsx` + `[id]/page.tsx`
- [ ] `app/admin/articles/page.tsx` + `[id]/page.tsx`
- [ ] `app/admin/commentaires/page.tsx` + `signalements/page.tsx`
- [ ] `app/admin/categories/page.tsx`
- [ ] `app/admin/analytics/page.tsx` + `temps-reel/page.tsx`
- [ ] `app/admin/newsletter/page.tsx`
- [ ] `app/admin/homepage/page.tsx`
- [ ] `app/admin/site/page.tsx`
- [ ] `app/admin/securite/page.tsx`
- [ ] `components/admin/AdminStatCard.tsx`, `UsersTable.tsx`, `UserRoleSelect.tsx`
- [ ] `components/admin/CommentsTable.tsx`, `ReportsTable.tsx`
- [ ] `components/admin/AnalyticsChart.tsx`, `AnalyticsOverview.tsx`
- [ ] `components/admin/HomepageBuilder.tsx`, `CategoryManager.tsx`
- [ ] `components/admin/SiteSettingsForm.tsx`, `NewsletterManager.tsx`, `AdminArticlesTable.tsx`

### Phase 14 — Installation dépendances
- [ ] `pnpm add react-hook-form zod clsx tailwind-merge swr zustand socket.io-client date-fns dompurify`
- [ ] `pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
- [ ] `pnpm add recharts framer-motion`
- [ ] `pnpm add -D @types/node @types/dompurify`
- [ ] Setup shadcn/ui : `npx shadcn@latest init`
- [ ] Ajout composants shadcn : `npx shadcn@latest add button input card dialog dropdown-menu toast badge avatar skeleton tabs select switch table`
- [ ] Création `.env.local` depuis `.env.local.example`

---

## 🏗 Architecture — Rappels clés

### ROUTES (constants.ts) — format UPPER_CASE
```ts
ROUTES.HOME, ROUTES.ARTICLES, ROUTES.ARTICLE(slug)
ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.VERIFY_EMAIL
ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD
ROUTES.DASHBOARD, ROUTES.DASHBOARD_ARTICLES, ROUTES.DASHBOARD_NEW_ARTICLE
ROUTES.ADMIN, ROUTES.ADMIN_USERS, ROUTES.ADMIN_ANALYTICS…
ROUTES.AUTHOR(id), ROUTES.SEARCH, ROUTES.NOTIFICATIONS, ROUTES.PROFIL
```

### Contextes & stores
| Source | Ce qu'il expose |
|---|---|
| `useAuth()` (AuthContext) | `user, token, isAuthenticated, isHydrated, login(), logout()` |
| `useNotificationContext()` | `refresh()` seulement |
| `useNotificationStore()` | `notifications[], unreadCount, markRead(), markAllRead()` |
| `useAuthStore()` | store Zustand complet |

### Guards
- `<AuthGuard requiredRole="MEMBER">` — redirige vers LOGIN si non connecté ou rôle insuffisant
- `<RoleGuard requiredRole="SECONDARY_ADMIN">` — idem, rôle obligatoire

### Décisions Phase 7
- **CommentSection** : intègre CommentForm (root) + CommentItem (liste) + ReportModal (lazy)
- **Replies** : collapsibles avec toggle, maximum 1 niveau de profondeur affiché
- **Auth check** : CommentForm affiche un lien de connexion si non authentifié
- **Optimiste** : revalidation SWR après chaque mutation (pas d'optimistic update pour simplifier)

### Décisions Phase 8
- **FollowButton** : affiche rien si `user.id === authorId` (propre profil)
- **AvatarUpload** : validation côté client (type image, max 5 Mo) avant POST
- **ProfileHeader** : avatar avec `ring-4` pour chevaucher la cover image
- **AuthorPage** : SSR pour metadata SEO, articles passés directement depuis le même appel API

### Décisions Phase 9
- **SearchModal** : debounce 300ms, max 5 résultats aperçu, ferme à Escape
- **SearchPageClient** : tous les filtres synchronisés dans l'URL (searchParams), `keepPreviousData: true` pour éviter le flash
- **SearchFilters** : categories chargées depuis `/categories` (SWR), pills toggle

### Décisions Phase 6
- **Architecture page article** : Server Component (`page.tsx`) pour SSR/SEO metadata + Client Component (`ArticlePageClient.tsx`) pour interactivité
- **Prefetch SSR** : `generateMetadata` + prefetch `initialArticle` côté serveur
- **ReadingProgress** : barre fixe en haut (z-index 9999), target `#article-content`
- **RelatedArticles** : fetch côté client, même catégorie, max 3, exclusion de l'article courant

---

## 📐 Types TypeScript configurés (`src/types/api.ts`)

### Génériques
| Interface | Usage |
|---|---|
| `ApiResponse<T>` | Wrapper `{ success, data, message? }` |
| `PaginatedResponse<T>` | `{ data[], total, page, limit }` |
| `ApiError` | Erreur backend `{ statusCode, message, error? }` |

### Auth
| Interface | Route associée |
|---|---|
| `RoleName` | `PRIMARY_ADMIN \| SECONDARY_ADMIN \| MEMBER \| SIMPLE_USER` |
| `RegisterDto` | `POST /auth/register` |
| `LoginDto` | `POST /auth/login` |
| `AuthResponse` | Réponse login/register |
| `MeResponse` | `GET /auth/me` |
| `RequestEmailCodeDto` | `POST /auth/request-email-code` |
| `VerifyEmailDto` | `POST /auth/verify-email` |
| `ForgotPasswordDto` | `POST /auth/forgot-password` |
| `ResetPasswordDto` | `POST /auth/reset-password` |
| `CheckEmailResponse` | `GET /auth/check-email` |

### Users & Profils
| Interface | Route associée |
|---|---|
| `User` | Entité utilisateur complète |
| `PublicUserProfile` | Profil public réduit |
| `UpdateProfileDto` | `PUT /users/profile` |
| `MembersResponse` | `GET /users` |
| `AuthorsResponse` | `GET /users/authors` |
| `AuthorProfileResponse` | `GET /users/authors/:id` |
| `ChangeRoleDto` | `PATCH /users/:id/role` |
| `FollowResponse` | Follow/unfollow |
| `FollowStatus` | `GET /users/follow/status/:id` |

### Articles
| Interface | Route associée |
|---|---|
| `Article` | Entité article complète |
| `ArticleSummary` | Liste articles |
| `PublicArticle` | Article public (enrichi auteur/catégorie/tags) |
| `CreateArticleDto` | `POST /articles` |
| `UpdateArticleDto` | `PUT /articles/:id` |
| `ArticlesListResponse` | `GET /articles` (auteur) |
| `PublicArticlesResponse` | `GET /articles/public` |
| `PublicArticleResponse` | `GET /articles/public/:slug` |
| `PublishResponse` | `POST /articles/:id/publish` |
| `UploadCoverResponse` | Upload image couverture |

### Categories
| Interface | Route associée |
|---|---|
| `Category` | Entité catégorie |
| `CategoriesResponse` | `GET /categories` |
| `CreateCategoryDto` | `POST /categories` |
| `UpdateCategoryDto` | `PUT /categories/:id` |

### Comments
| Interface | Route associée |
|---|---|
| `Comment` | Entité commentaire (avec replies) |
| `CreateCommentDto` | `POST /comments` |
| `CommentsListResponse` | `GET /comments/article/:articleId` |
| `CommentReport` | Entité signalement |

### Likes
| Interface | Route associée |
|---|---|
| `LikeArticleDto` | `POST /articles/:articleId/like` |
| `LikeCommentDto` | `POST /comments/:commentId/like` |
| `LikeResponse` | Réponse like/dislike |

### Notifications
| Interface | Route associée |
|---|---|
| `NotificationType` | `LIKE_ARTICLE \| LIKE_COMMENT \| COMMENT \| FOLLOW \| NEW_ARTICLE \| NEWSLETTER` |
| `Notification` | `{ id, type, title, link?, isRead, createdAt }` |
| `NotificationsResponse` | `GET /notifications` |
| `UnreadCountResponse` | `GET /notifications/unread/count` |

### Subscriptions
| Interface | Route associée |
|---|---|
| `SubscriptionType` | `author \| category \| tag \| global` |
| `Subscription` | Entité subscription |
| `CreateSubscriptionDto` | `POST /subscriptions` |
| `CheckFollowingResponse` | `GET /subscriptions/check/author/:id` |
| `FollowerCountResponse` | `GET /subscriptions/followers/author/:id` |

### User Preferences
| Interface | Route associée |
|---|---|
| `LikedArticle` | Article liké |
| `LikedArticlesResponse` | `GET /user-preferences/liked-articles` |
| `ArticleLikedStatusResponse` | `GET /user-preferences/article/:id/liked` |

### Newsletter
| Interface | Route associée |
|---|---|
| `SubscribeNewsletterDto` | `POST /newsletter/subscribe` |
| `NewsletterCountResponse` | `GET /newsletter/count` |
| `SendNewsletterDto` | `POST /newsletter/admin/send` |

### Analytics
| Interface | Route associée |
|---|---|
| `EventType` | Union type des 16 types d'événements |
| `TrackEventDto` | `POST /analytics/track` |
| `AnalyticsOverview` | `GET /analytics/overview` |
| `TimeSeriesResponse` | `GET /analytics/timeseries` |
| `RealTimeStats` | `GET /analytics/realtime` |

### Homepage & Site
| Interface | Route associée |
|---|---|
| `HomepageConfig` | Config complète homepage |
| `PublicHomepageResponse` | `GET /homepage` |
| `SiteSettings` | Paramètres admin |
| `PublicSiteSettings` | Paramètres publics |

### Legal & Footer
| Interface | Route associée |
|---|---|
| `LegalPageSlug` | `privacy-policy \| terms-of-service \| cookie-policy \| about` |
| `LegalPage` | Entité page légale |
| `FooterConfig` | Configuration footer |

### Helpers frontend
| Interface | Usage |
|---|---|
| `PaginationParams` | Params communs `{ page, limit }` |
| `ArticlesQueryParams` | Filtres articles |
| `WsNotificationPayload` | Payload WebSocket notification |
| `HealthStatus` | `GET /health` |

---

## 🎨 Design System (référence)

```
Couleurs (CSS variables)
  --bg-base       : #0B0D10   ← fond principal
  --bg-card       : #13161B   ← cartes
  --bg-hover      : #1A1E25   ← hover
  --text-primary  : #F5F7FA
  --text-secondary: #8B95A3
  --text-muted    : #4A5260
  --accent        : #5B8CFF
  --accent-hover  : #7AA3FF
  --accent-muted  : #1E2E50
  --border        : #1E2228
  --border-hover  : #2D3340
  --error         : #FF5B5B
  --success       : #4ADE80
  --warning       : #FFA928

Utilitaires CSS dans globals.css
  .card           → bg-card + border + rounded-xl
  .card-hover     → transition hover (border, bg, translateY, shadow)
  .btn-primary    → bouton accent bleu
  .btn-ghost      → bouton outline
  .text-gradient  → dégradé text-primary → accent

Animations
  .animate-fade-in        → fade + translateY 8px, 300ms
  .animate-fade-in-fast   → fade 150ms
  .animate-slide-in       → slide depuis la droite
  .animate-pulse-dot      → pulsation opacity (badge unread)
  spin (keyframe)         → rotation 360°
```

---

## 🔐 Rôles & Permissions

| Rôle | Valeur backend | ROLE_LEVEL | Accès |
|---|---|---|---|
| Visiteur | — | — | Lecture publique |
| Utilisateur connecté | `SIMPLE_USER` | 1 | Commenter, liker, suivre |
| Auteur | `MEMBER` | 2 | Écrire, publier, stats |
| Modérateur | `SECONDARY_ADMIN` | 3 | Modérer, signalements |
| Admin | `PRIMARY_ADMIN` | 4 | Contrôle total |

---

## 📝 Notes & décisions techniques

- **Client API** : fetch natif, `ApiClientError` typée, namespace par domaine dans `api-client.ts`
- **State** : Zustand pour auth + notifications + éditeur ; SWR pour le data fetching dans les hooks
- **Auth** : JWT localStorage, hydraté au montage via `AuthContext.isHydrated`, auto-logout à expiration
- **Guards** : utilisent `isHydrated` (pas `isLoading`) pour éviter le flash de redirect
- **WebSocket** : Socket.IO singleton `socket.ts`, géré par `NotificationContext`, unreadCount dans `notificationStore`
- **ROUTES** : constantes UPPER_CASE dans `constants.ts` (ex: `ROUTES.HOME`, `ROUTES.ARTICLES`)
- **Éditeur** : Tiptap recommandé, autosave 30s via `PUT /articles/:id`
- **Thème** : dark par défaut, classe `dark` sur `<html>`, CSS variables dans globals.css
- **Images** : `next/image` avec `remotePatterns` configurés dans `next.config.ts`
- **Formulaires** : validation inline manuelle pour Phase 4 ; react-hook-form + zod pour Phase 11+ (dashboard)
- **Search** : debounce 300ms dans SearchModal, searchParams URL pour SearchPage, `keepPreviousData: true` SWR
- **Comments** : 1 niveau de replies max affiché, collapse/expand, report via ReportModal
- **Follow** : double SWR (status + count), toggle optimiste avec mutex `isToggling`

---

## 📊 Progression globale

| Phase | Statut | Fichiers |
|---|---|---|
| 0 — Analyse & Architecture | ✅ Complète | — |
| 1 — Setup projet | ✅ Complète | 5 fichiers |
| 2 — Fondations (lib + store + contexts) | ✅ Complète | 12 fichiers |
| 3 — Composants UI de base | ✅ Complète | 20 fichiers |
| 4 — Authentification | ✅ Complète | 11 fichiers |
| 5 — Homepage dynamique | ✅ Complète | 7 fichiers |
| 6 — Articles publics | ✅ Complète | 17 fichiers |
| 7 — Commentaires | ✅ Complète | 8 fichiers |
| 8 — Profils & Auteurs | ✅ Complète | 10 fichiers |
| 9 — Recherche | ✅ Complète | 7 fichiers |
| 10 — Notifications centre | ✅ Complète | 3 fichiers |
| Hooks & pages complémentaires | ✅ Complets | 10 fichiers |
| 11 — Dashboard auteur | 🔲 À faire | 13 fichiers |
| 12 — Éditeur d'articles | 🔲 À faire | 10 fichiers |
| 13 — Panel Admin | 🔲 À faire | 20+ fichiers |
| 14 — Installation dépendances | 🔲 À faire | — |