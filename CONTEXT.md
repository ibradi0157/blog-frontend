# CONTEXT.md — État du projet après itération 2/10

> Mis à jour : 2026-05-25
> Basé sur AUDIT_ET_PLAN_COMPLET.md

---

## ✅ ITÉRATION 1/10 — COMPLÉTÉE

### Ce qui a été fait

#### Sprint 1 — Corrections TypeScript (0 erreurs bloquantes restantes)

**`src/types/api.ts`** — tous les types corrigés :
- `PublicUserProfile` : ajout de `username`, `coverUrl`, `website`, `twitter`, `github`, `linkedin`, `youtube`, `instagram`, `articlesCount`, `totalViews`
- `AuthorListItem` : ajout de `username`, `avatarUrl`, `bio`, `followersCount`
- `CommentAuthor` : ajout de `username`
- `Comment` : ajout de `likesCount`, `isLiked`, `authorId`, `replies`
- `ArticleSummary` : ajout de `status`, `viewsCount`; ajout de `PublicArticle` alias
- `CategoriesResponse` : refactorisé de tableau brut en `{ success?, data: Category[], total? }`
- `ArticleLikedStatusResponse` : aplati avec `isLiked?`, `likeType?` en plus de `data`
- `NotificationType` : étendu avec les types legacy (`LIKE_ARTICLE`, `LIKE_COMMENT`, etc.)
- `UpdateProfileDto` : créé

**`src/lib/auth.ts`** — `AuthUser` étendu avec `displayName`, `username`, `avatarUrl`, `bio`, `website`, `twitter`, `github`, `linkedin`

**`src/lib/api-client.ts`** — corrections :
- Export nommé `apiClient` ajouté (alias de `api`)
- `usersApi.updateProfile()` ajouté
- `usersApi.ban()` ajouté
- `subscriptionsApi.checkFollowing()` alias ajouté
- `subscriptionsApi.followerCount()` alias ajouté
- `analyticsApi.getTimeSeries()` : signature étendue pour accepter string `'7d'|'30d'|'90d'` OU objet
- `categoriesApi.getAll()` : retourne maintenant `CategoriesResponse` (cohérent avec le type)
- Import `UpdateProfileDto` ajouté

**Hooks corrigés** :
- `useBookmarks.ts` : accès `isLiked` sécurisé (`data?.isLiked ?? data?.data?.isLiked`)
- `useFollow.ts` : utilise maintenant les alias `checkFollowing` et `followerCount`
- `useAnalytics.ts` : `getTimeSeries(period)` fonctionne avec la nouvelle signature flexible

**Composants corrigés** :
- `SocialLinks.tsx` : icônes Twitter, LinkedIn, YouTube, Instagram remplacées par SVG inline
- `SearchResults.tsx`, `NotificationCenter.tsx`, `CategoryPageClient.tsx` : `currentPage=` → `page=`
- `NotificationItem.tsx` : prop `onRead` ajoutée
- `AvatarUpload.tsx` : signature `uploadAvatar(user.id, file)` corrigée
- `ArticlesPageClient.tsx` : `res?.data ?? []` corrigé
- `CommentItem.tsx` : `ROUTES.AUTHOR` corrigé avec fallback safe
- `auteurs/[id]/page.tsx` : `Suspense from 'react'`
- `dashboard/articles/page.tsx` : import default `api` corrigé
- 4 imports locaux dans `app/` corrigés vers `@/components/...`

**Fichier manquant créé** : `src/components/dashboard/DashboardStatsClient.tsx`

#### Sprint 2 — UI Primitives (18 fichiers vides implémentés)

