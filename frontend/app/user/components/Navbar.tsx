'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { prefetchPortfolio, prefetchBlog } from '@/lib/prefetch';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function Logo() {
  const [imgError, setImgError] = useState(false);
  return imgError ? (
    <span className="font-display font-bold text-xl text-cinema-gold">ENEMME STUDIOS</span>
  ) : (
    <Image
      src="/assets/images/enemmelogo-new.png"
      alt="Enemme Studios"
      width={160}
      height={48}
      className="h-10 w-auto object-contain"
      onError={() => setImgError(true)}
    />
  );
}

const SERVICES_DROPDOWN = [
  { label: 'Ad Films', href: '/user/services/ad-films' },
  { label: 'Business Videos', href: '/user/services/business-videos' },
  { label: 'Films & Documentaries', href: '/user/services/films-documentaries' },
  { label: 'Corporate Events', href: '/user/services/corporate-events' },
  { label: 'Commercial Videos', href: '/user/services/commercial-videos' },
  { label: 'SEO Services', href: '/user/services/seo-services' },
  { label: 'Digital Marketing', href: '/user/services/digital-marketing' },
  { label: 'Media Works', href: '/user/services/media-works' },
];

const NAV_LINKS = [
  { label: 'HOME', href: '/user#hero' },
  { label: 'SERVICES', dropdown: SERVICES_DROPDOWN },
  { label: 'ABOUT', href: '/user#about' },
  { label: 'PORTFOLIO', href: '/user/portfolio' },
  { label: 'BLOG', href: '/user/blog' },
  { label: 'CONTACT', href: '/user#contact' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleNavHover = (href: string) => {
    if (href === '/user/portfolio') {
      router.prefetch('/user/portfolio');
      prefetchPortfolio();
    } else if (href === '/user/blog') {
      router.prefetch('/user/blog');
      prefetchBlog();
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-cinema-black/90 backdrop-blur-xl border-b border-cinema' : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/user" className="flex-shrink-0 flex items-center">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-cinema-white hover:text-cinema-gold transition-colors uppercase tracking-[0.15em] group">
                    {item.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 pt-2 min-w-[240px]"
                      >
                        <div className="bg-cinema-card/95 backdrop-blur-xl border border-cinema rounded-lg py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-4 py-2.5 text-sm font-medium text-cinema-white hover:text-cinema-gold hover:bg-white/5 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href!}
                  onMouseEnter={() => handleNavHover(item.href!)}
                  className="relative text-sm font-medium text-cinema-white hover:text-cinema-gold transition-colors uppercase tracking-[0.15em] group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-cinema-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-cinema-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {NAV_LINKS.map((item) =>
                  item.dropdown ? (
                    <div key={item.label}>
                      <button
                        onClick={() => setServicesOpen(!servicesOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-cinema-white font-medium"
                      >
                        {item.label}
                        <ChevronDown className={cn('h-4 w-4', servicesOpen && 'rotate-180')} />
                      </button>
                      {servicesOpen && (
                        <div className="pl-4 space-y-1">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-sm text-cinema-white hover:text-cinema-gold font-medium"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      onTouchStart={() => handleNavHover(item.href!)}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-cinema-white hover:text-cinema-gold font-medium"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
