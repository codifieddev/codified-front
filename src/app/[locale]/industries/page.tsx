import type { Metadata } from 'next';
import IndustriesPage from '@/views/industries/page';

export const metadata: Metadata = {
  title: 'Industries We Serve & Domain Solutions | Codified',
  description:
    'Explore tailored digital solutions across diverse industries, from healthcare and fintech to logistics, e-commerce, and real estate enterprises.',
};

export default async function AppIndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <IndustriesPage locale={locale} />;
}
