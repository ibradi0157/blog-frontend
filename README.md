# Blog Frontend

Frontend Next.js 16 d'une plateforme de blog communautaire (interface en français). Il consomme une **API REST NestJS** et des **notifications Socket.IO** — il ne fonctionne pas seul sans backend.

## Démarrage en 3 étapes

```bash
npm install
copy .env.example .env.local   # Windows — ou: cp .env.example .env.local
npm run dev
```

- Frontend : [http://localhost:3001](http://localhost:3001)
- Backend attendu par défaut : `http://localhost:3000` (variable `NEXT_PUBLIC_API_URL`)

## Documentation

| Document | Contenu |
|----------|---------|
| **[docs/GUIDE-DEVELOPPEUR.md](docs/GUIDE-DEVELOPPEUR.md)** | Architecture du site, auth, rôles, où modifier le code, **connexion backend**, CORS, dépannage |
| **[.env.example](.env.example)** | Variables d'environnement à copier vers `.env.local` |

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 · SWR · Zustand · TipTap · Socket.IO client

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement |
| `npm run build` | Build production |
| `npm start` | Serveur production |
| `npm run line` | ESLint |

## Connexion backend (résumé)

1. Lancer l'API NestJS compatible (port `3000` ou autre).
2. Configurer `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

3. Activer **CORS** sur l'API pour `http://localhost:3001`.
4. Vérifier : `curl http://localhost:3000/health`

Détails, liste des routes, formats JSON et checklist : **[docs/GUIDE-DEVELOPPEUR.md](docs/GUIDE-DEVELOPPEUR.md)**.