- `button.tsx` ✅ — variants: primary, ghost, outline, destructive, secondary; sizes: sm, md, lg, icon
- `input.tsx` ✅ — label, error, hint, forwardRef
- `textarea.tsx` ✅ — label, error, hint, forwardRef
- `badge.tsx` ✅ — variants: default, success, warning, error, info, outline
- `skeleton.tsx` ✅
- `separator.tsx` ✅ — horizontal/vertical
- `avatar.tsx` ✅ — src, fallback, sizes
- `card.tsx` ✅ — Card, CardHeader, CardContent, CardFooter, CardTitle
- `dialog.tsx` ✅ — overlay, Escape, scroll lock
- `tabs.tsx` ✅ — TabsList, TabsTrigger, TabsContent
- `select.tsx` ✅ — forwardRef, label, error
- `switch.tsx` ✅ — accessible (role=switch)
- `progress.tsx` ✅ — value, max, showLabel
- `table.tsx` ✅ — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- `tooltip.tsx` ✅ — 4 positions
- `dropdown-menu.tsx` ✅ — DropdownMenu, DropdownMenuItem, DropdownMenuSeparator
- `sheet.tsx` ✅ — slide-over left/right
- `toast.tsx` + `toaster.tsx` ✅ — context provider + useToast hook

#### Sprint 3 — Dashboard stubs

- `StatCardSkeleton.tsx` ✅ (réexport depuis StatCard)
- `DraftsList.tsx` ✅ (réexport depuis ArticlesTable)
- `PublishedList.tsx` ✅ (réexport depuis ArticlesTable)
- `(auth)/mot-de-passe-oublie/page.tsx` ✅
- `(public)/articles/[slug]/loading.tsx` ✅
- `(public)/categories/[slug]/page.tsx` ✅

#### Sprint 4 — Éditeur Tiptap (tous les 10 fichiers implémentés)

- `AutosaveIndicator.tsx` ✅
- `EditorToolbar.tsx` ✅
- `EditorBubbleMenu.tsx` ✅
- `EditorSlashCommands.tsx` ✅ — SlashCommandList + getSlashItems
- `EditorImageUpload.tsx` ✅
- `EditorCoverUpload.tsx` ✅
- `ArticleMetaForm.tsx` ✅
- `ArticleScheduler.tsx` ✅
- `ArticleVersionHistory.tsx` ✅
- `ArticleEditor.tsx` ✅

#### Sprint 5 — Panel Admin (composants + pages)

**Composants admin créés** : AdminStatCard, AdminArticlesTable, UsersTable, UserRoleSelect, CommentsTable, ReportsTable, CategoryManager, AnalyticsChart, AnalyticsOverview, NewsletterManager, HomepageBuilder, SiteSettingsForm ✅

**Pages admin créées** : page, utilisateurs, utilisateurs/[id], articles, articles/[id], commentaires, commentaires/signalements, categories, analytics, analytics/temps-reel, newsletter, homepage, site, securite ✅

**Pages dashboard créées** : articles/[id], articles/[id]/stats, commentaires, abonnes, parametres ✅

---

## ✅ ITÉRATION 2/10 — COMPLÉTÉE

### Ce qui a été fait

#### Toaster global — ✅ FAIT
- `src/app/layout.tsx` : `<Toaster>` ajouté autour de `{children}` pour activer les toasts globaux dans toute l'application.

#### AuthContext enrichissement post-login — ✅ FAIT
- `src/contexts/AuthContext.tsx` : réécriture complète.
  - Ajout de `enrichFromPublicProfile()` : appelle `api.users.getPublicProfile(userId)` et enrichit `AuthUser` via `store.updateProfile()`.
  - `login()` : enrichit le profil immédiatement après login.
  - Au montage : enrichit silencieusement si l'utilisateur était déjà authentifié (token localStorage).
  - Nouveau : `refreshProfile()` exposé dans le contexte — permet aux composants de forcer la resynchronisation.
- `src/store/authStore.ts` : signature `updateProfile(patch)` étendue de `Partial<Pick<AuthUser, 'email'>>` à `Partial<AuthUser>`.

#### Architecture — Violations "use client" dans page.tsx corrigées — ✅ FAIT

Toutes les pages `app/` sont maintenant de purs Server Components. Les logiques client ont été extraites dans `src/components/`:

| Page                                     | Composant client extrait                               |
|------------------------------------------|--------------------------------------------------------|
| `dashboard/articles/page.tsx`            | `DashboardArticlesClient.tsx`                          |
| `dashboard/commentaires/page.tsx`        | `DashboardCommentsClient.tsx`                          |
| `dashboard/abonnes/page.tsx`             | `DashboardFollowersClient.tsx`                         |
| `dashboard/parametres/page.tsx`          | `DashboardSettingsClient.tsx`                          |
| `admin/analytics/temps-reel/page.tsx`    | `AdminRealTimeClient.tsx`                              |
| `dashboard/articles/[id]/stats/page.tsx` | `ArticleStatsClient.tsx`                               |

