import type { Metadata } from 'next';
import HomePage from '@/views/home/page';

export const metadata: Metadata = {
  title: 'Codified Web Solutions | AI, Web & Mobile Development',
  description:
    'Codified Web Solutions delivers scalable digital infrastructure, custom AI models, full-stack web applications, and enterprise software engineered for growth.',
};

export default async function AppHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}
