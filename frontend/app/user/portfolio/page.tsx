'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import Portfolio from '../components/Portfolio';

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          heading="OUR PORTFOLIO"
          description="Explore our collection of timeless projects crafted with the elegance of classic cinema"
          bgImage="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80"
          primaryBtn={{ label: 'View Work', href: '#portfolio-content' }}
          secondaryBtn={{ label: 'Get in Touch', href: '/user#contact' }}
        />
        <div id="portfolio-content" className="pt-0">
          <Portfolio compact />
        </div>
      </main>
      <Footer />
    </>
  );
}
