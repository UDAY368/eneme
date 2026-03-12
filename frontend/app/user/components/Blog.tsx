'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { blogApi, type Blog as BlogType } from '@/lib/api';
import { prefetchCache } from '@/lib/prefetch-cache';

interface BlogProps {
  compact?: boolean;
}

export default function Blog({ compact = false }: BlogProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = prefetchCache.getBlog();
    if (cached) {
      setBlogs(cached.blogs as BlogType[]);
      setLoading(false);
      return;
    }
    blogApi
      .getList()
      .then(({ blogs: list }) => {
        setBlogs(list as BlogType[]);
        prefetchCache.setBlog({ blogs: list });
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blog" className={compact ? 'pt-12 pb-24 bg-cinema-section' : 'py-24 bg-cinema-section'} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6">BLOG</h2>
            <p className="text-cinema-secondary max-w-2xl mx-auto text-lg">
              Insights and stories from the world of cinematic storytelling
            </p>
          </motion.div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-cinema-card border border-cinema rounded-lg animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-cinema-muted">No blog posts yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-cinema-card border border-cinema rounded-lg overflow-hidden transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
              >
                <Link href={`/user/blog/${blog.id}`} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    {blog.imageUrl ? (
                      <Image
                        src={blog.imageUrl}
                        alt={blog.blogTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-cinema-dark flex items-center justify-center">
                        <span className="text-cinema-muted text-4xl font-display">E</span>
                      </div>
                    )}
                    {blog.chipTitle && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-cinema-gold/90 text-cinema-black text-xs font-bold uppercase">
                        {blog.chipTitle}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-cinema-gold transition-colors line-clamp-2">
                      {blog.blogTitle}
                    </h3>
                    {blog.blogDescription && (
                      <p className="text-cinema-secondary text-sm line-clamp-2 mb-4">{blog.blogDescription}</p>
                    )}
                    <div className="flex items-center justify-between text-cinema-muted text-xs">
                      <span>{blog.date}</span>
                      {blog.timeToRead && <span>{blog.timeToRead} read</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 mt-4 text-cinema-gold text-sm font-medium">
                      Read more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
