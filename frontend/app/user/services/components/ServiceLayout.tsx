'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface ServiceLayoutProps {
  children: React.ReactNode;
}

export default function ServiceLayout({ children }: ServiceLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
