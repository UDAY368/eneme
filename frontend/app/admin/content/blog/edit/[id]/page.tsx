'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { blogApi } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [chipTitle, setChipTitle] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [date, setDate] = useState('');
  const [timeToRead, setTimeToRead] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    blogApi.getById(id).then((blog) => {
      setChipTitle(blog.chipTitle || '');
      setBlogTitle(blog.blogTitle);
      setBlogDescription(blog.blogDescription || '');
      setDate(blog.date.slice(0, 10));
      setTimeToRead(blog.timeToRead || '');
      setImageUrl(blog.imageUrl || '');
      setContent(blog.content || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    setSaving(true);
    blogApi.update(id, { chipTitle, blogTitle, blogDescription, date, timeToRead, imageUrl, content }).then(() => {
      setSaving(false);
      router.push('/admin/content/blog');
    }).catch(() => setSaving(false));
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Chip Title</Label>
          <Input value={chipTitle} onChange={(e) => setChipTitle(e.target.value)} />
        </div>
        <div>
          <Label>Blog Title *</Label>
          <Input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Blog Description</Label>
          <textarea
            value={blogDescription}
            onChange={(e) => setBlogDescription(e.target.value)}
            className="w-full min-h-[80px] rounded-md border border-cinema bg-cinema-dark px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Time to Read</Label>
            <Input value={timeToRead} onChange={(e) => setTimeToRead(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <div>
          <Label>Content</Label>
          <div className="rounded border border-cinema overflow-hidden">
            <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-cinema-dark" />
          </div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </form>
    </div>
  );
}
