'use client';

import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastVariant, string> = {
  success: 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
  error: 'border-[var(--error)]/30 bg-[var(--error)]/10 text-[var(--error)]',
  warning: 'border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
};

export function Toast({ message, variant = 'info', onDismiss }: ToastData & { onDismiss?: () => void }) {
  const Icon = icons[variant];
  return (
    <div className={cn(
      'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl min-w-[280px] max-w-sm',
      'bg-[var(--bg-primary)]',
      styles[variant]
    )}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-[var(--text-primary)]">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
