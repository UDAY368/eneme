'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import Blog from '../components/Blog';

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          heading="BLOG"
          description="Insights and stories from the world of cinematic storytelling"
          bgImage="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80"
          primaryBtn={{ label: 'Read Articles', href: '#blog-content' }}
          secondaryBtn={{ label: 'Contact Us', href: '/user#contact' }}
        />
        <div id="blog-content">
          <Blog compact />
        </div>
      </main>
      <Footer />
    </>
  );
}
