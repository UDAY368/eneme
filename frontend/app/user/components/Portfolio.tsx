'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, X } from 'lucide-react';
import { portfolioApi, type Portfolio, type PortfolioCategory, type PortfolioSubCategory } from '@/lib/api';
import { prefetchCache } from '@/lib/prefetch-cache';
import { cn } from '@/lib/utils';

function sanitizeVideoUrl(url: string): string {
  if (!url?.trim()) return url;
  let u = url.trim();
  u = u.replace(/^www\.(https?:\/\/)/i, '$1');
  u = u.replace(/(https?:\/\/)www\.\1/gi, '$1www.');
  u = u.replace(/^(https?)\1*:\/\//i, '$1://');
  u = u.replace(/^(https?:\/\/)https?:\/\//i, '$1');
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u.replace(/^\/+/, '');
  return u;
}

function VideoModal({ videoUrl, title, year, onClose }: { videoUrl: string; title: string; year?: string | null; onClose: () => void }) {
  const cleanUrl = sanitizeVideoUrl(videoUrl);
  const isYoutube = /youtube\.com|youtu\.be/i.test(cleanUrl);
  const isVimeo = /vimeo\.com/i.test(cleanUrl);
  let embedUrl = cleanUrl;
  let useEmbed = false;
  if (isYoutube) {
    const m = cleanUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (m?.[1]) {
      embedUrl = `https://www.youtube.com/embed/${m[1]}?autoplay=1`;
      useEmbed = true;
    }
  } else if (isVimeo) {
    const m = cleanUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m?.[1]) {
      embedUrl = `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
      useEmbed = true;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-cinema-white p-2">
          <X className="h-6 w-6" />
        </button>
        <div className="flex gap-2 mb-2">
          <span className="text-cinema-gold font-medium">{title}</span>
          {year && <span className="text-cinema-muted text-sm">{year}</span>}
        </div>
        <div className="aspect-video bg-black rounded overflow-hidden">
          {useEmbed ? (
            <iframe src={embedUrl} title={title} className="w-full h-full" allow="autoplay" allowFullScreen />
          ) : (
            <video src={cleanUrl} controls autoPlay className="w-full h-full" />
          )}
        </div>
      </div>
    </div>
  );
}

interface PortfolioProps {
  compact?: boolean;
}

export default function Portfolio({ compact = false }: PortfolioProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [subCategories, setSubCategories] = useState<PortfolioSubCategory[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Portfolio | null>(null);
  const [videoModal, setVideoModal] = useState<Portfolio | null>(null);

  const loadData = useCallback(async () => {
    const cached = prefetchCache.getPortfolio();
    if (cached && !selectedCategory && !selectedSubCategory) {
      setCategories(cached.categories as PortfolioCategory[]);
      setSubCategories(cached.subCategories as PortfolioSubCategory[]);
      setPortfolios(cached.portfolios as Portfolio[]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [cats, subs, all] = await Promise.all([
        portfolioApi.getCategories(),
        portfolioApi.getSubCategories(),
        portfolioApi.getAll(),
      ]);
      setCategories(cats);
      setSubCategories(subs);
      setPortfolios(all);
      if (!selectedCategory && !selectedSubCategory) {
        prefetchCache.setPortfolio({ categories: cats, subCategories: subs, portfolios: all });
      }
    } catch {
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (!selectedCategory && !selectedSubCategory) {
      loadData();
    }
  }, [loadData, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (selectedCategory) {
      portfolioApi.getSubCategories(selectedCategory).then(setSubCategories);
      setSelectedSubCategory(null);
    } else {
      setSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory || selectedSubCategory) {
      const params: { categoryId?: string; subCategoryId?: string } = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedSubCategory) params.subCategoryId = selectedSubCategory;
      setLoading(true);
      portfolioApi
        .getAll(params)
        .then(setPortfolios)
        .finally(() => setLoading(false));
    }
  }, [selectedCategory, selectedSubCategory]);

  const filteredSubs = selectedCategory
    ? subCategories.filter((s) => s.categoryId === selectedCategory)
    : [];

  return (
    <section id="portfolio" className={compact ? 'pt-12 pb-24 bg-cinema-section' : 'py-24 bg-cinema-section'} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6"><span className="text-cinema-white">OUR</span> <span className="text-cinema-gold">PORTFOLIO</span></h2>
            <p className="text-cinema-secondary max-w-2xl mx-auto text-lg">
              Explore our collection of timeless projects crafted with the elegance of classic cinema
            </p>
          </motion.div>
        )}

        {/* Filter chips - Categories & Subcategories with clear separation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          {/* Row 1: Categories */}
          <div className="mb-6">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-cinema-muted mb-4">
              Categories
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  !selectedCategory && !selectedSubCategory
                    ? 'bg-cinema-gold text-cinema-black shadow-[0_0_20px_rgba(200,169,106,0.3)]'
                    : 'bg-cinema-card border border-cinema text-cinema-secondary hover:border-cinema-gold/50 hover:text-cinema-white'
                )}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                  className={cn(
                    'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                    selectedCategory === c.id
                      ? 'bg-cinema-gold text-cinema-black shadow-[0_0_20px_rgba(200,169,106,0.3)]'
                      : 'bg-cinema-card border border-cinema text-cinema-secondary hover:border-cinema-gold/50 hover:text-cinema-white'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Subcategories (only when category selected) */}
          <AnimatePresence mode="wait">
            {selectedCategory && filteredSubs.length > 0 ? (
              <motion.div
                key="subcategories"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-cinema pt-6 overflow-hidden"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-cinema-muted mb-4">
                  Subcategories — {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                      !selectedSubCategory
                        ? 'bg-cinema-gold/80 text-cinema-black'
                        : 'bg-cinema-dark/80 border border-cinema text-cinema-muted hover:border-cinema-gold/40 hover:text-cinema-secondary'
                    )}
                  >
                    All
                  </button>
                  {filteredSubs.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubCategory(selectedSubCategory === s.id ? null : s.id)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                        selectedSubCategory === s.id
                          ? 'bg-cinema-gold/80 text-cinema-black shadow-[0_0_15px_rgba(200,169,106,0.25)]'
                          : 'bg-cinema-dark/80 border border-cinema text-cinema-muted hover:border-cinema-gold/40 hover:text-cinema-secondary'
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-cinema-card border border-cinema rounded-lg animate-pulse" />
              ))}
            </>
          ) : portfolios.length === 0 ? (
            <div className="col-span-full text-center py-12 text-cinema-muted">No projects yet</div>
          ) : (
            portfolios.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-cinema-card border border-cinema rounded-lg overflow-hidden transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
              >
                {(p.imageUrl || p.videoUrl) && (
                  <div className="relative w-full h-56 overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.heading}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-md group-hover:brightness-50 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-cinema-dark flex items-center justify-center">
                        <Play className="h-16 w-16 text-cinema-muted/50" />
                      </div>
                    )}
                    {p.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                        <button
                          onClick={() => setVideoModal(p)}
                          className="w-14 h-14 rounded-full bg-cinema-gold text-cinema-black flex items-center justify-center hover:bg-cinema-gold-hover transition-transform hover:scale-110"
                        >
                          <Play className="h-7 w-7 ml-1" fill="currentColor" />
                        </button>
                        <button
                          onClick={() => window.open(sanitizeVideoUrl(p.videoUrl!), '_blank')}
                          className="w-14 h-14 rounded-full bg-white text-cinema-black flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <ExternalLink className="h-6 w-6" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-lg">{p.heading}</h3>
                    {p.year && (
                      <span className="px-2 py-0.5 rounded bg-cinema-gold/20 text-cinema-gold text-xs">
                        {p.year}
                      </span>
                    )}
                  </div>
                  <p className="text-cinema-muted text-sm mt-1">
                    {p.category?.name} / {p.subCategory?.name}
                  </p>
                  <button
                    onClick={() => setPreview(p)}
                    className="mt-3 text-cinema-gold text-sm font-medium hover:text-cinema-gold-hover"
                  >
                    View details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cinema-card border border-cinema rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setPreview(null)} className="float-right text-cinema-muted hover:text-cinema-white">
                <X className="h-6 w-6" />
              </button>
              {(preview.imageUrl || preview.videoUrl) && (
                <div className="relative w-full aspect-video rounded mb-4 overflow-hidden">
                  {preview.imageUrl ? (
                    <img
                      src={preview.imageUrl}
                      alt={preview.heading}
                      className={cn(
                        'w-full h-full object-cover transition-all duration-300',
                        preview.videoUrl && 'blur-md brightness-75'
                      )}
                    />
                  ) : (
                    <div className="w-full h-full bg-cinema-dark flex items-center justify-center">
                      <Play className="h-16 w-16 text-cinema-muted/50" />
                    </div>
                  )}
                  {preview.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/30">
                      <button
                        onClick={() => {
                          setPreview(null);
                          setVideoModal(preview);
                        }}
                        className="w-16 h-16 rounded-full bg-cinema-gold text-cinema-black flex items-center justify-center hover:bg-cinema-gold-hover transition-transform hover:scale-110 shadow-lg"
                      >
                        <Play className="h-8 w-8 ml-1" fill="currentColor" />
                      </button>
                      <button
                        onClick={() => window.open(sanitizeVideoUrl(preview.videoUrl!), '_blank')}
                        className="w-16 h-16 rounded-full bg-white/90 text-cinema-black flex items-center justify-center hover:bg-white hover:scale-110 transition-transform shadow-lg"
                      >
                        <ExternalLink className="h-7 w-7" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <h3 className="font-display font-bold text-2xl mb-2">{preview.heading}</h3>
              {preview.year && <span className="text-cinema-gold text-sm">{preview.year}</span>}
              <p className="text-cinema-secondary mt-4">{preview.description}</p>
              {preview.chips?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {preview.chips.map((c) => (
                    <span key={c} className="px-2 py-1 rounded bg-cinema-gold/20 text-cinema-gold text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {videoModal && videoModal.videoUrl && (
        <VideoModal
          videoUrl={videoModal.videoUrl}
          title={videoModal.heading}
          year={videoModal.year}
          onClose={() => setVideoModal(null)}
        />
      )}
    </section>
  );
}
