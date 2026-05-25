import { CategoryManager } from '@/components/admin/CategoryManager';

export const metadata = { title: 'Catégories — Admin' };

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Catégories</h1>
      <CategoryManager />
    </div>
  );
}
