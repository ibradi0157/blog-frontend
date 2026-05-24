import { FileText, Eye, Users, Heart } from 'lucide-react';
import { formatCount } from '@/lib/utils';

interface ProfileStatsProps {
  articlesCount: number;
  totalViews: number;
  followersCount: number;
  likesCount?: number;
  className?: string;
}

export function ProfileStats({
  articlesCount,
  totalViews,
  followersCount,
  likesCount,
  className,
}: ProfileStatsProps) {
  const stats = [
    { icon: FileText, label: 'Articles', value: articlesCount },
    { icon: Eye, label: 'Vues', value: totalViews },
    { icon: Users, label: 'Abonnés', value: followersCount },
    ...(likesCount !== undefined ? [{ icon: Heart, label: 'Likes', value: likesCount }] : []),
  ];

  return (
    <div className={`flex flex-wrap gap-6 ${className ?? ''}`}>
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <Icon size={15} className="text-[var(--accent)]" />
          <span className="font-semibold text-[var(--text-primary)]">{formatCount(value)}</span>
          <span className="text-[var(--text-muted)]">{label}</span>
        </div>
      ))}
    </div>
  );
}