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
- [x] `src/app/(auth)/connexion/page.tsx` — page login
- [x] `src/app/(auth)/inscription/page.tsx` — page inscription
- [x] `src/app/(auth)/verification-email/page.tsx` — page vérif email (Suspense pour useSearchParams)
- [x] `src/app/(auth)/mot-de-passe-oublie/page.tsx` — page mot de passe oublié
- [x] `src/app/(auth)/reinitialiser-mdp/page.tsx` — page reset password (Suspense)
- [x] `src/components/auth/LoginForm.tsx` — email + password, show/hide, validation inline, gestion erreur JWT
- [x] `src/components/auth/RegisterForm.tsx` — username + email + password + confirm, hints force MdP, redirect vers verification
- [x] `src/components/auth/VerifyEmailForm.tsx` — 6 inputs OTP, paste support, renvoi code avec cooldown 60s
- [x] `src/components/auth/ForgotPasswordForm.tsx` — email, succès générique (anti-user-enumeration), état envoyé
- [x] `src/components/auth/ResetPasswordForm.tsx` — tokenId + token depuis URL, hints force MdP, états: lien invalide / succès
- [x] `src/hooks/useAuth.ts` — re-export de useAuth() + sélecteurs authStore

### Phase 5 — Homepage dynamique (COMPLÈTE) ✅ NEW
- [x] `src/components/homepage/HeroSection.tsx` — grand titre, CTA, animation légère
- [x] `src/components/homepage/FeaturedSection.tsx` — articles mis en avant
- [x] `src/components/homepage/TrendingSection.tsx` — articles tendance
- [x] `src/components/homepage/CategoriesSection.tsx` — grille catégories
- [x] `src/components/homepage/AuthorsSection.tsx` — auteurs populaires
- [x] `src/components/homepage/NewsletterBanner.tsx` — inscription newsletter
- [x] `src/hooks/useHomepage.ts` — fetch GET /homepage avec SWR

### Phase 6 — Articles publics (COMPLÈTE) ✅ NEW
- [x] `src/hooks/useArticles.ts` — fetch GET /articles/public avec SWR + pagination
- [x] `src/hooks/useArticle.ts` — fetch GET /articles/public/:slug avec SWR
- [x] `src/components/articles/ArticleCard.tsx` — cover, titre, auteur, temps lecture, stats
- [x] `src/components/articles/ArticleCardSkeleton.tsx` — loading state carte article
- [x] `src/components/articles/ArticleGrid.tsx` — responsive 1/2/3 colonnes
- [x] `src/components/articles/ArticleList.tsx` — vue compacte
- [x] `src/components/articles/ArticleHeader.tsx` — titre, meta, cover hero
- [x] `src/components/articles/ArticleContent.tsx` — rendu HTML sécurisé (DOMPurify)
- [x] `src/components/articles/ArticleActions.tsx` — like, dislike, bookmark, share
- [x] `src/components/articles/ArticleTags.tsx` — tags cliquables → /recherche?tag=X
- [x] `src/components/articles/ArticleStats.tsx` — vues, likes, temps lecture
- [x] `src/components/articles/ArticleMeta.tsx` — auteur, date, catégorie (compact + full)
- [x] `src/components/articles/ReadingProgress.tsx` — barre de progression lecture fixe en haut
- [x] `src/components/articles/RelatedArticles.tsx` — articles similaires (même catégorie)
- [x] `src/components/articles/FeaturedArticle.tsx` — hero card article mis en avant
- [x] `src/app/(public)/articles/page.tsx` + `ArticlesPageClient.tsx` — liste + filtres catégorie/tag + pagination + vue grid/list
- [x] `src/app/(public)/articles/[slug]/page.tsx` + `ArticlePageClient.tsx` — article complet, SEO metadata SSR, ReadingProgress, RelatedArticles

---

## 🔲 Ce qui reste à faire

### Phase 7 — Commentaires
- [ ] `components/comments/CommentSection.tsx`
- [ ] `components/comments/CommentForm.tsx`
- [ ] `components/comments/CommentItem.tsx`
- [ ] `components/comments/CommentReplyForm.tsx`
- [ ] `components/comments/CommentActions.tsx`
- [ ] `components/comments/CommentSkeleton.tsx`
- [ ] `hooks/useComments.ts`

### Phase 8 — Profils & Auteurs
- [ ] `app/(public)/auteurs/page.tsx`
- [ ] `app/(public)/auteurs/[id]/page.tsx`
- [ ] `components/profile/ProfileHeader.tsx`
- [ ] `components/profile/ProfileStats.tsx`
- [ ] `components/profile/FollowButton.tsx`
- [ ] `components/profile/AvatarUpload.tsx`
- [ ] `components/profile/SocialLinks.tsx`
- [ ] `hooks/useFollow.ts`

