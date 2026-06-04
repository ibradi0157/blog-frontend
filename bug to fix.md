# 🐛 Bugs à corriger - Frontend

## Vue d'ensemble
Ce document liste tous les bugs identifiés dans le frontend Next.js du blog. Les bugs sont classés par priorité et par domaine.

---

## 🔴 CRITIQUE - Authentification & Persistance de session


```

### 2. **Hydratation de session non fiable**
**Fichiers**: `src/store/authStore.ts`, `src/contexts/AuthContext.tsx`
**Problème**: La fonction `hydrate()` est appelée dans un `useEffect` sans dépendances, mais le store n'attend pas la fin de l'hydratation avant d'afficher le contenu protégé. Cela cause des flashs de redirection.
**Correction**:
- S'assurer que `isHydrated` bloque le rendu initial dans `AuthGuard`
- Ajouter un état de loading explicite pendant l'hydratation initiale

### 3. **getUserFromToken manquant/incomplet**
**Fichier**: `src/store/authStore.ts` (ligne 119)
**Problème**: La fonction `getUserFromToken` est appelée mais son implémentation n'est pas visible. Si elle échoue silencieusement, l'utilisateur est déconnecté sans raison.
**Correction**: Vérifier que cette fonction gère correctement les tokens malformés et log les erreurs.

### 4. **Token expiré non détecté immédiatement**
**Fichier**: `src/contexts/AuthContext.tsx` (lignes 109-128)
**Problème**: Le timer de déconnexion automatique calcule `delay = Math.max(0, (secondsLeft - 10) * 1_000)`. Si le token expire dans moins de 10 secondes, l'utilisateur peut faire des requêtes qui échouent.
**Correction**: Déconnecter immédiatement si `secondsLeft <= 10`.

---

## 🔴 CRITIQUE - Éditeur d'articles

### 5. **Impossible d'écrire/modifier un article (éditeur bloqué)**
**Fichier**: `src/components/editor/ArticleEditor.tsx` (lignes 246-286)
**Problème**: En mode `create`, l'article n'a pas d'`articleId` au départ. Mais l'upload d'images et certaines fonctionnalités nécessitent un `articleId`. L'éditeur peut se bloquer si on essaie d'uploader une image avant la première sauvegarde.
**Correction**:
```typescript
// Dans handleSlashCommand ou onImageUpload, vérifier:
if (!articleId) {
  // Sauvegarder d'abord pour obtenir un ID
  await save();
  // Puis réessayer l'upload
}
```

### 6. **Autosave ne se déclenche pas en mode création**
**Fichier**: `src/components/editor/ArticleEditor.tsx` (lignes 304-330)
**Problème**: La fonction `save()` vérifie `if (!articleId && mode === 'edit') return;` ce qui devrait être `if (!articleId && mode === 'edit') return;`. Mais en mode `create`, il faut créer l'article d'abord.
**Correction**: La logique est correcte mais le problème est que `triggerAutosave` est appelé à chaque changement, ce qui peut créer plusieurs articles en parallèle si le premier appel n'est pas terminé. Ajouter un flag `isSaving`.

### 7. **Image upload popup ne s'affiche pas si pas d'articleId**
**Fichier**: `src/components/editor/ArticleEditor.tsx` (lignes 8449-8461)
**Problème**: Le popup d'upload d'image est conditionnel à `articleId`:
```tsx
{showImageUpload && articleId && (
```
**Correction**: Permettre l'upload même sans articleId en créant d'abord l'article ou en utilisant un endpoint d'upload temporaire.

---

## 🟠 IMPORTANT - Pages légales manquantes dans l'admin

### 8. **Onglet "Pages légales" absent du menu admin**
**Fichier**: `src/components/layout/Sidebar.tsx` (lignes 56-86 - `ADMIN_NAV`)
**Problème**: Il n'y a pas de lien vers la gestion des pages légales dans le menu admin. L'API backend existe (`/admin/legal`) mais le frontend ne propose pas d'interface.
**Correction**: Ajouter un item dans `ADMIN_NAV`:
```typescript
{
  title: 'Configuration',
  items: [
    { href: ROUTES.ADMIN_NEWSLETTER,         icon: Mail,            label: 'Newsletter'      },
    { href: ROUTES.ADMIN_HOMEPAGE,           icon: Home,            label: 'Homepage'        },
    { href: ROUTES.ADMIN_LEGAL,              icon: FileText,        label: 'Pages légales'   }, // AJOUTER
    { href: ROUTES.ADMIN_SITE,               icon: Globe,           label: 'Site'            },
    { href: ROUTES.ADMIN_SECURITY,           icon: Shield,          label: 'Sécurité'        },
  ],
},
```

### 9. **Route ADMIN_LEGAL manquante dans constants.ts**
**Fichier**: `src/lib/constants.ts`
**Problème**: La route `ADMIN_LEGAL` n'est pas définie dans l'objet `ROUTES`.
**Correction**:
```typescript
ADMIN_LEGAL:             '/admin/legal',
```

### 10. **Page admin/legal manquante**
**Fichier**: Créer `src/app/admin/legal/page.tsx`
**Problème**: La page pour gérer les pages légales n'existe pas.
**Correction**: Créer la page avec un formulaire pour éditer les pages `privacy` et `terms`.

---

## 🟠 IMPORTANT - Inscription bancale

### 11. **Flux d'inscription confus avec vérification email**
**Fichier**: `src/components/auth/RegisterForm.tsx` (lignes 109-118)
**Problème**: Après l'inscription d'un `SIMPLE_USER`, le backend renvoie un message demandant la vérification email, mais le frontend tente de faire un `login()` qui va échouer car l'email n'est pas vérifié.
**Correction**: Vérifier si la réponse contient `accessToken`. Si non, rediriger vers la page de vérification email au lieu d'essayer de login.
```typescript
if (response?.data?.accessToken) {
  await login(response);
} else {
  // Pas de token = email non vérifié
  router.push(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(formData.email)}`);
}
```

### 12. **PRIMARY_ADMIN créé sans accessToken**
**Fichier**: `src/components/auth/RegisterForm.tsx`
**Problème**: Le premier utilisateur (PRIMARY_ADMIN) est créé sans passer par la vérification email, mais le backend ne renvoie pas d'`accessToken` dans ce cas (ligne 4227 backend: `return { success: true, message: 'Inscription réussie.', data: { email, role } }`).
**Correction**: Le backend devrait aussi renvoyer un token pour le PRIMARY_ADMIN, ou le frontend devrait rediriger vers la page de connexion avec un message de succès.

---

## 🟡 MODÉRÉ - Problèmes UX

### 13. **Pas de feedback sur les erreurs d'API**
**Fichier**: `src/lib/api-client.ts`
**Problème**: Quand une erreur réseau survient (pas de connexion, timeout), l'utilisateur ne voit pas de message clair.
**Correction**: Ajouter un intercepteur global qui affiche un toast en cas d'erreur réseau.

### 14. **RoleGuard absent dans admin/layout.tsx**
**Fichier**: `src/app/admin/layout.tsx` (lignes 1-10)
**Problème**: Le layout admin n'utilise pas `RoleGuard` pour protéger l'accès. Un utilisateur non-admin pourrait voir la sidebar avant d'être redirigé.
**Correction**:
```tsx
import { RoleGuard } from '@/components/auth/RoleGuard'

export default function AdminLayout({ children }) {
  return (
    <RoleGuard requiredRole="SECONDARY_ADMIN">
      <div className="flex min-h-screen bg-[var(--bg-base)]">
        <Sidebar variant="admin" />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </RoleGuard>
  )
}
```

### 15. **Slugs des pages légales incohérents**
**Fichier**: `src/types/api.ts` vs Backend `legal-slug.pipe.ts`
**Problème**: Le frontend définit les slugs comme `'privacy-policy' | 'terms-of-service' | 'cookie-policy' | 'legal-notice'` mais le backend n'accepte que `'privacy' | 'terms'`.
**Correction**: Aligner les slugs entre frontend et backend.

### 16. **Socket.io non connecté après login**
**Fichier**: `src/contexts/NotificationContext.tsx`
**Problème**: La connexion WebSocket doit être établie après l'authentification mais peut échouer silencieusement.
**Correction**: Ajouter des logs de debug et un retry automatique.

---

## 🟢 MINEUR - Améliorations

### 17. **Thème non persisté correctement**
**Fichier**: `src/contexts/ThemeContext.tsx`
**Problème**: Le thème peut flasher au chargement initial.
**Correction**: Utiliser un script inline dans le `<head>` pour appliquer le thème avant le rendu React.

### 18. **Pas de gestion du mode offline**
**Problème**: L'application ne gère pas le mode hors ligne.
**Correction**: Ajouter un indicateur de connexion et mettre en queue les actions.

### 19. **Console.log de debug oubliés**
**Fichier**: `src/components/editor/ArticleEditor.tsx` (ligne 8304)
**Problème**: `console.log('Restore', versionId)` est un log de debug.
**Correction**: Supprimer ou remplacer par une vraie implémentation.

---

## 📋 Checklist de correction

- [ ] Corriger les ports dans constants.ts
- [ ] Améliorer l'hydratation de session
- [x] Corriger le flux d'inscription avec vérification email (`requiresEmailVerification`)
- [x] Ajouter la page admin/legal (LegalPagesManager)
- [x] Ajouter le lien "Pages légales" dans le menu admin
- [x] Protéger le layout admin avec RoleGuard
- [x] Aligner les slugs des pages légales (`privacy`, `terms`, `cookie-policy`, `legal-notice`)
- [ ] Gérer l'upload d'images sans articleId
- [ ] Éviter les sauvegardes parallèles dans l'éditeur
- [ ] Supprimer les console.log de debug

---

## Notes supplémentaires

### Variables d'environnement requises
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend NestJS
NEXT_PUBLIC_WS_URL=http://localhost:3001   # Socket.io (même que API)
```

### Dépendances potentiellement manquantes
- Vérifier que `@tiptap/*` est bien installé pour l'éditeur
- Vérifier que `socket.io-client` est installé pour les notifications temps réel
