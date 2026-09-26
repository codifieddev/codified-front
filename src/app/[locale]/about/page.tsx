import type { Metadata } from 'next';
import AboutPage from '@/views/about/page';

export const metadata: Metadata = {
  title: 'About Us: Engineering Digital Solutions | Codified Web',
  description:
    'Learn more about us at Codified Web Solutions — our expert team of engineers, designers, and strategists crafting next-generation digital products and systems.',
};

export default async function AppAboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AboutPage locale={locale} />;
  
}
