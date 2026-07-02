'use client';
import Link from 'next/link';
import { useMemo, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import EditableText from '@/components/shared/EditableText';
import { saveField } from '@/lib/editorUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { caseStudiesList } from '@/data/caseStudiesData';

export default function CaseStudies() {
  const dispatch = useAppDispatch();
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const isEditable = useAppSelector((state) => state.pages.isEditablePage);

  const fallbackSection = useMemo(() => ({
    id: 'case-studies-fallback',
    props: {
      label: { en: "08 · Case Studies" },
      heading: { en: "Selected <span class=\"grad-text\">Case Studies</span>" },
      description: { en: "Real-world examples of how we help our clients build and scale their products." }
    },
    content: caseStudiesList.slice(0, 3).map((cs) => ({
      id: `cs-${cs.slug}`,
      props: {
        tag: cs.tag,
        title: { en: cs.title },
        desc: { en: cs.desc },
        image: cs.image,
        href: cs.href
      }
    }))
  }), []);

  const section = useMemo(() => {
    if (!currentPages) return null;
    return currentPages.content?.find((s: any) => s?.adminTitle === 'Case Studies') || fallbackSection;
  }, [currentPages, fallbackSection]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!section) return;

    const ctx = gsap.context(() => {
      const csTrack = document.getElementById('caseStudiesTrack');
      const csCards = Array.from(document.querySelectorAll('#caseStudiesTrack .card-wrapper'));
      const csProgress = document.getElementById('caseStudiesProgress');
      const IS_MOBILE = window.innerWidth < 720;

      if (csTrack && !IS_MOBILE) {
        const getScrollAmount = () => {
          return Math.max(0, csTrack.scrollWidth - window.innerWidth + (window.innerWidth * 0.12));
        };

        const csTl = gsap.timeline({
          scrollTrigger: {
            id: 'react-case-studies',
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${csCards.length * 500}`, // Extended scroll distance to give time to read
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: self => {
              const p = self.progress;
              if (csProgress) csProgress.style.width = (p * 100) + '%';
              
              const activeIndex = Math.min(csCards.length - 1, Math.floor(p * (csCards.length + 0.4)));
              csCards.forEach((card, idx) => {
                if (idx === activeIndex) {
                  card.classList.add('active');
                  card.classList.remove('done');
                } else if (idx < activeIndex) {
                  card.classList.add('done');
                  card.classList.remove('active');
                } else {
                  card.classList.remove('active', 'done');
                }
              });
            }
          }
        });

        csTl.to(csTrack, {
          x: () => -getScrollAmount(),
          ease: 'none'
        }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [section]);

  if (!section) return null;

  const p = section.props;
  const caseStudies = section.content || [];
  const handle = (fieldPath: string) => (value: string) => {
    if (section.id !== 'case-studies-fallback') {
      saveField(dispatch, currentPages, section.id, fieldPath, value);
    }
  };

  return (
    <section ref={sectionRef} className="section" id="case-studies" data-mood="case-studies" data-annotate-id={`${currentPages?.slug || 'home'}-case-studies-section`} style={{ padding: '80px 0', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="inner" style={{ maxWidth: 'none', padding: '0 6vw', width: '100%' }}>
        <span className="label"><span className="num">{p.label?.en?.split('·')[0]}·</span> <EditableText value={(p.label?.en?.split('·')[1] || '').trim()} isEditable={isEditable} onSave={(val) => handle('props.label.en')(`${(p.label?.en?.split('·')[0] || '').trim()} · ${val}`)} tag="span" /></span>
        <div className="head" style={{ marginTop: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px' }}>
          <div className="copy" style={{ maxWidth: '800px' }}>
            <EditableText value={p.heading?.en || ''} isEditable={isEditable} onSave={handle('props.heading.en')} className="display" tag="h2" dangerouslySetInnerHTML />
            <EditableText value={p.description?.en || ''} isEditable={isEditable} onSave={handle('props.description.en')} className="lede" tag="p" style={{ margin: 0 }} />
          </div>
          <div className="cs-progress-container" style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.07)', position: 'relative', marginBottom: '16px', display: 'none' }}>
            <div id="caseStudiesProgress" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '0%', background: 'linear-gradient(90deg, var(--cyan), var(--magenta))', transition: 'width 0.1s ease', boxShadow: '0 0 8px var(--cyan)' }} />
          </div>
        </div>
      </div>

      <div className="case-studies-track-wrap" style={{ overflow: 'hidden', padding: '20px 6vw', width: '100%' }}>
        <div 
          id="caseStudiesTrack" 
          className="flex gap-6"
          style={{ 
            width: 'max-content',
            willChange: 'transform'
          }}
        >
          {caseStudies.map((cs: any, i: number) => (
            <div key={cs.id || i} className="card-wrapper shrink-0" style={{ width: '360px' }}>
              <Link href={cs.props?.href?.en || cs.props?.href || '#'} style={{ textDecoration: 'none' }}>
                <div 
                  className="card group" 
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--line)',
                    background: 'var(--bg-1)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ 
                    height: '200px', 
                    width: '100%',
                    background: 'var(--bg-2)',
                    borderBottom: '1px solid var(--line)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={cs.props?.image} 
                      alt={cs.props?.title?.en || cs.props?.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, var(--bg-1), var(--bg-2))';
                      }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <EditableText value={cs.props?.tag || ''} isEditable={isEditable} onSave={handle(`content.${i}.props.tag`)} tag="span" style={{ fontSize: '11px', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }} />
                      <span style={{ fontSize: '16px', color: 'var(--text)', transition: 'color 0.3s ease' }} className="group-hover:text-[var(--cyan)]">→</span>
                    </div>
                    <EditableText value={cs.props?.title?.en || cs.props?.title || ''} isEditable={isEditable} onSave={handle(`content.${i}.props.title.en`)} tag="h3" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', lineHeight: '1.3' }} />
                    <EditableText value={cs.props?.desc?.en || cs.props?.desc || ''} isEditable={isEditable} onSave={handle(`content.${i}.props.desc.en`)} tag="p" style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-soft)', margin: 0 }} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
