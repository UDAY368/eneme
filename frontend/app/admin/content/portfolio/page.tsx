'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioApi, PortfolioCategory, PortfolioSubCategory, Portfolio } from '@/lib/api';
import { Plus, FolderOpen, Layers, Pen, Trash2, Eye, ArrowLeft, Play, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type View = 'main' | 'add-portfolio' | 'view-portfolio' | 'add-category' | 'add-subcategory';

export default function PortfolioPage() {
  const [view, setView] = useState<View>('main');
  const [stats, setStats] = useState({ totalPortfolios: 0, totalCategories: 0, totalSubCategories: 0 });
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [subCategories, setSubCategories] = useState<PortfolioSubCategory[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryModal, setCategoryModal] = useState<'add' | 'edit' | null>(null);
  const [subCategoryModal, setSubCategoryModal] = useState<'add' | 'edit' | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null);

  const [previewPortfolio, setPreviewPortfolio] = useState<Portfolio | null>(null);
  const [previewVideoModal, setPreviewVideoModal] = useState<Portfolio | null>(null);

  function loadData() {
    setLoading(true);
    portfolioApi.getStats().then(setStats).catch(() => {});
    Promise.all([
      portfolioApi.getCategories(),
      portfolioApi.getAll(),
    ]).then(([c, p]) => {
      setCategories(c);
      setPortfolios(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategoryForSub) {
      portfolioApi.getSubCategories(selectedCategoryForSub).then(setSubCategories);
    } else {
      portfolioApi.getSubCategories().then(setSubCategories);
    }
  }, [selectedCategoryForSub, view]);

  function handleAddCategory() {
    if (!categoryName.trim()) return;
    portfolioApi.createCategory(categoryName.trim()).then(() => {
      setCategoryName('');
      setCategoryModal(null);
      loadData();
    });
  }

  function handleEditCategory() {
    if (!editCategoryId || !categoryName.trim()) return;
    portfolioApi.updateCategory(editCategoryId, categoryName.trim()).then(() => {
      setEditCategoryId(null);
      setCategoryName('');
      setCategoryModal(null);
      loadData();
    });
  }

  function handleDeleteCategory(id: string) {
    if (confirm('Delete this category and all its sub-categories and portfolios?')) {
      portfolioApi.deleteCategory(id).then(loadData);
    }
  }

  function handleAddSubCategory() {
    if (!selectedCategoryForSub || !subCategoryName.trim()) return;
    portfolioApi.createSubCategory(selectedCategoryForSub, subCategoryName.trim()).then(() => {
      setSubCategoryName('');
      setSelectedCategoryForSub('');
      setSubCategoryModal(null);
      loadData();
    });
  }

  function handleEditSubCategory() {
    if (!editSubCategoryId || !subCategoryName.trim()) return;
    portfolioApi.updateSubCategory(editSubCategoryId, subCategoryName.trim()).then(() => {
      setEditSubCategoryId(null);
      setSubCategoryName('');
      setSubCategoryModal(null);
      loadData();
    });
  }

  function handleDeleteSubCategory(id: string) {
    if (confirm('Delete this sub-category?')) {
      portfolioApi.deleteSubCategory(id).then(loadData);
    }
  }

  const subCategoriesByCategory = subCategories.filter(
    (s) => !selectedCategoryForSub || s.categoryId === selectedCategoryForSub
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <div className="flex items-center gap-2">
          {view === 'main' && (
            <>
              <Button variant="outline" onClick={() => setView('view-portfolio')}>
                View Portfolio
              </Button>
              <Button onClick={() => setView('add-portfolio')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio
              </Button>
            </>
          )}
          {view !== 'main' && (
            <Button variant="outline" onClick={() => setView('main')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </div>

      {view === 'main' && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-cinema-muted">Total Portfolio</CardTitle>
                <FolderOpen className="h-4 w-4 text-cinema-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalPortfolios}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-cinema-muted">Total Categories</CardTitle>
                <Layers className="h-4 w-4 text-cinema-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalCategories}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-cinema-muted">Total Sub Categories</CardTitle>
                <Layers className="h-4 w-4 text-cinema-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalSubCategories}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setCategoryModal('add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button variant="outline" onClick={() => setSubCategoryModal('add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub Category
            </Button>
          </div>

          {categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-cinema-dark border border-cinema">
                        <span>{c.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => { setEditCategoryId(c.id); setCategoryName(c.name); setCategoryModal('edit'); }}>
                          <Pen className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(c.id)}>
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
              </CardContent>
            </Card>
          )}

          {selectedCategoryForSub && (
            <Card>
              <CardHeader>
                <CardTitle>Sub Categories ({categories.find((c) => c.id === selectedCategoryForSub)?.name})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                    {subCategoriesByCategory.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-cinema-dark border border-cinema">
                        <span>{s.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => { setEditSubCategoryId(s.id); setSubCategoryName(s.name); setSubCategoryModal('edit'); }}>
                          <Pen className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteSubCategory(s.id)}>
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <span className="text-sm text-cinema-muted">Select Category to view Sub Categories:</span>
            <Select value={selectedCategoryForSub} onValueChange={setSelectedCategoryForSub}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {view === 'add-portfolio' && (
        <AddPortfolioForm
          categories={categories}
          onSuccess={() => { setView('view-portfolio'); loadData(); }}
          onBack={() => setView('main')}
        />
      )}

      {view === 'view-portfolio' && (
        <ViewPortfolios
          portfolios={portfolios}
          onEdit={() => loadData()}
          onDelete={() => loadData()}
          onPreview={setPreviewPortfolio}
        />
      )}

      {/* Category Modal */}
      <Dialog open={!!categoryModal} onOpenChange={() => { setCategoryModal(null); setEditCategoryId(null); setCategoryName(''); }}>
        <DialogContent onClose={() => setCategoryModal(null)}>
          <DialogHeader>
            <DialogTitle>{categoryModal === 'edit' ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Category Name</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Category name" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryModal(null)}>Cancel</Button>
            <Button onClick={categoryModal === 'edit' ? handleEditCategory : handleAddCategory}>
              {categoryModal === 'edit' ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub Category Modal */}
      <Dialog open={!!subCategoryModal} onOpenChange={() => { setSubCategoryModal(null); setEditSubCategoryId(null); setSubCategoryName(''); setSelectedCategoryForSub(''); }}>
        <DialogContent onClose={() => setSubCategoryModal(null)}>
          <DialogHeader>
            <DialogTitle>{subCategoryModal === 'edit' ? 'Edit Sub Category' : 'Add Sub Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {subCategoryModal === 'add' && (
              <>
                <Label>Category</Label>
                <Select value={selectedCategoryForSub} onValueChange={setSelectedCategoryForSub}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <Label>Sub Category Name</Label>
            <Input value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)} placeholder="Sub category name" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubCategoryModal(null)}>Cancel</Button>
            <Button onClick={subCategoryModal === 'edit' ? handleEditSubCategory : handleAddSubCategory} disabled={subCategoryModal === 'add' && !selectedCategoryForSub}>
              {subCategoryModal === 'edit' ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewPortfolio} onOpenChange={() => setPreviewPortfolio(null)}>
        <DialogContent className="max-w-2xl" onClose={() => setPreviewPortfolio(null)}>
          {previewPortfolio && (
            <div className="space-y-4">
              {(previewPortfolio.imageUrl || previewPortfolio.videoUrl) && (
                <div className="relative w-full aspect-video overflow-hidden rounded-lg group">
                  {previewPortfolio.imageUrl ? (
                    <img
                      src={previewPortfolio.imageUrl}
                      alt={previewPortfolio.heading}
                      className="w-full h-full object-cover object-center transition-all duration-300 group-hover:blur-md group-hover:brightness-50"
                    />
                  ) : (
                    <div className="w-full h-full bg-cinema-card flex items-center justify-center transition-all duration-300 group-hover:brightness-50">
                      <Play className="h-16 w-16 text-cinema-muted/50" />
                    </div>
                  )}
                  {previewPortfolio.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-cinema-dark/30">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewVideoModal(previewPortfolio); }}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-cinema-gold text-white shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 ring-4 ring-cinema-gold/30"
                        title="Play video"
                      >
                        <Play className="h-7 w-7 ml-1" fill="currentColor" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(sanitizeVideoUrl(previewPortfolio.videoUrl!), '_blank'); }}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-white/95 hover:bg-white text-cinema-black shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{previewPortfolio.heading}</h2>
                {previewPortfolio.year && (
                  <span className="px-2 py-0.5 rounded-md bg-cinema-gold/20 text-xs font-medium text-cinema-gold">
                    {previewPortfolio.year}
                  </span>
                )}
              </div>
              <p className="text-cinema-muted">{previewPortfolio.description}</p>
              {previewPortfolio.chips?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewPortfolio.chips.map((chip) => (
                    <span key={chip} className="px-2 py-1 rounded bg-cinema-gold/20 text-sm">{chip}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {previewVideoModal && previewVideoModal.videoUrl && (
        <VideoPlayerModal
          videoUrl={previewVideoModal.videoUrl}
          title={previewVideoModal.heading}
          year={previewVideoModal.year}
          onClose={() => setPreviewVideoModal(null)}
        />
      )}
    </div>
  );
}

function AddPortfolioForm({
  categories,
  onSuccess,
  onBack,
}: {
  categories: PortfolioCategory[];
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [categoryId, setCategoryId] = useState('');
  const [subCategories, setSubCategories] = useState<PortfolioSubCategory[]>([]);
  const [subCategoryId, setSubCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [year, setYear] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [chipInput, setChipInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) portfolioApi.getSubCategories(categoryId).then(setSubCategories);
    else setSubCategories([]);
    setSubCategoryId('');
  }, [categoryId]);

  function addChip() {
    if (chipInput.trim() && !chips.includes(chipInput.trim())) {
      setChips([...chips, chipInput.trim()]);
      setChipInput('');
    }
  }

  function removeChip(i: number) {
    setChips(chips.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !subCategoryId || !heading.trim()) return;
    setLoading(true);
    portfolioApi
      .create({
        categoryId,
        subCategoryId,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        year: year || undefined,
        heading: heading.trim(),
        description: description || undefined,
        company: company || undefined,
        chips,
      })
      .then(() => {
        setLoading(false);
        onSuccess();
      })
      .catch(() => setLoading(false));
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold">Add Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Select Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Select Sub Category</Label>
          <Select value={subCategoryId} onValueChange={setSubCategoryId} required disabled={!categoryId}>
            <SelectTrigger><SelectValue placeholder="Select sub category" /></SelectTrigger>
            <SelectContent>
              {subCategories.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <Label>Year</Label>
          <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
        </div>
        <div>
          <Label>Heading *</Label>
          <Input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Project title" required />
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px] rounded-md border border-cinema bg-cinema-dark px-3 py-2 text-sm"
            placeholder="Description"
          />
        </div>
        <div>
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
        </div>
        <div>
          <Label>Chips</Label>
          <div className="flex gap-2">
            <Input
              value={chipInput}
              onChange={(e) => setChipInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChip())}
              placeholder="Add chip and press Enter"
            />
            <Button type="button" variant="outline" onClick={addChip}>Add Chip</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {chips.map((c, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 rounded bg-cinema-gold/20 text-sm">
                {c}
                <button type="button" onClick={() => removeChip(i)} className="text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Portfolio'}</Button>
        </div>
      </form>
    </div>
  );
}

function PortfolioCard({
  portfolio,
  onPreview,
  onEdit,
  onDelete,
  onPlayVideo,
  onOpenVideoNewTab,
}: {
  portfolio: Portfolio;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPlayVideo?: () => void;
  onOpenVideoNewTab?: () => void;
}) {
  const hasVideo = !!onPlayVideo && !!onOpenVideoNewTab;

  return (
    <Card className="group overflow-hidden relative transition-all duration-300">
      <div className="relative">
        {(portfolio.imageUrl || portfolio.videoUrl) && (
          <div className="relative w-full h-40 overflow-hidden">
            {portfolio.imageUrl ? (
              <img
                src={portfolio.imageUrl}
                alt={portfolio.heading}
                className="w-full h-full object-cover object-center transition-all duration-300 group-hover:blur-md group-hover:brightness-50"
              />
            ) : (
              <div className="w-full h-full bg-cinema-card flex items-center justify-center transition-all duration-300 group-hover:brightness-50">
                <Play className="h-16 w-16 text-cinema-muted/50" />
              </div>
            )}
            {hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-cinema-dark/30">
                <button
                  onClick={(e) => { e.stopPropagation(); onPlayVideo?.(); }}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-cinema-gold text-white shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 ring-4 ring-cinema-gold/30"
                  title="Play video"
                >
                  <Play className="h-7 w-7 ml-1" fill="currentColor" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenVideoNewTab?.(); }}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-white/95 hover:bg-white text-cinema-black shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{portfolio.heading}</CardTitle>
          {portfolio.year && (
            <span className="px-2 py-0.5 rounded-md bg-cinema-gold/20 text-xs font-medium text-cinema-gold">
              {portfolio.year}
            </span>
          )}
        </div>
        <CardDescription>{portfolio.category?.name} / {portfolio.subCategory?.name}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={onPreview}><Eye className="h-3 w-3 mr-1" />Preview</Button>
        <Button size="sm" variant="outline" onClick={onEdit}><Pen className="h-3 w-3 mr-1" />Edit</Button>
        <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
      </CardContent>
    </Card>
  );
}

function sanitizeVideoUrl(url: string): string {
  if (!url?.trim()) return url;
  let u = url.trim();
  // Fix "www.https://" or "www.http://" -> "https://" or "http://"
  u = u.replace(/^www\.(https?:\/\/)/i, '$1');
  // Fix "https://www.https://" or "http://www.http://" -> single protocol
  u = u.replace(/(https?:\/\/)www\.\1/gi, '$1www.');
  // Fix double protocol (e.g. "httpshttps://" or "https://https://")
  u = u.replace(/^(https?)\1*:\/\//i, '$1://');
  u = u.replace(/^(https?:\/\/)https?:\/\//i, '$1');
  // Ensure URL has protocol
  if (!/^https?:\/\//i.test(u)) {
    u = 'https://' + u.replace(/^\/+/, '');
  }
  return u;
}

function VideoPlayerModal({
  videoUrl,
  title,
  year,
  onClose,
}: {
  videoUrl: string;
  title: string;
  year?: string | null;
  onClose: () => void;
}) {
  const cleanUrl = sanitizeVideoUrl(videoUrl);
  const isYoutube = /youtube\.com|youtu\.be/i.test(cleanUrl);
  const isVimeo = /vimeo\.com/i.test(cleanUrl);

  let embedUrl = cleanUrl;
  let useEmbed = false;
  if (isYoutube) {
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    const videoId = ytMatch?.[1];
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      useEmbed = true;
    } else if (cleanUrl.includes('/embed/')) {
      embedUrl = cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + 'autoplay=1';
      useEmbed = true;
    }
  } else if (isVimeo) {
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const videoId = vimeoMatch?.[1];
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      useEmbed = true;
    }
  }

  const showIframe = (isYoutube || isVimeo) && useEmbed;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-cinema-dark border-cinema" onClose={onClose}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-cinema-gold/90 text-white text-sm font-medium shadow-lg">
              {title}
            </span>
            {year && (
              <span className="px-2 py-1 rounded-md bg-white/90 text-cinema-black text-xs font-medium shadow-lg">
                {year}
              </span>
            )}
          </div>
          <div className="aspect-video bg-black">
            {showIframe ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={cleanUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full"
              />
            )}
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open(cleanUrl, '_blank')}
              className="shadow-lg"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open in new tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ViewPortfolios({
  portfolios,
  onEdit,
  onDelete,
  onPreview,
}: {
  portfolios: Portfolio[];
  onEdit: () => void;
  onDelete: () => void;
  onPreview: (p: Portfolio) => void;
}) {
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [subCategories, setSubCategories] = useState<PortfolioSubCategory[]>([]);

  useEffect(() => {
    portfolioApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (editing?.categoryId) portfolioApi.getSubCategories(editing.categoryId).then(setSubCategories);
  }, [editing?.categoryId]);

  async function handleUpdate(id: string, data: Record<string, unknown>) {
    await portfolioApi.update(id, data);
    setEditing(null);
    onEdit();
  }

  function handleDelete(id: string) {
    if (confirm('Delete this portfolio?')) {
      portfolioApi.delete(id).then(onDelete);
    }
  }

  const [videoModal, setVideoModal] = useState<Portfolio | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">View Portfolio</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolios.map((p) => (
          <PortfolioCard
            key={p.id}
            portfolio={p}
            onPreview={() => onPreview(p)}
            onEdit={() => setEditing(p)}
            onDelete={() => handleDelete(p.id)}
            onPlayVideo={p.videoUrl ? () => setVideoModal(p) : undefined}
            onOpenVideoNewTab={p.videoUrl ? () => window.open(sanitizeVideoUrl(p.videoUrl!), '_blank') : undefined}
          />
        ))}
      </div>

      {videoModal && videoModal.videoUrl && (
        <VideoPlayerModal
          videoUrl={videoModal.videoUrl}
          title={videoModal.heading}
          year={videoModal.year}
          onClose={() => setVideoModal(null)}
        />
      )}

      {editing && (
        <EditPortfolioModal
          portfolio={editing}
          categories={categories}
          subCategories={subCategories}
          onClose={() => setEditing(null)}
          onSave={(data) => handleUpdate(editing!.id, data)}
        />
      )}
    </div>
  );
}

function EditPortfolioModal({
  portfolio,
  categories,
  subCategories: initialSubCategories,
  onClose,
  onSave,
}: {
  portfolio: Portfolio;
  categories: PortfolioCategory[];
  subCategories: PortfolioSubCategory[];
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void | Promise<void>;
}) {
  const [categoryId, setCategoryId] = useState(portfolio.categoryId);
  const [subCategoryId, setSubCategoryId] = useState(portfolio.subCategoryId);
  const [subCategories, setSubCategories] = useState<PortfolioSubCategory[]>(initialSubCategories);
  const [imageUrl, setImageUrl] = useState(portfolio.imageUrl || '');
  const [videoUrl, setVideoUrl] = useState(portfolio.videoUrl || '');
  const [year, setYear] = useState(portfolio.year || '');
  const [heading, setHeading] = useState(portfolio.heading);
  const [description, setDescription] = useState(portfolio.description || '');
  const [company, setCompany] = useState(portfolio.company || '');
  const [chips, setChips] = useState<string[]>(portfolio.chips || []);
  const [chipInput, setChipInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) portfolioApi.getSubCategories(categoryId).then(setSubCategories);
    else setSubCategories([]);
  }, [categoryId]);

  useEffect(() => {
    if (categoryId && categoryId !== portfolio.categoryId) setSubCategoryId('');
  }, [categoryId, portfolio.categoryId]);

  function addChip() {
    if (chipInput.trim() && !chips.includes(chipInput.trim())) {
      setChips([...chips, chipInput.trim()]);
      setChipInput('');
    }
  }

  function removeChip(i: number) {
    setChips(chips.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !subCategoryId || !heading.trim()) return;
    setLoading(true);
    try {
      await onSave({
        categoryId,
        subCategoryId,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        year: year || undefined,
        heading: heading.trim(),
        description: description || undefined,
        company: company || undefined,
        chips,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Select Category</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v)} required>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Select Sub Category</Label>
            <Select value={subCategoryId} onValueChange={setSubCategoryId} required disabled={!categoryId}>
              <SelectTrigger><SelectValue placeholder="Select sub category" /></SelectTrigger>
              <SelectContent>
                {subCategories.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Year</Label>
            <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
          </div>
          <div>
            <Label>Heading *</Label>
            <Input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Project title" required />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-cinema bg-cinema-dark px-3 py-2 text-sm"
              placeholder="Description"
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
          </div>
          <div>
            <Label>Chips</Label>
            <div className="flex gap-2">
              <Input
                value={chipInput}
                onChange={(e) => setChipInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChip())}
                placeholder="Add chip and press Enter"
              />
              <Button type="button" variant="outline" onClick={addChip}>Add Chip</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {chips.map((c, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 rounded bg-cinema-gold/20 text-sm">
                  {c}
                  <button type="button" onClick={() => removeChip(i)} className="text-red-500 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
