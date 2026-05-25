'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import type { Category } from '@/types/api';

export function CategoryManager() {
  const { data, mutate } = useSWR('/categories', () => apiClient.categories.getAll());
  const categories: Category[] = (data as any)?.data ?? [];

  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await apiClient.categories.create({ name: newName.trim() });
    setNewName('');
    setAdding(false);
    await mutate();
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    await apiClient.categories.update(id, { name: editName.trim() });
    setEditId(null);
    await mutate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await apiClient.categories.delete(id);
    await mutate();
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text-primary)]">Catégories</h3>
        <button
          onClick={() => setAdding(true)}
          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {adding && (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nom de la catégorie…"
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--accent)] text-[var(--text-primary)] focus:outline-none"
          />
          <button onClick={handleAdd} className="p-2 rounded-lg text-[var(--success)] hover:bg-[var(--success)]/10 transition-colors"><Check size={16} /></button>
          <button onClick={() => { setAdding(false); setNewName(''); }} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"><X size={16} /></button>
        </div>
      )}

      <div className="space-y-1">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] group transition-colors">
            {editId === cat.id ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                  className="flex-1 px-2 py-1 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--accent)] text-[var(--text-primary)] focus:outline-none"
                />
                <button onClick={() => handleUpdate(cat.id)} className="p-1.5 rounded text-[var(--success)] hover:bg-[var(--success)]/10 transition-colors"><Check size={14} /></button>
                <button onClick={() => setEditId(null)} className="p-1.5 rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"><X size={14} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-[var(--text-primary)]">{cat.name}</span>
                {cat.slug && <span className="text-xs text-[var(--text-muted)]">/{cat.slug}</span>}
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"><Trash2 size={14} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
