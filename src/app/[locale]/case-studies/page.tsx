import type { Metadata } from 'next';
import CaseStudiesPage from '@/views/case-studies/page';

export const metadata: Metadata = {
  title: 'Case Studies | Codified Web Solutions',
  description: 'Explore our portfolio of scalable software, custom AI models, and robust cloud infrastructure deployments.',
};

export default async function AppCaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CaseStudiesPage locale={locale} />;
}
