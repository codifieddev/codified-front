'use client';
import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import CinematicInit from '@/components/providers/CinematicInit/CinematicInit';
import Navigation from '@/components/layout/Navigation/Navigation';
import Footer from '@/components/layout/Footer/Footer';
import EditableText from '@/components/shared/EditableText';
import { saveField } from '@/lib/editorUtils';
import { ArrowRight, Star, Layers, ShieldCheck } from 'lucide-react';

export default function CaseStudiesPage({ locale }: { locale: string }) {
  const dispatch = useAppDispatch();
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const isEditable = useAppSelector((state) => state.pages.isEditablePage);

  const [activeFilter, setActiveFilter] = useState('All');

  // Find the page layout/contents from CMS
  const heroSection = useMemo(() => {
    if (!currentPages) return null;
    return currentPages.content?.find((s: any) => s?.adminTitle === 'Case Studies Hero');
  }, [currentPages]);

  const gridSection = useMemo(() => {
    if (!currentPages) return null;
    return currentPages.content?.find((s: any) => s?.adminTitle === 'Case Studies Grid');
  }, [currentPages]);

  // Fallback data if CMS data is not loaded yet
  const fallbackHero = {
    props: {
      label: { en: "Portfolio" },
      heading: { en: "Real Projects. <br />Real <span class=\"grad-text\">Business Impact.</span>" },
      description: { en: "Explore how we help modern enterprises and fast-growing startups transform operations into high-performance digital infrastructure." },
      metaItems: [
        { text: { en: "30+ Shipped Products" }, type: "cyan" },
        { text: { en: "99.9% Production SLA" }, type: "default" }
      ]
    }
  };

  const fallbackGrid = {
    content: [
      {
        props: {
          tag: "Tourism & Travel",
          title: { en: "MyRent: Building Clarity at Scale" },
          desc: { en: "How MyRent transformed a complex property management platform into a growth system through UX, SEO, and content strategy." },
          image: "/images/services/my-rent-case-study.png",
          href: "/who-we-create-for/myrent"
        }
      },
      {
        props: {
          tag: "Academic Tech",
          title: { en: "Connecting Scholars and Institutions Globally" },
          desc: { en: "A transformative digital platform for Acadivate, designed to foster research breakthroughs and strategic global collaborations." },
          image: "/images/industries/education-new.png",
          href: "/who-we-create-for/acadivate"
        }
      },
      {
        props: {
          tag: "Tactical E-Commerce",
          title: { en: "Allied Surplus: High-Performance Tactical Store" },
          desc: { en: "A complete e-commerce overhaul for one of the US market's most established military surplus retailers - structured for scale and growth." },
          image: "/images/industries/gaming-new.png",
          href: "/who-we-create-for/allied-surplus"
        }
      },
      {
        props: {
          tag: "Boutique Brands",
          title: { en: "From Commodity to Premium: Castania Brand Strategy" },
          desc: { en: "We created the brand name, positioning, and narrative, transforming a raw product into a brand with meaning, personality, and purpose." },
          image: "/images/industries/food-new.png",
          href: "/who-we-create-for/castania"
        }
      },
      {
        props: {
          tag: "Creative & Video",
          title: { en: "Expo Life: Far Beyond Visual Direction" },
          desc: { en: "Packaging visual direction, storyboard, and full creative video direction developed and produced to elevate the brand's identity." },
          image: "/images/industries/general-premium.png",
          href: "/who-we-create-for/expo-life-far-beyond"
        }
      },
      {
        props: {
          tag: "Craft Branding",
          title: { en: "Karlo Ban: When Craft Meets Collaboration" },
          desc: { en: "A branding, web UX/UI, and AI video postproduction partnership forged in trust and precision for Karlo Ban's handmade blades." },
          image: "/images/industries/general-premium.png",
          href: "/who-we-create-for/karlo-ban"
        }
      },
      {
        props: {
          tag: "Premium Furniture",
          title: { en: "NestCraft: Sculpting Premium Living" },
          desc: { en: "From a Jaipur workshop to a nationally recognized premium furniture brand - built on visual storytelling and D2C e-commerce." },
          image: "/images/industries/general-premium.png",
          href: "/who-we-create-for/nestcraft-living"
        }
      },
      {
        props: {
          tag: "Pet Care E-Comm",
          title: { en: "PeeKeeper: Revitalizing the Diaper Experience" },
          desc: { en: "A complete digital overhaul for the patented escape-proof dog diaper, combining empathetic branding with high-converting e-commerce." },
          image: "/images/industries/healthcare-new.png",
          href: "/who-we-create-for/peekeeper"
        }
      },
      {
        props: {
          tag: "Agri Tech",
          title: { en: "SABL: Strengthening Agriculture-based Livelihoods" },
          desc: { en: "A comprehensive digital transformation creating a platform that bridges modern agricultural science and grassroots farming." },
          image: "/images/services/improve.png",
          href: "/who-we-create-for/sabl"
        }
      }
    ]
  };

  const hero = heroSection || fallbackHero;
  const grid = gridSection || fallbackGrid;
  const hp = hero.props;
  const caseStudies = grid.content || [];

  const handleHeroField = (fieldPath: string) => (value: string) => {
    if (heroSection) {
      saveField(dispatch, currentPages, heroSection.id, fieldPath, value);
    }
  };

  const handleGridField = (fieldPath: string) => (value: string) => {
    if (gridSection) {
      saveField(dispatch, currentPages, gridSection.id, fieldPath, value);
    }
  };

  // Unique tags list for filter buttons
  const filters = ['All', 'Tourism', 'Academic', 'Tactical', 'Boutique', 'Furniture', 'Pet Care', 'Agri'];

  // Filter logic
  const filteredStudies = useMemo(() => {
    if (activeFilter === 'All') return caseStudies;
    return caseStudies.filter((cs: any) => {
      const tagStr = cs.props?.tag || '';
      return tagStr.toLowerCase().includes(activeFilter.toLowerCase());
    });
  }, [caseStudies, activeFilter]);

  return (
    <>
      <CinematicInit />
      <Navigation />
      <main style={{ paddingTop: '80px' }}>
        
        {/* 1. Hero Section */}
        <section className="section" id="case-studies-hero" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '80vw', height: '500px',
            background: 'radial-gradient(ellipse at top, rgba(29,195,243,0.08) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0
          }} />

          <div className="inner" style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
            <span className="label" style={{ marginBottom: '24px' }}>
              <EditableText value={hp.label?.en || ''} isEditable={isEditable} onSave={handleHeroField('props.label.en')} tag="span" />
            </span>
            
            <EditableText
              value={hp.heading?.en || ""}
              isEditable={isEditable}
              onSave={handleHeroField('props.heading.en')}
              className="display"
              tag="h1"
              style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', marginBottom: '24px', fontWeight: 500, lineHeight: 1.15 }}
              dangerouslySetInnerHTML
            />

            <EditableText
              value={hp.description?.en || ""}
              isEditable={isEditable}
              onSave={handleHeroField('props.description.en')}
              className="lede"
              tag="p"
              style={{ margin: '0 auto', maxWidth: '700px', fontSize: '18px', color: 'var(--text-soft)', lineHeight: 1.6 }}
            />

            <div className="status-bar" style={{ justifyContent: 'center', marginTop: '40px' }}>
              {hp.metaItems?.map((item: any, i: number) => (
                <span key={i} className={`pill ${item.type !== 'default' ? item.type : ''}`}>
                  <i /> <EditableText value={item.text?.en || ''} isEditable={isEditable} onSave={handleHeroField(`props.metaItems.${i}.text.en`)} tag="span" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Filter Controls */}
        <section style={{ paddingBottom: '30px', position: 'relative', zIndex: 10 }}>
          <div className="inner" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  background: activeFilter === filter ? 'var(--cyan)' : 'rgba(10, 20, 38, 0.6)',
                  color: activeFilter === filter ? '#020813' : 'var(--text-soft)',
                  border: activeFilter === filter ? '1px solid var(--cyan)' : '1px solid rgba(140, 180, 240, 0.15)',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeFilter === filter ? '0 0 15px rgba(29, 195, 243, 0.3)' : 'none'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Grid List */}
        <section className="section" id="case-studies-grid" style={{ paddingTop: '30px', paddingBottom: '120px' }}>
          <div className="inner">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
              {filteredStudies.map((cs: any, i: number) => (
                <div key={cs.id || i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <Link href={cs.props?.href?.en || cs.props?.href || '#'} style={{ textDecoration: 'none' }}>
                    <div
                      className="group relative overflow-hidden rounded-2xl"
                      style={{
                        background: '#08121e',
                        border: '1px solid rgba(140,180,240,0.18)',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        minHeight: '380px'
                      }}
                    >
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                        background: 'radial-gradient(circle at center, rgba(29,195,243,0.15) 0%, transparent 70%)',
                        zIndex: 1
                      }} />

                      {/* Top Image placeholder or customized gradient background if missing */}
                      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={cs.props?.image || '/images/industries/general-premium.png'}
                          alt={cs.props?.title?.en || cs.props?.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          style={{
                            display: 'block',
                            filter: 'brightness(0.85) saturate(1.1)',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #091930, #040d1a)';
                          }}
                        />
                        {/* Gradient fade */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0, left: 0, right: 0,
                          height: '80px',
                          background: 'linear-gradient(to bottom, transparent 0%, #08121e 100%)',
                          pointerEvents: 'none',
                          zIndex: 2
                        }} />
                        
                        {/* Tag badge top-right */}
                        <div style={{
                          position: 'absolute',
                          top: '16px', right: '16px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          letterSpacing: '0.12em',
                          color: '#9adcff',
                          background: 'rgba(4,6,13,0.85)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(29,195,243,0.25)',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          textTransform: 'uppercase',
                          zIndex: 3
                        }}>
                          <EditableText value={cs.props?.tag || ''} isEditable={isEditable} onSave={handleGridField(`content.${i}.props.tag`)} tag="span" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
                        <EditableText value={cs.props?.title?.en || cs.props?.title || ''} isEditable={isEditable} onSave={handleGridField(`content.${i}.props.title.en`)} tag="h4" style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '22px',
                          fontWeight: 600,
                          color: '#e9eefb',
                          margin: '0 0 12px',
                          lineHeight: 1.25,
                        }} />
                        
                        <EditableText value={cs.props?.desc?.en || cs.props?.desc || ''} isEditable={isEditable} onSave={handleGridField(`content.${i}.props.desc.en`)} tag="p" style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          color: '#6e7c9a',
                          margin: 0,
                          lineHeight: 1.6,
                        }} />
                        
                        {/* Footer Link */}
                        <div className="mt-auto pt-6 flex items-center gap-2" style={{
                          fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--cyan-soft)', textTransform: 'uppercase'
                        }}>
                          <span className="group-hover:translate-x-1 transition-transform" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            View Case Study <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, rgba(29,195,243,0.8), transparent)',
                        zIndex: 3
                      }} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
