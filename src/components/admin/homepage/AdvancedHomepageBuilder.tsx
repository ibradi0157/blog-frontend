'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Save, RotateCcw, Eye, EyeOff, Undo2 } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/lib/cn';

import { HomepageSection, SectionKind, createDefaultSection, HomepageConfig } from './types';
import { SectionPalette } from './SectionPalette';
import { SortableSection } from './SortableSection';
import { SectionEditor } from './SectionEditor';
import { HomepagePreview } from './HomepagePreview';
import { SectionPreview } from './SectionPreview';

const DEFAULT_CONFIG: HomepageConfig = {
  sections: [
    createDefaultSection('hero'),
    createDefaultSection('featuredGrid'),
    createDefaultSection('newsletter'),
  ],
};

export function AdvancedHomepageBuilder() {
  const { toast } = useToast();
  
  // Fetch config from API
  const { data: configData, mutate } = useSWR<HomepageConfig>(
    '/admin/homepage',
    async () => {
      try {
        const res = await (apiClient as any).admin?.getHomepageConfig?.();
        return res?.sections ? res : DEFAULT_CONFIG;
      } catch {
        return DEFAULT_CONFIG;
      }
    }
  );

  // Fetch articles and categories for selectors
  const { data: articlesData } = useSWR('/articles', async () => {
    try {
      const res = await apiClient.articles.getAll({ limit: 100 });
      return ((res as any)?.data ?? (res as any)?.articles ?? []).map((a: any) => ({
        id: a.id,
        title: a.title,
      }));
    } catch {
      return [];
    }
  });

  const { data: categoriesData } = useSWR('/categories', async () => {
    try {
      const res = await apiClient.categories.getAll();
      return ((res as any)?.data ?? (res as any) ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
      }));
    } catch {
      return [];
    }
  });

  const articles = articlesData ?? [];
  const categories = categoriesData ?? [];

  // Local state
  const [sections, setSections] = useState<HomepageSection[]>(
    configData?.sections ?? DEFAULT_CONFIG.sections
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync sections when config data changes
  const prevConfigRef = useState<HomepageConfig | undefined>(undefined);
  if (configData && configData !== prevConfigRef[0]) {
    prevConfigRef[0] = configData;
    if (configData.sections && !hasChanges) {
      setSections(configData.sections);
    }
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  }, []);

  // Section operations
  const addSection = useCallback((kind: SectionKind) => {
    const newSection = createDefaultSection(kind);
    setSections((prev) => [...prev, newSection]);
    setExpandedIds((prev) => new Set([...prev, newSection.id]));
    setHasChanges(true);
  }, []);

  const updateSection = useCallback((id: string, updated: HomepageSection) => {
    setSections((prev) => prev.map((s) => (s.id === id ? updated : s)));
    setHasChanges(true);
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setHasChanges(true);
  }, []);

  const duplicateSection = useCallback((id: string) => {
    setSections((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      const original = prev[index];
      const duplicate: HomepageSection = {
        ...original,
        id: `${original.kind}-${Date.now()}`,
      };
      const newSections = [...prev];
      newSections.splice(index + 1, 0, duplicate);
      return newSections;
    });
    setHasChanges(true);
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Save config
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await (apiClient as any).admin?.updateHomepageConfig?.({ sections });
      await mutate({ sections });
      setHasChanges(false);
      toast('Configuration sauvegardee', 'success');
    } catch {
      toast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to saved config
  const handleReset = () => {
    if (configData?.sections) {
      setSections(configData.sections);
      setHasChanges(false);
      toast('Modifications annulees', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Constructeur de page d&apos;accueil
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Glissez-deposez les sections pour les reorganiser
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
              showPreview
                ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
            Apercu
          </button>
          
          {hasChanges && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Undo2 size={16} />
              Annuler
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={cn('grid gap-6', showPreview ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {/* Editor panel */}
        <div className="space-y-4">
          {/* Section palette */}
          <div className="card p-4">
            <SectionPalette onAdd={addSection} />
          </div>

          {/* Sections list */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                Sections ({sections.length})
              </h3>
              {sections.length > 0 && (
                <button
                  onClick={() => {
                    if (expandedIds.size === sections.length) {
                      setExpandedIds(new Set());
                    } else {
                      setExpandedIds(new Set(sections.map((s) => s.id)));
                    }
                  }}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {expandedIds.size === sections.length ? 'Tout reduire' : 'Tout developper'}
                </button>
              )}
            </div>

            {sections.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                Aucune section. Ajoutez-en une depuis la palette ci-dessus.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        isExpanded={expandedIds.has(section.id)}
                        onToggleExpand={() => toggleExpand(section.id)}
                        onDelete={() => deleteSection(section.id)}
                        onDuplicate={() => duplicateSection(section.id)}
                      >
                        <SectionEditor
                          section={section}
                          onChange={(updated) => updateSection(section.id, updated)}
                          articles={articles}
                          categories={categories}
                        />
                      </SortableSection>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            <HomepagePreview>
              {sections.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-sm text-[var(--text-muted)]">
                  Ajoutez des sections pour voir l&apos;apercu
                </div>
              ) : (
                <div>
                  {sections.map((section) => (
                    <SectionPreview key={section.id} section={section} />
                  ))}
                </div>
              )}
            </HomepagePreview>
          </div>
        )}
      </div>
    </div>
  );
}