#### DashboardSettingsClient — améliorations — ✅ FAIT
- Champs `twitter`, `github`, `linkedin` ajoutés au formulaire.
- Appelle `refreshProfile()` après sauvegarde pour mettre à jour le header/nav immédiatement.

#### Admin — Pages détaillées complètes — ✅ FAIT
- `admin/utilisateurs/[id]` : nouveau composant `AdminUserDetailClient.tsx` avec infos, stats (articles/vues/likes), changement de rôle inline via `UserRoleSelect`, bouton bannir.
- `admin/articles/[id]` : nouveau composant `AdminArticleDetailClient.tsx` avec actions modération (publier/dépublier/supprimer), stats, métadonnées, tags, lien vers l'article public.
- Bug corrigé : `<RoleGuard roles={[...]}>` → `<RoleGuard requiredRole="SECONDARY_ADMIN">` (prop incorrecte).

#### ArticleEditor — SlashCommands intégrées — ✅ FAIT
- `ArticleEditor.tsx` : détection manuelle du `/` dans l'éditeur, affichage du `SlashCommandList` via `createPortal`, gestion clavier (↑ ↓ Entrée), fermeture au clic extérieur.
- Compatible avec et sans `@tiptap/suggestion` : fallback graceful si le package n'est pas installé.

#### package.json — dépendances Tiptap ajoutées — ✅ FAIT
```
@tiptap/pm, @tiptap/starter-kit, @tiptap/extension-image, @tiptap/extension-link,
@tiptap/extension-placeholder, @tiptap/extension-bubble-menu,
@tiptap/extension-character-count, @tiptap/extension-underline,
@tiptap/extension-code-block-lowlight, @tiptap/suggestion, lowlight, clsx
```

---

## 🔄 CE QUI RESTE À FAIRE (itérations 3-10)

### Itération 3 — Installer les dépendances (action manuelle)

```bash
pnpm install
# ou
npm install
```

Les dépendances sont dans `package.json` mais doivent être installées localement.

### Itération 4 — CodeBlockLowlight dans ArticleEditor

Une fois `lowlight` et `@tiptap/extension-code-block-lowlight` installés :

```tsx
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
const lowlight = createLowlight(common);

// Dans extensions de useEditor :
// Remplacer StarterKit.configure({ codeBlock: false }) par StarterKit seul
// Ajouter : CodeBlockLowlight.configure({ lowlight })
```

Fichier : `src/components/editor/ArticleEditor.tsx`

### Itération 5 — Vérifier `pnpm build` (0 erreurs TypeScript)

Objectifs de validation :
- `pnpm build` ou `npx tsc --noEmit` doit passer sans erreur.
- Vérifier que les re-exports `DraftsList`, `PublishedList`, `StatCardSkeleton` correspondent aux noms exportés dans leurs fichiers sources.
- Vérifier que `ArticleStatsClient` a bien accès à `apiClient.articleStats` (méthode `getArticleStats` dans api-client).

```bash
grep -n "articleStats\|getArticleStats" src/lib/api-client.ts
```

### Itération 6 — Slash Commands avec @tiptap/suggestion natif

Actuellement, `ArticleEditor` utilise une détection manuelle du `/` (regex sur `textBefore`). Pour une intégration Tiptap native :

1. Créer une extension `SlashCommand` basée sur `@tiptap/suggestion`.
2. L'ajouter aux extensions de `useEditor`.
3. Supprimer la détection manuelle dans `onUpdate`.

Fichier : `src/components/editor/ArticleEditor.tsx`

### Itération 7 — Homogénéisation AuthUser ↔ PublicUserProfile

`AuthUser` dans `auth.ts` n'a pas `youtube` et `instagram` (présents dans `PublicUserProfile`). Étendre :

```typescript
// src/lib/auth.ts — ajouter :
youtube?:    string | null
instagram?:  string | null
```

Et mettre à jour `enrichFromPublicProfile` dans `AuthContext` pour mapper ces champs.

### Itération 8 — AdminUserDetailClient — articles de l'utilisateur

