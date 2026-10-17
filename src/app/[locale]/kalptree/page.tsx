import type { Metadata } from 'next';
import KalpTreePage from '@/views/kalptree/page';

export const metadata: Metadata = {
  title: 'Admin Login | KalpTree Portal · Codified Web Solutions',
  description: 'Enter your credentials to access the store and platform administration dashboard.',
};

export default async function AppKalpTreePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <KalpTreePage locale={locale} />;
}
