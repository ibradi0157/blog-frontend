'use client';

import { BubbleMenu, type Editor } from '@tiptap/react';
import { Bold, Italic, Code, Link } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EditorBubbleMenuProps {
  editor: Editor;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const addLink = () => {
    const url = window.prompt('URL du lien :');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const buttons = [
    { icon: Bold, label: 'Gras', onClick: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, label: 'Italique', onClick: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: Code, label: 'Code', onClick: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { icon: Link, label: 'Lien', onClick: addLink, active: editor.isActive('link') },
  ];

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-0.5 p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-xl"
    >
      {buttons.map(({ icon: Icon, label, onClick, active }) => (
        <button
          key={label}
          type="button"
          title={label}
          onClick={onClick}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            active
              ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </BubbleMenu>
  );
}
