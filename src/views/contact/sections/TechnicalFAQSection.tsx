'use client';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useMemo, useState } from 'react';
import EditableText from '@/components/shared/EditableText';
import { saveField } from '@/lib/editorUtils';

const t = (value: any, fallback = '') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.en || fallback;
};

export default function TechnicalFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const dispatch = useAppDispatch();
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const isEditable = useAppSelector((state) => state.pages.isEditablePage);

  const section = useMemo(
    () => currentPages?.content?.find((s: any) => s?.adminTitle === 'Technical FAQ'),
    [currentPages]
  );

  const handle = (path: string) => (value: string) =>
    saveField(dispatch, currentPages, section?.id || '', path, value);

  const p = section?.props || {};
  const faqs = Array.isArray(section?.content) && section.content.length
    ? section.content
    : [
        { id: 'faq-fb-1', props: { q: { en: 'How long does the initial audit take?' }, a: { en: 'Typically, our team provides a technical feedback loop within 24-48 hours of your submission. Deep-dive audits may take up to a week depending on system complexity.' } } },
        { id: 'faq-fb-2', props: { q: { en: 'Do you sign Mutual NDAs?' }, a: { en: 'Yes. All technical consultations are covered under a strictly enforced NDA to protect your IP and ensure complete confidentiality from day one.' } } },
        { id: 'faq-fb-3', props: { q: { en: 'Can we hire for dedicated long-term teams?' }, a: { en: 'Absolutely. We specialize in building dedicated pods for scaling enterprises and startups. These teams integrate directly into your existing workflows.' } } },
        { id: 'faq-fb-4', props: { q: { en: 'What is your typical tech stack?' }, a: { en: 'We specialize in Next.js, React, Node.js, and Python for the core. We also handle complex AI integrations using OpenAI, Anthropic, and custom LLM deployments.' } } },
        { id: 'faq-fb-5', props: { q: { en: 'Do you offer post-launch support?' }, a: { en: 'Yes, we provide SLA-backed maintenance contracts, ongoing performance monitoring, and iterative feature development for all enterprise projects.' } } },
      ];

  return (
    <section className="section" style={{ borderTop: '1px solid var(--line)', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="inner">
        <div className="grid lg:grid-cols-2 gap-20">

          {/* LEFT: Heading + CTA */}
          <div className="reveal">
            <div style={{ 
              display: 'inline-flex', 
              padding: '6px 16px', 
              borderRadius: '999px', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '16px'
            }}>
              <EditableText
                value={t(p.label, 'TECHNICAL FAQ')}
                isEditable={isEditable}
                onSave={handle('props.label.en')}
                tag="span"
                style={{ 
                  fontSize: '11px', 
                  fontFamily: 'var(--font-mono)', 
                  letterSpacing: '0.15em', 
                  textTransform: 'uppercase', 
                  color: 'rgba(255,255,255,0.6)' 
                } as React.CSSProperties}
              />
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 56px)', marginTop: '20px', lineHeight: 1.1 }}>
              <EditableText
                value={t(p.heading, 'Common <span class="grad-text">Queries.</span>')}
                isEditable={isEditable}
                onSave={handle('props.heading.en')}
                tag="span"
                dangerouslySetInnerHTML
              />
            </h2>
            <EditableText
              value={t(p.description, 'Quick answers to standard operational questions. For detailed inquiries, please use the main transmission form.')}
              isEditable={isEditable}
              onSave={handle('props.description.en')}
              tag="p"
              className="lede"
              style={{ marginTop: '24px', fontSize: '18px', opacity: 0.7, maxWidth: '400px' } as React.CSSProperties}
            />
            <div style={{ marginTop: '40px' }}>
              <a href={p.ctaHref || 'mailto:hello@codifiedweb.com'} className="btn btn-outline" style={{ padding: '14px 30px' }}>
                <EditableText
                  value={t(p.ctaText, 'Email Support Directly')}
                  isEditable={isEditable}
                  onSave={handle('props.ctaText.en')}
                  tag="span"
                />
              </a>
            </div>
          </div>

          {/* RIGHT: FAQ items */}
          <div className="reveal grid gap-4">
            {faqs.map((faq: any, i: number) => {
              const isOpen = openIndex === i;
              return (
                <div key={faq.id || i} style={{ 
                  background: isOpen ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '16px',
                  padding: '0 24px',
                  transition: 'background 0.3s ease'
                }}>
                  <div 
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      cursor: 'pointer', padding: '24px 0', gap: '16px'
                    }}
                  >
                    <EditableText
                      value={t(faq?.props?.q, '')}
                      isEditable={isEditable}
                      onSave={handle(`content.${i}.props.q.en`)}
                      tag="h4"
                      style={{ fontSize: '18px', fontWeight: 600, color: isOpen ? 'var(--cyan)' : 'var(--text)', transition: 'color 0.2s', margin: 0, flex: 1 } as React.CSSProperties}
                    />
                    <div style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'all 0.3s ease',
                      color: isOpen ? 'var(--cyan)' : 'var(--text-mute)',
                      flexShrink: 0,
                      width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isOpen ? 'rgba(29, 195, 243, 0.1)' : 'rgba(255,255,255,0.05)',
                      borderRadius: '50%'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.3s ease-out',
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ paddingBottom: '24px' }}>
                        <EditableText
                          value={t(faq?.props?.a, '')}
                          isEditable={isEditable}
                          onSave={handle(`content.${i}.props.a.en`)}
                          tag="p"
                          style={{ fontSize: '15px', opacity: 0.7, lineHeight: 1.6, margin: 0 } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
