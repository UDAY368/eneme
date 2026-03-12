'use client';

import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Blog from './components/Blog';
import GetInTouch from './components/GetInTouch';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { visitsApi } from '@/lib/api';

export default function UserPage() {
  useEffect(() => {
    visitsApi.track().catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Portfolio />
        <Blog />
        <GetInTouch />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
