'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const REASONS = [
  'Contenu inapproprié',
  'Spam',
  'Harcèlement',
  'Désinformation',
  'Autre',
];

interface ReportModalProps {
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export function ReportModal({ onConfirm, onClose }: ReportModalProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    try { await onConfirm(reason); } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 overlay-backdrop backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-sm p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Signaler le commentaire</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2 mb-4">
          {REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="report-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="accent-[var(--accent)]"
              />
              <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                {r}
              </span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-ghost text-sm px-4 py-2">Annuler</button>
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
          >
            {sending ? 'Envoi…' : 'Signaler'}
          </button>
        </div>
      </div>
    </div>
  );
}