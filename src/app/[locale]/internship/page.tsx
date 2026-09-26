import type { Metadata } from 'next';
import InternshipPage from '@/views/internship/page';

export const metadata: Metadata = {
  title: 'Internship Programme & Training | Codified Web Solutions',
  description:
    'Join Codified Web Solutions as an intern. Work on live AI, web, and mobile projects across Full Stack, AI/ML, UI/UX design, mobile development, and SEO.',
};

export default async function AppInternshipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <InternshipPage />;
}
