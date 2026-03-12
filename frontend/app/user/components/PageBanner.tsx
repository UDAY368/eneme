'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PageBannerProps {
  heading: string;
  description: string;
  bgImage: string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
}

export default function PageBanner({ heading, description, bgImage, primaryBtn, secondaryBtn }: PageBannerProps) {
  const hasMultipleWords = heading.includes(' ');
  const lastWord = heading.match(/\s+(\S+)$/)?.[1];
  const rest = hasMultipleWords ? heading.replace(/\s+\S+$/, '') : '';

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-black/80 via-cinema-black/60 to-cinema-black" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-6"
        >
          {hasMultipleWords ? (
            <>
              <span className="text-cinema-white">{rest} </span>
              <span className="text-cinema-gold">{lastWord}</span>
            </>
          ) : (
            <span className="text-cinema-gold">{heading}</span>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-cinema-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          {description}
        </motion.p>
        {(primaryBtn || secondaryBtn) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {primaryBtn && (
              <Link
                href={primaryBtn.href}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-cinema-gold text-cinema-black font-display font-bold uppercase tracking-wider hover:bg-cinema-gold-hover transition-colors rounded"
              >
                {primaryBtn.label}
              </Link>
            )}
            {secondaryBtn && (
              <Link
                href={secondaryBtn.href}
                className="inline-flex items-center justify-center px-8 py-3.5 border border-cinema text-cinema-white font-display font-bold uppercase tracking-wider hover:border-cinema-gold hover:text-cinema-gold transition-colors rounded"
              >
                {secondaryBtn.label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
