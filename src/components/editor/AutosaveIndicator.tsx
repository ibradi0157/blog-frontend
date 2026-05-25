import { cn } from '@/lib/cn';
import { CheckCircle, Loader2, AlertCircle, Clock } from 'lucide-react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  className?: string;
}

const configs: Record<AutosaveStatus, { icon: React.ElementType; label: string; color: string }> = {
  idle: { icon: Clock, label: 'Non sauvegardé', color: 'text-[var(--text-muted)]' },
  saving: { icon: Loader2, label: 'Sauvegarde…', color: 'text-[var(--accent)]' },
  saved: { icon: CheckCircle, label: 'Sauvegardé', color: 'text-[var(--success)]' },
  error: { icon: AlertCircle, label: 'Erreur de sauvegarde', color: 'text-[var(--error)]' },
};

export function AutosaveIndicator({ status, className }: AutosaveIndicatorProps) {
  const { icon: Icon, label, color } = configs[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', color, className)}>
      <Icon size={13} className={status === 'saving' ? 'animate-spin' : ''} />
      {label}
    </span>
  );
}
