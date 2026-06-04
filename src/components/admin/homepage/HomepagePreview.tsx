'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HomepagePreviewProps {
  children: React.ReactNode;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_SIZES: Record<ViewportSize, { width: number; icon: React.ReactNode; label: string }> = {
  desktop: { width: 1200, icon: <Monitor size={16} />, label: 'Desktop' },
  tablet: { width: 768, icon: <Tablet size={16} />, label: 'Tablette' },
  mobile: { width: 375, icon: <Smartphone size={16} />, label: 'Mobile' },
};

export function HomepagePreview({ children }: HomepagePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { width } = VIEWPORT_SIZES[viewport];

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50'
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <span className="text-xs font-medium text-[var(--text-muted)] mr-2">Apercu</span>
        
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-secondary)]">
          {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setViewport(size)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors',
                viewport === size
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              {VIEWPORT_SIZES[size].icon}
              <span className="hidden sm:inline">{VIEWPORT_SIZES[size].label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs text-[var(--text-muted)] ml-auto">
          {width}px
        </span>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          title={isFullscreen ? 'Reduire' : 'Plein ecran'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 bg-[var(--bg-secondary)]">
        <div
          className="mx-auto bg-[var(--bg-primary)] rounded-lg shadow-lg overflow-hidden transition-all duration-300"
          style={{ width: `${Math.min(width, 100)}%`, maxWidth: width }}
        >
          {/* Browser chrome simulation */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--error)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
            </div>
            <div className="flex-1 mx-8">
              <div className="h-5 bg-[var(--bg-primary)] rounded-md px-3 flex items-center">
                <span className="text-[10px] text-[var(--text-muted)]">https://votresite.com</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="min-h-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
