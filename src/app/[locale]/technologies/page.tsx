import type { Metadata } from 'next';
import TechnologiesPage from '@/views/technologies/page';

export const metadata: Metadata = {
  title: 'Technologies & Modern Tech Stack | Codified Web',
  description:
    'Discover the cutting-edge technologies and modern frameworks we use to build scalable web applications, mobile platforms, and enterprise AI solutions.',
};

export default async function AppTechnologiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <TechnologiesPage locale={locale} />;
}
