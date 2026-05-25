'use client';

// Composant de slash commands — nécessite @tiptap/suggestion
// Fournit un menu "/" pour insérer des blocs

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code2, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SlashItem {
  title: string;
  description: string;
  icon: React.ElementType;
  command: (editor: any) => void;
}

const ITEMS: SlashItem[] = [
  { title: 'Titre 1', description: 'Grand titre', icon: Heading1, command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: 'Titre 2', description: 'Titre moyen', icon: Heading2, command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { title: 'Titre 3', description: 'Petit titre', icon: Heading3, command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { title: 'Liste', description: 'Liste à puces', icon: List, command: (e) => e.chain().focus().toggleBulletList().run() },
  { title: 'Liste numérotée', description: 'Liste ordonnée', icon: ListOrdered, command: (e) => e.chain().focus().toggleOrderedList().run() },
  { title: 'Citation', description: 'Bloc de citation', icon: Quote, command: (e) => e.chain().focus().toggleBlockquote().run() },
  { title: 'Code', description: 'Bloc de code', icon: Code2, command: (e) => e.chain().focus().toggleCodeBlock().run() },
  { title: 'Séparateur', description: 'Ligne horizontale', icon: Minus, command: (e) => e.chain().focus().setHorizontalRule().run() },
];

export interface SlashCommandListProps {
  items: SlashItem[];
  command: (item: SlashItem) => void;
}

export const SlashCommandList = forwardRef<any, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selected, setSelected] = useState(0);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') { setSelected((s) => Math.max(0, s - 1)); return true; }
        if (event.key === 'ArrowDown') { setSelected((s) => Math.min(items.length - 1, s + 1)); return true; }
        if (event.key === 'Enter') { command(items[selected]); return true; }
        return false;
      },
    }));

    useEffect(() => setSelected(0), [items]);

    return (
      <div className="p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-xl w-56">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={() => command(item)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                i === selected ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              )}
            >
              <Icon size={16} className="shrink-0" />
              <div>
                <div className="font-medium text-xs">{item.title}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{item.description}</div>
              </div>
            </button>
          );
        })}
        {items.length === 0 && <p className="px-3 py-2 text-xs text-[var(--text-muted)]">Aucune commande trouvée</p>}
      </div>
    );
  }
);
SlashCommandList.displayName = 'SlashCommandList';

export function getSlashItems(query: string): SlashItem[] {
  return ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
}
