import Link from 'next/link';
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import { ROUTES } from '@/lib/constants';

export const metadata = { title: 'Nouveau membre — Admin' };

export default function AdminNewUserPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href={ROUTES.ADMIN_USERS} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">
          ← Utilisateurs
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-2">Créer un membre</h1>
      </div>
      <CreateUserForm />
    </div>
  );
}
