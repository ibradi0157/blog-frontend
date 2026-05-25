'use client';

import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ArticleSchedulerProps {
  articleId: string;
  scheduledAt?: string | null;
  onScheduled?: (scheduledAt: string) => void;
}

export function ArticleScheduler({ articleId, scheduledAt, onScheduled }: ArticleSchedulerProps) {
  const [date, setDate] = useState(scheduledAt ? new Date(scheduledAt).toISOString().slice(0, 16) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSchedule = async () => {
    if (!date) return;
    setError('');
    setLoading(true);
    try {
      await (apiClient.scheduling as any).schedule?.(articleId, { scheduledAt: new Date(date).toISOString() });
      setSuccess(true);
      onScheduled?.(new Date(date).toISOString());
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Échec de la programmation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
        <Calendar size={14} />
        <span>Programmer la publication</span>
      </div>
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={date}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        />
        <button
          onClick={handleSchedule}
          disabled={!date || loading}
          className="btn-ghost px-3 py-2 text-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          <Clock size={14} />
          {loading ? '…' : 'Planifier'}
        </button>
      </div>
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
      {success && <p className="text-xs text-[var(--success)]">Publication programmée !</p>}
    </div>
  );
}
