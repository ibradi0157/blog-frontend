'use client';

import { useSearchParams } from 'next/navigation';
import { NewArticleClient } from '@/components/dashboard/NewArticleClient';
import { installMockApiClient } from '@/test/mocks/install-mock-api-client';

export function TestNouveauArticleClient() {
  const searchParams = useSearchParams();
  const failCreate = searchParams.get('failCreate') === '1';

  installMockApiClient({ failCreate });

  return (
    <main className="p-6 lg:p-8">
      <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
        Mode test — API mockée, sans authentification.
        {failCreate ? ' (création forcée en échec)' : ''}
      </p>
      <NewArticleClient />
    </main>
  );
}