### Phase 9 — Recherche
- [ ] `app/(public)/recherche/page.tsx`
- [ ] `components/search/SearchBar.tsx`
- [ ] `components/search/SearchModal.tsx`
- [ ] `components/search/SearchResults.tsx`
- [ ] `components/search/SearchFilters.tsx`

### Phase 10 — Notifications (centre)
- [ ] `app/(member)/notifications/page.tsx` — centre de notifications paginé
- [ ] `components/notifications/NotificationCenter.tsx`
- [ ] `hooks/useNotifications.ts`

### Phase 11 — Dashboard auteur
- [ ] `app/dashboard/page.tsx`
- [ ] `app/dashboard/articles/page.tsx`
- [ ] `app/dashboard/articles/nouveau/page.tsx`
- [ ] `app/dashboard/articles/[id]/page.tsx`
- [ ] `app/dashboard/articles/[id]/stats/page.tsx`
- [ ] `app/dashboard/commentaires/page.tsx`
- [ ] `app/dashboard/abonnes/page.tsx`
- [ ] `app/dashboard/parametres/page.tsx`
- [ ] `components/dashboard/StatCard.tsx`, `StatCardSkeleton.tsx`, `RecentActivity.tsx`, `ArticlesTable.tsx`, `DraftsList.tsx`, `PublishedList.tsx`

### Phase 12 — Éditeur d'articles
- [ ] `components/editor/ArticleEditor.tsx` — Tiptap
- [ ] `components/editor/EditorToolbar.tsx`
- [ ] `components/editor/EditorBubbleMenu.tsx`
- [ ] `components/editor/EditorSlashCommands.tsx`
- [ ] `components/editor/EditorImageUpload.tsx`
- [ ] `components/editor/EditorCoverUpload.tsx`
- [ ] `components/editor/ArticleMetaForm.tsx`
- [ ] `components/editor/ArticleScheduler.tsx`
- [ ] `components/editor/ArticleVersionHistory.tsx`
- [ ] `components/editor/AutosaveIndicator.tsx`

### Phase 13 — Panel Admin
- [ ] `app/admin/page.tsx`
- [ ] `app/admin/utilisateurs/`, `articles/`, `commentaires/`, `categories/`, `analytics/`, `newsletter/`, `homepage/`, `site/`, `securite/`
- [ ] Tous les composants `components/admin/`

### Phase 14 — Installation manuelle restante
- [ ] `pnpm add react-hook-form clsx tailwind-merge` (react-hook-form manquant)
- [ ] `pnpm add -D @types/node`
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

### Décisions Phase 4
- **Validation** : manuelle inline (pas de react-hook-form) — à migrer si besoin de formulaires complexes
- **Anti-enumeration** : ForgotPasswordForm affiche toujours l'état "envoyé" quelle que soit la réponse backend
- **OTP** : VerifyEmailForm supporte le paste du code complet + navigation clavier entre digits
- **Suspense** : pages utilisant `useSearchParams()` wrappées dans `<Suspense>` (Next.js requirement)
- **Redirect post-register** : `/verification-email?email=xxx` (email passé en query param)
- **Redirect post-reset-password invalide** : état géré côté composant (lien invalide si pas de tokenId/token)

### Décisions Phase 6
- **Architecture page article** : Server Component (`page.tsx`) pour SSR/SEO metadata + Client Component (`ArticlePageClient.tsx`) pour interactivité
- **Prefetch SSR** : `generateMetadata` + prefetch `initialArticle` côté serveur → passé en prop au client component pour éviter le flash de chargement
- **Page liste articles** : split `page.tsx` (Server, Suspense) + `ArticlesPageClient.tsx` (Client, useSearchParams)
- **Article à la une** : premier article affiché en `FeaturedArticle` (hero card) sur la première page sans filtre
- **Filtres** : catégorie + tag + recherche texte, synchronisés dans l'URL (searchParams)
- **ReadingProgress** : barre fixe en haut (z-index 9999), opacité 0 → 1 après 80px de scroll, target `#article-content`
- **RelatedArticles** : fetch côté client de la même catégorie, exclusion de l'article courant, max 3

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
| 7 — Commentaires | 🔲 À faire | 7 fichiers |
| 8 — Profils & Auteurs | 🔲 À faire | 8 fichiers |
| 9 — Recherche | 🔲 À faire | 5 fichiers |
| 10 — Notifications centre | 🔲 À faire | 3 fichiers |
| 11 — Dashboard auteur | 🔲 À faire | 14 fichiers |
| 12 — Éditeur d'articles | 🔲 À faire | 10 fichiers |
| 13 — Panel Admin | 🔲 À faire | 20+ fichiers |
| 14 — Installation dépendances | 🔲 À faire | — |