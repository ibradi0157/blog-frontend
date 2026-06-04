'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp, Copy, Eye, EyeOff, Layout, Grid3X3, GalleryHorizontal, FolderOpen, Mail, Code, Minus, MousePointerClick } from 'lucide-react';
import { HomepageSection, SECTION_LABELS } from './types';
import { cn } from '@/lib/cn';

interface SortableSectionProps {
  section: HomepageSection;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children: React.ReactNode;
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <Layout size={16} />,
  featuredGrid: <Grid3X3 size={16} />,
  featuredCarousel: <GalleryHorizontal size={16} />,
  categoryGrid: <FolderOpen size={16} />,
  newsletter: <Mail size={16} />,
  html: <Code size={16} />,
  spacer: <Minus size={16} />,
  cta: <MousePointerClick size={16} />,
};

export function SortableSection({
  section,
  isExpanded,
  onToggleExpand,
  onDelete,
  onDuplicate,
  children,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden transition-all',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-[var(--accent)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-primary)]">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={16} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[var(--text-muted)]">
            {SECTION_ICONS[section.kind]}
          </span>
          <span className="font-medium text-sm text-[var(--text-primary)] truncate">
            {SECTION_LABELS[section.kind]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            title="Dupliquer"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            title={isExpanded ? 'Reduire' : 'Developper'}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 border-t border-[var(--border)]">
          {children}
        </div>
      )}
    </div>
  );
}
