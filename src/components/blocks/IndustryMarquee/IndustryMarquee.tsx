'use client';
import React, { useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import EditableText from '@/components/shared/EditableText';
import { saveField } from '@/lib/editorUtils';

const IndustryCard = ({ c, isEditable, onSave, contentIdx }: { c: any; isEditable: boolean; onSave: (fieldPath: string) => (value: string) => void; contentIdx: number }) => (
  <div
    className="engine-card"
    style={{
      position: 'relative',
      overflow: 'hidden',
      padding: 0,
      background: '#08121e',
      border: '1px solid rgba(140,180,240,0.18)',
    }}
  >
    {/* Full-bleed image — top 55% of card */}
    <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden', flexShrink: 0 }}>
      <img
        src={c.props?.image || '/images/industries/general-premium.png'}
        alt={c.props?.title?.en}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          display: 'block',
          filter: 'brightness(0.85) saturate(1.1)',
        }}
      />
      {/* Gradient fade from image into card body */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '60px',
        background: 'linear-gradient(to bottom, transparent 0%, #08121e 100%)',
        pointerEvents: 'none',
      }} />
      {/* Tag badge top-right */}
      <div style={{
        position: 'absolute',
        top: '12px', right: '12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.14em',
        color: '#9adcff',
        background: 'rgba(4,6,13,0.75)',
        backdropFilter: 'blur(8px)',
        border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
        borderRadius: '6px',
        padding: '4px 8px',
        textTransform: 'uppercase',
      }}>
        <EditableText value={c.props?.tag || ''} isEditable={isEditable} onSave={onSave(`content.${contentIdx}.props.tag`)} tag="span" />
      </div>
      {/* ACTIVE pill top-left */}
      <div style={{
        position: 'absolute',
        top: '12px', left: '12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.12em',
        color: '#27c93f',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#27c93f', display: 'inline-block', boxShadow: '0 0 6px #27c93f' }} />
        ACTIVE
      </div>
    </div>

    {/* Text content below image */}
    <div style={{ padding: '18px 20px 20px' }}>
      <EditableText value={c.props?.title?.en || ''} isEditable={isEditable} onSave={onSave(`content.${contentIdx}.props.title.en`)} tag="h4" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 600,
        color: '#e9eefb',
        margin: '0 0 8px',
        lineHeight: 1.2,
      }} />
      <EditableText value={c.props?.desc?.en || ''} isEditable={isEditable} onSave={onSave(`content.${contentIdx}.props.desc.en`)} tag="p" style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12.5px',
        color: '#6e7c9a',
        margin: 0,
        lineHeight: 1.55,
      }} />
    </div>

    {/* Bottom cyan accent line */}
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 40%, transparent), transparent)',
    }} />
  </div>
);

export default function Industries() {
  const dispatch = useAppDispatch();
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const isEditable = useAppSelector((state) => state.pages.isEditablePage);

  const section = useMemo(() => {
    if (!currentPages) return null;
    return currentPages.content?.find((s: any) => s?.adminTitle === 'Industries' || s?.adminTitle === 'Industry Marquee');
  }, [currentPages]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!section) return;

    const ctx = gsap.context(() => {
      const indTrack = document.getElementById('industryTrack');
      const indCards = Array.from(document.querySelectorAll('#industryTrack .card-wrapper'));
      const indProgress = document.getElementById('industryProgress');
      const IS_MOBILE = window.innerWidth < 720;

      if (indTrack && !IS_MOBILE) {
        const getScrollAmount = () => {
          return Math.max(0, indTrack.scrollWidth - window.innerWidth + (window.innerWidth * 0.12));
        };

        const indTl = gsap.timeline({
          scrollTrigger: {
            id: 'react-industry-marquee',
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${indCards.length * 500}`, // Extended scroll distance to give time to read
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 3,
            onUpdate: self => {
              const p = self.progress;
              if (indProgress) indProgress.style.width = (p * 100) + '%';
              
              const activeIndex = Math.min(indCards.length - 1, Math.floor(p * (indCards.length + 0.4)));
              indCards.forEach((card, idx) => {
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

        indTl.to(indTrack, {
          x: () => -getScrollAmount(),
          ease: 'none'
        }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [section]);

  if (!section) return null;

  const p = section.props;
  const content = section.content;
  const handle = (fieldPath: string) => (value: string) => saveField(dispatch, currentPages, section.id, fieldPath, value);

  return (
    <section ref={sectionRef} className="section" id="engine" data-mood="engine" data-annotate-id={`${currentPages?.slug || 'home'}-industries-section`} style={{ padding: '80px 0', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="inner" style={{ maxWidth: 'none', padding: '0 6vw', width: '100%' }}>
        <div className="head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px', marginBottom: '40px' }}>
          <div style={{ maxWidth: '900px' }}>
            <span className="label"><span className="num">{p.label?.en?.split('·')[0]}·</span> <EditableText value={(p.label?.en?.split('·')[1] || '').trim()} isEditable={isEditable} onSave={(val) => handle('props.label.en')(`${(p.label?.en?.split('·')[0] || '').trim()} · ${val}`)} tag="span" /></span>
            <EditableText
              value={p.heading?.en || ""}
              isEditable={isEditable}
              onSave={handle('props.heading.en')}
              className="display"
              tag="h2"
              dangerouslySetInnerHTML
            />
            <EditableText
              value={p.description?.en || ""}
              isEditable={isEditable}
              onSave={handle('props.description.en')}
              className="lede"
              tag="p"
              style={{ margin: 0 }}
            />
          </div>
          <div className="ind-progress-container" style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.07)', position: 'relative', marginBottom: '16px', display: 'none' }}>
            <div id="industryProgress" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '0%', background: 'linear-gradient(90deg, var(--cyan), var(--magenta))', transition: 'width 0.1s ease', boxShadow: '0 0 8px var(--cyan)' }} />
          </div>
        </div>
      </div>

      <div className="industry-track-wrap" style={{ overflow: 'hidden', padding: '20px 6vw', width: '100%' }}>
        <div 
          id="industryTrack" 
          className="flex gap-6"
          style={{ 
            width: 'max-content',
            willChange: 'transform'
          }}
        >
          {content.map((c: any, i: number) => (
            <div key={`ind-${i}`} className="card-wrapper shrink-0" style={{ width: '280px' }}>
              <IndustryCard c={c} isEditable={isEditable} onSave={handle} contentIdx={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
