'use client';

import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import {
  HomepageSection,
  HeroSection,
  FeaturedGridSection,
  FeaturedCarouselSection,
  CategoryGridSection,
  NewsletterSection,
  HtmlSection,
  SpacerSection,
  CtaSection,
} from './types';

interface SectionEditorProps {
  section: HomepageSection;
  onChange: (section: HomepageSection) => void;
  articles?: { id: string; title: string }[];
  categories?: { id: string; name: string }[];
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'url' | 'number';
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-muted)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-muted)]">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-muted)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`mt-0.5 w-10 h-6 rounded-full transition-colors relative ${
          value ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'left-5' : 'left-1'
          }`}
        />
      </button>
      <div className="flex-1">
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
        {description && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// Specific editors for each section type

function HeroEditor({
  section,
  onChange,
}: {
  section: HeroSection;
  onChange: (s: HeroSection) => void;
}) {
  return (
    <div className="space-y-4">
      <InputField
        label="Titre"
        value={section.title}
        onChange={(v) => onChange({ ...section, title: v })}
        placeholder="Titre principal"
      />
      <InputField
        label="Sous-titre"
        value={section.subtitle}
        onChange={(v) => onChange({ ...section, subtitle: v })}
        placeholder="Description courte"
      />
      <InputField
        label="URL de l'image"
        value={section.imageUrl || ''}
        onChange={(v) => onChange({ ...section, imageUrl: v || null })}
        placeholder="https://..."
        type="url"
      />
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Texte du bouton"
          value={section.buttonLabel || ''}
          onChange={(v) => onChange({ ...section, buttonLabel: v })}
          placeholder="Explorer"
        />
        <InputField
          label="Lien du bouton"
          value={section.buttonHref || ''}
          onChange={(v) => onChange({ ...section, buttonHref: v })}
          placeholder="/articles"
        />
      </div>
      <ToggleField
        label="Overlay sombre"
        value={section.overlay ?? true}
        onChange={(v) => onChange({ ...section, overlay: v })}
        description="Ajoute un fond sombre pour ameliorer la lisibilite"
      />
    </div>
  );
}

function FeaturedGridEditor({
  section,
  onChange,
  articles = [],
}: {
  section: FeaturedGridSection;
  onChange: (s: FeaturedGridSection) => void;
  articles?: { id: string; title: string }[];
}) {
  const addArticle = (id: string) => {
    if (!section.articleIds.includes(id)) {
      onChange({ ...section, articleIds: [...section.articleIds, id] });
    }
  };

  const removeArticle = (id: string) => {
    onChange({ ...section, articleIds: section.articleIds.filter((a) => a !== id) });
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Titre de la section"
        value={section.title}
        onChange={(v) => onChange({ ...section, title: v })}
        placeholder="Articles a la une"
      />
      <SelectField
        label="Nombre de colonnes"
        value={section.columns}
        onChange={(v) => onChange({ ...section, columns: parseInt(v) as 2 | 3 | 4 })}
        options={[
          { value: 2, label: '2 colonnes' },
          { value: 3, label: '3 colonnes' },
          { value: 4, label: '4 colonnes' },
        ]}
      />
      <ToggleField
        label="Afficher les extraits"
        value={section.showExcerpt}
        onChange={(v) => onChange({ ...section, showExcerpt: v })}
      />
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-muted)]">Articles selectionnes</label>
        {section.articleIds.length > 0 ? (
          <div className="space-y-1.5">
            {section.articleIds.map((id) => {
              const article = articles.find((a) => a.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]"
                >
                  <span className="flex-1 text-sm text-[var(--text-primary)] truncate">
                    {article?.title || `Article ${id.slice(0, 8)}...`}
                  </span>
                  <button
                    onClick={() => removeArticle(id)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            Aucun article selectionne. Les derniers articles seront affiches.
          </p>
        )}
        
        {articles.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) addArticle(e.target.value);
              e.target.value = '';
            }}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
          >
            <option value="">+ Ajouter un article...</option>
            {articles
              .filter((a) => !section.articleIds.includes(a.id))
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
          </select>
        )}
      </div>
    </div>
  );
}

function FeaturedCarouselEditor({
  section,
  onChange,
  articles = [],
}: {
  section: FeaturedCarouselSection;
  onChange: (s: FeaturedCarouselSection) => void;
  articles?: { id: string; title: string }[];
}) {
  const addArticle = (id: string) => {
    if (!section.articleIds.includes(id)) {
      onChange({ ...section, articleIds: [...section.articleIds, id] });
    }
  };

  const removeArticle = (id: string) => {
    onChange({ ...section, articleIds: section.articleIds.filter((a) => a !== id) });
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Titre de la section"
        value={section.title}
        onChange={(v) => onChange({ ...section, title: v })}
        placeholder="A ne pas manquer"
      />
      <ToggleField
        label="Lecture automatique"
        value={section.autoplay}
        onChange={(v) => onChange({ ...section, autoplay: v })}
      />
      {section.autoplay && (
        <InputField
          label="Intervalle (ms)"
          value={String(section.interval)}
          onChange={(v) => onChange({ ...section, interval: parseInt(v) || 5000 })}
          type="number"
        />
      )}
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-muted)]">Articles du carousel</label>
        {section.articleIds.length > 0 ? (
          <div className="space-y-1.5">
            {section.articleIds.map((id) => {
              const article = articles.find((a) => a.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]"
                >
                  <span className="flex-1 text-sm text-[var(--text-primary)] truncate">
                    {article?.title || `Article ${id.slice(0, 8)}...`}
                  </span>
                  <button
                    onClick={() => removeArticle(id)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            Aucun article selectionne.
          </p>
        )}
        
        {articles.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) addArticle(e.target.value);
              e.target.value = '';
            }}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
          >
            <option value="">+ Ajouter un article...</option>
            {articles
              .filter((a) => !section.articleIds.includes(a.id))
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
          </select>
        )}
      </div>
    </div>
  );
}

function CategoryGridEditor({
  section,
  onChange,
  categories = [],
}: {
  section: CategoryGridSection;
  onChange: (s: CategoryGridSection) => void;
  categories?: { id: string; name: string }[];
}) {
  const toggleCategory = (id: string) => {
    if (section.categoryIds.includes(id)) {
      onChange({ ...section, categoryIds: section.categoryIds.filter((c) => c !== id) });
    } else {
      onChange({ ...section, categoryIds: [...section.categoryIds, id] });
    }
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Titre de la section"
        value={section.title}
        onChange={(v) => onChange({ ...section, title: v })}
        placeholder="Explorez par categorie"
      />
      <SelectField
        label="Nombre de colonnes"
        value={section.columns}
        onChange={(v) => onChange({ ...section, columns: parseInt(v) as 2 | 3 | 4 })}
        options={[
          { value: 2, label: '2 colonnes' },
          { value: 3, label: '3 colonnes' },
          { value: 4, label: '4 colonnes' },
        ]}
      />
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Categories ({section.categoryIds.length === 0 ? 'toutes' : section.categoryIds.length + ' selectionnees'})
        </label>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  section.categoryIds.includes(cat.id)
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            Aucune categorie disponible.
          </p>
        )}
      </div>
    </div>
  );
}

function NewsletterEditor({
  section,
  onChange,
}: {
  section: NewsletterSection;
  onChange: (s: NewsletterSection) => void;
}) {
  return (
    <div className="space-y-4">
      <InputField
        label="Titre"
        value={section.title}
        onChange={(v) => onChange({ ...section, title: v })}
        placeholder="Restez informe"
      />
      <InputField
        label="Sous-titre"
        value={section.subtitle}
        onChange={(v) => onChange({ ...section, subtitle: v })}
        placeholder="Recevez nos derniers articles..."
      />
      <InputField
        label="Texte du bouton"
        value={section.buttonLabel}
        onChange={(v) => onChange({ ...section, buttonLabel: v })}
        placeholder="S'inscrire"
      />
    </div>
  );
}

function HtmlEditor({
  section,
  onChange,
}: {
  section: HtmlSection;
  onChange: (s: HtmlSection) => void;
}) {
  return (
    <div className="space-y-4">
      <TextAreaField
        label="Contenu HTML"
        value={section.content}
        onChange={(v) => onChange({ ...section, content: v })}
        placeholder="<div>Votre contenu HTML...</div>"
        rows={6}
      />
      <p className="text-xs text-[var(--text-muted)]">
        Attention : le HTML est rendu tel quel. Assurez-vous que le code est valide et securise.
      </p>
    </div>
  );
}

function SpacerEditor({
  section,
  onChange,
}: {
  section: SpacerSection;
  onChange: (s: SpacerSection) => void;
}) {
  return (
    <SelectField
      label="Taille de l'espacement"
      value={section.size}
      onChange={(v) => onChange({ ...section, size: v as 'sm' | 'md' | 'lg' | 'xl' })}
      options={[
        { value: 'sm', label: 'Petit (16px)' },
        { value: 'md', label: 'Moyen (32px)' },
        { value: 'lg', label: 'Grand (48px)' },
        { value: 'xl', label: 'Tres grand (64px)' },
      ]}
    />
  );
}

function CtaEditor({
  section,
  onChange,
}: {
  section: CtaSection;
  onChange: (s: CtaSection) => void;
}) {
  return (
    <div className="space-y-4">
      <InputField
        label="Titre"
        value={section.title}
        onChange={(v) => onChange({ ...section, title: v })}
        placeholder="Pret a commencer ?"
      />
      <InputField
        label="Sous-titre"
        value={section.subtitle}
        onChange={(v) => onChange({ ...section, subtitle: v })}
        placeholder="Rejoignez notre communaute"
      />
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Texte du bouton"
          value={section.buttonLabel}
          onChange={(v) => onChange({ ...section, buttonLabel: v })}
          placeholder="Commencer"
        />
        <InputField
          label="Lien du bouton"
          value={section.buttonHref}
          onChange={(v) => onChange({ ...section, buttonHref: v })}
          placeholder="/register"
        />
      </div>
      <SelectField
        label="Style"
        value={section.variant}
        onChange={(v) => onChange({ ...section, variant: v as 'default' | 'highlight' })}
        options={[
          { value: 'default', label: 'Standard' },
          { value: 'highlight', label: 'Mis en avant' },
        ]}
      />
    </div>
  );
}

// Main SectionEditor component
export function SectionEditor({ section, onChange, articles = [], categories = [] }: SectionEditorProps) {
  switch (section.kind) {
    case 'hero':
      return <HeroEditor section={section} onChange={onChange} />;
    case 'featuredGrid':
      return <FeaturedGridEditor section={section} onChange={onChange} articles={articles} />;
    case 'featuredCarousel':
      return <FeaturedCarouselEditor section={section} onChange={onChange} articles={articles} />;
    case 'categoryGrid':
      return <CategoryGridEditor section={section} onChange={onChange} categories={categories} />;
    case 'newsletter':
      return <NewsletterEditor section={section} onChange={onChange} />;
    case 'html':
      return <HtmlEditor section={section} onChange={onChange} />;
    case 'spacer':
      return <SpacerEditor section={section} onChange={onChange} />;
    case 'cta':
      return <CtaEditor section={section} onChange={onChange} />;
    default:
      return <p className="text-sm text-[var(--text-muted)]">Editeur non disponible pour ce type de section.</p>;
  }
}
