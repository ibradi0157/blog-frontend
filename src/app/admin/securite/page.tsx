export const metadata = { title: 'Sécurité — Admin' };

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sécurité</h1>
      <div className="card p-8 text-center">
        <p className="text-[var(--text-muted)]">Les logs de sécurité seront disponibles lorsque le backend exposera l'endpoint <code className="text-[var(--accent)]">/admin/security/logs</code>.</p>
      </div>
    </div>
  );
}
