'use client';

import { CreateUserForm } from '@/components/admin/CreateUserForm';

/**
 * Sandbox UI — création membre sans appel API réel.
 * Les soumissions affichent les erreurs réseau si le backend est absent.
 */
export default function TestAdminCreateUserPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
        Mode test — formulaire identique à l&apos;admin ; connectez-vous en admin pour un test bout en bout.
      </p>
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Créer un membre (test)</h1>
      <CreateUserForm />
    </main>
  );
}
