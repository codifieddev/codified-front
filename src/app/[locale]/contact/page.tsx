import type { Metadata } from 'next';
import ContactPage from '@/views/contact/page';

export const metadata: Metadata = {
  title: 'Contact Us for AI & Web Development | Codified Web',
  description:
    'Contact us at Codified Web Solutions to discuss your next digital project, custom AI integrations, web application scaling, or UI/UX product design.',
};

export default async function AppContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ContactPage locale={locale} />;
}
