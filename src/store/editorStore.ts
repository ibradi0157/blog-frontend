/**
 * src/store/editorStore.ts
 *
 * Store Zustand pour l'état de l'éditeur d'articles.
 *
 * Responsabilités :
 *  - Stocker le contenu, le titre, les métadonnées de l'article en cours d'édition
 *  - Gérer l'état de sauvegarde automatique (idle / saving / saved / error)
 *  - Détecter les modifications non sauvegardées (dirty)
 *  - Exposer les actions de l'éditeur (setTitle, setContent, setMeta…)
 *
 * Usage :
 *   const { title, content, saveStatus, setTitle, setContent } = useEditorStore()
 */

import { create } from 'zustand'
import type { CreateArticleDto, UpdateArticleDto } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface EditorMeta {
  title:       string
  excerpt:     string
  categoryId:  string
  tags:        string[]
  isPublished: boolean
  isFeatured:  boolean
  coverUrl:    string | null
  /** ISO date string pour la programmation */
  scheduledAt: string | null
}

interface EditorState {
  /** ID de l'article en cours (null = création) */
  articleId:  string | null
  /** Contenu HTML/JSON Tiptap */
  content:    string
  /** Métadonnées de l'article */
  meta:       EditorMeta
  /** Statut de la dernière sauvegarde */
  saveStatus: SaveStatus
  /** true si des modifications non sauvegardées existent */
  isDirty:    boolean
  /** Horodatage ISO de la dernière sauvegarde réussie */
  lastSavedAt: string | null
  /** Message d'erreur de sauvegarde */
  saveError:  string | null
}

interface EditorActions {
  /** Initialise l'éditeur avec un article existant (mode édition) */
  initWithArticle: (article: {
    id:          string
    title:       string
    content:     string
    excerpt?:    string | null
    categoryId?: string | null
    tags?:       string[] | null
    isPublished: boolean
    isFeatured:  boolean
    coverUrl?:   string | null
  }) => void
  /** Réinitialise l'éditeur pour un nouvel article */
  reset: () => void
  /** Met à jour le titre */
  setTitle:       (title: string)       => void
  /** Met à jour le contenu HTML/JSON */
  setContent:     (content: string)     => void
  /** Met à jour l'excerpt */
  setExcerpt:     (excerpt: string)     => void
  /** Met à jour la catégorie */
  setCategoryId:  (id: string)          => void
  /** Met à jour les tags */
  setTags:        (tags: string[])      => void
  /** Bascule isPublished */
  setPublished:   (val: boolean)        => void
  /** Bascule isFeatured */
  setFeatured:    (val: boolean)        => void
  /** Met à jour l'URL de couverture */
  setCoverUrl:    (url: string | null)  => void
  /** Programme la publication */
  setScheduledAt: (iso: string | null)  => void
  /** Met à jour le statut de sauvegarde */
  setSaveStatus:  (status: SaveStatus, error?: string) => void
  /** Marque comme sauvegardé (met à jour lastSavedAt et reset isDirty) */
  markSaved: () => void
  /** Retourne un DTO prêt à envoyer au backend */
  toCreateDto: () => CreateArticleDto
  toUpdateDto: () => UpdateArticleDto
}

// ─────────────────────────────────────────────
// ÉTAT INITIAL
// ─────────────────────────────────────────────

const DEFAULT_META: EditorMeta = {
  title:       '',
  excerpt:     '',
  categoryId:  '',
  tags:        [],
  isPublished: false,
  isFeatured:  false,
  coverUrl:    null,
  scheduledAt: null,
}

