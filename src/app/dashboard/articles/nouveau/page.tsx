import { Metadata } from 'next';
import { NewArticleClient } from '@/components/dashboard/NewArticleClient';

export const metadata: Metadata = { title: 'Nouvel article — Dashboard' };

export default function NewArticlePage() {
  return <NewArticleClient />;
}