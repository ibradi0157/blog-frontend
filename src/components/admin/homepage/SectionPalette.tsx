'use client';

import { Plus, Layout, Grid3X3, GalleryHorizontal, FolderOpen, Mail, Code, Minus, MousePointerClick } from 'lucide-react';
import { SectionKind, SECTION_LABELS } from './types';

interface SectionPaletteProps {
  onAdd: (kind: SectionKind) => void;
}

const SECTION_ITEMS: { kind: SectionKind; icon: React.ReactNode; description: string }[] = [
  { kind: 'hero', icon: <Layout size={18} />, description: 'Banniere avec image et titre' },
  { kind: 'featuredGrid', icon: <Grid3X3 size={18} />, description: 'Grille d\'articles selectionnes' },
  { kind: 'featuredCarousel', icon: <GalleryHorizontal size={18} />, description: 'Carousel d\'articles' },
  { kind: 'categoryGrid', icon: <FolderOpen size={18} />, description: 'Grille de categories' },
  { kind: 'newsletter', icon: <Mail size={18} />, description: 'Formulaire d\'inscription' },
  { kind: 'cta', icon: <MousePointerClick size={18} />, description: 'Bouton d\'action' },
  { kind: 'html', icon: <Code size={18} />, description: 'Contenu HTML libre' },
  { kind: 'spacer', icon: <Minus size={18} />, description: 'Espacement vertical' },
];

export function SectionPalette({ onAdd }: SectionPaletteProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        <Plus size={14} />
        Ajouter une section
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {SECTION_ITEMS.map(({ kind, icon, description }) => (
          <button
            key={kind}
            onClick={() => onAdd(kind)}
            className="group flex flex-col items-start gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent)]/30 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {icon}
              <span className="text-sm font-medium">{SECTION_LABELS[kind]}</span>
            </div>
            <span className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
