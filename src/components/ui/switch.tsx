'use client';

import { cn } from '@/lib/cn';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  id?: string;
}

export function Switch({ checked = false, onCheckedChange, disabled, label, className, id }: SwitchProps) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'relative inline-flex w-10 h-5.5 rounded-full transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none',
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-4.5' : 'translate-x-0'
          )}
        />
      </button>
      {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
    </label>
  );
}
