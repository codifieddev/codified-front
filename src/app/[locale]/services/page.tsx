import type { Metadata } from 'next';
import ServicesPage from '@/views/services/page';

export const metadata: Metadata = {
  title: 'Services: Web, AI & Cloud Engineering | Codified',
  description:
    'Explore our end-to-end digital services, including custom AI development, full-stack web applications, cloud infrastructure, and mobile app solutions.',
};

export default async function AppServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ServicesPage locale={locale} />;
}
