'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function HeadingWithGold({ text, className = '' }: { text: string; className?: string }) {
  if (!text.trim()) return null;
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) {
    return <h2 className={className}><span className="text-cinema-gold">{text}</span></h2>;
  }
  const lastWord = words.pop()!;
  const rest = words.join(' ');
  return (
    <h2 className={className}>
      <span className="text-cinema-white">{rest} </span>
      <span className="text-cinema-gold">{lastWord}</span>
    </h2>
  );
}
import type {
  SectionConfig,
  SectionCards4,
  SectionProcess,
  SectionTwoColumn,
  SectionCardsWithMeta,
  SectionEventCards,
  SectionCtaButtons,
} from '../services-data';

function SectionWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Cards4Section({ section }: { section: SectionCards4 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <SectionWrapper className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(section.heading || section.description) && (
          <div className="text-center mb-12">
            {section.heading && (
              <HeadingWithGold text={section.heading} className="font-display font-bold text-3xl sm:text-4xl mb-4" />
            )}
            {section.description && (
              <p className="text-cinema-secondary max-w-2xl mx-auto">{section.description}</p>
            )}
          </div>
        )}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.cards.map((card, i) => (
            <motion.div
              key={card.heading}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-cinema-card border border-cinema rounded-lg p-6 group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <div className="mb-4 w-fit transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                <card.icon className="h-10 w-10 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
              </div>
              <h3 className="font-display font-bold text-lg text-cinema-white mb-2 group-hover:text-cinema-gold transition-colors">
                {card.heading}
              </h3>
              <p className="text-cinema-muted text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function ProcessSection({ section }: { section: SectionProcess }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <SectionWrapper className="py-16 sm:py-20 bg-cinema-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(section.heading || section.description) && (
          <div className="text-center mb-12">
            {section.heading && (
              <HeadingWithGold text={section.heading} className="font-display font-bold text-3xl sm:text-4xl mb-4" />
            )}
            {section.description && (
              <p className="text-cinema-secondary max-w-2xl mx-auto">{section.description}</p>
            )}
          </div>
        )}
        <div ref={ref} className="space-y-4">
          {section.steps.map((step, i) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex gap-8 items-center bg-cinema-card border border-cinema rounded-lg p-8 relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <span className="flex-shrink-0 w-20 h-20 rounded-full bg-cinema-gold/20 text-cinema-gold font-display font-bold text-3xl flex items-center justify-center border-2 border-cinema-gold/40">
                {step.stepNumber}
              </span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-cinema-white mb-2">
                  {step.title}
                </h3>
                <p className="text-cinema-muted">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function TwoColumnSection({ section }: { section: SectionTwoColumn }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <SectionWrapper className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.heading && (
          <HeadingWithGold text={section.heading} className="font-display font-bold text-3xl sm:text-4xl mb-12 text-center" />
        )}
        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-10 lg:gap-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-cinema-card border border-cinema rounded-lg p-8 group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
          >
            {section.left.heading && (
              <h3 className="font-display font-bold text-xl text-cinema-gold mb-4">
                {section.left.heading}
              </h3>
            )}
            <p className="text-cinema-secondary mb-4">{section.left.body}</p>
            {section.left.list && (
              <ul className="space-y-2">
                {section.left.list.map((item) => (
                  <li key={item} className="text-cinema-muted text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cinema-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-cinema-card border border-cinema rounded-lg p-8 group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
          >
            {section.right.heading && (
              <h3 className="font-display font-bold text-xl text-cinema-gold mb-4">
                {section.right.heading}
              </h3>
            )}
            <p className="text-cinema-secondary mb-4">{section.right.body}</p>
            {section.right.list && (
              <ul className="space-y-2">
                {section.right.list.map((item) => (
                  <li key={item} className="text-cinema-muted text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cinema-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.right.ctaButton && (
              <Link
                href={section.right.ctaButton.href}
                className="inline-flex mt-6 items-center justify-center px-8 py-3.5 bg-cinema-gold text-cinema-black font-display font-bold uppercase tracking-wider hover:bg-cinema-gold-hover transition-colors rounded border border-cinema-gold"
              >
                {section.right.ctaButton.label}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function CardsWithMetaSection({ section }: { section: SectionCardsWithMeta }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <SectionWrapper className="py-16 sm:py-20 bg-cinema-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(section.heading || section.description) && (
          <div className="text-center mb-12">
            {section.heading && (
              <HeadingWithGold text={section.heading} className="font-display font-bold text-3xl sm:text-4xl mb-4" />
            )}
            {section.description && (
              <p className="text-cinema-secondary max-w-2xl mx-auto">{section.description}</p>
            )}
          </div>
        )}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.cards.map((card, i) => (
            <motion.div
              key={card.heading}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-cinema-card border border-cinema rounded-lg p-6 group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <div className="mb-4 w-fit transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                <card.icon className="h-10 w-10 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
              </div>
              <h3 className="font-display font-bold text-lg text-cinema-white mb-2">
                {card.heading}
              </h3>
              <p className="text-cinema-muted text-sm mb-4">{card.description}</p>
              {(card.meta || (card.metaLeft || card.metaRight)) && (
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  {card.meta && <span className="text-cinema-gold font-medium">{card.meta}</span>}
                  {card.metaLeft && (
                    <span className="text-cinema-muted">
                      <span className="text-cinema-gold/80">{card.metaLeftLabel ?? 'Duration'}:</span> {card.metaLeft}
                    </span>
                  )}
                  {card.metaRight && (
                    <span className="text-cinema-muted">
                      <span className="text-cinema-gold/80">{card.metaRightLabel ?? 'Ideal for'}:</span> {card.metaRight}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function EventCardsSection({ section }: { section: SectionEventCards }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <SectionWrapper className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(section.heading || section.description) && (
          <div className="text-center mb-12">
            {section.heading && (
              <HeadingWithGold text={section.heading} className="font-display font-bold text-3xl sm:text-4xl mb-4" />
            )}
            {section.description && (
              <p className="text-cinema-secondary max-w-2xl mx-auto">{section.description}</p>
            )}
          </div>
        )}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-cinema-card border border-cinema rounded-lg p-6 group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <h3 className="font-display font-bold text-lg text-cinema-gold mb-2 group-hover:text-cinema-gold/90 transition-colors">
                {card.title}
              </h3>
              <p className="text-cinema-muted text-sm mb-3">{card.description}</p>
              {card.bullets && (
                <ul className="space-y-1.5">
                  {card.bullets.map((b) => (
                    <li key={b} className="text-cinema-muted text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cinema-gold flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function CtaButtonsSection({ section }: { section: SectionCtaButtons }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <SectionWrapper className="py-16 sm:py-20 bg-cinema-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {section.heading && (
            <HeadingWithGold text={section.heading} className="font-display font-bold text-3xl sm:text-4xl mb-4" />
          )}
          {section.description && (
            <p className="text-cinema-secondary max-w-xl mx-auto mb-8">{section.description}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {section.buttons.map((btn, i) => (
              <Link
                key={btn.label}
                href={btn.href}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-cinema-gold text-cinema-black font-display font-bold uppercase tracking-wider hover:bg-cinema-gold-hover transition-colors rounded border border-cinema-gold"
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function RenderSection({ section }: { section: SectionConfig }) {
  switch (section.type) {
    case 'cards4':
      return <Cards4Section section={section} />;
    case 'process':
      return <ProcessSection section={section} />;
    case 'twoColumn':
      return <TwoColumnSection section={section} />;
    case 'cardsWithMeta':
      return <CardsWithMetaSection section={section} />;
    case 'eventCards':
      return <EventCardsSection section={section} />;
    case 'ctaButtons':
      return <CtaButtonsSection section={section} />;
    default:
      return null;
  }
}

interface ServiceSectionsProps {
  sections: SectionConfig[];
}

export default function ServiceSections({ sections }: ServiceSectionsProps) {
  return (
    <>
      {sections.map((section, index) => (
        <RenderSection key={index} section={section} />
      ))}
    </>
  );
}
