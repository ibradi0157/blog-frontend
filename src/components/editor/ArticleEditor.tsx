'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { Settings, History, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { EDITOR } from '@/lib/constants';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { AutosaveIndicator, type AutosaveStatus } from './AutosaveIndicator';
import { ArticleMetaForm, type ArticleMeta } from './ArticleMetaForm';
import { ArticleScheduler } from './ArticleScheduler';
import { ArticleVersionHistory } from './ArticleVersionHistory';
import { EditorImageUpload } from './EditorImageUpload';
import { SlashCommandList, getSlashItems } from './EditorSlashCommands';
import { cn } from '@/lib/cn';
import { createPortal } from 'react-dom';

export interface ArticleEditorProps {
  mode: 'create' | 'edit';
  articleId?: string;
  initialContent?: string;
  initialMeta?: Partial<ArticleMeta>;
  isPublished?: boolean;
  onCreated?: (id: string) => void;
  onSaved?: () => void;
}

type SidePanel = 'meta' | 'history' | null;

/**
 * Extension no-op pour les slash commands.
 * La détection et le menu sont gérés manuellement dans onUpdate (évite un bug
 * ProseMirror avec @tiptap/suggestion : DecorationGroup.locals / localsInner).
 */
function createSlashCommandExtension() {
  return Extension.create({ name: 'slashCommand' });
}

interface ArticleEditorContentProps {
  mode: 'create' | 'edit';
  initialArticleId?: string;
  initialContent: string;
  initialMeta?: Partial<ArticleMeta>;
  isPublished: boolean;
  onCreated?: (id: string) => void;
  onSaved?: () => void;
}

