'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Sheet({ open, onClose, title, children, side = 'right', className }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 overlay-backdrop backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'absolute top-0 bottom-0 w-80 max-w-full bg-[var(--bg-primary)] border-[var(--border)] shadow-2xl',
        'flex flex-col overflow-hidden',
        side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
        className
      )}>
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          {title && <h2 className="font-semibold text-[var(--text-primary)]">{title}</h2>}
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
