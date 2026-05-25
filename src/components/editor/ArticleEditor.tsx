'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
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
import { cn } from '@/lib/cn';

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
  const autosaveTimer = useRef<NodeJS.Timeout>();
  const contentRef = useRef(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Commencez à écrire votre article…' }),
      CharacterCount,
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      contentRef.current = editor.getHTML();
      triggerAutosave();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] text-[var(--text-primary)]',
      },
    },
  });

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
      await (apiClient.scheduling as any).publish?.(articleId) ?? apiClient.articles.update(articleId, { isPublished: true });
      setPublished(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!articleId) return;
    setIsSubmitting(true);
    try {
      await apiClient.articles.update(articleId, { isPublished: false });
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
