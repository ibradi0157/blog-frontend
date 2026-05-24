import { Metadata } from 'next';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'Notifications — Blog',
};

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <PageWrapper>
        <div className="py-8">
          <NotificationCenter />
        </div>
      </PageWrapper>
    </AuthGuard>
  );
}