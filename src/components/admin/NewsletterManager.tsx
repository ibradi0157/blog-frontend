'use client';

import { useState } from 'react';
import { Send, Users } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

export function NewsletterManager() {
  const { data } = useSWR('/newsletter/count', () => (apiClient.newsletter as any).getSubscriberCount?.() ?? Promise.resolve({ count: 0 }));
  const subscriberCount = (data as any)?.count ?? 0;

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) return;
    if (!confirm(`Envoyer la newsletter à ${subscriberCount} abonné${subscriberCount > 1 ? 's' : ''} ?`)) return;
    setSending(true);
    setResult(null);
    try {
      await (apiClient.newsletter as any).send?.({ subject, content });
      setResult({ success: true, message: 'Newsletter envoyée avec succès !' });
      setSubject('');
      setContent('');
    } catch {
      setResult({ success: false, message: 'Échec de l\'envoi de la newsletter.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
          <Users size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{subscriberCount.toLocaleString('fr-FR')}</p>
          <p className="text-sm text-[var(--text-muted)]">abonné{subscriberCount > 1 ? 's' : ''} à la newsletter</p>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-[var(--text-primary)]">Envoyer une newsletter</h3>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Sujet</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet de l'email…"
            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Contenu (HTML ou texte)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Contenu de la newsletter…"
            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none font-mono"
          />
        </div>
        {result && (
          <div className={`p-3 rounded-lg text-sm ${result.success ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--error)]/10 text-[var(--error)]'}`}>
            {result.message}
          </div>
        )}
        <button
          onClick={handleSend}
          disabled={!subject.trim() || !content.trim() || sending}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Send size={16} />
          {sending ? 'Envoi en cours…' : `Envoyer à ${subscriberCount} abonné${subscriberCount > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}
