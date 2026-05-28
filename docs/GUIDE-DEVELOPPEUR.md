# Guide développeur — Blog Frontend

Documentation pour comprendre le site, le modifier, et le brancher sur un backend compatible (NestJS prévu par le projet).

**Public visé :** développeurs débutants comme confirmés. Si un terme vous semble obscur, cherchez-le dans la section [Glossaire](#glossaire).

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Démarrage rapide](#2-démarrage-rapide)
3. [Variables d'environnement (.env)](#3-variables-denvironnement-env)
4. [Architecture du projet](#4-architecture-du-projet)
5. [Comment le site fonctionne](#5-comment-le-site-fonctionne)
6. [Authentification et rôles](#6-authentification-et-rôles)
7. [Communication avec le backend](#7-communication-avec-le-backend)
8. [Connecter un backend compatible](#8-connecter-un-backend-compatible)
9. [Pages et routes (URLs)](#9-pages-et-routes-urls)
10. [Modifier le code : où chercher quoi](#10-modifier-le-code--où-chercher-quoi)
11. [Dépannage](#11-dépannage)
12. [Glossaire](#12-glossaire)

---

## 1. Vue d'ensemble

| Élément | Détail |
|--------|--------|
| **Type** | Application web (frontend uniquement) |
| **Framework** | [Next.js](https://nextjs.org) 16 (App Router) |
| **Langage** | TypeScript |
| **Style** | Tailwind CSS 4 |
| **Backend attendu** | API REST **NestJS** + **Socket.IO** (notifications) |
| **Port par défaut** | Frontend : `3000` — Backend : `3001` |

Le frontend **ne contient pas** de base de données ni de logique métier persistante. Tout passe par des appels HTTP vers un serveur externe. Sans backend allumé, les pages statiques s'affichent mais login, articles, admin, etc. échoueront.

```
┌─────────────────┐         HTTP (REST)          ┌─────────────────┐
│  Navigateur     │ ◄──────────────────────────► │  Backend NestJS │
│  Next.js :3001  │         JWT Bearer           │  API :3000      │
└────────┬────────┘                              └────────┬────────┘
         │                                                │
         │         WebSocket (Socket.IO)                  │
         └────────────────────────────────────────────────┘
                    notifications temps réel
```

---

## 2. Démarrage rapide

### Prérequis

- **Node.js** 20+ (recommandé)
- **npm**, **pnpm**, ou **yarn**
- Un **backend compatible** sur le port configuré (souvent `3001`)

### Installation

```bash
cd blog-frontend
npm install
```

### Configuration

```bash
# Copier le modèle d'environnement
cp .env.example .env.local   # Linux/macOS
copy .env.example .env.local # Windows
```

Éditez `.env.local` si votre API n'est pas sur `http://localhost:3001`.

### Lancer le frontend

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Vérifier que le backend répond

Dans un autre terminal :

```bash
curl http://localhost:3000/health
```

Si le frontend et le backend tournent, la connexion est prête pour login et données dynamiques.

---

## 3. Variables d'environnement (.env)

### Faut-il un fichier `.env` ?

**Oui, en pratique** — surtout dès que l'API n'est plus sur `localhost:3001` (staging, production, autre machine).

| Fichier | Rôle |
|---------|------|
| `.env.example` | Modèle versionné (sans secrets) — **à copier** |
| `.env.local` | Vos valeurs locales — **gitignore** par Next.js |
| `.env.production` | Optionnel pour build prod |

### Variables utilisées

| Variable | Obligatoire | Défaut | Description |
|----------|-------------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | Non | `http://localhost:3000` | URL de base de l'API REST |
| `NEXT_PUBLIC_WS_URL` | Non | = `NEXT_PUBLIC_API_URL` | URL Socket.IO (notifications) |

**Pourquoi `NEXT_PUBLIC_` ?** Next.js n'expose au navigateur que les variables avec ce préfixe. L'API est appelée depuis le client (formulaires, dashboard), donc l'URL doit être publique.

**Ce qu'il ne faut PAS mettre dans `.env.local` côté frontend :** secrets serveur, clés Stripe privées, etc. Le JWT est stocké dans le navigateur après login (voir [Authentification](#6-authentification-et-rôles)).

### Où c'est lu dans le code

- `src/lib/constants.ts` — `BASE_URL`, `WS_URL`
- `src/lib/api-client.ts` — toutes les requêtes REST
- `next.config.ts` — images distantes + rewrite optionnel `/api/*`

---

## 4. Architecture du projet

```
blog-frontend/
├── .env.example              # Modèle de configuration
├── next.config.ts            # Images, proxy /api → backend
├── package.json
├── docs/
│   └── GUIDE-DEVELOPPEUR.md  # Ce fichier
└── src/
    ├── app/                  # Pages Next.js (routes = dossiers)
    │   ├── layout.tsx        # Layout racine + providers
    │   ├── page.tsx          # Page d'accueil /
    │   ├── (public)/         # Zone publique (navbar + footer)
    │   ├── (auth)/           # Connexion, inscription, etc.
    │   ├── (member)/         # Profil, notifications
    │   ├── dashboard/        # Espace auteur (MEMBER+)
    │   └── admin/            # Administration (SECONDARY_ADMIN+)
    ├── components/           # UI réutilisable (boutons, formulaires…)
    ├── contexts/             # Auth, thème, notifications
    ├── hooks/                # Hooks SWR (chargement données)
    ├── lib/
    │   ├── api-client.ts     # ★ Tous les appels API
    │   ├── auth.ts           # Décodage JWT côté client
    │   ├── constants.ts      # URLs, rôles, routes nommées
    │   ├── socket.ts         # WebSocket notifications
    │   └── analytics.ts      # Tracking événements
    ├── store/                # Zustand (auth, éditeur, notifs)
    └── types/
        └── api.ts            # ★ Types = contrat avec le backend
```

### Couches de données (résumé)

| Couche | Techno | Rôle |
|--------|--------|------|
| **API** | `fetch` via `api-client.ts` | Envoyer/recevoir JSON |
| **Cache client** | SWR (`src/hooks/*`) | Éviter de recharger à chaque clic |
| **État global** | Zustand (`src/store/*`) | Utilisateur connecté, brouillon éditeur |
| **Contexte React** | `src/contexts/*` | Login/logout, thème, socket notifs |

Il n'y a **pas** de routes API Next.js (`route.ts`) : le frontend ne fait pas office de proxy applicatif (sauf rewrite optionnel dans `next.config.ts`, non utilisé par le code actuel).

---

## 5. Comment le site fonctionne

### Parcours utilisateur typique

1. **Visiteur** — Parcourt `/articles`, `/categories`, `/auteurs` sans compte. Les données viennent du backend (routes `noAuth`).
2. **Inscription** — `/inscription` → `POST /auth/register` → JWT stocké → redirection dashboard.
3. **Membre (MEMBER)** — Accède à `/dashboard` : créer/éditer articles (TipTap), stats, commentaires reçus, abonnés.
4. **Admin (SECONDARY_ADMIN+)** — `/admin` : modération, utilisateurs, analytics, newsletter, homepage, paramètres site.
5. **Notifications** — Liste HTTP + push temps réel via Socket.IO quand connecté.

### Rendu des pages

- **Server Components** : quelques pages publiques pré-chargent des données côté serveur (SEO, metadata), ex. détail article `/articles/[slug]`.
- **Client Components** (`'use client'`) : formulaires, dashboard, admin, tout ce qui utilise `localStorage` ou SWR.

### Thème clair / sombre

`ThemeContext` + clé `blog_theme` dans `localStorage`. La classe `dark` est appliquée sur `<html>`.

### Éditeur d'articles

- Composant principal : `src/components/editor/`
- État brouillon : `src/store/editorStore.ts`
- Sauvegarde auto (~3 s) vers `PUT /articles/:id`
- Images : upload `multipart/form-data` vers le backend

### Analytics

`src/lib/analytics.ts` envoie des événements en `POST /analytics/track` (sans bloquer l'UI). IDs visiteur/session en localStorage/sessionStorage.

---

## 6. Authentification et rôles

### Flux de connexion

```
Formulaire /connexion
    → authApi.login({ email, password })   [sans JWT]
    → Backend renvoie { accessToken, userId, role, ... }
    → AuthContext.login() stocke le token
    → localStorage clé "blog_access_token"
    → Requêtes suivantes : header Authorization: Bearer <token>
```

### Où est le token ?

- **localStorage**, clé `blog_access_token` (définie dans `constants.ts` et `api-client.ts`).
- **Pas de cookie httpOnly** dans ce projet : protection des routes = côté client (`AuthGuard`) + validation JWT côté backend.

### Rôles (du plus faible au plus fort)

| Rôle | Niveau | Accès typique |
|------|--------|----------------|
| `SIMPLE_USER` | 1 | Compte basique |
| `MEMBER` | 2 | Dashboard auteur |
| `SECONDARY_ADMIN` | 3 | Panel `/admin` |
| `PRIMARY_ADMIN` | 4 | Actions sensibles (changer rôles, purge…) |

La hiérarchie est dans `ROLE_LEVEL` (`src/lib/constants.ts`). Les layouts protégés :

- `src/app/dashboard/layout.tsx` → `AuthGuard` avec rôle minimum `MEMBER`
- `src/app/admin/layout.tsx` → `RoleGuard` avec `SECONDARY_ADMIN`

**Important :** un utilisateur peut taper une URL admin dans la barre d'adresse ; le guard redirige après chargement. La **vraie** sécurité doit rester sur le **backend** (guards NestJS).

### Expiration du token

`AuthContext` lit l'expiration du JWT (décodage base64 côté client, **sans vérifier la signature**) et déconnecte avant expiration.

---

## 7. Communication avec le backend

### Point d'entrée unique : `api-client.ts`

Toute interaction REST passe par `src/lib/api-client.ts` :

```typescript
import api from '@/lib/api-client'

// Exemples
await api.auth.login({ email, password })
await api.articles.getPublic({ page: 1, limit: 12 })
await api.categories.getAll()
```

Exports nommés : `authApi`, `usersApi`, `articlesApi`, `commentsApi`, etc.

### Format des requêtes

- **URL :** `{NEXT_PUBLIC_API_URL}{path}` — ex. `http://localhost:3001/articles/public`
- **JSON :** `Content-Type: application/json` sauf uploads
- **Auth :** `Authorization: Bearer <token>` sauf si `noAuth: true`
- **Erreurs :** levée de `ApiClientError` avec `statusCode`, `message`

### Format des réponses attendu (NestJS)

Le client accepte deux styles selon les endpoints :

1. **Enveloppe** : `{ success: true, data: { ... } }` — type `ApiResponse<T>` dans `api.ts`
2. **Direct** : objet ou tableau à la racine (certaines listes publiques)

En cas d'erreur HTTP, le backend doit renvoyer du JSON proche de :

```json
{
  "statusCode": 400,
  "message": "Description de l'erreur",
  "error": "Bad Request"
}
```

### Upload de fichiers

Champ formulaire **`file`** dans `FormData` :

- Avatar : `POST /users/:id/avatar`
- Couverture article : `POST /articles/:id/cover`
- Image contenu : `POST /articles/:id/images` ou `/articles/upload-content-image`
- Logo site : routes dans `siteSettingsApi`

Les URLs d'images retournées par l'API doivent être autorisées dans `next.config.ts` (`images.remotePatterns`).

### WebSocket (notifications)

- Fichier : `src/lib/socket.ts`
- Connexion : `io(WS_URL, { auth: { token } })`
- Événements serveur → client : `notification`, `connected`
- Événements client → serveur : `join_room`, `mark_read`

Sans backend Socket.IO, les notifications restent disponibles via **polling HTTP** (`GET /notifications`).

### Contrat TypeScript

**`src/types/api.ts`** documente les DTO et réponses. Si vous développez le backend, alignez vos contrôleurs sur ces interfaces (c'est la source de vérité côté frontend).

---

## 8. Connecter un backend compatible

### Checklist minimale

- [ ] API REST accessible depuis le navigateur (CORS configuré)
- [ ] `GET /health` répond (utilisé pour sanity check)
- [ ] `POST /auth/login` et `POST /auth/register` renvoient `accessToken` + infos user
- [ ] JWT accepté en `Authorization: Bearer`
- [ ] Routes listées dans `api-client.ts` implémentées (ou sous-ensemble pour MVP)
- [ ] (Optionnel) Socket.IO sur la même origine ou URL dédiée → `NEXT_PUBLIC_WS_URL`

### CORS (indispensable en développement)

Le frontend tourne sur `http://localhost:3001`, l'API sur `http://localhost:3000` → **origines différentes**.

Le backend doit autoriser :

```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

Avec NestJS, cela se configure généralement dans `main.ts` :

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
  credentials: true, // si cookies un jour
});
```

### Auth : ce que le backend doit renvoyer

**`POST /auth/login`** et **`POST /auth/register`** — corps attendu côté frontend (`AuthResponse`) :

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "userId": "uuid",
    "email": "user@example.com",
    "displayName": "Jean",
    "role": "MEMBER",
    "avatarUrl": null,
    "isEmailVerified": true
  }
}
```

Le JWT payload côté client lit au minimum : `sub` ou `userId`, `role`, `exp`.

**`GET /auth/me`** — pour vérifier le token : `{ success, data: { userId, role } }`.

### MVP : endpoints prioritaires

Pour un site « qui marche » en lecture seule + login :

| Priorité | Méthode | Route |
|----------|---------|-------|
| P0 | GET | `/health` |
| P0 | POST | `/auth/login`, `/auth/register` |
| P0 | GET | `/articles/public`, `/articles/public/:slug` |
| P0 | GET | `/categories` |
| P1 | GET | `/users/public/:id`, `/users/authors` |
| P1 | POST | `/comments` (si commentaires activés) |
| P2 | CRUD | `/articles`, publish, uploads (dashboard) |
| P2 | * | Routes `/admin/*` selon fonctionnalités admin utilisées |

Liste complète : parcourir les commentaires `/**` dans `src/lib/api-client.ts` (chaque méthode documente la route).

### Adapter un backend non-NestJS

C'est possible si vous respectez :

1. Les **URLs** (paths) identiques ou vous forkez `api-client.ts`
2. Les **formats JSON** de `src/types/api.ts`
3. Le **JWT Bearer** sur les routes protégées
4. Les **codes HTTP** standards (401, 403, 404, 400)

Sinon, créez une couche « adaptateur » dans le backend ou modifiez uniquement `api-client.ts` (une fonction `request()` centralisée facilite cela).

### Production

```env
NEXT_PUBLIC_API_URL=https://api.votredomaine.fr
NEXT_PUBLIC_WS_URL=https://api.votredomaine.fr
```

- Build : `npm run build` puis `npm start`
- Configurer CORS backend avec l'URL du frontend déployé
- Vérifier `images.remotePatterns` dans `next.config.ts` pour le hostname des uploads
- HTTPS recommandé (JWT en localStorage est sensible au XSS)

### Rewrite `/api` (optionnel)

`next.config.ts` proxy `/api/*` vers le backend. **Le code actuel n'utilise pas ce proxy** — il appelle directement `NEXT_PUBLIC_API_URL`. Vous pouvez soit :

- Garder l'appel direct (simple, CORS requis), soit
- Refactorer `BASE_URL` vers `/api` pour masquer l'origine (CORS simplifié même origine)

---

## 9. Pages et routes (URLs)

Les groupes `(public)`, `(auth)`, `(member)` n'apparaissent **pas** dans l'URL.

### Public

| URL | Description |
|-----|-------------|
| `/` | Accueil (marketing ; contenu dynamique homepage via API admin) |
| `/articles` | Liste articles publiés |
| `/articles/[slug]` | Détail article |
| `/categories` | Liste catégories |
| `/categories/[slug]` | Articles d'une catégorie |
| `/auteurs` | Liste auteurs |
| `/auteurs/[id]` | Profil auteur |
| `/recherche` | Recherche |
| `/legal/[slug]` | Pages légales (CGU, confidentialité…) |

### Authentification

| URL | Description |
|-----|-------------|
| `/connexion` | Login |
| `/inscription` | Register |
| `/verification-email` | Code email |
| `/mot-de-passe-oublie` | Demande reset |
| `/reinitialiser-mdp` | Nouveau mot de passe |

### Membre connecté

| URL | Description |
|-----|-------------|
| `/profil` | Profil |
| `/notifications` | Centre de notifications |
| `/dashboard` | Tableau de bord auteur |
| `/dashboard/articles` | Mes articles |
| `/dashboard/articles/nouveau` | Création |
| `/dashboard/articles/[id]` | Édition |
| `/dashboard/articles/[id]/stats` | Statistiques |
| `/dashboard/commentaires` | Commentaires reçus |
| `/dashboard/abonnes` | Abonnés |
| `/dashboard/parametres` | Paramètres |

### Administration

| URL | Description |
|-----|-------------|
| `/admin` | Vue d'ensemble |
| `/admin/utilisateurs` | Gestion users |
| `/admin/articles` | Tous les articles |
| `/admin/commentaires` | Modération |
| `/admin/categories` | Catégories |
| `/admin/analytics` | Statistiques |
| `/admin/newsletter` | Newsletter |
| `/admin/homepage` | Contenu accueil |
| `/admin/site` | Logo, favicon, SEO |
| `/admin/securite` | Sécurité |

Constantes nommées : `ROUTES` dans `src/lib/constants.ts`.

---

## 10. Modifier le code : où chercher quoi

| Je veux… | Fichier / dossier |
|----------|-------------------|
| Changer l'URL de l'API | `.env.local`, `constants.ts` |
| Ajouter un appel API | `api-client.ts` + type dans `api.ts` |
| Nouvelle page | `src/app/.../page.tsx` |
| Formulaire login | `src/components/auth/LoginForm.tsx` |
| Menu navigation | `src/components/layout/` |
| Couleurs / thème global | `src/app/globals.css`, `constants.ts` → `DESIGN` |
| Protéger une section | `AuthGuard` / `RoleGuard` dans le `layout.tsx` du segment |
| Liste articles avec cache | `src/hooks/useArticles.ts` |
| Bouton réutilisable | `src/components/ui/` |

### Scripts npm

| Commande | Action |
|----------|--------|
| `npm run dev` | Serveur développement |
| `npm run build` | Build production |
| `npm start` | Serveur production (après build) |
| `npm run line` | ESLint |

---

## 11. Dépannage

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| « Impossible de joindre le serveur » | Backend arrêté ou mauvaise URL | Vérifier `NEXT_PUBLIC_API_URL`, lancer l'API, `curl /health` |
| Erreur CORS dans la console | Backend n'autorise pas `:3001` | Configurer CORS sur NestJS |
| 401 sur toutes les actions | Token absent/expiré | Se reconnecter ; vérifier `localStorage` → `blog_access_token` |
| Images cassées | URL upload non autorisée par Next Image | Ajouter hostname dans `next.config.ts` |
| Notifications temps réel KO | Socket.IO down ou mauvais `WS_URL` | Vérifier `NEXT_PUBLIC_WS_URL` ; HTTP seul fonctionne quand même |
| Page admin vide puis redirect | Rôle insuffisant | Compte `SECONDARY_ADMIN` minimum |
| Changement `.env` ignoré | Serveur pas redémarré | Stopper `npm run dev` et relancer |

---

## 12. Glossaire

| Terme | Signification |
|-------|----------------|
| **API / Backend** | Serveur qui stocke données et vérifie les droits |
| **JWT** | Jeton JSON signé = carte d'identité temporaire après login |
| **Bearer** | Préfixe du header `Authorization: Bearer <token>` |
| **CORS** | Règles navigateur pour appels cross-domaine |
| **SSR** | Rendu côté serveur Next.js (premier HTML) |
| **SWR** | Bibliothèque de cache/revalidation de données |
| **Zustand** | Petit gestionnaire d'état React global |
| **Socket.IO** | Couche WebSocket avec reconnexion et événements nommés |
| **DTO** | Objet décrivant le JSON envoyé/reçu (types dans `api.ts`) |
| **noAuth** | Option du client API = ne pas envoyer le JWT |

---

## Fichiers de référence rapide

| Sujet | Chemin |
|-------|--------|
| Client HTTP | `src/lib/api-client.ts` |
| Types backend | `src/types/api.ts` |
| Auth store | `src/store/authStore.ts` |
| Provider auth | `src/contexts/AuthContext.tsx` |
| Routes nommées | `src/lib/constants.ts` |
| Config Next | `next.config.ts` |
| Exemple env | `.env.example` |

---

*Dernière mise à jour : alignée sur la structure du dépôt blog-frontend (Next.js 16, client NestJS).*
