import { Suspense } from 'react';
import { Eye, FileText, Heart, Users } from 'lucide-react';
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DashboardStatsClient } from '@/components/dashboard/DashboardStatsClient';

export const metadata = { title: 'Dashboard — Mon espace auteur' };

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Mon tableau de bord</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Bienvenue dans votre espace auteur.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <DashboardStatsClient />
      </Suspense>
    </div>
  );
}