const INITIAL_STATE: EditorState = {
  articleId:   null,
  content:     '',
  meta:        DEFAULT_META,
  saveStatus:  'idle',
  isDirty:     false,
  lastSavedAt: null,
  saveError:   null,
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useEditorStore = create<EditorState & EditorActions>()(
  (set, get) => ({
    ...INITIAL_STATE,

    // ── initWithArticle ───────────────────────────────────────────────────
    initWithArticle: (article) =>
      set({
        articleId: article.id,
        content:   article.content,
        meta: {
          title:       article.title,
          excerpt:     article.excerpt ?? '',
          categoryId:  article.categoryId ?? '',
          tags:        article.tags ?? [],
          isPublished: article.isPublished,
          isFeatured:  article.isFeatured,
          coverUrl:    article.coverUrl ?? null,
          scheduledAt: null,
        },
        isDirty:     false,
        saveStatus:  'idle',
        saveError:   null,
        lastSavedAt: null,
      }),

    // ── reset ─────────────────────────────────────────────────────────────
    reset: () => set(INITIAL_STATE),

    // ── setters (chaque setter marque isDirty) ────────────────────────────
    setTitle: (title) =>
      set((s) => ({ meta: { ...s.meta, title }, isDirty: true })),

    setContent: (content) =>
      set({ content, isDirty: true }),

    setExcerpt: (excerpt) =>
      set((s) => ({ meta: { ...s.meta, excerpt }, isDirty: true })),

    setCategoryId: (categoryId) =>
      set((s) => ({ meta: { ...s.meta, categoryId }, isDirty: true })),

    setTags: (tags) =>
      set((s) => ({ meta: { ...s.meta, tags }, isDirty: true })),

    setPublished: (isPublished) =>
      set((s) => ({ meta: { ...s.meta, isPublished }, isDirty: true })),

    setFeatured: (isFeatured) =>
      set((s) => ({ meta: { ...s.meta, isFeatured }, isDirty: true })),

    setCoverUrl: (coverUrl) =>
      set((s) => ({ meta: { ...s.meta, coverUrl }, isDirty: true })),

    setScheduledAt: (scheduledAt) =>
      set((s) => ({ meta: { ...s.meta, scheduledAt }, isDirty: true })),

    // ── saveStatus ────────────────────────────────────────────────────────
    setSaveStatus: (status, error) =>
      set({ saveStatus: status, saveError: error ?? null }),

    markSaved: () =>
      set({
        saveStatus:  'saved',
        isDirty:     false,
        saveError:   null,
        lastSavedAt: new Date().toISOString(),
      }),

    // ── DTOs ──────────────────────────────────────────────────────────────
    toCreateDto: (): CreateArticleDto => {
      const { content, meta } = get()
      return {
        title:       meta.title,
        content,
        excerpt:     meta.excerpt  || undefined,
        categoryId:  meta.categoryId || undefined,
        tags:        meta.tags.length ? meta.tags : undefined,
        isPublished: meta.isPublished,
        isFeatured:  meta.isFeatured,
      }
    },

    toUpdateDto: (): UpdateArticleDto => {
      const { content, meta } = get()
      return {
        title:       meta.title       || undefined,
        content:     content          || undefined,
        excerpt:     meta.excerpt     || undefined,
        categoryId:  meta.categoryId  || undefined,
        tags:        meta.tags.length ? meta.tags : undefined,
        isPublished: meta.isPublished,
        isFeatured:  meta.isFeatured,
      }
    },
  })
)

// ─────────────────────────────────────────────
// SÉLECTEURS
// ─────────────────────────────────────────────

/** true si l'article est prêt à être publié (titre + contenu non vides) */
export const selectIsPublishable = (s: EditorState): boolean =>
  s.meta.title.trim().length >= 3 && s.content.trim().length >= 10

/** Libellé du statut de sauvegarde */
export const selectSaveLabel = (s: EditorState): string => {
  switch (s.saveStatus) {
    case 'saving': return 'Enregistrement…'
    case 'saved':  return s.lastSavedAt
      ? `Enregistré à ${new Date(s.lastSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      : 'Enregistré'
    case 'error':  return s.saveError ?? 'Erreur de sauvegarde'
    default:       return s.isDirty ? 'Modifications non sauvegardées' : ''
  }
}
