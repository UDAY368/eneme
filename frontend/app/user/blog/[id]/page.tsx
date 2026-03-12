'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { blogApi, type Blog } from '@/lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    blogApi.getById(id).then(setBlog).catch(() => setBlog(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 animate-pulse">
            <div className="h-12 w-48 bg-cinema-card rounded mb-8" />
            <div className="aspect-video bg-cinema-card rounded mb-8" />
            <div className="h-4 bg-cinema-card rounded mb-4" />
            <div className="h-4 bg-cinema-card rounded mb-4" />
            <div className="h-4 bg-cinema-card rounded w-2/3" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-cinema-muted mb-4">Blog post not found.</p>
            <Link href="/user#blog" className="text-cinema-gold hover:underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/user#blog"
            className="inline-flex items-center gap-2 text-cinema-secondary hover:text-cinema-gold mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {blog.chipTitle && (
            <span className="inline-block px-3 py-1 bg-cinema-gold/20 text-cinema-gold text-sm font-bold uppercase mb-4">
              {blog.chipTitle}
            </span>
          )}

          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-6">{blog.blogTitle}</h1>

          {blog.blogDescription && (
            <p className="text-xl text-cinema-secondary mb-6">{blog.blogDescription}</p>
          )}

          <div className="flex gap-4 text-cinema-muted text-sm mb-8">
            <span>{blog.date}</span>
            {blog.timeToRead && <span>{blog.timeToRead} read</span>}
          </div>

          {blog.imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-10">
              <Image
                src={blog.imageUrl}
                alt={blog.blogTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-cinema-white
              prose-p:text-cinema-secondary prose-p:leading-relaxed
              prose-a:text-cinema-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-cinema-white
              prose-li:text-cinema-secondary"
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