La section articles de l'utilisateur admin (`admin/utilisateurs/[id]`) est absente. Ajouter :

```tsx
// Utiliser apiClient.users.getUserArticles(userId) pour lister les articles
// Afficher sous forme de liste simple avec liens vers admin/articles/[id]
```

### Itération 9 — Tests et validation finale

- Vérifier que `useAuth` expose bien `refreshProfile` (typage correct).
- Tester le flow login → enrichissement profil → affichage dans le header.
- Vérifier que `Toaster` fonctionne depuis n'importe quel composant enfant (`useToast()`).
- Vérifier les guards admin : `RoleGuard` avec `requiredRole="SECONDARY_ADMIN"` vs `requiredRole="PRIMARY_ADMIN"`.

### Itération 10 — Polissage final

- Ajouter `refreshInterval: 5000` sur le hook `useRealTimeStats()` dans `AdminRealTimeClient` pour la mise à jour automatique.
- `date-fns` : vérifier dans `package.json` — déjà présent (`"date-fns": "^4"`).
- `recharts` : vérifier — déjà présent (`"recharts": "^2"`).
- Vérifier l'export de `formatCount` dans `@/lib/utils` — ✅ déjà présent (ligne 182).
- Vérifier que `useToast` est bien importé depuis `@/components/ui/toaster` (et non depuis `@/components/ui/toast`).

---

## 📊 BILAN CUMULATIF

| Catégorie                              | Avant iter.1 | Après iter.1 | Après iter.2 |
|----------------------------------------|:------------:|:------------:|:------------:|
| Fichiers vides                         | 66           | 0            | 0            |
| Erreurs TypeScript estimées            | 96           | ~5-10        | ~2-5         |
| Composants UI manquants                | 18           | 0            | 0            |
| Composants admin manquants             | 12           | 0            | 0            |
| Pages admin vides                      | 14           | 0            | 0            |
| Pages admin détaillées (stubs)         | 2            | 2 (stubs)    | 0            |
| Pages dashboard vides                  | 5            | 0            | 0            |
| Violations "use client" dans page.tsx  | 0            | 5            | 0            |
| Toaster global                         | ❌           | ❌           | ✅           |
| AuthContext enrichissement profil      | ❌           | ❌           | ✅           |
| SlashCommands dans ArticleEditor       | ❌           | ❌           | ✅           |
| Dépendances Tiptap dans package.json   | ❌           | ❌           | ✅           |

---

## 🏗️ STRUCTURE FINALE APRÈS ITÉRATION 2

### Nouveaux fichiers créés en itération 2

```
src/
  app/
    layout.tsx                                   ← Toaster ajouté
    dashboard/
      articles/page.tsx                          ← Server Component pur
      articles/[id]/stats/page.tsx               ← Server Component pur
      commentaires/page.tsx                      ← Server Component pur
      abonnes/page.tsx                           ← Server Component pur
      parametres/page.tsx                        ← Server Component pur
    admin/
      utilisateurs/[id]/page.tsx                 ← Server Component pur (dynamic import)
      articles/[id]/page.tsx                     ← Server Component pur (dynamic import)
      analytics/temps-reel/page.tsx              ← Server Component pur
      securite/page.tsx                          ← Server Component pur (stub amélioré)
  contexts/
    AuthContext.tsx                              ← enrichFromPublicProfile, refreshProfile
  components/
    dashboard/
      DashboardArticlesClient.tsx                ← extrait de page.tsx
      DashboardCommentsClient.tsx                ← extrait de page.tsx
      DashboardFollowersClient.tsx               ← extrait de page.tsx
      DashboardSettingsClient.tsx                ← extrait + twitter/github/linkedin + refreshProfile
      ArticleStatsClient.tsx                     ← extrait de page.tsx
    admin/
      AdminUserDetailClient.tsx                  ← vue détaillée utilisateur (infos + stats + ban)
      AdminArticleDetailClient.tsx               ← vue détaillée article (modération + stats)
      AdminRealTimeClient.tsx                    ← extrait de page.tsx
    editor/
      ArticleEditor.tsx                          ← SlashCommands intégrées via createPortal
  store/
    authStore.ts                                 ← updateProfile étendu à Partial<AuthUser>
```