function ArticleEditorContent({
  mode,
  initialArticleId,
  initialContent,
  initialMeta,
  isPublished: initialIsPublished,
  onCreated,
  onSaved,
}: ArticleEditorContentProps) {
  const router = useRouter();
  const [articleId, setArticleId] = useState(initialArticleId);
  const [title, setTitle] = useState(initialMeta?.title ?? '');
  const [meta, setMeta] = useState<ArticleMeta>({
    title: initialMeta?.title ?? '',
    excerpt: initialMeta?.excerpt ?? '',
    categoryId: initialMeta?.categoryId ?? '',
    tags: initialMeta?.tags ?? [],
    coverUrl: initialMeta?.coverUrl ?? null,
  });
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
  const [published, setPublished] = useState(initialIsPublished);
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(mode === 'edit');

  // Slash commands state
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashItems, setSlashItems] = useState(getSlashItems(''));
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const slashRef = useRef<any>(null);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const contentRef = useRef(initialContent);
  const isHydratingEditor = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const extensions = useMemo(() => [
    StarterKit,
    Image,
    Link.configure({ openOnClick: false, autolink: true }),
    Placeholder.configure({ placeholder: 'Commencez à écrire votre article… (tapez / pour les commandes)' }),
    CharacterCount,
    Underline,
    createSlashCommandExtension(),
  ], []);

  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (isHydratingEditor.current) return;
      contentRef.current = editor.getHTML();
      triggerAutosave();

      // Détection manuelle du slash pour les slash commands
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      const textBefore = $from.nodeBefore?.textContent ?? '';
      const match = textBefore.match(/\/([^/\s]*)$/);
      if (match) {
        const query = match[1];
        const items = getSlashItems(query);
        setSlashItems(items);
        setSlashMenuOpen(true);
        // Position approximative du curseur
        const dom = editor.view.domAtPos($from.pos);
        if (dom.node instanceof Element) {
          const rect = dom.node.getBoundingClientRect();
          setSlashMenuPos({ top: rect.bottom + window.scrollY + 4, left: rect.left });
        }
      } else {
        setSlashMenuOpen(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] text-[var(--text-primary)]',
      },
      handleKeyDown: (_view, event) => {
        if (!slashMenuOpen) return false;
        return slashRef.current?.onKeyDown({ event }) ?? false;
      },
    },
  });

  useEffect(() => {
    if (mode !== 'edit' || !articleId) {
      setIsLoadingArticle(false);
      return;
    }

    let isMounted = true;
    setIsLoadingArticle(true);

    apiClient.articles.getOne(articleId)
      .then((response) => {
        if (!isMounted) return;
        const article = (response as any)?.data ?? (response as any);
        if (!article) return;

        isHydratingEditor.current = true;
        setTitle(article.title ?? '');
        setPublished(Boolean(article.isPublished));
        setMeta({
          title: article.title ?? '',
          excerpt: article.excerpt ?? '',
          categoryId: article.category?.id ?? '',
          tags: article.tags ?? [],
          coverUrl: article.coverUrl ?? null,
        });
        contentRef.current = article.content ?? '';
        editor?.commands.setContent(article.content ?? '');
        requestAnimationFrame(() => {
          isHydratingEditor.current = false;
        });
      })
      .catch(() => {
        setAutosaveStatus('error');
      })
      .finally(() => {
        if (isMounted) setIsLoadingArticle(false);
      });

    return () => {
      isMounted = false;
    };
  }, [articleId, editor, mode]);

  const handleSlashCommand = useCallback((item: { command: (editor: any) => void }) => {
    if (!editor) return;
    // Effacer le "/" avant d'exécuter la commande
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const textBefore = $from.nodeBefore?.textContent ?? '';
    const match = textBefore.match(/\/[^/\s]*$/);
    if (match) {
      const from = $from.pos - match[0].length;
      editor.chain().focus().deleteRange({ from, to: $from.pos }).run();
    }
    item.command(editor);
    setSlashMenuOpen(false);
  }, [editor]);

  const save = useCallback(async () => {
    if (!articleId && mode === 'edit') return;
    setAutosaveStatus('saving');
    try {
      const payload = {
        title,
        content: contentRef.current,
        excerpt: meta.excerpt || undefined,
        categoryId: meta.categoryId || undefined,
        tags: meta.tags.length ? meta.tags : undefined,
      };
      if (mode === 'create' && !articleId) {
        const res = await apiClient.articles.create(payload);
        const newId = (res as any)?.data?.id ?? (res as any)?.id;
        if (newId) {
          setArticleId(newId);
          onCreated?.(newId);
        }
      } else if (articleId) {
        await apiClient.articles.update(articleId, payload);
      }
      setAutosaveStatus('saved');
      onSaved?.();
    } catch {
      setAutosaveStatus('error');
    }
  }, [articleId, mode, title, meta, onCreated, onSaved]);

  const triggerAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(save, EDITOR.AUTOSAVE_DELAY_MS ?? 3000);
  }, [save]);

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); }, []);

  const handlePublish = async () => {
    if (!articleId) { await save(); return; }
    setIsSubmitting(true);
    try {
      await apiClient.articles.update(articleId, { isPublished: true } as any);
      setPublished(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!articleId) return;
    setIsSubmitting(true);
    try {
      await apiClient.articles.update(articleId, { isPublished: false } as any);
      setPublished(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!articleId || !confirm('Archiver cet article ?')) return;
    try {
      await apiClient.articles.delete(articleId);
      router.push('/dashboard/articles');
    } catch {}
  };

  const charCount = editor?.storage?.characterCount?.characters?.() ?? 0;

  // Fermer le slash menu au clic extérieur
  useEffect(() => {
    if (!slashMenuOpen) return;
    const close = () => setSlashMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [slashMenuOpen]);

  // Ne pas rendre jusqu'à montage complet côté client
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--text-accent)] mx-auto" />
          <p className="mt-4 text-[var(--text-secondary)]">Chargement…</p>
        </div>
      </div>
    );
  }

  if (mode === 'edit' && isLoadingArticle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">Chargement de l’article…</p>
          <p className="text-xs text-[var(--text-muted)]">
            Récupération du contenu et des métadonnées de l’article en cours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen bg-[var(--bg-primary)]">
      {/* Main editor area */}
      <div className={cn('flex-1 flex flex-col transition-all', sidePanel ? 'mr-80' : '')}>
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
          <AutosaveIndicator status={autosaveStatus} />
          <span className="text-xs text-[var(--text-muted)] ml-auto">{charCount.toLocaleString()} caractères</span>
          <button
            onClick={() => setSidePanel(sidePanel === 'history' ? null : 'history')}
            className={cn('p-2 rounded-lg transition-colors', sidePanel === 'history' ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]')}
            title="Historique"
          >
            <History size={16} />
          </button>
          <button
            onClick={() => setSidePanel(sidePanel === 'meta' ? null : 'meta')}
            className={cn('p-2 rounded-lg transition-colors', sidePanel === 'meta' ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]')}
            title="Paramètres"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Title */}
        <div className="px-8 md:px-16 pt-10">
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setMeta((m) => ({ ...m, title: e.target.value })); triggerAutosave(); }}
            placeholder="Titre de l'article…"
            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-6"
          />
        </div>

        {/* Toolbar */}
        <EditorToolbar editor={editor} onImageUpload={() => setShowImageUpload(true)} />

        {/* Editor */}
        <div className="flex-1 px-8 md:px-16 py-8">
          {editor && <EditorBubbleMenu editor={editor} />}
          <EditorContent editor={editor} />
        </div>

        {/* Image upload popup */}
        {showImageUpload && articleId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowImageUpload(false)}>
            <div className="absolute inset-0 overlay-backdrop" />
            <div className="relative z-10 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <EditorImageUpload
                articleId={articleId}
                onInsert={(url) => { editor?.chain().focus().setImage({ src: url }).run(); setShowImageUpload(false); }}
                onClose={() => setShowImageUpload(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Slash command menu */}
      {slashMenuOpen && slashItems.length > 0 && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'absolute', top: slashMenuPos.top, left: slashMenuPos.left, zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
        >
          <SlashCommandList
            ref={slashRef}
            items={slashItems}
            command={handleSlashCommand as any}
          />
        </div>,
        document.body
      )}

      {/* Side panel */}
      {sidePanel && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-[var(--bg-primary)] border-l border-[var(--border)] overflow-y-auto z-10">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">
              {sidePanel === 'meta' ? 'Paramètres' : 'Historique'}
            </h3>
            <button onClick={() => setSidePanel(null)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="p-5 space-y-6">
            {sidePanel === 'meta' && (
              <>
                <ArticleMetaForm
                  articleId={articleId ?? ''}
                  meta={meta}
                  onChange={(patch) => setMeta((m) => ({ ...m, ...patch }))}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onArchive={handleArchive}
                  isPublished={published}
                  isSubmitting={isSubmitting}
                />
                {articleId && (
                  <ArticleScheduler
                    articleId={articleId}
                    onScheduled={() => setPublished(true)}
                  />
                )}
              </>
            )}
            {sidePanel === 'history' && articleId && (
              <ArticleVersionHistory
                articleId={articleId}
                onRestore={(versionId) => console.log('Restore', versionId)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ArticleEditor({
  mode,
  articleId,
  initialContent = '',
  initialMeta,
  isPublished = false,
  onCreated,
  onSaved,
}: ArticleEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--text-accent)] mx-auto" />
          <p className="mt-4 text-[var(--text-secondary)]">Chargement de l&apos;éditeur…</p>
        </div>
      </div>
    );
  }

  return (
    <ArticleEditorContent
      mode={mode}
      initialArticleId={articleId}
      initialContent={initialContent}
      initialMeta={initialMeta}
      isPublished={isPublished}
      onCreated={onCreated}
      onSaved={onSaved}
    />
  );
}
