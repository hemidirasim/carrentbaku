import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { useNavigate } from 'react-router-dom';
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

  const handleEdit = (post: BlogPost) => {
    navigate(`/admin/blog/${post.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu yazını silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.blog.delete(id);
      toast.success('Yazı silindi');
      await loadPosts();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      const errorMessage = error?.message || error?.error || 'Yazını silməkdə xəta baş verdi';
      toast.error(errorMessage);
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
            <Button onClick={() => navigate('/admin/blog/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Yazı
            </Button>
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
