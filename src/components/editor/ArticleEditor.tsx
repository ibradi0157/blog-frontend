'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';

// CodeBlockLowlight: chargé dynamiquement si disponible
let CodeBlockLowlightExt: any = null;
let lowlightInstance: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: CodeBlockLowlight } = require('@tiptap/extension-code-block-lowlight');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { common, createLowlight } = require('lowlight');
  CodeBlockLowlightExt = CodeBlockLowlight;
  lowlightInstance = createLowlight(common);
} catch { /* not installed yet */ }
import { Settings, History, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
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
 * Crée l'extension Tiptap pour les slash commands.
 * Utilise @tiptap/suggestion (native) si disponible avec render callbacks complets.
 * Sinon fallback vers une extension no-op (ArticleEditor gère la détection manuelle).
 */
function createSlashCommandExtension(callbacks: {
  onOpen:   (query: string, rect: DOMRect | null) => void;
  onUpdate: (query: string) => void;
  onClose:  () => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
  getItems: (query: string) => ReturnType<typeof getSlashItems>;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Suggestion = require('@tiptap/suggestion').default ?? require('@tiptap/suggestion');

    return Extension.create({
      name: 'slashCommand',

      addOptions() {
        return {
          suggestion: {
            char: '/',
            allowSpaces: false,

            items: ({ query }: { query: string }) => callbacks.getItems(query),

            render: () => ({
              onStart: (props: any) => {
                const rect = props.clientRect?.() ?? null;
                callbacks.onOpen(props.query ?? '', rect);
              },
              onUpdate: (props: any) => {
                callbacks.onUpdate(props.query ?? '');
              },
              onExit: () => {
                callbacks.onClose();
              },
              onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key)) {
                  return callbacks.onKeyDown(event);
                }
                return false;
              },
            }),

            command: ({ editor, range, props }: any) => {
              if (props?.command) {
                const from = range.from;
                const to = range.to;
                editor.chain().focus().deleteRange({ from, to }).run();
                props.command(editor);
              }
            },
          },
        };
      },

      addProseMirrorPlugins() {
        return [
          Suggestion({
            editor: this.editor,
            ...this.options.suggestion,
          }),
        ];
      },
    });
  } catch {
    // @tiptap/suggestion non installé — retourner une extension no-op
    // ArticleEditor gère la détection manuelle via onUpdate
    return Extension.create({ name: 'slashCommand' });
  }
}

export function ArticleEditor({
  mode,
  articleId: initialArticleId,
  initialContent = '',
  initialMeta,
  isPublished = false,
  onCreated,
  onSaved,
}: ArticleEditorProps) {
  const { user } = useAuth();
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
  const [published, setPublished] = useState(isPublished);
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Slash commands state
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashItems, setSlashItems] = useState(getSlashItems(''));
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const slashRef = useRef<any>(null);

  const autosaveTimer = useRef<NodeJS.Timeout>();
  const contentRef = useRef(initialContent);

  const slashCallbacks = {
    onOpen:    (query: string, rect: DOMRect | null) => {
      const items = getSlashItems(query);
      setSlashItems(items);
      setSlashMenuOpen(true);
      if (rect) setSlashMenuPos({ top: rect.bottom + window.scrollY + 4, left: rect.left });
    },
    onUpdate:  (query: string) => {
      setSlashItems(getSlashItems(query));
    },
    onClose:   () => setSlashMenuOpen(false),
    onKeyDown: (event: KeyboardEvent) => slashRef.current?.onKeyDown({ event }) ?? false,
    getItems:  getSlashItems,
  };

  const editor = useEditor({
    extensions: [
      ...(CodeBlockLowlightExt
        ? [StarterKit.configure({ codeBlock: false }), CodeBlockLowlightExt.configure({ lowlight: lowlightInstance })]
        : [StarterKit]
      ),
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Commencez à écrire votre article… (tapez / pour les commandes)' }),
      CharacterCount,
      Underline,
      createSlashCommandExtension(slashCallbacks),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
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
            <div className="absolute inset-0 bg-black/50" />
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
