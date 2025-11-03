import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  author?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const AdminBlog = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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
    image_url: '',
    author: 'Admin',
    published: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.blog.getAll(false);
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Yazıları yükləməkdə xəta baş verdi');
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
    try {
      const submitData = {
        ...formData,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (editingPost) {
        await api.blog.update(editingPost.id, submitData);
        toast.success('Yazı yeniləndi');
      } else {
        await api.blog.create(submitData);
        toast.success('Yazı yaradıldı');
      }

      setIsAddDialogOpen(false);
      setEditingPost(null);
      setFormData({
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
        image_url: '',
        author: 'Admin',
        published: false,
      });
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Yazını saxlamaqda xəta baş verdi');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
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
      image_url: post.image_url || '',
      author: post.author || 'Admin',
      published: post.published || false,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazını silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.blog.delete(id);
      toast.success('Yazı silindi');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Yazını silməkdə xəta baş verdi');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title_az.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Blog & Xəbərlər İdarəetməsi</h1>
                <p className="text-muted-foreground">Blog yazılarını idarə edin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingPost(null);
                setFormData({
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
                  image_url: '',
                  author: 'Admin',
                  published: false,
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Yazı
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPost ? 'Yazı Redaktə Et' : 'Yeni Yazı Yarat'}</DialogTitle>
                  <DialogDescription>
                    Blog yazısının məlumatlarını doldurun
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Başlıq (AZ)</Label>
                      <Input
                        value={formData.title_az}
                        onChange={(e) => handleTitleChange(e.target.value, 'az')}
                        required
                      />
                    </div>
                    <div>
                      <Label>Slug (URL)</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Başlıq (RU)</Label>
                      <Input
                        value={formData.title_ru}
                        onChange={(e) => handleTitleChange(e.target.value, 'ru')}
                      />
                    </div>
                    <div>
                      <Label>Başlıq (EN)</Label>
                      <Input
                        value={formData.title_en}
                        onChange={(e) => handleTitleChange(e.target.value, 'en')}
                      />
                    </div>
                    <div>
                      <Label>Başlıq (AR)</Label>
                      <Input
                        value={formData.title_ar}
                        onChange={(e) => handleTitleChange(e.target.value, 'ar')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Məzmun (AZ) *</Label>
                    <Textarea
                      value={formData.content_az}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_az: e.target.value }))}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Məzmun (RU)</Label>
                      <Textarea
                        value={formData.content_ru}
                        onChange={(e) => setFormData(prev => ({ ...prev, content_ru: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Məzmun (EN)</Label>
                      <Textarea
                        value={formData.content_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Məzmun (AR)</Label>
                      <Textarea
                        value={formData.content_ar}
                        onChange={(e) => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Şəkil URL</Label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="published">Dərc et</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Ləğv et
                    </Button>
                    <Button type="submit">
                      {editingPost ? 'Yenilə' : 'Yarat'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Yazılarda axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yüklənir...</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlıq</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Müəllif</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead className="text-right">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title_az}</TableCell>
                    <TableCell className="text-muted-foreground">{post.slug}</TableCell>
                    <TableCell>{post.author || 'Admin'}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <span className="text-green-600 flex items-center">
                          <Eye className="w-4 h-4 mr-1" /> Dərc olunub
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center">
                          <EyeOff className="w-4 h-4 mr-1" /> Qaralama
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString('az-AZ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Hələ yazı yoxdur</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBlog;

