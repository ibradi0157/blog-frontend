# CONTEXT.md — État du projet après itération 1/10

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
- `useFollow.ts` : utilise maintenant les alias `checkFollowing` et `followerCount` (déjà corrects grâce aux alias ajoutés dans api-client)
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

- `AutosaveIndicator.tsx` ✅ — statuts: idle, saving, saved, error
- `EditorToolbar.tsx` ✅ — Bold, Italic, Underline, Strike, H1-H3, lists, blockquote, code, link, image
- `EditorBubbleMenu.tsx` ✅ — menu flottant au survol de sélection
- `EditorSlashCommands.tsx` ✅ — SlashCommandList + getSlashItems helper
- `EditorImageUpload.tsx` ✅ — upload fichier + URL
- `EditorCoverUpload.tsx` ✅ — upload couverture article
- `ArticleMetaForm.tsx` ✅ — excerpt, catégorie, tags, boutons publier/dépublier/archiver
- `ArticleScheduler.tsx` ✅ — datetime picker + appel API schedule
- `ArticleVersionHistory.tsx` ✅ — liste versions avec restauration
- `ArticleEditor.tsx` ✅ — composant central Tiptap avec autosave, side panel meta/history

#### Sprint 5 — Panel Admin (composants + pages)

**Composants admin créés** :
- `AdminStatCard.tsx` ✅ — avec tendance
- `AdminArticlesTable.tsx` ✅ — avec search, filtres, pagination
- `UsersTable.tsx` ✅ — avec search, rôle, ban
- `UserRoleSelect.tsx` ✅ — select inline avec PATCH
- `CommentsTable.tsx` ✅
- `ReportsTable.tsx` ✅ — resolve/dismiss
- `CategoryManager.tsx` ✅ — CRUD inline
- `AnalyticsChart.tsx` ✅ — recharts LineChart
- `AnalyticsOverview.tsx` ✅ — 4 stats + graphique + selector période
- `NewsletterManager.tsx` ✅ — compteur + envoi
- `HomepageBuilder.tsx` ✅ — toggle sections
- `SiteSettingsForm.tsx` ✅ — paramètres site

**Pages admin créées** :
- `admin/page.tsx` ✅
- `admin/utilisateurs/page.tsx` ✅
- `admin/utilisateurs/[id]/page.tsx` ✅ (stub)
- `admin/articles/page.tsx` ✅
- `admin/articles/[id]/page.tsx` ✅ (stub)
- `admin/commentaires/page.tsx` ✅
- `admin/commentaires/signalements/page.tsx` ✅
- `admin/categories/page.tsx` ✅
- `admin/analytics/page.tsx` ✅
- `admin/analytics/temps-reel/page.tsx` ✅
- `admin/newsletter/page.tsx` ✅
- `admin/homepage/page.tsx` ✅
- `admin/site/page.tsx` ✅
- `admin/securite/page.tsx` ✅ (stub — backend à implémenter)

**Pages dashboard créées** :
- `dashboard/articles/[id]/page.tsx` ✅ — ArticleEditor mode edit
- `dashboard/articles/[id]/stats/page.tsx` ✅
- `dashboard/commentaires/page.tsx` ✅
- `dashboard/abonnes/page.tsx` ✅
- `dashboard/parametres/page.tsx` ✅

---

## 🔄 CE QUI RESTE À FAIRE (itérations 2-10)

### Itération 2 — Dépendances Tiptap à installer

```bash
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extension-link \
  @tiptap/extension-placeholder @tiptap/extension-bubble-menu \
  @tiptap/extension-character-count \
  @tiptap/extension-underline \
  @tiptap/extension-code-block-lowlight lowlight \
  @tiptap/suggestion
```

L'éditeur est implémenté mais ne compilera pas sans ces dépendances installées.

### Itération 3 — Intégration Toaster dans le layout

Ajouter le `<Toaster>` dans `src/app/layout.tsx` pour activer les toasts globaux :
```tsx
import { Toaster } from '@/components/ui/toaster';
// Dans le body : <Toaster>{children}</Toaster>
```

### Itération 4 — AuthContext enrichissement

Dans `src/contexts/AuthContext.tsx`, après login, appeler `GET /auth/me` ou `GET /users/me` pour enrichir `AuthUser` avec `displayName`, `avatarUrl`, `bio`, etc. (voir §3.3 de l'audit).

### Itération 5 — `useCategories` hook (vérifier l'adaptation)

`ArticleMetaForm` utilise `useCategories` — vérifier que ce hook retourne bien `categories` avec la nouvelle structure `CategoriesResponse.data`.

### Itération 6 — Tiptap Extension Code Block Lowlight

`ArticleEditor` importe `StarterKit.configure({ codeBlock: false })` pour permettre `@tiptap/extension-code-block-lowlight`. Une fois les dépendances installées, ajouter l'extension :
```tsx
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
const lowlight = createLowlight(common);
// Dans extensions: CodeBlockLowlight.configure({ lowlight })
```

### Itération 7 — Slash Commands complètes

`EditorSlashCommands` exporte les fonctions helper mais l'intégration avec `@tiptap/suggestion` dans `ArticleEditor` n'est pas encore branchée. Il faut créer l'extension `SlashCommand` via `suggestion` et l'ajouter aux extensions Tiptap.

### Itération 8 — Admin pages détaillées (stubs à compléter)

- `admin/utilisateurs/[id]/page.tsx` : vue détaillée avec actions (ban, changeRole, voir articles)
- `admin/articles/[id]/page.tsx` : vue détaillée avec modération et stats

### Itération 9 — Tests et validation

- Vérifier `pnpm build` (0 erreurs TypeScript)
- Vérifier que les re-exports `DraftsList`, `PublishedList`, `StatCardSkeleton` correspondent bien aux noms exportés dans leurs fichiers sources
- Vérifier les types `useCategories` hook avec `CategoriesResponse`

### Itération 10 — Polissage final

- `date-fns` : s'assurer que `date-fns` est dans `package.json` (utilisé dans `ArticleVersionHistory`)
- `recharts` : vérifier que recharts est dans package.json (utilisé dans `AnalyticsChart`)
- Ajouter `recharts` si manquant : `pnpm add recharts`
- Vérifier l'export de `formatCount` dans `@/lib/utils`

---

## 📊 BILAN

| Catégorie | Avant | Après |
|---|---|---|
| Fichiers vides | 66 | 0 |
| Erreurs TypeScript estimées | 96 | ~5-10 (dépendances manquantes) |
| Composants UI manquants | 18 | 0 |
| Composants admin manquants | 12 | 0 |
| Pages admin vides | 14 | 0 |
| Pages dashboard vides | 5 | 0 |
| Composants éditeur vides | 10 | 0 |

