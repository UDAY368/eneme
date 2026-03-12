'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogApi, Blog } from '@/lib/api';
import { Plus, FileText, Pen, Trash2, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    blogApi.getList()
      .then(({ blogs: b, totalBlogs: c }) => {
        setBlogs(b as Blog[]);
        setTotalBlogs(c);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
      });
  }, []);

  function handleDelete(id: string) {
    if (confirm('Delete this blog?')) {
      blogApi.delete(id).then(() => {
        setBlogs(blogs.filter((b) => b.id !== id));
        setTotalBlogs((n) => n - 1);
      });
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-cinema-muted">Total Blogs</CardTitle>
          <FileText className="h-4 w-4 text-cinema-muted" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : totalBlogs}</div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => setAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          {error}
          {error.includes('Database') && (
            <p className="mt-2 text-sm">Ensure the backend database is set up: run <code className="bg-cinema-card px-1 rounded">npm run db:push</code> in the backend folder.</p>
          )}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden">
            {blog.imageUrl && (
              <img src={blog.imageUrl} alt={blog.blogTitle} className="w-full h-40 object-cover" />
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-1">{blog.blogTitle}</CardTitle>
              <CardDescription>
                {new Date(blog.date).toLocaleDateString()} • {blog.timeToRead || '-'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!!previewLoadingId}
                onClick={() => {
                  setPreviewLoadingId(blog.id);
                  setPreviewBlog(null);
                  blogApi.getById(blog.id).then((b) => {
                    setPreviewBlog(b);
                    setPreviewLoadingId(null);
                  }).catch(() => setPreviewLoadingId(null));
                }}
              >
                <Eye className="h-3 w-3 mr-1" /> {previewLoadingId === blog.id ? 'Loading...' : 'Preview'}
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={`/admin/content/blog/edit/${blog.id}`}>
                  <Pen className="h-3 w-3 mr-1" /> Edit
                </a>
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {addModal && (
        <AddBlogModal
          onClose={() => setAddModal(false)}
          onSuccess={(blog) => {
            setBlogs([blog, ...blogs]);
            setTotalBlogs((n) => n + 1);
            setAddModal(false);
          }}
        />
      )}

      {previewBlog && (
        <Dialog open onOpenChange={() => setPreviewBlog(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClose={() => setPreviewBlog(null)}>
            <div className="flex flex-col gap-4">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>{previewBlog.blogTitle}</DialogTitle>
                <DialogDescription>
                  {new Date(previewBlog.date).toLocaleDateString()} • {previewBlog.timeToRead || ''}
                </DialogDescription>
              </DialogHeader>
              {previewBlog.imageUrl && (
                <div className="w-full aspect-video overflow-hidden rounded-lg flex-shrink-0">
                  <img src={previewBlog.imageUrl} alt={previewBlog.blogTitle} className="w-full h-full object-cover object-center block" />
                </div>
              )}
              <div
                className="flex-1 min-h-0 break-words blog-preview-content"
                dangerouslySetInnerHTML={{ __html: previewBlog.content }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddBlogModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (blog: Blog) => void }) {
  const [chipTitle, setChipTitle] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeToRead, setTimeToRead] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    setLoading(true);
    blogApi
      .create({
        chipTitle: chipTitle || undefined,
        blogTitle: blogTitle.trim(),
        blogDescription: blogDescription || undefined,
        date,
        timeToRead: timeToRead || undefined,
        imageUrl: imageUrl || undefined,
        content: content || '',
      })
      .then((blog) => {
        setLoading(false);
        onSuccess(blog);
      })
      .catch(() => setLoading(false));
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Add Blog</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Chip Title</Label>
            <Input value={chipTitle} onChange={(e) => setChipTitle(e.target.value)} placeholder="Category tag" />
          </div>
          <div>
            <Label>Blog Title *</Label>
            <Input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Blog title" required />
          </div>
          <div>
            <Label>Blog Description</Label>
            <textarea
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              className="w-full min-h-[80px] rounded-md border border-cinema bg-cinema-dark px-3 py-2 text-sm"
              placeholder="Short description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time to Read</Label>
              <Input value={timeToRead} onChange={(e) => setTimeToRead(e.target.value)} placeholder="5 min read" />
            </div>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Content (Rich Text)</Label>
            <div className="rounded border border-cinema overflow-hidden">
              <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-cinema-dark" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Blog'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
