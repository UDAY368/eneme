'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const y = window.scrollY * 0.3;
        bgRef.current.style.transform = `translateY(${y}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80"
          alt="Cinematic theater background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-black/70 via-cinema-black/50 to-cinema-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 tracking-tight"
        >
          <span className="text-cinema-white">ENEMME</span>{' '}
          <span className="text-cinema-gold">STUDIOS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-cinema-secondary max-w-2xl mx-auto mb-12"
        >
          Crafting timeless cinematic experiences through the art of visual storytelling since the golden age of film
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center px-8 py-4 bg-cinema-gold text-cinema-black font-semibold rounded hover:bg-cinema-gold-hover transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,169,106,0.5)]"
          >
            View Our Reel
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 border border-cinema-gold text-cinema-gold font-semibold rounded hover:bg-cinema-gold/10 transition-all duration-300"
          >
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
}
