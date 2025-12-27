import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Video,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  customer_location?: string | null;
  rating: number;
  title_az: string;
  title_ru?: string | null;
  title_en?: string | null;
  title_ar?: string | null;
  content_az: string;
  content_ru?: string | null;
  content_en?: string | null;
  content_ar?: string | null;
  review_type: 'text' | 'video';
  video_url?: string | null;
  verified: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminReviews = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await api.reviews.getAll();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Rəyləri yükləməkdə xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu rəyi silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.reviews.delete(id);
      toast.success('Rəy silindi');
      await loadReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      const errorMessage = error?.message || error?.error || 'Rəyi silməkdə xəta baş verdi';
      toast.error(errorMessage);
    }
  };

  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return reviews;
    }
    return reviews.filter(review => {
      const fields = [
        review.customer_name,
        review.customer_location ?? '',
        review.title_az,
        review.title_en ?? '',
        review.title_ru ?? '',
      ];
      return fields.some(field => field.toLowerCase().includes(term));
    });
  }, [reviews, searchTerm]);

  const formatDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString();
  };

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
                <h1 className="text-2xl font-bold">Müştəri Rəyləri</h1>
                <p className="text-muted-foreground">Saytda göstərilən rəyləri idarə edin</p>
              </div>
            </div>
            <Button onClick={() => navigate('/admin/reviews/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Rəy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rəylərdə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yüklənir...</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Müştəri</TableHead>
                    <TableHead>Məzmun</TableHead>
                    <TableHead>Bal</TableHead>
                    <TableHead>Növ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tarix</TableHead>
                    <TableHead className="text-right">Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="font-semibold">{review.customer_name}</div>
                        {review.customer_location && (
                          <div className="text-xs text-muted-foreground">{review.customer_location}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{review.content_az?.slice(0, 120) || '—'}{review.content_az && review.content_az.length > 120 ? '…' : ''}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          {review.review_type === 'video' ? (
                            <>
                              <Video className="w-4 h-4 text-blue-500" />
                              <span>Video</span>
                            </>
                          ) : (
                            <span>Mətn</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {review.featured && <Badge variant="secondary">Seçilmiş</Badge>}
                          {review.verified && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Təsdiqlənmiş
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/admin/reviews/${review.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Heç bir rəy tapılmadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminReviews;
