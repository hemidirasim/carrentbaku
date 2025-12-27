import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface BlogPost {
  id: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  title_ar?: string;
  slug: string;
  content_az: string;
  content_ru?: string;
  content_en?: string;
  content_ar?: string;
  excerpt_az?: string;
  excerpt_ru?: string;
  excerpt_en?: string;
  excerpt_ar?: string;
  image_url?: string;
  image_urls?: string[];
  author?: string;
  category: string;
  published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

type ArticleCategory = 'news' | 'blogs';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const isEditing = !!id;

  const categoryOptions = useMemo(() => ([
    { value: 'news' as ArticleCategory, label: 'Yeniliklər' },
    { value: 'blogs' as ArticleCategory, label: 'Bloq yazısı' },
  ]), []);

  const [formData, setFormData] = useState({
    title_az: '',
    title_ru: '',
    title_en: '',
    title_ar: '',
    slug: '',
    content_az: '',
    content_ru: '',
    content_en: '',
    content_ar: '',
    excerpt_az: '',
    excerpt_ru: '',
    excerpt_en: '',
    excerpt_ar: '',
    image_urls: [] as string[],
    author: 'Admin',
    category: 'news' as ArticleCategory,
    published: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [id, isEditing]);

  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      const post: BlogPost = await api.blog.getById(postId);
      const imageUrls: string[] = Array.isArray(post.image_urls)
        ? post.image_urls
        : post.image_url
        ? (() => {
            try {
              const parsed = JSON.parse(post.image_url as string);
              return Array.isArray(parsed) ? parsed : [post.image_url as string];
            } catch {
              return [post.image_url as string];
            }
          })()
        : [];

      setFormData({
        title_az: post.title_az || '',
        title_ru: post.title_ru || '',
        title_en: post.title_en || '',
        title_ar: post.title_ar || '',
        slug: post.slug || '',
        content_az: post.content_az || '',
        content_ru: post.content_ru || '',
        content_en: post.content_en || '',
        content_ar: post.content_ar || '',
        excerpt_az: post.excerpt_az || '',
        excerpt_ru: post.excerpt_ru || '',
        excerpt_en: post.excerpt_en || '',
        excerpt_ar: post.excerpt_ar || '',
        image_urls: imageUrls,
        author: post.author || 'Admin',
        category: (post.category as ArticleCategory) || 'news',
        published: post.published || false,
      });
    } catch (error: any) {
      console.error('Error loading post:', error);
      const errorMessage = error?.message || error?.error || 'Yazını yükləməkdə xəta baş verdi';
      toast.error(errorMessage);
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string, lang: string) => {
    setFormData(prev => ({
      ...prev,
      [`title_${lang}`]: value,
      slug: lang === 'az' ? generateSlug(value) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_az.trim()) {
      toast.error('Azərbaycan başlığı məcburidir');
      return;
    }

    if (!formData.content_az.trim()) {
      toast.error('Azərbaycan məzmunu məcburidir');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Slug məcburidir');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (isEditing && id) {
        await api.blog.update(id, submitData);
        toast.success('Yazı yeniləndi');
      } else {
        await api.blog.create(submitData);
        toast.success('Yazı yaradıldı');
      }

      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      const errorMessage = error?.message || error?.error || 'Yazını saxlamaqda xəta baş verdi';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Yazı Redaktə Et' : 'Yeni Yazı Yarat'}</h1>
                <p className="text-muted-foreground">Məqalənin bütün dillərdə məzmununu əlavə edin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_az">Azərbaycan Başlığı *</Label>
                  <Input
                    id="title_az"
                    value={formData.title_az}
                    onChange={(e) => handleTitleChange(e.target.value, 'az')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ru">Rus Başlığı</Label>
                  <Input
                    id="title_ru"
                    value={formData.title_ru}
                    onChange={(e) => handleTitleChange(e.target.value, 'ru')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">İngilis Başlığı</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => handleTitleChange(e.target.value, 'en')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">Ərəb Başlığı</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => handleTitleChange(e.target.value, 'ar')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kateqoriya *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: ArticleCategory) =>
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kateqoriya seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Müəllif</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Azərbaycan Açıqlaması</Label>
                  <Textarea
                    value={formData.excerpt_az}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_az: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rus Açıqlaması</Label>
                  <Textarea
                    value={formData.excerpt_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_ru: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>İngilis Açıqlaması</Label>
                  <Textarea
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ərəb Açıqlaması</Label>
                  <Textarea
                    value={formData.excerpt_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_ar: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Azərbaycan Məzmunu *</Label>
                  <Textarea
                    value={formData.content_az}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_az: e.target.value }))}
                    rows={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rus Məzmunu</Label>
                  <Textarea
                    value={formData.content_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_ru: e.target.value }))}
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label>İngilis Məzmunu</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ərəb Məzmunu</Label>
                  <Textarea
                    value={formData.content_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
                    rows={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Şəkillər</Label>
                <ImageGalleryUpload
                  value={formData.image_urls}
                  onChange={(value) => setFormData(prev => ({ ...prev, image_urls: value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  />
                  <Label htmlFor="published">Yayımda görünsün</Label>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Yadda saxlanır...' : (isEditing ? 'Yenilə' : 'Yarat')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlogForm;
