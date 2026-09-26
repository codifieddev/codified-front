import type { Metadata } from 'next';
import CaseStudiesPage from '@/views/case-studies/page';

export const metadata: Metadata = {
  title: 'Case Studies & Client Success Stories | Codified',
  description:
    'Explore our case studies featuring custom AI models, enterprise web apps, and robust cloud infrastructure deployments built by Codified Web Solutions.',
};

export default async function AppCaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CaseStudiesPage locale={locale} />;
}
