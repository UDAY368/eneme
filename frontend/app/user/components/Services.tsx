'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Film, Video, Briefcase, Calendar, Tv, Search, Share2, Palette } from 'lucide-react';

const CLIENT_LOGOS = [
  '1200px-Lindstrom_logo_RGB.png',
  'ADANI (1).png',
  'alankaran logo 1.png',
  'Capture.PNG',
  'chitra cars PNG.png',
  'Crazy kick Registered Trademark black text.png',
  'darzee (logo) White bg with tm-1.png',
  'Divineecharm_basic-file 22.png',
  'Dr.Dog Logo.jpg',
  'final1.png',
  'HemlineBlack-01.png',
  'Houdini-Logo (1).png',
  'indus-towers-logo-300x100.jpg',
  'Knot Solutions Logo.png',
  'kriti Logo transparent bw (1).png',
  'Logo-1.png',
  'logo-final.png',
  'LOGO1-1-1.png',
  'Logo_Finalest_Final.png',
  'Monika_s Blossom_basic-file.png',
  'sand stone.png',
  'santoosh travels.png',
  'SLJ-NewLogo.png',
  'Vaishnavi-Logo-PNG.png',
  'vow 2.png',
];

function useCountUp(end: number, isActive: boolean, duration = 1800, startDelay = 0) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => setHasStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [isActive, startDelay]);
  useEffect(() => {
    if (!hasStarted) return;
    setCount(0);
    const startTime = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [end, hasStarted, duration]);
  return count;
}

const SERVICES = [
  { title: 'Ad Films', slug: 'ad-films', description: 'Classic advertising campaigns with vintage cinematography that captures hearts and drives results. We create compelling narratives that resonate with audiences across all demographics.', bullets: ['Commercial Production', 'Brand Storytelling', 'Creative Direction', 'Post-Production'], icon: Film },
  { title: 'Films & Documentaries', slug: 'films-documentaries', description: 'Timeless film production from golden age concepts to modern masterpieces. Our team brings stories to life with cinematic excellence and artistic vision.', bullets: ['Feature Films', 'Short Films', 'Documentary Production', 'Narrative Development'], icon: Video },
  { title: 'Business Videos', slug: 'business-videos', description: 'Corporate storytelling with the elegance of classic Hollywood production values. Transform your business message into compelling visual content.', bullets: ['Corporate Videos', 'Training Materials', 'Product Showcases', 'Company Profiles'], icon: Briefcase },
  { title: 'Corporate Events', slug: 'corporate-events', description: 'Complete event coverage with the grandeur of vintage film documentation. Capture every important moment with professional cinematography.', bullets: ['Event Coverage', 'Live Streaming', 'Highlight Reels', 'Multi-Camera Setup'], icon: Calendar },
  { title: 'Commercial Videos', slug: 'commercial-videos', description: 'High-impact commercials inspired by the golden era of advertising. Create memorable campaigns that drive engagement and conversions.', bullets: ['TV Commercials', 'Online Ads', 'Social Media Content', 'Brand Campaigns'], icon: Tv },
  { title: 'SEO Services', slug: 'seo-services', description: 'Boost your digital presence with strategies as refined as classic film techniques. Optimize your content for maximum visibility and engagement.', bullets: ['Video SEO', 'Content Optimization', 'Analytics', 'Performance Tracking'], icon: Search },
  { title: 'Digital Marketing', slug: 'digital-marketing', description: 'Modern marketing with the timeless appeal of vintage storytelling. Reach your audience through strategic digital campaigns.', bullets: ['Social Media Marketing', 'Content Strategy', 'Campaign Management', 'Brand Development'], icon: Share2 },
  { title: 'Media Works', slug: 'media-works', description: 'Full-spectrum media production with the craftsmanship of cinema\'s golden age. From concept to completion, we deliver excellence.', bullets: ['Media Planning', 'Creative Production', 'Distribution', 'Campaign Analysis'], icon: Palette },
];

const STATS = [
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 270, suffix: '+', label: 'Happy Clients' },
  { value: 10, suffix: '+', label: 'International Projects' },
  { value: 8, suffix: '+', label: 'Years Experience' },
];

const ROW1_LOGOS = CLIENT_LOGOS.slice(0, 13);
const ROW2_LOGOS = CLIENT_LOGOS.slice(13);

function LogoRow({ logos }: { logos: string[] }) {
  return (
    <div className="client-marquee-track flex shrink-0 items-center gap-8 px-6">
      {[...logos, ...logos].map((logo, i) => (
        <div
          key={`${logo}-${i}`}
          className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-3 grayscale opacity-80 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
        >
          <img
            src={`/assets/images/clients/${encodeURIComponent(logo)}`}
            alt=""
            className="h-12 w-28 object-contain"
          />
        </div>
      ))}
    </div>
  );
}

function StatItem({ stat, isActive, delay = 0 }: { stat: (typeof STATS)[0]; isActive: boolean; delay?: number }) {
  const count = useCountUp(stat.value, isActive, 1800, delay);
  return (
    <div className="text-center">
      <div className="font-display font-bold text-4xl sm:text-5xl text-cinema-gold mb-2 tabular-nums">
        {count}
        {stat.suffix}
      </div>
      <div className="text-cinema-secondary">{stat.label}</div>
    </div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isStatsInView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <section id="services" className="py-24 bg-cinema-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6"><span className="text-cinema-white">OUR</span> <span className="text-cinema-gold">SERVICES</span></h2>
          <p className="text-cinema-secondary max-w-2xl mx-auto text-lg">
            From concept to completion, we deliver exceptional visual experiences with the timeless elegance of classic cinema
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-cinema-card border border-cinema rounded-lg p-6 transition-all duration-300 group relative overflow-visible hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <div className="mb-4 w-fit transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                <service.icon className="h-10 w-10 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-cinema-white group-hover:text-cinema-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-cinema-muted text-sm mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.bullets.map((b) => (
                  <li key={b} className="text-cinema-secondary text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cinema-gold" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={`/user/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-cinema-gold font-medium text-sm hover:text-cinema-gold-hover transition-colors group/btn"
              >
                Learn More
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} isActive={isStatsInView} delay={i * 120} />
          ))}
        </motion.div>

        {/* Client logos marquee */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24"
        >
          <p className="mb-10 text-center font-display text-sm font-medium uppercase tracking-[0.25em] text-cinema-muted">
            Trusted by leading brands worldwide
          </p>
          <div className="relative overflow-hidden">
            {/* Gradient masks for premium fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-cinema-section to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-cinema-section to-transparent" />
            {/* Row 1 */}
            <div className="flex overflow-hidden border-y border-cinema py-6">
              <LogoRow logos={ROW1_LOGOS} />
            </div>
            {/* Row 2 - same animation timing via shared class */}
            <div className="flex overflow-hidden border-b border-cinema py-6">
              <LogoRow logos={ROW2_LOGOS} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
