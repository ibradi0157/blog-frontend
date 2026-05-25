'use client';

import { useAnalyticsTimeSeries } from '@/hooks/useAnalytics';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatDate } from '@/lib/utils';

interface AnalyticsChartProps {
  period?: '7d' | '30d' | '90d';
  height?: number;
}

export function AnalyticsChart({ period = '30d', height = 300 }: AnalyticsChartProps) {
  const { timeSeries, isLoading } = useAnalyticsTimeSeries(period);

  if (isLoading) {
    return <div className="animate-pulse rounded-xl bg-[var(--bg-hover)]" style={{ height }} />;
  }

  const data = (timeSeries as any)?.data ?? (timeSeries as any)?.points ?? [];

  if (!data.length) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]" style={{ height }}>
        <p className="text-sm text-[var(--text-muted)]">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => {
            try { return new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }); }
            catch { return v; }
          }}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
        <Line type="monotone" dataKey="views" name="Vues" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="likes" name="Likes" stroke="var(--success)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
