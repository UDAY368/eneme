'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

function FooterLogo() {
  const [imgError, setImgError] = useState(false);
  return imgError ? (
    <span className="font-display font-bold text-xl text-cinema-gold">ENEMME STUDIOS</span>
  ) : (
    <Image
      src="/assets/images/enemmelogo.png"
      alt="Enemme Studios"
      width={140}
      height={40}
      className="h-10 w-auto"
      onError={() => setImgError(true)}
    />
  );
}

const SERVICES_LINKS = [
  { label: 'Ad Films', href: '/user/services/ad-films' },
  { label: 'Business Videos', href: '/user/services/business-videos' },
  { label: 'Corporate Events', href: '/user/services/corporate-events' },
  { label: 'Digital Marketing', href: '/user/services/digital-marketing' },
];
const STUDIO_LINKS = [
  { label: 'About Us', href: '/user#about' },
  { label: 'Portfolio', href: '/user/portfolio' },
  { label: 'Blog', href: '/user/blog' },
  { label: 'Contact', href: '/user#contact' },
];

const SOCIAL = [
  { icon: Facebook, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-cinema-black border-t border-cinema">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="min-w-0">
            <Link href="/user" className="inline-block mb-4">
              <FooterLogo />
            </Link>
            <p className="text-cinema-secondary text-sm leading-relaxed max-w-sm">
              Creating exceptional visual experiences through the timeless art of cinematic storytelling and vintage-inspired production techniques.
            </p>
            <div className="flex gap-4 mt-6">
              {SOCIAL.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cinema-muted hover:text-cinema-gold transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {SERVICES_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-cinema-secondary hover:text-cinema-gold transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg mb-4">Studio</h3>
            <ul className="space-y-2">
              {STUDIO_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-cinema-secondary hover:text-cinema-gold transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-cinema py-6 px-4 text-center text-cinema-muted text-sm">
        © 2025 Enemme Studios. All rights reserved. | Crafting cinematic excellence since the golden age.
      </div>
    </footer>
  );
}
